import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Badge } from "@workspace/ui/badge";
import { Button } from "@workspace/ui/button";
import {
  Loader2, Layers, ChevronDown, ChevronRight, CheckCircle2, ClipboardList,
  PlayCircle, BarChart3, X, Check, Minus, XCircle,
} from "lucide-react";

interface TestCase {
  id: number;
  feature_id: number;
  name: string;
  steps: string[];
  expected_result: string;
}

interface Feature {
  id: number;
  title: string;
  description: string;
  category: string;
  status: string;
  implemented_at: string;
  test_cases: TestCase[];
}

interface RunSummary {
  feature_id: number;
  environment: "dev" | "production";
  passed: number;
  failed: number;
  skipped: number;
  run_at: string;
}

type TcResult = "pass" | "fail" | "skip";
type Env = "dev" | "production";

const CATEGORY_META: Record<string, { label: string; color: string }> = {
  theme:      { label: "Theme",      color: "bg-emerald-100 text-emerald-800 border-emerald-200" },
  fix:        { label: "Bug Fix",    color: "bg-red-100 text-red-800 border-red-200" },
  calculator: { label: "Calculator", color: "bg-blue-100 text-blue-800 border-blue-200" },
  ui:         { label: "UI",         color: "bg-purple-100 text-purple-800 border-purple-200" },
  content:    { label: "Content",    color: "bg-amber-100 text-amber-800 border-amber-200" },
  general:    { label: "General",    color: "bg-gray-100 text-gray-800 border-gray-200" },
};

const CATEGORIES = ["all", "theme", "fix", "calculator", "ui", "content", "general"];

