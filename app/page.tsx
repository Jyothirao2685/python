"use client";

import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  CheckCircle2,
  Circle,
  ClipboardList,
  Clock,
  Code2,
  FileCode2,
  FolderGit2,
  Gauge,
  GraduationCap,
  Link as LinkIcon,
  ListChecks,
  Rocket,
  Sparkles,
  Terminal,
  Wand2,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";

/**
 * PYTHON MASTERY OS (COMPLETELY NEW)
 * - Focused dashboard for:
 *   1) Python Core
 *   2) Python for AI (Data + ML + DL)
 *   3) Project shipping system
 *   4) Weekly planner
 * - Checkboxes + notes saved in localStorage
 */

const STORAGE_KEY = "python_mastery_os_v1";

type ChecklistItem = { id: string; text: string };

type Module = {
  id: string;
  title: string;
  subtitle?: string;
  timeEstimate: string;
  learn: ChecklistItem[];
  build: ChecklistItem[];
  done: ChecklistItem[];
  notes?: string;
};

type Section = {
  id: string;
  title: string;
  icon: React.ReactNode;
  description: string;
  modules: Module[];
};

type ScoreboardItem = { id: string; label: string };

type LinkItem = {
  id: string;
  label: string;
  url: string;
  status: "official" | "placeholder";
  note?: string;
};

type AppState = {
  checked: Record<string, boolean>;
  customNotes: Record<string, string>; // module notes
  customLinks: Record<string, string>; // resources overrides
  weeklyPlanner: {
    weekNumber: number;
    focus: string;
    learn1: string;
    learn2: string;
    learn3: string;
    buildArtifact: string;
    repoName: string;
    demoProof: string;
    successMetrics: string;
    done1: string;
    done2: string;
    done3: string;
  };
  ui: {
    compactSidebar: boolean;
    showOnlyIncomplete: boolean;
  };
};

function pct(n: number, d: number) {
  if (d === 0) return 0;
  return Math.round((n / d) * 100);
}

function loadState(): AppState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) throw new Error("no state");
    const parsed = JSON.parse(raw);
    return {
      checked: parsed.checked ?? {},
      customNotes: parsed.customNotes ?? {},
      customLinks: parsed.customLinks ?? {},
      weeklyPlanner:
        parsed.weeklyPlanner ??
        ({
          weekNumber: 1,
          focus: "Python Core",
          learn1: "",
          learn2: "",
          learn3: "",
          buildArtifact: "",
          repoName: "",
          demoProof: "",
          successMetrics: "",
          done1: "",
          done2: "",
          done3: "",
        } as AppState["weeklyPlanner"]),
      ui: parsed.ui ?? { compactSidebar: false, showOnlyIncomplete: false },
    };
  } catch {
    return {
      checked: {},
      customNotes: {},
      customLinks: {},
      weeklyPlanner: {
        weekNumber: 1,
        focus: "Python Core",
        learn1: "",
        learn2: "",
        learn3: "",
        buildArtifact: "",
        repoName: "",
        demoProof: "",
        successMetrics: "",
        done1: "",
        done2: "",
        done3: "",
      },
      ui: { compactSidebar: false, showOnlyIncomplete: false },
    };
  }
}

function saveState(state: AppState) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // ignore
  }
}

const SCOREBOARD: ScoreboardItem[] = [
  { id: "sb_py_core", label: "Python Core Mastered" },
  { id: "sb_py_tools", label: "Python Tooling & Debugging" },
  { id: "sb_data", label: "Data Stack (NumPy/Pandas)" },
  { id: "sb_viz", label: "Visualization & EDA" },
  { id: "sb_ml", label: "Machine Learning (sklearn)" },
  { id: "sb_dl", label: "Deep Learning (PyTorch)" },
  { id: "sb_mle", label: "MLOps (training → serving)" },
  { id: "sb_ship_10", label: "Shipped 10 Python Projects" },
];

const LINKS: LinkItem[] = [
  { id: "link_python_docs", label: "Python Docs (Official)", url: "https://docs.python.org/3/", status: "official" },
  { id: "link_numpy", label: "NumPy Docs (Official)", url: "https://numpy.org/doc/", status: "official" },
  { id: "link_pandas", label: "Pandas Docs (Official)", url: "https://pandas.pydata.org/docs/", status: "official" },
  { id: "link_matplotlib", label: "Matplotlib Docs (Official)", url: "https://matplotlib.org/stable/", status: "official" },
  { id: "link_sklearn", label: "scikit-learn Docs (Official)", url: "https://scikit-learn.org/stable/", status: "official" },
  { id: "link_pytorch", label: "PyTorch Tutorials (Official)", url: "https://pytorch.org/tutorials/", status: "official" },
  { id: "link_fastapi", label: "FastAPI Docs (Official)", url: "https://fastapi.tiangolo.com/", status: "official" },
  { id: "link_uv", label: "uv (Python package manager)", url: "[PLACEHOLDER]", status: "placeholder", note: "Replace with Astral uv docs link." },
  { id: "link_ruff", label: "Ruff linter", url: "[PLACEHOLDER]", status: "placeholder", note: "Replace with Ruff docs link." },
];

