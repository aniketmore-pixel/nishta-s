import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const nbcfdcSchemes = [
  {
    title: "Term Loan – General Loan Scheme",
    description:
      "Income generation: self-employment, small business, trading, services, transport, agriculture & allied activities, artisan/traditional trades.",
    amount: "Up to ₹15.00 Lakh per beneficiary",
    interest:
      "• Up to ₹5 Lakh → 6% p.a.\n• ₹5–10 Lakh → 7% p.a.\n• ₹10–15 Lakh → 8% p.a.",
    repayment: "Quarterly EMI; up to 8 years, including ~6-month moratorium.",
    detail: `The General Loan Scheme is NBCFDC’s flagship financial assistance program designed to help individuals from backward-class communities start or expand income-generating activities. This scheme covers a wide variety of sectors such as small businesses, retail shops, service-based ventures, trading activities, agricultural and allied activities, transport vehicles, artisan and traditional trades, and micro-enterprises. It aims to empower economically weaker individuals by offering loans at highly concessional interest rates, making entrepreneurship more affordable and accessible.

Under this scheme, beneficiaries can avail loans up to ₹15 lakh, depending on the nature and requirement of the project. NBCFDC typically contributes the major share of the project cost, while the remaining is contributed by the beneficiary or channel partner. The interest rate increases gradually across loan slabs to ensure fairness and viability — 6% p.a. up to ₹5 lakh, 7% p.a. for ₹5–10 lakh, and 8% p.a. for ₹10–15 lakh. The repayment period extends up to 8 years, including a moratorium period of around six months where the beneficiary need not pay the principal amount.

This scheme is ideal for individuals planning to become self-employed, expand an existing business, or start a sustainable livelihood project. It is designed to promote economic independence, create employment opportunities, and uplift socially and economically weaker households.`,
  },
  {
    title: "Term Loan – Education Loan Scheme",
    description:
      "Higher education for backward-class students in India or abroad (professional, technical, vocational courses).",
    amount: "India: up to ₹15 Lakh | Abroad: up to ₹20 Lakh",
    interest: "• Boys → 4% p.a.\n• Girls → 3.5% p.a.",
    repayment:
      "Moratorium during course; repayment after completion; total up to ~15 years.",
    detail: `The Education Loan Scheme enables students belonging to backward-class families to pursue higher studies in India or abroad without financial barriers. It financially supports a wide range of courses including professional degrees, technical programs, vocational training, postgraduate studies, and specialized skill-oriented courses. The scheme ensures that deserving students can access quality education and build strong career foundations.

The loan typically covers essential expenses such as tuition fees, hostel charges, examination fees, books, educational equipment, travel expenses (for overseas study), and other academic requirements. Students can borrow up to ₹15 lakh for studies in India and up to ₹20 lakh for studying abroad. NBCFDC offers very low interest rates — 4% per annum for boys and 3.5% per annum for girls — making higher education significantly more affordable.

A major benefit of this scheme is the extended moratorium period, which covers the full course duration plus additional time before repayment begins. The total repayment period, including the moratorium, can extend up to around 15 years, reducing financial stress on the student. This scheme is perfect for students wanting to achieve academic and professional excellence but lacking financial resources.`,
  },
  {
    title: "New Swarnima Scheme (Women)",
    description:
      "Women entrepreneurship: micro-enterprises and self-employment for backward-class women.",
    amount: "Up to ₹2.00 Lakh",
    interest: "5% p.a.",
    repayment: "Quarterly installments; up to 8 years, including moratorium.",
    detail: `The New Swarnima Scheme is a women-focused concessional loan program aimed at promoting entrepreneurship, self-employment, and economic independence among women belonging to backward classes. It supports small-scale business ventures such as tailoring, handicrafts, beauty parlors, food processing units, home-based enterprises, and service activities.

The scheme provides loans of up to ₹2 lakh at an extremely low interest rate of just 5% per annum, with NBCFDC funding the major share of the loan amount. The beneficiary contribution is minimal, ensuring that financial limitations do not prevent women from starting or expanding their businesses. The repayment period extends up to 8 years, including a moratorium period, which gives women enough time to stabilize their business before beginning repayments.

This scheme is specifically designed to empower women entrepreneurs, increase their participation in income-generating activities, and uplift families by improving female economic participation. It is one of the most beneficiary-friendly schemes offered by NBCFDC.`,
  },
  {
    title: "Individual Loan Scheme",
    description:
      "Higher-value individual loans for business, self-employment, enterprise setup, and technical trades.",
    amount: "Up to ₹25.00 Lakh",
    interest:
      "• Up to ₹1.25 Lakh → 7% p.a.\n• ₹1.25–25 Lakh → 8% p.a.",
    repayment:
      "4–7 years for business. Education under this scheme: up to 10 years with ~5-year moratorium.",
    detail: `The Individual Loan Scheme targets entrepreneurs who require greater financial support than what microloan schemes provide. It is ideal for individuals planning to launch or expand medium-sized enterprises such as manufacturing units, workshops, fabrication centers, repair units, service-based companies, or any commercial activity requiring significant initial investment.

The scheme offers loans up to ₹25 lakh, making it suitable for ventures that need larger working capital or fixed capital investment. The interest rate depends on the loan amount — 7% per annum for loans up to ₹1.25 lakh and 8% per annum for higher loan slabs. NBCFDC usually finances a major portion of the project cost, while the remaining is contributed by the beneficiary or channel partner.

The repayment period varies between 4 to 7 years, depending on the size and nature of the project. The scheme can also support educational needs for long-duration courses under a separate repayment structure. Overall, this scheme aims to enable sustained business growth, increase employment opportunities, and support ambitious backward-class entrepreneurs seeking higher capital.`,
  },
  {
    title: "Micro-Finance Scheme (SHGs / Groups)",
    description:
      "Micro-credit for SHGs to support livelihood, small businesses, dairy, vending, handicrafts, and micro-enterprises.",
    amount: "Group: up to ₹15 Lakh | Per member: up to ₹1.25 Lakh",
    interest: "5% p.a.",
    repayment: "Repayment within 4 years, including ~6-month moratorium.",
    detail: `The Micro-Finance Scheme operates through Self-Help Groups (SHGs) to provide collective microcredit to individuals from backward-class communities. This scheme is designed to support livelihood activities, small household businesses, agricultural micro-projects, vending, tailoring, handicrafts, dairy, and other income-generating occupations.

Each SHG can receive financing up to ₹15 lakh, while each member can obtain up to ₹1.25 lakh. NBCFDC typically finances a large share of the total loan, making the scheme highly accessible to communities with limited savings. The interest rate to beneficiaries is just 5% per annum, which is very affordable compared to market rates.

This scheme promotes financial inclusion, group cooperation, and shared responsibility. The repayment period is up to 4 years, including a moratorium period of around six months. It is a highly effective model for grassroots economic development and is especially helpful for rural and semi-urban households.`,
  },
  {
    title: "Mahila Samriddhi Yojana (MSY)",
    description:
      "Women SHGs for micro-livelihood, income generation, small trading, and household businesses.",
    amount: "Per beneficiary: up to ₹1.25 Lakh | Group: up to ₹15 Lakh",
    interest: "4% p.a.",
    repayment: "Repayment within 4 years, including moratorium.",
    detail: `Mahila Samriddhi Yojana is a specialized microfinance program for women belonging to backward-class communities, implemented primarily through SHGs. It supports activities such as home-based businesses, tailoring units, craft production, small trading, food vending, beautician services, and livestock-based livelihoods.

Each woman can access up to ₹1.25 lakh, while SHGs can collectively avail up to ₹15 lakh. The scheme provides highly concessional interest rates of 4% per annum, making it one of the most affordable financing options for women entrepreneurs. The financing pattern is extremely favorable, with NBCFDC typically contributing a major share of the loan amount.

Repayment is spread over about 4 years, including a moratorium period. The scheme aims to uplift women economically, build leadership and financial literacy within SHGs, and improve household income security. It is particularly beneficial for women who wish to start small-scale ventures but lack capital and collateral.`,
  },
  {
    title: "Micro-Finance – Small Loan for Individuals",
    description:
      "Micro-loans to individuals who are not in SHGs but need small capital for self-employment.",
    amount: "Up to ₹1.25 Lakh",
    interest: "Around 6% p.a.",
    repayment: "Repayment typically within 4 years.",
    detail: `This scheme provides small loans to individual beneficiaries who are not part of SHGs but require modest capital for starting or improving micro-businesses. It supports activities such as fruit and vegetable vending, small retail shops, repair services, tailoring, dairy, poultry, handicrafts, and household-based production.

The maximum loan available is ₹1.25 lakh, which makes it ideal for quick-start livelihood projects with lower investment needs. The interest rate is concessional (around 6% per annum), ensuring affordability. NBCFDC usually covers a major part of the project cost, with the beneficiary or channel partner contributing the remaining portion.

With a repayment period of around 4 years, this scheme is designed to help individuals achieve sustainable self-employment and gradually expand their micro-enterprises without heavy financial burden.`,
  },
  {
    title: "Micro-Finance – NBFC-MFI / MFI Lending",
    description:
      "Lending through MFIs/NBFC-MFIs for backward-class beneficiaries where banking access is weak.",
    amount: "Per beneficiary: up to ₹1.25 Lakh | Group: up to ₹15 Lakh",
    interest: "Around 12% p.a. (MFI operational costs).",
    repayment: "Repayment around 4 years (varies by MFI).",
    detail: `The NBFC-MFI Loan Scheme is implemented through Micro-Finance Institutions (MFIs) and NBFC-MFIs to ensure credit reaches beneficiaries in remote, underserved, or financially excluded areas. It is ideal for backward-class individuals who may not have direct access to banks, SHGs, or formal loan channels. This scheme supports micro-enterprises, group activities, and livelihood improvement programs.

Each beneficiary can receive up to ₹1.25 lakh, with total group-level lending reaching up to ₹15 lakh. The financing pattern typically involves NBCFDC contributing the major share and the partner institution providing the rest. Since MFIs incur operational costs, the interest rate under this scheme is higher (around 12% per annum), but it ensures faster processing, doorstep servicing, and wider coverage.

Repayment is usually completed within about 4 years, depending on the MFI’s policies. This scheme is crucial for last-mile delivery of financial support to backward-class individuals living in rural, tribal, and hard-to-reach areas.`,
  },
];