function generateRunId() {
  return `run_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

function RunDot({ summary }: { summary?: RunSummary }) {
  if (!summary) return <span className="text-muted-foreground/40 text-[10px]">—</span>;
  const total = (summary.passed ?? 0) + (summary.failed ?? 0) + (summary.skipped ?? 0);
  if ((summary.failed ?? 0) > 0)
    return <span className="inline-flex items-center gap-0.5 text-[10px] font-bold text-red-600"><XCircle className="w-3 h-3" />{summary.passed}/{total}</span>;
  return <span className="inline-flex items-center gap-0.5 text-[10px] font-bold text-green-600"><CheckCircle2 className="w-3 h-3" />{summary.passed}/{total}</span>;
}

// ── RunModal ──────────────────────────────────────────────────────────────────
function RunModal({
  features, currentIdx, runId, onSave, onClose,
}: {
  features: Feature[];
  currentIdx: number;
  runId: string;
  onSave: (featureId: number, runId: string, env: Env, results: { test_case_id: number; result: TcResult }[]) => Promise<void>;
  onClose: () => void;
}) {
  const feature = features[currentIdx];
  const isRunAll = features.length > 1;
  const isLast = currentIdx === features.length - 1;

  const [env, setEnv] = useState<Env>("dev");
  const [tcResults, setTcResults] = useState<Record<number, TcResult>>({});
  const [expandedSteps, setExpandedSteps] = useState<Record<number, boolean>>({});
  const [saving, setSaving] = useState(false);

  // Reset per-TC state when advancing to next feature
  useState(() => { setTcResults({}); setExpandedSteps({}); });

  async function handleSave() {
    setSaving(true);
    const results = feature.test_cases.map(tc => ({
      test_case_id: tc.id,
      result: tcResults[tc.id] ?? "skip",
    }));
    await onSave(feature.id, runId, env, results);
    setSaving(false);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/50">
      <div className="bg-background border border-border rounded-t-xl sm:rounded-xl shadow-2xl w-full sm:max-w-lg flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-start justify-between px-5 py-4 border-b border-border shrink-0">
          <div className="flex-1 min-w-0 mr-3">
            {isRunAll && (
              <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground mb-0.5">
                Feature {currentIdx + 1} of {features.length}
              </p>
            )}
            <h2 className="text-sm font-bold text-foreground leading-tight">{feature.title}</h2>
            <p className="text-[11px] text-muted-foreground mt-0.5">{feature.test_cases.length} test case{feature.test_cases.length !== 1 ? "s" : ""}</p>
          </div>
          <div className="flex items-center gap-1.5 shrink-0">
            {(["dev", "production"] as Env[]).map(e => (
              <button
                key={e}
                onClick={() => setEnv(e)}
                className={`px-2.5 py-1 rounded text-[11px] font-semibold border transition-all ${
                  env === e
                    ? e === "dev" ? "bg-primary text-primary-foreground border-primary" : "bg-orange-500 text-white border-orange-500"
                    : "border-border text-muted-foreground hover:border-foreground/30"
                }`}
              >
                {e === "dev" ? "Dev" : "Prod"}
              </button>
            ))}
            <button onClick={onClose} className="ml-1 p-1 rounded hover:bg-muted text-muted-foreground">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto divide-y divide-border/50">
          {feature.test_cases.length === 0 && (
            <div className="p-8 text-center text-muted-foreground text-sm">No test cases for this feature.</div>
          )}
          {feature.test_cases.map((tc, i) => (
            <div key={tc.id} className="p-4">
              <div className="flex items-start gap-2 mb-2.5">
                <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-muted text-[10px] font-bold text-muted-foreground shrink-0 mt-0.5">{i + 1}</span>
                <p className="text-xs font-semibold text-foreground leading-snug flex-1">{tc.name}</p>
              </div>
              <div className="ml-7">
                <button
                  className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1 mb-1.5"
                  onClick={() => setExpandedSteps(s => ({ ...s, [tc.id]: !s[tc.id] }))}
                >
                  Steps {expandedSteps[tc.id] ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
                </button>
                {expandedSteps[tc.id] && (
                  <ol className="space-y-1 mb-3">
                    {tc.steps.map((step, si) => (
                      <li key={si} className="text-xs text-muted-foreground leading-relaxed">
                        <span className="font-mono text-[10px] font-bold text-muted-foreground/60 mr-2">{si + 1}.</span>{step}
                      </li>
                    ))}
                  </ol>
                )}
                <div className="pl-3 border-l-2 border-secondary/30 mb-3">
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-0.5">Expected</p>
                  <p className="text-xs text-foreground leading-relaxed">{tc.expected_result}</p>
                </div>
                <div className="flex gap-2">
                  {(["pass", "fail", "skip"] as TcResult[]).map(r => (
                    <button
                      key={r}
                      onClick={() => setTcResults(prev => ({ ...prev, [tc.id]: r }))}
                      className={`px-3 py-1.5 rounded text-[11px] font-semibold flex items-center gap-1.5 border transition-all ${
                        tcResults[tc.id] === r
                          ? r === "pass" ? "bg-green-600 text-white border-green-600"
                          : r === "fail" ? "bg-red-600 text-white border-red-600"
                          : "bg-slate-500 text-white border-slate-500"
                          : "border-border text-muted-foreground hover:border-foreground/30"
                      }`}
                    >
                      {r === "pass" ? <Check className="w-3 h-3" /> : r === "fail" ? <X className="w-3 h-3" /> : <Minus className="w-3 h-3" />}
                      {r.charAt(0).toUpperCase() + r.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="px-5 py-3.5 border-t border-border flex items-center justify-between shrink-0">
          <button onClick={onClose} className="text-xs text-muted-foreground hover:text-foreground transition-colors">Cancel</button>
          <Button
            onClick={handleSave}
            disabled={saving || feature.test_cases.length === 0}
            size="sm"
            className="text-xs"
          >
            {saving ? "Saving…" : isLast || !isRunAll ? "Save Results" : "Save & Next →"}
          </Button>
        </div>
      </div>
    </div>
  );
}

// ── CompareTable ──────────────────────────────────────────────────────────────
function CompareTable({ features, latestRuns }: { features: Feature[]; latestRuns: RunSummary[] }) {
  const getRunFor = (fid: number, env: Env) => latestRuns.find(r => Number(r.feature_id) === fid && r.environment === env);

  const sorted = [...features].sort((a, b) => {
    const score = (f: Feature) => {
      const d = getRunFor(f.id, "dev"), p = getRunFor(f.id, "production");
      if ((d?.failed ?? 0) > 0 || (p?.failed ?? 0) > 0) return 0;
      if (!d && !p) return 1;
      return 2;
    };
    return score(a) - score(b);
  });

  function Cell({ summary }: { summary?: RunSummary }) {
    if (!summary) return <span className="text-muted-foreground/40 text-xs">Not tested</span>;
    const total = (summary.passed ?? 0) + (summary.failed ?? 0) + (summary.skipped ?? 0);
    const date = new Date(summary.run_at).toLocaleDateString("en-US", { month: "short", day: "numeric" });
    return (summary.failed ?? 0) > 0 ? (
      <span className="inline-flex items-center gap-1 text-xs font-semibold text-red-600">
        <XCircle className="w-3.5 h-3.5" />{summary.passed}/{total}
        <span className="font-normal text-[10px] text-muted-foreground ml-1">{date}</span>
      </span>
    ) : (
      <span className="inline-flex items-center gap-1 text-xs font-semibold text-green-600">
        <CheckCircle2 className="w-3.5 h-3.5" />{summary.passed}/{total}
        <span className="font-normal text-[10px] text-muted-foreground ml-1">{date}</span>
      </span>
    );
  }

  return (
    <div className="border border-border rounded-lg overflow-hidden mb-6">
      <div className="grid grid-cols-[1fr_160px_160px] bg-muted/30 border-b border-border">
        <div className="px-4 py-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Feature</div>
        <div className="px-4 py-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Dev</div>
        <div className="px-4 py-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Production</div>
      </div>
      <div className="divide-y divide-border/50">
        {sorted.map(f => {
          const dev = getRunFor(f.id, "dev"), prod = getRunFor(f.id, "production");
          const mismatch = dev && prod && (dev.failed > 0) !== (prod.failed > 0);
          return (
            <div key={f.id} className={`grid grid-cols-[1fr_160px_160px] items-center ${mismatch ? "bg-amber-50/60" : ""}`}>
              <div className="px-4 py-2.5">
                <p className="text-xs font-semibold text-foreground leading-snug">{f.title}</p>
                {f.test_cases.length === 0 && <p className="text-[10px] text-muted-foreground/50">no test cases</p>}
              </div>
              <div className="px-4 py-2.5"><Cell summary={dev} /></div>
              <div className="px-4 py-2.5"><Cell summary={prod} /></div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── FeatureCard ───────────────────────────────────────────────────────────────
function FeatureCard({
  feature, devRun, prodRun, onRunClick,
}: {
  feature: Feature;
  devRun?: RunSummary;
  prodRun?: RunSummary;
  onRunClick: () => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const meta = CATEGORY_META[feature.category] ?? CATEGORY_META.general;
  const hasCases = feature.test_cases.length > 0;

  return (
    <div className="border border-border rounded-lg bg-background overflow-hidden">
      <div className="flex items-start gap-3 p-4">
        <CheckCircle2 className="w-5 h-5 text-secondary shrink-0 mt-0.5" />
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <Badge variant="outline" className={`text-[11px] font-semibold border ${meta.color}`}>{meta.label}</Badge>
            {feature.status === "active" && (
              <Badge variant="outline" className="text-[11px] font-semibold border bg-green-50 text-green-700 border-green-200">Active</Badge>
            )}
          </div>
          <p className="text-sm font-semibold text-foreground leading-snug">{feature.title}</p>
          <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{feature.description}</p>
          <div className="flex items-center flex-wrap gap-x-4 gap-y-1 mt-1.5">
            <p className="text-xs text-muted-foreground/60">
              {hasCases ? `${feature.test_cases.length} test case${feature.test_cases.length !== 1 ? "s" : ""}` : "no test cases"}
              {" · "}
              {new Date(feature.implemented_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
            </p>
            <div className="flex items-center gap-3 text-[10px] text-muted-foreground">
              <span>Dev: <RunDot summary={devRun} /></span>
              <span>Prod: <RunDot summary={prodRun} /></span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-1 shrink-0">
          {hasCases && (
            <button
              onClick={onRunClick}
              className="flex items-center gap-1 px-2 py-1 rounded text-[10px] font-semibold text-muted-foreground border border-border hover:border-primary/60 hover:text-primary transition-colors"
            >
              <PlayCircle className="w-3 h-3" />Run
            </button>
          )}
          {hasCases && (
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0 shrink-0" onClick={() => setExpanded(e => !e)}>
              {expanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
            </Button>
          )}
        </div>
      </div>

      {expanded && hasCases && (
        <div className="border-t border-border bg-muted/20 divide-y divide-border/50">
          {feature.test_cases.map(tc => (
            <div key={tc.id} className="px-5 py-4">
              <div className="flex items-center gap-2 mb-2">
                <ClipboardList className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                <p className="text-xs font-semibold text-foreground">{tc.name}</p>
              </div>
              <ol className="space-y-1 mb-3 ml-5">
                {tc.steps.map((step, i) => (
                  <li key={i} className="text-xs text-muted-foreground leading-relaxed">
                    <span className="font-mono text-[10px] font-bold text-muted-foreground/60 mr-2">{i + 1}.</span>{step}
                  </li>
                ))}
              </ol>
              {tc.expected_result && (
                <div className="ml-5 pl-3 border-l-2 border-secondary/30">
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground mb-0.5">Expected Result</p>
                  <p className="text-xs text-foreground leading-relaxed">{tc.expected_result}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Main FeaturesPage ─────────────────────────────────────────────────────────
const CATEGORIES_WITH_COUNTS = CATEGORIES;

export default function FeaturesPage() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [showCompare, setShowCompare] = useState(false);
  const [runQueue, setRunQueue] = useState<Feature[] | null>(null);
  const [runQueueIdx, setRunQueueIdx] = useState(0);
  const [runId, setRunId] = useState("");
  const [latestRuns, setLatestRuns] = useState<RunSummary[]>([]);

  const { data: features = [], isLoading } = useQuery<Feature[]>({
    queryKey: ["amanda-features"],
    queryFn: () => api("/admin/features", { auth: true }),
  });

  const { data: runsData } = useQuery<RunSummary[]>({
    queryKey: ["amanda-feature-runs"],
    queryFn: () => api("/admin/feature-runs/latest", { auth: true }),
  });

  useEffect(() => {
    if (runsData) setLatestRuns(runsData);
  }, [runsData]);

  const getRunFor = (fid: number, env: Env) =>
    latestRuns.find(r => Number(r.feature_id) === fid && r.environment === env);

  const filtered = activeCategory === "all"
    ? features
    : features.filter(f => f.category === activeCategory);

  const counts = CATEGORIES_WITH_COUNTS.reduce<Record<string, number>>((acc, cat) => {
    acc[cat] = cat === "all" ? features.length : features.filter(f => f.category === cat).length;
    return acc;
  }, {});

  const totalTests = features.reduce((sum, f) => sum + f.test_cases.length, 0);
  const featuresWithCases = features.filter(f => f.test_cases.length > 0);
  const totalFails = latestRuns.filter(r => (r.failed ?? 0) > 0).length;

  function startRun(queue: Feature[]) {
    setRunId(generateRunId());
    setRunQueue(queue);
    setRunQueueIdx(0);
  }

  async function handleSave(featureId: number, rid: string, env: Env, results: { test_case_id: number; result: TcResult }[]) {
    await api("/admin/feature-runs", {
      method: "POST",
      auth: true,
      body: { run_id: rid, feature_id: featureId, environment: env, results },
    });
    const passed = results.filter(r => r.result === "pass").length;
    const failed = results.filter(r => r.result === "fail").length;
    const skipped = results.filter(r => r.result === "skip").length;
    const newRun: RunSummary = { feature_id: featureId, environment: env, passed, failed, skipped, run_at: new Date().toISOString() };
    setLatestRuns(prev => [...prev.filter(r => !(Number(r.feature_id) === featureId && r.environment === env)), newRun]);

    if (runQueue && runQueueIdx < runQueue.length - 1) {
      setRunQueueIdx(i => i + 1);
    } else {
      setRunQueue(null);
    }
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-start justify-between gap-3 flex-wrap mb-1">
          <div className="flex items-center gap-3">
            <Layers className="w-6 h-6 text-primary" />
            <h1 className="text-2xl font-bold text-foreground">Features &amp; Test Cases</h1>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowCompare(c => !c)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                showCompare ? "bg-primary text-primary-foreground border-primary" : "border-border text-muted-foreground hover:border-primary/50"
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5" />Compare
            </button>
            {featuresWithCases.length > 0 && (
              <Button size="sm" onClick={() => startRun(featuresWithCases)} className="text-xs gap-1.5">
                <PlayCircle className="w-3.5 h-3.5" />Run All
              </Button>
            )}
          </div>
        </div>
        <p className="text-sm text-muted-foreground">
          Run tests against Dev or Production to compare environments side by side.
        </p>
        {!isLoading && (
          <div className="mt-4 flex flex-wrap gap-6 text-sm">
            <div><span className="font-bold text-foreground">{features.length}</span><span className="text-muted-foreground ml-1">features</span></div>
            <div><span className="font-bold text-foreground">{totalTests}</span><span className="text-muted-foreground ml-1">test cases</span></div>
            {totalFails > 0 && <div><span className="font-bold text-red-600">{totalFails}</span><span className="text-muted-foreground ml-1">failing</span></div>}
          </div>
        )}
      </div>

      {showCompare && !isLoading && <CompareTable features={features} latestRuns={latestRuns} />}

      <div className="flex flex-wrap gap-2 mb-6">
        {CATEGORIES_WITH_COUNTS.filter(cat => counts[cat] > 0).map(cat => {
          const meta = cat === "all" ? { label: "All", color: "" } : (CATEGORY_META[cat] ?? { label: cat, color: "" });
          const isActive = activeCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                isActive ? "bg-primary text-primary-foreground border-primary" : "bg-background text-muted-foreground border-border hover:border-primary/50 hover:text-foreground"
              }`}
            >
              {meta.label} <span className="ml-1 opacity-60">{counts[cat]}</span>
            </button>
          );
        })}
      </div>

      {isLoading && (
        <div className="flex items-center justify-center py-20 text-muted-foreground">
          <Loader2 className="w-5 h-5 animate-spin mr-2" />Loading features…
        </div>
      )}

      {!isLoading && filtered.length === 0 && (
        <div className="py-16 text-center text-muted-foreground">
          <Layers className="w-10 h-10 mx-auto mb-3 opacity-30" />
          <p className="font-medium">No features in this category yet.</p>
        </div>
      )}

      {!isLoading && filtered.length > 0 && (
        <div className="space-y-2">
          {filtered.map(feature => (
            <FeatureCard
              key={feature.id}
              feature={feature}
              devRun={getRunFor(feature.id, "dev")}
              prodRun={getRunFor(feature.id, "production")}
              onRunClick={() => startRun([feature])}
            />
          ))}
        </div>
      )}

      {runQueue && (
        <RunModal
          features={runQueue}
          currentIdx={runQueueIdx}
          runId={runId}
          onSave={handleSave}
          onClose={() => setRunQueue(null)}
        />
      )}
    </div>
  );
}
