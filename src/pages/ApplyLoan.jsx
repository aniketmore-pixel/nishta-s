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
  User2,
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
  Zap,
  BadgeCheck
} from "lucide-react";

// small helpers
const cn = (...classes) => classes.filter(Boolean).join(' ');
const useToast = () => ({
  toast: ({ title, description, variant }) => {
    console.log(`[TOAST - ${variant || 'default'}] ${title}: ${description}`);
  }
});

// Zod schemas (Basic Details schema removed)
// The original basicDetailsSchema is commented out/removed as per request.

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

const enrolledSchemesSchema = z.object({
  enrolledMgnrega: z.enum(["Yes", "No"], {
    required_error: "Please select an option",
  }),
  enrolledPmUjjwala: z.enum(["Yes", "No"], {
    required_error: "Please select an option",
  }),
  enrolledPmJay: z.enum(["Yes", "No"], {
    required_error: "Please select an option",
  }),
  enrolledPensionScheme: z.enum(["Yes", "No"], {
    required_error: "Please select an option",
  }),
});



// Modified profile sections (Basic Details removed)
const profileSections = [
  { id: "income", title: "Income & Asset Details", icon: Wallet, completed: false },
  { id: "bank", title: "Bank Details", icon: CreditCard, completed: false },
  { id: "expenses", title: "Expenses & Commodities", icon: HomeIcon, completed: false },
  { id: "House Hold and Ration Card Detail", title: "House Hold and Ration Card Detail", icon: FileText, completed: false },
  { id: "loan", title: "Apply for Loan", icon: DollarSign, completed: false },
 // ⭐ NEW SECTION ADDED HERE
   { id: "schemes", title: "Enrolled Schemes", icon: FileText, completed: false }, // NEW
];

