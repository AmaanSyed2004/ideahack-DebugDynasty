# we need add more keywords and specific department to classify the query into more specific department
# This is a simple rule-based classifier that classifies a query into one of the three categories: Loan, Deposit, or Operations.


import re

# Define keywords for each category in English, Hindi, and Marathi
loan_keywords = [
    "loan", "interest rate", "home loan", "personal loan", "car loan", "apply for loan", 
    "ऋण", "ब्याज दर", "गृह ऋण", "व्यक्तिगत ऋण", "कार ऋण", "ऋण के लिए आवेदन करें", 
    "कर्ज", "व्याज दर", "गृह कर्ज", "वैयक्तिक कर्ज", "गाडी कर्ज", "कर्जासाठी अर्ज करा"
]

deposit_keywords = [
    "deposit", "fixed deposit", "recurring deposit", "tenure", "maturity amount", "interest rate on deposit", 
    "जमा", "स्थिर जमा", "आवर्ती जमा", "अवधि", "परिपक्व राशि", "जमा पर ब्याज दर", 
    "ठेव", "स्थिर ठेव", "पुनरावृत्त ठेव", "मुदत", "परिपक्वता रक्कम", "ठेव व्याज दर"
]

operations_keywords = [
    "cheque book", "passbook", "transfer account", "account operations", "branch transfer", "fund transfer", "issue passbook", 
    "चेक बुक", "पासबुक", "खाता स्थानांतरण", "खाता संचालन", "शाखा स्थानांतरण", "धन हस्तांतरण", "पासबुक जारी करें", 
    "चेक पुस्तक", "खाते पुस्तिका", "खाते हस्तांतरण", "खाते कार्य", "शाखा बदल", "निधी हस्तांतरण", "पासबुक देणे"
]

def classify_query(query):
    """Classifies the given query into Loan, Deposit, or Operations based on keyword matching."""
    query_lower = query.lower()
    
    if any(keyword in query_lower for keyword in loan_keywords):
        return "Loan"
    elif any(keyword in query_lower for keyword in deposit_keywords):
        return "Deposit"
    elif any(keyword in query_lower for keyword in operations_keywords):
        return "Operations"
    else:
        return "Unknown"

# Example Usage:
example_query = "मुझे जमा पर ब्याज दर जानना है।"
category = classify_query(example_query)
print(f"Query: {example_query}\nClassified as: {category}")

# Another method to classify the query using Machine Learning pipelining

# import pandas as pd
# import re
# from sklearn.feature_extraction.text import TfidfVectorizer
# from sklearn.naive_bayes import MultinomialNB
# from sklearn.pipeline import Pipeline
# from sklearn.model_selection import train_test_split
# from sklearn.metrics import accuracy_score

# # Sample training data for Loan, Deposit, and Operations queries
# training_data = [
#     ("What is the interest rate on home loans?", "Loan"),
#     ("How can I apply for a personal loan?", "Loan"),
#     ("Tell me about car loan tenure", "Loan"),
#     ("What is the tenure of a fixed deposit?", "Deposit"),
#     ("What will be the maturity amount of my RD?", "Deposit"),
#     ("What is the interest rate on deposits?", "Deposit"),
#     ("How to get a new cheque book issued?", "Operations"),
#     ("I need to transfer my account to another branch", "Operations"),
#     ("How do I get a passbook issued?", "Operations"),
    
#     # Hindi Queries
#     ("गृह ऋण पर ब्याज दर क्या है?", "Loan"),
#     ("मैं व्यक्तिगत ऋण के लिए आवेदन कैसे करूं?", "Loan"),
#     ("कार ऋण की अवधि क्या है?", "Loan"),
#     ("नियत जमा की अवधि क्या है?", "Deposit"),
#     ("मेरे आवर्ती जमा की परिपक्व राशि कितनी होगी?", "Deposit"),
#     ("जमा पर ब्याज दर क्या है?", "Deposit"),
#     ("मुझे नई चेक बुक कैसे मिलेगी?", "Operations"),
#     ("मुझे अपनी शाखा स्थानांतरित करनी है", "Operations"),
#     ("पासबुक जारी करने की प्रक्रिया क्या है?", "Operations"),
    
#     # Marathi Queries
#     ("गृह कर्ज व्याज दर किती आहे?", "Loan"),
#     ("मी वैयक्तिक कर्जासाठी अर्ज कसा करू?", "Loan"),
#     ("गाडी कर्जाचा कालावधी किती आहे?", "Loan"),
#     ("स्थिर ठेवीची मुदत किती आहे?", "Deposit"),
#     ("माझ्या पुनरावृत्ती ठेविची परिपक्व रक्कम किती असेल?", "Deposit"),
#     ("ठेवींवर व्याज दर काय आहे?", "Deposit"),
#     ("मला नवीन चेक बुक कसे मिळेल?", "Operations"),
#     ("माझे खाते दुसऱ्या शाखेत हस्तांतरित करायचे आहे", "Operations"),
#     ("पासबुक जारी करण्याची प्रक्रिया काय आहे?", "Operations")
# ]

# # Convert data to DataFrame
# df = pd.DataFrame(training_data, columns=["Query", "Category"])

# # Splitting the data
# X_train, X_test, y_train, y_test = train_test_split(df["Query"], df["Category"], test_size=0.2, random_state=42)

# # Define a text classification pipeline
# pipeline = Pipeline([
#     ("vectorizer", TfidfVectorizer()),
#     ("classifier", MultinomialNB())
# ])

# # Train the model
# pipeline.fit(X_train, y_train)

# # Predict on test data
# y_pred = pipeline.predict(X_test)
# print("Model Accuracy:", accuracy_score(y_test, y_pred))

# # Function to classify queries using the trained model
# def classify_query_ml(query):
#     return pipeline.predict([query])[0]

# # Example usage
# example_query = "मुझे जमा पर ब्याज दर जानना है।"
# category = classify_query_ml(example_query)
# print(f"Query: {example_query}\nClassified as: {category}")