const SECTIONS: Section[] = [
  {
    id: "home",
    title: "Dashboard",
    icon: <Gauge className="h-4 w-4" />,
    description: "Python mastery system: learn → build → ship. Everything tracked.",
    modules: [
      {
        id: "rules",
        title: "Rules (No BS)",
        subtitle: "Progress is measured in shipped artifacts",
        timeEstimate: "Always",
        learn: [
          { id: "r1", text: "Every topic must produce ONE artifact (repo/demo/benchmark)" },
          { id: "r2", text: "If it doesn’t ship → it doesn’t count" },
          { id: "r3", text: "Weekly: ship 1 mini project or milestone" },
        ],
        build: [
          { id: "b1", text: "Create a GitHub template repo: README + TODO + metrics" },
          { id: "b2", text: "Create /demos folder: videos, screenshots" },
        ],
        done: [{ id: "d1", text: "Template ready + reused across projects" }],
      },
      {
        id: "time",
        title: "Time Estimate (Realistic)",
        subtitle: "How long Python + Python for AI takes",
        timeEstimate: "Reference",
        learn: [
          { id: "t1", text: "2–3 hrs/day → 3–6 months for solid Python + AI basics" },
          { id: "t2", text: "5–6 hrs/day → 8–12 weeks for strong Python + ML projects" },
          { id: "t3", text: "Deep mastery (PyTorch + deployment) → 6–12 months" },
        ],
        build: [{ id: "tb1", text: "Block your daily schedule: Learn 90m, Build 120m" }],
        done: [{ id: "td1", text: "Your calendar is set and followed weekly" }],
      },
    ],
  },
  {
    id: "core",
    title: "Python Core",
    icon: <Code2 className="h-4 w-4" />,
    description: "Become dangerous in Python fundamentals and real-world coding habits.",
    modules: [
      {
        id: "py_basics",
        title: "Core Syntax + Thinking",
        subtitle: "Write clean Python without hesitation",
        timeEstimate: "1–2 weeks",
        learn: [
          { id: "c1", text: "Data types, variables, operators" },
          { id: "c2", text: "Conditionals + loops" },
          { id: "c3", text: "Functions + scope" },
          { id: "c4", text: "List/dict/set comprehensions" },
          { id: "c5", text: "Error handling (try/except)" },
        ],
        build: [
          { id: "cb1", text: "Mini CLI calculator + unit tests" },
          { id: "cb2", text: "Log parser that outputs JSON" },
        ],
        done: [
          { id: "cd1", text: "You can write 100-line script without copying" },
          { id: "cd2", text: "You know when to use list vs dict vs set" },
        ],
      },
      {
        id: "py_oop",
        title: "OOP + Project Structure",
        subtitle: "Build maintainable code",
        timeEstimate: "1–2 weeks",
        learn: [
          { id: "o1", text: "Classes, dataclasses" },
          { id: "o2", text: "Composition vs inheritance" },
          { id: "o3", text: "Modules + packages" },
          { id: "o4", text: "Type hints basics" },
        ],
        build: [
          { id: "ob1", text: "Build a small package: `pyutils` with 5 utilities" },
          { id: "ob2", text: "Refactor old script into modules" },
        ],
        done: [
          { id: "od1", text: "One reusable python package published to GitHub" },
        ],
      },
      {
        id: "py_tooling",
        title: "Tooling + Debugging",
        subtitle: "Speed becomes your superpower",
        timeEstimate: "1 week",
        learn: [
          { id: "tb1", text: "Virtual envs (venv)" },
          { id: "tb2", text: "pip + requirements" },
          { id: "tb3", text: "Debugging: pdb + breakpoints" },
          { id: "tb4", text: "Logging best practices" },
        ],
        build: [
          { id: "tbb1", text: "Create project template: src/, tests/, pyproject" },
          { id: "tbb2", text: "Add logs + config to a script" },
        ],
        done: [
          { id: "tbd1", text: "You can reproduce a bug and fix it quickly" },
        ],
        notes:
          "Mastering tooling is what separates casual coders from builders. You will ship faster than others.",
      },
    ],
  },
  {
    id: "data",
    title: "Python for AI — Data Stack",
    icon: <FileCode2 className="h-4 w-4" />,
    description: "NumPy + Pandas + data cleaning, the real foundation of AI work.",
    modules: [
      {
        id: "numpy",
        title: "NumPy Mastery",
        subtitle: "Vectors, matrices, speed",
        timeEstimate: "1–2 weeks",
        learn: [
          { id: "n1", text: "Arrays, shapes, dtype" },
          { id: "n2", text: "Broadcasting" },
          { id: "n3", text: "Vectorization vs loops" },
          { id: "n4", text: "Basic linear algebra ops" },
        ],
        build: [
          { id: "nb1", text: "Implement 10 NumPy ops without loops" },
          { id: "nb2", text: "Speed benchmark: loop vs vectorized" },
        ],
        done: [
          { id: "nd1", text: "You can transform arrays confidently" },
          { id: "nd2", text: "You can optimize slow python using NumPy" },
        ],
      },
      {
        id: "pandas",
        title: "Pandas + Cleaning",
        subtitle: "Real AI is 70% data",
        timeEstimate: "2–3 weeks",
        learn: [
          { id: "p1", text: "DataFrames, indexing, filtering" },
          { id: "p2", text: "Groupby + aggregation" },
          { id: "p3", text: "Joins/merges" },
          { id: "p4", text: "Missing data handling" },
          { id: "p5", text: "Date/time operations" },
        ],
        build: [
          { id: "pb1", text: "Clean a messy CSV and produce a final report" },
          { id: "pb2", text: "Feature engineering notebook" },
        ],
        done: [
          { id: "pd1", text: "You can clean and transform real-world datasets" },
        ],
      },
      {
        id: "eda",
        title: "EDA + Visualization",
        subtitle: "You must see your data",
        timeEstimate: "1 week",
        learn: [
          { id: "e1", text: "Matplotlib basics" },
          { id: "e2", text: "Histograms, scatter, line plots" },
          { id: "e3", text: "Correlation + outliers" },
        ],
        build: [
          { id: "eb1", text: "EDA report notebook with 8 plots" },
          { id: "eb2", text: "Automated EDA script that outputs PNGs" },
        ],
        done: [
          { id: "ed1", text: "You can diagnose dataset issues using plots" },
        ],
      },
    ],
  },
  {
    id: "ml",
    title: "Python for AI — Machine Learning",
    icon: <GraduationCap className="h-4 w-4" />,
    description: "Classic ML with scikit-learn. You learn evaluation + real metrics.",
    modules: [
      {
        id: "sklearn",
        title: "ML Fundamentals (sklearn)",
        subtitle: "Models, metrics, validation",
        timeEstimate: "2–4 weeks",
        learn: [
          { id: "s1", text: "Train/test split" },
          { id: "s2", text: "Metrics: accuracy, precision, recall, F1" },
          { id: "s3", text: "Regression metrics: MAE, RMSE" },
          { id: "s4", text: "Cross-validation" },
          { id: "s5", text: "Feature scaling" },
        ],
        build: [
          { id: "sb1", text: "Classification model on a real dataset" },
          { id: "sb2", text: "Regression model + evaluation report" },
          { id: "sb3", text: "Confusion matrix + threshold tuning" },
        ],
        done: [
          { id: "sd1", text: "You can evaluate a model correctly without fooling yourself" },
        ],
      },
      {
        id: "ml_features",
        title: "Feature Engineering + Leakage",
        subtitle: "The secret sauce",
        timeEstimate: "1–2 weeks",
        learn: [
          { id: "f1", text: "Encoding categorical data" },
          { id: "f2", text: "Avoiding leakage" },
          { id: "f3", text: "Pipelines" },
        ],
        build: [
          { id: "fb1", text: "sklearn pipeline with preprocessing + model" },
        ],
        done: [
          { id: "fd1", text: "One robust pipeline that works end-to-end" },
        ],
      },
    ],
  },
  {
    id: "dl",
    title: "Python for AI — Deep Learning",
    icon: <Sparkles className="h-4 w-4" />,
    description: "PyTorch training mastery. This is where you become a real AI builder.",
    modules: [
      {
        id: "torch_found",
        title: "PyTorch Basics",
        subtitle: "Training loop confidence",
        timeEstimate: "2–4 weeks",
        learn: [
          { id: "pt1", text: "Tensors, shapes" },
          { id: "pt2", text: "Autograd intuition" },
          { id: "pt3", text: "Optimizers + schedulers" },
          { id: "pt4", text: "DataLoader" },
          { id: "pt5", text: "Checkpoints" },
        ],
        build: [
          { id: "ptb1", text: "Train FashionMNIST classifier" },
          { id: "ptb2", text: "Add logging + checkpoints" },
        ],
        done: [
          { id: "ptd1", text: "You can train a model and reproduce results" },
        ],
      },
      {
        id: "torch_cnn",
        title: "CNNs for Vision",
        subtitle: "The base of computer vision",
        timeEstimate: "1–2 weeks",
        learn: [
          { id: "cnn1", text: "Convolutions" },
          { id: "cnn2", text: "Pooling + normalization" },
          { id: "cnn3", text: "Augmentations" },
        ],
        build: [
          { id: "cnnb1", text: "CIFAR10 CNN model" },
          { id: "cnnb2", text: "Compare 3 augmentations" },
        ],
        done: [
          { id: "cnnd1", text: "You can improve accuracy with controlled experiments" },
        ],
      },
      {
        id: "torch_tx",
        title: "Transformers (Mini)",
        subtitle: "Step toward LLMs",
        timeEstimate: "2–3 weeks",
        learn: [
          { id: "tx1", text: "Attention basics" },
          { id: "tx2", text: "Tokenization idea" },
          { id: "tx3", text: "Training a tiny transformer" },
        ],
        build: [
          { id: "txb1", text: "Train a tiny text transformer" },
          { id: "txb2", text: "Evaluate perplexity + samples" },
        ],
        done: [
          { id: "txd1", text: "You understand the moving parts behind LLMs" },
        ],
      },
    ],
  },
  {
    id: "mle",
    title: "Python for AI — MLOps",
    icon: <Rocket className="h-4 w-4" />,
    description: "Turn training into real products: APIs, packaging, reproducibility.",
    modules: [
      {
        id: "serving",
        title: "Model Serving (FastAPI)",
        subtitle: "From notebook to API",
        timeEstimate: "1–2 weeks",
        learn: [
          { id: "sv1", text: "FastAPI basics" },
          { id: "sv2", text: "Request/response models" },
          { id: "sv3", text: "Model loading + inference" },
          { id: "sv4", text: "Rate limiting basics" },
        ],
        build: [
          { id: "svb1", text: "Serve a model endpoint: /predict" },
          { id: "svb2", text: "Simple web UI to test predictions" },
        ],
        done: [
          { id: "svd1", text: "Your model can run as a service" },
        ],
      },
      {
        id: "repro",
        title: "Reproducibility + Testing",
        subtitle: "Professional quality",
        timeEstimate: "1 week",
        learn: [
          { id: "rp1", text: "Unit testing basics (pytest)" },
          { id: "rp2", text: "Seed control + deterministic runs" },
          { id: "rp3", text: "Config files (yaml/json)" },
        ],
        build: [
          { id: "rpb1", text: "Add pytest tests to a project" },
          { id: "rpb2", text: "Add config-driven training" },
        ],
        done: [
          { id: "rpd1", text: "You can rerun experiments and get the same results" },
        ],
      },
    ],
  },
  {
    id: "projects",
    title: "Project Ladder",
    icon: <FolderGit2 className="h-4 w-4" />,
    description: "10 projects to go from Python to Python-for-AI builder.",
    modules: [
      {
        id: "ladder",
        title: "The 10 Projects",
        subtitle: "Ship in order",
        timeEstimate: "8–16 weeks",
        learn: [
          { id: "l1", text: "Project #1: CLI tool (logs → JSON)" },
          { id: "l2", text: "Project #2: Web scraper + export" },
          { id: "l3", text: "Project #3: Data cleaner + EDA report" },
          { id: "l4", text: "Project #4: sklearn classification model" },
          { id: "l5", text: "Project #5: sklearn regression model" },
          { id: "l6", text: "Project #6: PyTorch FashionMNIST" },
          { id: "l7", text: "Project #7: CIFAR10 CNN" },
          { id: "l8", text: "Project #8: Tiny transformer" },
          { id: "l9", text: "Project #9: Serve model via FastAPI" },
          { id: "l10", text: "Project #10: End-to-end ML app (data → train → serve → UI)" },
        ],
        build: [
          { id: "lb1", text: "Create 10 repos OR 1 monorepo with 10 folders" },
          { id: "lb2", text: "Record demo video per project" },
        ],
        done: [
          { id: "ld1", text: "10 demos + readable READMEs" },
          { id: "ld2", text: "You can explain each project in 60 seconds" },
        ],
      },
    ],
  },
  {
    id: "weekly",
    title: "Weekly Planner",
    icon: <ClipboardList className="h-4 w-4" />,
    description: "Plan one week at a time. Auto-generate a good plan.",
    modules: [
      {
        id: "weekly_mod",
        title: "Weekly Checklist Template",
        timeEstimate: "10 minutes",
        learn: [
          { id: "w1", text: "Pick max 3 learning topics" },
          { id: "w2", text: "Pick exactly 1 artifact" },
          { id: "w3", text: "Define done conditions" },
        ],
        build: [{ id: "wb1", text: "Push to GitHub + record demo" }],
        done: [{ id: "wd1", text: "Week shipped ✅" }],
      },
    ],
  },
  {
    id: "resources",
    title: "Resources",
    icon: <LinkIcon className="h-4 w-4" />,
    description: "Official links + placeholders you can update later.",
    modules: [
      {
        id: "res",
        title: "Links",
        timeEstimate: "Ongoing",
        learn: [{ id: "rs1", text: "Use official docs whenever possible" }],
        build: [{ id: "rs2", text: "Replace placeholders with correct links" }],
        done: [{ id: "rs3", text: "Resource list stays current" }],
      },
    ],
  },
];

