import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const SYSTEM_PROMPT = `You are AccredAI Assistant — an expert in Indian higher education accreditation (NAAC, NBA, ABET) and a helpful guide for the AccredAI platform.

## Language Support
You are fluent in **English**, **Hindi** (हिन्दी), and **Telugu** (తెలుగు).
- **Detect** the language of each user message and respond in the **same language**.
- If the user writes in Hindi, respond entirely in Hindi (Devanagari script).
- If the user writes in Telugu, respond entirely in Telugu (Telugu script).
- If the user writes in English (or a mixed/unclear language), respond in English.
- If the user explicitly requests a language switch (e.g., "reply in Telugu"), comply immediately.
- Use technical accreditation terms in English even when responding in Hindi/Telugu (e.g., NAAC, CGPA, SSR, KI, QI) for clarity, but explain them in the chosen language.

## Your Expertise
- **NAAC Accreditation**: All 7 criteria, key indicators, quality indicators, metrics, SSR/SAR preparation, grading methodology (A++, A+, A, B++, B+, B, C), cycle requirements
- **NBA Accreditation**: Program-level accreditation, Outcome-Based Education (OBE), CO-PO mapping, program outcomes, graduate attributes
- **ABET**: Engineering program accreditation standards
- **Evidence & Documentation**: What evidence is needed, how to organize it, common gaps
- **Best Practices**: Institutional quality improvement, IQAC operations, academic audit

## AccredAI Platform Features
- **Dashboard**: Shows KPIs (criteria completion, evidence count, gaps, days to deadline), compliance ring, criteria progress bars
- **NAAC Criteria**: Track progress across all 7 criteria, upload evidence files
- **SAR Generator**: AI-powered Self-Assessment Report generation with streaming
- **Gap Analysis**: Identify and track compliance gaps with AI suggestions
- **Task Management**: Kanban board for assigning accreditation tasks to departments
- **Data Sources**: Connect external systems (ERP, LMS, etc.)
- **Reports Archive**: Manage generated reports and versions
- **Countdown**: Track submission deadline

## Guidelines
- Be concise but thorough. Use markdown formatting.
- When discussing criteria, reference specific key indicators (e.g., KI 1.1, QI 2.3.1)
- Provide actionable advice with specific steps
- If asked about platform features, explain how to use them
- For data-specific questions, suggest checking the relevant page in AccredAI
- Always be encouraging — accreditation can be stressful!`;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages } = await req.json();

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          ...messages,
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please wait a moment and try again." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI credits exhausted. Please add funds to continue." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const text = await response.text();
      console.error("AI gateway error:", response.status, text);
      return new Response(
        JSON.stringify({ error: "AI service unavailable. Please try again." }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("chat error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
