const express = require("express");
const router = express.Router();
const twilio = require("twilio");

// Load environment variables
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioPhone = process.env.TWILIO_PHONE_NUMBER; // Add your Twilio number to .env
const otpStore = {}; // Temporary in-memory storage (Use DB in production)

const client = twilio(accountSid, authToken);

// ✅ 1. Send OTP via SMS
router.post("/send-otp", async (req, res) => {
  try {
    const { phoneNumber } = req.body; // Example: "+911234567890"
    if (!phoneNumber) {
      return res.status(400).json({ success: false, message: "Phone number is required" });
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000);
    otpStore[phoneNumber] = otp; // Store OTP temporarily

    // Send SMS via Twilio
    const message = await client.messages.create({
      body: `Your Aadhaar Authentication OTP code is: ${otp}. It is valid for 10 minutes.`,
      from: twilioPhone, // Your Twilio number
      to: phoneNumber,
    });

    console.log(`✅ OTP ${otp} sent to ${phoneNumber}`);

    return res.json({ success: true, message: "OTP sent successfully", sid: message.sid });
  } catch (error) {
    console.error("❌ Error sending OTP:", error);
    return res.status(500).json({ success: false, message: "Failed to send OTP", error: error.message });
  }
});

// ✅ 2. Verify OTP
router.post("/verify-otp", async (req, res) => {
  try {
    const { phoneNumber, code } = req.body;
    if (!phoneNumber || !code) {
      return res.status(400).json({ success: false, message: "Phone number and OTP are required" });
    }

    // Check if OTP matches
    if (otpStore[phoneNumber] && otpStore[phoneNumber] == code) {
      delete otpStore[phoneNumber]; // Remove OTP after successful verification
      return res.json({ success: true, message: "OTP verified successfully" });
    } else {
      return res.status(400).json({ success: false, message: "Invalid OTP" });
    }
  } catch (error) {
    console.error("❌ Error verifying OTP:", error);
    return res.status(500).json({ success: false, message: "Failed to verify OTP" });
  }
});

module.exports = router;
