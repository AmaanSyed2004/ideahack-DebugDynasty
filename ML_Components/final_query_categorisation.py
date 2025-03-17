"""
final_query_categorisation.py

This module handles query categorization for both text and file-based inputs.
It uses a pickled model so that training is done only once.
Additionally, it ensures the final text is translated and grammar-corrected to produce polished English.
"""

#pip install googletrans==4.0.0rc1 language-tool-python
#pip install openai-whisper torch pydub moviepy googletrans==4.0.0rc1 language-tool-python
#ye dono kro vm mai

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
from googletrans import Translator
import language_tool_python

# Initialize translator and grammar tool
translator = Translator()
tool = language_tool_python.LanguageTool('en-US')

MODEL_FILE_PATH = "categorization_model.pkl"

def refine_hinglish(text: str) -> str:
    """
    Applies custom replacements to handle common Hinglish phrases.
    Extend this dictionary as needed.
    """
    hinglish_map = {
        "cheque fraud hua hai": "There has been cheque fraud",
        "loan reject hua": "The loan was rejected",
        "account me unauthorized login aaya": "There was an unauthorized login in the account",
        "mujhe loan lena hai": "I want to apply for a loan",
        "credit score kam hai": "The credit score is low",
        # Add more mappings as needed.
    }
    lower_text = text.lower()
    for phrase, replacement in hinglish_map.items():
        if phrase in lower_text:
            lower_text = lower_text.replace(phrase, replacement)
    return lower_text

def correct_english(text: str) -> str:
    """
    Uses language_tool_python to correct grammar and produce polished English.
    """
    matches = tool.check(text)
    corrected = language_tool_python.utils.correct(text, matches)
    return corrected

