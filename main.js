// ============================================
// GATE 2027 EE Prep Dashboard - Main JavaScript
// ============================================

// ================== STATE MANAGEMENT ==================
const state = {
    currentPage: 'dashboard',
    completedTopics: JSON.parse(localStorage.getItem('gate_completed_topics') || '{}'),
    weeklyPlans: JSON.parse(localStorage.getItem('gate_weekly_plans') || '{}'),
    currentWeekOffset: 0
};

// ================== NAVIGATION ==================
function showPage(pageName) {
    // Hide all pages
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    
    // Show target page
    const targetPage = document.getElementById(`page-${pageName}`);
    if (targetPage) targetPage.classList.add('active');
    
    // Update nav items
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.toggle('active', item.dataset.page === pageName);
    });
    
    // Update page title
    const titles = {
        dashboard: 'Dashboard',
        roadmap: 'Study Roadmap',
        syllabus: 'Full Syllabus',
        weekly: 'Weekly Planner',
        resources: 'Free Resources',
        mock: 'Mock Tests',
        tricks: 'Tricks & Formulas',
        tracker: 'Progress Tracker'
    };
    document.getElementById('pageTitle').textContent = titles[pageName] || pageName;
    
    state.currentPage = pageName;
    
    // Close mobile sidebar
    if (window.innerWidth < 1024) {
        document.getElementById('sidebar').classList.remove('open');
        document.querySelector('.overlay')?.classList.remove('show');
    }
    
    // Initialize page-specific content
    if (pageName === 'weekly') initWeeklyPlanner();
    if (pageName === 'tracker') initTracker();
    if (pageName === 'tricks') initTricks();
    if (pageName === 'dashboard') setTimeout(initCharts, 100);
    
    // Scroll to top
    window.scrollTo(0, 0);
}

function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    sidebar.classList.toggle('open');
    
    let overlay = document.querySelector('.overlay');
    if (!overlay) {
        overlay = document.createElement('div');
        overlay.className = 'overlay';
        overlay.onclick = () => {
            sidebar.classList.remove('open');
            overlay.classList.remove('show');
        };
        document.body.appendChild(overlay);
    }
    overlay.classList.toggle('show', sidebar.classList.contains('open'));
}

// ================== COUNTDOWN ==================
function updateCountdown() {
    const examDate = new Date('2027-02-07');
    const startDate = new Date('2026-04-01');
    const today = new Date();
    
    const daysLeft = Math.ceil((examDate - today) / (1000 * 60 * 60 * 24));
    const totalDays = Math.ceil((examDate - startDate) / (1000 * 60 * 60 * 24));
    const daysPassed = Math.ceil((today - startDate) / (1000 * 60 * 60 * 24));
    
    const el = document.getElementById('daysLeft');
    if (el) el.textContent = Math.max(0, daysLeft);
    
    const progressFill = document.getElementById('progressFill');
    const progressLabel = document.getElementById('progressLabel');
    
    if (progressFill) {
        const percent = Math.min(100, Math.max(0, (daysPassed / totalDays) * 100));
        progressFill.style.width = percent.toFixed(1) + '%';
        if (progressLabel) progressLabel.textContent = percent.toFixed(1) + '% Journey Complete';
    }
}

// ================== DATE DISPLAY ==================
function updateDate() {
    const el = document.getElementById('currentDate');
    if (el) {
        const d = new Date();
        el.textContent = d.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' });
    }
}

// ================== CHARTS ==================
let chartsInitialized = false;

function initCharts() {
    if (chartsInitialized) return;
    chartsInitialized = true;
    
    // Marks Distribution Chart
    const ctx = document.getElementById('marksChart');
    if (ctx) {
        new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['Core EE (72)', 'Engg Math (13)', 'General Aptitude (15)'],
                datasets: [{
                    data: [72, 13, 15],
                    backgroundColor: ['#4f46e5', '#06b6d4', '#f59e0b'],
                    borderWidth: 0,
                    hoverOffset: 6
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: { font: { size: 11 }, padding: 14 }
                    },
                    tooltip: {
                        callbacks: {
                            label: (ctx) => ` ${ctx.label}: ${ctx.raw} marks`
                        }
                    }
                },
                cutout: '65%'
            }
        });
    }
}

// ================== SYLLABUS SEARCH ==================
function searchSyllabus(query) {
    const sections = document.querySelectorAll('.syllabus-section');
    const q = query.toLowerCase().trim();
    
    sections.forEach(section => {
        const text = section.textContent.toLowerCase();
        section.style.display = (!q || text.includes(q)) ? 'block' : 'none';
    });
}

