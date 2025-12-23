// src/App.jsx
import { useState } from "react";
import axios from "axios";
import { FaGithub, FaLinkedin, FaGlobe } from "react-icons/fa";
import { MdEmail, MdPhone, MdLocationOn } from "react-icons/md";


function App() {
  // Basic fields (empty so user fills them)
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [location, setLocation] = useState("");

  // Links
  const [github, setGithub] = useState("");
  const [linkedin, setLinkedin] = useState("");
  const [portfolio, setPortfolio] = useState("");

  const [summary, setSummary] = useState("");
  const [skillsTech, setSkillsTech] = useState("");
  const [skillsSoft, setSkillsSoft] = useState("");
  const [achievements, setAchievements] = useState("");
  const [certifications, setCertifications] = useState("");

  const [aiLoading, setAiLoading] = useState(false);

  // THEMES / TEMPLATES
  const [theme, setTheme] = useState("warm");
  const themes = {
    warm: {
      id: "warm",
      label: "Warm Amber",
      card: "bg-white text-slate-900",
      nameColor: "text-[#1f1b2a]",
      // full gradient class string (Tailwind must see these exact strings in source)
      accentClass:
        "bg-gradient-to-r from-amber-400 via-orange-500 to-rose-400",
      sectionHeading: "text-amber-700",
      pillBg: "bg-amber-50",
    },
    classic: {
      id: "classic",
      label: "Classic Blue",
      card: "bg-white text-slate-900",
      nameColor: "text-slate-900",
      accentClass: "bg-gradient-to-r from-sky-400 via-sky-600 to-blue-700",
      sectionHeading: "text-sky-700",
      pillBg: "bg-sky-50",
    },
    minimal: {
      id: "minimal",
      label: "Minimal Gray",
      card: "bg-white text-slate-900",
      nameColor: "text-slate-900",
      accentClass:
        "bg-gradient-to-r from-slate-300 via-slate-400 to-slate-500",
      sectionHeading: "text-slate-700",
      pillBg: "bg-slate-100",
    },
  };
  const currentTheme = themes[theme];

  // Experience / Projects
  const [experiences, setExperiences] = useState([
    { id: Date.now(), title: "", company: "", duration: "", description: "" },
  ]);
  const [projects, setProjects] = useState([
    { id: Date.now() + 1, name: "", description: "" },
  ]);

  // AI call helper (generic)
  async function callAI(sectionName, text) {
    try {
      if (!text || text.trim().length === 0) {
        alert(`Please write something for ${sectionName} first 🙂`);
        return null;
      }
      setAiLoading(true);
      const res = await axios.post("http://localhost:5000/api/suggest", {
        section: sectionName,
        text,
      });
      return res.data?.suggestion?.trim() ?? null;
    } catch (err) {
      console.error(err);
      alert("AI request failed. Check if backend is running and CORS is configured.");
      return null;
    } finally {
      setAiLoading(false);
    }
  }

  // AI handlers
  async function handleAISummary() {
    const suggestion = await callAI("summary", summary);
    if (suggestion) setSummary(suggestion);
  }

  // refine both technical + soft sequentially
  async function handleAISkills() {
    setAiLoading(true);
    try {
      const tech = await callAI("technical_skills", skillsTech);
      if (tech) setSkillsTech(tech);
      const soft = await callAI("soft_skills", skillsSoft);
      if (soft) setSkillsSoft(soft);
    } finally {
      setAiLoading(false);
    }
  }

  async function handleAIExperience(index) {
    const cur = experiences[index];
    const suggestion = await callAI("experience", cur.description || cur.title || "");
    if (suggestion) updateExperience(index, "description", suggestion);
  }

  async function handleAIProject(index) {
    const cur = projects[index];
    const suggestion = await callAI("project", cur.description || cur.name || "");
    if (suggestion) updateProject(index, "description", suggestion);
  }

  // Print (PDF)
  function handlePrint() {
    window.print();
  }

  // Experience handlers
  const updateExperience = (index, field, value) =>
    setExperiences((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: value };
      return copy;
    });
  const addExperience = () =>
    setExperiences((prev) => [
      ...prev,
      { id: Date.now(), title: "", company: "", duration: "", description: "" },
    ]);
  const removeExperience = (index) =>
    setExperiences((prev) => prev.filter((_, i) => i !== index));

  // Project handlers
  const updateProject = (index, field, value) =>
    setProjects((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: value };
      return copy;
    });
  const addProject = () =>
    setProjects((prev) => [
      ...prev,
      { id: Date.now(), name: "", description: "" },
    ]);
  const removeProject = (index) =>
    setProjects((prev) => prev.filter((_, i) => i !== index));

  // Skill tags for preview (split by commas)
  const techTags = skillsTech
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  const softTags = skillsSoft
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#050308] via-black to-[#140b06] text-slate-50 print:bg-white print:text-slate-900">
      {/* Top nav */}
      <nav className="sticky top-0 z-20 border-b border-[#231318] bg-black/80 backdrop-blur print:hidden">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl bg-gradient-to-br from-amber-400 via-orange-500 to-rose-500 flex items-center justify-center shadow-[0_0_20px_rgba(248,181,71,0.9)]">
              <span>📄</span>
            </div>
            <div className="leading-tight">
              <p className="font-semibold text-[15px]">ResumeAI</p>
              <p className="text-[11px] text-amber-100/80">Smart Resume Builder</p>
            </div>
          </div>
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-amber-400 via-orange-500 to-rose-500 px-4 py-2 text-xs md:text-sm font-semibold text-black shadow-[0_0_24px_rgba(248,181,71,0.95)] hover:shadow-[0_0_34px_rgba(248,181,71,1)] transition print:hidden"
          >
            ⚡ AI Resume Project
          </button>
        </div>
      </nav>

      {/* Hero */}
      <header className="max-w-6xl mx-auto px-4 pt-6 pb-3 text-center print:hidden">
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight">
          Build Your Perfect Resume
        </h1>
        <p className="mt-2 text-sm md:text-base text-slate-300">
          Fill your details on the left, watch your resume update live on the right.{" "}
          <span className="text-amber-400 font-semibold">AI can polish your content.</span>
        </p>
      </header>

      {/* Main */}
      <main className="max-w-6xl mx-auto px-4 pb-10 grid lg:grid-cols-[1.2fr,1fr] gap-6">
        {/* LEFT FORM */}
        <section className="space-y-5 print:hidden">
          {/* Personal Information */}
          <div className="rounded-3xl bg-[#0c0b10] border border-[#2c222b] px-5 py-5 shadow-[0_24px_50px_rgba(0,0,0,0.65)]">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-sm font-bold text-black">
                  1
                </div>
                <h2 className="text-base md:text-lg font-semibold">Personal Information</h2>
              </div>
              <span className="hidden md:inline-flex rounded-full bg-[#1b141b] px-3 py-1 text-[11px] text-slate-300 border border-[#31202c]">
                Recruiters see this first
              </span>
            </div>

            <div className="grid md:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-[11px] font-medium text-slate-300">Full Name</label>
                <input
                  className="w-full rounded-xl bg-[#050509] border border-[#2d2734] px-3 py-2 text-sm text-slate-100 outline-none focus:ring-2 focus:ring-amber-400/80"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Enter your full name"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-medium text-slate-300">Email</label>
                <input
                  className="w-full rounded-xl bg-[#050509] border border-[#2d2734] px-3 py-2 text-sm text-slate-100 outline-none focus:ring-2 focus:ring-amber-400/80"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-medium text-slate-300">Phone</label>
                <input
                  className="w-full rounded-xl bg-[#050509] border border-[#2d2734] px-3 py-2 text-sm text-slate-100 outline-none focus:ring-2 focus:ring-amber-400/80"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 XXXXX XXXXX"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-medium text-slate-300">Location</label>
                <input
                  className="w-full rounded-xl bg-[#050509] border border-[#2d2734] px-3 py-2 text-sm text-slate-100 outline-none focus:ring-2 focus:ring-amber-400/80"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="City, Country"
                />
              </div>
            </div>

            {/* Links */}
            <div className="mt-3 grid md:grid-cols-3 gap-3">
              <input
                value={github}
                onChange={(e) => setGithub(e.target.value)}
                placeholder="GitHub URL"
                className="rounded-xl bg-[#050509] border border-[#2d2734] px-3 py-2 text-sm outline-none"
              />
              <input
                value={linkedin}
                onChange={(e) => setLinkedin(e.target.value)}
                placeholder="LinkedIn URL"
                className="rounded-xl bg-[#050509] border border-[#2d2734] px-3 py-2 text-sm outline-none"
              />
              <input
                value={portfolio}
                onChange={(e) => setPortfolio(e.target.value)}
                placeholder="Portfolio URL"
                className="rounded-xl bg-[#050509] border border-[#2d2734] px-3 py-2 text-sm outline-none"
              />
            </div>
          </div>

          {/* Summary */}
          <div className="rounded-3xl bg-[#0c0b10] border border-[#2c222b] px-5 py-5">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-sm font-bold text-black">2</div>
                <h2 className="text-base md:text-lg font-semibold">Professional Summary</h2>
              </div>
              <button
                onClick={handleAISummary}
                disabled={aiLoading}
                className={`inline-flex items-center gap-2 rounded-full border border-amber-400/60 px-3 py-1.5 text-[11px] font-semibold text-amber-200 bg-black/30 hover:bg-black/40 transition-all ${aiLoading ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                ✨ {aiLoading ? "Working..." : "Improve with AI"}
              </button>
            </div>
            <textarea
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              placeholder="Write a 3–4 line summary about your profile..."
              className="w-full min-h-[110px] rounded-2xl bg-[#050509] border border-[#2d2734] px-3 py-2 text-sm text-slate-100 outline-none focus:ring-2 focus:ring-amber-400/80 resize-none"
            />
          </div>

          {/* Experience */}
          <div className="rounded-3xl bg-[#0c0b10] border border-[#2c222b] px-5 py-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="h-8 w-8 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-sm font-bold text-black">3</div>
              <h2 className="text-base md:text-lg font-semibold">Experience</h2>
            </div>

            <div className="space-y-4">
              {experiences.map((exp, index) => (
                <div key={exp.id} className="rounded-2xl bg-[#090811] border border-[#2d2734] px-4 py-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <p className="text-[11px] text-slate-400">Position {index + 1}</p>
                    <div className="flex items-center gap-2">
                      {experiences.length > 1 && (
                        <button onClick={() => removeExperience(index)} className="text-[11px] text-rose-400">Delete</button>
                      )}
                      <button
                        onClick={() => handleAIExperience(index)}
                        disabled={aiLoading}
                        className={`text-[11px] inline-flex items-center gap-1 rounded-full border border-amber-400/60 px-2 py-0.5 text-[10px] text-amber-200 ${aiLoading ? "opacity-50" : ""}`}
                      >
                        ✨ Improve
                      </button>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] text-slate-300">Job Title</label>
                      <input value={exp.title} onChange={(e) => updateExperience(index, "title", e.target.value)} placeholder="e.g. Frontend Developer" className="w-full rounded-xl bg-black/60 border border-[#382b3a] px-3 py-2 text-sm" />
                    </div>

                    <div>
                      <label className="text-[11px] text-slate-300">Company</label>
                      <input value={exp.company} onChange={(e) => updateExperience(index, "company", e.target.value)} placeholder="e.g. ABC Pvt Ltd" className="w-full rounded-xl bg-black/60 border border-[#382b3a] px-3 py-2 text-sm" />
                    </div>

                    <div className="md:col-span-2">
                      <label className="text-[11px] text-slate-300">Duration</label>
                      <input value={exp.duration} onChange={(e) => updateExperience(index, "duration", e.target.value)} placeholder="e.g. Jan 2024 – Jun 2024" className="w-full rounded-xl bg-black/60 border border-[#382b3a] px-3 py-2 text-sm" />
                    </div>

                    <div className="md:col-span-2">
                      <label className="text-[11px] text-slate-300">Description (use bullets with newline)</label>
                      <textarea value={exp.description} onChange={(e) => updateExperience(index, "description", e.target.value)} placeholder="- Did X\n- Did Y" className="w-full min-h-[80px] rounded-xl bg-black/60 border border-[#382b3a] px-3 py-2 text-sm resize-none" />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <button onClick={addExperience} className="mt-4 w-full rounded-2xl border border-dashed border-[#4a3a32] bg-[#120c10] py-2.5 text-sm text-amber-300">+ Add Experience</button>
          </div>

          {/* SKILLS */}
          <div className="rounded-3xl bg-[#0c0b10] border border-[#2c222b] px-5 py-5">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-sm font-bold text-black">4</div>
                <h2 className="text-base md:text-lg font-semibold">Skills</h2>
              </div>
              <button onClick={handleAISkills} disabled={aiLoading} className={`inline-flex items-center gap-1.5 rounded-full border border-amber-400/60 px-3 py-1 text-[11px] font-medium text-amber-200 bg-black/30 ${aiLoading ? "opacity-50" : ""}`}>✨ {aiLoading ? "Refining..." : "Refine with AI"}</button>
            </div>

            <p className="text-[11px] text-slate-400 mb-2">Enter technical & soft skills (comma separated). Use the button to refine both.</p>

            <div className="grid md:grid-cols-2 gap-3">
              <div className="rounded-xl border border-slate-700 p-4 bg-[#09090b]">
                <div className="mb-2 text-slate-300 font-semibold">Technical</div>
                <textarea value={skillsTech} onChange={(e) => setSkillsTech(e.target.value)} placeholder="React, JavaScript, HTML, CSS" className="w-full min-h-[70px] rounded-md bg-transparent px-2 py-2 text-sm resize-none" />
              </div>

              <div className="rounded-xl border border-slate-700 p-4 bg-[#09090b]">
                <div className="mb-2 text-slate-300 font-semibold">Soft skills</div>
                <textarea value={skillsSoft} onChange={(e) => setSkillsSoft(e.target.value)} placeholder="Teamwork, Communication" className="w-full min-h-[70px] rounded-md bg-transparent px-2 py-2 text-sm resize-none" />
              </div>
            </div>
          </div>

          {/* Projects */}
          <div className="rounded-3xl bg-[#0c0b10] border border-[#2c222b] px-5 py-5 mb-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="h-8 w-8 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-sm font-bold text-black">5</div>
              <h2 className="text-base md:text-lg font-semibold">Projects</h2>
            </div>

            <div className="space-y-4">
              {projects.map((proj, index) => (
                <div key={proj.id} className="rounded-2xl bg-[#090811] border border-[#2d2734] px-4 py-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <p className="text-[11px] text-slate-400">Project {index + 1}</p>
                    <div className="flex items-center gap-2">
                      {projects.length > 1 && <button onClick={() => removeProject(index)} className="text-[11px] text-rose-400">Delete</button>}
                      <button onClick={() => handleAIProject(index)} disabled={aiLoading} className={`text-[11px] inline-flex items-center gap-1 rounded-full border border-amber-400/60 px-2 py-0.5 text-[10px] text-amber-200 ${aiLoading ? "opacity-50" : ""}`}>✨ Improve</button>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[11px] text-slate-300">Project Name</label>
                    <input value={proj.name} onChange={(e) => updateProject(index, "name", e.target.value)} placeholder="Project title" className="w-full rounded-xl bg-black/60 border border-[#382b3a] px-3 py-2 text-sm" />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[11px] text-slate-300">Description</label>
                    <textarea value={proj.description} onChange={(e) => updateProject(index, "description", e.target.value)} placeholder="What you built & your role" className="w-full min-h-[80px] rounded-xl bg-black/60 border border-[#382b3a] px-3 py-2 text-sm resize-none" />
                  </div>
                </div>
              ))}
            </div>

            <button onClick={addProject} className="mt-4 w-full rounded-2xl border border-dashed border-[#4a3a32] bg-[#120c10] py-2.5 text-sm text-amber-300">+ Add Project</button>
          </div>

          {/* Achievements / Certifications */}
          <div className="rounded-3xl bg-[#0c0b10] border border-[#2c222b] px-5 py-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="h-8 w-8 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-sm font-bold text-black">6</div>
              <h2 className="text-base md:text-lg font-semibold">Achievements & Certifications</h2>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-[11px] text-slate-300">Achievements (one per line)</label>
                <textarea value={achievements} onChange={(e) => setAchievements(e.target.value)} placeholder="Won X award\nPublished Y" className="w-full min-h-[70px] rounded-xl bg-[#050509] border border-[#2d2734] px-3 py-2 text-sm resize-none" />
              </div>

              <div>
                <label className="text-[11px] text-slate-300">Certifications (one per line)</label>
                <textarea value={certifications} onChange={(e) => setCertifications(e.target.value)} placeholder="Certification Name - Issuer" className="w-full min-h-[70px] rounded-xl bg-[#050509] border border-[#2d2734] px-3 py-2 text-sm resize-none" />
              </div>
            </div>
          </div>
        </section>

        {/* RIGHT – Live Preview */}
        <section className="space-y-3">
          <div className="flex items-center justify-between text-[11px] text-slate-300 px-1 print:hidden">
            <span className="uppercase tracking-[0.16em] text-slate-500">Live Preview</span>
            <div className="flex items-center gap-3">
              <span className="hidden sm:inline-flex items-center gap-1 text-amber-300"><span className="h-2 w-2 rounded-full bg-amber-400 animate-pulse" /> Updating in real-time</span>
              <button onClick={handlePrint} className="inline-flex items-center gap-1.5 rounded-full border border-amber-400/70 px-3 py-1 text-[11px] font-medium text-amber-200 bg-black/40 hover:bg-black/60 print:hidden">⬇️ <span>Download as PDF</span></button>
            </div>
          </div>

          {/* Theme selector */}
          <div className="flex flex-wrap gap-2 text-[11px] text-slate-300 px-1 mt-1 print:hidden">
            {Object.values(themes).map((t) => (
              <button key={t.id} onClick={() => setTheme(t.id)} className={`px-2.5 py-1 rounded-full border transition-all ${theme === t.id ? "border-amber-400 text-amber-200 bg-black/60" : "border-slate-600 text-slate-300 bg-black/30"}`}>
                {t.label}
              </button>
            ))}
          </div>

         {/* Resume card */}
<div
  className={`w-full border border-slate-200 bg-white print:border-none`}
>
  {/* HEADER */}
  <div className="px-8 pt-8 pb-4">
    {/* Name */}
    <h1 className="text-4xl font-extrabold text-slate-900">
      {fullName || "Your Name"}
    </h1>

    {/* Contact row */}
    <div className="mt-3 flex flex-wrap gap-6 text-sm text-slate-700">
      {email && (
        <span className="flex items-center gap-1">
          <MdEmail /> {email}
        </span>
      )}
      {phone && (
        <span className="flex items-center gap-1">
          <MdPhone /> {phone}
        </span>
      )}
      {location && (
        <span className="flex items-center gap-1">
          <MdLocationOn /> {location}
        </span>
      )}
    </div>

    {/* Links */}
    <div className="mt-3 flex gap-6 text-sm text-slate-800">
      <span className="flex items-center gap-2">
        <FaGithub /> GitHub
      </span>
      <span className="flex items-center gap-2">
        <FaLinkedin /> LinkedIn
      </span>
      <span className="flex items-center gap-2">
        <FaGlobe /> Portfolio
      </span>
    </div>

    {/* GRADIENT LINE (FIXED & ALWAYS VISIBLE) */}
    <div className="mt-5 h-[3px] w-full bg-gradient-to-r from-amber-400 via-orange-500 to-rose-500" />
  </div>

  {/* CONTENT */}
  <div className="px-8 pb-8 space-y-8 text-[14px] leading-relaxed">
    {/* SECTION TITLE */}
    {summary && (
      <section>
        <span className="inline-block rounded-md border border-amber-400 px-4 py-1 text-sm font-semibold tracking-wide text-slate-900 bg-amber-50">
          PROFESSIONAL SUMMARY
        </span>

        <p className="mt-4 text-slate-800 text-justify">
          {summary}
        </p>
      </section>
    )}

    {/* EXPERIENCE */}
    {experiences.some(e => e.title || e.company) && (
      <section>
        <span className="inline-block rounded-md border border-amber-400 px-4 py-1 text-sm font-semibold tracking-wide bg-amber-50">
          WORK EXPERIENCE
        </span>

        <div className="mt-4 space-y-6">
          {experiences.map(exp => (
            <div key={exp.id}>
              <div className="flex justify-between">
                <p className="font-semibold text-slate-900">
                  {exp.title} {exp.company && `at ${exp.company}`}
                </p>
                <span className="text-sm text-slate-500">
                  {exp.duration}
                </span>
              </div>

              <p className="mt-2 text-slate-800 text-justify whitespace-pre-line">
                {exp.description}
              </p>
            </div>
          ))}
        </div>
      </section>
    )}

    {/* SKILLS */}
    {skillTags.length > 0 && (
      <section>
        <span className="inline-block rounded-md border border-amber-400 px-4 py-1 text-sm font-semibold tracking-wide bg-amber-50">
          SKILLS
        </span>

        <div className="mt-4 grid grid-cols-2 gap-10">
          {/* TECHNICAL */}
          <div>
            <h4 className="font-semibold text-slate-900 mb-2">
              Technical Skills
            </h4>
            <div className="flex flex-wrap gap-4 text-slate-800">
              {skillTags.map((s, i) => (
                <span key={i}>• {s}</span>
              ))}
            </div>
          </div>

          {/* SOFT */}
          <div>
            <h4 className="font-semibold text-slate-900 mb-2">
              Soft Skills
            </h4>
            <div className="flex flex-wrap gap-4 text-slate-800">
              <span>• Communication</span>
              <span>• Teamwork</span>
              <span>• Problem Solving</span>
            </div>
          </div>
        </div>
      </section>
    )}

    {/* PROJECTS */}
    {projects.some(p => p.name) && (
      <section>
        <span className="inline-block rounded-md border border-amber-400 px-4 py-1 text-sm font-semibold tracking-wide bg-amber-50">
          PROJECTS
        </span>

        <div className="mt-4 space-y-4">
          {projects.map(p => (
            <div key={p.id}>
              <p className="font-semibold text-slate-900">
                {p.name}
              </p>
              <p className="mt-1 text-slate-800 text-justify whitespace-pre-line">
                {p.description}
              </p>
            </div>
          ))}
        </div>
      </section>
    )}
 


              {/* Achievements */}
              {achievements && (
                <section>
                  <h3 className={`inline-block px-3 py-1 rounded-md text-sm font-semibold tracking-[0.08em] uppercase mb-3 ${currentTheme.pillBg} ${currentTheme.sectionHeading}`}>
                    Achievements
                  </h3>
                  <div className="whitespace-pre-line text-slate-800">{achievements}</div>
                </section>
              )}

              {/* Certifications */}
              {certifications && (
                <section>
                  <h3 className={`inline-block px-3 py-1 rounded-md text-sm font-semibold tracking-[0.08em] uppercase mb-3 ${currentTheme.pillBg} ${currentTheme.sectionHeading}`}>
                    Certifications
                  </h3>
                  <div className="whitespace-pre-line text-slate-800">{certifications}</div>
                </section>
              )}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;
