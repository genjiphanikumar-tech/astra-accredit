import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const NAAC_CRITERIA = [
  "Criterion 1: Curricular Aspects",
  "Criterion 2: Teaching-Learning and Evaluation",
  "Criterion 3: Research, Innovations and Extension",
  "Criterion 4: Infrastructure and Learning Resources",
  "Criterion 5: Student Support and Progression",
  "Criterion 6: Governance, Leadership and Management",
  "Criterion 7: Institutional Values and Best Practices",
];

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { criterionNumber, institutionName, accreditationBody, criteriaData } = await req.json();

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const criterionTitle = NAAC_CRITERIA[criterionNumber - 1] || `Criterion ${criterionNumber}`;

    const systemPrompt = `You are an expert NAAC accreditation consultant specializing in Self-Assessment Reports (SAR) for Indian Higher Education Institutions. 

Your task is to generate a detailed, well-structured SAR section for the given criterion. Follow NAAC guidelines precisely.

Guidelines:
- Use formal academic language appropriate for accreditation reports
- Include specific metrics, data points, and evidence references where applicable
- Structure the content with clear headings, sub-sections, and bullet points using markdown
- Reference relevant Key Indicators (KIs) and Quality Indicators (QIs)
- Include placeholder brackets [INSTITUTION_DATA] where specific institutional data should be inserted
- Aim for comprehensive coverage of all sub-criteria
- Be specific to Indian higher education context`;

    const userPrompt = `Generate a comprehensive SAR section for:

**Institution:** ${institutionName || "[Institution Name]"}
**Accreditation Body:** ${accreditationBody || "NAAC"}
**Section:** ${criterionTitle}

${criteriaData ? `**Available Data:** ${JSON.stringify(criteriaData)}` : ""}

Please generate a detailed, publication-ready section covering all key indicators and quality indicators for this criterion. Include:
1. An executive summary for this criterion
2. Detailed narrative for each sub-criterion/key indicator
3. Quantitative metrics with placeholders for actual data
4. Strengths and areas for improvement
5. Supporting evidence references`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
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
        JSON.stringify({ error: "AI generation failed. Please try again." }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("generate-sar error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
