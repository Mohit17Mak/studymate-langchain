import {
  AlertCircle,
  Brain,
  Check,
  ChevronDown,
  Clock3,
  Lightbulb,
  Menu,
  MessageSquare,
  Plus,
  Send,
  Settings,
  Sparkles,
  Target,
  Trophy,
  X,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

import {
  analyzePrompt,
  createSession,
  evaluatePrompt,
  getChallenge,
  getProfile,
} from "./api";

const recentModes = [
  {
    id: "analyze",
    title: "Prompt Analysis",
    icon: Brain,
  },
  {
    id: "challenge",
    title: "Prompt Challenges",
    icon: Target,
  },
];

const suggestions = [
  {
    id: "analyze",
    icon: Brain,
    title: "Analyze my prompt",
    text: "Analyze this prompt and tell me what I should improve.",
  },
  {
    id: "challenge",
    icon: Target,
    title: "Give me a challenge",
    text: "",
  },
];

function Sidebar({
  mobileOpen,
  setMobileOpen,
  onNewSession,
  onModeChange,
  activeMode,
}) {
  return (
    <>
      {mobileOpen && (
        <button
          aria-label="Close sidebar"
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex h-screen w-[280px] flex-col overflow-hidden border-r border-slate-200/70 bg-white/90 px-4 py-5 shadow-xl backdrop-blur-2xl transition-transform duration-300 dark:border-white/[0.07] dark:bg-slate-950/90 dark:shadow-none ${
          mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="mb-8 flex items-center justify-between px-2">
          <div className="flex items-center gap-3">
            <div className="relative flex h-10 w-10 items-center justify-center overflow-hidden rounded-2xl bg-slate-950 text-white shadow-lg dark:bg-white dark:text-slate-950">
              <div className="absolute inset-0 bg-gradient-to-br from-violet-500/30 to-cyan-400/20" />
              <Sparkles className="relative" size={19} />
            </div>

            <div>
              <h1 className="text-[15px] font-semibold tracking-tight">
                PromptForge
              </h1>

              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Prompt engineering coach
              </p>
            </div>
          </div>

          <button
            className="rounded-xl p-2 text-slate-500 hover:bg-slate-100 lg:hidden dark:hover:bg-white/10"
            onClick={() => setMobileOpen(false)}
          >
            <X size={18} />
          </button>
        </div>

        <button
          onClick={onNewSession}
          className="mb-7 flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-950 px-4 py-3 text-sm font-medium text-white shadow-lg transition hover:-translate-y-0.5 dark:bg-white dark:text-slate-950"
        >
          <Plus size={17} />
          New session
        </button>

        <div className="mb-3 px-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-400">
          Learning
        </div>

        <div className="space-y-1">
          {recentModes.map(({ id, title, icon: Icon }) => (
            <button
              key={id}
              onClick={() => {
                onModeChange(id);
                setMobileOpen(false);
              }}
              className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-[13px] transition ${
                activeMode === id
                  ? "bg-slate-100 text-slate-950 dark:bg-white/[0.07] dark:text-white"
                  : "text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-white/5"
              }`}
            >
              <Icon size={15} />
              {title}
            </button>
          ))}
        </div>

        <div className="mt-auto space-y-1">
          <button className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] text-slate-500 hover:bg-slate-100 dark:hover:bg-white/5">
            <Clock3 size={16} />
            History
          </button>

          <button
            onClick={() => {
              onModeChange("progress");
              setMobileOpen(false);
            }}
            className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] transition ${
              activeMode === "progress"
                ? "bg-slate-100 text-slate-950 dark:bg-white/[0.07] dark:text-white"
                : "text-slate-500 hover:bg-slate-100 dark:hover:bg-white/5"
            }`}
          >
            <Trophy size={16} />
            Progress
          </button>

          <button className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] text-slate-500 hover:bg-slate-100 dark:hover:bg-white/5">
            <Settings size={16} />
            Settings
          </button>
        </div>
      </aside>
    </>
  );
}

function LoadingCard({ text = "Thinking..." }) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-slate-200/70 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-white/[0.04]">
      <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-violet-500/10 text-violet-500">
        <Sparkles size={15} />
      </div>

      <div>
        <p className="text-sm font-medium">{text}</p>
        <div className="mt-2 flex gap-1">
          <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-400" />
          <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-400 [animation-delay:100ms]" />
          <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-400 [animation-delay:200ms]" />
        </div>
      </div>
    </div>
  );
}

function ErrorCard({ message }) {
  return (
    <div className="flex gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-300">
      <AlertCircle size={18} className="mt-0.5 shrink-0" />
      <div>
        <p className="font-medium">Something went wrong</p>
        <p className="mt-1 opacity-80">{message}</p>
      </div>
    </div>
  );
}

function AnalysisCard({ analysis }) {
  return (
    <div className="space-y-5">
      <div>
        <div className="mb-2 flex items-center gap-2">
          <Sparkles size={16} className="text-violet-500" />
          <h3 className="font-semibold">Overall assessment</h3>
        </div>

        <p className="text-sm leading-6 text-slate-600 dark:text-slate-300">
          {analysis.overall_assessment}
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        <span className="rounded-full bg-violet-500/10 px-3 py-1 text-xs font-medium text-violet-600 dark:text-violet-300">
          {analysis.difficulty}
        </span>

        {analysis.important_dimensions?.map((item) => (
          <span
            key={item}
            className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-600 dark:bg-white/10 dark:text-slate-300"
          >
            {item}
          </span>
        ))}
      </div>

      <AnalysisList
        title="Strengths"
        items={analysis.strengths}
        icon={<Check size={15} />}
      />

      <AnalysisList
        title="Needs improvement"
        items={analysis.weaknesses}
        icon={<AlertCircle size={15} />}
      />

      <AnalysisList
        title="Why it matters"
        items={analysis.why_it_matters}
        icon={<Brain size={15} />}
      />

      <AnalysisList
        title="Hints"
        items={analysis.hints}
        icon={<Lightbulb size={15} />}
      />
    </div>
  );
}

function AnalysisList({ title, items = [], icon }) {
  if (!items.length) {
    return null;
  }

  return (
    <div>
      <h3 className="mb-2 text-sm font-semibold">{title}</h3>

      <div className="space-y-2">
        {items.map((item, index) => (
          <div
            key={`${title}-${index}`}
            className="flex gap-2 rounded-xl bg-slate-50 px-3 py-2.5 text-sm leading-5 text-slate-600 dark:bg-white/[0.04] dark:text-slate-300"
          >
            <span className="mt-0.5 shrink-0 text-violet-500">{icon}</span>
            <span>{item}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function ChallengeCard({
  challenge,
  answer,
  setAnswer,
  onSubmit,
  isSubmitting,
}) {
  return (
    <div className="space-y-6">
      <div>
        <div className="mb-3 flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-violet-500/10 px-3 py-1 text-xs font-medium text-violet-600 dark:text-violet-300">
            {challenge.difficulty}
          </span>

          <span className="rounded-full bg-cyan-500/10 px-3 py-1 text-xs font-medium text-cyan-600 dark:text-cyan-300">
            {challenge.target_skill}
          </span>
        </div>

        <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
          {challenge.title}
        </h2>

        <p className="mt-3 text-sm leading-6 text-slate-500 dark:text-slate-400">
          {challenge.objective}
        </p>
      </div>

      <div className="rounded-2xl border border-slate-200/70 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-white/[0.04]">
        <h3 className="mb-2 text-sm font-semibold">Scenario</h3>
        <p className="text-sm leading-6 text-slate-600 dark:text-slate-300">
          {challenge.scenario}
        </p>
      </div>

      <div>
        <h3 className="mb-2 text-sm font-semibold">Your task</h3>
        <p className="rounded-2xl bg-slate-950 p-5 text-sm leading-6 text-white dark:bg-white dark:text-slate-950">
          {challenge.task}
        </p>
      </div>

      {challenge.constraints?.length > 0 && (
        <div>
          <h3 className="mb-2 text-sm font-semibold">Constraints</h3>

          <div className="space-y-2">
            {challenge.constraints.map((item, index) => (
              <div
                key={index}
                className="flex gap-2 text-sm text-slate-600 dark:text-slate-300"
              >
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-violet-500" />
                {item}
              </div>
            ))}
          </div>
        </div>
      )}

      {challenge.success_criteria?.length > 0 && (
        <div>
          <h3 className="mb-2 text-sm font-semibold">Success criteria</h3>

          <div className="space-y-2">
            {challenge.success_criteria.map((item, index) => (
              <div
                key={index}
                className="flex gap-2 rounded-xl bg-emerald-500/5 px-3 py-2.5 text-sm text-slate-600 dark:text-slate-300"
              >
                <Check
                  size={16}
                  className="mt-0.5 shrink-0 text-emerald-500"
                />
                {item}
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 dark:border-amber-500/20 dark:bg-amber-500/10">
        <div className="flex gap-3">
          <Lightbulb
            size={18}
            className="mt-0.5 shrink-0 text-amber-500"
          />

          <div>
            <p className="text-sm font-semibold text-amber-800 dark:text-amber-300">
              Hint
            </p>

            <p className="mt-1 text-sm leading-5 text-amber-700 dark:text-amber-200/80">
              {challenge.hint}
            </p>
          </div>
        </div>
      </div>

      <div>
        <label className="mb-2 block text-sm font-semibold">
          Write your prompt
        </label>

        <textarea
          value={answer}
          onChange={(event) => setAnswer(event.target.value)}
          disabled={isSubmitting}
          placeholder="Write the prompt you would give to an AI..."
          rows={8}
          maxLength={10000}
          className="w-full resize-none rounded-2xl border border-slate-200 bg-white p-4 text-sm leading-6 outline-none transition focus:border-violet-400 focus:ring-4 focus:ring-violet-500/10 dark:border-white/10 dark:bg-white/[0.04] dark:text-white"
        />

        <div className="mt-3 flex items-center justify-between gap-3">
          <span className="text-xs text-slate-400">
            {answer.length}/10000
          </span>

          <button
            onClick={onSubmit}
            disabled={!answer.trim() || isSubmitting}
            className="flex items-center gap-2 rounded-xl bg-slate-950 px-5 py-3 text-sm font-medium text-white transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-40 dark:bg-white dark:text-slate-950"
          >
            {isSubmitting ? (
              <>
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white dark:border-slate-950/20 dark:border-t-slate-950" />
                Evaluating...
              </>
            ) : (
              <>
                <Send size={15} />
                Submit challenge
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

function EvaluationCard({ evaluation, profile, onNextChallenge }) {
  return (
    <div className="space-y-6">
      <div>
        <div className="mb-3 flex items-center gap-2 text-violet-500">
          <Sparkles size={18} />
          <span className="text-sm font-medium">Challenge result</span>
        </div>

        <h2 className="text-2xl font-semibold tracking-tight">
          {evaluation.overall_feedback}
        </h2>
      </div>

      <AnalysisList
        title="What you improved"
        items={evaluation.improvements}
        icon={<Check size={15} />}
      />

      <AnalysisList
        title="Strong points"
        items={evaluation.strengths}
        icon={<Check size={15} />}
      />

      <AnalysisList
        title="Still needs work"
        items={evaluation.remaining_issues}
        icon={<AlertCircle size={15} />}
      />

      <div>
        <h3 className="mb-2 text-sm font-semibold">Skills demonstrated</h3>

        <div className="flex flex-wrap gap-2">
          {evaluation.skills_demonstrated?.map((skill) => (
            <span
              key={skill}
              className="rounded-full bg-emerald-500/10 px-3 py-1.5 text-xs font-medium text-emerald-600 dark:text-emerald-300"
            >
              {skill}
            </span>
          ))}
        </div>
      </div>

      <AnalysisList
        title="Next focus"
        items={evaluation.next_focus}
        icon={<Target size={15} />}
      />

      <div className="rounded-2xl border border-violet-200 bg-violet-50 p-5 dark:border-violet-400/20 dark:bg-violet-500/10">
        <div className="flex gap-3">
          <Brain
            size={18}
            className="mt-0.5 shrink-0 text-violet-500"
          />

          <div>
            <p className="text-sm font-semibold text-violet-700 dark:text-violet-300">
              Coach feedback
            </p>

            <p className="mt-2 text-sm leading-6 text-violet-700/80 dark:text-violet-200/80">
              {evaluation.coaching_feedback}
            </p>
          </div>
        </div>
      </div>

      {profile && (
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-2xl bg-slate-50 p-4 dark:bg-white/[0.04]">
            <p className="text-xs text-slate-400">Completed challenges</p>
            <p className="mt-1 text-2xl font-semibold">
              {profile.completed_challenges}
            </p>
          </div>

          <div className="rounded-2xl bg-slate-50 p-4 dark:bg-white/[0.04]">
            <p className="text-xs text-slate-400">Current difficulty</p>
            <p className="mt-1 text-2xl font-semibold capitalize">
              {profile.difficulty}
            </p>
          </div>
        </div>
      )}

      <button
        onClick={onNextChallenge}
        className="flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-950 px-5 py-3.5 text-sm font-medium text-white transition hover:-translate-y-0.5 dark:bg-white dark:text-slate-950"
      >
        <Target size={16} />
        {evaluation.ready_for_next_challenge
          ? "Start next challenge"
          : "Try another challenge"}
      </button>
    </div>
  );
}

function ProgressCard({ profile, onRefresh }) {
  const skills = Object.entries(profile?.skills || {});
  const weakest = profile?.weakest_skills || [];

  const statusLabel = (status) =>
    status === "not_started"
      ? "Not started"
      : status === "needs_practice"
        ? "Needs practice"
        : status === "developing"
          ? "Developing"
          : "Strong";

  const statusClass = (status) => {
    if (status === "strong") return "bg-emerald-500/10 text-emerald-600 dark:text-emerald-300";
    if (status === "developing") return "bg-cyan-500/10 text-cyan-600 dark:text-cyan-300";
    if (status === "needs_practice") return "bg-amber-500/10 text-amber-600 dark:text-amber-300";
    return "bg-slate-100 text-slate-500 dark:bg-white/10 dark:text-slate-400";
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="mb-2 text-sm font-medium text-violet-500">Your learning journey</p>
          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">Progress</h2>
          <p className="mt-3 max-w-xl text-sm leading-6 text-slate-500 dark:text-slate-400">
            See how your prompt-engineering skills are developing and where your next practice should focus.
          </p>
        </div>
        <button
          onClick={onRefresh}
          className="flex w-fit items-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-medium hover:bg-slate-50 dark:border-white/10 dark:hover:bg-white/5"
        >
          <Sparkles size={15} />
          Refresh
        </button>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-slate-200/70 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-white/[0.04]">
          <p className="text-xs text-slate-400">Overall progress</p>
          <p className="mt-2 text-3xl font-semibold">{profile?.overall_progress ?? 0}%</p>
          <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-white/10">
            <div className="h-full rounded-full bg-violet-500 transition-all" style={{ width: `${Math.min(profile?.overall_progress ?? 0, 100)}%` }} />
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200/70 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-white/[0.04]">
          <p className="text-xs text-slate-400">Current level</p>
          <p className="mt-2 text-2xl font-semibold capitalize">{profile?.difficulty || "beginner"}</p>
          <p className="mt-2 text-xs text-slate-400">Adaptive difficulty</p>
        </div>

        <div className="rounded-2xl border border-slate-200/70 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-white/[0.04]">
          <p className="text-xs text-slate-400">Challenges completed</p>
          <p className="mt-2 text-3xl font-semibold">{profile?.completed_challenges ?? 0}</p>
        </div>

        <div className="rounded-2xl border border-slate-200/70 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-white/[0.04]">
          <p className="text-xs text-slate-400">Evaluations</p>
          <p className="mt-2 text-3xl font-semibold">{profile?.total_evaluations ?? 0}</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.6fr_1fr]">
        <div className="rounded-3xl border border-slate-200/70 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-white/[0.04] sm:p-7">
          <div className="mb-5 flex items-center justify-between gap-3">
            <div>
              <h3 className="font-semibold">Skill map</h3>
              <p className="mt-1 text-xs text-slate-400">Confidence grows as PromptForge observes your work.</p>
            </div>
            <Brain size={18} className="text-violet-500" />
          </div>

          <div className="space-y-4">
            {skills.map(([skill, state]) => (
              <div key={skill}>
                <div className="mb-1.5 flex items-center justify-between gap-3 text-xs">
                  <span className="font-medium capitalize">{skill.replaceAll("_", " ")}</span>
                  <span className="text-slate-400">{Math.round((state.confidence || 0) * 100)}%</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-white/10">
                  <div
                    className="h-full rounded-full bg-violet-500 transition-all"
                    style={{ width: `${Math.min((state.confidence || 0) * 100, 100)}%` }}
                  />
                </div>
                <div className="mt-1.5 flex items-center justify-between gap-2 text-[11px] text-slate-400">
                  <span>{state.attempts} attempt{state.attempts === 1 ? "" : "s"}</span>
                  <span className={`rounded-full px-2 py-0.5 ${statusClass(state.status)}`}>{statusLabel(state.status)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-3xl border border-violet-200 bg-violet-50 p-6 dark:border-violet-400/20 dark:bg-violet-500/10">
            <div className="mb-4 flex items-center gap-2 text-violet-600 dark:text-violet-300">
              <Target size={18} />
              <h3 className="font-semibold">Next focus</h3>
            </div>
            {weakest.length ? (
              <div className="space-y-2">
                {weakest.map((skill, index) => (
                  <div key={skill} className="flex items-center gap-3 rounded-xl bg-white/70 px-3 py-2.5 text-sm dark:bg-black/10">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-violet-500/10 text-xs font-semibold text-violet-600 dark:text-violet-300">
                      {index + 1}
                    </span>
                    <span className="capitalize">{skill.replaceAll("_", " ")}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm leading-6 text-violet-700/80 dark:text-violet-200/80">
                Complete a challenge and PromptForge will identify your next focus areas.
              </p>
            )}
          </div>

          <div className="rounded-3xl border border-slate-200/70 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-white/[0.04]">
            <div className="mb-4 flex items-center gap-2">
              <Trophy size={18} className="text-amber-500" />
              <h3 className="font-semibold">Learning status</h3>
            </div>
            <p className="text-sm leading-6 text-slate-500 dark:text-slate-400">
              {profile?.total_evaluations
                ? `You've completed ${profile.completed_challenges} challenge${profile.completed_challenges === 1 ? "" : "s"} across ${profile.total_evaluations} evaluation${profile.total_evaluations === 1 ? "" : "s"}. Keep practicing to build stronger evidence across your skills.`
                : "Your progress map will grow as you complete prompt challenges."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function App() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [sessionId, setSessionId] = useState(null);

  const [activeMode, setActiveMode] = useState("analyze");

  const [message, setMessage] = useState("");
  const [lastAnalyzedPrompt, setLastAnalyzedPrompt] = useState("");
  const [analysis, setAnalysis] = useState(null);

  const [challenge, setChallenge] = useState(null);
  const [challengeAnswer, setChallengeAnswer] = useState("");
  const [evaluation, setEvaluation] = useState(null);
  const [profile, setProfile] = useState(null);

  const [isInitializing, setIsInitializing] = useState(true);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isLoadingChallenge, setIsLoadingChallenge] = useState(false);
  const [isSubmittingChallenge, setIsSubmittingChallenge] = useState(false);
  const [isLoadingProfile, setIsLoadingProfile] = useState(false);
  const [error, setError] = useState("");

  const textareaRef = useRef(null);

  useEffect(() => {
    initializeSession();
  }, []);

  const initializeSession = async () => {
    setIsInitializing(true);
    setError("");

    try {
      const result = await createSession();
      setSessionId(result.session_id);
      setProfile(null);
    } catch (err) {
      setError(err.message || "Unable to connect to PromptForge.");
    } finally {
      setIsInitializing(false);
    }
  };

  const loadProfile = async () => {
    if (!sessionId) return;

    try {
      const result = await getProfile(sessionId);
      setProfile(result.profile);
    } catch (err) {
      setError(err.message || "Unable to load learning progress.");
    }
  };

  const startNewSession = async () => {
    setAnalysis(null);
    setChallenge(null);
    setEvaluation(null);
    setProfile(null);
    setChallengeAnswer("");
    setMessage("");
    setLastAnalyzedPrompt("");
    setError("");

    await initializeSession();

    setActiveMode("analyze");

    requestAnimationFrame(() => {
      textareaRef.current?.focus();
    });
  };

  const handleAnalyze = async (text = message) => {
    const trimmed = text.trim();

    if (!trimmed || !sessionId || isAnalyzing) {
      return;
    }

    setError("");
    setAnalysis(null);
    setIsAnalyzing(true);

    try {
      const result = await analyzePrompt(sessionId, trimmed);
      setAnalysis(result.analysis);
      setLastAnalyzedPrompt(trimmed);
      setMessage("");
    } catch (err) {
      setError(err.message || "Prompt analysis failed.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const loadChallenge = async () => {
    if (!sessionId) {
      return;
    }

    setError("");
    setChallenge(null);
    setEvaluation(null);
    setChallengeAnswer("");
    setIsLoadingChallenge(true);

    try {
      const result = await getChallenge(sessionId);

      setChallenge(result.challenge);
      setProfile(result.profile);
    } catch (err) {
      setError(err.message || "Challenge generation failed.");
    } finally {
      setIsLoadingChallenge(false);
    }
  };

  const handleModeChange = async (mode) => {
    setActiveMode(mode);
    setError("");

    if (mode === "challenge") {
      if (!challenge) {
        await loadChallenge();
      }
      return;
    }

    if (mode === "progress") {
      setIsLoadingProfile(true);
      await loadProfile();
      setIsLoadingProfile(false);
    }
  };

  const submitChallenge = async () => {
    if (!challenge || !challengeAnswer.trim() || !sessionId) {
      return;
    }

    setError("");
    setIsSubmittingChallenge(true);

    try {
      const result = await evaluatePrompt(
        sessionId,
        challenge.task,
        challengeAnswer,
      );

      setEvaluation(result.evaluation);
      setProfile(result.profile);
    } catch (err) {
      setError(err.message || "Challenge evaluation failed.");
    } finally {
      setIsSubmittingChallenge(false);
    }
  };

  const handleSuggestion = async (suggestion) => {
    if (suggestion.id === "challenge") {
      setActiveMode("challenge");
      await loadChallenge();
      return;
    }

    setActiveMode("analyze");
    setMessage(suggestion.text);

    requestAnimationFrame(() => {
      textareaRef.current?.focus();
    });
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleAnalyze();
    }
  };

  const renderPromptComposer = () => (
    <div className="py-4">
      <div className="rounded-[26px] border border-slate-200/80 bg-white p-3 shadow-xl dark:border-white/[0.09] dark:bg-white/[0.045]">
        <textarea
          ref={textareaRef}
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Write a prompt you want to improve..."
          rows={4}
          maxLength={10000}
          disabled={isInitializing || isAnalyzing || !sessionId}
          className="block w-full resize-none bg-transparent px-3 py-2 text-sm leading-6 outline-none placeholder:text-slate-400"
        />

        <div className="flex items-center justify-between px-2 pt-2">
          <span className="text-[11px] text-slate-400">
            Enter to analyze
          </span>

          <button
            onClick={() => handleAnalyze()}
            disabled={!message.trim() || isInitializing || isAnalyzing || !sessionId}
            className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-950 text-white transition hover:scale-105 disabled:cursor-not-allowed disabled:opacity-40 dark:bg-white dark:text-slate-950"
          >
            {isAnalyzing ? (
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white dark:border-slate-950/20 dark:border-t-slate-950" />
            ) : (
              <Send size={16} />
            )}
          </button>
        </div>
      </div>
    </div>
  );

  const renderAnalyze = () => {
    if (analysis) {
      return (
        <div className="space-y-6">
          <div className="rounded-2xl bg-slate-950 p-5 text-sm leading-6 text-white dark:bg-white dark:text-slate-950">
            <p className="mb-2 text-xs font-medium uppercase tracking-wider opacity-60">
              Your prompt
            </p>
            {lastAnalyzedPrompt || "Prompt analyzed"}
          </div>

          <div className="rounded-3xl border border-slate-200/70 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-white/[0.04] sm:p-8">
            <AnalysisCard analysis={analysis} />
          </div>

          <button
            onClick={() => {
              setAnalysis(null);
              setMessage("");
              requestAnimationFrame(() => {
                textareaRef.current?.focus();
              });
            }}
            className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-medium hover:bg-slate-50 dark:border-white/10 dark:hover:bg-white/5"
          >
            Analyze another prompt
          </button>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        <div className="text-center">
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-[20px] bg-violet-500/10 text-violet-500">
            <Sparkles size={25} />
          </div>

          <p className="mb-2 text-sm font-medium text-violet-500">
            Prompt engineering coach
          </p>

          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            Make your prompts better.
          </h2>

          <p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-slate-500 dark:text-slate-400">
            Submit a prompt and PromptForge will teach you what works,
            what needs improvement, and why.
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          {suggestions.map(({ id, icon: Icon, title, text }) => (
            <button
              key={id}
              onClick={() =>
                handleSuggestion({
                  id,
                  title,
                  text,
                })
              }
              className="rounded-2xl border border-slate-200/70 bg-white p-4 text-left shadow-sm transition hover:-translate-y-1 hover:border-violet-300 dark:border-white/10 dark:bg-white/[0.04]"
            >
              <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100 dark:bg-white/10">
                <Icon size={17} />
              </div>

              <p className="text-sm font-semibold">{title}</p>

              <p className="mt-1 text-xs leading-5 text-slate-500 dark:text-slate-400">
                {text || "Practice prompt engineering with a real challenge."}
              </p>
            </button>
          ))}
        </div>

      </div>
    );
  };

  const renderChallenge = () => {
    if (isLoadingChallenge && !challenge && !evaluation) {
      return <LoadingCard text="Creating your challenge..." />;
    }

    if (evaluation) {
      return (
        <EvaluationCard
          evaluation={evaluation}
          profile={profile}
          onNextChallenge={loadChallenge}
        />
      );
    }

    if (challenge) {
      return (
        <ChallengeCard
          challenge={challenge}
          answer={challengeAnswer}
          setAnswer={setChallengeAnswer}
          onSubmit={submitChallenge}
          isSubmitting={isSubmittingChallenge}
        />
      );
    }

    return (
      <div className="py-12 text-center">
        <Target className="mx-auto mb-4 text-violet-500" size={32} />

        <h2 className="text-2xl font-semibold">
          Ready for a challenge?
        </h2>

        <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-slate-500 dark:text-slate-400">
          Practice one prompt-engineering skill at a time and build your
          ability progressively.
        </p>

        <button
          onClick={loadChallenge}
          className="mt-6 rounded-xl bg-slate-950 px-5 py-3 text-sm font-medium text-white dark:bg-white dark:text-slate-950"
        >
          Start challenge
        </button>
      </div>
    );
  };

  const renderProgress = () => {
    if (isLoadingProfile && !profile) {
      return <LoadingCard text="Loading your learning progress..." />;
    }

    return <ProgressCard profile={profile} onRefresh={loadProfile} />;
  };

  return (
    <div className="h-screen overflow-hidden bg-[#f7f8fa] text-slate-950 dark:bg-[#090b10] dark:text-white">
      <Sidebar
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
        onNewSession={startNewSession}
        onModeChange={handleModeChange}
        activeMode={activeMode}
      />

      <main className="ml-0 flex h-screen min-h-0 min-w-0 w-full flex-col overflow-hidden lg:ml-[280px] lg:w-[calc(100%-280px)]">
          <header className="flex h-[72px] shrink-0 items-center border-b border-slate-200/70 bg-white/70 px-4 backdrop-blur-xl dark:border-white/10 dark:bg-slate-950/60 sm:px-6 lg:px-8">
            <button
              className="rounded-xl p-2 lg:hidden"
              onClick={() => setMobileOpen(true)}
            >
              <Menu size={20} />
            </button>

            <div className="ml-2 hidden items-center gap-2 text-sm text-slate-500 sm:flex lg:ml-0">
              <span>
                {activeMode === "challenge"
                  ? "Challenge mode"
                  : activeMode === "progress"
                    ? "Learning progress"
                    : "Prompt analysis"}
              </span>
              <ChevronDown size={15} />
            </div>

            <div className="ml-auto flex items-center gap-3">
              <span
                className={`hidden rounded-full px-3 py-1 text-[11px] font-medium sm:block ${
                  sessionId
                    ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-300"
                    : "bg-amber-500/10 text-amber-600"
                }`}
              >
                {sessionId ? "Session active" : "Connecting"}
              </span>

              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-cyan-400 text-xs font-bold text-white">
                M
              </div>
            </div>
          </header>

          <section className="min-h-0 flex-1 overflow-y-auto px-4 py-8 sm:px-8 sm:py-10">
            <div className="mx-auto w-full max-w-3xl">
              {error && (
                <div className="mb-5">
                  <ErrorCard message={error} />
                </div>
              )}

              {activeMode === "challenge" ? (
                renderChallenge()
              ) : activeMode === "progress" ? (
                renderProgress()
              ) : (
                <>
                  {isInitializing && !sessionId ? (
                    <LoadingCard text="Connecting to PromptForge..." />
                  ) : isAnalyzing && !analysis ? (
                    <LoadingCard text="Analyzing your prompt..." />
                  ) : (
                    renderAnalyze()
                  )}
                </>
              )}
            </div>
          </section>
          {activeMode === "analyze" && (
            <div className="shrink-0 border-t border-slate-200/50 bg-[#f7f8fa]/95 px-4 backdrop-blur-xl dark:border-white/5 dark:bg-[#090b10]/95 sm:px-8">
              <div className="mx-auto w-full max-w-3xl">
                {renderPromptComposer()}
              </div>
            </div>
          )}

          <footer className="shrink-0 border-t border-slate-200/50 bg-[#f7f8fa]/95 px-4 py-3 text-center text-[10px] text-slate-400 backdrop-blur-xl dark:border-white/5 dark:bg-[#090b10]/95">
            PromptForge helps you learn how to think and write better prompts.
          </footer>
        </main>
      </div>
  );
}

export default App;