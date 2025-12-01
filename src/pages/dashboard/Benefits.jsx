import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Gift,
  TrendingUp,
  Shield,
  GraduationCap,
  Building,
  ExternalLink
} from "lucide-react";

const schemes = [
  {
    title: "Post Office Fixed Deposit",
    description: "Secure savings scheme with guaranteed returns. Minimum ₹1,000 investment.",
    interest: "7.5% p.a.",
    tenure: "1-5 years",
    icon: Building,
    eligibility: "All citizens",
    link: "#"
  },
  {
    title: "Public Provident Fund (PPF)",
    description: "Long-term savings with tax benefits under Section 80C. Minimum ₹500/year.",
    interest: "7.1% p.a.",
    tenure: "15 years",
    icon: Shield,
    eligibility: "Indian residents",
    link: "#"
  },
  {
    title: "Sukanya Samriddhi Yojana",
    description: "For girl child education and marriage. Opens with just ₹250.",
    interest: "8.2% p.a.",
    tenure: "Till girl turns 21",
    icon: GraduationCap,
    eligibility: "Girl child below 10 years",
    link: "#"
  },
  {
    title: "National Savings Certificate",
    description: "Government-backed investment with tax benefits. Minimum ₹1,000 investment.",
    interest: "7.7% p.a.",
    tenure: "5 years",
    icon: TrendingUp,
    eligibility: "All citizens",
    link: "#"
  }
];

const nbcfdcSchemes = [
  {
    title: "Self Employment Scheme",
    description: "Financial assistance for setting up micro-enterprises and income-generating activities.",
    amount: "Up to ₹15 Lakhs",
    interest: "4-6% p.a.",
    purpose: "Business setup"
  },
  {
    title: "Term Loan Scheme",
    description: "Long-term loans for SC/ST/OBC entrepreneurs for business expansion.",
    amount: "Up to ₹5 Crores",
    interest: "As per RBI norms",
    purpose: "Business expansion"
  },
  {
    title: "Micro Credit Scheme",
    description: "Small loans for income generation and poverty alleviation in rural areas.",
    amount: "Up to ₹1.5 Lakhs",
    interest: "4% p.a.",
    purpose: "Income generation"
  }
];

const Benefits = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-primary mb-2">Benefits & Government Schemes</h1>
        <p className="text-muted-foreground">Explore financial schemes and investment options for your benefit</p>
      </div>

      {/* NBCFDC Schemes */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-primary mb-4">NBCFDC Loan Schemes</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {nbcfdcSchemes.map((scheme, index) => (
            <Card key={index} className="shadow-card border-primary/20">
              <CardHeader>
                <Badge className="w-fit mb-2 bg-primary">NBCFDC Scheme</Badge>
                <CardTitle className="text-lg">{scheme.title}</CardTitle>
                <CardDescription>{scheme.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="p-3 bg-primary/5 rounded-lg">
                  <div className="text-sm text-muted-foreground">Loan Amount</div>
                  <div className="text-xl font-bold text-primary">{scheme.amount}</div>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Interest Rate</span>
                  <span className="font-medium">{scheme.interest}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Purpose</span>
                  <span className="font-medium">{scheme.purpose}</span>
                </div>
                <Button className="w-full" size="sm">
                  Apply Now
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Government Investment Schemes */}
      <div>
        <h2 className="text-2xl font-bold text-primary mb-4 flex items-center gap-2">
          <Gift className="h-6 w-6" />
          Government Investment Schemes
        </h2>
        <div className="grid md:grid-cols-2 gap-6">
          {schemes.map((scheme, index) => (
            <Card key={index} className="shadow-card">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="h-12 w-12 rounded-full bg-accent/10 flex items-center justify-center">
                    <scheme.icon className="h-6 w-6 text-accent" />
                  </div>
                  <Badge variant="outline" className="bg-success/10 text-success border-success">
                    {scheme.interest}
                  </Badge>
                </div>
                <CardTitle className="text-lg mt-4">{scheme.title}</CardTitle>
                <CardDescription>{scheme.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Interest Rate</p>
                    <p className="text-sm font-medium">{scheme.interest}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Tenure</p>
                    <p className="text-sm font-medium">{scheme.tenure}</p>
                  </div>
                </div>
                <div className="p-3 bg-muted rounded-lg">
                  <p className="text-xs text-muted-foreground mb-1">Eligibility</p>
                  <p className="text-sm font-medium">{scheme.eligibility}</p>
                </div>
                <Button variant="outline" className="w-full" size="sm">
                  Learn More
                  <ExternalLink className="ml-2 h-3 w-3" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Additional Resources */}
      <Card className="shadow-card mt-8">
        <CardHeader>
          <CardTitle>Financial Literacy Resources</CardTitle>
          <CardDescription>Learn how to manage your finances better</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            <Button variant="outline" className="h-auto py-4 flex-col">
              <TrendingUp className="h-8 w-8 mb-2 text-primary" />
              <span className="font-medium">Investment Guide</span>
            </Button>
            <Button variant="outline" className="h-auto py-4 flex-col">
              <Shield className="h-8 w-8 mb-2 text-primary" />
              <span className="font-medium">Insurance Info</span>
            </Button>
            <Button variant="outline" className="h-auto py-4 flex-col">
              <Gift className="h-8 w-8 mb-2 text-primary" />
              <span className="font-medium">Tax Benefits</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Benefits;