def translate_to_english(text: str) -> str:
    """
    First refines common Hinglish phrases, then translates the text to English.
    Finally, applies grammar correction so that the result is polished English.
    """
    refined_text = refine_hinglish(text)
    try:
        result = translator.translate(refined_text, dest='en')
        translated_text = result.text
    except Exception as e:
        translated_text = refined_text
    # Apply grammar correction regardless of source language
    final_text = correct_english(translated_text)
    return final_text

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
    The training data includes at least 40 sample queries for each department.
    """
    # -------------------- Loan Services Department (40 queries) --------------------
    loan_queries_all = [
        "What is the interest rate on home loans?",
        "How can I apply for a personal loan?",
        "I need a car loan. What are the eligibility criteria?",
        "Can you provide details for a home loan application?",
        "What is the processing fee for a business loan?",
        "Are there any low interest student loans available?",
        "What documents do I need for a loan application?",
        "When will my loan application be processed?",
        "How long does it take to disburse a loan?",
        "What are the repayment options for home loans?",
        "How can I calculate the EMI for a car loan?",
        "What is the maximum loan amount available?",
        "Is there any prepayment penalty on my loan?",
        "How do I check the status of my loan application?",
        "Can I restructure my existing loan?",
        "What are the interest rates for personal loans?",
        "How do I apply for a home equity loan?",
        "Are there any special loan schemes for women?",
        "What are the requirements for a secured loan?",
        "What is the tenure for a car loan?",
        "How can I reduce the EMI on my loan?",
        "What are the charges for processing a loan?",
        "Is a co-applicant required for a loan application?",
        "How do I know if I qualify for a loan?",
        "What is the interest rate for a business loan?",
        "Are there flexible repayment options available?",
        "How do I switch my loan provider?",
        "What are the benefits of refinancing my loan?",
        "Can I get a loan against my property?",
        "How is the interest rate determined for a loan?",
        "What is the difference between fixed and variable interest loans?",
        "How long is the loan processing time?",
        "What is the eligibility criteria for a personal loan?",
        "Can I apply for a loan online?",
        "What is the required credit score for a loan?",
        "Are there any government-subsidized loan programs?",
        "How do I improve my chances of loan approval?",
        "What are the tax benefits of taking a home loan?",
        "What happens if I miss a loan repayment?",
        "Can I get a loan extension if I face financial difficulties?"
    ]
    
    # -------------- Deposit & Account Services Department (40 queries) --------------
    deposit_queries_all = [
        "What is the tenure of a fixed deposit?",
        "How can I open a new deposit account?",
        "What are the current interest rates on fixed deposits?",
        "How do I calculate the maturity amount for my deposit?",
        "What are the benefits of a recurring deposit?",
        "How can I convert my fixed deposit into a recurring deposit?",
        "What is the minimum deposit amount required?",
        "When does my deposit mature?",
        "Can I withdraw my fixed deposit before maturity?",
        "What is the penalty for premature withdrawal of a deposit?",
        "How do I check the balance of my deposit account?",
        "What documents are required to open a deposit account?",
        "Are there any special deposit schemes for senior citizens?",
        "How can I update my KYC details for my deposit account?",
        "What are the interest payout options for fixed deposits?",
        "How do I renew my fixed deposit account?",
        "Is there an online portal for managing my deposit account?",
        "What is the difference between a fixed deposit and a savings account?",
        "Can I link my deposit account to my mobile number?",
        "How do I transfer funds from my deposit account?",
        "What are the charges for managing a deposit account?",
        "How secure is my deposit account?",
        "What happens if my deposit account balance falls below the minimum requirement?",
        "Can I open a deposit account online?",
        "What is the maturity period for a recurring deposit?",
        "Are there any tax deductions on fixed deposit interest?",
        "How do I close my deposit account?",
        "What are the options for reinvesting the matured deposit amount?",
        "How can I get the latest deposit interest rates?",
        "Is there any fee for premature closure of a deposit account?",
        "What is the difference between a term deposit and a fixed deposit?",
        "How do I know if my deposit account is active?",
        "Can I operate my deposit account through online banking?",
        "What is the process for increasing my deposit amount?",
        "How are interest rates on deposits determined?",
        "What are the benefits of opening a deposit account with your bank?",
        "Can I have multiple deposit accounts in one bank?",
        "What is the procedure for linking a deposit account to my mobile wallet?",
        "How do I get notified when my deposit is about to mature?",
        "What are the common reasons for deposit account closure?"
    ]
    
    # -------- Operations & Service Requests Department (40 queries) --------
    operations_queries_all = [
        "How do I request a new cheque book?",
        "I need to transfer my account to another branch.",
        "How can I get a duplicate passbook?",
        "Please assist me in updating my account details.",
        "What is the procedure for account maintenance?",
        "How do I change my registered mobile number on my account?",
        "What is the process for issuing a duplicate cheque book?",
        "How can I update my email address in my account records?",
        "I need to stop a cheque payment immediately.",
        "How do I request a stop payment on my cheque?",
        "Can you guide me to link my account with another bank?",
        "How do I resolve a discrepancy in my account details?",
        "I want to update my account address.",
        "How do I activate my net banking services?",
        "What is the procedure to register for SMS alerts?",
        "How can I update my KYC details for my account?",
        "What documents are needed for account transfer?",
        "How do I request a new ATM card?",
        "I need to change my account password.",
        "How do I set up online banking for my account?",
        "Can I schedule a visit to update my account details?",
        "What is the process for linking my mobile number to my account?",
        "How do I report an error in my account statement?",
        "How can I update my personal information in my account?",
        "What are the steps to register for e-statements?",
        "How do I activate my debit card?",
        "What is the procedure to block a lost debit card?",
        "How do I request a new PIN for my card?",
        "How can I update my contact information in my account?",
        "What is the process for account reactivation?",
        "How do I change the settings on my online banking profile?",
        "Can I update my account information through the mobile app?",
        "How do I request an account statement for a specific period?",
        "What are the charges for account maintenance?",
        "How can I resolve issues with my online account access?",
        "What is the process for deactivating my account?",
        "How do I update my signature on file?",
        "Can I link my account to a third-party payment service?",
        "How do I obtain a detailed breakdown of my account transactions?",
        "What should I do if I notice a discrepancy in my account?"
    ]
    
    # ----- Customer Grievance & Fraud Resolution Department (40 queries) -----
    grievance_queries_all = [
        "I suspect fraudulent transactions in my account.",
        "There are unauthorized charges on my credit card.",
        "My debit card was used fraudulently.",
        "I noticed suspicious activity in my transaction history.",
        "Please block my account due to fraudulent transactions.",
        "I need to report a potential fraud case.",
        "Why were my funds debited without authorization?",
        "I want to lodge a complaint about a phishing attempt.",
        "There is an error in my bank statement; please investigate.",
        "I want to file a dispute for a transaction on my account.",
        "My account shows charges that I did not authorize.",
        "Please initiate a chargeback for the unauthorized transaction.",
        "I have been a victim of identity theft.",
        "Help me report suspicious online banking activity.",
        "I want to report a compromised account.",
        "Unauthorized transactions are affecting my balance.",
        "I need to speak to someone about fraudulent charges.",
        "My account was hacked and used for transactions.",
        "I did not authorize this transaction on my account.",
        "How do I report a security breach in my account?",
        "My card details were compromised and used fraudulently.",
        "I see multiple unrecognized transactions on my statement.",
        "There is unusual activity on my account, please investigate.",
        "I suspect my account has been targeted by fraud.",
        "Help, my account has been accessed without permission.",
        "I want to file a complaint regarding suspicious transactions.",
        "There is a discrepancy in my account due to unauthorized charges.",
        "I need to dispute a charge that I did not make.",
        "My account was charged for a service I did not use.",
        "I believe there has been fraud on my credit card.",
        "How can I get assistance with a fraudulent transaction?",
        "Please block my card immediately due to suspicious activity.",
        "I want to report that my account has been compromised.",
        "There are several unapproved transactions in my account.",
        "I need urgent help with fraudulent activity in my account.",
        "My account security has been breached.",
        "What should I do if I suspect fraud in my account?",
        "I want to speak with a fraud resolution specialist.",
        "Unauthorized withdrawal from my account, please investigate.",
        "I have evidence of fraudulent activity and need assistance."
    ]
    
    # Combine training data from all departments
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
    Processes a direct text query by translating it fully to polished English,
    classifying it, and returning the final English text.
    """
    if not text.strip():
        return {"error": "Empty text query provided."}
    
    english_text = translate_to_english(text)
    department = classify_text_query(english_text)
    return {
        "transcribed_text": english_text,
        "department": department,
        "message": "Text query processed successfully."
    }

def process_file_query(file: UploadFile):
    """
    Processes an uploaded file (audio/video) for transcription, translation, and classification.
    """
    file_content = file.file.read()
    file.file.seek(0)  # Reset file pointer
    
    if not file_content:
        return {"error": "Empty file received. Please provide a valid file."}
    
    transcribed_text = transcription.process_file(file_content, os.path.splitext(file.filename)[-1])
    if not transcribed_text:
        return {
            "transcribed_text": None,
            "department": None,
            "message": "Could not process file input."
        }
    
    english_text = translate_to_english(transcribed_text)
    department = classify_text_query(english_text)
    return {
        "transcribed_text": english_text,
        "department": department,
        "message": "File query processed successfully."
    }

if __name__ == "__main__":
    # Test with a sample Hinglish query.
    text_query = "cheque fraud hua hai"
    print("Text Query Result:", process_text_query(text_query))