function allChecklistIds() {
  const ids: string[] = [];
  for (const sec of SECTIONS) {
    for (const mod of sec.modules) {
      for (const it of mod.learn) ids.push(`${mod.id}::learn::${it.id}`);
      for (const it of mod.build) ids.push(`${mod.id}::build::${it.id}`);
      for (const it of mod.done) ids.push(`${mod.id}::done::${it.id}`);
    }
  }
  for (const sb of SCOREBOARD) ids.push(`scoreboard::${sb.id}`);
  return ids;
}

function sectionChecklistIds(sectionId: string) {
  const sec = SECTIONS.find((s) => s.id === sectionId);
  if (!sec) return [];
  const ids: string[] = [];
  for (const mod of sec.modules) {
    for (const it of mod.learn) ids.push(`${mod.id}::learn::${it.id}`);
    for (const it of mod.build) ids.push(`${mod.id}::build::${it.id}`);
    for (const it of mod.done) ids.push(`${mod.id}::done::${it.id}`);
  }
  return ids;
}

function ProgressRing({ value }: { value: number }) {
  const size = 72;
  const stroke = 8;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;
  return (
    <div className="relative">
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={radius} strokeWidth={stroke} className="stroke-muted" fill="transparent" />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={stroke}
          className="stroke-foreground"
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
        />
      </svg>
      <div className="absolute inset-0 grid place-items-center">
        <div className="text-sm font-semibold">{value}%</div>
      </div>
    </div>
  );
}

