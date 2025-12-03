const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const twilio = require("twilio");

// Generate 6-digit OTP
const generateOTP = () => Math.floor(100000 + Math.random() * 900000);

// Store OTPs temporarily in memory
const otpStore = {}; // { aadhar_no: { otp: 123456, expires: timestamp } }

// Twilio client
const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

// Login route: verify Aadhaar + password, send OTP
router.post("/login", async (req, res) => {
  const { aadhar_no, password } = req.body;
  const supabase = req.app.locals.supabase; // Use Supabase client

  if (!aadhar_no || !password) {
    return res.status(400).json({ error: "Aadhaar number and password are required" });
  }

  try {
    const { data, error } = await supabase
      .from("beneficiary")
      .select("*")
      .eq("aadhar_no", aadhar_no);

    if (error) return res.status(500).json({ error: error.message });
    if (!data || data.length === 0) return res.status(400).json({ error: "Invalid Aadhaar number" });

    const user = data[0];
    if (user.password !== password) return res.status(400).json({ error: "Incorrect password" });

    const otp = generateOTP();
    const expires = Date.now() + 5 * 60 * 1000;
    otpStore[aadhar_no] = { otp, expires };

    // Ensure phone number has +91
    const phoneNumber = user.phone_no.startsWith("+") ? user.phone_no : "+91" + user.phone_no;

    try {
      await client.messages.create({
        body: `Your OTP is ${otp}. It expires in 5 minutes.`,
        from: process.env.TWILIO_PHONE_NUMBER,
        to: phoneNumber
      });
    } catch (smsError) {
      return res.status(500).json({ error: "Failed to send OTP SMS" });
    }

    res.json({ message: "OTP sent to registered mobile number" });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// Verify OTP and create JWT session
router.post("/verify-otp", async (req, res) => {
  const { aadhar_no, otp } = req.body;

  if (!aadhar_no || !otp) return res.status(400).json({ error: "Aadhaar number and OTP are required" });

  const stored = otpStore[aadhar_no];
  if (!stored) return res.status(400).json({ error: "No OTP found for this user" });
  if (Date.now() > stored.expires) {
    delete otpStore[aadhar_no];
    return res.status(400).json({ error: "OTP expired" });
  }
  if (parseInt(otp) !== stored.otp) return res.status(400).json({ error: "Incorrect OTP" });

  const token = jwt.sign({ aadhar_no }, process.env.JWT_SECRET, { expiresIn: "7d" });
  delete otpStore[aadhar_no];

  res.json({ message: "Login successful", token });
});

module.exports = router;
