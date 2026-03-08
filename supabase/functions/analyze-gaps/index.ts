import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { criteriaData, institutionName } = await req.json();

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const prompt = `You are a NAAC accreditation expert. Analyze the following criteria data for "${institutionName || "the institution"}" and identify compliance gaps.

Criteria Data:
${JSON.stringify(criteriaData, null, 2)}

For each gap found, return a JSON array of objects with these fields:
- criterion_number (integer 1-7)
- gap_description (string, specific and actionable)
- severity ("critical", "moderate", or "minor")
- ai_suggested_action (string, concrete next step)
- assigned_department (string, which department should handle this)

Focus on:
- Criteria with low completion percentages
- Missing evidence counts vs required
- Common NAAC documentation gaps

Return ONLY valid JSON array, no markdown or extra text.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: "You are a NAAC accreditation gap analysis expert. Always respond with valid JSON arrays only." },
          { role: "user", content: prompt },
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "report_gaps",
              description: "Report identified accreditation gaps",
              parameters: {
                type: "object",
                properties: {
                  gaps: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        criterion_number: { type: "integer" },
                        gap_description: { type: "string" },
                        severity: { type: "string", enum: ["critical", "moderate", "minor"] },
                        ai_suggested_action: { type: "string" },
                        assigned_department: { type: "string" },
                      },
                      required: ["criterion_number", "gap_description", "severity", "ai_suggested_action", "assigned_department"],
                      additionalProperties: false,
                    },
                  },
                },
                required: ["gaps"],
                additionalProperties: false,
              },
            },
          },
        ],
        tool_choice: { type: "function", function: { name: "report_gaps" } },
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

    const data = await response.json();
    const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];
    let gaps: any[] = [];

    if (toolCall?.function?.arguments) {
      const parsed = JSON.parse(toolCall.function.arguments);
      gaps = parsed.gaps || [];
    }

    return new Response(JSON.stringify({ gaps }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("analyze-gaps error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
