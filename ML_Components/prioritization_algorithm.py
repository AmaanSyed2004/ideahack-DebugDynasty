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

# Enable experimental halving search functionality in scikit-learn
from sklearn.experimental import enable_halving_search_cv  # noqa
from sklearn.model_selection import HalvingGridSearchCV

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)

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
            'Sentiment Score': 0.05,
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
        X = df.drop(['Customer ID', 'Adjusted Priority Score', 'Normalized Priority Score'], axis=1)
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

        # Perform halving grid search with parallel processing enabled
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

def run_priority_scoring(file_data: bytes) -> dict:
    """
    Run the customer priority scoring and model training.

    Args:
        file_data: CSV file data as bytes.

    Returns:
        Dictionary containing model performance metrics, execution time, and feature importance.
    """
    warnings.filterwarnings('ignore')
    start_time = time.time()

    # Configuration parameters
    config = {
        'random_state': 42,
        'test_size': 0.2,
        'cv_folds': 5
    }

    # Initialize scorer and read CSV from bytes
    scorer = CustomerPriorityScorer(config)
    df = pd.read_csv(BytesIO(file_data))

    # Process data and train the model
    X, y = scorer.preprocess_data(df)
    metrics = scorer.train_model(X, y)

    # Calculate total execution time
    execution_time = time.time() - start_time

    # Prepare the result dictionary
    results = {
        'metrics': metrics,
        'execution_time': round(execution_time, 2),
        'feature_importance': scorer.feature_importance.to_dict(orient='records')
    }
    return results

# For local testing purposes, this block can be removed when integrating with FastAPI.
if __name__ == "__main__":
    file_path = Path("./synthetic_customer_data.csv")
    with open(file_path, "rb") as f:
        file_data = f.read()
    results = run_priority_scoring(file_data)
    print(results)
