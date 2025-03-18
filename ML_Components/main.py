import logging
import json
import numpy as np
import pandas as pd
from fastapi import FastAPI, File, UploadFile, Request, Form
from fastapi.responses import JSONResponse
from typing import Annotated
from face_recognition_new import get_arcface_embedding, compare_face_and_embedding
from speech_recognition import get_voice_embedding, compare_voice_and_embedding
from final_query_categorisation import process_file_query, process_text_query
import pickle
import dill

# Import the class so that dill will find it upon unpickling.
from priority_model import CustomerPriorityScorer

app = FastAPI()
logging.basicConfig(level=logging.DEBUG)

@app.post("/get_face_embedding")
async def upload_image(image: Annotated[UploadFile, File(...)]):
    """
    Extracts a face embedding from an uploaded image.
    """
    try:
        image_bytes = await image.read()
        np_arr = np.frombuffer(image_bytes, np.uint8)
        result = get_arcface_embedding(np_arr)
        if isinstance(result, dict) and "error" in result:
            return JSONResponse(content=result, status_code=400)
        return JSONResponse(content={"embedding": result})
    except Exception as e:
        return JSONResponse(content={"error": f"Failed to process image: {str(e)}"}, status_code=400)

@app.post("/verify_face")
async def compare_faces(image: Annotated[UploadFile, File(...)],
                        embedding: Annotated[str, Form(...)]):
    """
    Compares a new image with a stored face embedding.
    """
    try:
        image_bytes = await image.read()
        image_array = np.frombuffer(image_bytes, np.uint8)
        try:
            embedding_array = json.loads(embedding)
            if not isinstance(embedding_array, list):
                return JSONResponse(content={"error": "Invalid embedding format. Expected a JSON list."}, status_code=400)
        except json.JSONDecodeError as e:
            return JSONResponse(content={"error": f"Invalid JSON format in embedding: {str(e)}"}, status_code=400)
        result = compare_face_and_embedding(embedding_array, image_array)
        return result
    except Exception as e:
        return JSONResponse(content={"error": f"Failed to process image: {str(e)}"}, status_code=400)

@app.post("/get_voice_embedding")
async def upload_audio(audio: Annotated[UploadFile, File(...)]):
    """
    Extracts a voice embedding from an uploaded audio file.
    """
    try:
        audio_bytes = await audio.read()
        result = get_voice_embedding(audio_bytes)
        return JSONResponse(content={"embedding": result.tolist()})
    except Exception as e:
        return JSONResponse(content={"error": f"Failed to process audio: {str(e)}"}, status_code=400)

@app.post("/verify_voice")
async def compare_voices(audio: Annotated[UploadFile, File(...)],
                         embedding: Annotated[str, Form(...)]):
    """
    Compares a voice recording with a stored voice embedding.
    """
    try:
        audio_bytes = await audio.read()
        embedding_array = np.array(json.loads(embedding))
        result = compare_voice_and_embedding(embedding=embedding_array, audio_file=audio_bytes)
        return JSONResponse(content=result)
    except Exception as e:
        return JSONResponse(content={"error": f"Failed to process audio: {str(e)}"}, status_code=400)

@app.post("/query/file")
async def query_file(file: UploadFile = File(...)):
    """
    Accepts an uploaded audio/video file and returns the transcribed text along with department classification.
    """
    return process_file_query(file)

@app.post("/query/text")
async def query_text_route(text: str = Form(...)):
    """
    Accepts a text string and processes it directly with the model.
    """
    return process_text_query(text)

# Recommendation endpoint using loan_rf_model.pkl
try:
    with open("loan_rf_model.pkl", "rb") as f:
        recommendation_model_data = pickle.load(f)
    LOAN_MODEL = recommendation_model_data["model"]
    LOAN_CLASSES = recommendation_model_data["classes"]
    logging.info("Loan recommendation model loaded successfully")
except Exception as e:
    logging.error("Failed to load loan recommendation model: %s", str(e))
    LOAN_MODEL = None
    LOAN_CLASSES = None

@app.post("/recommendation")
async def recommendation(request: Request):
    """
    Accepts user input as JSON and returns the top 3 recommended loan types.
    """
    try:
        if LOAN_MODEL is None:
            return JSONResponse(content={"error": "Loan recommendation model not loaded"}, status_code=500)
        data = await request.json()
        required_fields = ["age", "total_assets", "credit_score", "net_monthly_income", "missed_payments"]
        if not all(field in data for field in required_fields):
            return JSONResponse(content={"error": "Missing required fields for recommendation"}, status_code=400)
        features = np.array([data[field] for field in required_fields]).reshape(1, -1)
        proba = LOAN_MODEL.predict_proba(features)[0]
        sorted_loans = sorted(zip(LOAN_CLASSES, proba), key=lambda x: x[1], reverse=True)
        top_3_loans = [loan[0] for loan in sorted_loans[:3]]
        return JSONResponse(content={"top_3_loans": top_3_loans})
    except Exception as e:
        return JSONResponse(content={"error": f"Failed to generate recommendation: {str(e)}"}, status_code=400)

# Load the pre-trained customer priority scorer using dill.
try:
    with open("customer_priority_model.pkl", "rb") as f:
        priority_scorer = dill.load(f)
    logging.info("Customer priority scorer loaded successfully")
except Exception as e:
    logging.error("Failed to load customer priority scorer: %s", str(e))
    priority_scorer = None

@app.post("/prioritization")
async def prioritization(request: Request):
    """
    Accepts user input as JSON and returns a customer priority score.
    This endpoint requires the following fields:
      'Credit Score', 'Total Assets', 'Net Monthly Income', 'Monthly Transactions', 
      'High-Value Transactions', 'Sentiment Score', 'Missed Payments', 'Fraud Risk'
    """
    try:
        if priority_scorer is None or priority_scorer.model is None:
            return JSONResponse(content={"error": "Priority model not loaded or not trained"}, status_code=500)
        data = await request.json()
        required_fields = ['Credit Score', 'Total Assets', 'Net Monthly Income', 'Monthly Transactions',
                           'High-Value Transactions', 'Sentiment Score', 'Missed Payments', 'Fraud Risk']
        if not all(field in data for field in required_fields):
            return JSONResponse(content={"error": "Missing required fields. Required: " + ", ".join(required_fields)},
                                status_code=400)
        prediction = priority_scorer.predict(data)
        return JSONResponse(content={"priority_score": prediction})
    except Exception as e:
        return JSONResponse(content={"error": f"Failed to generate priority score: {str(e)}"}, status_code=400)