function ChecklistRow({
  id,
  label,
  checked,
  onToggle,
}: {
  id: string;
  label: string;
  checked: boolean;
  onToggle: (id: string) => void;
}) {
  return (
    <button
      onClick={() => onToggle(id)}
      className="group flex w-full items-start gap-3 rounded-2xl p-2 text-left transition hover:bg-muted/60"
    >
      <div className="mt-0.5">
        {checked ? <CheckCircle2 className="h-5 w-5" /> : <Circle className="h-5 w-5 opacity-70 group-hover:opacity-100" />}
      </div>
      <div className="leading-6">
        <div className={`text-sm ${checked ? "line-through opacity-70" : ""}`}>{label}</div>
      </div>
    </button>
  );
}

function ModuleCard({
  module,
  state,
  onToggle,
  onSaveNote,
  showOnlyIncomplete,
}: {
  module: Module;
  state: AppState;
  onToggle: (id: string) => void;
  onSaveNote: (moduleId: string, note: string) => void;
  showOnlyIncomplete: boolean;
}) {
  const ids = useMemo(() => {
    const out: string[] = [];
    for (const it of module.learn) out.push(`${module.id}::learn::${it.id}`);
    for (const it of module.build) out.push(`${module.id}::build::${it.id}`);
    for (const it of module.done) out.push(`${module.id}::done::${it.id}`);
    return out;
  }, [module]);

  const doneCount = ids.filter((k) => state.checked[k]).length;
  const progress = pct(doneCount, ids.length);

  const anyIncomplete = ids.some((k) => !state.checked[k]);
  if (showOnlyIncomplete && !anyIncomplete) return null;

  const note = state.customNotes[module.id] ?? "";

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }}>
      <Card className="rounded-3xl shadow-sm">
        <CardHeader className="pb-2">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <CardTitle className="text-base md:text-lg">{module.title}</CardTitle>
              {module.subtitle ? <div className="mt-1 text-sm text-muted-foreground">{module.subtitle}</div> : null}
              <div className="mt-2 flex flex-wrap items-center gap-2">
                <Badge variant="secondary" className="rounded-2xl">
                  <Clock className="mr-1 h-3.5 w-3.5" />
                  {module.timeEstimate}
                </Badge>
                <Badge variant="outline" className="rounded-2xl">
                  <Terminal className="mr-1 h-3.5 w-3.5" />
                  {progress}% complete
                </Badge>
              </div>
            </div>
            <ProgressRing value={progress} />
          </div>
        </CardHeader>
        <CardContent className="pt-4">
          <Tabs defaultValue="learn" className="w-full">
            <TabsList className="grid w-full grid-cols-3 rounded-2xl">
              <TabsTrigger value="learn">Learn</TabsTrigger>
              <TabsTrigger value="build">Build</TabsTrigger>
              <TabsTrigger value="done">Done</TabsTrigger>
            </TabsList>
            <TabsContent value="learn" className="mt-3">
              <div className="space-y-1">
                {module.learn.map((it) => {
                  const key = `${module.id}::learn::${it.id}`;
                  return (
                    <ChecklistRow key={key} id={key} label={it.text} checked={!!state.checked[key]} onToggle={onToggle} />
                  );
                })}
              </div>
            </TabsContent>
            <TabsContent value="build" className="mt-3">
              <div className="space-y-1">
                {module.build.map((it) => {
                  const key = `${module.id}::build::${it.id}`;
                  return (
                    <ChecklistRow key={key} id={key} label={it.text} checked={!!state.checked[key]} onToggle={onToggle} />
                  );
                })}
              </div>
            </TabsContent>
            <TabsContent value="done" className="mt-3">
              <div className="space-y-1">
                {module.done.map((it) => {
                  const key = `${module.id}::done::${it.id}`;
                  return (
                    <ChecklistRow key={key} id={key} label={it.text} checked={!!state.checked[key]} onToggle={onToggle} />
                  );
                })}
              </div>
            </TabsContent>
          </Tabs>

          {(module.notes ?? "").length > 0 ? (
            <div className="mt-4 rounded-2xl bg-muted/50 p-3 text-sm text-muted-foreground">{module.notes}</div>
          ) : null}

          <div className="mt-4">
            <div className="mb-2 flex items-center gap-2 text-sm font-medium">
              <ClipboardList className="h-4 w-4" />
              Notes
            </div>
            <Textarea
              value={note}
              onChange={(e) => onSaveNote(module.id, e.target.value)}
              className="min-h-[90px] rounded-2xl"
              placeholder="Write what you built, errors you fixed, and the next step. (Saved automatically)"
            />
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

