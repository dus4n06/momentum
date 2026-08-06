"use client";

import { useSupabaseState } from "@/hooks/useSupabaseState";

import React, { useState, useEffect, useRef, useMemo, useCallback } from "react";
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area,
} from "recharts";
import {
  LayoutGrid, ListChecks, Flame, BarChart3, NotebookPen, Settings as SettingsIcon,
  Plus, Check, X, Trash2, Pencil, ChevronDown, ChevronUp, ChevronLeft, ChevronRight,
  Trophy, Sparkles, Sun, Moon, ShieldAlert, Wind, Footprints, Timer, Play, Pause,
  RotateCcw, Download, Upload, GripVertical, Star, TrendingUp, Target, Calendar,
  Heart, Brain, Dumbbell, Snowflake, GlassWater, Apple, Ban, Wine, Cigarette,
  Dice5, Smartphone, GraduationCap, Hammer, Video, Lightbulb, Trees, Hourglass,
  Sunrise, AlarmClock, Shield, PersonStanding, Sparkle, Home, BookOpen, Award,
  Zap, AlertTriangle, ArrowRight, RefreshCw, CheckCircle2, Circle, Bell, Palette,
  FileDown, FileUp, Gauge, Menu,
} from "lucide-react";

/* ============================== CONSTANTS ============================== */

const ACCENTS = {
  gold: { name: "Gold", hex: "#E8A33D", soft: "rgba(232,163,61,0.15)" },
  teal: { name: "Teal", hex: "#2DD4BF", soft: "rgba(45,212,191,0.15)" },
  violet: { name: "Violet", hex: "#A78BFA", soft: "rgba(167,139,250,0.15)" },
  sky: { name: "Sky", hex: "#38BDF8", soft: "rgba(56,189,248,0.15)" },
  rose: { name: "Rose", hex: "#FB7185", soft: "rgba(251,113,133,0.15)" },
};

const CATEGORIES = {
  Health: "#34D399",
  Mind: "#A78BFA",
  Business: "#E8A33D",
  Trading: "#38BDF8",
  Learning: "#F472B6",
  Discipline: "#FB923C",
  Lifestyle: "#2DD4BF",
  Finance: "#FBBF24",
  Custom: "#94A3B8",
};

const ICONS = {
  Sunrise, AlarmClock, Moon, Sparkles, Brain, Dumbbell, Footprints, Snowflake,
  GlassWater, Apple, Ban, Wine, Cigarette, Dice5, Smartphone, BookOpen,
  GraduationCap, TrendingUp, Hammer, Video, Lightbulb, NotebookPen, Heart,
  PersonStanding, Sparkle, Home, Target, Calendar, Trees, Hourglass, Shield,
  Sun, Star, Zap,
};
const ICON_NAMES = Object.keys(ICONS);

function mkHabit(id, name, category, icon) {
  return { id, name, category, icon, archived: false };
}

const DEFAULT_HABITS = [
  mkHabit("h1", "Wake before 8:30", "Discipline", "Sunrise"),
  mkHabit("h2", "No Snooze", "Discipline", "AlarmClock"),
  mkHabit("h3", "Sleep at least 7 hours", "Health", "Moon"),
  mkHabit("h4", "Morning Manifest", "Mind", "Sparkles"),
  mkHabit("h5", "Night Manifest", "Mind", "Sparkles"),
  mkHabit("h6", "Meditation", "Mind", "Brain"),
  mkHabit("h7", "Workout", "Health", "Dumbbell"),
  mkHabit("h8", "Walk / Run", "Health", "Footprints"),
  mkHabit("h9", "Cold Shower", "Health", "Snowflake"),
  mkHabit("h10", "Drink enough water", "Health", "GlassWater"),
  mkHabit("h11", "Healthy Eating", "Health", "Apple"),
  mkHabit("h12", "No Junk Food", "Health", "Ban"),
  mkHabit("h13", "No Sugar Drinks", "Health", "Ban"),
  mkHabit("h14", "No Porn", "Discipline", "Shield"),
  mkHabit("h15", "No Masturbation", "Discipline", "Shield"),
  mkHabit("h16", "No Alcohol", "Discipline", "Wine"),
  mkHabit("h17", "No Smoking", "Discipline", "Cigarette"),
  mkHabit("h18", "No Gambling", "Discipline", "Dice5"),
  mkHabit("h19", "No Social Media before work", "Discipline", "Smartphone"),
  mkHabit("h20", "No Phone after waking", "Discipline", "Smartphone"),
  mkHabit("h21", "Read 30 min", "Learning", "BookOpen"),
  mkHabit("h22", "Study", "Learning", "GraduationCap"),
  mkHabit("h23", "Backtest", "Trading", "TrendingUp"),
  mkHabit("h24", "Live Trade", "Trading", "TrendingUp"),
  mkHabit("h25", "Build Axiom", "Business", "Hammer"),
  mkHabit("h26", "Post TikTok", "Business", "Video"),
  mkHabit("h27", "Learn something new", "Learning", "Lightbulb"),
  mkHabit("h28", "Journal", "Mind", "NotebookPen"),
  mkHabit("h29", "Gratitude", "Mind", "Heart"),
  mkHabit("h30", "Stretch", "Health", "PersonStanding"),
  mkHabit("h31", "Clean Desk", "Lifestyle", "Sparkle"),
  mkHabit("h32", "Room Clean", "Lifestyle", "Home"),
  mkHabit("h33", "Review Goals", "Discipline", "Target"),
  mkHabit("h34", "Plan Tomorrow", "Discipline", "Calendar"),
  mkHabit("h35", "Go Outside", "Lifestyle", "Trees"),
  mkHabit("h36", "Screen Time under target", "Lifestyle", "Hourglass"),
];

function mkTask(id, start, end, title, priority = "medium") {
  return { id, start, end, title, priority, notes: "", timerSeconds: 0 };
}

const NORMAL_TASKS = [
  mkTask("t1", "08:00", "08:00", "Wake Up", "low"),
  mkTask("t2", "09:00", "10:00", "Axiom", "high"),
  mkTask("t3", "10:00", "11:00", "Learning", "medium"),
  mkTask("t4", "11:00", "12:20", "Gym + Shower", "high"),
  mkTask("t5", "12:20", "12:55", "Lunch", "low"),
  mkTask("t6", "13:00", "15:00", "Backtesting", "high"),
  mkTask("t7", "15:00", "16:30", "Live Trading", "high"),
  mkTask("t8", "16:30", "17:30", "Walk", "medium"),
  mkTask("t9", "17:30", "18:00", "Reading", "medium"),
  mkTask("t10", "18:00", "20:00", "TikTok", "low"),
  mkTask("t11", "20:00", "20:45", "Educational Videos", "medium"),
  mkTask("t12", "20:45", "21:50", "Axiom", "high"),
  mkTask("t13", "21:50", "22:00", "Break", "low"),
  mkTask("t14", "22:00", "23:25", "Axiom", "high"),
  mkTask("t15", "23:25", "01:00", "Free Time", "low"),
  mkTask("t16", "01:00", "01:00", "Sleep", "low"),
];

const RUNNING_TASKS = NORMAL_TASKS.map((t) =>
  t.id === "t8" ? { ...t, title: "Running + Shower" } : { ...t }
);

const QUOTES = [
  "Discipline is choosing between what you want now and what you want most.",
  "Motivation gets you started. Discipline keeps you going.",
  "You do not rise to the level of your goals. You fall to the level of your systems.",
  "Small daily improvements are the key to staggering long-term results.",
  "The pain of discipline weighs ounces. The pain of regret weighs tons.",
  "Every action you take is a vote for the person you wish to become.",
  "What you do today builds the person you are tomorrow.",
  "Comfort is the enemy of progress.",
  "Winners focus on winning. Losers focus on winners.",
  "Suffer the discipline of a champion, or suffer the regret of a failure.",
  "The obstacle is the way.",
  "Stay hard.",
];

const EMERGENCY_REASONS = [
  "You made a promise to the person you're becoming.",
  "Every relapse resets the neural rewiring you've fought for.",
  "The urge is temporary. The regret lasts far longer.",
  "You are stronger than this impulse, right now, in this second.",
  "Future you is watching this exact moment.",
];

const JOURNAL_PROMPTS = [
  ["wentWell", "What went well?"],
  ["wentWrong", "What didn't?"],
  ["improve", "What should I improve tomorrow?"],
  ["bestMoment", "Best moment today?"],
  ["worstDecision", "Worst decision today?"],
  ["lesson", "One lesson learned."],
];

const NAV = [
  { id: "dashboard", label: "Dashboard", icon: LayoutGrid },
  { id: "plan", label: "Today's Plan", icon: ListChecks },
  { id: "habits", label: "Habit Tracker", icon: Flame },
  { id: "analytics", label: "Analytics", icon: BarChart3 },
  { id: "journal", label: "Journal", icon: NotebookPen },
  { id: "settings", label: "Settings", icon: SettingsIcon },
];

/* ============================== HELPERS ============================== */

