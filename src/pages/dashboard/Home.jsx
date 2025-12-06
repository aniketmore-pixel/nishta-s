import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { AlertCircle, ArrowRight, Shield } from "lucide-react";
import { Link } from "react-router-dom";

const Home = () => {
  const profileCompletion = 75;

  // These should ideally come from backend
  const creditScore = 68; // 0–100 from backend
  const safeLoanAmount = 300000; // from backend (INR)
  const estimatedIncome = 600000; // from backend (INR)

  // 0–100 -> 300–900
  const normalized = Math.min(100, Math.max(0, creditScore ?? 0));
  const cibilScore = Math.round(300 + (normalized / 100) * 600); // 300–900

  // Needle angle for semi-circle (-90° left to +90° right)
  const progress = (cibilScore - 300) / 600; // 0–1
  const minAngle = -90;
  const maxAngle = 90;
  const angle = minAngle + progress * (maxAngle - minAngle);

  // Risk band label
  let riskLabel = "High Risk";
  if (cibilScore >= 550 && cibilScore < 650) riskLabel = "Moderate Risk";
  if (cibilScore >= 650 && cibilScore < 750) riskLabel = "Low Risk";
  if (cibilScore >= 750) riskLabel = "Very Low Risk";

  const currencyFormatter = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  });

  const handleUpdateScore = () => {
    // TODO: call backend to refresh credit score, safeLoanAmount, estimatedIncome
    console.log("Update score clicked");
  };

  return (
    <div className="container mx-auto px-4 py-8 pt-20">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-primary mb-2">
          Welcome back, Rajesh Kumar
        </h1>
        <p className="text-muted-foreground">
          Your credit score and application overview
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Credit Score Card */}
        <Card className="shadow-card">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Your Credit Score</CardTitle>
                <CardDescription>
                  AI-powered composite creditworthiness assessment
                </CardDescription>
              </div>
              <Badge
                variant="outline"
                className="bg-primary/10 text-primary border-primary"
              >
                {riskLabel}
              </Badge>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
           {/* CIBIL-style TRUE Semicircle Gauge */}
<div className="flex flex-col items-center">

  {/* Outer Semicircle */}
  <div className="relative w-48 h-24 overflow-hidden">
    <div
      className="absolute w-48 h-48 rounded-full"
      style={{
        background:
          "conic-gradient(#ef4444 0deg, #f97316 90deg, #eab308 180deg, #22c55e 270deg, #22c55e 360deg)",
        top: "0",
        left: "0",
      }}
    ></div>

    {/* White masking for inner ring */}
    <div className="absolute w-40 h-40 rounded-full bg-white top-4 left-4"></div>

    {/* Needle */}
    <div
      className="absolute w-1 bg-blue-600 h-20 origin-bottom"
      style={{
        left: "50%",
        bottom: "-2px",
        transform: `translateX(-50%) rotate(${angle}deg)`,
      }}
    ></div>

    {/* Needle base circle */}
    <div className="absolute w-4 h-4 bg-blue-600 rounded-full left-1/2 bottom-0 -translate-x-1/2 translate-y-1/2"></div>
  </div>

  {/* Score range labels */}
  <div className="mt-2 flex justify-between w-48 text-xs text-muted-foreground px-1">
    <span>300</span>
    <span>900</span>
  </div>

  {/* Score text */}
  <div className="mt-3 text-center">
    <div className="text-4xl font-bold text-primary">{cibilScore}</div>
    <div className="text-xs text-muted-foreground">out of 900</div>
  </div>
</div>


            {/* Safe Loan Amount & Estimated Income */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="rounded-lg border bg-muted/40 p-3">
                <p className="text-xs font-medium text-muted-foreground">
                  Safe Loan Amount
                </p>
                <p className="mt-1 text-lg font-semibold">
                  {Number.isFinite(safeLoanAmount)
                    ? currencyFormatter.format(safeLoanAmount)
                    : "—"}
                </p>
                <p className="mt-1 text-[11px] text-muted-foreground">
                  Indicative maximum amount you can safely borrow based on your
                  current score.
                </p>
              </div>

              <div className="rounded-lg border bg-muted/40 p-3">
                <p className="text-xs font-medium text-muted-foreground">
                  Estimated Income
                </p>
                <p className="mt-1 text-lg font-semibold">
                  {Number.isFinite(estimatedIncome)
                    ? currencyFormatter.format(estimatedIncome)
                    : "—"}
                </p>
                <p className="mt-1 text-[11px] text-muted-foreground">
                  Income estimate used in this creditworthiness assessment.
                </p>
              </div>
            </div>

            {/* Info box */}
            <div className="p-4 bg-accent/10 rounded-lg border border-accent/20">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-accent flex-shrink-0 mt-0.5" />
                <div className="text-sm">
                  <p className="font-medium text-foreground mb-1">
                    Refresh Your Score
                  </p>
                  <p className="text-muted-foreground">
                    Update latest income and repayment details to recalculate
                    your score and safe loan amount.
                  </p>
                </div>
              </div>
            </div>

            {/* Update Score button */}
            <Button className="w-full" onClick={handleUpdateScore}>
              Update Score
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </CardContent>
        </Card>

        {/* Profile & Application Status Card */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>Your Status</CardTitle>
            <CardDescription>
              Profile completion and loan application tracking
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Profile Completion */}
            <div className="p-4 bg-primary/5 rounded-lg border border-primary/10">
              <div className="flex items-start gap-3 mb-3">
                <Shield className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                <div className="text-sm flex-1">
                  <p className="font-medium mb-1">
                    Profile Completion: {profileCompletion}%
                  </p>
                  <p className="text-muted-foreground text-xs mb-2">
                    Complete remaining sections to unlock higher loan amounts
                  </p>
                </div>
              </div>
              <Progress value={profileCompletion} className="h-2" />
              <Link to="/dashboard/profile">
                <Button variant="outline" size="sm" className="w-full mt-3">
                  Caste Verification
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>

            <Link to="/dashboard/apply">
              <Button className="w-full mt-3 bg-primary text-white hover:bg-primary/90">
                Apply for Loan
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>

            {/* Loan Application Status */}
            <div className="p-4 rounded-lg border bg-card">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="font-medium">Loan Application</p>
                  <p className="text-sm text-muted-foreground">
                    Applied on 15 Sep 2025
                  </p>
                </div>
                <Badge className="bg-success">Approved</Badge>
              </div>
              <div className="flex items-center justify-between text-sm mb-3">
                <span className="text-muted-foreground">
                  Application ID: #NB2025001234
                </span>
                <span className="font-medium text-success">₹3,00,000</span>
              </div>
              <Progress value={100} className="h-2 mb-3" />
              <p className="text-xs text-muted-foreground">
                <strong>Approval Reason:</strong> Strong repayment history and
                stable income source
              </p>
            </div>

            <div className="p-4 rounded-lg border bg-card">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="font-medium">Loan Application</p>
                  <p className="text-sm text-muted-foreground">
                    Applied on 28 Sep 2025
                  </p>
                </div>
                <Badge
                  variant="outline"
                  className="bg-accent/10 text-accent border-accent"
                >
                  Under Review
                </Badge>
              </div>
              <div className="flex items-center justify-between text-sm mb-3">
                <span className="text-muted-foreground">
                  Application ID: #NB2025001567
                </span>
                <span className="font-medium">₹2,00,000</span>
              </div>
              <Progress value={65} className="h-2" />
            </div>

            <Link to="/dashboard/track">
              <Button variant="outline" className="w-full">
                View All Applications
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Home;
