import numpy as np
import pandas as pd

class CustomerPriorityScorer:
    def __init__(self, config):
        self.config = config
        self.model = None  # This should be assigned a trained model externally.
        self.scaler = None  # This will be a MinMaxScaler for the adjusted priority score.
        self.feature_scaler = None  # This will be a StandardScaler for the feature matrix.
        self.feature_importance = None

    def calculate_priority_score(self, df: pd.DataFrame) -> pd.Series:
        # Import pandas locally just in case.
        import pandas as pd
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
        # Ensure any missing columns are added as zero.
        for col in weights:
            if col not in df.columns:
                df[col] = 0
        # Compute the weighted sum.
        return pd.DataFrame(df[weights.keys()]).mul(pd.Series(weights)).sum(axis=1)

    def preprocess_data(self, df: pd.DataFrame):
        import pandas as pd  # Ensure pandas is in local scope.
        from sklearn.preprocessing import MinMaxScaler, StandardScaler
        
        # Use default value for Sentiment Score if missing.
        if "Sentiment Score" not in df.columns:
            df["Sentiment Score"] = 50
        
        # Compute the adjusted priority score.
        df['Adjusted Priority Score'] = self.calculate_priority_score(df)
        
        # Use existing scaler if available, otherwise fit a new one.
        if self.scaler is None:
            self.scaler = MinMaxScaler(feature_range=(1, 100))
            df['Normalized Priority Score'] = self.scaler.fit_transform(
                df[['Adjusted Priority Score']].values
            ).round(2)
        else:
            df['Normalized Priority Score'] = self.scaler.transform(
                df[['Adjusted Priority Score']].values
            ).round(2)
        
        # Optional feature engineering.
        if 'Net Monthly Income' in df.columns:
            df['Assets_to_Income_Ratio'] = df['Total Assets'] / (df['Net Monthly Income'] + 1)
        else:
            df['Assets_to_Income_Ratio'] = 0
        
        if 'Monthly Transactions' in df.columns and 'High-Value Transactions' in df.columns:
            df['Transaction_Intensity'] = df['Monthly Transactions'] * df['High-Value Transactions']
        else:
            df['Transaction_Intensity'] = 0
        
        # Drop columns not used as features.
        drop_cols = ['Customer ID', 'Adjusted Priority Score', 'Normalized Priority Score', 'transcribed_text']
        X = df.drop(columns=[col for col in drop_cols if col in df.columns], errors='ignore')
        
        # Use existing feature scaler if available; otherwise, fit a new StandardScaler.
        if self.feature_scaler is None:
            self.feature_scaler = StandardScaler()
            X_scaled = pd.DataFrame(self.feature_scaler.fit_transform(X), columns=X.columns)
        else:
            X_scaled = pd.DataFrame(self.feature_scaler.transform(X), columns=X.columns)
        
        # 'y' is the normalized priority score (only used during training).
        y = df['Normalized Priority Score']
        return X_scaled, y

    def predict(self, data: dict) -> float:
        import pandas as pd  # Ensure pandas is in local scope.
        df = pd.DataFrame([data])
        X_scaled, _ = self.preprocess_data(df)
        if self.model is None:
            raise ValueError("The model has not been trained.")
        prediction = self.model.predict(X_scaled)[0]
        return float(prediction)


# TRAINING BLOCK: When run as a script, train a simple model and save the scorer.
if __name__ == "__main__":
    import sys
    # Add an alias so that when running as __main__, the module "priority_model" is available.
    sys.modules["priority_model"] = sys.modules["__main__"]
    
    from sklearn.linear_model import LinearRegression
    import dill

    # Dummy training data including all required features.
    data = {
        'Credit Score': [700, 650, 800, 600, 750],
        'Total Assets': [100000, 80000, 150000, 50000, 120000],
        'Net Monthly Income': [400, 350, 450, 300, 400],
        'Monthly Transactions': [80, 90, 100, 70, 85],
        'High-Value Transactions': [2, 1, 3, 1, 2],
        'Sentiment Score': [60, 55, 70, 50, 65],
        'Missed Payments': [0, 1, 0, 2, 1],
        'Fraud Risk': [0, 0, 1, 0, 0]
    }
    df = pd.DataFrame(data)
    
    scorer = CustomerPriorityScorer(config={"dummy": True})
    X_scaled, y = scorer.preprocess_data(df)
    
    # Train a simple linear regression model on the transformed features.
    model = LinearRegression()
    model.fit(X_scaled, y)
    scorer.model = model
    
    # Save the trained scorer to a file using dill.
    with open("customer_priority_model.pkl", "wb") as f:
        dill.dump(scorer, f)
    
    # Test prediction with a sample input.
    sample_data = {
        "Credit Score": 581,
        "Total Assets": 103,
        "Net Monthly Income": 449,
        "Monthly Transactions": 95,
        "High-Value Transactions": 1,
        "Sentiment Score": 32,
        "Missed Payments": 2,
        "Fraud Risk": 0
    }
    prediction = scorer.predict(sample_data)
    print("Predicted priority score:", prediction)
