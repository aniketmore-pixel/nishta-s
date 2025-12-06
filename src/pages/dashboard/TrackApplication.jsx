import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  FileText,
  CheckCircle2,
  Clock,
  XCircle,
  AlertCircle,
  TrendingUp,
} from "lucide-react";

const applications = [
  {
    id: "#NB2025001234",
    amount: "₹3,00,000",
    appliedDate: "15 Sep 2025",
    status: "Approved",
    progress: 100,
    reason:
      "Strong repayment history and stable income source. Credit score above threshold.",
    statusColor: "success",
    timeline: [
      { step: "Application Submitted", date: "15 Sep 2025", completed: true },
      { step: "Document Verification", date: "16 Sep 2025", completed: true },
      { step: "Credit Score Assessment", date: "17 Sep 2025", completed: true },
      { step: "Final Approval", date: "18 Sep 2025", completed: true },
      { step: "Loan Disbursed", date: "19 Sep 2025", completed: true },
    ],
  },
  {
    id: "#NB2025001567",
    amount: "₹2,00,000",
    appliedDate: "28 Sep 2025",
    status: "Under Review",
    progress: 65,
    reason:
      "Document verification in progress. Expected decision in 2-3 working days.",
    statusColor: "accent",
    timeline: [
      { step: "Application Submitted", date: "28 Sep 2025", completed: true },
      { step: "Document Verification", date: "29 Sep 2025", completed: true },
      {
        step: "Credit Score Assessment",
        date: "In Progress",
        completed: false,
      },
      { step: "Final Approval", date: "Pending", completed: false },
      { step: "Loan Disbursement", date: "Pending", completed: false },
    ],
  },
  {
    id: "#NB2025000891",
    amount: "₹5,00,000",
    appliedDate: "10 Aug 2025",
    status: "Rejected",
    progress: 50,
    reason:
      "Insufficient income documentation. Monthly income below minimum threshold of ₹20,000 for requested amount. Recommendation: Apply for lower amount or submit additional income proof.",
    statusColor: "destructive",
    timeline: [
      { step: "Application Submitted", date: "10 Aug 2025", completed: true },
      { step: "Document Verification", date: "11 Aug 2025", completed: true },
      { step: "Credit Score Assessment", date: "12 Aug 2025", completed: true },
      { step: "Application Rejected", date: "13 Aug 2025", completed: true },
    ],
  },
];

const TrackApplication = () => {
  return (
    <div className="container mx-auto px-4 py-8 pt-20">
      {" "}
      <div className="mb-8">
        {" "}
        <h1 className="text-3xl font-bold text-primary mb-2">
          Track Your Applications
        </h1>{" "}
        <p className="text-muted-foreground">
          Monitor the status of all your loan applications
        </p>{" "}
      </div>
      <div className="space-y-6">
        {applications.map((app) => (
          <Card key={app.id} className="shadow-card">
            <CardHeader>
              <div className="flex items-start justify-between mb-4">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Loan Application
                  </CardTitle>
                  <CardDescription className="mt-1">
                    Applied on {app.appliedDate} • Loan ID: {app.id}
                  </CardDescription>
                </div>
                <div className="text-right">
                  <Badge
                    className={
                      app.statusColor === "success"
                        ? "bg-success"
                        : app.statusColor === "accent"
                        ? "bg-accent/10 text-accent border-accent"
                        : "bg-destructive"
                    }
                    variant={
                      app.statusColor === "accent" ? "outline" : "default"
                    }
                  >
                    {app.status === "Approved" && (
                      <CheckCircle2 className="h-3 w-3 mr-1" />
                    )}
                    {app.status === "Under Review" && (
                      <Clock className="h-3 w-3 mr-1" />
                    )}
                    {app.status === "Rejected" && (
                      <XCircle className="h-3 w-3 mr-1" />
                    )}
                    {app.status}
                  </Badge>
                  <p className="text-lg font-bold text-primary mt-1">
                    {app.amount}
                  </p>
                </div>
              </div>
              <Progress value={app.progress} className="h-2" />
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Status Reason */}
              <div
                className={`p-4 rounded-lg border ${
                  app.statusColor === "success"
                    ? "bg-success/10 border-success/20"
                    : app.statusColor === "accent"
                    ? "bg-accent/10 border-accent/20"
                    : "bg-destructive/10 border-destructive/20"
                }`}
              >
                <div className="flex items-start gap-3">
                  {app.statusColor === "success" && (
                    <CheckCircle2 className="h-5 w-5 text-success flex-shrink-0 mt-0.5" />
                  )}
                  {app.statusColor === "accent" && (
                    <Clock className="h-5 w-5 text-accent flex-shrink-0 mt-0.5" />
                  )}
                  {app.statusColor === "destructive" && (
                    <AlertCircle className="h-5 w-5 text-destructive flex-shrink-0 mt-0.5" />
                  )}
                  <div className="text-sm">
                    <p className="font-medium mb-1">
                      {app.status === "Approved"
                        ? "Approval Reason"
                        : app.status === "Under Review"
                        ? "Current Status"
                        : "Reason for Disapproval"}
                    </p>
                    <p
                      className={
                        app.statusColor === "success"
                          ? "text-success/90"
                          : app.statusColor === "accent"
                          ? "text-accent/90"
                          : "text-destructive/90"
                      }
                    >
                      {app.reason}
                    </p>
                  </div>
                </div>
              </div>

              {/* Timeline */}
              <div>
                <h4 className="font-medium mb-4">Application Timeline</h4>
                <div className="space-y-4">
                  {app.timeline.map((item, index) => (
                    <div key={index} className="flex items-start gap-4">
                      <div
                        className={`h-8 w-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                          item.completed ? "bg-success" : "bg-muted"
                        }`}
                      >
                        {item.completed ? (
                          <CheckCircle2 className="h-4 w-4 text-white" />
                        ) : (
                          <Clock className="h-4 w-4 text-muted-foreground" />
                        )}
                      </div>
                      <div className="flex-1 pb-4">
                        <p className="font-medium text-sm">{item.step}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {item.date}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recommendation for Rejected */}
              {app.status === "Rejected" && (
                <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
                  <div className="flex items-start gap-3">
                    <TrendingUp className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <div className="text-sm">
                      <p className="font-medium mb-1">What's Next?</p>
                      <ul className="text-muted-foreground space-y-1 list-disc list-inside">
                        <li>Complete your income documentation</li>
                        <li>Apply for a lower loan amount (₹2-3 Lakhs)</li>
                        <li>Improve your credit score by completing profile</li>
                      </ul>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default TrackApplication;
