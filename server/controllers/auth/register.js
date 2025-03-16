const User = require("../../models/User");
const Customer = require("../../models/Customer");
const bcrypt = require("bcryptjs");
const axios = require("axios");
const FormData= require("form-data")
const register = async (req, res) => {
  const { fullName, email, password, phoneNumber } = req.body;
  console.log(req.files)
  const face_img= req.files.face_img[0];
  if(!face_img){
    return res.status(400).json({ message: "Face image is required" });
  }
  const audio = req.files.audio[0];
  console.log(audio)
  if(!audio){
    return res.status(400).json({ message: "Audio data is required" });
  }
  if (!fullName || !password || !phoneNumber || !face_img) {
    return res.status(400).json({ message: "All fields are required" });
  }
  if (await User.findOne({ where: { email } })) {
    return res
      .status(400)
      .json({ message: "User with this email already exists" });
  }
  if (await User.findOne({ where: { phoneNumber } })) {
    return res
      .status(400)
      .json({ message: "User with this phone number already exists" });
  }

  try {
    const formData= new FormData();
    formData.append("image", face_img.buffer, {
      filename: face_img.originalname,
      contentType: face_img.mimetype
    })
    const face_data= await axios.post("http://localhost:8000/get_face_embedding", formData,{
      headers: { "Content-Type": "multipart/form-data" }
    })
    if(face_data.data.error){
      return res.status(400).json({ message: face_data.data.error });
    }
    const formDataAudio = new FormData();
    formDataAudio.append("audio", audio.buffer, {
      filename: audio.originalname,
      contentType: audio.mimetype
    })
    const audio_data= await axios.post("http://localhost:8000/get_voice_embedding", formDataAudio,{
      headers: { "Content-Type": "multipart/form-data" }
    })
    if(audio_data.data.error){
      return res.status(400).json({ message: audio_data.data.error });
    }
    //all checks done
    const passwordHash = await bcrypt.hash(password, 10);
    const user = await User.create({
      fullName,
      email,
      password: passwordHash,
      phoneNumber,
      face_data: face_data.data.embedding,
      role: "customer",
    });
    await Customer.create({
      userID: user.userID,
      audio_data: audio_data.data.embedding
    });
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
module.exports = register;
