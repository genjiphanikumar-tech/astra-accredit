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
    const { moodleUrl, apiToken, action } = await req.json();

    if (!moodleUrl || !apiToken) {
      return new Response(
        JSON.stringify({ success: false, error: "Moodle URL and API token are required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Normalize URL
    let baseUrl = moodleUrl.trim().replace(/\/+$/, "");
    if (!baseUrl.startsWith("http")) baseUrl = `https://${baseUrl}`;
    const wsUrl = `${baseUrl}/webservice/rest/server.php`;

    if (action === "test") {
      // Test connection by fetching site info
      const resp = await fetch(
        `${wsUrl}?wstoken=${apiToken}&wsfunction=core_webservice_get_site_info&moodlewsrestformat=json`
      );
      const data = await resp.json();

      if (data.exception) {
        return new Response(
          JSON.stringify({ success: false, error: data.message || "Invalid token or URL" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      return new Response(
        JSON.stringify({
          success: true,
          siteName: data.sitename,
          siteUrl: data.siteurl,
          username: data.username,
          functions: data.functions?.length || 0,
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (action === "sync") {
      const results: Record<string, number> = {};

      // Fetch courses
      try {
        const coursesResp = await fetch(
          `${wsUrl}?wstoken=${apiToken}&wsfunction=core_course_get_courses&moodlewsrestformat=json`
        );
        const courses = await coursesResp.json();
        if (Array.isArray(courses)) {
          results.courses = courses.length;
        }
      } catch { results.courses = 0; }

      // Fetch enrolled users (from first few courses)
      try {
        const usersResp = await fetch(
          `${wsUrl}?wstoken=${apiToken}&wsfunction=core_user_get_users&moodlewsrestformat=json&criteria[0][key]=email&criteria[0][value]=%25`
        );
        const usersData = await usersResp.json();
        if (usersData.users && Array.isArray(usersData.users)) {
          results.users = usersData.users.length;
        }
      } catch { results.users = 0; }

      // Fetch categories
      try {
        const catResp = await fetch(
          `${wsUrl}?wstoken=${apiToken}&wsfunction=core_course_get_categories&moodlewsrestformat=json`
        );
        const cats = await catResp.json();
        if (Array.isArray(cats)) {
          results.categories = cats.length;
        }
      } catch { results.categories = 0; }

      const totalRecords = Object.values(results).reduce((a, b) => a + b, 0);

      return new Response(
        JSON.stringify({ success: true, records: totalRecords, details: results }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ success: false, error: "Invalid action. Use 'test' or 'sync'." }),
      { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (e) {
    console.error("moodle-sync error:", e);
    return new Response(
      JSON.stringify({ success: false, error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
