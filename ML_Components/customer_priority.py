import numpy as np
import pandas as pd
from sklearn.preprocessing import MinMaxScaler, StandardScaler
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_squared_error, r2_score, mean_absolute_error
import xgboost as xgb
import logging
import pickle

class CustomerPriorityScorer:
    def _init_(self, config):
        self.config = config
        self.model = None
        self.scaler = None
        self.feature_scaler = None
        self.feature_importance = None

    def preprocess_data(self, df):
        df['Priority Score'] = df['Credit Score'] * 0.3 + df['Total Assets'] * 0.2
        X = df[['Credit Score', 'Total Assets']]
        self.feature_scaler = StandardScaler()
        X_scaled = self.feature_scaler.fit_transform(X)
        return X_scaled, df['Priority Score']