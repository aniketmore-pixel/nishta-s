import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Shield, Phone, Lock, User, Mail } from "lucide-react";

const Signup = () => {
  const [step, setStep] = useState(1);
  const [aadhaarVerified, setAadhaarVerified] = useState(false);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <div className="flex-1 bg-muted/30 py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-xl mx-auto">
            {/* Progress Indicator */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-2">
                <span className={`text-sm font-medium ${step >= 1 ? 'text-primary' : 'text-muted-foreground'}`}>
                  Aadhaar Verification
                </span>
                <span className={`text-sm font-medium ${step >= 2 ? 'text-primary' : 'text-muted-foreground'}`}>
                  Account Details
                </span>
              </div>
              <div className="h-2 bg-secondary rounded-full overflow-hidden">
                <div 
                  className="h-full bg-primary transition-all duration-300"
                  style={{ width: `${(step / 2) * 100}%` }}
                />
              </div>
            </div>

            <Card className="shadow-elevated">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-primary" />
                  {step === 1 ? 'Verify Your Aadhaar' : 'Complete Registration'}
                </CardTitle>
                <CardDescription>
                  {step === 1 
                    ? 'Secure authentication using your Aadhaar number' 
                    : 'Create your NBCFDC beneficiary account'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {step === 1 ? (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="aadhaar">Aadhaar Number</Label>
                      <Input
                        id="aadhaar"
                        placeholder="XXXX XXXX XXXX"
                        maxLength={14}
                        className="text-lg tracking-wider"
                      />
                      <p className="text-xs text-muted-foreground">
                        Your Aadhaar details are encrypted and secure
                      </p>
                    </div>

                    <Button 
                      className="w-full" 
                      onClick={() => {
                        setAadhaarVerified(true);
                        setTimeout(() => setStep(2), 500);
                      }}
                    >
                      Send OTP
                    </Button>

                    <div className="relative">
                      <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t" />
                      </div>
                      <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-card px-2 text-muted-foreground">
                          Secure verification
                        </span>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 p-4 bg-muted/50 rounded-lg">
                      <Shield className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                      <div className="text-sm text-muted-foreground">
                        <p className="font-medium text-foreground mb-1">Why Aadhaar?</p>
                        <p>Aadhaar-based authentication ensures your identity is verified and protects against fraud, giving you secure access to government benefits.</p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="grid gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="fullname" className="flex items-center gap-2">
                          <User className="h-4 w-4" />
                          Full Name
                        </Label>
                        <Input
                          id="fullname"
                          placeholder="As per Aadhaar"
                          defaultValue="Rajesh Kumar"
                          disabled
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="email" className="flex items-center gap-2">
                          <Mail className="h-4 w-4" />
                          Email Address
                        </Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="your.email@example.com"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="phone" className="flex items-center gap-2">
                          <Phone className="h-4 w-4" />
                          Mobile Number
                        </Label>
                        <Input
                          id="phone"
                          type="tel"
                          placeholder="+91 XXXXX XXXXX"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="category">Caste Category</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Select your category" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="sc">Scheduled Caste (SC)</SelectItem>
                            <SelectItem value="st">Scheduled Tribe (ST)</SelectItem>
                            <SelectItem value="obc">Other Backward Class (OBC)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="password" className="flex items-center gap-2">
                          <Lock className="h-4 w-4" />
                          Create Password
                        </Label>
                        <Input
                          id="password"
                          type="password"
                          placeholder="Minimum 8 characters"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="confirm-password">Confirm Password</Label>
                        <Input
                          id="confirm-password"
                          type="password"
                          placeholder="Re-enter password"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="referral" className="text-muted-foreground">
                          Referral Code (Optional)
                        </Label>
                        <Input
                          id="referral"
                          placeholder="Enter if you have one"
                        />
                      </div>
                    </div>

                    <div className="flex items-start gap-2">
                      <input type="checkbox" id="terms" className="mt-1" />
                      <label htmlFor="terms" className="text-sm text-muted-foreground">
                        I agree to the{" "}
                        <Link to="/terms" className="text-primary hover:underline">
                          Terms & Conditions
                        </Link>{" "}
                        and{" "}
                        <Link to="/privacy" className="text-primary hover:underline">
                          Privacy Policy
                        </Link>
                      </label>
                    </div>

                    <Button className="w-full" size="lg">
                      Create Account
                    </Button>

                    <Button 
                      variant="ghost" 
                      className="w-full"
                      onClick={() => setStep(1)}
                    >
                      Back to Aadhaar Verification
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            <p className="text-center text-sm text-muted-foreground mt-4">
              Already have an account?{" "}
              <Link to="/login" className="text-primary font-medium hover:underline">
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Signup;
