const User = require("../../models/User");
const Customer = require("../../models/Customer");
const bcrypt = require("bcryptjs");
const register = async (req, res) => {
  const { fullName, email, password, phoneNumber, face_data } = req.body;
  if (!fullName || !email || !password || !phoneNumber || !face_data) {
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
    const passwordHash = await bcrypt.hash(password, 10);
    const user = await User.create({
      fullName,
      email,
      password: passwordHash,
      phoneNumber,
      face_data,
      role: "customer",
    });
    await Customer.create({
      userID: user.userID,
    });
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
module.exports = register;
