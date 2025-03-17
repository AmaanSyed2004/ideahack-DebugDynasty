const User = require("../../../models/User");
const Worker = require("../../../models/Worker");
const Department= require("../../../models/Department");
const bcrypt = require("bcryptjs");
const axios = require("axios");
const FormData= require("form-data")
const register = async (req, res) => {
  const { fullName, email, password, phoneNumber, department } = req.body;

  const face_img= req.file;
  if(!face_img){
    return res.status(400).json({ message: "Face image is required" });
  }

  if (!fullName || !password || !phoneNumber || !face_img || !department) {
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
  //check department, it exists, get the ID, return error if not
  const dept= await Department.findOne({ where: { departmentName: department } });
  if(!dept){
    return res.status(400).json({ message: "Department does not exist" });
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
    
    //all checks done
    const passwordHash = await bcrypt.hash(password, 10);
    const user = await User.create({
      fullName,
      email,
      password: passwordHash,
      phoneNumber,
      face_data: face_data.data.embedding,
      role: "worker",
    });
    await Worker.create({
      userID: user.userID,
      departmentID: dept.departmentID
    })
    res.status(201).json({ message: "Worker registered successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
module.exports = register;
