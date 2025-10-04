import { Header } from "@/components/Header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  User, 
  CreditCard, 
  FileText, 
  TrendingUp, 
  CheckCircle2, 
  Clock,
  AlertCircle,
  ArrowRight,
  Briefcase,
  Shield
} from "lucide-react";

const Dashboard = () => {
  const profileCompletion = 75;
  const creditScore = 68;

  return (
    <div className="min-h-screen flex flex-col bg-muted/30">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-primary mb-2">Welcome back, Rajesh Kumar</h1>
          <p className="text-muted-foreground">Manage your profile and loan applications</p>
        </div>

        {/* Quick Stats */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <Card className="shadow-card">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Credit Score</p>
                  <p className="text-2xl font-bold text-primary">{creditScore}/100</p>
                </div>
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <TrendingUp className="h-6 w-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Profile Status</p>
                  <p className="text-2xl font-bold text-primary">{profileCompletion}%</p>
                </div>
                <div className="h-12 w-12 rounded-full bg-accent/10 flex items-center justify-center">
                  <User className="h-6 w-6 text-accent" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Applications</p>
                  <p className="text-2xl font-bold text-primary">2</p>
                </div>
                <div className="h-12 w-12 rounded-full bg-success/10 flex items-center justify-center">
                  <FileText className="h-6 w-6 text-success" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Eligible Amount</p>
                  <p className="text-2xl font-bold text-primary">₹5L</p>
                </div>
                <div className="h-12 w-12 rounded-full bg-success/10 flex items-center justify-center">
                  <CreditCard className="h-6 w-6 text-success" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Profile Completion */}
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle>Complete Your Profile</CardTitle>
                <CardDescription>Fill all sections to improve your credit score and loan eligibility</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">Overall Progress</span>
                    <span className="text-muted-foreground">{profileCompletion}%</span>
                  </div>
                  <Progress value={profileCompletion} className="h-2" />
                </div>

                <div className="grid md:grid-cols-2 gap-3">
                  <div className="flex items-center gap-3 p-3 rounded-lg border bg-card">
                    <CheckCircle2 className="h-5 w-5 text-success flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium">Personal Details</p>
                      <p className="text-xs text-muted-foreground">Completed</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 rounded-lg border bg-card">
                    <CheckCircle2 className="h-5 w-5 text-success flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium">Bank Details</p>
                      <p className="text-xs text-muted-foreground">Verified</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 rounded-lg border bg-card">
                    <Clock className="h-5 w-5 text-accent flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium">Income Details</p>
                      <p className="text-xs text-muted-foreground">Pending</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 rounded-lg border bg-card">
                    <Clock className="h-5 w-5 text-accent flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium">Documents</p>
                      <p className="text-xs text-muted-foreground">Incomplete</p>
                    </div>
                  </div>
                </div>

                <Button className="w-full">
                  Continue Profile Setup
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>

            {/* Credit Score */}
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
                      <p className="text-muted-foreground">Upload your caste certificate and recent utility bills to gain +15 points</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Application Status */}
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle>Loan Applications</CardTitle>
                <CardDescription>Track your application status</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="p-4 rounded-lg border bg-card">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="font-medium">Business Loan Application</p>
                      <p className="text-sm text-muted-foreground">Applied on 15 Sep 2025</p>
                    </div>
                    <Badge className="bg-success">Approved</Badge>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Loan ID: #NB2025001234</span>
                    <span className="font-medium text-success">₹3,00,000</span>
                  </div>
                  <Progress value={100} className="h-2 mt-3" />
                </div>

                <div className="p-4 rounded-lg border bg-card">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="font-medium">Education Loan Application</p>
                      <p className="text-sm text-muted-foreground">Applied on 28 Sep 2025</p>
                    </div>
                    <Badge variant="outline" className="bg-accent/10 text-accent border-accent">Under Review</Badge>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Loan ID: #NB2025001567</span>
                    <span className="font-medium">₹2,00,000</span>
                  </div>
                  <Progress value={65} className="h-2 mt-3" />
                </div>

                <Button variant="outline" className="w-full">
                  View All Applications
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Apply for Loan */}
            <Card className="shadow-card border-primary/20">
              <CardHeader className="bg-gradient-gov text-primary-foreground rounded-t-lg">
                <CardTitle className="flex items-center gap-2">
                  <Briefcase className="h-5 w-5" />
                  Apply for Loan
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6 space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Eligible Loan Amount</p>
                  <p className="text-2xl font-bold text-primary">₹2L - ₹5L</p>
                </div>

                <div className="p-3 bg-success/10 rounded-lg border border-success/20">
                  <div className="flex items-center gap-2 text-success text-sm font-medium">
                    <CheckCircle2 className="h-4 w-4" />
                    85% Approval Chance
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Interest Rate</span>
                    <span className="font-medium">4.5% - 6.5%</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Tenure</span>
                    <span className="font-medium">Up to 5 years</span>
                  </div>
                </div>

                <Button className="w-full" size="lg">
                  Apply Now
                </Button>
              </CardContent>
            </Card>

            {/* Improvement Tips */}
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="text-lg">Credit Improvement Guide</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                  <CheckCircle2 className="h-5 w-5 text-success flex-shrink-0 mt-0.5" />
                  <div className="text-sm">
                    <p className="font-medium mb-1">Upload Income Proof</p>
                    <p className="text-muted-foreground text-xs">+5 points to your score</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                  <CheckCircle2 className="h-5 w-5 text-success flex-shrink-0 mt-0.5" />
                  <div className="text-sm">
                    <p className="font-medium mb-1">Pay Bills on Time</p>
                    <p className="text-muted-foreground text-xs">Improves payment history</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                  <CheckCircle2 className="h-5 w-5 text-success flex-shrink-0 mt-0.5" />
                  <div className="text-sm">
                    <p className="font-medium mb-1">Complete Profile</p>
                    <p className="text-muted-foreground text-xs">+10 points available</p>
                  </div>
                </div>

                <Button variant="outline" className="w-full text-sm">
                  View Detailed Guide
                </Button>
              </CardContent>
            </Card>

            {/* Security Notice */}
            <Card className="shadow-card border-primary/20">
              <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                  <Shield className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                  <div className="text-sm">
                    <p className="font-medium mb-1">Your Data is Secure</p>
                    <p className="text-muted-foreground text-xs">
                      All information is encrypted and protected under government data protection standards.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