// ================== SYLLABUS ACCORDION ==================
function toggleSection(header) {
    const body = header.nextElementSibling;
    const toggle = header.querySelector('.ss-toggle');
    const isOpen = body.classList.contains('open');
    
    body.classList.toggle('open', !isOpen);
    toggle.classList.toggle('open', !isOpen);
}

// ================== WEEKLY PLANNER ==================
const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const SHORT_DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

function getWeekDates(offset = 0) {
    const today = new Date();
    const dayOfWeek = today.getDay();
    const diff = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
    
    const monday = new Date(today);
    monday.setDate(today.getDate() + diff + (offset * 7));
    
    const dates = [];
    for (let i = 0; i < 7; i++) {
        const d = new Date(monday);
        d.setDate(monday.getDate() + i);
        dates.push(d);
    }
    return dates;
}

function formatDate(d) {
    return d.toISOString().split('T')[0];
}

function initWeeklyPlanner() {
    const container = document.getElementById('weeklyPlannerContent');
    if (!container) return;
    
    const dates = getWeekDates(state.currentWeekOffset);
    const today = formatDate(new Date());
    const weekKey = formatDate(dates[0]);
    const weekData = state.weeklyPlans[weekKey] || {};
    
    // Calculate week stats
    const doneCount = dates.filter(d => weekData[formatDate(d)]?.done).length;
    const totalHours = dates.reduce((sum, d) => sum + (parseFloat(weekData[formatDate(d)]?.hours) || 0), 0);
    
    const monthYear = dates[0].toLocaleDateString('en-IN', { month: 'long', year: 'numeric' });
    const week1 = dates[0].toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
    const week2 = dates[6].toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
    
    container.innerHTML = `
        <div class="weekly-planner">
            <div class="week-header-bar">
                <div class="week-nav">
                    <button onclick="changeWeek(-1)"><i class="fas fa-chevron-left"></i></button>
                    <div class="week-name">${week1} – ${week2}, ${dates[0].getFullYear()}</div>
                    <button onclick="changeWeek(1)"><i class="fas fa-chevron-right"></i></button>
                </div>
                <div class="week-stats">
                    <div class="ws-item">
                        <div class="ws-num">${doneCount}/7</div>
                        <div class="ws-label">Days Studied</div>
                    </div>
                    <div class="ws-item">
                        <div class="ws-num">${totalHours.toFixed(1)}</div>
                        <div class="ws-label">Hours Total</div>
                    </div>
                    <div class="ws-item">
                        <div class="ws-num">${(totalHours / 7 || 0).toFixed(1)}</div>
                        <div class="ws-label">Avg hrs/day</div>
                    </div>
                </div>
            </div>
            
            <div class="days-grid">
                ${dates.map((d, i) => {
                    const key = formatDate(d);
                    const data = weekData[key] || {};
                    const isToday = key === today;
                    const dayLabel = DAYS[i];
                    
                    return `
                    <div class="day-card ${isToday ? 'today' : ''}">
                        <div class="day-header">
                            <div class="day-name">${SHORT_DAYS[i]}</div>
                            <div class="day-date">${d.getDate()}</div>
                        </div>
                        <div class="day-body">
                            <textarea 
                                class="study-input" 
                                placeholder="What did you study today?&#10;(e.g., KCL/KVL, Transfer Functions...)"
                                onblur="saveDayNote('${weekKey}', '${key}', this.value)"
                            >${data.note || ''}</textarea>
                            <div class="day-hours">
                                <label>⏱️ Hours:</label>
                                <input type="number" class="hours-input" min="0" max="8" step="0.5" 
                                    value="${data.hours || ''}" 
                                    onblur="saveDayHours('${weekKey}', '${key}', this.value)"
                                    placeholder="0">
                            </div>
                            <label class="day-done">
                                <input type="checkbox" 
                                    ${data.done ? 'checked' : ''}
                                    onchange="saveDayDone('${weekKey}', '${key}', this.checked)">
                                Studied Today ✅
                            </label>
                        </div>
                    </div>`;
                }).join('')}
            </div>
            
            <div class="card">
                <div class="card-header">
                    <h3><i class="fas fa-bullseye"></i> This Week's Study Goals</h3>
                </div>
                <div class="card-body">
                    <div class="weekly-goals-grid" style="display:grid;grid-template-columns:repeat(auto-fill,minmax(250px,1fr));gap:12px;">
                        <div style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:12px;padding:16px;">
                            <div style="font-weight:700;color:#15803d;margin-bottom:8px;">🎯 Daily Target</div>
                            <div style="font-size:0.85rem;color:#166534;">Minimum 3 hours of quality study<br>Complete 10–15 practice problems<br>Make notes for the day's topic</div>
                        </div>
                        <div style="background:#eff6ff;border:1px solid #bfdbfe;border-radius:12px;padding:16px;">
                            <div style="font-weight:700;color:#1d4ed8;margin-bottom:8px;">📚 Weekly Goal</div>
                            <div style="font-size:0.85rem;color:#1e40af;">Complete 1–2 major topics per week<br>Solve 50+ PYQs (from past papers)<br>1 mini topic test on weekends</div>
                        </div>
                        <div style="background:#fef3c7;border:1px solid #fde68a;border-radius:12px;padding:16px;">
                            <div style="font-weight:700;color:#92400e;margin-bottom:8px;">⚡ Weekend Sprint</div>
                            <div style="font-size:0.85rem;color:#78350f;">Saturday: Revision + Practice Tests<br>Sunday: Weak areas focus<br>Plan next week's schedule</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

function changeWeek(direction) {
    state.currentWeekOffset += direction;
    initWeeklyPlanner();
}

function saveDayNote(weekKey, dayKey, value) {
    if (!state.weeklyPlans[weekKey]) state.weeklyPlans[weekKey] = {};
    if (!state.weeklyPlans[weekKey][dayKey]) state.weeklyPlans[weekKey][dayKey] = {};
    state.weeklyPlans[weekKey][dayKey].note = value;
    localStorage.setItem('gate_weekly_plans', JSON.stringify(state.weeklyPlans));
}

function saveDayHours(weekKey, dayKey, value) {
    if (!state.weeklyPlans[weekKey]) state.weeklyPlans[weekKey] = {};
    if (!state.weeklyPlans[weekKey][dayKey]) state.weeklyPlans[weekKey][dayKey] = {};
    state.weeklyPlans[weekKey][dayKey].hours = parseFloat(value) || 0;
    localStorage.setItem('gate_weekly_plans', JSON.stringify(state.weeklyPlans));
    setTimeout(initWeeklyPlanner, 100);
}

function saveDayDone(weekKey, dayKey, value) {
    if (!state.weeklyPlans[weekKey]) state.weeklyPlans[weekKey] = {};
    if (!state.weeklyPlans[weekKey][dayKey]) state.weeklyPlans[weekKey][dayKey] = {};
    state.weeklyPlans[weekKey][dayKey].done = value;
    localStorage.setItem('gate_weekly_plans', JSON.stringify(state.weeklyPlans));
    setTimeout(initWeeklyPlanner, 100);
}

// ================== PROGRESS TRACKER ==================
const trackerData = [
    {
        subject: 'Engineering Mathematics',
        icon: 'fa-calculator',
        topics: ['Linear Algebra', 'Calculus', 'Differential Equations', 'Complex Variables', 'Probability & Statistics', 'Vector Calculus', 'Fourier Series']
    },
    {
        subject: 'Electric Circuits',
        icon: 'fa-bolt',
        topics: ['KCL & KVL', 'Node Analysis', 'Mesh Analysis', 'Thevenin & Norton', 'Superposition', 'Max Power Transfer', 'Transient Analysis', 'AC Steady-State', 'Resonance', 'Two-port Networks', '3-phase Circuits']
    },
    {
        subject: 'Electromagnetic Fields',
        icon: 'fa-magnet',
        topics: ['Coulomb\'s Law & E-field', 'Gauss\'s Law', 'Electric Potential', 'Capacitance', 'Biot-Savart\'s Law', 'Ampere\'s Law', 'Faraday\'s Law', 'Inductance', 'Magnetic Circuits']
    },
    {
        subject: 'Signals & Systems',
        icon: 'fa-wave-square',
        topics: ['Signal Types & Properties', 'LTI Systems', 'Convolution', 'Fourier Series', 'Fourier Transform', 'Laplace Transform', 'Z-Transform', 'Sampling Theorem', 'System Analysis']
    },
    {
        subject: 'Electrical Machines',
        icon: 'fa-cogs',
        topics: ['Transformer Basics', 'OC/SC Tests', '3-phase Transformers', 'Autotransformer', 'DC Generators', 'DC Motors & Speed Control', 'IM – Principle & Slip', 'IM – Torque-Speed', 'IM – Tests & Starting', 'Synchronous Generator', 'Synchronous Motor']
    },
    {
        subject: 'Power Systems',
        icon: 'fa-plug',
        topics: ['Transmission Lines', 'ABCD Parameters', 'Per-Unit System', 'Ybus Matrix', 'Gauss-Seidel LF', 'Newton-Raphson LF', 'Symmetrical Components', 'Symmetrical Faults', 'Unsymmetrical Faults', 'Economic Load Dispatch', 'Voltage Control', 'Stability & Equal Area', 'Circuit Breakers', 'Protection Relays']
    },
    {
        subject: 'Control Systems',
        icon: 'fa-sliders-h',
        topics: ['Transfer Functions', 'Block Diagram Reduction', 'Signal Flow Graph', 'Mason\'s Rule', 'Time Domain Analysis', 'Steady-State Error', 'Routh-Hurwitz', 'Root Locus', 'Bode Plot', 'Nyquist Criterion', 'Lead/Lag Compensators', 'PID Controllers', 'State-Space Analysis']
    },
    {
        subject: 'Measurements',
        icon: 'fa-tachometer-alt',
        topics: ['Wheatstone Bridge', 'AC Bridges', 'Instrument Transformers', 'Digital Instruments', 'Power Measurement', 'Error Analysis']
    },
    {
        subject: 'Analog & Digital Electronics',
        icon: 'fa-microchip',
        topics: ['Diode Circuits', 'BJT Amplifiers', 'MOSFET Circuits', 'Op-Amp Applications', 'Active Filters', 'Oscillators', 'Boolean Algebra', 'Combinational Circuits', 'Flip-Flops', 'Counters & Registers', 'ADC & DAC']
    },
    {
        subject: 'Power Electronics',
        icon: 'fa-charging-station',
        topics: ['Thyristor Characteristics', 'MOSFET & IGBT', 'Buck Converter', 'Boost Converter', 'Buck-Boost Converter', 'Uncontrolled Rectifiers', 'Controlled Rectifiers', 'Single-phase Inverters', '3-phase Inverters', 'SPWM', 'Harmonics & Power Factor']
    }
];

function initTracker() {
    const container = document.getElementById('trackerContent');
    if (!container) return;
    
    const allTopics = trackerData.reduce((sum, s) => sum + s.topics.length, 0);
    const completedCount = Object.values(state.completedTopics).filter(Boolean).length;
    const percent = Math.round((completedCount / allTopics) * 100);
    
    const subjectStats = trackerData.map(s => {
        const done = s.topics.filter(t => state.completedTopics[`${s.subject}::${t}`]).length;
        return { ...s, done, total: s.topics.length };
    });
    
    container.innerHTML = `
        <div class="tracker-overview">
            <div class="to-card">
                <div class="to-num">${percent}%</div>
                <div class="to-label">Overall Progress</div>
            </div>
            <div class="to-card">
                <div class="to-num">${completedCount}</div>
                <div class="to-label">Topics Completed</div>
            </div>
            <div class="to-card">
                <div class="to-num">${allTopics - completedCount}</div>
                <div class="to-label">Topics Remaining</div>
            </div>
            <div class="to-card">
                <div class="to-num">${allTopics}</div>
                <div class="to-label">Total Topics</div>
            </div>
        </div>
        
        <div style="margin-bottom:20px;">
            <div style="background:var(--white);border-radius:14px;border:1px solid var(--border);padding:16px 20px;">
                <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:10px;">
                    <div style="font-weight:700;font-size:0.95rem;">Overall Completion</div>
                    <div style="font-weight:800;color:var(--primary);font-size:1.1rem;">${percent}%</div>
                </div>
                <div style="background:var(--border);border-radius:99px;height:12px;overflow:hidden;">
                    <div style="width:${percent}%;height:100%;background:linear-gradient(90deg,#4f46e5,#06b6d4);border-radius:99px;transition:width 1s ease;"></div>
                </div>
                <div style="font-size:0.78rem;color:var(--gray);margin-top:6px;">${completedCount} of ${allTopics} topics marked complete</div>
            </div>
        </div>
        
        <div class="subject-tracker">
            ${subjectStats.map(s => `
                <div class="st-card">
                    <div class="st-header">
                        <div class="st-icon"><i class="fas ${s.icon}"></i></div>
                        <div class="st-name">${s.subject}</div>
                        <div class="st-progress-text">${s.done}/${s.total}</div>
                    </div>
                    <div class="st-progress-bar">
                        <div class="st-progress-fill" style="width:${Math.round((s.done/s.total)*100)}%"></div>
                    </div>
                    <div class="st-topics">
                        ${s.topics.map(t => {
                            const key = `${s.subject}::${t}`;
                            const done = state.completedTopics[key];
                            return `<div class="topic-chip ${done ? 'completed' : ''}" 
                                onclick="toggleTopic('${key.replace(/'/g, "&apos;")}')">
                                ${t}
                            </div>`;
                        }).join('')}
                    </div>
                </div>
            `).join('')}
        </div>
    `;
    
    // Update dashboard count
    const el = document.getElementById('topicsCompleted');
    if (el) el.textContent = completedCount;
}

function toggleTopic(key) {
    state.completedTopics[key] = !state.completedTopics[key];
    localStorage.setItem('gate_completed_topics', JSON.stringify(state.completedTopics));
    initTracker();
}

// ================== TRICKS & FORMULAS ==================
const tricksData = {
    'Electric Circuits': [
        {
            title: '⚡ Voltage Divider Rule',
            content: 'For series resistors, voltage across R₁:',
            formula: 'V₁ = Vs × R₁/(R₁+R₂)',
            mnemonic: 'TIP: For 2 resistors in series – "mine is mine fraction of total"'
        },
        {
            title: '🔄 Current Divider Rule',
            content: 'For parallel resistors, current through R₁:',
            formula: 'I₁ = Is × R₂/(R₁+R₂)  [Opposite resistor on top!]',
            mnemonic: 'Trick: For CDR, it\'s the OTHER resistor on top!'
        },
        {
            title: '⭐ Star-Delta Transformation',
            content: 'Star to Delta:',
            formula: 'R_ab = (Ra×Rb + Rb×Rc + Rc×Ra) / Rc\n[Sum of products of adjacent / opposite star R]',
            mnemonic: 'Mnemonic: "Product sum divided by the opposite"'
        },
        {
            title: '🔋 Thevenin Theorem Shortcut',
            content: 'Steps to find Vth and Rth FAST:',
            formula: '1. Remove load RL\n2. Vth = Open circuit voltage across terminals\n3. Rth = Kill all sources (V→short, I→open), find resistance',
            mnemonic: 'TIP: For dependent sources → apply test voltage/current'
        },
        {
            title: '📊 Power in 3-phase',
            content: '3-phase balanced circuit power:',
            formula: 'P = √3 × VL × IL × cosφ\nQ = √3 × VL × IL × sinφ\nS = √3 × VL × IL',
            mnemonic: '√3 VL IL is the magic formula – memorize it!'
        }
    ],
    'Control Systems': [
        {
            title: '📐 Routh-Hurwitz Quick Check',
            content: 'Stability conditions to check FAST:',
            formula: '1. All coefficients must be positive\n2. All elements in first column of Routh table > 0\n3. Number of sign changes = number of RHP roots',
            mnemonic: 'TRICK: If any coefficient is missing or negative → UNSTABLE instantly!'
        },
        {
            title: '📈 Bode Plot Slopes',
            content: 'Magnitude slope per decade:',
            formula: 'Pole:         -20 dB/decade\nDouble pole:  -40 dB/decade\nZero:         +20 dB/decade\nIntegrator:   -20 dB/decade',
            mnemonic: 'Each pole = -20dB/dec, each zero = +20dB/dec'
        },
        {
            title: '🎯 Root Locus Rules',
            content: 'Key rules for quick sketching:',
            formula: '• Starts at open-loop POLES (K=0)\n• Ends at open-loop ZEROS (K=∞)\n• N branches, N = max(poles, zeros)\n• Real axis: to left of ODD number of P+Z\n• Asymptote angle = (2k+1)×180°/(n-m)',
            mnemonic: 'POLES to ZEROS as K goes from 0 to ∞'
        },
        {
            title: '🔢 Mason\'s Gain Formula',
            content: 'For Signal Flow Graph:',
            formula: 'T = (1/Δ) × Σ(Mk × Δk)\nΔ = 1 - Σ(L1) + Σ(L2) - ...\nMk = kth forward path gain\nΔk = cofactor of kth path',
            mnemonic: 'TIP: Start by identifying all loops first, then forward paths'
        },
        {
            title: '📊 Steady-State Error',
            content: 'Error for different inputs & system type:',
            formula: 'Type 0:  Step→1/(1+Kp), Ramp→∞\nType 1:  Step→0,       Ramp→1/Kv\nType 2:  Step→0,       Ramp→0, Parabola→1/Ka',
            mnemonic: 'Type number = number of poles at origin'
        }
    ],
    'Electrical Machines': [
        {
            title: '🔄 Transformer EMF Equation',
            content: 'RMS EMF in a transformer:',
            formula: 'E = 4.44 × f × N × Φm\nwhere Φm = maximum flux (Wb)\nf = frequency, N = turns',
            mnemonic: '4.44 = π√2, the magic number for transformers!'
        },
        {
            title: '⚙️ Induction Motor Slip',
            content: 'Key relationships with slip s:',
            formula: 'Nr = Ns(1-s), where Ns = 120f/P\nRotor EMF = s×E2\nRotor freq = s×f\nRotor Z = R2/s + jX2',
            mnemonic: 'TRICK: At starting s=1, at no-load s≈0'
        },
        {
            title: '🎯 DC Motor Speed Control',
            content: 'Speed equation N ∝ (V-IaRa)/Φ:',
            formula: 'N ∝ (V-IaRa)/Φ\nFor series: Φ ∝ Ia → N ∝ 1/Ia²\nFor shunt: Φ ≈ const → N ≈ (V-IaRa)/constant',
            mnemonic: 'SPEED UP: ↑V or ↓Φ or ↓Ra\nSLOW DOWN: ↓V or ↑Φ or ↑Ra'
        },
        {
            title: '📉 Transformer Efficiency',
            content: 'Condition for maximum efficiency:',
            formula: 'η_max when: Iron loss = Copper loss\nPi = I²R2 × n²\nη = VIcosφ / (VIcosφ + Pi + Pc)',
            mnemonic: 'Max efficiency when IRON = COPPER losses!'
        }
    ],
    'Power Systems': [
        {
            title: '⚡ Per-Unit System',
            content: 'Key formula for changing base:',
            formula: 'Znew_pu = Zold_pu × (MVAbase_new/MVAbase_old) × (kVbase_old/kVbase_new)²',
            mnemonic: 'PU changes: New MVA on top, kV old on top squared'
        },
        {
            title: '🔌 Symmetrical Fault Current',
            content: '3-phase fault current:',
            formula: 'If = V / Z1  (pre-fault voltage/positive seq impedance)\nFor 3-phase fault: If3φ = V/(Z1)\nFor SLG fault: If = 3V/(Z1+Z2+Z0)',
            mnemonic: '3-phase fault: simplest! Only Z1 matters'
        },
        {
            title: '📊 Newton-Raphson Load Flow',
            content: 'Quick reminder of steps:',
            formula: '1. Form Ybus\n2. Assume flat start (V=1∠0°)\n3. Compute ΔP, ΔQ\n4. Compute Jacobian J\n5. Solve ΔΘ, ΔV\n6. Update till convergence',
            mnemonic: 'NR converges in 3-5 iterations (quadratic convergence!)'
        },
        {
            title: '🛡️ Protection Reach',
            content: 'Distance relay zones:',
            formula: 'Zone 1: 80-85% of line length (instantaneous)\nZone 2: 120-150% (0.2-0.5s delay)\nZone 3: 220-250% (1-2s delay)',
            mnemonic: 'Zone 1 < 100% to avoid overreach during faults'
        }
    ],
    'Signals & Systems': [
        {
            title: '🔄 Laplace Transform Pairs',
            content: 'Must-know L.T. pairs:',
            formula: 'δ(t) → 1\nu(t) → 1/s\ne^(-at) → 1/(s+a)\nsin(ωt) → ω/(s²+ω²)\ncos(ωt) → s/(s²+ω²)\nt^n → n!/s^(n+1)',
            mnemonic: 'TIP: sin is ω on top, cos is s on top'
        },
        {
            title: '📐 Z-Transform Pairs',
            content: 'Key Z-transform pairs:',
            formula: 'δ[n]  → 1\nu[n]  → z/(z-1)\na^n u[n] → z/(z-a)\nn·u[n] → z/(z-1)²',
            mnemonic: 'ROC for causal: |z| > |a|; anti-causal: |z| < |a|'
        },
        {
            title: '⭐ Convolution Trick',
            content: 'Time domain convolution = frequency multiplication:',
            formula: 'y(t) = x(t) * h(t) ←→ Y(s) = X(s)·H(s)\ny[n] = x[n] * h[n] ←→ Y(z) = X(z)·H(z)',
            mnemonic: 'Star in time = Multiply in frequency domain'
        },
        {
            title: '📊 DTFT Properties',
            content: 'Key DTFT properties:',
            formula: 'Time shift: x[n-k] → e^(-jωk)X(ω)\nFreq shift: e^(jω₀n)x[n] → X(ω-ω₀)\nConvolution: x[n]*h[n] → X(ω)H(ω)',
            mnemonic: 'Same properties as CTFT but for discrete!'
        }
    ],
    'Engineering Mathematics': [
        {
            title: '🔢 Eigenvalue Tricks',
            content: 'Quick eigenvalue formulas:',
            formula: 'Sum of eigenvalues = Trace(A)\nProduct of eigenvalues = det(A)\nFor 2×2: λ² - (trace)λ + (det) = 0',
            mnemonic: 'Trace = Sum, Det = Product of eigenvalues'
        },
        {
            title: '📐 Cauchy Integral Formula',
            content: 'Cauchy theorem shortcut:',
            formula: '∮ f(z)/(z-a)^(n+1) dz = 2πi × f^(n)(a)/n!\nIf pole inside: 2πi × Residue\nIf pole outside: 0',
            mnemonic: 'INSIDE = 2πi × Residue, OUTSIDE = 0'
        },
        {
            title: '📊 Probability Quick Facts',
            content: 'Normal distribution key values:',
            formula: 'P(μ-σ to μ+σ)  = 68.27%\nP(μ-2σ to μ+2σ) = 95.45%\nP(μ-3σ to μ+3σ) = 99.73%',
            mnemonic: 'Rule of 68-95-99.7! Must memorize!'
        },
        {
            title: '🔄 Series Solutions',
            content: 'Important series to remember:',
            formula: 'e^x = 1 + x + x²/2! + ...\nsin(x) = x - x³/3! + x⁵/5! - ...\ncos(x) = 1 - x²/2! + x⁴/4! - ...\nln(1+x) = x - x²/2 + x³/3 - ...',
            mnemonic: 'GATE often tests these series in complex variable questions'
        }
    ],
    'Power Electronics': [
        {
            title: '🔋 Buck Converter',
            content: 'Output voltage & inductor current:',
            formula: 'Vo = D × Vin  (D = duty cycle)\nΔiL = (Vin-Vo)×D×T/L\nRipple ∝ 1/L, 1/C, 1/f',
            mnemonic: 'Buck STEPS DOWN → Vo < Vin → D < 1'
        },
        {
            title: '🔋 Boost Converter',
            content: 'Output voltage formula:',
            formula: "Vo = Vin/(1-D)\nHigher D → Higher output\nAt D=0.5: Vo = 2×Vin",
            mnemonic: 'Boost STEPS UP → Vo > Vin → "Divided by (1-D)"'
        },
        {
            title: '🔋 Buck-Boost Converter',
            content: 'Output voltage (inverted!):',
            formula: 'Vo = -Vin × D/(1-D)\nNote: Output is NEGATIVE (inverted)\nMagnitude: |Vo| = Vin×D/(1-D)',
            mnemonic: 'Buck-Boost: negative output (inverts polarity!)'
        },
        {
            title: '📊 SCR Firing Angle',
            content: 'Average output of half-wave controlled rectifier:',
            formula: 'Vdc = (Vm/2π)(1+cosα)  [Half-wave]\nVdc = (2Vm/π)cosα        [Full-wave]\nα = firing angle (0° to 180°)',
            mnemonic: 'Larger α → Smaller output voltage'
        }
    ]
};

function initTricks() {
    const container = document.getElementById('tricksContent');
    if (!container) return;
    
    const subjects = Object.keys(tricksData);
    const firstSubject = subjects[0];
    
    container.innerHTML = `
        <div class="tricks-tabs">
            ${subjects.map((s, i) => `
                <button class="trick-tab ${i === 0 ? 'active' : ''}" onclick="showTricks('${s}', this)">${s}</button>
            `).join('')}
        </div>
        <div class="tricks-content" id="tricksDisplay">
            ${renderTricks(firstSubject)}
        </div>
        
        <div class="card" style="margin-top:20px;">
            <div class="card-header">
                <h3><i class="fas fa-clipboard-list"></i> Quick GATE Exam Strategy Tips</h3>
            </div>
            <div class="card-body">
                <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:14px;">
                    <div style="background:#f0fdf4;border-radius:12px;padding:16px;border-left:4px solid #10b981;">
                        <div style="font-weight:700;color:#065f46;margin-bottom:8px;">✅ Attempt Order Strategy</div>
                        <ul style="font-size:0.82rem;color:#166534;list-style:none;display:flex;flex-direction:column;gap:4px;">
                            <li>→ Start with GA (15 easy marks)</li>
                            <li>→ Then Engineering Mathematics</li>
                            <li>→ Then your STRONGEST subject</li>
                            <li>→ Leave difficult MCQs for last</li>
                            <li>→ Attempt ALL NAT questions</li>
                        </ul>
                    </div>
                    <div style="background:#eff6ff;border-radius:12px;padding:16px;border-left:4px solid #3b82f6;">
                        <div style="font-weight:700;color:#1e40af;margin-bottom:8px;">⏰ Time Management</div>
                        <ul style="font-size:0.82rem;color:#1e3a8a;list-style:none;display:flex;flex-direction:column;gap:4px;">
                            <li>→ 1-mark: max 1 min per question</li>
                            <li>→ 2-mark: max 2-3 min per question</li>
                            <li>→ Keep 15 min buffer at end</li>
                            <li>→ Skip if stuck >2 min, come back</li>
                            <li>→ Mark for review, don't leave blank (NAT)</li>
                        </ul>
                    </div>
                    <div style="background:#fef3c7;border-radius:12px;padding:16px;border-left:4px solid #f59e0b;">
                        <div style="font-weight:700;color:#92400e;margin-bottom:8px;">⚡ Negative Marking Alert</div>
                        <ul style="font-size:0.82rem;color:#78350f;list-style:none;display:flex;flex-direction:column;gap:4px;">
                            <li>→ MCQ 1-mark: -1/3 for wrong</li>
                            <li>→ MCQ 2-mark: -2/3 for wrong</li>
                            <li>→ MSQ: NO negative marking</li>
                            <li>→ NAT: NO negative marking</li>
                            <li>→ Guess only if 2+ options eliminated</li>
                        </ul>
                    </div>
                    <div style="background:#fdf4ff;border-radius:12px;padding:16px;border-left:4px solid #a855f7;">
                        <div style="font-weight:700;color:#6b21a8;margin-bottom:8px;">📝 Smart Study Tips</div>
                        <ul style="font-size:0.82rem;color:#581c87;list-style:none;display:flex;flex-direction:column;gap:4px;">
                            <li>→ Solve PYQs from 2015–2025 at least 2x</li>
                            <li>→ Understand, don't memorize derivations</li>
                            <li>→ Make formula sheets for each subject</li>
                            <li>→ Practice NAT questions extensively</li>
                            <li>→ Focus on topics that repeat in PYQs</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    `;
}

function renderTricks(subject) {
    const tricks = tricksData[subject] || [];
    return `
        <div class="trick-section">
            <div class="trick-section-header">
                <i class="fas fa-magic"></i> ${subject} – Key Shortcuts & Formulas
            </div>
            <div class="tricks-grid">
                ${tricks.map(t => `
                    <div class="trick-card">
                        <div class="trick-title"><i class="fas fa-lightbulb"></i> ${t.title}</div>
                        <div class="trick-content">${t.content}</div>
                        <div class="formula-box">${t.formula}</div>
                        ${t.mnemonic ? `<div class="mnemonic-box">💡 ${t.mnemonic}</div>` : ''}
                    </div>
                `).join('')}
            </div>
        </div>
    `;
}

function showTricks(subject, btn) {
    document.querySelectorAll('.trick-tab').forEach(t => t.classList.remove('active'));
    btn.classList.add('active');
    
    const display = document.getElementById('tricksDisplay');
    if (display) {
        display.innerHTML = renderTricks(subject);
        display.style.opacity = '0';
        setTimeout(() => { display.style.opacity = '1'; display.style.transition = 'opacity 0.3s'; }, 10);
    }
}

// ================== INITIALIZATION ==================
document.addEventListener('DOMContentLoaded', function () {
    // Set current date
    updateDate();
    setInterval(updateDate, 60000);
    
    // Countdown
    updateCountdown();
    setInterval(updateCountdown, 3600000);
    
    // Init dashboard
    initCharts();
    
    // Update topics count on dashboard
    const count = Object.values(state.completedTopics).filter(Boolean).length;
    const el = document.getElementById('topicsCompleted');
    if (el) el.textContent = count;
    
    // Animate weight bars after a delay
    setTimeout(() => {
        document.querySelectorAll('.weight-bar').forEach(bar => {
            const width = bar.style.width;
            bar.style.width = '0%';
            setTimeout(() => { bar.style.width = width; }, 100);
        });
    }, 500);
    
    console.log('✅ GATE 2027 EE Prep Dashboard initialized!');
    console.log('📚 All data stored in localStorage – your progress is saved!');
});
