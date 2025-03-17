"""
final_query_categorisation.py

This module handles query categorization for both text and file-based inputs.
It uses a pickled model so that training is done only once.
"""

import os
import re
import string
import pickle
import pandas as pd
from fastapi import UploadFile
from sklearn.preprocessing import LabelEncoder
from sklearn.pipeline import Pipeline
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.naive_bayes import MultinomialNB
import transcription  # Import transcription module for file processing

MODEL_FILE_PATH = "categorization_model.pkl"

def preprocess_text(text: str) -> str:
    """
    Preprocesses text by lowercasing, removing digits, punctuation, and extra spaces.
    """
    text = text.lower()
    text = re.sub(r'\d+', '', text)
    text = text.translate(str.maketrans("", "", string.punctuation))
    text = re.sub(r'\s+', ' ', text).strip()
    return text

def train_categorization_model():
    """
    Trains the categorization model and returns the trained pipeline and label encoder.
    """
    # For demonstration, using a few sample queries.
    # Replace these lists with your full training data as needed.
    loan_queries_all = [
        "What is the interest rate on home loans?",
        "I need a car loan. What are the eligibility criteria?"
    ]
    deposit_queries_all = [
        "What is the tenure of a fixed deposit?"
    ]
    operations_queries_all = [
        "How to get a new cheque book issued?"
    ]
    grievance_queries_all = [
        "I suspect fraudulent transactions in my account."
    ]
    training_data = (
        [(q, "Loan Services Department") for q in loan_queries_all] +
        [(q, "Deposit & Account Services Department") for q in deposit_queries_all] +
        [(q, "Operations & Service Requests Department") for q in operations_queries_all] +
        [(q, "Customer Grievance & Fraud Resolution Department") for q in grievance_queries_all]
    )
    
    df = pd.DataFrame(training_data, columns=["Query", "Category"])
    df["Query"] = df["Query"].apply(preprocess_text)
    
    label_encoder = LabelEncoder()
    df["Category"] = label_encoder.fit_transform(df["Category"])
    
    pipeline = Pipeline([
        ("vectorizer", TfidfVectorizer()),
        ("classifier", MultinomialNB(alpha=0.1))
    ])
    pipeline.fit(df["Query"], df["Category"])
    
    return pipeline, label_encoder

def load_or_train_model():
    """
    Loads the pretrained categorization model from file if available.
    Otherwise, trains the model, pickles it, and returns it.
    """
    if os.path.exists(MODEL_FILE_PATH):
        with open(MODEL_FILE_PATH, "rb") as f:
            model_data = pickle.load(f)
        return model_data["pipeline"], model_data["label_encoder"]
    else:
        pipeline, label_encoder = train_categorization_model()
        with open(MODEL_FILE_PATH, "wb") as f:
            pickle.dump({"pipeline": pipeline, "label_encoder": label_encoder}, f)
        return pipeline, label_encoder

# Load the model once using pickle
PIPELINE, LABEL_ENCODER = load_or_train_model()

def classify_text_query(text_query: str):
    """
    Classifies a text query into a department.
    """
    processed_query = preprocess_text(text_query)
    category_index = PIPELINE.predict([processed_query])[0]
    return LABEL_ENCODER.inverse_transform([category_index])[0]

def process_text_query(text: str):
    """
    Processes a direct text query.
    """
    if not text.strip():
        return {"error": "Empty text query provided."}
    
    department = classify_text_query(text)
    return {
        "transcribed_text": text,
        "department": department,
        "message": "Text query processed successfully."
    }

def process_file_query(file: UploadFile):
    """
    Processes an uploaded file (audio/video) for transcription and classification.
    """
    file_content = file.file.read()
    file.file.seek(0)  # Reset file pointer
    file_ext = os.path.splitext(file.filename)[-1]  # Extract file extension
    
    if not file_content:
        return {"error": "Empty file received. Please provide a valid file."}
    
    transcribed_text = transcription.process_file(file_content, file_ext)
    if not transcribed_text:
        return {
            "transcribed_text": None,
            "department": None,
            "message": "Could not process file input."
        }
    
    department = classify_text_query(transcribed_text)
    return {
        "transcribed_text": transcribed_text,
        "department": department,
        "message": "File query processed successfully."
    }

if __name__ == "__main__":
    text_query = "Can you help me apply for a personal loan?"
    print("Text Query Result:", process_text_query(text_query))
