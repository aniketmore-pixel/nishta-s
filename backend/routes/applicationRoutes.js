
// const express = require("express");
// const supabase = require("../supabaseClient.js");

// const router = express.Router();

// // ===============================
// // 📌 Get all loan applications by Aadhaar Number
// // ===============================
// router.get("/applications/:aadhar_no", async (req, res) => {
//   const { aadhar_no } = req.params;

//   console.log("🔵 Incoming Request -> /applications/", aadhar_no);

//   if (!aadhar_no) {
//     console.log("❌ Error: aadhar_no missing");
//     return res.status(400).json({
//       success: false,
//       message: "Aadhaar number is required",
//     });
//   }

//   console.log("📌 Received aadhar_no:", aadhar_no);
//   console.log("📌 Length:", aadhar_no.length);

//   // Aadhaar validation
//   if (aadhar_no.length !== 12) {
//     return res.status(400).json({
//       success: false,
//       message: "Aadhaar Number must be exactly 12 digits.",
//     });
//   }

//   try {
//     console.log("🟡 Querying Supabase...");

//     const { data, error } = await supabase
//       .from("track_application")
//       // 🔴 NOTE: use the correct column name as in your DB
//       // If your table has "addhar_no", use that. If it has "aadhar_no", keep as is.
//       .select("*")
//       .eq("aadhar_no", aadhar_no) // or .eq("addhar_no", aadhar_no)
//       .order("applied_on", { ascending: false });

//     console.log("🟣 Supabase Response:");
//     console.log("➡️ Data:", data);
//     console.log("➡️ Error:", error);

//     if (error) {
//       console.log("🔥 Supabase Error Occurred:", error);
//       return res.status(500).json({
//         success: false,
//         message: "Database error",
//       });
//     }

//     if (!data || data.length === 0) {
//       console.log("⚠️ No applications found for Aadhaar:", aadhar_no);
//       return res.status(404).json({
//         success: false,
//         message: "No loan applications found.",
//       });
//     }

//     console.log("✅ Successfully fetched loan applications.");

//     return res.json({
//       success: true,
//       total: data.length,
//       applications: data,
//     });
//   } catch (err) {
//     console.error("🔥 INTERNAL ERROR fetching loan applications:", err);

//     return res.status(500).json({
//       success: false,
//       message: "Internal server error",
//     });
//   }
// });

// // ===============================
// // 📌 User Accepts or Rejects Final Offer
// //     - Accept / Reject can be done ONLY ONCE
// //     - If final_accept_by_user is already true/false -> block further change
// // ===============================
// router.post("/applications/offer-decision", async (req, res) => {
//   const { loan_application_id, decision } = req.body;

//   console.log("🔵 Offer Decision Request:", req.body);

//   if (!loan_application_id || !decision) {
//     return res.status(400).json({
//       success: false,
//       message: "loan_application_id and decision are required",
//     });
//   }

//   // Normalize decision
//   const normalizedDecision = String(decision).toLowerCase().trim();

//   let finalAccept;
//   if (normalizedDecision === "accepted") {
//     finalAccept = true;
//   } else if (normalizedDecision === "rejected") {
//     finalAccept = false;
//   } else {
//     return res.status(400).json({
//       success: false,
//       message: "decision must be either 'Accepted' or 'Rejected'",
//     });
//   }

//   try {
//     console.log("🟡 Fetching existing application from Supabase...");

//     // 1️⃣ Get existing record first
//     const { data: existing, error: fetchError } = await supabase
//       .from("track_application")
//       .select("loan_application_id, final_accept_by_user, status")
//       .eq("loan_application_id", loan_application_id)
//       .maybeSingle();

//     if (fetchError) {
//       console.error("🔥 Supabase fetch error:", fetchError);
//       return res.status(500).json({
//         success: false,
//         message: "Database error while fetching application",
//       });
//     }

//     if (!existing) {
//       console.log("⚠️ No application found with ID:", loan_application_id);
//       return res.status(404).json({
//         success: false,
//         message: "Loan application not found",
//       });
//     }

//     console.log("📄 Existing application:", existing);

//     // 2️⃣ Optional: only allow decision if status is APPROVED
//     if (existing.status !== "APPROVED") {
//       return res.status(400).json({
//         success: false,
//         message:
//           "Final offer decision can only be made for APPROVED applications.",
//       });
//     }

//     // 3️⃣ Block further changes if decision already recorded
//     if (existing.final_accept_by_user !== null && existing.final_accept_by_user !== undefined) {
//       const already =
//         existing.final_accept_by_user === true ? "accepted" : "rejected";

