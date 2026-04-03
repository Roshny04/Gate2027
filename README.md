# GATE 2027 EE Personal Preparation Dashboard

## 🎯 Project Overview
A complete personal preparation portal for GATE 2027 Electrical Engineering (EE) — designed for a first-time aspirant targeting the exam in February 2027. Built as a static website with full client-side interactivity, progress tracking, and persistent local storage.

---

## ✅ Completed Features

### 1. 🏠 Dashboard
- GATE 2027 EE exam pattern overview (65Q, 100 marks, 3hr CBT)
- Subject-wise marks weightage with animated progress bars
- Marks distribution pie chart (Chart.js)
- Daily schedule guide (9 PM – 12 AM, 3 hrs/day)
- Live countdown timer to GATE exam date
- Quick navigation cards to all sections

### 2. 📅 Study Roadmap (April 2026 – February 2027)
- **Phase 1** (Apr–Jun): Engineering Math, Circuits, EMF, Signals & Systems
- **Phase 2** (Jul–Sep): Electrical Machines, Power Systems, Control Systems
- **Phase 3** (Oct–Nov): Electronics, Measurements, Power Electronics, General Aptitude
- **Phase 4** (Dec–Feb): Intensive revision, mock tests, final sprint
- Visual 11-month timeline bar chart
- Detailed month-by-month topic breakdowns with study targets

### 3. 📚 Full Syllabus (10 Sections)
- All 10 official GATE EE sections with complete topic breakdowns
- Per-section marks estimate and priority badges
- Expandable accordion UI
- Free NPTEL & resource links per section
- Search functionality to find any topic

### 4. 📋 Weekly Study Planner
- Navigate week by week (forward/backward)
- Log daily study notes (what was studied)
- Track hours studied per day
- Mark each day as "studied" checkbox
- Weekly stats: days studied, total hours, avg hrs/day
- Data persisted in localStorage

### 5. 🔗 Free Resources Page
- 10 NPTEL free courses (IIT faculty) with direct links
- YouTube free playlists (Neso Academy, GATE PYQs)
- Free textbooks (AllAboutCircuits, MIT OCW)
- Official GATE PYQs (IIT Guwahati 2007–2025 bulk download)
- Topic-wise PYQ practice sites (PracticePaper.in, ExamSide.com, GATE Overflow)
- Standard book recommendations per subject

### 6. 📝 Mock Tests Page
- Official GATE 2026 EE mock test (IIT Guwahati interface)
- 7 free online mock test platforms with direct links
- Recommended mock test schedule (weekly frequency per month)
- Exam attempt strategy notes

### 7. ⚡ Tricks & Formulas
- Subject-switchable formula cards
- 6 subjects covered: Circuits, Control, Machines, Power Systems, Signals & Systems, Engineering Math, Power Electronics
- Formula boxes (monospace), mnemonic reminder boxes
- General GATE strategy tips (time management, negative marking, attempt order)

### 8. 📊 Progress Tracker
- Mark individual topics as completed (click-to-toggle)
- Subject-wise progress bars
- Overall completion percentage
- 10 subjects × all major topics = ~100 trackable items
- Persisted in localStorage (survives browser refresh)

---

## 🌐 Entry Points
- **Main Page**: `index.html` — Dashboard (default)
- All sections accessible via sidebar navigation
- No backend required – fully static

---

## 💾 Data Storage
- **localStorage** used for:
  - `gate_completed_topics` – topic completion status (object)
  - `gate_weekly_plans` – weekly planner entries (nested object by week/day)
- No server-side data, no login required

---

## 📦 External Libraries (CDN)
- [Chart.js](https://cdn.jsdelivr.net/npm/chart.js) – Doughnut chart for marks distribution
- [Font Awesome 6.4.0](https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free) – Icons throughout
- [Google Fonts – Inter + Poppins](https://fonts.googleapis.com) – Typography

---

## 🔗 Key External Free Resources Referenced
| Resource | Purpose | URL |
|----------|---------|-----|
| GATE 2026 Official Mock EE | Interface practice | cdn4.digialm.com |
| IIT Guwahati PYQs 2007–2025 | Previous year papers | gate2026.iitg.ac.in/download.html |
| NPTEL – Network Analysis | Electric Circuits | onlinecourses.nptel.ac.in |
| NPTEL – Control Systems | Control Theory | onlinecourses.nptel.ac.in |
| NPTEL – Power System Analysis | Power Systems | onlinecourses.nptel.ac.in |
| PracticePaper.in | Topic-wise PYQ practice | practicepaper.in/gate-ee |
| ExamSide.com | Chapter-wise GATE PYQs | questions.examside.com |
| GATE Overflow EE | Community Q&A | ee.gateoverflow.in |
| AllAboutCircuits | Free EE textbook | allaboutcircuits.com/textbook |
| MIT OCW 6.002 | Circuits course | ocw.mit.edu |
| Mockers.in | Free full mock test | mockers.in |
| Vidyalankar | 5 free EE mock tests | vidyalankar.org |

---

## 📝 Recommended Next Steps
1. Add a notes page (rich text editor per subject)
2. Add formula flashcard quiz mode
3. Add a PYQ tally tracker (record how many PYQs solved)
4. Add email/reminder notification system
5. Add a score prediction calculator based on practice tests
6. Add more subjects to tricks & formulas (Analog Electronics, EMF)
