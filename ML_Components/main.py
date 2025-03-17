import os
import transcription
from final_query_categorisation import process_file_query, process_text_query
from fastapi import FastAPI, File, UploadFile, Form
from fastapi.responses import JSONResponse
from typing import Annotated, Optional
import numpy as np
import json
import ast
from face_recognition import get_face_embedding, compare_face_and_embedding
from speech_recognition import get_voice_embedding, compare_voice_and_embedding
import logging
import pickle

app = FastAPI()
logging.basicConfig(level=logging.DEBUG)

@app.post("/get_face_embedding")
async def upload_image(image: Annotated[UploadFile, File(...)]):
    try:
        image_bytes = await image.read()
        np_arr = np.frombuffer(image_bytes, np.uint8)
        result = get_face_embedding(np_arr)
        return result
    except Exception as e:
        return {"error": f"Failed to process image: {str(e)}"}

@app.post("/verify_face")
async def compare_faces(image: Annotated[UploadFile, File(...)], embedding: Annotated[str, Form(...)]):
    try:
        image_bytes = await image.read()
        image_array = np.frombuffer(image_bytes, np.uint8)
        embedding_array = json.loads(embedding)
        result = compare_face_and_embedding(embedding=embedding_array, image_array=image_array)
        return result
    except Exception as e:
        return {"error": f"Failed to process image: {str(e)}"}

@app.post("/get_voice_embedding")
async def upload_audio(audio: Annotated[UploadFile, File(...)]):
    try:
        audio_bytes = await audio.read()
        result = get_voice_embedding(audio_bytes)
        return JSONResponse(content={"embedding": result.tolist()})
    except Exception as e:
        return {"error": f"Failed to process audio: {str(e)}"}
    
@app.post("/verify_voice")
async def compare_voices(audio: Annotated[UploadFile, File(...)], embedding: Annotated[str, Form(...)]):
    try:
        audio_bytes = await audio.read()
        embedding_array = np.array(ast.literal_eval(embedding))
        result = compare_voice_and_embedding(embedding=embedding_array, audio_file=audio_bytes)
        return result
    except Exception as e:
        return {"error": f"Failed to process audio: {str(e)}"}

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
