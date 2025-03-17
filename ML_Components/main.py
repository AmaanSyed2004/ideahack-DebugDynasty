import logging
import json
import numpy as np
from fastapi import FastAPI, File, UploadFile,Request, Form
from fastapi.responses import JSONResponse
from typing import Annotated
from face_recognition_new import get_arcface_embedding, compare_face_and_embedding
from speech_recognition import get_voice_embedding, compare_voice_and_embedding
from final_query_categorisation import process_file_query, process_text_query
import pickle


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
async def compare_faces(image: Annotated[UploadFile, File(...)], embedding: Annotated[str, Form(...)]):
    """
    Compares a new image with a stored face embedding.
    """
    try:
        image_bytes = await image.read()
        image_array = np.frombuffer(image_bytes, np.uint8)

        # Ensure embedding is a properly formatted JSON string
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
async def compare_voices(audio: Annotated[UploadFile, File(...)], embedding: Annotated[str, Form(...)]):
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



recommendation_model = "loan_rf_model.pkl"
with open(recommendation_model, "rb") as f:
    recommendation_model_data = pickle.load(f)

LOAN_MODEL = recommendation_model_data["model"]
LOAN_CLASSES = recommendation_model_data["classes"]

@app.post("/recommendation")
async def recommendation(request: Request, user_input: dict):
    """
    Accepts user input as JSON and returns the top 5 recommended loan types.
    """
    try:
        # Get JSON data from request
        data = await request.json()
        
        # Extract required fields (ensures only needed fields are used)
        required_fields = ["age", "total_assets", "credit_score", "net_monthly_income", "missed_payments"]
        features = np.array([data[field] for field in required_fields]).reshape(1, -1)

        # Predict loan category probabilities
        proba = LOAN_MODEL.predict_proba(features)[0]

        # Sort and get the top 5 recommended loans
        sorted_loans = sorted(zip(LOAN_CLASSES, proba), key=lambda x: x[1], reverse=True)
        top_3_loans = [loan[0] for loan in sorted_loans[:3]]

        return JSONResponse(content={"top_3_loans": top_3_loans})

    except Exception as e:
        return JSONResponse(content={"error": f"Failed to generate recommendation: {str(e)}"}, status_code=400)

    
