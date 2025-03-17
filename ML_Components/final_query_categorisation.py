import os
import logging
import tempfile
from typing import Dict, Any, List
from os.path import splitext

from transcription import process_file

logging.basicConfig(level=logging.DEBUG, format="%(asctime)s - %(levelname)s - %(message)s")

def extend_keywords(base_keywords: List[str], extra_keywords: List[str]) -> List[str]:
    """
    Combine the base keywords with extra department-specific synonyms and common transcription errors.
    Remove duplicates.
    """
    combined = list(set(base_keywords + extra_keywords))
    return combined

# Base keywords for each department
base_loan_keywords = [
    "loan", "mortgage", "financing", "refinance", "repayment", "credit", "debt", "underwriting",
    "amortization", "subprime", "installment", "guarantor", "adjustable", "fixed rate", "interest",
    "vehicle", "commercial", "secured", "unsecured", "eligibility", "application", "terms", "processing",
    "approval", "collateral", "debt consolidation", "small business", "personal financing", "home mortgage",
    "student", "agricultural", "early repayment", "origination", "flexible payment",
    "risk assessment", "processing fee", "debt restructuring", "credit line", "promotional rate"
]

# Extra keywords (including common transcription errors/synonyms) for Loan Services Department
extra_loan_keywords = [
    "lone", "loaning", "loans", "mortage", "mortgages", "financing", "finance", "refinancing",
    "repayments", "creditt", "depts", "underwritng", "amortisaton", "subprime", "installments",
    "guarantors", "adjustable rate", "fixed-rate", "interst", "vehical", "commercial loan",
    "secured loan", "unsecured loan", "eligble", "loan application", "loan terms", "loan processing",
    "loan approval", "collateralized", "consolidation", "small biz loan", "personal loan", "home loan",
    "student loan", "agri loan", "early repay", "originate", "flex pay", "risk assess", "processing charge",
    "debt restructure", "creditline", "promo rate"
]

base_deposit_keywords = [
    "account", "deposit", "savings", "checking", "current", "balance", "transfer", "overdraft", "fixed deposit",
    "recurring deposit", "statement", "withdrawal", "activation", "verification", "maintenance", "online banking",
    "mobile banking", "fee", "interest", "bonus", "incentive", "digital", "profile", "recovery", "credential",
    "transaction", "security", "multi-currency", "electronic statement", "direct deposit", "wire", "cheque",
    "IBAN", "routing", "freeze", "closing", "upgrade", "dispute", "notification", "opening", "document", "KYC"
]

# Extra keywords for Deposit & Account Services Department
extra_deposit_keywords = [
    "acct", "accnt", "dep", "deposits", "savngs", "chkings", "currrent", "bal", "transferring", "over draft",
    "fix deposit", "recurring dep", "bank statement", "withdraw", "activation code", "verify", "maintainance",
    "onlne banking", "mob banking", "fees", "interst", "bonuses", "incentives", "digitial", "profle", "recover",
    "cred", "transact", "securty", "multi currency", "electronic stmt", "direct dep", "wiring", "checks", "IBAN#",
    "routing number", "freeze account", "close account", "account upgrade", "dispute case", "notify", "open acct",
    "documents", "know your customer"
]

base_operations_keywords = [
    "password", "login", "troubleshoot", "reset", "update", "profile", "technical", "service request",
    "connectivity", "maintenance", "integration", "error", "issue", "configuration", "escalation",
    "notification", "synchronization", "mobile app", "online", "server", "API", "performance", "diagnostics",
    "cache", "version", "upgrade", "system", "backup", "recovery", "verification", "two-factor", "authentication",
    "digital signature", "session", "timeout", "latency", "compatibility", "access", "ticket", "operational",
    "network", "interface", "health report"
]

# Extra keywords for Operations & Service Requests Department
extra_operations_keywords = [
    "passcode", "log in", "trouble shoot", "pwd reset", "updation", "profle", "tech support", "service req",
    "connectivity issue", "maintain", "integrate", "err", "issues", "config", "escalate", "notify",
    "sync", "mob app", "on-line", "servers", "application interface", "perform", "diagnose",
    "caching", "versions", "sys upgrade", "operatinal", "netwrk", "interfaces", "health rpt", "two factor",
    "auth", "digital sign", "sess", "time out", "latencies", "compat", "accessibility", "tickt"
]

