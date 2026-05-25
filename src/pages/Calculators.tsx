import { Seo } from "@/components/Seo";
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@workspace/ui/tabs";
import { Input } from "@workspace/ui/input";
import { Label } from "@workspace/ui/label";
import { Calculator } from "lucide-react";
import { Link } from "wouter";
import { useAmandaContent, s } from "@/hooks/useAmandaContent";

export default function Calculators() {
  const { data } = useAmandaContent();
  const settings = data?.settings ?? {};

  const [homePrice, setHomePrice] = useState(500000);
  const [downPaymentPct, setDownPaymentPct] = useState(20);
  const [interestRate, setInterestRate] = useState(6.5);
  const [loanTerm, setLoanTerm] = useState(30);
  const [propertyTaxPct, setPropertyTaxPct] = useState(1.2);
  const [homeInsurance, setHomeInsurance] = useState(1200);

  const [grossIncome, setGrossIncome] = useState(100000);
  const [monthlyDebts, setMonthlyDebts] = useState(500);
  const [affordDownPayment, setAffordDownPayment] = useState(50000);

  const [currentBalance, setCurrentBalance] = useState(400000);
  const [currentRate, setCurrentRate] = useState(7.0);
  const [currentTerm, setCurrentTerm] = useState(30);
  const [newRate, setNewRate] = useState(5.5);
  const [newTerm, setNewTerm] = useState(30);
  const [closingCosts, setClosingCosts] = useState(4000);

  const formatCurrency = (val: number) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(val);

  const downPaymentAmt = homePrice * (downPaymentPct / 100);
  const principal = homePrice - downPaymentAmt;
  const r = interestRate / 100 / 12;
  const n = loanTerm * 12;
  const monthlyPI = principal * (r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1) || 0;
  const monthlyTax = (homePrice * (propertyTaxPct / 100)) / 12;
  const monthlyIns = homeInsurance / 12;
  const totalMonthly = monthlyPI + monthlyTax + monthlyIns;

  const monthlyIncome = grossIncome / 12;
  const maxTotalDebt = monthlyIncome * 0.36;
  const maxHousingPayment = Math.max(0, maxTotalDebt - monthlyDebts);
  const maxPI = maxHousingPayment * 0.8;
  const affordMaxLoan = maxPI * ((Math.pow(1 + r, n) - 1) / (r * Math.pow(1 + r, n))) || 0;
  const affordMaxPrice = affordMaxLoan + affordDownPayment;

  const rCur = currentRate / 100 / 12;
  const nCur = currentTerm * 12;
  const currentPI = currentBalance * (rCur * Math.pow(1 + rCur, nCur)) / (Math.pow(1 + rCur, nCur) - 1) || 0;

  const rNew = newRate / 100 / 12;
  const nNew = newTerm * 12;
  const newPI = currentBalance * (rNew * Math.pow(1 + rNew, nNew)) / (Math.pow(1 + rNew, nNew) - 1) || 0;

  const monthlySavings = currentPI - newPI;
  const breakevenMonths = monthlySavings > 0 ? closingCosts / monthlySavings : 0;

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Seo
        title={s(settings, "calculators_hero_heading", "Mortgage Calculators")}
        description={s(settings, "seo_calculators_description", "") || s(settings, "calculators_hero_subheading", "")}
        fullTitle={s(settings, "seo_calculators_title", "") || undefined}
        ogImage={s(settings, "seo_calculators_og_image", "") || s(settings, "seo_og_image", "") || undefined}
      />
      
      <div className="bg-primary text-primary-foreground py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Calculator className="w-12 h-12 mx-auto mb-6 text-secondary" />
          <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4">{s(settings, "calculators_hero_heading", "Mortgage Calculators")}</h1>
          <p className="text-xl text-primary-foreground/80 max-w-2xl mx-auto">{s(settings, "calculators_hero_subheading", "")}</p>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 max-w-5xl">
        <Tabs defaultValue="payment" className="w-full">
          <TabsList className="grid w-full grid-cols-1 md:grid-cols-3 mb-6 h-auto">
            <TabsTrigger value="payment" className="text-base py-3">{s(settings, "calculators_tab_payment_label", "Monthly Payment")}</TabsTrigger>
            <TabsTrigger value="affordability" className="text-base py-3">{s(settings, "calculators_tab_affordability_label", "Affordability")}</TabsTrigger>
            <TabsTrigger value="refinance" className="text-base py-3">{s(settings, "calculators_tab_refinance_label", "Refinance")}</TabsTrigger>
          </TabsList>

          <TabsContent value="payment">
            <p className="text-muted-foreground mb-6 text-center max-w-2xl mx-auto">{s(settings, "calculators_tab_payment_desc", "")}</p>
            <div className="bg-card border border-border rounded-xl shadow-sm p-6 md:p-8 grid grid-cols-1 lg:grid-cols-12 gap-12">
              <div className="lg:col-span-7 space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2"><Label>Home Price ($)</Label><Input type="number" value={homePrice} onChange={e => setHomePrice(Number(e.target.value))} className="text-lg" /></div>
                  <div className="space-y-2"><Label>Down Payment (%)</Label><Input type="number" value={downPaymentPct} onChange={e => setDownPaymentPct(Number(e.target.value))} className="text-lg" /></div>
                  <div className="space-y-2"><Label>Interest Rate (%)</Label><Input type="number" step="0.1" value={interestRate} onChange={e => setInterestRate(Number(e.target.value))} className="text-lg" /></div>
                  <div className="space-y-2"><Label>Loan Term (Years)</Label><Input type="number" value={loanTerm} onChange={e => setLoanTerm(Number(e.target.value))} className="text-lg" /></div>
                  <div className="space-y-2"><Label>Property Tax (%/yr)</Label><Input type="number" step="0.1" value={propertyTaxPct} onChange={e => setPropertyTaxPct(Number(e.target.value))} className="text-lg" /></div>
                  <div className="space-y-2"><Label>Home Insurance ($/yr)</Label><Input type="number" value={homeInsurance} onChange={e => setHomeInsurance(Number(e.target.value))} className="text-lg" /></div>
                </div>
              </div>
              <div className="lg:col-span-5 bg-muted rounded-xl p-8 flex flex-col justify-center border border-border">
                <h3 className="text-lg font-semibold text-muted-foreground mb-6 text-center uppercase tracking-wider">Estimated Monthly Payment</h3>
                <div className="text-5xl font-serif font-bold text-primary text-center mb-8">{formatCurrency(totalMonthly)}</div>
                <div className="space-y-4 text-sm">
                  <div className="flex justify-between pb-2 border-b border-border/50"><span className="text-muted-foreground">Principal & Interest</span><span className="font-semibold text-foreground">{formatCurrency(monthlyPI)}</span></div>
                  <div className="flex justify-between pb-2 border-b border-border/50"><span className="text-muted-foreground">Property Taxes</span><span className="font-semibold text-foreground">{formatCurrency(monthlyTax)}</span></div>
                  <div className="flex justify-between pb-2 border-b border-border/50"><span className="text-muted-foreground">Homeowners Insurance</span><span className="font-semibold text-foreground">{formatCurrency(monthlyIns)}</span></div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="affordability">
            <p className="text-muted-foreground mb-6 text-center max-w-2xl mx-auto">{s(settings, "calculators_tab_affordability_desc", "")}</p>
            <div className="bg-card border border-border rounded-xl shadow-sm p-6 md:p-8 grid grid-cols-1 lg:grid-cols-12 gap-12">
              <div className="lg:col-span-7 space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2"><Label>Gross Annual Income ($)</Label><Input type="number" value={grossIncome} onChange={e => setGrossIncome(Number(e.target.value))} className="text-lg" /></div>
                  <div className="space-y-2"><Label>Monthly Debts ($)</Label><p className="text-xs text-muted-foreground mb-1">Auto, student loans, credit cards</p><Input type="number" value={monthlyDebts} onChange={e => setMonthlyDebts(Number(e.target.value))} className="text-lg" /></div>
                  <div className="space-y-2"><Label>Available Down Payment ($)</Label><Input type="number" value={affordDownPayment} onChange={e => setAffordDownPayment(Number(e.target.value))} className="text-lg" /></div>
                  <div className="space-y-2"><Label>Expected Interest Rate (%)</Label><Input type="number" step="0.1" value={interestRate} onChange={e => setInterestRate(Number(e.target.value))} className="text-lg" /></div>
                </div>
              </div>
              <div className="lg:col-span-5 bg-muted rounded-xl p-8 flex flex-col justify-center border border-border">
                <h3 className="text-lg font-semibold text-muted-foreground mb-6 text-center uppercase tracking-wider">Estimated Home Budget</h3>
                <div className="text-5xl font-serif font-bold text-primary text-center mb-8">{formatCurrency(affordMaxPrice)}</div>
                <div className="space-y-4 text-sm">
                  <div className="flex justify-between pb-2 border-b border-border/50"><span className="text-muted-foreground">Max Loan Amount</span><span className="font-semibold text-foreground">{formatCurrency(affordMaxLoan)}</span></div>
                  <div className="flex justify-between pb-2 border-b border-border/50"><span className="text-muted-foreground">Suggested Monthly Payment</span><span className="font-semibold text-foreground">{formatCurrency(maxHousingPayment)}</span></div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="refinance">
            <p className="text-muted-foreground mb-6 text-center max-w-2xl mx-auto">{s(settings, "calculators_tab_refinance_desc", "")}</p>
            <div className="bg-card border border-border rounded-xl shadow-sm p-6 md:p-8 grid grid-cols-1 lg:grid-cols-12 gap-12">
              <div className="lg:col-span-7 space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2"><Label>Current Loan Balance ($)</Label><Input type="number" value={currentBalance} onChange={e => setCurrentBalance(Number(e.target.value))} className="text-lg" /></div>
                  <div className="space-y-2"><Label>Current Interest Rate (%)</Label><Input type="number" step="0.1" value={currentRate} onChange={e => setCurrentRate(Number(e.target.value))} className="text-lg" /></div>
                  <div className="space-y-2"><Label>Current Remaining Term (Years)</Label><Input type="number" value={currentTerm} onChange={e => setCurrentTerm(Number(e.target.value))} className="text-lg" /></div>
                  <div className="space-y-2"><Label>New Interest Rate (%)</Label><Input type="number" step="0.1" value={newRate} onChange={e => setNewRate(Number(e.target.value))} className="text-lg" /></div>
                  <div className="space-y-2"><Label>New Loan Term (Years)</Label><Input type="number" value={newTerm} onChange={e => setNewTerm(Number(e.target.value))} className="text-lg" /></div>
                  <div className="space-y-2"><Label>Estimated Closing Costs ($)</Label><Input type="number" value={closingCosts} onChange={e => setClosingCosts(Number(e.target.value))} className="text-lg" /></div>
                </div>
              </div>
              <div className="lg:col-span-5 bg-muted rounded-xl p-8 flex flex-col justify-center border border-border">
                <h3 className="text-lg font-semibold text-muted-foreground mb-6 text-center uppercase tracking-wider">
                  {monthlySavings >= 0 ? "Monthly Savings" : "Monthly Increase"}
                </h3>
                <div className={`text-5xl font-serif font-bold text-center mb-8 ${monthlySavings > 0 ? 'text-secondary' : monthlySavings < 0 ? 'text-destructive' : 'text-foreground'}`}>
                  {monthlySavings >= 0 ? formatCurrency(monthlySavings) : `+${formatCurrency(Math.abs(monthlySavings))}`}
                </div>
                <div className="space-y-4 text-sm">
                  <div className="flex justify-between pb-2 border-b border-border/50"><span className="text-muted-foreground">Current Monthly P&I</span><span className="font-semibold text-foreground">{formatCurrency(currentPI)}</span></div>
                  <div className="flex justify-between pb-2 border-b border-border/50"><span className="text-muted-foreground">New Monthly P&I</span><span className="font-semibold text-foreground">{formatCurrency(newPI)}</span></div>
                  <div className="flex justify-between pb-2 border-b border-border/50"><span className="text-muted-foreground">Break-Even Point</span><span className="font-semibold text-foreground">{monthlySavings > 0 ? `${Math.ceil(breakevenMonths)} months` : "N/A"}</span></div>
                </div>
                {monthlySavings < 0 && (
                  <p className="mt-4 text-xs text-muted-foreground text-center">Higher payment, but you'll pay less total interest over the life of the loan.</p>
                )}
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <div className="mt-8 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
          <p className="text-sm text-yellow-800 dark:text-yellow-200 text-center">
            <strong>Disclaimer:</strong> {s(settings, "calculators_disclaimer", "")} <Link href="/contact" className="underline">Contact {s(settings, "site_name", "Amanda")}</Link> for a precise, official quote.
          </p>
        </div>
      </div>
    </div>
  );
}
