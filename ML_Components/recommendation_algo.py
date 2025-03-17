import pandas as pd
import numpy as np

# Set seed for reproducibility
np.random.seed(42)

# Number of samples to generate
n_samples = 1000

# Generate synthetic features
ages = np.random.randint(18, 70, n_samples)
total_assets = np.random.randint(1000, 1000000, n_samples)
credit_scores = np.random.randint(300, 850, n_samples)
net_monthly_income = np.random.randint(1000, 20000, n_samples)
missed_payments = np.random.randint(0, 5, n_samples)

# Define some loan categories
loan_categories = ["Home Loan", "Car Loan", "Personal Loan", "Education Loan", "Business Loan"]

# Randomly assign a loan category to each sample
loan_category = np.random.choice(loan_categories, n_samples)

# Create DataFrame
df = pd.DataFrame({
    "age": ages,
    "total_assets": total_assets,
    "credit_score": credit_scores,
    "net_monthly_income": net_monthly_income,
    "missed_payments": missed_payments,
    "loan_category": loan_category
})

# Save DataFrame to CSV
df.to_csv("synthetic_loan_data.csv", index=False)

import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
import pickle
import os

MODEL_FILE = "loan_rf_model.pkl"
DATA_FILE = "synthetic_loan_data.csv"

def load_or_train_loan_model():
    """
    Loads the pretrained RandomForest model from disk if available.
    Otherwise, trains the model using the synthetic dataset, saves it, and returns it.
    
    Returns:
        model: Trained RandomForestClassifier.
        classes: Array of model classes.
    """
    if os.path.exists(MODEL_FILE):
        with open(MODEL_FILE, "rb") as f:
            model_data = pickle.load(f)
        return model_data["model"], model_data["classes"]
    else:
        df = pd.read_csv(DATA_FILE)
        X = df[["age", "total_assets", "credit_score", "net_monthly_income", "missed_payments"]]
        y = df["loan_category"]
        X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
        clf = RandomForestClassifier(n_estimators=100, random_state=42)
        clf.fit(X_train, y_train)
        model_data = {"model": clf, "classes": clf.classes_}
        with open(MODEL_FILE, "wb") as f:
            pickle.dump(model_data, f)
        return clf, clf.classes_

# Load the pretrained model once at module load time
LOAN_MODEL, LOAN_CLASSES = load_or_train_loan_model()

def get_top_5_loans(row, model, classes):
    """
    Given a row of features, returns the top 5 loan recommendations as a comma-separated string.
    
    Args:
        row: A dictionary or pandas Series with keys 
             [age, total_assets, credit_score, net_monthly_income, missed_payments].
        model: Trained classifier with predict_proba.
        classes: Model classes (list of loan categories).
    
    Returns:
        A comma-separated string of the top 5 recommended loans.
    """
    # Reshape the features for prediction
    features = np.array([
        row["age"],
        row["total_assets"],
        row["credit_score"],
        row["net_monthly_income"],
        row["missed_payments"]
    ]).reshape(1, -1)
    
    # Get probability distribution over all classes
    proba = model.predict_proba(features)[0]
    
    # Pair each category with its probability and sort in descending order
    cats_probs = list(zip(classes, proba))
    cats_probs.sort(key=lambda x: x[1], reverse=True)
    
    # Take the top 5 categories and return as a comma-separated string
    top_5_cats = [cat for cat, prob in cats_probs[:3]]
    return ", ".join(top_5_cats)

def run_loan_recommendation(input_row: dict) -> dict:
    """
    End-to-end function to get the top 5 recommended loans for the given input row.
    
    Args:
        input_row: Dictionary with keys "age", "total_assets", "credit_score", "net_monthly_income", "missed_payments".
    
    Returns:
        Dictionary with key 'top_5_loans' whose value is a comma-separated string of recommendations.
    """
    top_5 = get_top_5_loans(input_row, LOAN_MODEL, LOAN_CLASSES)
    return {"top_5_loans": top_5}

# ---------------- Example Usage ---------------- #
if __name__ == "__main__":
    # Sample input row (replace with your own values)
    sample_row = {
        "age": 19,
        "total_assets": 200000,
        "credit_score": 620,
        "net_monthly_income": 25000,
        "missed_payments": 0
    }
    result = run_loan_recommendation(sample_row)
    print("Final Output:", result)