function WeeklyPlanner({ state, setState }: { state: AppState; setState: React.Dispatch<React.SetStateAction<AppState>> }) {
  const p = state.weeklyPlanner;

  function update(key: keyof AppState["weeklyPlanner"], val: any) {
    setState((s) => ({ ...s, weeklyPlanner: { ...s.weeklyPlanner, [key]: val } }));
  }

  function autoGenerate() {
    const focusOptions = [
      {
        focus: "Python Core",
        learn: ["Comprehensions", "Functions + scope", "Error handling"],
        buildArtifact: "CLI tool that converts logs → JSON",
        metrics: "Handles 3 log formats + outputs valid JSON",
      },
      {
        focus: "NumPy/Pandas",
        learn: ["Broadcasting", "Groupby", "Missing data"],
        buildArtifact: "Data cleaner + EDA notebook",
        metrics: "8 plots + final cleaned CSV",
      },
      {
        focus: "Machine Learning",
        learn: ["Train/test split", "Precision/Recall", "Cross-validation"],
        buildArtifact: "Sklearn classifier on real dataset",
        metrics: "F1 > baseline + confusion matrix",
      },
      {
        focus: "Deep Learning (PyTorch)",
        learn: ["Training loop", "Optimizers", "Checkpoints"],
        buildArtifact: "FashionMNIST training + logs",
        metrics: ">85% accuracy + saved model",
      },
      {
        focus: "MLOps",
        learn: ["FastAPI", "Model loading", "Request schemas"],
        buildArtifact: "Serve /predict endpoint",
        metrics: "Latency < 200ms locally",
      },
    ];

    const idx = (p.weekNumber - 1) % focusOptions.length;
    const pick = focusOptions[idx];

    update("focus", pick.focus);
    update("learn1", pick.learn[0]);
    update("learn2", pick.learn[1]);
    update("learn3", pick.learn[2]);
    update("buildArtifact", pick.buildArtifact);
    update("repoName", `python-week-${p.weekNumber}-${pick.focus.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`);
    update("demoProof", "Short demo video + README screenshots");
    update("successMetrics", pick.metrics);
    update("done1", "Runs end-to-end without errors");
    update("done2", "README contains install + usage steps");
    update("done3", "Pushed to GitHub + demo recorded");
  }

  const exportText = useMemo(() => {
    return (
      `## Week ${p.weekNumber}\n` +
      `**Focus:** ${p.focus}\n\n` +
      `### Learn (max 3 topics)\n` +
      `- [ ] ${p.learn1 || "Topic 1"}\n` +
      `- [ ] ${p.learn2 || "Topic 2"}\n` +
      `- [ ] ${p.learn3 || "Topic 3"}\n\n` +
      `### Build (1 artifact)\n` +
      `- [ ] Artifact: ${p.buildArtifact || "Build artifact"}\n` +
      `- [ ] Repo: ${p.repoName || "repo-name"}\n` +
      `- [ ] Proof: ${p.demoProof || "demo proof"}\n` +
      `- [ ] Success metrics: ${p.successMetrics || "metrics"}\n\n` +
      `### Done Definition\n` +
      `- [ ] ${p.done1 || "Done condition 1"}\n` +
      `- [ ] ${p.done2 || "Done condition 2"}\n` +
      `- [ ] ${p.done3 || "Done condition 3"}\n`
    );
  }, [p]);

  return (
    <Card className="rounded-3xl shadow-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base md:text-lg">
          <Wand2 className="h-5 w-5" />
          Weekly Planner
        </CardTitle>
        <div className="text-sm text-muted-foreground">Auto-generate a strong week plan and ship one artifact.</div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-3 md:grid-cols-3">
          <div>
            <div className="text-sm font-medium">Week</div>
            <Input
              type="number"
              min={1}
              value={p.weekNumber}
              onChange={(e) => update("weekNumber", Number(e.target.value || 1))}
              className="mt-1 rounded-2xl"
            />
          </div>
          <div className="md:col-span-2">
            <div className="text-sm font-medium">Focus</div>
            <Input
              value={p.focus}
              onChange={(e) => update("focus", e.target.value)}
              className="mt-1 rounded-2xl"
              placeholder="Python Core / NumPy / ML / PyTorch / MLOps"
            />
          </div>
        </div>

        <div className="grid gap-3 md:grid-cols-3">
          <div>
            <div className="text-sm font-medium">Learn 1</div>
            <Input value={p.learn1} onChange={(e) => update("learn1", e.target.value)} className="mt-1 rounded-2xl" />
          </div>
          <div>
            <div className="text-sm font-medium">Learn 2</div>
            <Input value={p.learn2} onChange={(e) => update("learn2", e.target.value)} className="mt-1 rounded-2xl" />
          </div>
          <div>
            <div className="text-sm font-medium">Learn 3</div>
            <Input value={p.learn3} onChange={(e) => update("learn3", e.target.value)} className="mt-1 rounded-2xl" />
          </div>
        </div>

        <Separator />

        <div className="grid gap-3 md:grid-cols-2">
          <div>
            <div className="text-sm font-medium">Build Artifact</div>
            <Input
              value={p.buildArtifact}
              onChange={(e) => update("buildArtifact", e.target.value)}
              className="mt-1 rounded-2xl"
              placeholder="What will you ship?"
            />
          </div>
          <div>
            <div className="text-sm font-medium">Repo Name</div>
            <Input value={p.repoName} onChange={(e) => update("repoName", e.target.value)} className="mt-1 rounded-2xl" />
          </div>
        </div>

        <div className="grid gap-3 md:grid-cols-2">
          <div>
            <div className="text-sm font-medium">Proof</div>
            <Input value={p.demoProof} onChange={(e) => update("demoProof", e.target.value)} className="mt-1 rounded-2xl" />
          </div>
          <div>
            <div className="text-sm font-medium">Success Metrics</div>
            <Input
              value={p.successMetrics}
              onChange={(e) => update("successMetrics", e.target.value)}
              className="mt-1 rounded-2xl"
            />
          </div>
        </div>

        <div className="grid gap-3 md:grid-cols-3">
          <div>
            <div className="text-sm font-medium">Done 1</div>
            <Input value={p.done1} onChange={(e) => update("done1", e.target.value)} className="mt-1 rounded-2xl" />
          </div>
          <div>
            <div className="text-sm font-medium">Done 2</div>
            <Input value={p.done2} onChange={(e) => update("done2", e.target.value)} className="mt-1 rounded-2xl" />
          </div>
          <div>
            <div className="text-sm font-medium">Done 3</div>
            <Input value={p.done3} onChange={(e) => update("done3", e.target.value)} className="mt-1 rounded-2xl" />
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button onClick={autoGenerate} className="rounded-2xl">
            <Wand2 className="mr-2 h-4 w-4" />
            Auto-Generate
          </Button>
          <Button
            variant="secondary"
            className="rounded-2xl"
            onClick={() => {
              navigator.clipboard.writeText(exportText);
            }}
          >
            <ClipboardList className="mr-2 h-4 w-4" />
            Copy Template
          </Button>
        </div>

        <div className="rounded-2xl bg-muted/50 p-3">
          <div className="mb-2 flex items-center gap-2 text-sm font-medium">
            <ClipboardList className="h-4 w-4" />
            Export
          </div>
          <pre className="whitespace-pre-wrap text-xs leading-5 text-muted-foreground">{exportText}</pre>
        </div>
      </CardContent>
    </Card>
  );
}