const Benefits = () => {
  const [eligible, setEligible] = useState(false);
  const [selectedScheme, setSelectedScheme] = useState(null);
  const [consent, setConsent] = useState(false);
  const [isApplying, setIsApplying] = useState(false);

  useEffect(() => {
    // check eligibility on mount
    const checkEligibility = async () => {
      const aadhar_no = localStorage.getItem("aadhar_no");
      if (!aadhar_no) return;

      try {
        const res = await fetch(
          `http://localhost:5010/api/eligible-beneficiary/${aadhar_no}`
        );
        const data = await res.json();
        setEligible(data.success && data.eligibility_status);
      } catch (err) {
        console.error("Eligibility check failed:", err);
        setEligible(false);
      }
    };

    checkEligibility();
  }, []);

  const handleCardApplyClick = (scheme) => {
    setSelectedScheme(scheme);
    setConsent(false);
  };

  const handlePopupApply = async () => {
    if (!consent || !selectedScheme) return;

    const aadhar_no = localStorage.getItem("aadhar_no");
    if (!aadhar_no) {
      alert("Aadhaar number not found. Please login or complete your profile first.");
      return;
    }

    try {
      setIsApplying(true);

      const res = await fetch("http://localhost:5010/api/applications/apply", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          aadhar_no,
          scheme: selectedScheme.title, // save scheme name in DB
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        console.error("Failed to create application:", data);
        alert(data.message || "Failed to create loan application. Please try again.");
        setIsApplying(false);
        return;
      }

      const applicationId = data.application?.loan_application_id;
      const schemeParam = encodeURIComponent(selectedScheme.title);

      // Optionally store applicationId in localStorage if you want to reuse later
      // localStorage.setItem("loan_application_id", applicationId);

      // Redirect to Apply Loan page with scheme + application id
      const queryParams = new URLSearchParams({
        scheme: schemeParam,
        applicationId: applicationId || "",
      }).toString();

      window.location.href = `http://localhost:8080/dashboard/apply?${queryParams}`;
    } catch (err) {
      console.error("Error while creating application:", err);
      alert("Something went wrong while creating loan application.");
      setIsApplying(false);
    }
  };

  const handleClosePopup = () => {
    setSelectedScheme(null);
    setConsent(false);
    setIsApplying(false);
  };

  return (
    <div className="container mx-auto px-4 py-8 pt-20">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-primary mb-2">
          Government Schemes
        </h1>
        <p className="text-muted-foreground">
          Explore NBCFDC concessional loan schemes designed for income generation
          and upliftment.
        </p>
      </div>

      {/* NBCFDC Schemes ONLY */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-primary mb-4">
          NBCFDC Loan Schemes
        </h2>
        <div className="grid md:grid-cols-2 gap-6">
          {nbcfdcSchemes.map((scheme, index) => (
            <Card
              key={index}
              className="shadow-card border border-primary/20 hover:border-primary/40 hover:shadow-lg transition-all duration-200 rounded-xl h-full flex flex-col bg-background/80"
            >
              <CardHeader className="pb-3 space-y-1">
                <CardTitle className="text-lg leading-snug">
                  {scheme.title}
                </CardTitle>
                <CardDescription className="text-sm">
                  {scheme.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 pt-0 flex-1 flex flex-col">
                <div className="space-y-3 flex-1">
                  <div className="p-3 bg-primary/5 rounded-lg">
                    <div className="text-xs text-muted-foreground uppercase tracking-wide">
                      Max Loan Amount
                    </div>
                    <div className="text-base font-semibold text-primary mt-1">
                      {scheme.amount}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <div className="p-3 bg-muted rounded-lg">
                      <div className="text-xs text-muted-foreground uppercase tracking-wide">
                        Interest Rate
                      </div>
                      <div className="text-sm font-medium whitespace-pre-line mt-1">
                        {scheme.interest}
                      </div>
                    </div>

                    <div className="p-3 bg-muted rounded-lg">
                      <div className="text-xs text-muted-foreground uppercase tracking-wide">
                        Repayment / Notes
                      </div>
                      <div className="text-sm font-medium mt-1">
                        {scheme.repayment}
                      </div>
                    </div>
                  </div>
                </div>

                <Button
                  className="w-full mt-2"
                  size="sm"
                  onClick={() => handleCardApplyClick(scheme)}
                  disabled={!eligible}
                >
                  Apply Now
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Apply Popup */}
      {selectedScheme && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-background rounded-lg shadow-lg max-w-3xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b px-6 py-4">
              <h3 className="text-lg font-semibold text-primary">
                Apply for {selectedScheme.title}
              </h3>
              <button
                onClick={handleClosePopup}
                className="text-muted-foreground hover:text-foreground text-xl leading-none"
              >
                ×
              </button>
            </div>

            <div className="px-6 py-4 space-y-4">
              {/* Scheme-wise detailed description */}
              <p className="text-sm text-muted-foreground whitespace-pre-line">
                {selectedScheme.detail}
              </p>

              <div className="bg-muted rounded-md p-3 text-xs space-y-1">
                <div>
                  <span className="font-semibold">Max Loan Amount: </span>
                  {selectedScheme.amount}
                </div>
                <div className="whitespace-pre-line">
                  <span className="font-semibold">Interest: </span>
                  {selectedScheme.interest}
                </div>
                <div>
                  <span className="font-semibold">Repayment: </span>
                  {selectedScheme.repayment}
                </div>
              </div>

              <label className="flex items-start gap-2 text-sm">
                <input
                  type="checkbox"
                  className="mt-1"
                  checked={consent}
                  onChange={(e) => setConsent(e.target.checked)}
                />
                <span>
                  I hereby give my consent to proceed with this NBCFDC loan
                  application and authorize use of my information for eligibility
                  and verification purposes.
                </span>
              </label>
            </div>

            <div className="flex justify-end gap-3 border-t px-6 py-4">
              <Button variant="outline" onClick={handleClosePopup}>
                Cancel
              </Button>
              <Button onClick={handlePopupApply} disabled={!consent || isApplying}>
                {isApplying ? "Processing..." : "Apply Now"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Benefits;
