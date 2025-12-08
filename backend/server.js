const rationRoutes = require("./routes/ration");
const electricityRoutes = require("./routes/electricity.js");
const lpgRoutes = require("./routes/lpg.js");
const eligibilityRoutes = require("./routes/eligibility.js");

require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { createClient } = require("@supabase/supabase-js");
const jwt = require("jsonwebtoken");

const app = express();
app.use(cors());
app.use(express.json());

// ---------------------
// Supabase Client
// ---------------------
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);
app.locals.supabase = supabase;

// ---------------------
// JWT Auth Middleware
// ---------------------
const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    console.log("[AUTH] Authorization header missing");
    return res.status(401).json({ error: "Authorization header missing" });
  }

  const token = authHeader.split(" ")[1]; // Expect "Bearer <token>"
  if (!token) {
    console.log("[AUTH] Token missing in header");
    return res.status(401).json({ error: "Token missing" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("[AUTH] JWT decoded:", decoded);
    req.user = decoded;
    next();
  } catch (err) {
    console.error("[AUTH] JWT verification failed:", err);
    return res.status(401).json({ error: "Invalid or expired token" });
  }
};

// ---------------------
// Public Test Route
// ---------------------
app.get("/api/test", async (req, res) => {
  console.log("[TEST] /api/test called");
  try {
    const { data, error } = await supabase.from("your_table").select("*");
    if (error) {
      console.error("[TEST] Supabase error:", error);
      return res.status(500).json({ error: error.message });
    }
    console.log("[TEST] Supabase data:", data);
    res.json({ data });
  } catch (err) {
    console.error("[TEST] Server error:", err);
    res.status(500).json({ error: err.message });
  }
});

// ---------------------
// Public Auth Routes
// ---------------------
app.use("/api/auth", require("./routes/auth"));

// ---------------------
// Protected Routes
// ---------------------
app.get("/api/dashboard", authMiddleware, (req, res) => {
  console.log("[DASHBOARD] User accessing dashboard:", req.user);
  res.json({
    message: "Secure dashboard data",
    user: req.user,
  });
});

// Electricity verification route
app.use("/api", electricityRoutes);

app.get("/api/user/profile", authMiddleware, async (req, res) => {
  try {
    const { aadhar_no } = req.user;
    console.log("[PROFILE] Fetching profile for Aadhaar:", aadhar_no);

    const { data, error } = await supabase
      .from("beneficiary")
      .select("name, phone_no, aadhar_no")
      .eq("aadhar_no", aadhar_no)
      .single();

    if (error) {
      console.error("[PROFILE] Supabase error:", error);
      return res.status(500).json({ error: "Failed to fetch profile data" });
    }

    console.log("[PROFILE] Profile data:", data);
    res.json({ profile: data });
  } catch (err) {
    console.error("[PROFILE] Server error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

app.get("/api/beneficiary/:aadhar", async (req, res) => {
  let { aadhar } = req.params;
  aadhar = aadhar.trim(); // remove extra spaces
  console.log("[BENEFICIARY] Requested Aadhaar:", aadhar);

  try {
    const { data, error } = await supabase
      .from("beneficiary")
      .select(
        `
        full_name,
        age,
        gender,
        phone_no,
        address,
        income_yearly,
        state,
        district,
        occupation,
        registration_date
      `
      )
      .eq("aadhar_no", aadhar)
      .single();

    if (error || !data) {
      console.error("[BENEFICIARY] Supabase error or no data:", error);
      return res.status(404).json({ error: "Beneficiary not found" });
    }

    console.log("[BENEFICIARY] Fetched data:", data);
    res.json(data);
  } catch (err) {
    console.error("[BENEFICIARY] Server error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// In your backend (e.g., server.js or routes/beneficiary.js)
// Assuming you are using 'pg' pool for database connection

app.post("/api/submit-profile", async (req, res) => {
  try {
    const {
      aadhaar,
      fullName,
      age,
      gender,
      mobile,
      address,
      yearlyIncome,
      state,
      district,
      occupation,
      registrationDate,
      casteCertificateNumber,
    } = req.body;

    // 1️⃣ UPSERT beneficiary
    const { error: benErr } = await supabase.from("beneficiary").upsert(
      {
        aadhar_no: String(aadhaar).trim(),
        full_name: fullName,
        age,
        gender,
        phone_no: mobile,
        address,
        income_yearly: yearlyIncome,
        state,
        district,
        occupation,
        registration_date: registrationDate,
      },
      { onConflict: "aadhar_no" }
    );

    if (benErr) {
      console.error("Beneficiary Upsert Error:", benErr);
      return res
        .status(500)
        .json({ success: false, message: "Failed to update beneficiary" });
    }

    // 2️⃣ Check caste certificate
    const { data: casteData, error: casteErr } = await supabase
      .from("caste_certificate_caste")
      .select("caste")
      .eq("caste_certificate_number", casteCertificateNumber)
      .maybeSingle();

    if (casteErr) {
      console.error("Caste Check Error:", casteErr);
      return res
        .status(500)
        .json({ success: false, message: "Failed to verify caste" });
    }

    let isEligible = false;
    let message = "Profile updated successfully.";

    if (!casteData) {
      return res.json({
        success: true,
        isEligible: false,
        message: "Profile updated. Caste certificate not found.",
      });
    }

    const userCaste = casteData.caste.toLowerCase();

    // 3️⃣ Check eligibility
    if (["sc", "st", "obc"].includes(userCaste)) {
      isEligible = true;

      // 4️⃣ Insert or update eligibility table
      const { error: eligibleErr } = await supabase
        .from("eligible_beneficiary")
        .upsert(
          {
            aadhar_no: String(aadhaar),
            eligibility_status: true,
            occupation: occupation, // save occupation enum
            caste_certificate_number: casteCertificateNumber, // <<--- NEW
          },
          { onConflict: "aadhar_no" }
        );

      if (eligibleErr) {
        console.error("Eligibility Upsert Error:", eligibleErr);
        return res
          .status(500)
          .json({ success: false, message: "Failed to update eligibility" });
      }

      message = "You are eligible! Proceed to loan application.";
    } else {
      message =
        "Profile updated. Based on your caste (General), you are not eligible.";
    }

    return res.json({ success: true, isEligible, message });
  } catch (err) {
    console.error("Server Error:", err);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
});

app.use("/api", eligibilityRoutes);
app.use("/api", rationRoutes);

const mobileRoutes = require("./routes/mobile.js");
app.use("/api/mobile", mobileRoutes);

const beneficiaryRoutes = require("./routes/beneficiary.js");
app.use("/api/beneficiary", beneficiaryRoutes);

app.use("/api/lpg", lpgRoutes);

// ---------------------
// Start Server
// ---------------------
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`[SERVER] Running on port ${PORT}`));