function ResourcesPanel({ state, setState }: { state: AppState; setState: React.Dispatch<React.SetStateAction<AppState>> }) {
  function updateLink(id: string, url: string) {
    setState((s) => ({ ...s, customLinks: { ...s.customLinks, [id]: url } }));
  }

  return (
    <Card className="rounded-3xl shadow-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base md:text-lg">
          <LinkIcon className="h-5 w-5" />
          Resources
        </CardTitle>
        <div className="text-sm text-muted-foreground">Official docs + placeholders. Saved locally.</div>
      </CardHeader>
      <CardContent className="space-y-3">
        {LINKS.map((l) => {
          const val = state.customLinks[l.id] ?? l.url;
          return (
            <div key={l.id} className="rounded-2xl border p-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <div className="truncate text-sm font-medium">{l.label}</div>
                    <Badge variant={l.status === "official" ? "secondary" : "outline"} className="rounded-2xl">
                      {l.status === "official" ? "Official" : "Placeholder"}
                    </Badge>
                  </div>
                  {l.note ? <div className="mt-1 text-xs text-muted-foreground">{l.note}</div> : null}
                </div>
                <a
                  href={val.startsWith("http") ? val : undefined}
                  target="_blank"
                  rel="noreferrer"
                  className={`text-xs ${val.startsWith("http") ? "underline" : "opacity-60"}`}
                >
                  Open
                </a>
              </div>
              <div className="mt-2">
                <Input value={val} onChange={(e) => updateLink(l.id, e.target.value)} className="rounded-2xl" />
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}

export default function PythonMasteryOS() {
  const [active, setActive] = useState<string>("home");
  const [state, setState] = useState<AppState>(() => ({
    checked: {},
    customNotes: {},
    customLinks: {},
    weeklyPlanner: {
      weekNumber: 1,
      focus: "Python Core",
      learn1: "",
      learn2: "",
      learn3: "",
      buildArtifact: "",
      repoName: "",
      demoProof: "",
      successMetrics: "",
      done1: "",
      done2: "",
      done3: "",
    },
    ui: { compactSidebar: false, showOnlyIncomplete: false },
  }));

  useEffect(() => {
    setState(loadState());
  }, []);

  useEffect(() => {
    saveState(state);
  }, [state]);

  const allIds = useMemo(() => allChecklistIds(), []);
  const overallDone = allIds.filter((k) => state.checked[k]).length;
  const overallPct = pct(overallDone, allIds.length);

  const currentSection = useMemo(() => SECTIONS.find((s) => s.id === active) ?? SECTIONS[0], [active]);

  function toggle(id: string) {
    setState((s) => ({ ...s, checked: { ...s.checked, [id]: !s.checked[id] } }));
  }

  function saveNote(moduleId: string, note: string) {
    setState((s) => ({ ...s, customNotes: { ...s.customNotes, [moduleId]: note } }));
  }

  function resetAll() {
    const ok = confirm("Reset all progress? This will clear your saved checkboxes, notes and planner.");
    if (!ok) return;
    setState({
      checked: {},
      customNotes: {},
      customLinks: {},
      weeklyPlanner: {
        weekNumber: 1,
        focus: "Python Core",
        learn1: "",
        learn2: "",
        learn3: "",
        buildArtifact: "",
        repoName: "",
        demoProof: "",
        successMetrics: "",
        done1: "",
        done2: "",
        done3: "",
      },
      ui: { compactSidebar: false, showOnlyIncomplete: false },
    });
  }

  const sectionIds = sectionChecklistIds(active);
  const sectionDone = sectionIds.filter((k) => state.checked[k]).length;
  const sectionPct = pct(sectionDone, sectionIds.length);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-7xl px-4 py-6 md:px-6">
        <div className="flex flex-col gap-4 md:flex-row md:gap-6">
          {/* Sidebar */}
          <aside
            className={`sticky top-6 h-fit rounded-3xl border bg-card p-4 shadow-sm md:w-72 ${
              state.ui.compactSidebar ? "md:w-60" : ""
            }`}
          >
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <Code2 className="h-5 w-5" />
                  <div className="truncate text-sm font-semibold">Python Mastery OS</div>
                </div>
                <div className="mt-1 text-xs text-muted-foreground">Core Python → AI Python → Deploy</div>
              </div>
              <Badge variant="secondary" className="rounded-2xl">
                v1
              </Badge>
            </div>

            <div className="mt-4 flex items-center justify-between rounded-2xl bg-muted/50 p-3">
              <div>
                <div className="text-xs text-muted-foreground">Overall</div>
                <div className="text-sm font-semibold">{overallPct}%</div>
              </div>
              <div className="hidden sm:block">
                <ProgressRing value={overallPct} />
              </div>
            </div>

            <div className="mt-4 space-y-2">
              <div className="flex items-center justify-between">
                <div className="text-xs font-medium text-muted-foreground">View</div>
              </div>
              <div className="flex items-center justify-between rounded-2xl border p-3">
                <div className="text-xs">Compact sidebar</div>
                <Switch
                  checked={state.ui.compactSidebar}
                  onCheckedChange={(v) => setState((s) => ({ ...s, ui: { ...s.ui, compactSidebar: v } }))}
                />
              </div>
              <div className="flex items-center justify-between rounded-2xl border p-3">
                <div className="text-xs">Only incomplete</div>
                <Switch
                  checked={state.ui.showOnlyIncomplete}
                  onCheckedChange={(v) => setState((s) => ({ ...s, ui: { ...s.ui, showOnlyIncomplete: v } }))}
                />
              </div>
            </div>

            <Separator className="my-4" />

            <nav className="space-y-1">
              {SECTIONS.map((s) => {
                const isActive = active === s.id;
                return (
                  <button
                    key={s.id}
                    onClick={() => setActive(s.id)}
                    className={`flex w-full items-center gap-3 rounded-2xl px-3 py-2 text-left text-sm transition ${
                      isActive ? "bg-muted" : "hover:bg-muted/60"
                    }`}
                  >
                    <div className="opacity-90">{s.icon}</div>
                    <div className="min-w-0 flex-1 truncate">{s.title}</div>
                    {s.id === "weekly" ? (
                      <Badge className="rounded-2xl" variant="secondary">
                        New
                      </Badge>
                    ) : null}
                  </button>
                );
              })}
            </nav>

            <Separator className="my-4" />

            <Button variant="secondary" className="w-full rounded-2xl" onClick={resetAll}>
              Reset Progress
            </Button>
          </aside>

          {/* Main */}
          <main className="flex-1">
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25 }}
              className="space-y-4"
            >
              <div className="rounded-3xl border bg-card p-5 shadow-sm">
                <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <div className="grid h-9 w-9 place-items-center rounded-2xl bg-muted">{currentSection.icon}</div>
                      <div className="min-w-0">
                        <div className="truncate text-lg font-semibold md:text-xl">{currentSection.title}</div>
                        <div className="text-sm text-muted-foreground">{currentSection.description}</div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="rounded-2xl border px-3 py-2">
                      <div className="text-xs text-muted-foreground">Section progress</div>
                      <div className="text-sm font-semibold">{sectionPct}%</div>
                    </div>
                    <div className="hidden sm:block">
                      <ProgressRing value={sectionPct} />
                    </div>
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  <Badge variant="secondary" className="rounded-2xl">
                    <FolderGit2 className="mr-1 h-3.5 w-3.5" />
                    Ship every week
                  </Badge>
                  <Badge variant="outline" className="rounded-2xl">
                    <Sparkles className="mr-1 h-3.5 w-3.5" />
                    Learn → Build → Ship
                  </Badge>
                  <Badge variant="outline" className="rounded-2xl">
                    <Terminal className="mr-1 h-3.5 w-3.5" />
                    Track metrics
                  </Badge>
                </div>
              </div>

              {active === "home" ? (
                <Card className="rounded-3xl shadow-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-base md:text-lg">
                      <ListChecks className="h-5 w-5" />
                      Progress Scoreboard
                    </CardTitle>
                    <div className="text-sm text-muted-foreground">Mark these only when entire tracks feel complete.</div>
                  </CardHeader>
                  <CardContent className="space-y-1">
                    {SCOREBOARD.map((sb) => {
                      const key = `scoreboard::${sb.id}`;
                      return (
                        <ChecklistRow key={key} id={key} label={sb.label} checked={!!state.checked[key]} onToggle={toggle} />
                      );
                    })}
                  </CardContent>
                </Card>
              ) : null}

              {active === "weekly" ? <WeeklyPlanner state={state} setState={setState} /> : null}
              {active === "resources" ? <ResourcesPanel state={state} setState={setState} /> : null}

              {active !== "weekly" && active !== "resources" ? (
                <div className="grid gap-4">
                  {currentSection.modules.map((m) => (
                    <ModuleCard
                      key={m.id}
                      module={m}
                      state={state}
                      onToggle={toggle}
                      onSaveNote={saveNote}
                      showOnlyIncomplete={state.ui.showOnlyIncomplete}
                    />
                  ))}
                </div>
              ) : null}

              <div className="rounded-3xl border bg-card p-5 text-sm text-muted-foreground shadow-sm">
                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                  <div className="flex items-center gap-2">
                    <FileCode2 className="h-4 w-4" />
                    <div>
                      <span className="font-medium text-foreground">Pro tip:</span> build small tools repeatedly — AI engineers are
                      basically elite Python tool builders.
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="rounded-2xl">
                      Stored locally
                    </Badge>
                    <Badge variant="outline" className="rounded-2xl">
                      Offline friendly
                    </Badge>
                  </div>
                </div>
              </div>
            </motion.div>
          </main>
        </div>
      </div>
    </div>
  );
}