const ApplyLoan = () => {
  // Start on the first remaining section
  const [selectedSection, setSelectedSection] = useState("income");
  const [completedSections, setCompletedSections] = useState([]);
  const { toast } = useToast();
  const [aadhaarVerified, setAadhaarVerified] = useState(false);
  const [digilockerConnected, setDigilockerConnected] = useState(false);
  const [billApiConnected, setBillApiConnected] = useState(false);
  const [verifyingAadhaar, setVerifyingAadhaar] = useState(false);
  const [rationFetched, setRationFetched] = useState(false);
  const [fetchingRation, setFetchingRation] = useState(false);
  const [rationNumber, setRationNumber] = useState("");
  const [rationError, setRationError] = useState("");

  const [rationDetails, setRationDetails] = useState({
    householdSize: "",
    dependentCount: "",
    earnersCount: "",
    dependencyRatio: "",
    rationCategory: ""
  });

  // For SECC
  const [seccFetched, setSeccFetched] = useState(false);
  const [fetchingSECC, setFetchingSECC] = useState(false);
  const [seccDetails, setSeccDetails] = useState({
    category: "",
    score: ""
  });


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

  // forms
  // basicForm removed

  const incomeForm = useForm({
    resolver: zodResolver(incomeDetailsSchema),
    defaultValues: {
      employmentType: "Self-employed",
    },
  });

  const bankForm = useForm({
    resolver: zodResolver(bankDetailsSchema),
    defaultValues: {
      consent: false,
    },
  });

  const expensesForm = useForm({
    resolver: zodResolver(expensesSchema),
    defaultValues: {
      commodities: [],
    },
  });

  const loanForm = useForm({
    resolver: zodResolver(loanApplicationSchema),
    defaultValues: {
      loanAmount: "",
      purpose: "",
    },
  });

 const enrolledSchemesForm = useForm({
  resolver: zodResolver(enrolledSchemesSchema),
  defaultValues: {
    enrolledMgnrega: "",
    enrolledPmUjjwala: "",
    enrolledPmJay: "",
    enrolledPensionScheme: "",
  },
});



const onEnrolledSchemesSubmit = (values) => {
  console.log("Enrolled schemes data:", values);
  // TODO: call your backend API here
};




  

  const [loanAmount, setLoanAmount] = useState(0);
  const [showExpensesForLoan, setShowExpensesForLoan] = useState(false);
  const LOAN_THRESHOLD = 100000; // ₹1 Lakh

  // handlers (onBasicSubmit removed)
  // const onBasicSubmit = (data) => { /* ... removed */ };

  const onIncomeSubmit = (data) => {
    console.log("Income Income & Asset Details:", data);
    if (!completedSections.includes("income")) setCompletedSections([...completedSections, "income"]);
    toast({ title: "Income Income & Asset Details Saved", description: "Your income information has been saved successfully.", variant: "success" });
  };

  const onBankSubmit = (data) => {
    console.log("Bank Details:", data);
    if (!completedSections.includes("bank")) setCompletedSections([...completedSections, "bank"]);
    toast({ title: "Bank Details Saved", description: "Your bank information has been saved successfully.", variant: "success" });
  };

  const onExpensesSubmit = (data) => {
    console.log("Expenses Details:", data);
    if (!completedSections.includes("expenses")) setCompletedSections([...completedSections, "expenses"]);
    toast({ title: "Expenses Details Saved", description: "Your expense information has been saved successfully.", variant: "success" });
  };

  const handleDocumentSubmit = () => {
    if (!aadhaarVerified) {
      toast({ title: "Aadhaar Verification Required", description: "Please verify your Aadhaar card before submitting documents.", variant: "destructive" });
      return;
    }
    if (!completedSections.includes("documents")) setCompletedSections([...completedSections, "documents"]);
    toast({ title: "Documents Submitted", description: "Your documents have been uploaded successfully.", variant: 'success' });
  };

  const handleVerifyElectricityBills = async () => {
    setUploadedBills((prev) => ({
      ...prev,
      electricity: prev.electricity.map((b) => ({ ...b, verifying: true })),
    }));

    const formData = new FormData();
    uploadedBills.electricity.forEach((bill) => {
      formData.append("bills", bill.files[0]);
    });

    try {
      const res = await fetch("http://localhost:5010/api/verify/electricity", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      // You expect: data.verifiedBills = [true, true, true]
      setUploadedBills((prev) => ({
        ...prev,
        electricity: prev.electricity.map((b, idx) => ({
          ...b,
          verifying: false,
          verified: data.verifiedBills[idx],
        })),
      }));

    } catch (err) {
      console.error("Verification failed", err);
      setUploadedBills((prev) => ({
        ...prev,
        electricity: prev.electricity.map((b) => ({
          ...b,
          verifying: false,
          verified: false,
        })),
      }));
    }
  };


  // const handleAadhaarVerification = async (method) => {
  //   setVerifyingAadhaar(true);
  //   setTimeout(() => {
  //     setVerifyingAadhaar(false);
  //     setAadhaarVerified(true);
  //     if (method === "digilocker") setDigilockerConnected(true);
  //     toast({ title: "Aadhaar Verified Successfully", description: `Your Aadhaar has been verified using ${method === "blockchain" ? "blockchain" : "DigiLocker"}.`, variant: "success" });
  //   }, 2000);
  // };

  // const handleBillApiConnect = () => {
  //   setTimeout(() => {
  //     setBillApiConnected(true);
  //     toast({ title: "API Connected Successfully", description: "Your bill payment accounts have been linked.", variant: "success" });
  //   }, 1500);
  // };

  // const handleBillUpload = (type, files) => {
  //   if (!files || files.length === 0) return;
  //   const fileArray = Array.from(files);
  //   const newBills = fileArray.map((file) => ({ files: [file], verified: false, verifying: false }));
  //   setUploadedBills((prev) => ({ ...prev, [type]: [...prev[type], ...newBills] }));
  //   toast({ title: "Files Uploaded", description: `${fileArray.length} file(s) uploaded. Click verify to authenticate.` });
  // };

  // const handleVerifyBills = (type) => {
  //   const bills = uploadedBills[type];
  //   if (bills.length === 0) {
  //     toast({ title: "No Files to Verify", description: "Please upload files first.", variant: "destructive" });
  //     return;
  //   }
  //   setUploadedBills((prev) => ({ ...prev, [type]: prev[type].map((bill) => ({ ...bill, verifying: true })) }));
  //   setTimeout(() => {
  //     setUploadedBills((prev) => ({ ...prev, [type]: prev[type].map((bill) => ({ ...bill, verified: true, verifying: false })) }));
  //     toast({ title: "Bills Verified Successfully", description: `All ${type} bills have been verified and authenticated.`, variant: "success" });
  //   }, 2000);
  // };

  // const handleDocumentUpload = (docType, file) => {
  //   if (!file) return;
  //   setUploadedDocuments((prev) => ({ ...prev, [docType]: { file, verified: false, verifying: true } }));
  //   setTimeout(() => {
  //     setUploadedDocuments((prev) => ({ ...prev, [docType]: { ...prev[docType], verified: true, verifying: false } }));
  //     toast({ title: "Document Verified", description: `${docType} document has been verified successfully.`, variant: "success" });
  //   }, 2000);
  // };

  const onLoanSubmit = (data) => {
    console.log("Loan Application:", data);
    const amount = parseFloat(data.loanAmount);
    if (amount > LOAN_THRESHOLD && !showExpensesForLoan) {
      setLoanAmount(amount);
      setShowExpensesForLoan(true);
      toast({ title: "Additional Information Required", description: `For loans above ₹${(LOAN_THRESHOLD / 1000).toFixed(0)}K, please fill expenses & commodities details below.`, variant: "default" });
      return;
    }
    if (!completedSections.includes("loan")) setCompletedSections([...completedSections, "loan"]);
    toast({ title: "Loan Application Submitted", description: "Your loan application has been submitted for review. Processing will begin shortly.", variant: "success" });
  };

  const handleFetchRationDetails = () => {

    // Validation
    if (rationNumber.length !== 10) {
      setRationError("Ration Card Number must be exactly 10 digits.");
      return;
    }

    setRationError("");
    setFetchingRation(true);

    // Simulated API call
    setTimeout(() => {
      setRationDetails({
        householdSize: 5,
        dependentCount: 3,
        earnersCount: 2,
        dependencyRatio: "0.6",
        rationCategory: "APL",
      });

      setFetchingRation(false);
      setRationFetched(true);
    }, 1500);
  };

  const handleFetchSECC = async () => {
    setFetchingSECC(true);

    setTimeout(() => {
      setSeccDetails({
        category: "Poor Household",
        score: 42
      });

      setFetchingSECC(false);
      setSeccFetched(true);
    }, 1500);
  };



  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl pt-20">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-primary mb-2">Complete Your Profile 🚀</h1>
        <p className="text-muted-foreground">Fill all sections to maximize your credit score and loan eligibility</p>
      </div>

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
        <div className="flex flex-col gap-2 p-2 sticky top-4 self-start">
          {profileSections.map((section) => (
            <button
              key={section.id}
              onClick={() => setSelectedSection(section.id)}
              className={cn(
                "flex items-center gap-3 p-3 rounded-lg transition-all text-left w-full hover:bg-muted/50",
                selectedSection === section.id ? "bg-primary/10 text-primary border-r-4 border-primary font-semibold" : "text-muted-foreground"
              )}
            >
              <section.icon className={cn("h-5 w-5", completedSections.includes(section.id) && "text-success")} />
              <span className="text-sm flex-1">{section.title}</span>
              {completedSections.includes(section.id) && <CheckCircle2 className="h-4 w-4 text-success" />}
            </button>
          ))}
        </div>

        <Card className="shadow-lg min-h-[500px]">
          <CardHeader className="border-b">
            <CardTitle>{profileSections.find(s => s.id === selectedSection)?.title}</CardTitle>
            <CardDescription>Complete this section to improve your loan eligibility</CardDescription>
          </CardHeader>

          <CardContent className="py-6 max-h-[calc(600px)] overflow-y-auto">

            {/* BASIC SECTION (removed) */}

           {/* INCOME SECTION */}
{selectedSection === "income" && (
  <Form {...incomeForm}>
    <form
      onSubmit={incomeForm.handleSubmit(onIncomeSubmit)}
      className="space-y-6"
    >
      {/* Occupation */}
      <FormField
        control={incomeForm.control}
        name="employmentType"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Occupation *</FormLabel>
            <Select
              onValueChange={field.onChange}
              defaultValue={field.value}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select employment type" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="Self-employed">Self-employed</SelectItem>
                <SelectItem value="Salaried">Salaried</SelectItem>
                <SelectItem value="Labour">Labour</SelectItem>
                <SelectItem value="Unemployed">Unemployed</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Primary Income Source */}
      <FormField
        control={incomeForm.control}
        name="primaryIncomeSource"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Primary Income Source *</FormLabel>
            <FormControl>
              <Input
                placeholder="e.g., Small Business, Daily Wage"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Monthly & Annual Income */}
      <div className="grid md:grid-cols-2 gap-4">
        <FormField
          control={incomeForm.control}
          name="monthlyIncome"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Monthly Income (₹) *</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="Enter amount"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={incomeForm.control}
          name="annualIncome"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Annual Income (₹)</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="Enter annual income"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      {/* Asset Count with + / − */}
      <FormField
        control={incomeForm.control}
        name="assetCount"
        render={({ field }) => {
          const value = Number(field.value) || 0;

          const handleChange = (newVal) => {
            if (newVal < 0) newVal = 0;
            field.onChange(newVal);
          };

          return (
            <FormItem>
              <FormLabel>Asset Count</FormLabel>
              <div className="flex items-center gap-3">
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => handleChange(value - 1)}
                >
                  -
                </Button>

                <div className="min-w-[3rem] text-center text-sm font-medium">
                  {value}
                </div>

                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => handleChange(value + 1)}
                >
                  +
                </Button>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Total count of significant assets (e.g., land, shop, vehicle, etc.).
              </p>
              <FormMessage />
            </FormItem>
          );
        }}
      />

      {/* Tip */}
      <div className="p-4 bg-muted rounded-lg">
        <p className="text-sm text-muted-foreground">
          💡 Tip: Providing accurate Income & Asset Details helps improve your
          credit score accuracy and loan eligibility.
        </p>
      </div>

      {/* Upload Income Proof */}
      <div className="space-y-2">
        <Label>Upload Income Proof (Optional)</Label>
        <Input type="file" accept=".pdf,.jpg,.jpeg,.png" />
        <p className="text-xs text-muted-foreground">
          Upload payslip, sale receipt, or income certificate
        </p>
      </div>

      <Button type="submit" className="w-full">
        Save Income & Asset Details
      </Button>
    </form>
  </Form>
)}

            {/* BANK SECTION */}
            {selectedSection === "bank" && (
              <Form {...bankForm}>
                <form onSubmit={bankForm.handleSubmit(onBankSubmit)} className="space-y-6">
                  <FormField control={bankForm.control} name="accountHolderName" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Account Holder Name *</FormLabel>
                      <FormControl><Input placeholder="Must match Aadhaar name" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />

                  <FormField control={bankForm.control} name="bankName" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Bank Name *</FormLabel>
                      <FormControl><Input placeholder="Enter bank name" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />

                  <div className="grid md:grid-cols-2 gap-4">
                    <FormField control={bankForm.control} name="accountNumber" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Account Number *</FormLabel>
                        <FormControl><Input placeholder="Enter account number" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={bankForm.control} name="confirmAccountNumber" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Confirm Account Number *</FormLabel>
                        <FormControl><Input placeholder="Re-enter account number" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <FormField control={bankForm.control} name="ifscCode" render={({ field }) => (
                      <FormItem>
                        <FormLabel>IFSC Code *</FormLabel>
                        <FormControl><Input placeholder="Enter 11-character IFSC" maxLength={11} {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={bankForm.control} name="branchName" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Branch Name (Optional)</FormLabel>
                        <FormControl><Input placeholder="Enter branch name" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                  </div>

                  <FormField control={bankForm.control} name="upiId" render={({ field }) => (
                    <FormItem>
                      <FormLabel>UPI ID (Optional)</FormLabel>
                      <FormControl><Input placeholder="yourname@upi" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />

                  <div className="space-y-2">
                    <Label>Passbook Copy / Bank Statement (Optional)</Label>
                    <Input type="file" accept=".pdf,.jpg,.jpeg,.png" />
                  </div>

                  {/* Consent */}
                  <FormField control={bankForm.control} name="consent" render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                      <FormControl>
                        <div className="flex items-start space-x-3">
                          <Checkbox checked={field.value} onCheckedChange={field.onChange} id="consent-checkbox" />
                        </div>
                      </FormControl>

                      <div className="space-y-1 leading-none">
                        <FormLabel>I authorize NBCFDC to verify my bank details *</FormLabel>
                        <FormMessage />
                      </div>
                    </FormItem>
                  )} />

                  <Button type="submit" className="w-full">Save Bank Details</Button>
                </form>
              </Form>
            )}

            {/* EXPENSES */}
            {selectedSection === "expenses" && (
              <div className="space-y-6">
                <Form {...expensesForm}>
                  <form onSubmit={expensesForm.handleSubmit(onExpensesSubmit)} className="space-y-6">

                    {/* Bills UI (unchanged logic) */}
                    <div className="space-y-4">

                      <Tabs defaultValue="upload" className="w-full">

                        <TabsContent value="upload" className="space-y-4">
                          <div className="rounded-lg space-y-6">
                            <p className="text-sm text-muted-foreground">Upload your recent utility bills for verification. This helps improve your credit score accuracy.</p>

                            {/* Electricity Bills */}
                            <div className="space-y-3">
                              <Label>Electricity Bills (Max 3 PDFs)</Label>

                              {/* File Upload */}
                              <Input
                                type="file"
                                accept=".pdf"
                                multiple
                                onChange={(e) => {
                                  const newFiles = Array.from(e.target.files || []);
                                  const totalAllowed = 3 - uploadedBills.electricity.length;

                                  // Take only allowed number of PDFs
                                  const validFiles = newFiles.slice(0, totalAllowed);

                                  setUploadedBills((prev) => ({
                                    ...prev,
                                    electricity: [
                                      ...prev.electricity,
                                      ...validFiles.map((f) => ({
                                        files: [f],
                                        verifying: false,
                                        verified: false,
                                      })),
                                    ],
                                  }));
                                }}
                                disabled={uploadedBills.electricity.length >= 3}
                              />

                              {/* Bills List */}
                              {uploadedBills.electricity.length > 0 && (
                                <div className="space-y-2 mt-3">

                                  {uploadedBills.electricity.map((bill, idx) => (
                                    <div
                                      key={idx}
                                      className="flex items-center gap-2 p-3 bg-background rounded-lg border"
                                    >
                                      <FileText className="h-4 w-4 text-muted-foreground" />

                                      <span className="text-sm flex-1">{bill.files[0]?.name}</span>

                                      {/* Status */}
                                      {bill.verifying ? (
                                        <div className="flex items-center gap-2 text-primary">
                                          <Clock className="h-4 w-4 animate-spin" />
                                          <span className="text-xs">Verifying...</span>
                                        </div>
                                      ) : bill.verified ? (
                                        <div className="flex items-center gap-1 text-success">
                                          <CheckCircle2 className="h-4 w-4" />
                                          <span className="text-xs font-medium">Verified</span>
                                        </div>
                                      ) : (
                                        <span className="text-xs text-muted-foreground">Pending</span>
                                      )}

                                      {/* DELETE BUTTON */}
                                      <button
                                        className="text-red-500 text-xs font-medium"
                                        onClick={() => {
                                          setUploadedBills((prev) => ({
                                            ...prev,
                                            electricity: prev.electricity.filter((_, i) => i !== idx),
                                          }));
                                        }}
                                      >
                                        Delete
                                      </button>
                                    </div>
                                  ))}

                                  {/* Verify button */}
                                  {!uploadedBills.electricity.every((b) => b.verified) && (
                                    <Button
                                      type="button"
                                      size="sm"
                                      className="mt-2"
                                      disabled={uploadedBills.electricity.some((b) => b.verifying)}
                                      onClick={handleVerifyElectricityBills}
                                    >
                                      <Shield className="h-4 w-4 mr-2" />
                                      Verify All Electricity Bills
                                    </Button>
                                  )}

                                </div>
                              )}
                            </div>


                            {/* Mobile Recharge Details */}
                            <div className="space-y-4">
                              <Label className="font-medium">Mobile Recharge Details</Label>

                              {/* Avg Amount */}
                              <FormField
                                control={expensesForm.control}
                                name="mobileAvgAmount"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Mobile Recharge Average Amount (₹)</FormLabel>
                                    <FormControl>
                                      <Input type="number" placeholder="e.g. 299" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />

                              {/* Frequency */}
                              <FormField
                                control={expensesForm.control}
                                name="mobileFrequency"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Recharge Frequency Per Month</FormLabel>
                                    <FormControl>
                                      <Input type="number" placeholder="e.g. 2" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />

                              {/* ISP */}
                              <FormField
                                control={expensesForm.control}
                                name="internetProvider"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Internet Service Provider</FormLabel>
                                    <FormControl>
                                      <Input type="text" placeholder="e.g. Jio / Airtel / Vi" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </div>

                            {/* GAS BILL DETAILS */}
                            <div className="space-y-4">
                              <Label className="font-medium">Gas Bill Details</Label>

                              {/* LPG Refills Per Month */}
                              <FormField
                                control={expensesForm.control}
                                name="lpgRefills"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>LPG Refills Per Month</FormLabel>
                                    <FormControl>
                                      <Input type="number" min="0" placeholder="e.g. 1" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />

                              {/* LPG Consumer Number */}
                              <FormField
                                control={expensesForm.control}
                                name="lpgConsumerNumber"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>LPG Consumer Number</FormLabel>
                                    <FormControl>
                                      <Input type="text" placeholder="Enter consumer number" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />

                              {/* Gas Average Cost */}
                              <FormField
                                control={expensesForm.control}
                                name="gasAvgCost"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Average Gas Cost (₹)</FormLabel>
                                    <FormControl>
                                      <Input type="number" min="0" placeholder="e.g. 800" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />

                              {/* Refill Interval Days */}
                              <FormField
                                control={expensesForm.control}
                                name="lpgRefillInterval"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Refill Interval Days</FormLabel>
                                    <FormControl>
                                      <Input type="number" min="0" placeholder="e.g. 25" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </div>
                          </div>
                        </TabsContent>

                      </Tabs>
                    </div>

                    <FormField control={expensesForm.control} name="remarks" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Remarks (Optional)</FormLabel>
                        <FormControl><Textarea placeholder="Any additional information" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />

                    {/* <div className="p-4 bg-muted rounded-lg">
                      <p className="text-sm text-muted-foreground">💡 Tip: This data helps us calculate your Income vs Expense Ratio for accurate credit assessment.</p>
                    </div> */}

                    <Button type="submit" className="w-full">Save Expense Details</Button>
                  </form>
                </Form>
              </div>
            )}

            {/* RATION CARD */}
            {selectedSection === "House Hold and Ration Card Detail" && (
              <div className="space-y-6">
                <div className="rounded-lg">

                  {/* HEADER */}
                  <div className="flex items-start gap-3 mb-4">
                    <Shield className="h-6 w-6 text-primary mt-0.5" />
                    <div>
                      <h3 className="text-lg font-semibold text-primary mb-1">Ration Card</h3>
                    </div>
                  </div>

                  {/* IF FETCHED */}
                  {rationFetched ? (
                    <div className="space-y-6">

                      {/* SUCCESS BOX */}
                      <div className="p-4 bg-success/10 border border-success rounded-lg">
                        <div className="flex items-center gap-2 text-success mb-2">
                          <CheckCircle2 className="h-5 w-5" />
                          <span className="font-semibold">Ration Details Fetched Successfully</span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Your ration card details have been successfully fetched.
                          {digilockerConnected && " DigiLocker connected."}
                        </p>
                      </div>

                      {/* ⭐ RATION DETAILS (READ-ONLY) */}
                      <div className="p-4 border rounded-lg bg-muted/40 space-y-4">

                        <h4 className="font-semibold text-primary text-md">Household Details</h4>

                        <div className="grid md:grid-cols-2 gap-4">

                          <div>
                            <Label>Household Size</Label>
                            <Input value={rationDetails.householdSize} readOnly className="bg-gray-100" />
                          </div>

                          <div>
                            <Label>Household Dependents</Label>
                            <Input value={rationDetails.dependentCount} readOnly className="bg-gray-100" />
                          </div>

                          <div>
                            <Label>Earners Count</Label>
                            <Input value={rationDetails.earnersCount} readOnly className="bg-gray-100" />
                          </div>

                          <div>
                            <Label>Dependency Ratio</Label>
                            <Input value={rationDetails.dependencyRatio} readOnly className="bg-gray-100" />
                          </div>

                          <div>
                            <Label>Ration Card Category</Label>
                            <Input value={rationDetails.rationCategory} readOnly className="bg-gray-100" />
                          </div>

                        </div>
                      </div>

                      {/* ⭐ SECC CATEGORY SECTION */}
                      <div className="p-4 border rounded-lg bg-muted/40 space-y-4">
                        <div className="flex justify-between items-center">
                          <h4 className="font-semibold text-primary text-md">SECC Category</h4>

                          {!seccFetched && (
                            <Button
                              variant="default"
                              onClick={handleFetchSECC}
                              disabled={fetchingSECC}
                            >
                              {fetchingSECC ? "Fetching..." : "Fetch SECC"}
                            </Button>
                          )}
                        </div>

                        {seccFetched && (
                          <div className="grid md:grid-cols-2 gap-4">
                            <div>
                              <Label>SECC Category</Label>
                              <Input value={seccDetails.category} readOnly className="bg-gray-100" />
                            </div>

                            <div>
                              <Label>SECC Score</Label>
                              <Input value={seccDetails.score} readOnly className="bg-gray-100" />
                            </div>
                          </div>
                        )}
                      </div>

                    </div>
                  ) : (
                    /* BEFORE FETCH */
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label>Ration Card Number *</Label>

                        <Input
                          type="text"
                          placeholder="Enter 10-digit Ration Card Number"
                          maxLength={10}
                          value={rationNumber}
                          onChange={(e) => {
                            // only NUMBERS allowed
                            const val = e.target.value.replace(/\D/g, "");
                            setRationNumber(val);
                          }}
                        />

                        {/* Error message */}
                        {rationError && (
                          <p className="text-red-500 text-sm">{rationError}</p>
                        )}
                      </div>

                      <div className="grid md:grid-cols-2 gap-3">
                        <Button
                          type="button"
                          variant="default"
                          onClick={handleFetchRationDetails}
                          disabled={fetchingRation}
                        >
                          <Shield className="h-4 w-4 mr-2" />
                          {fetchingRation ? "Fetching..." : "Fetch Ration Details"}
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}


            {/* LOAN */}
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
                      <FormControl><Input type="number" placeholder="Enter amount (e.g., 50100)" {...field} onChange={(e) => { field.onChange(e); const amount = parseFloat(e.target.value) || 0; setLoanAmount(amount); }} /></FormControl>
                      <p className="text-xs text-muted-foreground">
                        {loanAmount > LOAN_THRESHOLD ? (
                          <span className="text-accent font-medium">⚠️ Amount above ₹{(LOAN_THRESHOLD / 1000).toFixed(0)}K - Additional details required</span>
                        ) : (
                          <span className="text-success font-medium">✓ Amount within basic eligibility</span>
                        )}
                      </p>
                      <FormMessage />
                    </FormItem>
                  )} />

                  <FormField control={loanForm.control} name="purpose" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Purpose of Loan *</FormLabel>
                      <FormControl><Textarea placeholder="Describe how you will use this loan (e.g., business expansion, medical expenses, education)" className="min-h-[100px]" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />

                  {showExpensesForLoan && loanAmount > LOAN_THRESHOLD && (
                    <div className="space-y-6 p-6 border-2 border-accent rounded-lg bg-accent/5">
                      <div className="flex items-center gap-2 text-accent"><AlertCircle className="h-5 w-5" /><h3 className="font-semibold">Additional Financial Information Required</h3></div>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2"><Label>Monthly Household Expenses (₹) *</Label><Input type="number" placeholder="e.g., 15010" required /></div>
                        <div className="space-y-2"><Label>Monthly Business Expenses (₹)</Label><Input type="number" placeholder="e.g., 10000" /></div>
                        <div className="space-y-2"><Label>Existing Loan Repayments (₹/month)</Label><Input type="number" placeholder="e.g., 5010" /></div>
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

                  <Button type="submit" className="w-full" size="lg">Submit Loan Application</Button>
                </form>
              </Form>
            )}

           {/* ENROLLED SCHEMES SECTION */}
{selectedSection === "schemes" && (
  <Form {...enrolledSchemesForm}>
    <form
      onSubmit={enrolledSchemesForm.handleSubmit(onEnrolledSchemesSubmit)}
      className="space-y-6"
    >
      <FormField
        control={enrolledSchemesForm.control}
        name="enrolledMgnrega"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Enrolled in MGNREGA *</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select Yes / No" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="Yes">Yes</SelectItem>
                <SelectItem value="No">No</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={enrolledSchemesForm.control}
        name="enrolledPmUjjwala"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Enrolled in PM Ujjwala Yojana *</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select Yes / No" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="Yes">Yes</SelectItem>
                <SelectItem value="No">No</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={enrolledSchemesForm.control}
        name="enrolledPmJay"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Enrolled in PM-JAY (Ayushman Bharat) *</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select Yes / No" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="Yes">Yes</SelectItem>
                <SelectItem value="No">No</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={enrolledSchemesForm.control}
        name="enrolledPensionScheme"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Enrolled in Pension Scheme *</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select Yes / No" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="Yes">Yes</SelectItem>
                <SelectItem value="No">No</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      <Button type="submit" className="w-full">
        Save Enrolled Schemes
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

export default ApplyLoan;