base_grievance_keywords = [
    "complaint", "grievance", "fraud", "dispute", "unauthorized", "theft", "identity", "mishandling",
    "illegal", "breach", "redress", "investigation", "resolution", "escalate", "report", "chargeback",
    "billing", "suspicious", "alert", "fraudulent", "irregularity", "anomaly", "investigate", "audit",
    "remedy", "dissatisfaction", "review", "feedback", "customer service", "misconduct", "inconsistency",
    "unauthenticated", "data breach", "compensation", "legal", "regulation", "policy", "investigative", "redressal"
]

# Extra keywords for Customer Grievance & Fraud Resolution Department
extra_grievance_keywords = [
    "complains", "grievances", "frauds", "disputes", "unauthorised", "thft", "identty", "mishandle",
    "illicit", "breached", "remedy", "investigate", "resolving", "escalation", "reports", "charge back",
    "billings", "suspicous", "alerts", "fraudulant", "irregular", "anomalies", "auditing", "remedies",
    "dissatisfied", "revue", "feed back", "cust service", "misconducts", "inconsistent", "unauth", "data leak",
    "compensate", "legally", "regulate", "policies", "investigations", "redress"
]

# Merge base and extra keywords for each department
DEPARTMENT_KEYWORDS = {
    "Loan Services Department": extend_keywords(base_loan_keywords, extra_loan_keywords),
    "Deposit & Account Services Department": extend_keywords(base_deposit_keywords, extra_deposit_keywords),
    "Operations & Service Requests Department": extend_keywords(base_operations_keywords, extra_operations_keywords),
    "Customer Grievance & Fraud Resolution Department": extend_keywords(base_grievance_keywords, extra_grievance_keywords)
}

def classify_text(text: str) -> str:
    text_lower = text.lower()
    department_counts = {}
    
    for department, keywords in DEPARTMENT_KEYWORDS.items():
        count = 0
        for keyword in keywords:
            if keyword in text_lower:
                count += text_lower.count(keyword)
        department_counts[department] = count

    logging.debug(f"Keyword counts for classification: {department_counts}")

    # Always return the department with the highest count (even if counts are 0)
    best_match = max(department_counts, key=department_counts.get)
    logging.debug(f"Classified as: {best_match}")
    return best_match

def process_text_query(text: str) -> Dict[str, Any]:
    try:
        logging.debug(f"Processing text query. Input text length: {len(text)}")
        department = classify_text(text)
        return {"transcribed_text": text, "department": department}
    except Exception as e:
        logging.error(f"Error in process_text_query: {e}", exc_info=True)
        # Fallback to the best department even on error
        return {"transcribed_text": text, "department": "Loan Services Department"}

def process_file_query(file) -> Dict[str, Any]:
    try:
        logging.debug(f"Processing file query for file: {file.filename}")
        file_data = file.file.read()
        logging.debug(f"File size: {len(file_data)} bytes")
        file_ext = splitext(file.filename)[1]
        
        transcript = process_file(file_data, file_ext)
        if transcript is None:
            logging.warning("No transcript obtained; setting transcript as empty string.")
            transcript = ""
        else:
            logging.debug(f"Obtained transcript of length: {len(transcript)}")

        department = classify_text(transcript)
        return {"transcribed_text": transcript, "department": department}
    except Exception as e:
        logging.error(f"Error in process_file_query: {e}", exc_info=True)
        # Fallback to a default department on error
        return {"transcribed_text": "", "department": "Loan Services Department"}

if __name__ == "__main__":
    sample_text = (
        "Inquiry regarding refinancing options and interest details on a secured loan for commercial purposes. "
        "Also asking about loan eligibility and processing fees."
    )
    result = process_text_query(sample_text)
    logging.info(f"Text Query Result: {result}")
