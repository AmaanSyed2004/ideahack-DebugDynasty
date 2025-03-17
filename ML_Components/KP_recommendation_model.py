import numpy as np
import pandas as pd
import tensorflow as tf
from tensorflow.keras.models import Model
from tensorflow.keras.layers import Input, Dense, Embedding, LSTM, Concatenate
from sklearn.preprocessing import StandardScaler, LabelEncoder
from sklearn.model_selection import train_test_split
from transformers import TFAutoModel, AutoTokenizer

# Load pre-trained Transformer model for NLP processing
bert_model = TFAutoModel.from_pretrained("bert-base-uncased")
tokenizer = AutoTokenizer.from_pretrained("bert-base-uncased")

def preprocess_query(queries):
    """Tokenizes and processes previous queries"""
    tokens = tokenizer(queries, padding=True, truncation=True, return_tensors="tf")
    embeddings = bert_model(tokens.input_ids)[0][:, 0, :]
    return embeddings

# Simulated customer financial data
data = pd.DataFrame({
    "userID": [f"user_{i}" for i in range(1000)],
    "audio_data": [np.random.rand(128).tolist() for _ in range(1000)],  # Simulated embeddings
    "total_assets": np.random.randint(10000, 500000, 1000),
    "credit_score": np.random.randint(300, 850, 1000),
    "active_loans": np.random.randint(0, 5, 1000),
    "total_loan_amount": np.random.randint(1000, 500000, 1000),
    "missed_payments": np.random.randint(0, 10, 1000),
    "net_monthly_income": np.random.randint(20000, 200000, 1000),
    "account_age_years": np.random.randint(1, 30, 1000),
    "monthly_transactions": np.random.randint(10, 500, 1000),
    "high_value_transactions": np.random.randint(0, 50, 1000),
    "previous_query": ["best loan options" for _ in range(1000)],
    "recommended_product": np.random.choice(["Loan", "Savings Account", "Credit Card"], 1000)
})

# Encode categorical labels
label_encoder = LabelEncoder()
data["recommended_product"] = label_encoder.fit_transform(data["recommended_product"])

# Scale numerical features
scaler = StandardScaler()
numeric_features = scaler.fit_transform(data[["total_assets", "credit_score", "active_loans", "total_loan_amount", 
                                               "missed_payments", "net_monthly_income", "account_age_years", 
                                               "monthly_transactions", "high_value_transactions"]])
query_embeddings = preprocess_query(data["previous_query"].tolist())

# Train-test split
X = np.hstack((numeric_features, query_embeddings.numpy()))
y = data["recommended_product"].values
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Define the hybrid model
input_layer = Input(shape=(X_train.shape[1],))
hidden1 = Dense(128, activation='relu')(input_layer)
hidden2 = Dense(64, activation='relu')(hidden1)
output_layer = Dense(len(label_encoder.classes_), activation='softmax')(hidden2)

model = Model(inputs=input_layer, outputs=output_layer)
model.compile(optimizer='adam', loss='sparse_categorical_crossentropy', metrics=['accuracy'])

# Train the model
model.fit(X_train, y_train, validation_data=(X_test, y_test), epochs=10, batch_size=32)

# Function to make personalized recommendations
def recommend(user_data):
    user_features = np.array([[
        user_data["total_assets"], user_data["credit_score"], user_data["active_loans"],
        user_data["total_loan_amount"], user_data["missed_payments"], user_data["net_monthly_income"],
        user_data["account_age_years"], user_data["monthly_transactions"], user_data["high_value_transactions"]
    ]])
    user_features_scaled = scaler.transform(user_features)
    query_emb = preprocess_query([user_data["previous_query"]]).numpy()
    input_data = np.hstack((user_features_scaled, query_emb))
    pred = model.predict(input_data)
    return label_encoder.inverse_transform([np.argmax(pred)])[0]

# Example Usage
sample_user = {
    "total_assets": 200000,
    "credit_score": 720,
    "active_loans": 2,
    "total_loan_amount": 100000,
    "missed_payments": 1,
    "net_monthly_income": 60000,
    "account_age_years": 5,
    "monthly_transactions": 100,
    "high_value_transactions": 10,
    "previous_query": "investment options"
}

print(recommend(sample_user))
