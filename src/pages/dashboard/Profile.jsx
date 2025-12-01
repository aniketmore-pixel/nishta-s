import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  User, 
  Home as HomeIcon, 
  Wallet, 
  FileText, 
  CreditCard,
  CheckCircle2,
  Clock,
  DollarSign,
  AlertCircle,
  Shield,
  Link as LinkIcon,
  Upload,
  Zap
} from "lucide-react";
// Placeholder for custom utility functions and hooks
const cn = (...classes) => classes.filter(Boolean).join(' '); // Assuming this merges Tailwind classes
const useToast = () => ({
    toast: ({ title, description, variant }) => {
        console.log(`[TOAST - ${variant || 'default'}] ${title}: ${description}`);
    }
}); 

// --- Zod Schemas (Defined outside the component as per best practice) ---
const basicDetailsSchema = z.object({
  fullName: z.string().min(2, "Name must be at least 2 characters"),
  fatherSpouseName: z.string().min(2, "This field is required"),
  gender: z.enum(["male", "female", "other"]),
  dateOfBirth: z.string().min(1, "Date of birth is required"),
  aadhaar: z.string().length(12, "Aadhaar must be 12 digits"),
  mobile: z.string().length(10, "Mobile number must be 10 digits"),
  email: z.string().email().optional().or(z.literal("")),
  address: z.string().min(10, "Address must be at least 10 characters"),
  district: z.string().min(1, "District is required"),
  state: z.string().min(1, "State is required"),
  category: z.enum(["SC", "ST", "OBC", "Others"]),
  maritalStatus: z.string().optional(),
  educationLevel: z.string().optional(),
});

const incomeDetailsSchema = z.object({
  employmentType: z.enum(["Self-employed", "Salaried", "Labour", "Unemployed"]),
  primaryIncomeSource: z.string().min(2, "This field is required"),
  monthlyIncome: z.string().min(1, "Monthly income is required"),
  secondaryIncome: z.string().optional(),
  householdMembers: z.string().min(1, "This field is required"),
});

const bankDetailsSchema = z.object({
  accountHolderName: z.string().min(2, "Account holder name is required"),
  bankName: z.string().min(2, "Bank name is required"),
  accountNumber: z.string().min(9, "Invalid account number"),
  confirmAccountNumber: z.string().min(9, "Invalid account number"),
  ifscCode: z.string().length(11, "IFSC code must be 11 characters"),
  branchName: z.string().optional(),
  upiId: z.string().optional(),
  consent: z.boolean().refine(val => val === true, "You must give consent"),
}).refine((data) => data.accountNumber === data.confirmAccountNumber, {
  message: "Account numbers don't match",
  path: ["confirmAccountNumber"],
});

const expensesSchema = z.object({
  monthlyHouseholdExpenses: z.string().min(1, "This field is required"),
  monthlyBusinessExpenses: z.string().optional(),
  monthlyLoanRepayments: z.string().optional(),
  electricityBill: z.string().optional(),
  mobileRecharge: z.string().optional(),
  otherUtilities: z.string().optional(),
  commodities: z.array(z.string()).optional(),
  remarks: z.string().optional(),
});

const loanApplicationSchema = z.object({
  loanAmount: z.string().min(1, "Loan amount is required"),
  purpose: z.string().min(10, "Please provide purpose (minimum 10 characters)"),
});

const profileSections = [
  { id: "basic", title: "Basic Details", icon: User, completed: false },
  { id: "income", title: "Income Details", icon: Wallet, completed: false },
  { id: "bank", title: "Bank Details", icon: CreditCard, completed: false },
  { id: "expenses", title: "Expenses & Commodities", icon: HomeIcon, completed: false },
  { id: "documents", title: "Submit Documents", icon: FileText, completed: false },
  { id: "loan", title: "Apply for Loan", icon: DollarSign, completed: false },
];

// // --- Type definitions for state (Crucial for TypeScript safety) ---
// type BasicDetailsForm = z.infer<typeof basicDetailsSchema>;
// type IncomeDetailsForm = z.infer<typeof incomeDetailsSchema>;
// type BankDetailsForm = z.infer<typeof bankDetailsSchema>;
// type ExpensesForm = z.infer<typeof expensesSchema>;
// type LoanApplicationForm = z.infer<typeof loanApplicationSchema>;
// type DocumentState = { file: File | null, verified: boolean, verifying: boolean };
// type BillState = { files: File[], verified: boolean, verifying: boolean }[];
// type BillCategory = 'electricity' | 'mobile' | 'other';
// type AadhaarMethod = 'blockchain' | 'digilocker';