function dateKey(d) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}
function todayKey() {
  return dateKey(new Date());
}
function addDays(d, n) {
  const nd = new Date(d);
  nd.setDate(nd.getDate() + n);
  return nd;
}
function lastNDays(n) {
  const out = [];
  for (let i = n - 1; i >= 0; i--) out.push(dateKey(addDays(new Date(), -i)));
  return out;
}
function minutesOf(t) {
  const [h, m] = t.split(":").map(Number);
  return h * 60 + m;
}
function durationLabel(start, end) {
  let s = minutesOf(start);
  let e = minutesOf(end);
  if (e < s) e += 24 * 60;
  const diff = e - s;
  if (diff <= 0) return "—";
  const h = Math.floor(diff / 60);
  const m = diff % 60;
  return h > 0 ? `${h}h ${m > 0 ? m + "m" : ""}`.trim() : `${m}m`;
}
function periodOf(start) {
  const h = Number(start.split(":")[0]);
  if (h >= 1 && h < 6) return "Night";
  if (h >= 6 && h < 12) return "Morning";
  if (h >= 12 && h < 17) return "Afternoon";
  if (h >= 17 && h < 21) return "Evening";
  return "Night";
}
function fmtTimer(sec) {
  const m = Math.floor(sec / 60).toString().padStart(2, "0");
  const s = Math.floor(sec % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}
function currentStreak(successSet) {
  let streak = 0;
  let cursor = new Date();
  if (!successSet.has(dateKey(cursor))) cursor = addDays(cursor, -1);
  while (successSet.has(dateKey(cursor))) {
    streak++;
    cursor = addDays(cursor, -1);
  }
  return streak;
}
function bestStreak(successSet) {
  if (successSet.size === 0) return 0;
  const dates = Array.from(successSet).sort();
  let best = 1,
    run = 1;
  for (let i = 1; i < dates.length; i++) {
    const diff = Math.round(
      (new Date(dates[i]) - new Date(dates[i - 1])) / 86400000
    );
    if (diff === 1) run++;
    else if (diff !== 0) run = 1;
    if (run > best) best = run;
  }
  return best;
}
function clamp(n, lo, hi) {
  return Math.max(lo, Math.min(hi, n));
}
function pct(a, b) {
  if (!b) return 0;
  return clamp(Math.round((a / b) * 100), 0, 100);
}

/* ============================== STORAGE ============================== */

function IconOf({ name, size = 16, style, className }) {
  const Cmp = ICONS[name] || Circle;
  return <Cmp size={size} style={style} className={className} />;
}

function Card({ children, className = "", style, onClick }) {
  return (
    <div
      onClick={onClick}
      className={`rounded-2xl ${className}`}
      style={{
        background: "var(--panel)",
        border: "1px solid var(--panel-border)",
        backdropFilter: "blur(16px)",
        boxShadow: "0 1px 0 rgba(255,255,255,0.02) inset, 0 10px 30px rgba(0,0,0,0.15)",
        ...style,
      }}
    >
      {children}
    </div>
  );
}

function SectionLabel({ children, right }) {
  return (
    <div className="flex items-center justify-between mb-3">
      <h3
        className="text-sm font-semibold tracking-wide"
        style={{ color: "var(--text-dim)", fontFamily: "Sora, sans-serif" }}
      >
        {children}
      </h3>
      {right}
    </div>
  );
}

function ProgressRing({ value, size = 84, stroke = 8, color, label, sub }) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const off = c - (clamp(value, 0, 100) / 100) * c;
  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--panel-border)" strokeWidth={stroke} />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={color || "var(--accent)"}
          strokeWidth={stroke}
          strokeDasharray={c}
          strokeDashoffset={off}
          strokeLinecap="round"
          style={{ transition: "stroke-dashoffset 0.8s cubic-bezier(.4,0,.2,1)" }}
        />
      </svg>
      <div className="absolute flex flex-col items-center justify-center">
        <span
          className="font-bold"
          style={{ fontFamily: "JetBrains Mono, monospace", fontSize: size * 0.22, color: "var(--text)" }}
        >
          {Math.round(value)}%
        </span>
        {label && <span style={{ fontSize: 10, color: "var(--text-dim)" }}>{label}</span>}
      </div>
      {sub}
    </div>
  );
}

function Toggle({ checked, onChange }) {
  return (
    <button
      onClick={() => onChange(!checked)}
      className="relative rounded-full transition-colors"
      style={{
        width: 40,
        height: 22,
        background: checked ? "var(--accent)" : "var(--panel-border)",
      }}
    >
      <span
        className="absolute rounded-full transition-transform"
        style={{
          width: 16,
          height: 16,
          top: 3,
          left: 3,
          background: "#fff",
          transform: checked ? "translateX(18px)" : "translateX(0)",
        }}
      />
    </button>
  );
}

function Stat({ icon: Icon, label, value, color }) {
  return (
    <Card className="p-4 flex items-center gap-3">
      <div
        className="rounded-xl flex items-center justify-center shrink-0"
        style={{ width: 38, height: 38, background: (color || "var(--accent)") + "22" }}
      >
        <Icon size={18} style={{ color: color || "var(--accent)" }} />
      </div>
      <div className="min-w-0">
        <div style={{ fontFamily: "JetBrains Mono, monospace", fontSize: 20, fontWeight: 700, color: "var(--text)" }}>
          {value}
        </div>
        <div className="truncate" style={{ fontSize: 11, color: "var(--text-dim)" }}>
          {label}
        </div>
      </div>
    </Card>
  );
}

function Modal({ open, onClose, children, maxWidth = 520 }) {
  if (!open) return null;
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.55)", backdropFilter: "blur(4px)" }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full rounded-2xl p-5 max-h-[88vh] overflow-y-auto"
        style={{
          maxWidth,
          background: "var(--bg-elevated)",
          border: "1px solid var(--panel-border)",
          boxShadow: "0 20px 60px rgba(0,0,0,0.5)",
        }}
      >
        {children}
      </div>
    </div>
  );
}

function PriorityDot({ p }) {
  const color = p === "high" ? "#EF4444" : p === "medium" ? "#E8A33D" : "#64748B";
  return <span className="rounded-full inline-block" style={{ width: 7, height: 7, background: color }} />;
}

/* ============================== CONFETTI ============================== */

function Confetti({ show }) {
  const pieces = useMemo(
    () =>
      Array.from({ length: 60 }).map((_, i) => ({
        id: i,
        left: Math.random() * 100,
        delay: Math.random() * 0.6,
        duration: 2.2 + Math.random() * 1.4,
        color: [ "#E8A33D", "#2DD4BF", "#A78BFA", "#38BDF8", "#FB7185", "#34D399" ][i % 6],
        rotate: Math.random() * 360,
        size: 6 + Math.random() * 6,
      })),
    [show]
  );
  if (!show) return null;
  return (
    <div className="fixed inset-0 pointer-events-none z-[70] overflow-hidden">
      {pieces.map((p) => (
        <span
          key={p.id}
          style={{
            position: "absolute",
            top: -20,
            left: `${p.left}%`,
            width: p.size,
            height: p.size * 0.4,
            background: p.color,
            borderRadius: 2,
            transform: `rotate(${p.rotate}deg)`,
            animation: `momentum-fall ${p.duration}s ease-in ${p.delay}s forwards`,
          }}
        />
      ))}
    </div>
  );
}

/* ============================== SIDEBAR / TOPBAR ============================== */

function Sidebar({ page, setPage, mobileOpen, setMobileOpen, disciplineScore }) {
  return (
    <>
      <aside
        className="hidden md:flex flex-col shrink-0"
        style={{ width: 236, borderRight: "1px solid var(--panel-border)", background: "var(--bg-elevated)" }}
      >
        <div className="px-5 pt-6 pb-4 flex items-center gap-2">
          <div
            className="rounded-xl flex items-center justify-center"
            style={{ width: 34, height: 34, background: "var(--accent)" }}
          >
            <Zap size={18} color="#0B0E14" />
          </div>
          <span style={{ fontFamily: "Sora, sans-serif", fontWeight: 700, fontSize: 18, color: "var(--text)" }}>
            Momentum
          </span>
        </div>
        <nav className="flex-1 px-3 space-y-1">
          {NAV.map((n) => (
            <button
              key={n.id}
              onClick={() => setPage(n.id)}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors"
              style={{
                background: page === n.id ? "var(--accent-soft)" : "transparent",
                color: page === n.id ? "var(--accent)" : "var(--text-dim)",
              }}
            >
              <n.icon size={17} />
              <span style={{ fontSize: 14, fontWeight: page === n.id ? 600 : 500 }}>{n.label}</span>
            </button>
          ))}
        </nav>
        <div className="p-4">
          <Card className="p-3 flex items-center gap-3">
            <ProgressRing value={disciplineScore} size={44} stroke={5} label="" />
            <div>
              <div style={{ fontSize: 11, color: "var(--text-dim)" }}>Discipline</div>
              <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text)" }}>Score {disciplineScore}</div>
            </div>
          </Card>
        </div>
      </aside>

      {mobileOpen && (
        <div className="fixed inset-0 z-40 md:hidden" onClick={() => setMobileOpen(false)}>
          <div className="absolute inset-0" style={{ background: "rgba(0,0,0,0.6)" }} />
          <aside
            onClick={(e) => e.stopPropagation()}
            className="absolute left-0 top-0 bottom-0 flex flex-col"
            style={{ width: 240, background: "var(--bg-elevated)", borderRight: "1px solid var(--panel-border)" }}
          >
            <div className="px-5 pt-6 pb-4 flex items-center gap-2">
              <div className="rounded-xl flex items-center justify-center" style={{ width: 34, height: 34, background: "var(--accent)" }}>
                <Zap size={18} color="#0B0E14" />
              </div>
              <span style={{ fontFamily: "Sora, sans-serif", fontWeight: 700, fontSize: 18, color: "var(--text)" }}>Momentum</span>
            </div>
            <nav className="flex-1 px-3 space-y-1">
              {NAV.map((n) => (
                <button
                  key={n.id}
                  onClick={() => {
                    setPage(n.id);
                    setMobileOpen(false);
                  }}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl"
                  style={{
                    background: page === n.id ? "var(--accent-soft)" : "transparent",
                    color: page === n.id ? "var(--accent)" : "var(--text-dim)",
                  }}
                >
                  <n.icon size={17} />
                  <span style={{ fontSize: 14, fontWeight: page === n.id ? 600 : 500 }}>{n.label}</span>
                </button>
              ))}
            </nav>
          </aside>
        </div>
      )}

      <nav
        className="md:hidden fixed bottom-0 left-0 right-0 z-30 flex items-center justify-around py-2"
        style={{ background: "var(--bg-elevated)", borderTop: "1px solid var(--panel-border)" }}
      >
        {NAV.map((n) => (
          <button key={n.id} onClick={() => setPage(n.id)} className="flex flex-col items-center gap-0.5 px-2 py-1">
            <n.icon size={19} color={page === n.id ? "var(--accent)" : "var(--text-dim)"} />
            <span style={{ fontSize: 9, color: page === n.id ? "var(--accent)" : "var(--text-dim)" }}>
              {n.label.split(" ")[0]}
            </span>
          </button>
        ))}
      </nav>
    </>
  );
}

function TopBar({ setMobileOpen, onEmergency, dayStreak, theme, setTheme }) {
  const d = new Date();
  const dateStr = d.toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric" });
  return (
    <div
      className="sticky top-0 z-20 flex items-center justify-between px-4 md:px-8 py-4"
      style={{ background: "var(--bg-translucent)", backdropFilter: "blur(12px)", borderBottom: "1px solid var(--panel-border)" }}
    >
      <div className="flex items-center gap-3">
        <button className="md:hidden" onClick={() => setMobileOpen(true)}>
          <Menu size={20} color="var(--text)" />
        </button>
        <div>
          <div style={{ fontFamily: "Sora, sans-serif", fontWeight: 700, fontSize: 16, color: "var(--text)" }}>{dateStr}</div>
          <div className="flex items-center gap-1" style={{ fontSize: 11, color: "var(--text-dim)" }}>
            <Flame size={12} color="var(--accent)" /> {dayStreak} day streak
          </div>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="rounded-xl flex items-center justify-center"
          style={{ width: 36, height: 36, background: "var(--panel)", border: "1px solid var(--panel-border)" }}
        >
          {theme === "dark" ? <Sun size={16} color="var(--text-dim)" /> : <Moon size={16} color="var(--text-dim)" />}
        </button>
        <button
          onClick={onEmergency}
          className="flex items-center gap-2 rounded-xl px-3 py-2 font-semibold"
          style={{ background: "rgba(239,68,68,0.12)", border: "1px solid rgba(239,68,68,0.35)", color: "#EF4444" }}
        >
          <ShieldAlert size={16} />
          <span className="hidden sm:inline" style={{ fontSize: 13 }}>
            Emergency
          </span>
        </button>
      </div>
    </div>
  );
}

