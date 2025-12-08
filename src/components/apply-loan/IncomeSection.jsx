// src/components/apply-loan/IncomeSection.jsx
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

export const IncomeSection = ({ form, onSubmit, selectedSchemeName }) => {
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Occupation */}
        <FormField
          control={form.control}
          name="employmentType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Occupation *</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
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
          control={form.control}
          name="primaryIncomeSource"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Primary Income Source *</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Small Business, Daily Wage" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Monthly & Annual Income */}
        <div className="grid md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="monthlyIncome"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Monthly Income (₹) *</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="Enter amount" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="annualIncome"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Annual Income (₹)</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="Enter annual income" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Asset Count with +/- and Estimated Value */}
        <div className="grid md:grid-cols-2 gap-4 items-end">
          <FormField
            control={form.control}
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

          <FormField
            control={form.control}
            name="assetEstimatedValue"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Estimated Asset Value (₹)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="Total estimated value"
                    {...field}
                  />
                </FormControl>
                <p className="text-xs text-muted-foreground mt-1">
                  Approximate total market value of all your assets.
                </p>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Tip */}
        <div className="p-4 bg-muted rounded-lg">
          <p className="text-sm text-muted-foreground">
            💡 Tip: Providing accurate Income & Asset Details helps improve your
            credit score accuracy and loan eligibility, especially for scheme-based
            loans like{" "}
            {selectedSchemeName ? `"${selectedSchemeName}"` : "NBCFDC schemes"}.
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
  );
};
