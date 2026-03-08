import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useState, useRef, useCallback } from "react";
import { ArrowRight, ArrowLeft, Check, FileText, Download, Loader2, StopCircle, Sparkles } from "lucide-react";
import { useInstitution } from "@/hooks/useInstitution";
import { useCriteria } from "@/hooks/useCriteria";
import { useToast } from "@/hooks/use-toast";
import ReactMarkdown from "react-markdown";

const ACCREDITATION_BODIES = ["NAAC", "NBA", "ABET"] as const;

const NAAC_CRITERIA = [
  "Curricular Aspects",
  "Teaching-Learning and Evaluation",
  "Research, Innovations and Extension",
  "Infrastructure and Learning Resources",
  "Student Support and Progression",
  "Governance, Leadership and Management",
  "Institutional Values and Best Practices",
];

const steps = [
  "Select Framework",
  "Choose Criteria",
  "AI Generates Report",
  "Review & Export",
];

const GENERATE_SAR_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/generate-sar`;

export default function SARGenerator() {
  const [step, setStep] = useState(0);
  const [accBody, setAccBody] = useState<string>("NAAC");
  const [selectedCriteria, setSelectedCriteria] = useState<number[]>([]);
  const [generatedSections, setGeneratedSections] = useState<Record<number, string>>({});
  const [currentGenerating, setCurrentGenerating] = useState<number | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const abortRef = useRef<AbortController | null>(null);

  const { data: institution } = useInstitution();
  const { data: criteriaData } = useCriteria();
  const { toast } = useToast();

  const toggleCriterion = (num: number) => {
    setSelectedCriteria((prev) =>
      prev.includes(num) ? prev.filter((n) => n !== num) : [...prev, num].sort()
    );
  };

  const selectAll = () => {
    setSelectedCriteria(NAAC_CRITERIA.map((_, i) => i + 1));
  };

  const streamSection = useCallback(
    async (criterionNumber: number, signal: AbortSignal) => {
      const resp = await fetch(GENERATE_SAR_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({
          criterionNumber,
          institutionName: institution?.name,
          accreditationBody: accBody,
          criteriaData: criteriaData?.find((c) => c.criterion_number === criterionNumber),
        }),
        signal,
      });

      if (!resp.ok) {
        const err = await resp.json().catch(() => ({ error: "Generation failed" }));
        throw new Error(err.error || `HTTP ${resp.status}`);
      }

      if (!resp.body) throw new Error("No response body");

      const reader = resp.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      let sectionText = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });

        let newlineIndex: number;
        while ((newlineIndex = buffer.indexOf("\n")) !== -1) {
          let line = buffer.slice(0, newlineIndex);
          buffer = buffer.slice(newlineIndex + 1);

          if (line.endsWith("\r")) line = line.slice(0, -1);
          if (line.startsWith(":") || line.trim() === "") continue;
          if (!line.startsWith("data: ")) continue;

          const jsonStr = line.slice(6).trim();
          if (jsonStr === "[DONE]") break;

          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content as string | undefined;
            if (content) {
              sectionText += content;
              setGeneratedSections((prev) => ({ ...prev, [criterionNumber]: sectionText }));
            }
          } catch {
            buffer = line + "\n" + buffer;
            break;
          }
        }
      }

      // flush remaining
      if (buffer.trim()) {
        for (let raw of buffer.split("\n")) {
          if (!raw) continue;
          if (raw.endsWith("\r")) raw = raw.slice(0, -1);
          if (!raw.startsWith("data: ")) continue;
          const jsonStr = raw.slice(6).trim();
          if (jsonStr === "[DONE]") continue;
          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content as string | undefined;
            if (content) {
              sectionText += content;
              setGeneratedSections((prev) => ({ ...prev, [criterionNumber]: sectionText }));
            }
          } catch {
            /* ignore */
          }
        }
      }
    },
    [institution, accBody, criteriaData]
  );

  const handleGenerate = async () => {
    if (selectedCriteria.length === 0) {
      toast({ title: "No criteria selected", description: "Select at least one criterion.", variant: "destructive" });
      return;
    }

    setIsGenerating(true);
    const controller = new AbortController();
    abortRef.current = controller;

    for (const num of selectedCriteria) {
      if (controller.signal.aborted) break;
      setCurrentGenerating(num);
      try {
        await streamSection(num, controller.signal);
      } catch (err: any) {
        if (err.name === "AbortError") break;
        toast({ title: `Error on Criterion ${num}`, description: err.message, variant: "destructive" });
      }
    }

    setCurrentGenerating(null);
    setIsGenerating(false);
    abortRef.current = null;

    if (!controller.signal.aborted) {
      setStep(3);
    }
  };

  const handleStop = () => {
    abortRef.current?.abort();
    setIsGenerating(false);
    setCurrentGenerating(null);
  };

  const handleExport = () => {
    const fullReport = selectedCriteria
      .map((num) => `# Criterion ${num}: ${NAAC_CRITERIA[num - 1]}\n\n${generatedSections[num] || "(Not generated)"}`)
      .join("\n\n---\n\n");

    const blob = new Blob([fullReport], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `SAR_Report_${institution?.name || "Draft"}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const canProceed = () => {
    if (step === 0) return !!accBody;
    if (step === 1) return selectedCriteria.length > 0;
    if (step === 2) return Object.keys(generatedSections).length > 0;
    return false;
  };

  return (
    <DashboardLayout title="SAR Report Generator">
      <div className="space-y-6">
        {/* Stepper */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2">
          {steps.map((s, i) => (
            <div key={i} className="flex items-center gap-2 shrink-0">
              <div
                className={`h-8 w-8 rounded-full flex items-center justify-center text-xs font-heading font-bold border ${
                  i < step
                    ? "bg-primary text-primary-foreground border-primary"
                    : i === step
                    ? "border-primary text-primary"
                    : "border-border text-muted-foreground"
                }`}
              >
                {i < step ? <Check className="h-3 w-3" /> : i + 1}
              </div>
              <span className={`text-xs ${i === step ? "text-foreground" : "text-muted-foreground"}`}>{s}</span>
              {i < steps.length - 1 && <div className="w-8 h-px bg-border" />}
            </div>
          ))}
        </div>

        {/* Step content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="glass-card p-8"
          >
            {/* Step 0: Select Framework */}
            {step === 0 && (
              <div className="space-y-6">
                <div className="text-center space-y-2">
                  <FileText className="h-12 w-12 text-primary/50 mx-auto" />
                  <h2 className="font-heading text-xl font-bold">Select Accreditation Framework</h2>
                  <p className="text-sm text-muted-foreground">Choose the framework for your Self-Assessment Report.</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-lg mx-auto">
                  {ACCREDITATION_BODIES.map((body) => (
                    <button
                      key={body}
                      onClick={() => setAccBody(body)}
                      className={`p-4 rounded-lg border-2 transition-all text-center font-heading font-bold ${
                        accBody === body
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-border bg-card text-muted-foreground hover:border-primary/50"
                      }`}
                    >
                      {body}
                    </button>
                  ))}
                </div>
                {institution && (
                  <p className="text-center text-xs text-muted-foreground">
                    Generating for: <span className="text-foreground font-medium">{institution.name}</span>
                  </p>
                )}
              </div>
            )}

            {/* Step 1: Choose Criteria */}
            {step === 1 && (
              <div className="space-y-6">
                <div className="text-center space-y-2">
                  <h2 className="font-heading text-xl font-bold">Select Criteria to Generate</h2>
                  <p className="text-sm text-muted-foreground">Pick which NAAC criteria sections to include in your SAR.</p>
                </div>
                <div className="flex justify-center">
                  <Button variant="outline" size="sm" onClick={selectAll} className="border-border">
                    Select All
                  </Button>
                </div>
                <div className="grid grid-cols-1 gap-3 max-w-2xl mx-auto">
                  {NAAC_CRITERIA.map((name, i) => {
                    const num = i + 1;
                    const selected = selectedCriteria.includes(num);
                    const dbCriterion = criteriaData?.find((c) => c.criterion_number === num);
                    return (
                      <button
                        key={num}
                        onClick={() => toggleCriterion(num)}
                        className={`flex items-center gap-4 p-4 rounded-lg border-2 transition-all text-left ${
                          selected
                            ? "border-primary bg-primary/10"
                            : "border-border bg-card hover:border-primary/50"
                        }`}
                      >
                        <div
                          className={`h-6 w-6 rounded flex items-center justify-center shrink-0 ${
                            selected ? "bg-primary text-primary-foreground" : "border border-border"
                          }`}
                        >
                          {selected && <Check className="h-3 w-3" />}
                        </div>
                        <div className="flex-1">
                          <p className="font-heading font-bold text-sm">
                            Criterion {num}: {name}
                          </p>
                          {dbCriterion && (
                            <p className="text-xs text-muted-foreground mt-0.5">
                              {dbCriterion.completion_percentage}% complete · {dbCriterion.evidence_count || 0} evidence files
                            </p>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Step 2: AI Generates */}
            {step === 2 && (
              <div className="space-y-6">
                <div className="text-center space-y-2">
                  <Sparkles className="h-12 w-12 text-primary/50 mx-auto" />
                  <h2 className="font-heading text-xl font-bold">AI Report Generation</h2>
                  <p className="text-sm text-muted-foreground">
                    {isGenerating
                      ? `Generating Criterion ${currentGenerating} of ${selectedCriteria.length} selected...`
                      : "Click Generate to start AI-powered report drafting."}
                  </p>
                </div>

                {!isGenerating && Object.keys(generatedSections).length === 0 && (
                  <div className="flex justify-center">
                    <Button onClick={handleGenerate} className="gap-2">
                      <Sparkles className="h-4 w-4" /> Generate with AI
                    </Button>
                  </div>
                )}

                {isGenerating && (
                  <div className="flex justify-center">
                    <Button variant="destructive" onClick={handleStop} className="gap-2">
                      <StopCircle className="h-4 w-4" /> Stop Generation
                    </Button>
                  </div>
                )}

                {/* Live streaming preview */}
                {selectedCriteria.map((num) => {
                  const content = generatedSections[num];
                  if (!content) return null;
                  return (
                    <div key={num} className="border border-border rounded-lg p-6 bg-card/50">
                      <div className="flex items-center gap-2 mb-4">
                        <h3 className="font-heading font-bold text-sm">
                          Criterion {num}: {NAAC_CRITERIA[num - 1]}
                        </h3>
                        {currentGenerating === num && (
                          <Loader2 className="h-4 w-4 animate-spin text-primary" />
                        )}
                      </div>
                      <div className="prose prose-sm prose-invert max-w-none text-foreground">
                        <ReactMarkdown>{content}</ReactMarkdown>
                      </div>
                    </div>
                  );
                })}

                {!isGenerating && Object.keys(generatedSections).length > 0 && (
                  <div className="flex justify-center gap-3">
                    <Button variant="outline" onClick={handleGenerate} className="gap-2 border-border">
                      <Sparkles className="h-4 w-4" /> Regenerate
                    </Button>
                    <Button onClick={() => setStep(3)} className="gap-2">
                      Review Report <ArrowRight className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>
            )}

            {/* Step 3: Review & Export */}
            {step === 3 && (
              <div className="space-y-6">
                <div className="text-center space-y-2">
                  <h2 className="font-heading text-xl font-bold">Review & Export</h2>
                  <p className="text-sm text-muted-foreground">
                    Review the generated report sections below. Export when ready.
                  </p>
                </div>

                {selectedCriteria.map((num) => {
                  const content = generatedSections[num];
                  return (
                    <div key={num} className="border border-border rounded-lg p-6 bg-card/50">
                      <h3 className="font-heading font-bold text-sm mb-4">
                        Criterion {num}: {NAAC_CRITERIA[num - 1]}
                      </h3>
                      <div className="prose prose-sm prose-invert max-w-none text-foreground">
                        <ReactMarkdown>{content || "(Not generated)"}</ReactMarkdown>
                      </div>
                    </div>
                  );
                })}

                <div className="flex justify-center gap-3">
                  <Button onClick={handleExport} className="gap-2">
                    <Download className="h-4 w-4" /> Export as Markdown
                  </Button>
                  <Button variant="outline" onClick={() => setStep(2)} className="gap-2 border-border">
                    <ArrowLeft className="h-4 w-4" /> Back to Edit
                  </Button>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <div className="flex justify-between">
          <Button
            variant="outline"
            className="border-border gap-2"
            disabled={step === 0 || isGenerating}
            onClick={() => setStep((s) => s - 1)}
          >
            <ArrowLeft className="h-4 w-4" /> Previous
          </Button>
          {step < 2 && (
            <Button
              className="gap-2"
              disabled={!canProceed() || isGenerating}
              onClick={() => setStep((s) => s + 1)}
            >
              Next <ArrowRight className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
