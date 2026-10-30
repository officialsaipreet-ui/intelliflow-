import { BrandMark } from "@/components/ui/BrandMark";
import { Bot, Loader2, Radio, Workflow } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import { Link } from "react-router-dom";

const FEATURES: { Icon: LucideIcon; text: string }[] = [
  { Icon: Workflow, text: "Drag-and-drop flow builder with 39 nodes" },
  { Icon: Bot, text: "AI agents, LLMs and vector search built in" },
  { Icon: Radio, text: "Live execution events over WebSocket" },
];

interface AuthFormLayoutProps {
  /** Page heading e.g. "Sign in" or "Create account" */
  title: string;
  /** Error message to display (if any) */
  error?: string | null;
  /** Form fields and submit button */
  children: ReactNode;
  /** Submit button props */
  submitLabel: string;
  submitLoadingLabel: string;
  submitIcon: LucideIcon;
  loading: boolean;
  onSubmit: (e: React.FormEvent) => void;
  /** Footer link */
  footerText: string;
  footerLinkText: string;
  footerLinkTo: string;
}

export function AuthFormLayout({
  title,
  error,
  children,
  submitLabel,
  submitLoadingLabel,
  submitIcon: Icon,
  loading,
  onSubmit,
  footerText,
  footerLinkText,
  footerLinkTo,
}: AuthFormLayoutProps) {
  return (
    <div className="min-h-screen bg-slate-950 bg-ember-glow grid lg:grid-cols-2">
      {/* Brand story (wide screens only) */}
      <aside className="hidden lg:flex flex-col justify-between p-12 border-r border-slate-800/80">
        <BrandMark subtitle="Visual Workflow Studio" />
        <div className="max-w-md">
          <h2 className="font-display text-4xl leading-tight text-slate-50">
            Connect anything.
            <br />
            <span className="bg-ember-gradient bg-clip-text text-transparent">
              Automate everything.
            </span>
          </h2>
          <p className="mt-4 text-sm text-slate-400 leading-relaxed">
            Drag nodes onto the canvas, wire them together and watch your
            workflows run live: HTTP, databases, AI models, messaging and more.
          </p>
          <ul className="mt-8 space-y-3">
            {FEATURES.map(({ Icon: FeatureIcon, text }) => (
              <li
                key={text}
                className="flex items-center gap-3 text-sm text-slate-300"
              >
                <span className="w-8 h-8 rounded-full bg-ember-500/15 border border-ember-500/30 flex items-center justify-center">
                  <FeatureIcon size={14} className="text-ember-400" />
                </span>
                {text}
              </li>
            ))}
          </ul>
        </div>
        <p className="text-xs text-slate-600">
          Intelliflow &middot; Final Year Project
        </p>
      </aside>

      <div className="flex items-center justify-center p-4">
        <div className="w-full max-w-sm">
          <div className="flex justify-center mb-8 lg:hidden">
            <BrandMark subtitle="Visual Workflow Studio" />
          </div>

          {/* Form card */}
          <div className="bg-slate-900/80 backdrop-blur border border-slate-800 rounded-2xl p-7 shadow-2xl shadow-black/40">
            <h2 className="font-display text-2xl text-slate-100 mb-1">
              {title}
            </h2>
            <div className="h-1 w-10 rounded-full bg-ember-gradient mb-6" />

            {error && (
              <div className="mb-4 p-3 bg-red-900/30 border border-red-800 rounded-lg text-sm text-red-300">
                {error}
              </div>
            )}

            <form onSubmit={onSubmit} className="space-y-4">
              {children}
              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-ember-gradient
                  hover:brightness-110 text-white text-sm font-semibold rounded-xl transition
                  shadow-lg shadow-ember-900/40 disabled:opacity-60"
              >
                {loading ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <Icon size={16} />
                )}
                {loading ? submitLoadingLabel : submitLabel}
              </button>
            </form>

            <p className="mt-5 text-center text-xs text-slate-500">
              {footerText}{" "}
              <Link
                to={footerLinkTo}
                className="font-medium text-ember-400 hover:text-ember-300"
              >
                {footerLinkText}
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