/* ============================== DASHBOARD ============================== */

function Heatmap({ dayScores }) {
  const days = lastNDays(91);
  const weeks = [];
  for (let i = 0; i < days.length; i += 7) weeks.push(days.slice(i, i + 7));
  const colorFor = (v) => {
    if (v === undefined) return "var(--panel-border)";
    if (v === 0) return "var(--panel-border)";
    if (v < 34) return "var(--accent-soft)";
    if (v < 67) return "var(--accent)" + "88";
    return "var(--accent)";
  };
  return (
    <div className="flex gap-1 overflow-x-auto pb-1">
      {weeks.map((w, wi) => (
        <div key={wi} className="flex flex-col gap-1">
          {w.map((day) => (
            <div
              key={day}
              title={`${day}: ${dayScores[day] || 0}%`}
              style={{
                width: 11,
                height: 11,
                borderRadius: 3,
                background: colorFor(dayScores[day]),
              }}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

function DashboardPage({ data, quote, setPage }) {
  const {
    taskPct, habitPct, dayStreak, habitStreak, perfectStreak, discipline,
    dayScores, weekSeries, monthSeries, remainingTasks, upcomingTasks,
    monthPct, recentJournal, streakCounts,
  } = data;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Stat icon={Trophy} label="Day streak" value={dayStreak} color="#E8A33D" />
        <Stat icon={Flame} label="Habit streak" value={habitStreak} color="#FB923C" />
        <Stat icon={Sparkles} label="Perfect day streak" value={perfectStreak} color="#2DD4BF" />
        <Stat icon={Gauge} label="Discipline score" value={discipline} color="#A78BFA" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="p-5 flex flex-col items-center justify-center gap-2">
          <ProgressRing value={taskPct} size={110} label="Today" />
          <span style={{ fontSize: 12, color: "var(--text-dim)" }}>Today's plan completion</span>
        </Card>
        <Card className="p-5 flex flex-col items-center justify-center gap-2">
          <ProgressRing value={habitPct} size={110} color="var(--accent-2, #2DD4BF)" label="Habits" />
          <span style={{ fontSize: 12, color: "var(--text-dim)" }}>Today's habit completion</span>
        </Card>
        <Card className="p-5 flex flex-col items-center justify-center gap-2">
          <ProgressRing value={monthPct} size={110} color="#A78BFA" label="Month" />
          <span style={{ fontSize: 12, color: "var(--text-dim)" }}>Month completion</span>
        </Card>
      </div>

      <Card className="p-5" style={{ background: "linear-gradient(135deg, var(--accent-soft), transparent)" }}>
        <div className="flex items-start gap-3">
          <Sparkle size={18} color="var(--accent)" className="mt-0.5 shrink-0" />
          <p style={{ fontFamily: "Sora, sans-serif", fontSize: 15, color: "var(--text)", lineHeight: 1.5 }}>
            {quote}
          </p>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card className="p-5">
          <SectionLabel>This week</SectionLabel>
          <div style={{ width: "100%", height: 160 }}>
            <ResponsiveContainer>
              <BarChart data={weekSeries}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--panel-border)" vertical={false} />
                <XAxis dataKey="label" tick={{ fill: "var(--text-dim)", fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis hide domain={[0, 100]} />
                <Tooltip contentStyle={{ background: "var(--bg-elevated)", border: "1px solid var(--panel-border)", borderRadius: 8, fontSize: 12 }} />
                <Bar dataKey="value" radius={[6, 6, 0, 0]} fill="var(--accent)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
        <Card className="p-5">
          <SectionLabel>Last 30 days</SectionLabel>
          <div style={{ width: "100%", height: 160 }}>
            <ResponsiveContainer>
              <AreaChart data={monthSeries}>
                <defs>
                  <linearGradient id="momGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--accent)" stopOpacity={0.5} />
                    <stop offset="95%" stopColor="var(--accent)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="label" hide />
                <YAxis hide domain={[0, 100]} />
                <Tooltip contentStyle={{ background: "var(--bg-elevated)", border: "1px solid var(--panel-border)", borderRadius: 8, fontSize: 12 }} />
                <Area type="monotone" dataKey="value" stroke="var(--accent)" fill="url(#momGrad)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      <Card className="p-5">
        <SectionLabel>Consistency heatmap · last 13 weeks</SectionLabel>
        <Heatmap dayScores={dayScores} />
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card className="p-5">
          <SectionLabel right={<button onClick={() => setPage("plan")} style={{ fontSize: 12, color: "var(--accent)" }}>Open plan →</button>}>
            Remaining today ({remainingTasks.length})
          </SectionLabel>
          {remainingTasks.length === 0 ? (
            <div className="flex items-center gap-2 py-4" style={{ color: "var(--text-dim)", fontSize: 13 }}>
              <CheckCircle2 size={16} color="#34D399" /> Everything done. Well played.
            </div>
          ) : (
            <div className="space-y-2">
              {remainingTasks.slice(0, 6).map((t) => (
                <div key={t.id} className="flex items-center gap-2 text-sm">
                  <PriorityDot p={t.priority} />
                  <span style={{ color: "var(--text-dim)", fontFamily: "JetBrains Mono, monospace", fontSize: 11, width: 44 }}>{t.start}</span>
                  <span style={{ color: "var(--text)" }}>{t.title}</span>
                </div>
              ))}
            </div>
          )}
        </Card>
        <Card className="p-5">
          <SectionLabel right={<button onClick={() => setPage("journal")} style={{ fontSize: 12, color: "var(--accent)" }}>Open journal →</button>}>
            Recent journal entry
          </SectionLabel>
          {recentJournal ? (
            <div>
              <div style={{ fontSize: 11, color: "var(--text-dim)", marginBottom: 4 }}>{recentJournal.date}</div>
              <p style={{ fontSize: 13, color: "var(--text)", lineHeight: 1.5 }}>
                {recentJournal.text?.slice(0, 220) || "No reflection written yet."}
              </p>
            </div>
          ) : (
            <div style={{ fontSize: 13, color: "var(--text-dim)" }}>No entries yet — write your first reflection tonight.</div>
          )}
        </Card>
      </div>
    </div>
  );
}

/* ============================== PLANNER ============================== */

function TaskRow({ task, done, onToggle, onEdit, onDelete, onDuplicate, dragProps, timerSec, onTimer }) {
  const [open, setOpen] = useState(false);
  return (
    <div
      {...dragProps}
      className="rounded-xl px-3 py-2.5 mb-2 group"
      style={{
        background: done ? "var(--accent-soft)" : "var(--panel)",
        border: "1px solid var(--panel-border)",
        opacity: done ? 0.75 : 1,
      }}
    >
      <div className="flex items-center gap-3">
        <span className="cursor-grab hidden sm:block" style={{ color: "var(--text-dim)" }}>
          <GripVertical size={14} />
        </span>
        <button
          onClick={() => onToggle(task.id)}
          className="rounded-full flex items-center justify-center shrink-0"
          style={{
            width: 22, height: 22,
            background: done ? "var(--accent)" : "transparent",
            border: done ? "none" : "1.5px solid var(--panel-border)",
          }}
        >
          {done && <Check size={13} color="#0B0E14" />}
        </button>
        <div className="min-w-0 flex-1" onClick={() => setOpen((o) => !o)}>
          <div className="flex items-center gap-2 flex-wrap">
            <span style={{ fontFamily: "JetBrains Mono, monospace", fontSize: 11, color: "var(--text-dim)" }}>
              {task.start}
              {task.start !== task.end ? `–${task.end}` : ""}
            </span>
            <PriorityDot p={task.priority} />
            <span
              className="truncate"
              style={{ fontSize: 14, color: "var(--text)", textDecoration: done ? "line-through" : "none" }}
            >
              {task.title}
            </span>
            <span style={{ fontSize: 10, color: "var(--text-dim)" }}>{durationLabel(task.start, task.end)}</span>
          </div>
        </div>
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
          <button onClick={() => onTimer(task.id)} className="p-1.5 rounded-lg" style={{ background: "var(--panel)" }}>
            {timerSec != null && timerSec.running ? <Pause size={13} color="var(--text-dim)" /> : <Play size={13} color="var(--text-dim)" />}
          </button>
          <button onClick={() => onEdit(task)} className="p-1.5 rounded-lg" style={{ background: "var(--panel)" }}>
            <Pencil size={13} color="var(--text-dim)" />
          </button>
          <button onClick={() => onDuplicate(task)} className="p-1.5 rounded-lg" style={{ background: "var(--panel)" }}>
            <Plus size={13} color="var(--text-dim)" />
          </button>
          <button onClick={() => onDelete(task.id)} className="p-1.5 rounded-lg" style={{ background: "var(--panel)" }}>
            <Trash2 size={13} color="#EF4444" />
          </button>
        </div>
      </div>
      {timerSec && timerSec.seconds > 0 && (
        <div className="pl-9 mt-1" style={{ fontFamily: "JetBrains Mono, monospace", fontSize: 11, color: "var(--accent)" }}>
          Focus timer: {fmtTimer(timerSec.seconds)}
        </div>
      )}
      {(open || task.notes) && (
        <div className="pl-9 mt-1">
          <textarea
            value={task.notes}
            onChange={(e) => onEdit({ ...task, notes: e.target.value })}
            placeholder="Add a note…"
            className="w-full bg-transparent resize-none outline-none"
            style={{ fontSize: 12, color: "var(--text-dim)", border: "none" }}
            rows={1}
          />
        </div>
      )}
    </div>
  );
}

function TaskEditModal({ task, onClose, onSave, onDelete }) {
  const [draft, setDraft] = useState(task);
  useEffect(() => setDraft(task), [task]);
  if (!task) return null;
  return (
    <Modal open={!!task} onClose={onClose}>
      <div className="flex items-center justify-between mb-4">
        <h3 style={{ fontFamily: "Sora, sans-serif", fontWeight: 700, fontSize: 16, color: "var(--text)" }}>Edit task</h3>
        <button onClick={onClose}><X size={18} color="var(--text-dim)" /></button>
      </div>
      <div className="space-y-3">
        <div>
          <label style={{ fontSize: 11, color: "var(--text-dim)" }}>Title</label>
          <input
            value={draft.title}
            onChange={(e) => setDraft({ ...draft, title: e.target.value })}
            className="w-full mt-1 rounded-lg px-3 py-2 outline-none"
            style={{ background: "var(--panel)", border: "1px solid var(--panel-border)", color: "var(--text)", fontSize: 14 }}
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label style={{ fontSize: 11, color: "var(--text-dim)" }}>Start</label>
            <input
              type="time"
              value={draft.start}
              onChange={(e) => setDraft({ ...draft, start: e.target.value })}
              className="w-full mt-1 rounded-lg px-3 py-2 outline-none"
              style={{ background: "var(--panel)", border: "1px solid var(--panel-border)", color: "var(--text)", fontSize: 14 }}
            />
          </div>
          <div>
            <label style={{ fontSize: 11, color: "var(--text-dim)" }}>End</label>
            <input
              type="time"
              value={draft.end}
              onChange={(e) => setDraft({ ...draft, end: e.target.value })}
              className="w-full mt-1 rounded-lg px-3 py-2 outline-none"
              style={{ background: "var(--panel)", border: "1px solid var(--panel-border)", color: "var(--text)", fontSize: 14 }}
            />
          </div>
        </div>
        <div>
          <label style={{ fontSize: 11, color: "var(--text-dim)" }}>Priority</label>
          <div className="flex gap-2 mt-1">
            {["low", "medium", "high"].map((p) => (
              <button
                key={p}
                onClick={() => setDraft({ ...draft, priority: p })}
                className="flex-1 rounded-lg py-2 capitalize flex items-center justify-center gap-1.5"
                style={{
                  background: draft.priority === p ? "var(--accent-soft)" : "var(--panel)",
                  border: `1px solid ${draft.priority === p ? "var(--accent)" : "var(--panel-border)"}`,
                  color: "var(--text)",
                  fontSize: 13,
                }}
              >
                <PriorityDot p={p} /> {p}
              </button>
            ))}
          </div>
        </div>
        <div>
          <label style={{ fontSize: 11, color: "var(--text-dim)" }}>Notes</label>
          <textarea
            value={draft.notes}
            onChange={(e) => setDraft({ ...draft, notes: e.target.value })}
            rows={3}
            className="w-full mt-1 rounded-lg px-3 py-2 outline-none resize-none"
            style={{ background: "var(--panel)", border: "1px solid var(--panel-border)", color: "var(--text)", fontSize: 13 }}
          />
        </div>
      </div>
      <div className="flex gap-2 mt-5">
        <button
          onClick={() => onDelete(draft.id)}
          className="flex-1 rounded-xl py-2.5 font-medium"
          style={{ background: "rgba(239,68,68,0.1)", color: "#EF4444", fontSize: 13 }}
        >
          Delete
        </button>
        <button
          onClick={() => onSave(draft)}
          className="flex-1 rounded-xl py-2.5 font-semibold"
          style={{ background: "var(--accent)", color: "#0B0E14", fontSize: 13 }}
        >
          Save
        </button>
      </div>
    </Modal>
  );
}

function PlannerPage({ planner, setPlanner, onPerfectDay }) {
  const template = planner.activeTemplate;
  const tasks = planner.tasks[template];
  const today = todayKey();
  const completions = planner.completions[today] || {};
  const meta = planner.dayMeta[today] || { rating: 0, mood: 3, energy: 3, focus: 3 };
  const [editing, setEditing] = useState(null);
  const [timers, setTimers] = useState({});
  const [collapsed, setCollapsed] = useState({});
  const dragFrom = useRef(null);

  const doneCount = tasks.filter((t) => completions[t.id]?.done).length;
  const donePct = pct(doneCount, tasks.length);

  useEffect(() => {
    const iv = setInterval(() => {
      setTimers((prev) => {
        const next = { ...prev };
        let changed = false;
        Object.keys(next).forEach((id) => {
          if (next[id].running) {
            next[id] = { ...next[id], seconds: next[id].seconds + 1 };
            changed = true;
          }
        });
        return changed ? next : prev;
      });
    }, 1000);
    return () => clearInterval(iv);
  }, []);

  const setTasks = (updater) => {
    setPlanner((p) => ({
      ...p,
      tasks: { ...p.tasks, [template]: updater(p.tasks[template]) },
    }));
  };

  const toggleTask = (id) => {
    setPlanner((p) => {
      const dayC = { ...(p.completions[today] || {}) };
      const wasDone = dayC[id]?.done;
      dayC[id] = wasDone ? { done: false } : { done: true, completedAt: new Date().toISOString() };
      const next = { ...p, completions: { ...p.completions, [today]: dayC } };
      const allDone = tasks.every((t) => dayC[t.id]?.done);
      if (allDone && !wasDone) onPerfectDay();
      return next;
    });
  };

  const saveTask = (draft) => {
    setTasks((list) => list.map((t) => (t.id === draft.id ? draft : t)));
    setEditing(null);
  };
  const editInline = (draft) => setTasks((list) => list.map((t) => (t.id === draft.id ? draft : t)));
  const deleteTask = (id) => {
    setTasks((list) => list.filter((t) => t.id !== id));
    setEditing(null);
  };
  const duplicateTask = (task) => {
    setTasks((list) => {
      const idx = list.findIndex((t) => t.id === task.id);
      const copy = { ...task, id: `t${Date.now()}` };
      const next = [...list];
      next.splice(idx + 1, 0, copy);
      return next;
    });
  };
  const addTask = () => {
    const id = `t${Date.now()}`;
    setTasks((list) => [...list, mkTask(id, "09:00", "10:00", "New task")]);
  };
  const toggleTimer = (id) => {
    setTimers((prev) => ({
      ...prev,
      [id]: { seconds: prev[id]?.seconds || 0, running: !(prev[id]?.running) },
    }));
  };

  const onDragStart = (id) => (dragFrom.current = id);
  const onDragOver = (e) => e.preventDefault();
  const onDrop = (id) => {
    if (dragFrom.current == null || dragFrom.current === id) return;
    setTasks((list) => {
      const next = [...list];
      const fromIdx = next.findIndex((t) => t.id === dragFrom.current);
      const toIdx = next.findIndex((t) => t.id === id);
      const [moved] = next.splice(fromIdx, 1);
      next.splice(toIdx, 0, moved);
      return next;
    });
    dragFrom.current = null;
  };

  const groups = ["Morning", "Afternoon", "Evening", "Night"];
  const setMeta = (patch) =>
    setPlanner((p) => ({ ...p, dayMeta: { ...p.dayMeta, [today]: { ...meta, ...patch } } }));

  return (
    <div className="space-y-6">
      <Card className="p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="rounded-full p-1 flex" style={{ background: "var(--panel)", border: "1px solid var(--panel-border)" }}>
              {[
                { id: "normal", label: "Normal Day" },
                { id: "running", label: "Running Day" },
              ].map((tpl) => (
                <button
                  key={tpl.id}
                  onClick={() => setPlanner((p) => ({ ...p, activeTemplate: tpl.id }))}
                  className="px-4 py-1.5 rounded-full font-medium"
                  style={{
                    background: template === tpl.id ? "var(--accent)" : "transparent",
                    color: template === tpl.id ? "#0B0E14" : "var(--text-dim)",
                    fontSize: 13,
                  }}
                >
                  {tpl.label}
                </button>
              ))}
            </div>
            <button onClick={addTask} className="flex items-center gap-1 rounded-full px-3 py-1.5" style={{ background: "var(--panel)", border: "1px solid var(--panel-border)", fontSize: 12, color: "var(--text-dim)" }}>
              <Plus size={13} /> Task
            </button>
          </div>
          <div className="flex items-center gap-3">
            <div style={{ width: 160 }}>
              <div className="flex justify-between mb-1" style={{ fontSize: 11, color: "var(--text-dim)" }}>
                <span>{doneCount}/{tasks.length} done</span>
                <span>{donePct}%</span>
              </div>
              <div className="rounded-full overflow-hidden" style={{ height: 6, background: "var(--panel-border)" }}>
                <div style={{ width: `${donePct}%`, height: "100%", background: "var(--accent)", transition: "width .5s" }} />
              </div>
            </div>
          </div>
        </div>
      </Card>

      {groups.map((g) => {
        const groupTasks = tasks.filter((t) => periodOf(t.start) === g);
        if (groupTasks.length === 0) return null;
        const isCollapsed = collapsed[g];
        return (
          <Card key={g} className="p-4">
            <button
              onClick={() => setCollapsed((c) => ({ ...c, [g]: !c[g] }))}
              className="w-full flex items-center justify-between mb-2"
            >
              <span style={{ fontFamily: "Sora, sans-serif", fontWeight: 600, fontSize: 13, color: "var(--text-dim)" }}>
                {g} · {groupTasks.length}
              </span>
              {isCollapsed ? <ChevronDown size={16} color="var(--text-dim)" /> : <ChevronUp size={16} color="var(--text-dim)" />}
            </button>
            {!isCollapsed && (
              <div>
                {groupTasks.map((t) => (
                  <TaskRow
                    key={t.id}
                    task={t}
                    done={!!completions[t.id]?.done}
                    onToggle={toggleTask}
                    onEdit={editInline}
                    onDelete={deleteTask}
                    onDuplicate={duplicateTask}
                    timerSec={timers[t.id]}
                    onTimer={toggleTimer}
                    dragProps={{
                      draggable: true,
                      onDragStart: () => onDragStart(t.id),
                      onDragOver,
                      onDrop: () => onDrop(t.id),
                    }}
                  />
                ))}
              </div>
            )}
          </Card>
        );
      })}

      <Card className="p-5">
        <SectionLabel>End of day check-in</SectionLabel>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            ["mood", "Mood"],
            ["energy", "Energy"],
            ["focus", "Focus level"],
          ].map(([key, label]) => (
            <div key={key}>
              <div className="flex justify-between mb-1">
                <span style={{ fontSize: 12, color: "var(--text-dim)" }}>{label}</span>
                <span style={{ fontSize: 12, color: "var(--accent)" }}>{meta[key]}/5</span>
              </div>
              <input
                type="range"
                min={1}
                max={5}
                value={meta[key]}
                onChange={(e) => setMeta({ [key]: Number(e.target.value) })}
                className="w-full"
                style={{ accentColor: "var(--accent)" }}
              />
            </div>
          ))}
        </div>
        <div className="mt-4">
          <div className="flex justify-between mb-1">
            <span style={{ fontSize: 12, color: "var(--text-dim)" }}>Daily rating</span>
          </div>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((n) => (
              <button key={n} onClick={() => setMeta({ rating: n })}>
                <Star size={22} color={n <= meta.rating ? "var(--accent)" : "var(--panel-border)"} fill={n <= meta.rating ? "var(--accent)" : "none"} />
              </button>
            ))}
          </div>
        </div>
      </Card>

      <TaskEditModal task={editing} onClose={() => setEditing(null)} onSave={saveTask} onDelete={deleteTask} />
    </div>
  );
}

/* ============================== HABITS ============================== */

function HabitEditModal({ open, onClose, onSave, initial }) {
  const [draft, setDraft] = useState(initial);
  useEffect(() => setDraft(initial), [initial]);
  if (!open) return null;
  return (
    <Modal open={open} onClose={onClose}>
      <div className="flex items-center justify-between mb-4">
        <h3 style={{ fontFamily: "Sora, sans-serif", fontWeight: 700, fontSize: 16, color: "var(--text)" }}>
          {initial.id ? "Edit habit" : "New habit"}
        </h3>
        <button onClick={onClose}><X size={18} color="var(--text-dim)" /></button>
      </div>
      <div className="space-y-3">
        <div>
          <label style={{ fontSize: 11, color: "var(--text-dim)" }}>Name</label>
          <input
            value={draft.name}
            onChange={(e) => setDraft({ ...draft, name: e.target.value })}
            className="w-full mt-1 rounded-lg px-3 py-2 outline-none"
            style={{ background: "var(--panel)", border: "1px solid var(--panel-border)", color: "var(--text)", fontSize: 14 }}
          />
        </div>
        <div>
          <label style={{ fontSize: 11, color: "var(--text-dim)" }}>Category</label>
          <div className="flex flex-wrap gap-2 mt-1">
            {Object.keys(CATEGORIES).map((c) => (
              <button
                key={c}
                onClick={() => setDraft({ ...draft, category: c })}
                className="px-3 py-1.5 rounded-full flex items-center gap-1.5"
                style={{
                  background: draft.category === c ? CATEGORIES[c] + "22" : "var(--panel)",
                  border: `1px solid ${draft.category === c ? CATEGORIES[c] : "var(--panel-border)"}`,
                  fontSize: 12, color: "var(--text)",
                }}
              >
                <span className="rounded-full" style={{ width: 7, height: 7, background: CATEGORIES[c] }} />
                {c}
              </button>
            ))}
          </div>
        </div>
        <div>
          <label style={{ fontSize: 11, color: "var(--text-dim)" }}>Icon</label>
          <div className="flex flex-wrap gap-2 mt-1">
            {ICON_NAMES.map((name) => (
              <button
                key={name}
                onClick={() => setDraft({ ...draft, icon: name })}
                className="p-2 rounded-lg"
                style={{
                  background: draft.icon === name ? "var(--accent-soft)" : "var(--panel)",
                  border: `1px solid ${draft.icon === name ? "var(--accent)" : "var(--panel-border)"}`,
                }}
              >
                <IconOf name={name} size={15} style={{ color: "var(--text)" }} />
              </button>
            ))}
          </div>
        </div>
      </div>
      <div className="flex gap-2 mt-5">
        <button
          onClick={() => onSave(draft)}
          disabled={!draft.name?.trim()}
          className="flex-1 rounded-xl py-2.5 font-semibold"
          style={{ background: "var(--accent)", color: "#0B0E14", fontSize: 13, opacity: draft.name?.trim() ? 1 : 0.5 }}
        >
          Save habit
        </button>
      </div>
    </Modal>
  );
}

function HabitsPage({ habits, setHabits }) {
  const today = todayKey();
  const [modal, setModal] = useState(null);
  const [filter, setFilter] = useState("All");
  const active = habits.list.filter((h) => !h.archived);
  const todayC = habits.completions[today] || {};

  const toggle = (id) => {
    setHabits((h) => {
      const dayC = { ...(h.completions[today] || {}) };
      dayC[id] = !dayC[id];
      return { ...h, completions: { ...h.completions, [today]: dayC } };
    });
  };

  const saveHabit = (draft) => {
    setHabits((h) => {
      if (draft.id) {
        return { ...h, list: h.list.map((x) => (x.id === draft.id ? draft : x)) };
      }
      const id = `h${Date.now()}`;
      return { ...h, list: [...h.list, { ...draft, id, archived: false }] };
    });
    setModal(null);
  };
  const archiveHabit = (id) =>
    setHabits((h) => ({ ...h, list: h.list.map((x) => (x.id === id ? { ...x, archived: !x.archived } : x)) }));
  const deleteHabit = (id) => setHabits((h) => ({ ...h, list: h.list.filter((x) => x.id !== id) }));

  const streakFor = (id) => {
    const set = new Set();
    Object.entries(habits.completions).forEach(([date, obj]) => {
      if (obj[id]) set.add(date);
    });
    return { current: currentStreak(set), best: bestStreak(set) };
  };

  const categories = ["All", ...Object.keys(CATEGORIES)];
  const shown = active.filter((h) => filter === "All" || h.category === filter);

  const doneCount = active.filter((h) => todayC[h.id]).length;

  return (
    <div className="space-y-6">
      <Card className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div style={{ fontFamily: "Sora, sans-serif", fontWeight: 700, fontSize: 18, color: "var(--text)" }}>
            {doneCount}/{active.length} habits today
          </div>
          <div style={{ fontSize: 12, color: "var(--text-dim)" }}>Binary habits — separate from your schedule.</div>
        </div>
        <button
          onClick={() => setModal({ name: "", category: "Custom", icon: "Star" })}
          className="flex items-center gap-1.5 rounded-xl px-4 py-2.5 font-semibold"
          style={{ background: "var(--accent)", color: "#0B0E14", fontSize: 13 }}
        >
          <Plus size={15} /> New habit
        </button>
      </Card>

      <div className="flex gap-2 overflow-x-auto pb-1">
        {categories.map((c) => (
          <button
            key={c}
            onClick={() => setFilter(c)}
            className="px-3 py-1.5 rounded-full whitespace-nowrap"
            style={{
              background: filter === c ? "var(--accent-soft)" : "var(--panel)",
              border: `1px solid ${filter === c ? "var(--accent)" : "var(--panel-border)"}`,
              color: filter === c ? "var(--accent)" : "var(--text-dim)",
              fontSize: 12,
            }}
          >
            {c}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {shown.map((h) => {
          const s = streakFor(h.id);
          const done = !!todayC[h.id];
          return (
            <Card key={h.id} className="p-4 group relative">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => toggle(h.id)}
                  className="rounded-xl flex items-center justify-center shrink-0"
                  style={{
                    width: 40, height: 40,
                    background: done ? CATEGORIES[h.category] + "33" : "var(--panel)",
                    border: `1.5px solid ${done ? CATEGORIES[h.category] : "var(--panel-border)"}`,
                  }}
                >
                  {done ? <Check size={18} style={{ color: CATEGORIES[h.category] }} /> : <IconOf name={h.icon} size={17} style={{ color: "var(--text-dim)" }} />}
                </button>
                <div className="min-w-0 flex-1">
                  <div className="truncate" style={{ fontSize: 13.5, fontWeight: 500, color: "var(--text)" }}>{h.name}</div>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span style={{ fontSize: 10, color: CATEGORIES[h.category] }}>{h.category}</span>
                    <span className="flex items-center gap-0.5" style={{ fontSize: 10, color: "var(--text-dim)" }}>
                      <Flame size={10} /> {s.current} · best {s.best}
                    </span>
                  </div>
                </div>
                <div className="flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => setModal(h)}><Pencil size={13} color="var(--text-dim)" /></button>
                  <button onClick={() => archiveHabit(h.id)}><X size={13} color="var(--text-dim)" /></button>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {habits.list.some((h) => h.archived) && (
        <Card className="p-4">
          <SectionLabel>Archived</SectionLabel>
          <div className="flex flex-wrap gap-2">
            {habits.list.filter((h) => h.archived).map((h) => (
              <span key={h.id} className="flex items-center gap-2 px-3 py-1.5 rounded-full" style={{ background: "var(--panel)", fontSize: 12, color: "var(--text-dim)" }}>
                {h.name}
                <button onClick={() => archiveHabit(h.id)} style={{ color: "var(--accent)" }}>Restore</button>
                <button onClick={() => deleteHabit(h.id)}><Trash2 size={12} color="#EF4444" /></button>
              </span>
            ))}
          </div>
        </Card>
      )}

      <HabitEditModal open={!!modal} initial={modal || {}} onClose={() => setModal(null)} onSave={saveHabit} />
    </div>
  );
}

/* ============================== ANALYTICS ============================== */

function AnalyticsPage({ planner, habits }) {
  const days30 = lastNDays(30);
  const days90 = lastNDays(90);

  const dayTaskPct = (date) => {
    const tpl = planner.activeTemplate;
    const list = planner.tasks[tpl];
    const c = planner.completions[date] || {};
    const done = list.filter((t) => c[t.id]?.done).length;
    return pct(done, list.length);
  };
  const dayHabitPct = (date) => {
    const active = habits.list.filter((h) => !h.archived);
    const c = habits.completions[date] || {};
    const done = active.filter((h) => c[h.id]).length;
    return pct(done, active.length);
  };

  const rolling30 = days30.map((d) => Math.round((dayTaskPct(d) + dayHabitPct(d)) / 2));
  const avgCompletion = Math.round(rolling30.reduce((a, b) => a + b, 0) / (rolling30.length || 1));

  const weekdayTotals = Array(7).fill(0);
  const weekdayCounts = Array(7).fill(0);
  days90.forEach((d) => {
    const wd = new Date(d).getDay();
    weekdayTotals[wd] += Math.round((dayTaskPct(d) + dayHabitPct(d)) / 2);
    weekdayCounts[wd] += 1;
  });
  const weekdayAvg = weekdayTotals.map((t, i) => (weekdayCounts[i] ? Math.round(t / weekdayCounts[i]) : 0));
  const weekdayLabels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const bestWeekdayIdx = weekdayAvg.indexOf(Math.max(...weekdayAvg));
  const worstWeekdayIdx = weekdayAvg.indexOf(Math.min(...weekdayAvg.filter((_, i) => weekdayCounts[i] > 0)));

  const habitMissCounts = {};
  habits.list.filter((h) => !h.archived).forEach((h) => (habitMissCounts[h.id] = 0));
  days30.forEach((d) => {
    const c = habits.completions[d] || {};
    habits.list.filter((h) => !h.archived).forEach((h) => {
      if (!c[h.id]) habitMissCounts[h.id] = (habitMissCounts[h.id] || 0) + 1;
    });
  });
  const mostSkipped = Object.entries(habitMissCounts).sort((a, b) => b[1] - a[1])[0];
  const mostSkippedHabit = habits.list.find((h) => h.id === mostSkipped?.[0]);

  const categoryData = Object.keys(CATEGORIES)
    .map((cat) => {
      const catHabits = habits.list.filter((h) => !h.archived && h.category === cat);
      if (catHabits.length === 0) return null;
      let done = 0, total = 0;
      days30.forEach((d) => {
        const c = habits.completions[d] || {};
        catHabits.forEach((h) => {
          total += 1;
          if (c[h.id]) done += 1;
        });
      });
      return { name: cat, value: pct(done, total), color: CATEGORIES[cat] };
    })
    .filter(Boolean);

  const perfectDaysSet = new Set(days90.filter((d) => dayTaskPct(d) === 100));
  const perfectDaysCount = Array.from(perfectDaysSet).filter((d) => days30.includes(d)).length;
  const longestStreak = bestStreak(new Set(days90.filter((d) => (dayTaskPct(d) + dayHabitPct(d)) / 2 >= 80)));

  const monthlyMap = {};
  days90.forEach((d) => {
    const key = d.slice(0, 7);
    if (!monthlyMap[key]) monthlyMap[key] = [];
    monthlyMap[key].push((dayTaskPct(d) + dayHabitPct(d)) / 2);
  });
  const monthlyComparison = Object.entries(monthlyMap).map(([k, arr]) => ({
    label: k.slice(5),
    value: Math.round(arr.reduce((a, b) => a + b, 0) / arr.length),
  }));
  const mostProductiveMonth = monthlyComparison.reduce(
    (best, cur) => (cur.value > (best?.value ?? -1) ? cur : best),
    null
  );

  const rollingSeries = days30.map((d, i) => ({ label: d.slice(5), value: rolling30[i] }));

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Stat icon={Gauge} label="Average completion" value={`${avgCompletion}%`} color="#E8A33D" />
        <Stat icon={Sparkles} label="Perfect days (30d)" value={perfectDaysCount} color="#2DD4BF" />
        <Stat icon={Trophy} label="Longest streak" value={longestStreak} color="#A78BFA" />
        <Stat icon={TrendingUp} label="Most productive" value={mostProductiveMonth?.label || "—"} color="#38BDF8" />
      </div>

      <Card className="p-5">
        <SectionLabel>Rolling 30-day completion</SectionLabel>
        <div style={{ width: "100%", height: 180 }}>
          <ResponsiveContainer>
            <LineChart data={rollingSeries}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--panel-border)" vertical={false} />
              <XAxis dataKey="label" tick={{ fill: "var(--text-dim)", fontSize: 10 }} axisLine={false} tickLine={false} interval={4} />
              <YAxis hide domain={[0, 100]} />
              <Tooltip contentStyle={{ background: "var(--bg-elevated)", border: "1px solid var(--panel-border)", borderRadius: 8, fontSize: 12 }} />
              <Line type="monotone" dataKey="value" stroke="var(--accent)" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card className="p-5">
          <SectionLabel>Completion by weekday</SectionLabel>
          <div style={{ width: "100%", height: 200 }}>
            <ResponsiveContainer>
              <BarChart data={weekdayLabels.map((l, i) => ({ label: l, value: weekdayAvg[i] }))}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--panel-border)" vertical={false} />
                <XAxis dataKey="label" tick={{ fill: "var(--text-dim)", fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis hide domain={[0, 100]} />
                <Tooltip contentStyle={{ background: "var(--bg-elevated)", border: "1px solid var(--panel-border)", borderRadius: 8, fontSize: 12 }} />
                <Bar dataKey="value" radius={[6, 6, 0, 0]} fill="var(--accent-2, #2DD4BF)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-between mt-2" style={{ fontSize: 11, color: "var(--text-dim)" }}>
            <span>Best day: <b style={{ color: "var(--text)" }}>{weekdayLabels[bestWeekdayIdx]}</b></span>
            <span>Worst day: <b style={{ color: "var(--text)" }}>{weekdayLabels[worstWeekdayIdx]}</b></span>
          </div>
        </Card>

        <Card className="p-5">
          <SectionLabel>Completion by category (30d)</SectionLabel>
          <div style={{ width: "100%", height: 200 }} className="flex items-center">
            <ResponsiveContainer>
              <PieChart>
                <Pie data={categoryData} dataKey="value" nameKey="name" innerRadius={45} outerRadius={75} paddingAngle={3}>
                  {categoryData.map((c, i) => (
                    <Cell key={i} fill={c.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ background: "var(--bg-elevated)", border: "1px solid var(--panel-border)", borderRadius: 8, fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      <Card className="p-5">
        <SectionLabel>Monthly comparison</SectionLabel>
        <div style={{ width: "100%", height: 160 }}>
          <ResponsiveContainer>
            <BarChart data={monthlyComparison}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--panel-border)" vertical={false} />
              <XAxis dataKey="label" tick={{ fill: "var(--text-dim)", fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis hide domain={[0, 100]} />
              <Tooltip contentStyle={{ background: "var(--bg-elevated)", border: "1px solid var(--panel-border)", borderRadius: 8, fontSize: 12 }} />
              <Bar dataKey="value" radius={[6, 6, 0, 0]} fill="#A78BFA" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {mostSkippedHabit && (
        <Card className="p-5 flex items-center gap-3">
          <AlertTriangle size={20} color="#EF4444" />
          <div>
            <div style={{ fontSize: 13, color: "var(--text)" }}>
              Most skipped habit: <b>{mostSkippedHabit.name}</b>
            </div>
            <div style={{ fontSize: 11, color: "var(--text-dim)" }}>Missed {mostSkipped[1]} of the last 30 days</div>
          </div>
        </Card>
      )}
    </div>
  );
}

/* ============================== JOURNAL ============================== */

function JournalPage({ journal, setJournal }) {
  const today = todayKey();
  const entry = journal.entries[today] || {};
  const [viewing, setViewing] = useState(null);

  const setField = (key, val) =>
    setJournal((j) => ({ ...j, entries: { ...j.entries, [today]: { ...entry, [key]: val } } }));

  const past = Object.entries(journal.entries)
    .filter(([d]) => d !== today)
    .sort((a, b) => (a[0] < b[0] ? 1 : -1))
    .slice(0, 20);

  return (
    <div className="space-y-6">
      <Card className="p-5">
        <SectionLabel>Today's reflection · {today}</SectionLabel>
        <div className="space-y-4">
          {JOURNAL_PROMPTS.map(([key, label]) => (
            <div key={key}>
              <label style={{ fontSize: 12.5, color: "var(--text-dim)" }}>{label}</label>
              <textarea
                value={entry[key] || ""}
                onChange={(e) => setField(key, e.target.value)}
                rows={key === "lesson" ? 2 : 3}
                placeholder="Write freely…"
                className="w-full mt-1 rounded-xl px-3 py-2.5 outline-none resize-none"
                style={{ background: "var(--panel)", border: "1px solid var(--panel-border)", color: "var(--text)", fontSize: 13.5, lineHeight: 1.5 }}
              />
            </div>
          ))}
        </div>
      </Card>

      <Card className="p-5">
        <SectionLabel>Past entries</SectionLabel>
        {past.length === 0 ? (
          <div style={{ fontSize: 13, color: "var(--text-dim)" }}>Your reflections will appear here.</div>
        ) : (
          <div className="space-y-2">
            {past.map(([d, e]) => (
              <button
                key={d}
                onClick={() => setViewing(viewing === d ? null : d)}
                className="w-full text-left rounded-xl px-3 py-2.5"
                style={{ background: "var(--panel)", border: "1px solid var(--panel-border)" }}
              >
                <div className="flex items-center justify-between">
                  <span style={{ fontSize: 12.5, color: "var(--text)", fontWeight: 500 }}>{d}</span>
                  {viewing === d ? <ChevronUp size={14} color="var(--text-dim)" /> : <ChevronDown size={14} color="var(--text-dim)" />}
                </div>
                {viewing === d && (
                  <div className="mt-2 space-y-2">
                    {JOURNAL_PROMPTS.map(([key, label]) =>
                      e[key] ? (
                        <div key={key}>
                          <div style={{ fontSize: 10, color: "var(--text-dim)" }}>{label}</div>
                          <div style={{ fontSize: 12.5, color: "var(--text)" }}>{e[key]}</div>
                        </div>
                      ) : null
                    )}
                  </div>
                )}
              </button>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}

/* ============================== EMERGENCY MODE ============================== */

function EmergencyMode({ open, onClose, emergency, setEmergency }) {
  const [seconds, setSeconds] = useState(90);
  const [running, setRunning] = useState(false);
  const [breathPhase, setBreathPhase] = useState("in");
  const [trigger, setTrigger] = useState("");
  const [intensity, setIntensity] = useState(5);
  const [resolvedMsg, setResolvedMsg] = useState("");

  useEffect(() => {
    if (!open) {
      setSeconds(90);
      setRunning(false);
      setResolvedMsg("");
      return;
    }
  }, [open]);

  useEffect(() => {
    if (!running) return;
    const iv = setInterval(() => setSeconds((s) => (s > 0 ? s - 1 : 0)), 1000);
    return () => clearInterval(iv);
  }, [running]);

  useEffect(() => {
    if (!open) return;
    const iv = setInterval(() => {
      setBreathPhase((p) => (p === "in" ? "out" : "in"));
    }, 4000);
    return () => clearInterval(iv);
  }, [open]);

  const daysClean = useMemo(() => {
    const start = new Date(emergency.cleanStartDate);
    const diff = Math.floor((new Date() - start) / 86400000);
    return Math.max(0, diff);
  }, [emergency.cleanStartDate, open]);

  const resist = () => {
    setEmergency((e) => ({
      ...e,
      urgesResisted: e.urgesResisted + 1,
      log: [...e.log, { date: new Date().toISOString(), trigger, intensity, outcome: "resisted" }],
    }));
    setResolvedMsg("Logged. You resisted — that's the rep that builds the muscle.");
    setTrigger("");
  };
  const relapse = () => {
    setEmergency((e) => ({
      ...e,
      relapses: e.relapses + 1,
      cleanStartDate: todayKey(),
      log: [...e.log, { date: new Date().toISOString(), trigger, intensity, outcome: "relapse" }],
    }));
    setResolvedMsg("Logged honestly. The streak resets, not the progress. Begin again now.");
    setTrigger("");
  };

  if (!open) return null;

  return (
    <Modal open={open} onClose={onClose} maxWidth={640}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <ShieldAlert size={20} color="#EF4444" />
          <h3 style={{ fontFamily: "Sora, sans-serif", fontWeight: 700, fontSize: 17, color: "var(--text)" }}>Emergency Mode</h3>
        </div>
        <button onClick={onClose}><X size={18} color="var(--text-dim)" /></button>
      </div>

      <div className="grid grid-cols-3 gap-2 mb-4">
        <Card className="p-3 text-center"><div style={{ fontFamily: "JetBrains Mono, monospace", fontSize: 20, fontWeight: 700, color: "#34D399" }}>{daysClean}</div><div style={{ fontSize: 10, color: "var(--text-dim)" }}>Days clean</div></Card>
        <Card className="p-3 text-center"><div style={{ fontFamily: "JetBrains Mono, monospace", fontSize: 20, fontWeight: 700, color: "var(--accent)" }}>{emergency.urgesResisted}</div><div style={{ fontSize: 10, color: "var(--text-dim)" }}>Urges resisted</div></Card>
        <Card className="p-3 text-center"><div style={{ fontFamily: "JetBrains Mono, monospace", fontSize: 20, fontWeight: 700, color: "#EF4444" }}>{emergency.relapses}</div><div style={{ fontSize: 10, color: "var(--text-dim)" }}>Relapses</div></Card>
      </div>

      <Card className="p-5 flex flex-col items-center mb-4">
        <div
          className="rounded-full flex items-center justify-center mb-3"
          style={{
            width: 90, height: 90,
            background: "var(--accent-soft)",
            border: "2px solid var(--accent)",
            transform: breathPhase === "in" ? "scale(1.15)" : "scale(0.85)",
            transition: "transform 4s ease-in-out",
          }}
        >
          <Wind size={26} color="var(--accent)" />
        </div>
        <div style={{ fontSize: 13, color: "var(--text-dim)" }}>{breathPhase === "in" ? "Breathe in…" : "Breathe out…"}</div>

        <div className="flex items-center gap-3 mt-4">
          <span style={{ fontFamily: "JetBrains Mono, monospace", fontSize: 28, fontWeight: 700, color: "var(--text)" }}>{fmtTimer(seconds)}</span>
          <button onClick={() => setRunning((r) => !r)} className="p-2 rounded-lg" style={{ background: "var(--panel)" }}>
            {running ? <Pause size={16} color="var(--text)" /> : <Play size={16} color="var(--text)" />}
          </button>
          <button onClick={() => setSeconds(90)} className="p-2 rounded-lg" style={{ background: "var(--panel)" }}>
            <RotateCcw size={16} color="var(--text)" />
          </button>
        </div>
        <div style={{ fontSize: 11, color: "var(--text-dim)" }} className="mt-1">90-second urge timer — urges peak and pass</div>
      </Card>

      <div className="space-y-2 mb-4">
        <SectionLabel>Why you're quitting</SectionLabel>
        {EMERGENCY_REASONS.map((r, i) => (
          <div key={i} className="flex items-start gap-2">
            <Target size={13} color="var(--accent)" className="mt-0.5 shrink-0" />
            <span style={{ fontSize: 13, color: "var(--text)" }}>{r}</span>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-2 mb-4">
        <Card className="p-3 flex items-center gap-2"><Snowflake size={15} color="#38BDF8" /><span style={{ fontSize: 12, color: "var(--text)" }}>Take a cold shower</span></Card>
        <Card className="p-3 flex items-center gap-2"><Trees size={15} color="#34D399" /><span style={{ fontSize: 12, color: "var(--text)" }}>Go outside now</span></Card>
        <Card className="p-3 flex items-center gap-2"><Dumbbell size={15} color="#FB923C" /><span style={{ fontSize: 12, color: "var(--text)" }}>20 push-ups</span></Card>
        <Card className="p-3 flex items-center gap-2"><Footprints size={15} color="#A78BFA" /><span style={{ fontSize: 12, color: "var(--text)" }}>Walk it off</span></Card>
      </div>

      <Card className="p-4 mb-4">
        <SectionLabel>What triggered this urge?</SectionLabel>
        <textarea
          value={trigger}
          onChange={(e) => setTrigger(e.target.value)}
          rows={2}
          placeholder="Boredom, stress, a scroll, loneliness…"
          className="w-full rounded-lg px-3 py-2 outline-none resize-none"
          style={{ background: "var(--panel)", border: "1px solid var(--panel-border)", color: "var(--text)", fontSize: 13 }}
        />
        <div className="mt-3">
          <div className="flex justify-between mb-1">
            <span style={{ fontSize: 11, color: "var(--text-dim)" }}>Urge intensity</span>
            <span style={{ fontSize: 11, color: "var(--accent)" }}>{intensity}/10</span>
          </div>
          <input type="range" min={1} max={10} value={intensity} onChange={(e) => setIntensity(Number(e.target.value))} className="w-full" style={{ accentColor: "var(--accent)" }} />
        </div>
      </Card>

      {resolvedMsg && (
        <div className="mb-3 text-center" style={{ fontSize: 12.5, color: "var(--accent)" }}>{resolvedMsg}</div>
      )}

      <div className="flex gap-2">
        <button onClick={relapse} className="flex-1 rounded-xl py-3 font-medium" style={{ background: "rgba(239,68,68,0.1)", color: "#EF4444", fontSize: 13 }}>
          I relapsed
        </button>
        <button onClick={resist} className="flex-1 rounded-xl py-3 font-bold" style={{ background: "var(--accent)", color: "#0B0E14", fontSize: 14 }}>
          I resisted
        </button>
      </div>
    </Modal>
  );
}

/* ============================== SETTINGS ============================== */

function SettingsPage({ settings, setSettings, exportAll, importAll }) {
  const fileRef = useRef(null);
  return (
    <div className="space-y-6 max-w-2xl">
      <Card className="p-5">
        <SectionLabel>Appearance</SectionLabel>
        <div className="flex items-center justify-between py-2">
          <span style={{ fontSize: 13, color: "var(--text)" }}>Dark mode</span>
          <Toggle checked={settings.theme === "dark"} onChange={(v) => setSettings((s) => ({ ...s, theme: v ? "dark" : "light" }))} />
        </div>
        <div className="py-2">
          <span style={{ fontSize: 13, color: "var(--text)" }}>Accent color</span>
          <div className="flex gap-2 mt-2">
            {Object.entries(ACCENTS).map(([key, a]) => (
              <button
                key={key}
                onClick={() => setSettings((s) => ({ ...s, accent: key }))}
                className="rounded-full flex items-center justify-center"
                style={{
                  width: 32, height: 32, background: a.hex,
                  border: settings.accent === key ? "2px solid var(--text)" : "2px solid transparent",
                }}
              >
                {settings.accent === key && <Check size={14} color="#0B0E14" />}
              </button>
            ))}
          </div>
        </div>
        <div className="flex items-center justify-between py-2">
          <span style={{ fontSize: 13, color: "var(--text)" }}>Animations</span>
          <Toggle checked={settings.animations} onChange={(v) => setSettings((s) => ({ ...s, animations: v }))} />
        </div>
      </Card>

      <Card className="p-5">
        <SectionLabel>Reminders</SectionLabel>
        <div className="space-y-2">
          {settings.reminderTimes.map((t, i) => (
            <div key={i} className="flex items-center justify-between rounded-lg px-3 py-2" style={{ background: "var(--panel)" }}>
              <span className="flex items-center gap-2" style={{ fontSize: 13, color: "var(--text)" }}>
                <Bell size={13} color="var(--accent)" /> {t}
              </span>
              <button
                onClick={() => setSettings((s) => ({ ...s, reminderTimes: s.reminderTimes.filter((_, idx) => idx !== i) }))}
              >
                <X size={14} color="var(--text-dim)" />
              </button>
            </div>
          ))}
        </div>
        <div className="flex gap-2 mt-3">
          <input
            type="time"
            id="mom-reminder-input"
            className="flex-1 rounded-lg px-3 py-2 outline-none"
            style={{ background: "var(--panel)", border: "1px solid var(--panel-border)", color: "var(--text)", fontSize: 13 }}
          />
          <button
            onClick={() => {
              const el = document.getElementById("mom-reminder-input");
              if (el && el.value) {
                setSettings((s) => ({ ...s, reminderTimes: [...s.reminderTimes, el.value].sort() }));
                el.value = "";
              }
            }}
            className="rounded-lg px-3 py-2 font-medium"
            style={{ background: "var(--accent)", color: "#0B0E14", fontSize: 13 }}
          >
            Add
          </button>
        </div>
      </Card>

      <Card className="p-5">
        <SectionLabel>Data</SectionLabel>
        <div className="flex gap-2">
          <button onClick={exportAll} className="flex-1 flex items-center justify-center gap-2 rounded-xl py-2.5" style={{ background: "var(--panel)", border: "1px solid var(--panel-border)", color: "var(--text)", fontSize: 13 }}>
            <FileDown size={15} /> Export data
          </button>
          <button onClick={() => fileRef.current?.click()} className="flex-1 flex items-center justify-center gap-2 rounded-xl py-2.5" style={{ background: "var(--panel)", border: "1px solid var(--panel-border)", color: "var(--text)", fontSize: 13 }}>
            <FileUp size={15} /> Import data
          </button>
          <input
            ref={fileRef}
            type="file"
            accept="application/json"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) {
                const reader = new FileReader();
                reader.onload = () => importAll(reader.result);
                reader.readAsText(f);
              }
            }}
          />
        </div>
      </Card>
    </div>
  );
}

/* ============================== APP ============================== */

const DEFAULT_PLANNER = {
  activeTemplate: "normal",
  tasks: { normal: NORMAL_TASKS, running: RUNNING_TASKS },
  completions: {},
  dayMeta: {},
};
const DEFAULT_HABITS_STATE = { list: DEFAULT_HABITS, completions: {} };
const DEFAULT_JOURNAL = { entries: {} };
const DEFAULT_EMERGENCY = { urgesResisted: 0, relapses: 0, cleanStartDate: todayKey(), log: [] };
const DEFAULT_SETTINGS = { theme: "dark", accent: "gold", animations: true, reminderTimes: ["07:30", "21:30"] };

export default function App() {
const [plannerRaw, setPlanner, plannerLoaded] = useSupabaseState("planner", DEFAULT_PLANNER);
const [habitsRaw, setHabits, habitsLoaded] = useSupabaseState("habits", DEFAULT_HABITS_STATE);
const [journalRaw, setJournal, journalLoaded] = useSupabaseState("journal", DEFAULT_JOURNAL);
const [emergencyRaw, setEmergency, emergencyLoaded] = useSupabaseState("emergency", DEFAULT_EMERGENCY);
const [settingsRaw, setSettings, settingsLoaded] = useSupabaseState("settings", DEFAULT_SETTINGS);

// Bezbedne verzije (sprečava greške kad je baza prazna)
const planner = { ...DEFAULT_PLANNER, ...(plannerRaw || {}) };
const habits = { ...DEFAULT_HABITS_STATE, ...(habitsRaw || {}) };
const journal = { ...DEFAULT_JOURNAL, ...(journalRaw || {}) };
const emergency = { ...DEFAULT_EMERGENCY, ...(emergencyRaw || {}) };
const settings = { ...DEFAULT_SETTINGS, ...(settingsRaw || {}) };

  const [page, setPage] = useState("dashboard");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [emergencyOpen, setEmergencyOpen] = useState(false);
  const [confetti, setConfetti] = useState(false);
  const [perfectBadge, setPerfectBadge] = useState(false);
  const [quote] = useState(QUOTES[Math.floor(Math.random() * QUOTES.length)]);

  const allLoaded = plannerLoaded && habitsLoaded && journalLoaded && emergencyLoaded && settingsLoaded;

  const triggerPerfectDay = useCallback(() => {
    setConfetti(true);
    setPerfectBadge(true);
    setTimeout(() => setConfetti(false), 3200);
    setTimeout(() => setPerfectBadge(false), 4200);
  }, []);

  const exportAll = async () => {
    const payload = { planner, habits, journal, emergency, settings, exportedAt: new Date().toISOString() };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `momentum-backup-${todayKey()}.json`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };
  const importAll = (text) => {
    try {
      const data = JSON.parse(text);
      if (data.planner) setPlanner(data.planner);
      if (data.habits) setHabits(data.habits);
      if (data.journal) setJournal(data.journal);
      if (data.emergency) setEmergency(data.emergency);
      if (data.settings) setSettings(data.settings);
    } catch (e) {
      console.error("Momentum: invalid import file", e);
    }
  };

  /* ---- derived data ---- */
  const today = todayKey();
  const dashboardData = useMemo(() => {
    const tpl = planner.activeTemplate;
    const list = planner.tasks[tpl];
    const todayCompletions = planner.completions[today] || {};
    const doneToday = list.filter((t) => todayCompletions[t.id]?.done).length;
    const taskPct = pct(doneToday, list.length);
    const remainingTasks = list.filter((t) => !todayCompletions[t.id]?.done);
    const upcomingTasks = remainingTasks;

    const activeHabits = habits.list.filter((h) => !h.archived);
    const todayHabitC = habits.completions[today] || {};
    const doneHabits = activeHabits.filter((h) => todayHabitC[h.id]).length;
    const habitPct = pct(doneHabits, activeHabits.length);

    const dayTaskPctFn = (d) => {
      const c = planner.completions[d] || {};
      const done = list.filter((t) => c[t.id]?.done).length;
      return pct(done, list.length);
    };
    const dayHabitPctFn = (d) => {
      const c = habits.completions[d] || {};
      const done = activeHabits.filter((h) => c[h.id]).length;
      return pct(done, activeHabits.length);
    };

    const engagedDates = new Set(
      Object.keys(planner.completions).filter((d) =>
        Object.values(planner.completions[d]).some((v) => v?.done)
      )
    );
    const perfectDates = new Set(
      Object.keys(planner.completions).filter((d) => dayTaskPctFn(d) === 100)
    );
    const allHabitDates = new Set(
      Object.keys(habits.completions).filter((d) => dayHabitPctFn(d) === 100 && activeHabits.length > 0)
    );

    const dayStreak = currentStreak(engagedDates);
    const perfectStreak = currentStreak(perfectDates);
    const habitStreak = currentStreak(allHabitDates);

    const days30 = lastNDays(30);
    const consistency30 = pct(
      days30.filter((d) => dayTaskPctFn(d) > 0 || dayHabitPctFn(d) > 0).length,
      30
    );
    const discipline = Math.round(
      taskPct * 0.3 + habitPct * 0.3 + Math.min(perfectStreak / 30, 1) * 100 * 0.2 + consistency30 * 0.2
    );

    const dayScores = {};
    lastNDays(91).forEach((d) => {
      dayScores[d] = Math.round((dayTaskPctFn(d) + dayHabitPctFn(d)) / 2);
    });

    const weekSeries = lastNDays(7).map((d) => ({
      label: new Date(d).toLocaleDateString(undefined, { weekday: "short" }),
      value: Math.round((dayTaskPctFn(d) + dayHabitPctFn(d)) / 2),
    }));
    const monthSeries = lastNDays(30).map((d) => ({
      label: d.slice(5),
      value: Math.round((dayTaskPctFn(d) + dayHabitPctFn(d)) / 2),
    }));

    const monthDates = lastNDays(30);
    const monthPct = Math.round(
      monthDates.reduce((sum, d) => sum + (dayTaskPctFn(d) + dayHabitPctFn(d)) / 2, 0) / monthDates.length
    );

    const journalDates = Object.keys(journal?.entries || {}).sort().reverse();
    const recentJournal = journalDates.length
      ? {
          date: journalDates[0],
          text: Object.values(journal.entries[journalDates[0]] || {}).filter(Boolean).join(" · "),
        }
      : null;

    return {
      taskPct, habitPct, dayStreak, habitStreak, perfectStreak, discipline,
      dayScores, weekSeries, monthSeries, remainingTasks, upcomingTasks, monthPct, recentJournal,
    };
  }, [planner, habits, journal, today]);

  const accent = ACCENTS[settings.accent] || ACCENTS.gold;

  if (!allLoaded) {
    return (
      <div className="w-full h-full flex items-center justify-center" style={{ background: "#0B0E14", minHeight: 480 }}>
        <div className="flex flex-col items-center gap-3">
          <div className="rounded-2xl flex items-center justify-center animate-pulse" style={{ width: 48, height: 48, background: "#E8A33D" }}>
            <Zap size={24} color="#0B0E14" />
          </div>
          <span style={{ color: "#8B93A7", fontSize: 13, fontFamily: "sans-serif" }}>Loading Momentum…</span>
        </div>
      </div>
    );
  }

  return (
    <div
      data-theme={settings.theme}
      className="w-full flex"
      style={{
        minHeight: 640,
        height: "100%",
        background: "var(--bg)",
        color: "var(--text)",
        fontFamily: "Inter, sans-serif",
        "--accent": accent.hex,
        "--accent-soft": accent.soft,
        "--accent-2": "#2DD4BF",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@500;600;700;800&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@500;700&display=swap');
        [data-theme="dark"] {
          --bg: #0B0E14; --bg-elevated: #10141C; --bg-translucent: rgba(11,14,20,0.75);
          --panel: rgba(255,255,255,0.035); --panel-border: rgba(255,255,255,0.08);
          --text: #E7E9EE; --text-dim: #8B93A7;
        }
        [data-theme="light"] {
          --bg: #F3F4F7; --bg-elevated: #FFFFFF; --bg-translucent: rgba(243,244,247,0.75);
          --panel: rgba(0,0,0,0.03); --panel-border: rgba(0,0,0,0.08);
          --text: #14161C; --text-dim: #6B7280;
        }
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 8px; height: 8px; }
        ::-webkit-scrollbar-thumb { background: var(--panel-border); border-radius: 8px; }
        input[type="range"] { height: 4px; border-radius: 4px; }
        @keyframes momentum-fall {
          to { transform: translateY(110vh) rotate(400deg); opacity: 0.2; }
        }
        @keyframes momentum-pop {
          0% { transform: scale(0.7); opacity: 0; }
          60% { transform: scale(1.05); opacity: 1; }
          100% { transform: scale(1); opacity: 1; }
        }
        .momentum-badge { animation: momentum-pop 0.5s cubic-bezier(.34,1.56,.64,1); }
        ${settings.animations ? "" : "* { animation: none !important; transition: none !important; }"}
      `}</style>

      <Sidebar page={page} setPage={setPage} mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} disciplineScore={dashboardData.discipline} />

      <div className="flex-1 min-w-0 flex flex-col pb-16 md:pb-0">
        <TopBar
          setMobileOpen={setMobileOpen}
          onEmergency={() => setEmergencyOpen(true)}
          dayStreak={dashboardData.dayStreak}
          theme={settings.theme}
          setTheme={(t) => setSettings((s) => ({ ...s, theme: t }))}
        />
        <div className="flex-1 px-4 md:px-8 py-6">
          {page === "dashboard" && <DashboardPage data={dashboardData} quote={quote} setPage={setPage} />}
          {page === "plan" && <PlannerPage planner={planner} setPlanner={setPlanner} onPerfectDay={triggerPerfectDay} />}
          {page === "habits" && <HabitsPage habits={habits} setHabits={setHabits} />}
          {page === "analytics" && <AnalyticsPage planner={planner} habits={habits} />}
          {page === "journal" && <JournalPage journal={journal} setJournal={setJournal} />}
          {page === "settings" && (
            <SettingsPage settings={settings} setSettings={setSettings} exportAll={exportAll} importAll={importAll} />
          )}
        </div>
      </div>

      <EmergencyMode open={emergencyOpen} onClose={() => setEmergencyOpen(false)} emergency={emergency} setEmergency={setEmergency} />
      <Confetti show={confetti && settings.animations} />

      {perfectBadge && (
        <div className="fixed bottom-20 md:bottom-8 left-1/2 -translate-x-1/2 z-[80] momentum-badge">
          <div
            className="flex items-center gap-3 rounded-2xl px-5 py-3.5"
            style={{ background: "var(--bg-elevated)", border: "1px solid var(--accent)", boxShadow: "0 10px 40px rgba(0,0,0,0.4)" }}
          >
            <Trophy size={22} color="var(--accent)" />
            <div>
              <div style={{ fontFamily: "Sora, sans-serif", fontWeight: 700, fontSize: 14, color: "var(--text)" }}>Perfect Day badge earned</div>
              <div style={{ fontSize: 12, color: "var(--text-dim)" }}>You completed another perfect day.</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}