//       return res.status(409).json({
//         success: false,
//         message: `You have already ${already} this offer. Decision cannot be changed.`,
//       });
//     }

//     // 4️⃣ Update final_accept_by_user with new decision
//     console.log("🟡 Updating Supabase with decision:", finalAccept);

//     const { data, error } = await supabase
//       .from("track_application")
//       .update({ final_accept_by_user: finalAccept })
//       .eq("loan_application_id", loan_application_id)
//       .select();

//     if (error) {
//       console.error("🔥 Supabase Error:", error);
//       return res.status(500).json({
//         success: false,
//         message: "Database update failed",
//       });
//     }

//     console.log("✅ Offer decision saved:", data);

//     return res.json({
//       success: true,
//       message: `Offer ${finalAccept ? "Accepted" : "Rejected"} successfully`,
//       updated: data,
//     });
//   } catch (err) {
//     console.error("🔥 INTERNAL ERROR updating offer decision:", err);

//     return res.status(500).json({
//       success: false,
//       message: "Internal server error",
//     });
//   }
// });

// module.exports = router;


const express = require("express");
const supabase = require("../supabaseClient.js");

const router = express.Router();

// ===============================
// 🔠 Helper: Generate Loan Application ID (4 letters + 6 digits)
// ===============================
function generateLoanApplicationId() {
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  let prefix = "";

  for (let i = 0; i < 4; i++) {
    const idx = Math.floor(Math.random() * letters.length);
    prefix += letters.charAt(idx);
  }

  const numericPart = Math.floor(Math.random() * 1_000_000)
    .toString()
    .padStart(6, "0");

  return prefix + numericPart; // e.g. "ABCD012345"
}

// Ensure uniqueness in `track_application.loan_application_id`
async function generateUniqueLoanApplicationId() {
  const MAX_ATTEMPTS = 10;

  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
    const candidate = generateLoanApplicationId();

    const { data, error } = await supabase
      .from("track_application")
      .select("loan_application_id")
      .eq("loan_application_id", candidate)
      .maybeSingle();

    if (error) {
      console.error("❌ Error checking uniqueness of loan_application_id:", error);
      throw new Error("Failed to verify loan_application_id uniqueness");
    }

    if (!data) {
      // Unique – good to use
      return candidate;
    }

    console.log(
      `⚠️ Collision detected for loan_application_id ${candidate}, attempt ${attempt}/${MAX_ATTEMPTS}`
    );
  }

  throw new Error("Unable to generate unique loan_application_id after multiple attempts");
}

