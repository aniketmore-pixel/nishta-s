import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Lock, User } from "lucide-react";

const Login = () => {
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
                <form className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="username" className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      Aadhaar Number / Email
                    </Label>
                    <Input
                      id="username"
                      placeholder="Enter your Aadhaar or email"
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
                      type="password"
                      placeholder="Enter your password"
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <input type="checkbox" id="remember" />
                    <label htmlFor="remember" className="text-sm text-muted-foreground">
                      Remember me for 30 days
                    </label>
                  </div>

                  <Button className="w-full" size="lg">
                    Sign In
                  </Button>

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
