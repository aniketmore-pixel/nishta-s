// const express = require("express");
// const supabase = require("../supabaseClient.js");

// const router = express.Router();

// // ===============================
// // 📌 Get all loan applications by Aadhaar Number
// // ===============================
// router.get("    ", async (req, res) => {
//     const { aadhar_no } = req.params;

//     console.log("🔵 Incoming Request -> /applications/", aadhar_no);

//     if (!aadhar_no) {
//         console.log("❌ Error: aadhar_no missing");
//         return res.status(400).json({
//             success: false,
//             message: "Aadhaar number is required",
//         });
//     }

//     console.log("📌 Received aadhar_no:", aadhar_no);
//     console.log("📌 Length:", aadhar_no.length);

//     // Aadhaar validation
//     if (aadhar_no.length !== 12) {
//         return res.status(400).json({
//             success: false,
//             message: "Aadhaar Number must be exactly 12 digits.",
//         });
//     }

//     try {
//         console.log("🟡 Querying Supabase...");

//         const { data, error } = await supabase
//             .from("track_application")
//             .select("*")
//             .eq("aadhar_no", aadhar_no)
//             .order("applied_on", { ascending: false });

//         console.log("🟣 Supabase Response:");
//         console.log("➡️ Data:", data);
//         console.log("➡️ Error:", error);

//         if (error) {
//             console.log("🔥 Supabase Error Occurred:", error);
//             return res.status(500).json({
//                 success: false,
//                 message: "Database error",
//             });
//         }

//         if (!data || data.length === 0) {
//             console.log("⚠️ No applications found for Aadhaar:", aadhar_no);
//             return res.status(404).json({
//                 success: false,
//                 message: "No loan applications found.",
//             });
//         }

//         console.log("✅ Successfully fetched loan applications.");

//         return res.json({
//             success: true,
//             total: data.length,
//             applications: data,
//         });

//     } catch (err) {
//         console.error("🔥 INTERNAL ERROR fetching loan applications:", err);

//         return res.status(500).json({
//             success: false,
//             message: "Internal server error",
//         });
//     }
// });

// module.exports = router;

const express = require("express");
const supabase = require("../supabaseClient.js");

const router = express.Router();

// =======================================================
// 📌 Get all loan applications for a specific Aadhaar No
//     GET /api/applications/:aadhar_no
// =======================================================
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
      .eq("aadhar_no", aadhar_no) // ⬅️ make sure column is really named aadhar_no in DB
      .order("applied_on", { ascending: false });

    console.log("🟣 Supabase Response:", { data, error });

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

  // decision → "Accepted" | "Rejected"
  const finalAccept = decision === "Accepted";

  try {
    console.log("🟡 Updating Supabase...");

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
      message: `Offer ${decision} successfully`,
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