// ===============================
// 📌 Get all loan applications by Aadhaar Number
// ===============================
router.get("/applications/:aadhar_no", async (req, res) => {
  const { aadhar_no } = req.params;

  console.log("🔵 Incoming Request -> /applications/", aadhar_no);

  if (!aadhar_no) {
    console.log("❌ Error: aadhar_no missing");
    return res.status(400).json({
      success: false,
      message: "Aadhaar number is required",
    });
  }

  console.log("📌 Received aadhar_no:", aadhar_no);
  console.log("📌 Length:", aadhar_no.length);

  // Aadhaar validation
  if (aadhar_no.length !== 12) {
    return res.status(400).json({
      success: false,
      message: "Aadhaar Number must be exactly 12 digits.",
    });
  }

  try {
    console.log("🟡 Querying Supabase...");

    const { data, error } = await supabase
      .from("track_application")
      .select("*")
      .eq("aadhar_no", aadhar_no) // or .eq("addhar_no", aadhar_no) if that's your column
      .order("applied_on", { ascending: false });

    console.log("🟣 Supabase Response:");
    console.log("➡️ Data:", data);
    console.log("➡️ Error:", error);

    if (error) {
      console.log("🔥 Supabase Error Occurred:", error);
      return res.status(500).json({
        success: false,
        message: "Database error",
      });
    }

    if (!data || data.length === 0) {
      console.log("⚠️ No applications found for Aadhaar:", aadhar_no);
      return res.status(404).json({
        success: false,
        message: "No loan applications found.",
      });
    }

    console.log("✅ Successfully fetched loan applications.");

    return res.json({
      success: true,
      total: data.length,
      applications: data,
    });
  } catch (err) {
    console.error("🔥 INTERNAL ERROR fetching loan applications:", err);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

// ===============================
// 🆕 Create new application when user clicks Apply from Benefits
// - Generates unique loan_application_id (4 chars + 6 digits)
// - Saves aadhar_no, scheme, status (NULL), final_accept_by_user (NULL)
// ===============================
router.post("/applications/apply", async (req, res) => {
  const { aadhar_no, scheme } = req.body;

  console.log("🔵 New Application Request /applications/apply:", req.body);

  if (!aadhar_no || !scheme) {
    return res.status(400).json({
      success: false,
      message: "aadhar_no and scheme are required",
    });
  }

  if (String(aadhar_no).length !== 12) {
    return res.status(400).json({
      success: false,
      message: "Aadhaar Number must be exactly 12 digits.",
    });
  }

  try {
    // 1️⃣ Generate unique loan_application_id
    const loan_application_id = await generateUniqueLoanApplicationId();
    console.log("✅ Generated unique loan_application_id:", loan_application_id);

    // 2️⃣ Insert new application
    const { data, error } = await supabase
      .from("track_application")
      .insert([
        {
          loan_application_id,
          aadhar_no,
          scheme,               // scheme column in DB
          status: null,         // explicitly set to NULL
          final_accept_by_user: null, // no decision yet
          // applied_on: will use default in DB (e.g. now()) if defined there
        },
      ])
      .select()
      .single();

    if (error) {
      console.error("🔥 Supabase insert error (new application):", error);
      return res.status(500).json({
        success: false,
        message: "Failed to create loan application",
      });
    }

    console.log("✅ New loan application created:", data);

    return res.status(201).json({
      success: true,
      message: "Loan application created successfully",
      application: data,
    });
  } catch (err) {
    console.error("🔥 INTERNAL ERROR creating new application:", err);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

// ===============================
// 📌 User Accepts or Rejects Final Offer
// ===============================
router.post("/applications/offer-decision", async (req, res) => {
  const { loan_application_id, decision } = req.body;

  console.log("🔵 Offer Decision Request:", req.body);

  if (!loan_application_id || !decision) {
    return res.status(400).json({
      success: false,
      message: "loan_application_id and decision are required",
    });
  }

  // Normalize decision
  const normalizedDecision = String(decision).toLowerCase().trim();

  let finalAccept;
  if (normalizedDecision === "accepted") {
    finalAccept = true;
  } else if (normalizedDecision === "rejected") {
    finalAccept = false;
  } else {
    return res.status(400).json({
      success: false,
      message: "decision must be either 'Accepted' or 'Rejected'",
    });
  }

  try {
    console.log("🟡 Fetching existing application from Supabase...");

    // 1️⃣ Get existing record first
    const { data: existing, error: fetchError } = await supabase
      .from("track_application")
      .select("loan_application_id, final_accept_by_user, status")
      .eq("loan_application_id", loan_application_id)
      .maybeSingle();

    if (fetchError) {
      console.error("🔥 Supabase fetch error:", fetchError);
      return res.status(500).json({
        success: false,
        message: "Database error while fetching application",
      });
    }

    if (!existing) {
      console.log("⚠️ No application found with ID:", loan_application_id);
      return res.status(404).json({
        success: false,
        message: "Loan application not found",
      });
    }

    console.log("📄 Existing application:", existing);

    // 2️⃣ Optional: only allow decision if status is APPROVED
    if (existing.status !== "APPROVED") {
      return res.status(400).json({
        success: false,
        message:
          "Final offer decision can only be made for APPROVED applications.",
      });
    }

    // 3️⃣ Block further changes if decision already recorded
    if (
      existing.final_accept_by_user !== null &&
      existing.final_accept_by_user !== undefined
    ) {
      const already =
        existing.final_accept_by_user === true ? "accepted" : "rejected";

      return res.status(409).json({
        success: false,
        message: `You have already ${already} this offer. Decision cannot be changed.`,
      });
    }

    // 4️⃣ Update final_accept_by_user with new decision
    console.log("🟡 Updating Supabase with decision:", finalAccept);

    const { data, error } = await supabase
      .from("track_application")
      .update({ final_accept_by_user: finalAccept })
      .eq("loan_application_id", loan_application_id)
      .select();

    if (error) {
      console.error("🔥 Supabase Error:", error);
      return res.status(500).json({
        success: false,
        message: "Database update failed",
      });
    }

    console.log("✅ Offer decision saved:", data);

    return res.json({
      success: true,
      message: `Offer ${finalAccept ? "Accepted" : "Rejected"} successfully`,
      updated: data,
    });
  } catch (err) {
    console.error("🔥 INTERNAL ERROR updating offer decision:", err);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

module.exports = router;
