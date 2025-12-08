// routes/Loan_Details_Route.js
const express = require("express");
const supabase = require("../supabaseClient.js");

const router = express.Router();

/**
 * 📥 Get saved Loan Details for aadhar_no + loan_application_id
 *    - Both come from frontend (localStorage)
 */
router.get("/loan-details", async (req, res) => {
  const { aadhar_no, loan_application_id } = req.query;

  console.log("🔵 [GET] /loan-details", { aadhar_no, loan_application_id });

  if (!aadhar_no || !loan_application_id) {
    return res.status(400).json({
      success: false,
      message: "aadhar_no and loan_application_id are required",
    });
  }

  try {
    const { data, error } = await supabase
      .from("apply_for_loan") // 👈 correct table
      .select(
        "loan_application_id, aadhaar_no, desired_loan_amount, desired_tenure, purpose_of_loan"
      )
      .eq("aadhaar_no", aadhar_no) // 👈 DB column is aadhaar_no
      .eq("loan_application_id", loan_application_id)
      .maybeSingle();

    console.log("🟣 Supabase loan_details GET Response:");
    console.log("➡️ Data:", data);
    console.log("➡️ Error:", error);

    if (error) {
      console.error("🔥 Supabase Error (loan_details get):", error);
      return res.status(500).json({
        success: false,
        message: "Database error while fetching loan details",
      });
    }

    if (!data) {
      return res.status(404).json({
        success: false,
        message: "No loan details found for this loan/application.",
      });
    }

    return res.json({
      success: true,
      record: data,
    });
  } catch (err) {
    console.error("🔥 INTERNAL ERROR fetching loan details:", err);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

/**
 * 🧾 Save / Update Loan Details
 *  - Uses loan_application_id + aadhar_no from frontend (localStorage)
 *  - Upserts into apply_for_loan (loan_application_id + aadhaar_no)
 */
router.post("/loan-details", async (req, res) => {
  console.log("🔵 [POST] /loan-details", req.body);

  const {
    aadhar_no,
    loan_application_id,
    loanAmount,
    desiredTenure,
    purpose, // 👈 frontend sends `purpose`
  } = req.body;

  if (!aadhar_no || !loan_application_id || !loanAmount || !desiredTenure || !purpose) {
    return res.status(400).json({
      success: false,
      message:
        "aadhar_no, loan_application_id, loanAmount, desiredTenure, purpose are required",
    });
  }

  try {
    const desired_loan_amount_num = Number(loanAmount);
    const desired_tenure_num = parseInt(desiredTenure, 10);

    if (isNaN(desired_loan_amount_num) || isNaN(desired_tenure_num)) {
      return res.status(400).json({
        success: false,
        message: "loanAmount and desiredTenure must be valid numbers",
      });
    }

    console.log("🟡 Upserting into apply_for_loan...");

    const { data, error } = await supabase
      .from("apply_for_loan") // 👈 correct table
      .upsert(
        [
          {
            loan_application_id,
            aadhaar_no: aadhar_no, // 👈 map to DB column
            desired_loan_amount: desired_loan_amount_num,
            desired_tenure: desired_tenure_num,
            purpose_of_loan: purpose,
          },
        ],
        {
          onConflict: "loan_application_id,aadhaar_no",
        }
      )
      .select()
      .single();

    console.log("🟣 Supabase loan_details upsert Response:");
    console.log("➡️ Data:", data);
    console.log("➡️ Error:", error);

    if (error) {
      console.error("🔥 Supabase Error (loan_details upsert):", error);
      return res.status(500).json({
        success: false,
        message: "Failed to save loan details",
      });
    }

    console.log("✅ Loan details saved:", data);

    return res.status(200).json({
      success: true,
      message: "Loan details saved successfully",
      loan_application_id,
      record: data,
    });
  } catch (err) {
    console.error("🔥 INTERNAL ERROR saving loan details:", err);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

module.exports = router;
