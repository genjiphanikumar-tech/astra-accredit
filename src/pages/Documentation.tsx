import { Button } from "@/components/ui/button";
import { FileDown, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Documentation() {
  const navigate = useNavigate();

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header - Hidden in print */}
      <div className="print:hidden sticky top-0 z-10 bg-background/95 backdrop-blur border-b p-4 flex items-center justify-between">
        <Button variant="ghost" onClick={() => navigate(-1)}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Back
        </Button>
        <Button onClick={handlePrint} className="gap-2">
          <FileDown className="h-4 w-4" /> Export as PDF
        </Button>
      </div>

      {/* Printable Content */}
      <div className="max-w-4xl mx-auto p-8 print:p-0 print:max-w-none">
        {/* Cover */}
        <div className="text-center mb-12 print:mb-8 print:pt-12">
          <h1 className="text-5xl font-bold text-primary mb-4 print:text-4xl">Autoscale AI</h1>
          <p className="text-2xl text-muted-foreground print:text-xl">
            AI-Powered NAAC Accreditation Management Platform
          </p>
          <div className="mt-8 text-sm text-muted-foreground">
            Documentation & Feature Overview
          </div>
        </div>

        {/* Section 1 */}
        <section className="mb-10 print:mb-6">
          <h2 className="text-2xl font-bold text-primary border-b pb-2 mb-4 print:text-xl">
            🎯 What is Autoscale AI?
          </h2>
          <p className="text-foreground leading-relaxed">
            Autoscale AI is an <strong>AI-powered NAAC Accreditation Management Platform</strong> designed 
            to help educational institutions prepare for and manage their NAAC (National Assessment 
            and Accreditation Council) accreditation process efficiently. It streamlines evidence 
            collection, gap analysis, task management, and report generation.
          </p>
        </section>

        {/* Section 2 */}
        <section className="mb-10 print:mb-6">
          <h2 className="text-2xl font-bold text-primary border-b pb-2 mb-4 print:text-xl">
            📍 Key Pages & Features
          </h2>

          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-foreground">1. Dashboard</h3>
              <ul className="list-disc list-inside text-muted-foreground ml-4 mt-2 space-y-1">
                <li><strong>KPI Cards:</strong> Quick overview of completion %, evidence uploaded, gaps identified, days remaining</li>
                <li><strong>Compliance Ring:</strong> Visual progress indicator for overall accreditation readiness</li>
                <li><strong>Activity Feed:</strong> Recent actions and updates</li>
                <li><strong>Quick Actions:</strong> Shortcuts to generate reports, run gap analysis, assign tasks</li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-foreground">2. Data Sources</h3>
              <ul className="list-disc list-inside text-muted-foreground ml-4 mt-2 space-y-1">
                <li>Connect external systems (Moodle LMS, ERP, etc.)</li>
                <li>Configure API endpoints and sync schedules</li>
                <li>Track records imported from each source</li>
                <li>Real-time sync status and last-synced timestamps</li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-foreground">3. NAAC Criteria Tracker</h3>
              <ul className="list-disc list-inside text-muted-foreground ml-4 mt-2 space-y-1">
                <li><strong>7 NAAC Criteria</strong> with nested <strong>Key Indicators (KIs)</strong></li>
                <li>Upload evidence at criterion OR specific KI level</li>
                <li>Progress tracking with completion percentages</li>
                <li>Set required evidence counts per criterion</li>
                <li>View, download, and delete uploaded evidence files</li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-foreground">4. Gap Analysis</h3>
              <ul className="list-disc list-inside text-muted-foreground ml-4 mt-2 space-y-1">
                <li>AI-driven identification of accreditation gaps</li>
                <li>Manual gap entry with severity levels (High/Medium/Low)</li>
                <li>Assign gaps to specific departments</li>
                <li>AI-suggested actions for remediation</li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-foreground">5. SAR Generator</h3>
              <ul className="list-disc list-inside text-muted-foreground ml-4 mt-2 space-y-1">
                <li>Generate Self-Assessment Reports automatically</li>
                <li>AI compiles data from all criteria</li>
                <li>Export to PDF/DOCX formats</li>
                <li>Version history and draft management</li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-foreground">6. Task Management</h3>
              <ul className="list-disc list-inside text-muted-foreground ml-4 mt-2 space-y-1">
                <li>Create and assign tasks to team members</li>
                <li>Link tasks to specific criteria</li>
                <li>Priority levels and due dates</li>
                <li>Department-wise task distribution</li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-foreground">7. Countdown Timer</h3>
              <ul className="list-disc list-inside text-muted-foreground ml-4 mt-2 space-y-1">
                <li>Visual countdown to submission deadline</li>
                <li>Milestone tracking with completion status</li>
                <li>Overdue milestone alerts</li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-foreground">8. Reports Archive</h3>
              <ul className="list-disc list-inside text-muted-foreground ml-4 mt-2 space-y-1">
                <li>Historical reports storage</li>
                <li>Version management</li>
                <li>Download previous submissions (PDF, DOCX, Markdown)</li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-foreground">9. AI Assistant</h3>
              <ul className="list-disc list-inside text-muted-foreground ml-4 mt-2 space-y-1">
                <li><strong>Floating Widget:</strong> Quick access from any page</li>
                <li><strong>Full Chat Page:</strong> In-depth guidance</li>
                <li>Multilingual support: <strong>English, Hindi, Telugu</strong></li>
                <li>Context-aware accreditation help</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Section 3 */}
        <section className="mb-10 print:mb-6 print:break-before-page">
          <h2 className="text-2xl font-bold text-primary border-b pb-2 mb-4 print:text-xl">
            🔐 Authentication & Security
          </h2>
          <ul className="list-disc list-inside text-muted-foreground ml-4 space-y-2">
            <li>Email/Password signup and login</li>
            <li>Password reset via email</li>
            <li><strong>Role-based access control:</strong> Admin, Editor, Viewer</li>
            <li>Protected routes: All dashboard pages require authentication</li>
            <li><strong>Row-Level Security (RLS):</strong> Data isolation per institution</li>
          </ul>
        </section>

        {/* Section 4 */}
        <section className="mb-10 print:mb-6">
          <h2 className="text-2xl font-bold text-primary border-b pb-2 mb-4 print:text-xl">
            🏗️ Technical Architecture
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-border text-sm">
              <thead>
                <tr className="bg-muted">
                  <th className="border border-border px-4 py-2 text-left font-semibold">Layer</th>
                  <th className="border border-border px-4 py-2 text-left font-semibold">Technology</th>
                </tr>
              </thead>
              <tbody>
                <tr><td className="border border-border px-4 py-2">Frontend</td><td className="border border-border px-4 py-2">React + TypeScript + Vite</td></tr>
                <tr><td className="border border-border px-4 py-2">Styling</td><td className="border border-border px-4 py-2">Tailwind CSS + shadcn/ui</td></tr>
                <tr><td className="border border-border px-4 py-2">State Management</td><td className="border border-border px-4 py-2">TanStack Query + Zustand</td></tr>
                <tr><td className="border border-border px-4 py-2">Backend</td><td className="border border-border px-4 py-2">Lovable Cloud (PostgreSQL)</td></tr>
                <tr><td className="border border-border px-4 py-2">AI Processing</td><td className="border border-border px-4 py-2">Edge Functions with Lovable AI</td></tr>
                <tr><td className="border border-border px-4 py-2">3D Graphics</td><td className="border border-border px-4 py-2">React Three Fiber</td></tr>
                <tr><td className="border border-border px-4 py-2">Animations</td><td className="border border-border px-4 py-2">Framer Motion</td></tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Section 5 */}
        <section className="mb-10 print:mb-6">
          <h2 className="text-2xl font-bold text-primary border-b pb-2 mb-4 print:text-xl">
            📊 Database Schema
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-border text-sm">
              <thead>
                <tr className="bg-muted">
                  <th className="border border-border px-4 py-2 text-left font-semibold">Table</th>
                  <th className="border border-border px-4 py-2 text-left font-semibold">Purpose</th>
                </tr>
              </thead>
              <tbody>
                <tr><td className="border border-border px-4 py-2">institutions</td><td className="border border-border px-4 py-2">College/university profiles</td></tr>
                <tr><td className="border border-border px-4 py-2">criteria</td><td className="border border-border px-4 py-2">7 NAAC criteria per institution</td></tr>
                <tr><td className="border border-border px-4 py-2">key_indicators</td><td className="border border-border px-4 py-2">Sub-criteria under each criterion</td></tr>
                <tr><td className="border border-border px-4 py-2">evidence_files</td><td className="border border-border px-4 py-2">Uploaded documents linked to criteria/KIs</td></tr>
                <tr><td className="border border-border px-4 py-2">gaps</td><td className="border border-border px-4 py-2">Identified deficiencies</td></tr>
                <tr><td className="border border-border px-4 py-2">tasks</td><td className="border border-border px-4 py-2">Assigned work items</td></tr>
                <tr><td className="border border-border px-4 py-2">milestones</td><td className="border border-border px-4 py-2">Deadline tracking</td></tr>
                <tr><td className="border border-border px-4 py-2">reports</td><td className="border border-border px-4 py-2">Generated SAR documents</td></tr>
                <tr><td className="border border-border px-4 py-2">data_sources</td><td className="border border-border px-4 py-2">External system connections</td></tr>
                <tr><td className="border border-border px-4 py-2">profiles</td><td className="border border-border px-4 py-2">User profile information</td></tr>
                <tr><td className="border border-border px-4 py-2">user_roles</td><td className="border border-border px-4 py-2">Role-based permissions</td></tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Section 6 */}
        <section className="mb-10 print:mb-6">
          <h2 className="text-2xl font-bold text-primary border-b pb-2 mb-4 print:text-xl">
            🚀 Key Value Propositions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 print:grid-cols-2">
            <div className="p-4 border border-border rounded-lg">
              <h4 className="font-semibold text-foreground">⏱️ Saves Time</h4>
              <p className="text-sm text-muted-foreground">Automates evidence collection and report generation</p>
            </div>
            <div className="p-4 border border-border rounded-lg">
              <h4 className="font-semibold text-foreground">✅ Reduces Errors</h4>
              <p className="text-sm text-muted-foreground">AI identifies gaps before NAAC review</p>
            </div>
            <div className="p-4 border border-border rounded-lg">
              <h4 className="font-semibold text-foreground">👥 Improves Collaboration</h4>
              <p className="text-sm text-muted-foreground">Team task assignment and tracking</p>
            </div>
            <div className="p-4 border border-border rounded-lg">
              <h4 className="font-semibold text-foreground">📋 Ensures Compliance</h4>
              <p className="text-sm text-muted-foreground">Structured approach to all 7 criteria</p>
            </div>
            <div className="p-4 border border-border rounded-lg">
              <h4 className="font-semibold text-foreground">🌐 Multilingual Support</h4>
              <p className="text-sm text-muted-foreground">Accessible to diverse faculty (EN, HI, TE)</p>
            </div>
            <div className="p-4 border border-border rounded-lg">
              <h4 className="font-semibold text-foreground">📊 Real-time Progress</h4>
              <p className="text-sm text-muted-foreground">Visual dashboards show readiness at a glance</p>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="text-center text-sm text-muted-foreground border-t pt-6 mt-12">
          <p>AccredAI © {new Date().getFullYear()} — AI-Powered Accreditation Excellence</p>
        </footer>
      </div>
    </div>
  );
}
