const express = require("express");
const supabase = require("../supabaseClient");

const router = express.Router();

/** -------------------------------
 * GET eligibility status by Aadhaar
 * --------------------------------
 */
router.get("/eligible-beneficiary/:aadhar_no", async (req, res) => {
    const { aadhar_no } = req.params;

    const { data, error } = await supabase
        .from("eligible_beneficiary")
        .select("eligibility_status, created_at")
        .eq("aadhar_no", aadhar_no)
        .single();

    if (error || !data) {
        return res.status(404).json({
            success: false,
            message: "User not found in eligibility database",
        });
    }

    res.json({
        success: true,
        eligibility_status: data.eligibility_status,
        created_at: data.created_at,
    });
});

/** -------------------------------
 * MARK user as eligible (verification success)
 * --------------------------------
 */
router.post("/verify", async (req, res) => {
    const { aadhar_no } = req.body;

    const { data, error } = await supabase
        .from("eligible_beneficiary")
        .upsert({
            aadhar_no,
            eligibility_status: true,
            created_at: new Date(),
        })
        .select()
        .single();

    if (error) {
        return res.status(400).json({
            success: false,
            message: "Failed to update eligibility",
        });
    }

    res.json({
        success: true,
        message: "Eligibility marked as VERIFIED",
        user: data,
    });
});

module.exports = router;
