import numpy as np
import pandas as pd
from sklearn.preprocessing import MinMaxScaler, StandardScaler
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_squared_error, r2_score, mean_absolute_error
import xgboost as xgb
import logging
import time
from typing import Tuple, Dict, Any
import warnings
from pathlib import Path
from io import BytesIO
import pickle

# Import sentiment analysis function
from sentiment_classification import get_sentiment_score

# Enable experimental halving search functionality in scikit-learn
from sklearn.experimental import enable_halving_search_cv  # noqa
from sklearn.model_selection import HalvingGridSearchCV

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)

MODEL_FILE_PATH = "customer_priority_model.pkl"

class CustomerPriorityScorer:
    """A class to handle customer priority scoring and modeling"""

    def __init__(self, config: Dict[str, Any]):
        """
        Initialize the scorer with configuration parameters

        Args:
            config: Dictionary containing configuration parameters
        """
        self.config = config
        self.model = None
        self.scaler = None
        self.feature_scaler = None
        self.feature_importance = None

    @staticmethod
    def calculate_priority_score(df: pd.DataFrame) -> pd.Series:
        """
        Calculate priority scores using vectorized operations

        Args:
            df: Input DataFrame containing customer features

        Returns:
            Series containing calculated priority scores
        """
        weights = {
            'Credit Score': 0.3,
            'Total Assets': 0.2,
            'Net Monthly Income': 0.1,
            'Monthly Transactions': 0.05,
            'High-Value Transactions': 0.05,
            'Sentiment Score': 0.05,  # The newly integrated sentiment score
            'Missed Payments': -2,
            'Fraud Risk': -2
        }
        return pd.DataFrame(df[weights.keys()]).mul(pd.Series(weights)).sum(axis=1)

    def preprocess_data(self, df: pd.DataFrame) -> Tuple[pd.DataFrame, pd.Series]:
        """
        Preprocess the data including feature scaling and engineering

        Args:
            df: Raw input DataFrame

        Returns:
            Tuple of processed features and target variable
        """
        logging.info("Starting data preprocessing...")

        # Ensure transcribed_text exists before using sentiment analysis
        if "transcribed_text" in df.columns:
            df["Sentiment Score"] = df["transcribed_text"].apply(get_sentiment_score)
        else:
            df["Sentiment Score"] = 50  # Default neutral sentiment if missing

        # Calculate priority scores
        df['Adjusted Priority Score'] = self.calculate_priority_score(df)

        # Normalize priority scores
        self.scaler = MinMaxScaler(feature_range=(1, 100))
        df['Normalized Priority Score'] = self.scaler.fit_transform(
            df[['Adjusted Priority Score']].values
        ).round(2)

        # Feature engineering
        df['Assets_to_Income_Ratio'] = df['Total Assets'] / (df['Net Monthly Income'] + 1)
        df['Transaction_Intensity'] = df['Monthly Transactions'] * df['High-Value Transactions']

        # Prepare features and target
        X = df.drop(['Customer ID', 'Adjusted Priority Score', 'Normalized Priority Score', 'transcribed_text'], axis=1, errors='ignore')
        y = df['Normalized Priority Score']

        # Scale features
        self.feature_scaler = StandardScaler()
        X_scaled = pd.DataFrame(
            self.feature_scaler.fit_transform(X),
            columns=X.columns
        )

        logging.info("Data preprocessing completed")
        return X_scaled, y

    def train_model(self, X: pd.DataFrame, y: pd.Series) -> Dict[str, Any]:
        """
        Train the XGBoost model with hyperparameter tuning using HalvingGridSearchCV

        Args:
            X: Processed features
            y: Target variable

        Returns:
            Dictionary containing model and performance metrics
        """
        logging.info("Starting model training...")

        # Split data
        X_train, X_test, y_train, y_test = train_test_split(
            X, y, test_size=0.2, random_state=42
        )

        # Define parameter grid for tuning
        param_grid = {
            'n_estimators': [100, 200],
            'max_depth': [4, 6, 8],
            'learning_rate': [0.01, 0.1],
            'subsample': [0.8, 0.9]
        }

        # Initialize base model
        base_model = xgb.XGBRegressor(
            objective='reg:squarederror',
            random_state=42,
            n_jobs=-1
        )

        # Perform halving grid search
        halving_search = HalvingGridSearchCV(
            estimator=base_model,
            param_grid=param_grid,
            cv=5,
            scoring='neg_mean_squared_error',
            verbose=1,
            n_jobs=-1,   
            factor=3      
        )

        halving_search.fit(X_train, y_train)

        # Get best model
        self.model = halving_search.best_estimator_

        # Make predictions
        y_pred = self.model.predict(X_test)

        # Calculate metrics
        metrics = {
            'mse': mean_squared_error(y_test, y_pred),
            'rmse': np.sqrt(mean_squared_error(y_test, y_pred)),
            'r2': r2_score(y_test, y_pred),
            'mae': mean_absolute_error(y_test, y_pred),
            'best_params': halving_search.best_params_
        }

        # Store feature importance
        self.feature_importance = pd.DataFrame({
            'feature': X.columns,
            'importance': self.model.feature_importances_
        }).sort_values('importance', ascending=False)

        logging.info("Model training completed")
        return metrics

def run_priority_scoring(file_data: bytes, pretrained: bool = True) -> dict:
    """
    Run the customer priority scoring pipeline.

    Args:
        file_data: CSV file data as bytes.
        pretrained: If True, load model from disk if available.

    Returns:
        Dictionary containing predictions, execution time, and feature importance.
    """
    warnings.filterwarnings('ignore')
    start_time = time.time()
    df = pd.read_csv(BytesIO(file_data))

    # Ensure sentiment score is included
    if "transcribed_text" in df.columns:
        df["Sentiment Score"] = df["transcribed_text"].apply(get_sentiment_score)
    else:
        df["Sentiment Score"] = 50  # Default neutral sentiment

    # Configuration parameters
    config = {
        'random_state': 42,
        'test_size': 0.2,
        'cv_folds': 5
    }

    # Load pretrained model
    if pretrained and Path(MODEL_FILE_PATH).exists():
        logging.info("Loading pretrained model from file...")
        with open(MODEL_FILE_PATH, "rb") as f:
            scorer = pickle.load(f)

        # Preprocess the new data
        X, _ = scorer.preprocess_data(df)
        
        # Get predictions from the loaded model
        predictions = scorer.model.predict(X)
        execution_time = time.time() - start_time
        
        return {
            'predictions': predictions.tolist(),
            'execution_time': round(execution_time, 2),
            'feature_importance': scorer.feature_importance.to_dict(orient='records'),
            'message': "Model loaded from file and predictions computed."
        }

    # Train model if no pretrained model exists
    logging.info("No pretrained model found. Training model...")
    scorer = CustomerPriorityScorer(config)
    X, y = scorer.preprocess_data(df)
    metrics = scorer.train_model(X, y)
    execution_time = time.time() - start_time

    # Save trained model
    with open(MODEL_FILE_PATH, "wb") as f:
        pickle.dump(scorer, f)

    return {
        'metrics': metrics,
        'execution_time': round(execution_time, 2),
        'feature_importance': scorer.feature_importance.to_dict(orient='records')
    }

if __name__ == "__main__":
    file_path = Path("./synthetic_customer_data.csv")
    with open(file_path, "rb") as f:
        file_data = f.read()
    results = run_priority_scoring(file_data, pretrained=True)
    print(results)
