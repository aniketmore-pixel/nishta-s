import { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Lock, User } from "lucide-react";

const Login = () => {
  // --- Form state ---
  const [aadhaar, setAadhaar] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState(1); // 1 = login, 2 = OTP
  const [error, setError] = useState("");

  // --- Handle login (Aadhaar + password) ---
  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    if (!aadhaar || !password) {
      setError("Aadhaar number and password are required");
      return;
    }

    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", {
        aadhar_no: aadhaar,
        password: password,
      });

      if (res.data.message === "OTP sent to registered mobile number") {
        setStep(2);
        alert("OTP sent to your registered mobile number.");
      } else {
        setError(res.data.error || "Login failed");
      }
    } catch (err) {
      setError(err.response?.data?.error || "Server error");
    }
  };

  // --- Handle OTP verification ---
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setError("");

    if (!otp) {
      setError("Please enter the OTP");
      return;
    }

    try {
      const res = await axios.post("http://localhost:5000/api/auth/verify-otp", {
        aadhar_no: aadhaar,
        otp: otp,
      });

      if (res.data.message === "Login successful") {
        alert("Login successful!");
        localStorage.setItem("token", res.data.token); // save JWT
        window.location.href = "/dashboard"; // redirect to dashboard
      } else {
        setError(res.data.error || "OTP verification failed");
      }
    } catch (err) {
      setError(err.response?.data?.error || "Server error");
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <div className="flex-1 bg-muted/30 flex items-center justify-center py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-md mx-auto">
            <Card className="shadow-elevated">
              <CardHeader className="space-y-1">
                <CardTitle className="text-2xl text-center">Welcome Back</CardTitle>
                <CardDescription className="text-center">
                  Sign in to your NBCFDC beneficiary account
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form
                  className="space-y-4"
                  onSubmit={step === 1 ? handleLogin : handleVerifyOtp}
                >
                  {step === 1 && (
                    <>
                      <div className="space-y-2">
                        <Label htmlFor="aadhaar" className="flex items-center gap-2">
                          <User className="h-4 w-4" />
                          Aadhaar Number
                        </Label>
                        <Input
                          id="aadhaar"
                          name="aadhaar_no"
                          placeholder="Enter your Aadhaar"
                          value={aadhaar}
                          onChange={(e) => setAadhaar(e.target.value)}
                        />
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label htmlFor="password" className="flex items-center gap-2">
                            <Lock className="h-4 w-4" />
                            Password
                          </Label>
                          <Link
                            to="/forgot-password"
                            className="text-sm text-primary hover:underline"
                          >
                            Forgot?
                          </Link>
                        </div>
                        <Input
                          id="password"
                          name="password"
                          type="password"
                          placeholder="Enter your password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                        />
                      </div>

                      <Button type="submit" className="w-full" size="lg">
                        Sign In
                      </Button>
                    </>
                  )}

                  {step === 2 && (
                    <>
                      <div className="space-y-2">
                        <Label htmlFor="otp">Enter OTP</Label>
                        <Input
                          id="otp"
                          placeholder="Enter the OTP"
                          value={otp}
                          onChange={(e) => setOtp(e.target.value)}
                        />
                      </div>
                      <Button type="submit" className="w-full" size="lg">
                        Verify OTP
                      </Button>
                    </>
                  )}

                  {error && <p className="text-red-500 text-sm">{error}</p>}

                  {step === 1 && (
                    <>
                      <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                          <span className="w-full border-t" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                          <span className="bg-card px-2 text-muted-foreground">
                            New to NBCFDC?
                          </span>
                        </div>
                      </div>

                      <Link to="/signup">
                        <Button variant="outline" className="w-full">
                          Create New Account
                        </Button>
                      </Link>
                    </>
                  )}
                </form>

                <div className="mt-6 p-4 bg-muted/50 rounded-lg">
                  <p className="text-sm text-center text-muted-foreground">
                    For assistance, call our toll-free helpline
                    <br />
                    <span className="font-semibold text-primary">1800-XXX-XXXX</span>
                  </p>
                </div>
              </CardContent>
            </Card>

            <p className="text-center text-xs text-muted-foreground mt-4">
              This is a secure government portal. Your data is protected.
            </p>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Login;