// --- Main Component ---
const Profile = () => {
  const [selectedSection, setSelectedSection] = useState("basic");
  const [completedSections, setCompletedSections] = useState([]);
  const { toast } = useToast();
  const [aadhaarVerified, setAadhaarVerified] = useState(false);
  const [digilockerConnected, setDigilockerConnected] = useState(false);
  const [billApiConnected, setBillApiConnected] = useState(false);
  const [verifyingAadhaar, setVerifyingAadhaar] = useState(false);
  
 // File upload states
const [uploadedBills, setUploadedBills] = useState({
    electricity: [],
    mobile: [],
    other: [],
  });
  
  const [uploadedDocuments, setUploadedDocuments] = useState({
    caste: { file: null, verified: false, verifying: false },
    aadhaar: { file: null, verified: false, verifying: false },
    pan: { file: null, verified: false, verifying: false },
    address: { file: null, verified: false, verifying: false },
    business: { file: null, verified: false, verifying: false },
    signature: { file: null, verified: false, verifying: false },
    selfie: { file: null, verified: false, verifying: false },
  });
  
  
  const completedCount = completedSections.length;
  const progressPercentage = (completedCount / profileSections.length) * 100;

// Initialize React Hook Forms (JSX Version)
const basicForm = useForm({
    resolver: zodResolver(basicDetailsSchema),
    defaultValues: {
      gender: "male",
      category: "SC",
      // ... other defaults ...
    },
  });
  
  const incomeForm = useForm({
    resolver: zodResolver(incomeDetailsSchema),
    defaultValues: {
      employmentType: "Self-employed",
      // ... other defaults ...
    },
  });
  
  const bankForm = useForm({
    resolver: zodResolver(bankDetailsSchema),
    defaultValues: {
      consent: false,
      // ... other defaults ...
    },
  });
  
  const expensesForm = useForm({
    resolver: zodResolver(expensesSchema),
    defaultValues: {
      commodities: [],
      // ... other defaults ...
    },
  });
  
  const loanForm = useForm({
    resolver: zodResolver(loanApplicationSchema),
    defaultValues: {
      loanAmount: "",
      purpose: "",
    },
  });
  
  const [loanAmount, setLoanAmount] = useState(0);
  const [showExpensesForLoan, setShowExpensesForLoan] = useState(false);
  const LOAN_THRESHOLD = 100000; // ₹1 Lakh threshold

  // --- Form Submission Handlers ---

const onBasicSubmit = (data) => {
  console.log("Basic Details:", data);
  if (!completedSections.includes("basic")) {
    setCompletedSections([...completedSections, "basic"]);
  }
  toast({
    title: "Basic Details Saved",
    description: "Your basic information has been saved successfully.",
    variant: "success",
  });
};

const onIncomeSubmit = (data) => {
  console.log("Income Details:", data);
  if (!completedSections.includes("income")) {
    setCompletedSections([...completedSections, "income"]);
  }
  toast({
    title: "Income Details Saved",
    description: "Your income information has been saved successfully.",
    variant: "success",
  });
};

const onBankSubmit = (data) => {
  console.log("Bank Details:", data);
  if (!completedSections.includes("bank")) {
    setCompletedSections([...completedSections, "bank"]);
  }
  toast({
    title: "Bank Details Saved",
    description: "Your bank information has been saved successfully.",
    variant: "success",
  });
};

const onExpensesSubmit = (data) => {
  console.log("Expenses Details:", data);
  if (!completedSections.includes("expenses")) {
    setCompletedSections([...completedSections, "expenses"]);
  }
  toast({
    title: "Expenses Details Saved",
    description: "Your expense information has been saved successfully.",
    variant: "success",
  });
};

  const handleDocumentSubmit = () => {
    if (!aadhaarVerified) {
      toast({
        title: "Aadhaar Verification Required",
        description: "Please verify your Aadhaar card before submitting documents.",
        variant: "destructive",
      });
      return;
    }
    
    if (!completedSections.includes("documents")) {
      setCompletedSections([...completedSections, "documents"]);
    }
    toast({
      title: "Documents Submitted",
      description: "Your documents have been uploaded successfully.",
      variant: 'success'
    });
  };
const handleAadhaarVerification = async (method) => {
    setVerifyingAadhaar(true);
  
    setTimeout(() => {
      setVerifyingAadhaar(false);
      setAadhaarVerified(true);
  
      if (method === "digilocker") {
        setDigilockerConnected(true);
      }
  
      toast({
        title: "Aadhaar Verified Successfully",
        description: `Your Aadhaar has been verified using ${
          method === "blockchain" ? "blockchain" : "DigiLocker"
        }.`,
        variant: "success",
      });
    }, 2000);
  };
  
  const handleBillApiConnect = () => {
    setTimeout(() => {
      setBillApiConnected(true);
  
      toast({
        title: "API Connected Successfully",
        description: "Your bill payment accounts have been linked.",
        variant: "success",
      });
    }, 1500);
  };
  
  const handleBillUpload = (type, files) => {
    if (!files || files.length === 0) return;
  
    const fileArray = Array.from(files);
    const newBills = fileArray.map((file) => ({
      files: [file],
      verified: false,
      verifying: false,
    }));
  
    setUploadedBills((prev) => ({
      ...prev,
      [type]: [...prev[type], ...newBills],
    }));
  
    toast({
      title: "Files Uploaded",
      description: `${fileArray.length} file(s) uploaded. Click verify to authenticate.`,
    });
  };
  
  const handleVerifyBills = (type) => {
    const bills = uploadedBills[type];
  
    if (bills.length === 0) {
      toast({
        title: "No Files to Verify",
        description: "Please upload files first.",
        variant: "destructive",
      });
      return;
    }
  
    setUploadedBills((prev) => ({
      ...prev,
      [type]: prev[type].map((bill) => ({ ...bill, verifying: true })),
    }));
  
    setTimeout(() => {
      setUploadedBills((prev) => ({
        ...prev,
        [type]: prev[type].map((bill) => ({
          ...bill,
          verified: true,
          verifying: false,
        })),
      }));
  
      toast({
        title: "Bills Verified Successfully",
        description: `All ${type} bills have been verified and authenticated.`,
        variant: "success",
      });
    }, 2000);
  };
  
  const handleDocumentUpload = (docType, file) => {
    if (!file) return;
  
    setUploadedDocuments((prev) => ({
      ...prev,
      [docType]: { file, verified: false, verifying: true },
    }));
  
    setTimeout(() => {
      setUploadedDocuments((prev) => ({
        ...prev,
        [docType]: { ...prev[docType], verified: true, verifying: false },
      }));
  
      toast({
        title: "Document Verified",
        description: `${docType} document has been verified successfully.`,
        variant: "success",
      });
    }, 2000);
  };
  
  const onLoanSubmit = (data) => {
    console.log("Loan Application:", data);
  
    const amount = parseFloat(data.loanAmount);
  
    if (amount > LOAN_THRESHOLD && !showExpensesForLoan) {
      setLoanAmount(amount);
      setShowExpensesForLoan(true);
  
      toast({
        title: "Additional Information Required",
        description: `For loans above ₹${(LOAN_THRESHOLD / 1000).toFixed(
          0
        )}K, please fill expenses & commodities details below.`,
        variant: "default",
      });
  
      return;
    }
  
    if (!completedSections.includes("loan")) {
      setCompletedSections([...completedSections, "loan"]);
    }
  
    toast({
      title: "Loan Application Submitted",
      description:
        "Your loan application has been submitted for review. Processing will begin shortly.",
      variant: "success",
    });
  };
  
  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-primary mb-2">Complete Your Profile 🚀</h1>
        <p className="text-muted-foreground">Fill all sections to maximize your credit score and loan eligibility</p>
      </div>

      {/* Progress Bar */}
      <Card className="shadow-lg mb-8">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Profile Completeness</span>
            <span className="text-sm font-bold text-primary">{progressPercentage.toFixed(0)}%</span>
          </div>
          <Progress value={progressPercentage} className="h-3 bg-gray-200" />
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-[200px_1fr] gap-8">
        
        {/* Section Navigation (Sidebar style) */}
        <div className="flex flex-col gap-2 p-2 sticky top-4 self-start">
          {profileSections.map((section) => (
            <button
              key={section.id}
              onClick={() => setSelectedSection(section.id)}
              className={cn(
                "flex items-center gap-3 p-3 rounded-lg transition-all text-left w-full hover:bg-muted/50",
                selectedSection === section.id
                  ? "bg-primary/10 text-primary border-r-4 border-primary font-semibold"
                  : "text-muted-foreground"
              )}
            >
              <section.icon className={cn("h-5 w-5", completedSections.includes(section.id) && "text-success")} />
              <span className="text-sm flex-1">{section.title}</span>
              {completedSections.includes(section.id) && <CheckCircle2 className="h-4 w-4 text-success" />}
            </button>
          ))}
        </div>

        {/* Form Content Area */}
        <Card className="shadow-lg min-h-[500px]">
          <CardHeader className="border-b">
            <CardTitle>
              {profileSections.find(s => s.id === selectedSection)?.title}
            </CardTitle>
            <CardDescription>
              Complete this section to improve your loan eligibility
            </CardDescription>
          </CardHeader>
          <CardContent className="py-6 max-h-[calc(600px)] overflow-y-auto">
            {/* Basic Details Form */}
            {selectedSection === "basic" && (
              <Form {...basicForm}>
                <form onSubmit={basicForm.handleSubmit(onBasicSubmit)} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <FormField control={basicForm.control} name="fullName" render={({ field }) => (<FormItem><FormLabel>Full Name *</FormLabel><FormControl><Input placeholder="Enter full name" {...field} /></FormControl><FormMessage /></FormItem>)}/>
                    <FormField control={basicForm.control} name="fatherSpouseName" render={({ field }) => (<FormItem><FormLabel>Father's / Spouse's Name *</FormLabel><FormControl><Input placeholder="Enter name" {...field} /></FormControl><FormMessage /></FormItem>)}/>
                  </div>

                  <FormField control={basicForm.control} name="gender" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Gender *</FormLabel>
                      <FormControl>
                        <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex gap-4">
                          <div className="flex items-center space-x-2"><RadioGroupItem value="male" id="male" /><Label htmlFor="male">Male</Label></div>
                          <div className="flex items-center space-x-2"><RadioGroupItem value="female" id="female" /><Label htmlFor="female">Female</Label></div>
                          <div className="flex items-center space-x-2"><RadioGroupItem value="other" id="other" /><Label htmlFor="other">Other</Label></div>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}/>

                  <div className="grid md:grid-cols-2 gap-4">
                    <FormField control={basicForm.control} name="dateOfBirth" render={({ field }) => (<FormItem><FormLabel>Date of Birth *</FormLabel><FormControl><Input type="date" {...field} /></FormControl><FormMessage /></FormItem>)}/>
                    <FormField control={basicForm.control} name="aadhaar" render={({ field }) => (<FormItem><FormLabel>Aadhaar Number *</FormLabel><FormControl><Input placeholder="Enter 12-digit Aadhaar" maxLength={12} {...field} /></FormControl><FormMessage /></FormItem>)}/>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <FormField control={basicForm.control} name="mobile" render={({ field }) => (<FormItem><FormLabel>Mobile Number *</FormLabel><FormControl><Input placeholder="Enter 10-digit mobile" maxLength={10} {...field} /></FormControl><FormMessage /></FormItem>)}/>
                    <FormField control={basicForm.control} name="email" render={({ field }) => (<FormItem><FormLabel>Email ID (Optional)</FormLabel><FormControl><Input type="email" placeholder="Enter email" {...field} /></FormControl><FormMessage /></FormItem>)}/>
                  </div>

                  <FormField control={basicForm.control} name="address" render={({ field }) => (<FormItem><FormLabel>Address *</FormLabel><FormControl><Textarea placeholder="Enter complete address" {...field} /></FormControl><FormMessage /></FormItem>)}/>

                  <div className="grid md:grid-cols-2 gap-4">
                    <FormField control={basicForm.control} name="district" render={({ field }) => (<FormItem><FormLabel>District *</FormLabel><FormControl><Input placeholder="Enter district" {...field} /></FormControl><FormMessage /></FormItem>)}/>
                    <FormField control={basicForm.control} name="state" render={({ field }) => (<FormItem><FormLabel>State *</FormLabel><FormControl><Input placeholder="Enter state" {...field} /></FormControl><FormMessage /></FormItem>)}/>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <FormField control={basicForm.control} name="category" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Category *</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl><SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger></FormControl>
                          <SelectContent>
                            <SelectItem value="SC">SC</SelectItem><SelectItem value="ST">ST</SelectItem>
                            <SelectItem value="OBC">OBC</SelectItem><SelectItem value="Others">Others</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}/>

                    <FormField control={basicForm.control} name="maritalStatus" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Marital Status (Optional)</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl><SelectTrigger><SelectValue placeholder="Select status" /></SelectTrigger></FormControl>
                          <SelectContent>
                            <SelectItem value="single">Single</SelectItem><SelectItem value="married">Married</SelectItem>
                            <SelectItem value="divorced">Divorced</SelectItem><SelectItem value="widowed">Widowed</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}/>
                </div>

                <FormField control={basicForm.control} name="educationLevel" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Education Level (Optional)</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl><SelectTrigger><SelectValue placeholder="Select education level" /></SelectTrigger></FormControl>
                      <SelectContent>
                        <SelectItem value="below-10th">Below 10th</SelectItem><SelectItem value="10th">10th Pass</SelectItem>
                        <SelectItem value="12th">12th Pass</SelectItem><SelectItem value="graduate">Graduate</SelectItem>
                        <SelectItem value="postgraduate">Post Graduate</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}/>

                <Button type="submit" className="w-full">Save Basic Details</Button>
              </form>
            </Form>
          )}

          {/* Income Details Form */}
          {selectedSection === "income" && (
            <Form {...incomeForm}>
              <form onSubmit={incomeForm.handleSubmit(onIncomeSubmit)} className="space-y-6">
                <FormField control={incomeForm.control} name="employmentType" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Employment Type *</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl><SelectTrigger><SelectValue placeholder="Select employment type" /></SelectTrigger></FormControl>
                        <SelectContent>
                          <SelectItem value="Self-employed">Self-employed</SelectItem><SelectItem value="Salaried">Salaried</SelectItem>
                          <SelectItem value="Labour">Labour</SelectItem><SelectItem value="Unemployed">Unemployed</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}/>

                <FormField control={incomeForm.control} name="primaryIncomeSource" render={({ field }) => (<FormItem><FormLabel>Primary Income Source *</FormLabel><FormControl><Input placeholder="e.g., Small Business, Daily Wage" {...field} /></FormControl><FormMessage /></FormItem>)}/>

                <div className="grid md:grid-cols-2 gap-4">
                  <FormField control={incomeForm.control} name="monthlyIncome" render={({ field }) => (<FormItem><FormLabel>Monthly Income (₹) *</FormLabel><FormControl><Input type="number" placeholder="Enter amount" {...field} /></FormControl><FormMessage /></FormItem>)}/>
                  <FormField control={incomeForm.control} name="secondaryIncome" render={({ field }) => (<FormItem><FormLabel>Secondary Income (₹) (Optional)</FormLabel><FormControl><Input type="number" placeholder="Enter amount" {...field} /></FormControl><FormMessage /></FormItem>)}/>
                </div>

                <FormField control={incomeForm.control} name="householdMembers" render={({ field }) => (<FormItem><FormLabel>Household Members Contributing to Income *</FormLabel><FormControl><Input type="number" placeholder="Enter number" {...field} /></FormControl><FormMessage /></FormItem>)}/>

                <div className="p-4 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground">
                    💡 Tip: Providing accurate income details helps improve your credit score accuracy and loan eligibility.
                  </p>
                </div>

                <div className="space-y-2">
                  <Label>Upload Income Proof (Optional)</Label>
                  <Input type="file" accept=".pdf,.jpg,.jpeg,.png" />
                  <p className="text-xs text-muted-foreground">Upload payslip, sale receipt, or income certificate</p>
                </div>

                <Button type="submit" className="w-full">Save Income Details</Button>
              </form>
            </Form>
          )}

          {/* Bank Details Form */}
          {selectedSection === "bank" && (
            <Form {...bankForm}>
              <form onSubmit={bankForm.handleSubmit(onBankSubmit)} className="space-y-6">
                <FormField control={bankForm.control} name="accountHolderName" render={({ field }) => (<FormItem><FormLabel>Account Holder Name *</FormLabel><FormControl><Input placeholder="Must match Aadhaar name" {...field} /></FormControl><FormMessage /></FormItem>)}/>
                <FormField control={bankForm.control} name="bankName" render={({ field }) => (<FormItem><FormLabel>Bank Name *</FormLabel><FormControl><Input placeholder="Enter bank name" {...field} /></FormControl><FormMessage /></FormItem>)}/>

                <div className="grid md:grid-cols-2 gap-4">
                  <FormField control={bankForm.control} name="accountNumber" render={({ field }) => (<FormItem><FormLabel>Account Number *</FormLabel><FormControl><Input placeholder="Enter account number" {...field} /></FormControl><FormMessage /></FormItem>)}/>
                  <FormField control={bankForm.control} name="confirmAccountNumber" render={({ field }) => (<FormItem><FormLabel>Confirm Account Number *</FormLabel><FormControl><Input placeholder="Re-enter account number" {...field} /></FormControl><FormMessage /></FormItem>)}/>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <FormField control={bankForm.control} name="ifscCode" render={({ field }) => (<FormItem><FormLabel>IFSC Code *</FormLabel><FormControl><Input placeholder="Enter 11-character IFSC" maxLength={11} {...field} /></FormControl><FormMessage /></FormItem>)}/>
                  <FormField control={bankForm.control} name="branchName" render={({ field }) => (<FormItem><FormLabel>Branch Name (Optional)</FormLabel><FormControl><Input placeholder="Enter branch name" {...field} /></FormControl><FormMessage /></FormItem>)}/>
                </div>

                <FormField control={bankForm.control} name="upiId" render={({ field }) => (<FormItem><FormLabel>UPI ID (Optional)</FormLabel><FormControl><Input placeholder="yourname@upi" {...field} /></FormControl><FormMessage /></FormItem>)}/>

                <div className="space-y-2">
                  <Label>Passbook Copy / Bank Statement (Optional)</Label>
                  <Input type="file" accept=".pdf,.jpg,.jpeg,.png" />
                </div>

                <FormField control={bankForm.control} name="consent" render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                      <FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>I authorize NBCFDC to verify my bank details *</FormLabel>
                        <FormMessage />
                      </div>
                    </FormItem>
                  )}/>

                <Button type="submit" className="w-full">Save Bank Details</Button>
              </form>
            </Form>
          )}

          {/* Expenses & Commodities Form */}
          {selectedSection === "expenses" && (
            <div className="space-y-6">
              <Form {...expensesForm}>
                <form onSubmit={expensesForm.handleSubmit(onExpensesSubmit)} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <FormField control={expensesForm.control} name="monthlyHouseholdExpenses" render={({ field }) => (<FormItem><FormLabel>Monthly Household Expenses (₹) *</FormLabel><FormControl><Input type="number" placeholder="Enter amount" {...field} /></FormControl><FormMessage /></FormItem>)}/>
                    <FormField control={expensesForm.control} name="monthlyBusinessExpenses" render={({ field }) => (<FormItem><FormLabel>Monthly Business Expenses (₹)</FormLabel><FormControl><Input type="number" placeholder="Enter amount" {...field} /></FormControl><FormMessage /></FormItem>)}/>
                  </div>

                  <FormField control={expensesForm.control} name="monthlyLoanRepayments" render={({ field }) => (<FormItem><FormLabel>Monthly Loan Repayments (₹) (if any)</FormLabel><FormControl><Input type="number" placeholder="Enter amount" {...field} /></FormControl><FormMessage /></FormItem>)}/>

                  <FormField control={expensesForm.control} name="commodities" render={({ field }) => (
                      <FormItem>
                        <div className="mb-4"><FormLabel>Commodities Owned (Optional)</FormLabel></div>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                          {["TV", "Refrigerator", "Washing Machine", "Vehicle", "Tractor", "Smartphone"].map((item) => (
                            <FormItem key={item} className="flex flex-row items-start space-x-3 space-y-0">
                              <FormControl>
                                <Checkbox
                                  checked={field.value?.includes(item)}
                                  onCheckedChange={(checked) => {
                                    return checked ? field.onChange([...(field.value || []), item]) : field.onChange(field.value?.filter((value) => value !== item));
                                  }}
                                />
                              </FormControl>
                              <FormLabel className="font-normal">{item}</FormLabel>
                            </FormItem>
                          ))}
                        </div>
                        <FormMessage />
                      </FormItem>
                  )}/>

                  {/* Bill Submission Options */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold flex items-center gap-2">
                      <Zap className="h-5 w-5 text-primary" />
                      Utility Bill Verification
                    </h3>
                    
                    <Tabs defaultValue="upload" className="w-full">
                      <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="upload"><Upload className="h-4 w-4 mr-2" />Upload Bills</TabsTrigger>
                        <TabsTrigger value="api"><LinkIcon className="h-4 w-4 mr-2" />Connect via API</TabsTrigger>
                      </TabsList>
                      
                      <TabsContent value="upload" className="space-y-4">
                        <div className="p-4 bg-muted rounded-lg space-y-6">
                          <p className="text-sm text-muted-foreground">Upload your recent utility bills for verification. This helps improve your credit score accuracy.</p>
                          
                          {/* Electricity Bills */}
                          <div className="space-y-3">
                            <Label>Electricity Bills (Last 3 months)</Label>
                            <Input type="file" accept=".pdf,.jpg,.jpeg,.png" multiple onChange={(e) => handleBillUpload('electricity', e.target.files)}/>
                            {uploadedBills.electricity.length > 0 && (
                              <div className="space-y-2 mt-3">
                                {uploadedBills.electricity.map((bill, idx) => (
                                  <div key={idx} className="flex items-center gap-2 p-3 bg-background rounded-lg border">
                                    <FileText className="h-4 w-4 text-muted-foreground" />
                                    <span className="text-sm flex-1">{bill.files[0]?.name}</span>
                                    {bill.verifying ? (<div className="flex items-center gap-2 text-primary"><Clock className="h-4 w-4 animate-spin" /><span className="text-xs">Verifying...</span></div>) : 
                                    (bill.verified ? (<div className="flex items-center gap-1 text-success"><CheckCircle2 className="h-4 w-4" /><span className="text-xs font-medium">Verified</span></div>) : 
                                    (<span className="text-xs text-muted-foreground">Pending</span>))}
                                  </div>
                                ))}
                                {!uploadedBills.electricity.every(b => b.verified) && (
                                  <Button type="button" size="sm" onClick={() => handleVerifyBills('electricity')} disabled={uploadedBills.electricity.some(b => b.verifying)} className="mt-2">
                                    <Shield className="h-4 w-4 mr-2" />Verify All Electricity Bills
                                  </Button>
                                )}
                              </div>
                            )}
                          </div>

                          {/* Mobile Recharge Bills */}
                          <div className="space-y-3">
                            <Label>Mobile Recharge Bills</Label>
                            <Input type="file" accept=".pdf,.jpg,.jpeg,.png" multiple onChange={(e) => handleBillUpload('mobile', e.target.files)}/>
                            {uploadedBills.mobile.length > 0 && (
                              <div className="space-y-2 mt-3">
                                {uploadedBills.mobile.map((bill, idx) => (
                                  <div key={idx} className="flex items-center gap-2 p-3 bg-background rounded-lg border">
                                    <FileText className="h-4 w-4 text-muted-foreground" />
                                    <span className="text-sm flex-1">{bill.files[0]?.name}</span>
                                    {bill.verifying ? (<div className="flex items-center gap-2 text-primary"><Clock className="h-4 w-4 animate-spin" /><span className="text-xs">Verifying...</span></div>) : 
                                    (bill.verified ? (<div className="flex items-center gap-1 text-success"><CheckCircle2 className="h-4 w-4" /><span className="text-xs font-medium">Verified</span></div>) : 
                                    (<span className="text-xs text-muted-foreground">Pending</span>))}
                                  </div>
                                ))}
                                {!uploadedBills.mobile.every(b => b.verified) && (
                                  <Button type="button" size="sm" onClick={() => handleVerifyBills('mobile')} disabled={uploadedBills.mobile.some(b => b.verifying)} className="mt-2">
                                    <Shield className="h-4 w-4 mr-2" />Verify All Mobile Bills
                                  </Button>
                                )}
                              </div>
                            )}
                          </div>

                          {/* Other Utility Bills */}
                          <div className="space-y-3">
                            <Label>Water/Gas Bills (Optional)</Label>
                            <Input type="file" accept=".pdf,.jpg,.jpeg,.png" multiple onChange={(e) => handleBillUpload('other', e.target.files)}/>
                            {uploadedBills.other.length > 0 && (
                              <div className="space-y-2 mt-3">
                                {uploadedBills.other.map((bill, idx) => (
                                  <div key={idx} className="flex items-center gap-2 p-3 bg-background rounded-lg border">
                                    <FileText className="h-4 w-4 text-muted-foreground" />
                                    <span className="text-sm flex-1">{bill.files[0]?.name}</span>
                                    {bill.verifying ? (<div className="flex items-center gap-2 text-primary"><Clock className="h-4 w-4 animate-spin" /><span className="text-xs">Verifying...</span></div>) : 
                                    (bill.verified ? (<div className="flex items-center gap-1 text-success"><CheckCircle2 className="h-4 w-4" /><span className="text-xs font-medium">Verified</span></div>) : 
                                    (<span className="text-xs text-muted-foreground">Pending</span>))}
                                  </div>
                                ))}
                                {!uploadedBills.other.every(b => b.verified) && (
                                  <Button type="button" size="sm" onClick={() => handleVerifyBills('other')} disabled={uploadedBills.other.some(b => b.verifying)} className="mt-2">
                                    <Shield className="h-4 w-4 mr-2" />Verify All Other Bills
                                  </Button>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      </TabsContent>
                      
                      <TabsContent value="api" className="space-y-4">
                        <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg space-y-4">
                          <div className="flex items-start gap-3">
                            <LinkIcon className="h-5 w-5 text-primary mt-0.5" />
                            <div>
                              <h4 className="font-semibold text-primary mb-1">Connect Your Accounts</h4>
                              <p className="text-sm text-muted-foreground">Give us secure access to automatically fetch your bill payment history. This is faster and more accurate than manual uploads.</p>
                            </div>
                          </div>

                          {billApiConnected ? (
                            <div className="p-4 bg-success/10 border border-success rounded-lg">
                              <div className="flex items-center gap-2 text-success mb-2"><CheckCircle2 className="h-5 w-5" /><span className="font-semibold">Connected Successfully</span></div>
                              <p className="text-sm text-muted-foreground">We're now able to fetch your bill payment data automatically.</p>
                              <Button type="button" variant="outline" size="sm" className="mt-3" onClick={() => setBillApiConnected(false)}>Disconnect</Button>
                            </div>
                          ) : (
                            <div className="space-y-4">
                              <div className="flex items-start space-x-3 p-3 rounded-md border">
                                <Checkbox id="api-consent" />
                                <div className="space-y-1 leading-none">
                                  <label htmlFor="api-consent" className="text-sm font-medium cursor-pointer">I authorize secure access to my utility bill accounts</label>
                                  <p className="text-xs text-muted-foreground">Your data is encrypted and will only be used for credit assessment</p>
                                </div>
                              </div>
                              <div className="grid gap-3">
                                <Button type="button" variant="outline" className="w-full justify-start" onClick={handleBillApiConnect}><Zap className="h-4 w-4 mr-2" />Connect Electricity Provider</Button>
                                <Button type="button" variant="outline" className="w-full justify-start" onClick={handleBillApiConnect}><LinkIcon className="h-4 w-4 mr-2" />Connect Mobile Operator</Button>
                              </div>
                            </div>
                          )}
                        </div>
                      </TabsContent>
                    </Tabs>
                  </div>

                  <FormField control={expensesForm.control} name="remarks" render={({ field }) => (<FormItem><FormLabel>Remarks (Optional)</FormLabel><FormControl><Textarea placeholder="Any additional information" {...field} /></FormControl><FormMessage /></FormItem>)}/>

                  <div className="p-4 bg-muted rounded-lg">
                    <p className="text-sm text-muted-foreground">💡 Tip: This data helps us calculate your Income vs Expense Ratio for accurate credit assessment.</p>
                  </div>

                  <Button type="submit" className="w-full">Save Expense Details</Button>
                </form>
              </Form>
            </div>
          )}

          {/* Submit Documents Form */}
          {selectedSection === "documents" && (
            <div className="space-y-6">
              {/* Aadhaar Verification Section */}
              <div className="p-6 bg-primary/5 border-2 border-primary/20 rounded-lg">
                <div className="flex items-start gap-3 mb-4">
                  <Shield className="h-6 w-6 text-primary mt-0.5" />
                  <div>
                    <h3 className="text-lg font-semibold text-primary mb-1">Aadhaar Verification</h3>
                    <p className="text-sm text-muted-foreground">Verify your Aadhaar card using secure blockchain technology or DigiLocker</p>
                  </div>
                </div>

                {aadhaarVerified ? (
                  <div className="p-4 bg-success/10 border border-success rounded-lg">
                    <div className="flex items-center gap-2 text-success mb-2"><CheckCircle2 className="h-5 w-5" /><span className="font-semibold">Aadhaar Verified Successfully</span></div>
                    <p className="text-sm text-muted-foreground">Your Aadhaar has been verified and authenticated.{digilockerConnected && " DigiLocker connected."}</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Aadhaar Number *</Label>
                      <Input type="text" placeholder="Enter 12-digit Aadhaar number" maxLength={12}/>
                    </div>

                    <div className="grid md:grid-cols-2 gap-3">
                      <Button type="button" variant="default" onClick={() => handleAadhaarVerification('blockchain')} disabled={verifyingAadhaar}>
                        <Shield className="h-4 w-4 mr-2" />
                        {verifyingAadhaar ? "Verifying..." : "Verify via Blockchain"}
                      </Button>
                      <Button type="button" variant="secondary" onClick={() => handleAadhaarVerification('digilocker')} disabled={verifyingAadhaar}>
                        <LinkIcon className="h-4 w-4 mr-2" />
                        {verifyingAadhaar ? "Connecting..." : "Connect DigiLocker"}
                      </Button>
                    </div>

                    <div className="p-3 bg-muted rounded-lg">
                      <p className="text-xs text-muted-foreground">
                        <strong>Blockchain Verification:</strong> Uses decentralized technology for instant, secure verification.<br />
                        <strong>DigiLocker:</strong> Connect your DigiLocker account to fetch verified documents automatically.
                      </p>
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-6">
                {/* Document Upload Fields */}
                {Object.keys(uploadedDocuments).map(docType => (
                    <div key={docType} className="space-y-3">
                        <Label>{docType.charAt(0).toUpperCase() + docType.slice(1).replace(/([A-Z])/g, ' $1')} {docType === 'caste' || docType === 'signature' ? '*' : '(Optional)'}</Label>
                        <Input type="file" accept={docType === 'signature' || docType === 'selfie' ? ".jpg,.jpeg,.png" : ".pdf,.jpg,.jpeg,.png"} onChange={(e) => e.target.files && handleDocumentUpload(docType, e.target.files[0])}/>
                        <p className="text-xs text-muted-foreground">
                            {docType === 'caste' && 'Required for eligibility verification'}
                            {docType === 'pan' && 'Recommended for higher loan amounts'}
                            {docType === 'address' && 'Electricity bill, ration card, or voter ID'}
                            {docType === 'business' && 'Shop license, GST certificate, or business registration'}
                            {docType === 'signature' && 'Clear image of your signature on white paper'}
                            {docType === 'selfie' && 'Recent photograph for identity verification'}
                            {docType === 'aadhaar' && 'Aadhaar copy (optional if verified via API/Blockchain)'}
                        </p>
                        
                        {uploadedDocuments[docType].file && (
                            <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
                                <FileText className="h-4 w-4 text-muted-foreground" />
                                <span className="text-sm flex-1">{uploadedDocuments[docType].file?.name}</span>
                                {uploadedDocuments[docType].verifying ? (<div className="flex items-center gap-2 text-primary"><Clock className="h-4 w-4 animate-spin" /><span className="text-xs">Verifying...</span></div>) : 
                                (uploadedDocuments[docType].verified ? (<div className="flex items-center gap-1 text-success"><CheckCircle2 className="h-4 w-4" /><span className="text-xs font-medium">Verified</span></div>) : 
                                (<span className="text-xs text-muted-foreground">Pending</span>))}
                            </div>
                        )}
                    </div>
                ))}
              </div>

              <div className="p-4 bg-accent/10 border border-accent rounded-lg">
                <p className="text-sm font-medium text-accent mb-2">📌 Important Guidelines:</p>
                <ul className="text-xs space-y-1 text-muted-foreground list-disc list-inside">
                  <li>All documents should be clear and readable</li>
                  <li>File size should not exceed 5MB per document</li>
                  <li>Accepted formats: PDF, JPG, PNG</li>
                  <li>Ensure all information is visible without blur</li>
                </ul>
              </div>

              <Button onClick={handleDocumentSubmit} className="w-full">Submit Documents for Final Review</Button>
            </div>
          )}

          {/* Apply for Loan Form */}
          {selectedSection === "loan" && (
            <Form {...loanForm}>
              <form onSubmit={loanForm.handleSubmit(onLoanSubmit)} className="space-y-6">
                <div className="p-4 bg-primary/5 rounded-lg border border-primary/10">
                  <p className="text-sm font-medium text-primary mb-2">💰 Loan Eligibility Calculator</p>
                  <p className="text-xs text-muted-foreground">Enter your desired loan amount and purpose. For amounts above ₹1 Lakh, additional expense details will be required.</p>
                </div>

                <FormField control={loanForm.control} name="loanAmount" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Desired Loan Amount (₹) *</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="Enter amount (e.g., 50000)" {...field} onChange={(e) => {
                            field.onChange(e);
                            const amount = parseFloat(e.target.value) || 0;
                            setLoanAmount(amount);
                          }}
                        />
                      </FormControl>
                      <p className="text-xs text-muted-foreground">
                        {loanAmount > LOAN_THRESHOLD ? (
                          <span className="text-accent font-medium">⚠️ Amount above ₹{(LOAN_THRESHOLD / 1000).toFixed(0)}K - Additional details required</span>
                        ) : (
                          <span className="text-success font-medium">✓ Amount within basic eligibility</span>
                        )}
                      </p>
                      <FormMessage />
                    </FormItem>
                  )}/>

                <FormField control={loanForm.control} name="purpose" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Purpose of Loan *</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Describe how you will use this loan (e.g., business expansion, medical expenses, education)" className="min-h-[100px]" {...field}/>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}/>

                {/* Show expense form if amount > threshold */}
                {showExpensesForLoan && loanAmount > LOAN_THRESHOLD && (
                  <div className="space-y-6 p-6 border-2 border-accent rounded-lg bg-accent/5">
                    <div className="flex items-center gap-2 text-accent"><AlertCircle className="h-5 w-5" /><h3 className="font-semibold">Additional Financial Information Required</h3></div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2"><Label>Monthly Household Expenses (₹) *</Label><Input type="number" placeholder="e.g., 15000" required /></div>
                      <div className="space-y-2"><Label>Monthly Business Expenses (₹)</Label><Input type="number" placeholder="e.g., 10000" /></div>
                      <div className="space-y-2"><Label>Existing Loan Repayments (₹/month)</Label><Input type="number" placeholder="e.g., 5000" /></div>
                      <div className="space-y-2"><Label>Electricity Bill (₹/month)</Label><Input type="number" placeholder="e.g., 1200" /></div>
                    </div>

                    <div className="space-y-2">
                      <Label>Commodities Owned</Label>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {["TV", "Refrigerator", "Washing Machine", "Two-Wheeler", "Four-Wheeler", "Tractor"].map((item) => (
                          <div key={item} className="flex items-center space-x-2"><Checkbox id={`loan-${item}`} /><label htmlFor={`loan-${item}`} className="text-sm cursor-pointer">{item}</label></div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                <div className="p-4 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground">💡 Tip: Make sure all previous profile sections are completed for faster loan approval.</p>
                </div>

                <Button type="submit" className="w-full" size="lg">
                  Submit Loan Application
                </Button>
              </form>
            </Form>
          )}
        </CardContent>
      </Card>
    </div>
  </div>
  );
};

export default Profile;