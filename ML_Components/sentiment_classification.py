import os
import logging
import tempfile
from typing import Dict, Any, List
from os.path import splitext
from vaderSentiment.vaderSentiment import SentimentIntensityAnalyzer

from transcription import process_file

logging.basicConfig(level=logging.DEBUG, format="%(asctime)s - %(levelname)s - %(message)s")

# Initialize sentiment analyzer
sentiment_analyzer = SentimentIntensityAnalyzer()

def get_sentiment_score(text: str) -> int:
    """
    Returns a sentiment score scaled from 1 to 100.
    This score is used internally but is NOT displayed in the output.
    """
    sentiment = sentiment_analyzer.polarity_scores(text)
    compound_score = sentiment['compound']
    
    # Scale sentiment from [-1, 1] to [1, 100]
    scaled_score = int(((compound_score + 1) / 2) * 99 + 1)
    
    return scaled_score  # Not logged or displayed anywhere

def extend_keywords(base_keywords: List[str], extra_keywords: List[str]) -> List[str]:
    """
    Combine base and extra department-specific keywords, removing duplicates.
    """
    return list(set(base_keywords + extra_keywords))

# Define department keywords
DEPARTMENT_KEYWORDS = {
    "Loan Services Department": extend_keywords(
        ["loan", "mortgage", "financing", "refinance", "repayment", "credit"],
        ["lone", "loaning", "loans", "mortage"]
    ),
    "Deposit & Account Services Department": extend_keywords(
        ["account", "deposit", "savings", "checking", "current", "balance"],
        ["acct", "accnt", "dep", "deposits"]
    ),
    "Operations & Service Requests Department": extend_keywords(
        ["password", "login", "troubleshoot", "reset", "update", "profile"],
        ["passcode", "log in", "trouble shoot", "pwd reset"]
    ),
    "Customer Grievance & Fraud Resolution Department": extend_keywords(
        ["complaint", "grievance", "fraud", "dispute", "unauthorized"],
        ["complains", "grievances", "frauds", "disputes"]
    )
}

def classify_text(text: str) -> str:
    """
    Classifies input text into a department based on keyword occurrences.
    """
    text_lower = text.lower()
    department_counts = {department: sum(text_lower.count(keyword) for keyword in keywords)
                         for department, keywords in DEPARTMENT_KEYWORDS.items()}

    logging.debug(f"Keyword counts for classification: {department_counts}")
    
    best_match = max(department_counts, key=department_counts.get)
    logging.debug(f"Classified as: {best_match}")

    return best_match

def process_text_query(text: str) -> Dict[str, Any]:
    """
    Processes a text query by categorizing it into a department and calculating sentiment score.
    Sentiment score is NOT displayed in output but is available for use in other code.
    """
    try:
        logging.debug(f"Processing text query. Input text length: {len(text)}")
        department = classify_text(text)
        sentiment_score = get_sentiment_score(text)  # Calculated but NOT displayed or logged
        return {"transcribed_text": text, "department": department}
    except Exception as e:
        logging.error(f"Error in process_text_query: {e}", exc_info=True)
        return {"transcribed_text": text, "department": "Loan Services Department"}

def process_file_query(file) -> Dict[str, Any]:
    """
    Processes an audio/video file query by transcribing, categorizing, and analyzing sentiment.
    Sentiment score is NOT displayed in output but is available for use in other code.
    """
    try:
        logging.debug(f"Processing file query for file: {file.filename}")
        file_data = file.file.read()
        file_ext = splitext(file.filename)[1]
        
        transcript = process_file(file_data, file_ext) or ""
        
        department = classify_text(transcript)
        sentiment_score = get_sentiment_score(transcript)  # Calculated but NOT displayed or logged

        return {"transcribed_text": transcript, "department": department}
    except Exception as e:
        logging.error(f"Error in process_file_query: {e}", exc_info=True)
        return {"transcribed_text": "", "department": "Loan Services Department"}

if __name__ == "__main__":
    sample_text = (
        "Inquiry regarding refinancing options and interest details on a secured loan for commercial purposes. "
        "Also asking about loan eligibility and processing fees."
    )
    result = process_text_query(sample_text)
    logging.info(f"Text Query Result: {result}")
