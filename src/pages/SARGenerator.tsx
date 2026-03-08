import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { ArrowRight, ArrowLeft, Check, FileText, Download } from "lucide-react";

const steps = [
  "Select Accreditation Body",
  "Confirm Data Sources",
  "Review CO-PO Mapping",
  "AI Drafts Report",
  "Review & Export",
];

export default function SARGenerator() {
  const [step, setStep] = useState(0);

  return (
    <DashboardLayout title="SAR Report Generator">
      <div className="space-y-6">
        {/* Stepper */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2">
          {steps.map((s, i) => (
            <div key={i} className="flex items-center gap-2 shrink-0">
              <div className={`h-8 w-8 rounded-full flex items-center justify-center text-xs font-heading font-bold border ${
                i < step ? "bg-primary text-primary-foreground border-primary" :
                i === step ? "border-primary text-primary" :
                "border-border text-muted-foreground"
              }`}>
                {i < step ? <Check className="h-3 w-3" /> : i + 1}
              </div>
              <span className={`text-xs ${i === step ? "text-foreground" : "text-muted-foreground"}`}>{s}</span>
              {i < steps.length - 1 && <div className="w-8 h-px bg-border" />}
            </div>
          ))}
        </div>

        {/* Step content */}
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="glass-card p-8 min-h-[300px] flex flex-col justify-center items-center text-center gap-4"
        >
          <FileText className="h-12 w-12 text-primary/50" />
          <h2 className="font-heading text-xl font-bold">{steps[step]}</h2>
          <p className="text-sm text-muted-foreground max-w-md">
            {step === 0 && "Choose between NAAC, NBA, or ABET accreditation frameworks."}
            {step === 1 && "Verify all data sources are connected and synced."}
            {step === 2 && "Review and validate Course Outcome to Program Outcome mappings."}
            {step === 3 && "AI will generate report sections. This may take a few minutes."}
            {step === 4 && "Review the generated report, make edits, and export."}
          </p>
          {step === 3 && (
            <Button className="bg-secondary text-secondary-foreground gap-2">
              <FileText className="h-4 w-4" /> Generate with AI
            </Button>
          )}
          {step === 4 && (
            <div className="flex gap-3">
              <Button className="bg-primary text-primary-foreground gap-2">
                <Download className="h-4 w-4" /> Download PDF
              </Button>
              <Button variant="outline" className="border-border gap-2">
                <Download className="h-4 w-4" /> Download DOCX
              </Button>
            </div>
          )}
        </motion.div>

        {/* Navigation */}
        <div className="flex justify-between">
          <Button
            variant="outline"
            className="border-border gap-2"
            disabled={step === 0}
            onClick={() => setStep(s => s - 1)}
          >
            <ArrowLeft className="h-4 w-4" /> Previous
          </Button>
          <Button
            className="bg-primary text-primary-foreground gap-2"
            disabled={step === steps.length - 1}
            onClick={() => setStep(s => s + 1)}
          >
            Next <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </DashboardLayout>
  );
}
