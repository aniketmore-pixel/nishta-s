const fs = require("fs");
const axios = require("axios");
const crypto = require("crypto");

async function testCasteCertificateAPI() {
  try {
    const txnId = crypto.randomUUID();
    const consentId = crypto.randomUUID();

    const body = {
      txnId,
      format: "pdf",  // ✅ raw PDF
      certificateParameters: {
        ApplicationNo: "1234",
        CertificateID: "123456"
      },
      consentArtifact: {
        consent: {
          consentId,
          timestamp: new Date().toISOString(),
          dataConsumer: { id: "sandbox" },
          dataProvider: { id: "sandbox" },
          purpose: { description: "testing" },
          user: {
            idType: "id",
            idNumber: "123",
            mobile: "9999999999",
            email: "test@test.com"
          },
          data: { id: "test" },
          permission: {
            access: "VIEW",
            dateRange: {
              from: new Date().toISOString(),
              to: new Date().toISOString()
            },
            frequency: { unit: "once", value: 1, repeats: 0 }
          }
        },
        signature: { signature: "dummy" }
      }
    };

    const response = await axios.post(
      "https://sandbox.api-setu.in/certificate/v3/edistrictup/ctcer",
      body,
      {
        responseType: "arraybuffer",   // ✅ important for binary PDF
        headers: {
          "Content-Type": "application/json",
          "X-APISETU-APIKEY": "demokey123456ABCD789",
          "X-APISETU-CLIENTID": "in.gov.sandbox"
        }
      }
    );

    // Save PDF directly
    fs.writeFileSync("certificate.pdf", Buffer.from(response.data));
    console.log("✅ PDF saved as certificate.pdf");

  } catch (err) {
    console.error("❌ API call error:", err.response?.data || err.message);
  }
}

testCasteCertificateAPI();
