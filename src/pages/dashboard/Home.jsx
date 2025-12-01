import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  TrendingUp, 
  CheckCircle2, 
  AlertCircle,
  ArrowRight,
  Shield
} from "lucide-react";
import { Link } from "react-router-dom";

const Home = () => {
  const profileCompletion = 75;
  const creditScore = 68;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-primary mb-2">Welcome back, Rajesh Kumar</h1>
        <p className="text-muted-foreground">Your credit score and application overview</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Credit Score Card */}
        <Card className="shadow-card">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Your Credit Score</CardTitle>
                <CardDescription>AI-powered composite creditworthiness assessment</CardDescription>
              </div>
              <Badge variant="outline" className="bg-primary/10 text-primary border-primary">
                Low Risk
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-center">
              <div className="relative">
                <div className="h-40 w-40 rounded-full border-8 border-primary/20 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-4xl font-bold text-primary">{creditScore}</div>
                    <div className="text-sm text-muted-foreground">out of 100</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <div className="flex items-center justify-between text-sm mb-2">
                  <span>Repayment Behavior</span>
                  <span className="font-medium">85%</span>
                </div>
                <Progress value={85} className="h-2" />
              </div>

              <div>
                <div className="flex items-center justify-between text-sm mb-2">
                  <span>Income Stability</span>
                  <span className="font-medium">72%</span>
                </div>
                <Progress value={72} className="h-2" />
              </div>

              <div>
                <div className="flex items-center justify-between text-sm mb-2">
                  <span>Bill Payment Pattern</span>
                  <span className="font-medium">68%</span>
                </div>
                <Progress value={68} className="h-2" />
              </div>

              <div>
                <div className="flex items-center justify-between text-sm mb-2">
                  <span>Document Verification</span>
                  <span className="font-medium">50%</span>
                </div>
                <Progress value={50} className="h-2" />
              </div>
            </div>

            <div className="p-4 bg-accent/10 rounded-lg border border-accent/20">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-accent flex-shrink-0 mt-0.5" />
                <div className="text-sm">
                  <p className="font-medium text-foreground mb-1">Improve Your Score</p>
                  <p className="text-muted-foreground">Complete your profile to gain +15 points</p>
                </div>
              </div>
            </div>

            <Link to="/dashboard/profile">
              <Button className="w-full">
                Complete Profile
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Profile & Application Status Card */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>Your Status</CardTitle>
            <CardDescription>Profile completion and loan application tracking</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Profile Completion */}
            <div className="p-4 bg-primary/5 rounded-lg border border-primary/10">
              <div className="flex items-start gap-3 mb-3">
                <Shield className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                <div className="text-sm flex-1">
                  <p className="font-medium mb-1">Profile Completion: {profileCompletion}%</p>
                  <p className="text-muted-foreground text-xs mb-2">
                    Complete remaining sections to unlock higher loan amounts
                  </p>
                </div>
              </div>
              <Progress value={profileCompletion} className="h-2" />
              <Link to="/dashboard/profile">
                <Button variant="outline" size="sm" className="w-full mt-3">
                  Complete Profile
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>

            {/* Loan Application Status */}
            <div className="p-4 rounded-lg border bg-card">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="font-medium">Loan Application</p>
                  <p className="text-sm text-muted-foreground">Applied on 15 Sep 2025</p>
                </div>
                <Badge className="bg-success">Approved</Badge>
              </div>
              <div className="flex items-center justify-between text-sm mb-3">
                <span className="text-muted-foreground">Application ID: #NB2025001234</span>
                <span className="font-medium text-success">₹3,00,000</span>
              </div>
              <Progress value={100} className="h-2 mb-3" />
              <p className="text-xs text-muted-foreground">
                <strong>Approval Reason:</strong> Strong repayment history and stable income source
              </p>
            </div>

            <div className="p-4 rounded-lg border bg-card">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="font-medium">Loan Application</p>
                  <p className="text-sm text-muted-foreground">Applied on 28 Sep 2025</p>
                </div>
                <Badge variant="outline" className="bg-accent/10 text-accent border-accent">Under Review</Badge>
              </div>
              <div className="flex items-center justify-between text-sm mb-3">
                <span className="text-muted-foreground">Application ID: #NB2025001567</span>
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
