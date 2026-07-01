// Arabic Present Tense Verb Learning Platform - Application Script
// pairing Arabic verb forms with Malayalam explanations, interactive practice, 5 games, and progress tracking.

// --------------------------------------------------------------------
// 1. Data Structure: 14 Forms of فعل مضارع
// --------------------------------------------------------------------
const VERB_DATA = [
    {
        id: 1,
        arabic: 'يَذْهَبُ',
        pronoun: 'هُوَ',
        group: 1,
        groupTitleAr: 'مذكر',
        groupTitleMl: '',
        meaning: 'അവൻ പോയി (പുരുഷൻ)',
        grammar: '',
        transliteration: 'യദ്ഹബു'
    },
    {
        id: 2,
        arabic: 'يَذْهَبَانِ',
        pronoun: 'هُما (مذكر)',
        group: 1,
        groupTitleAr: 'مذكر',
        groupTitleMl: '',
        meaning: 'അവർ രണ്ടുപേർ പോയി (പുരുഷന്മാർ )',
        grammar: '',
        transliteration: 'യദ്ഹബാനി'
    },
    {
        id: 3,
        arabic: 'يَذْهَبُونَ',
        pronoun: 'هُمْ',
        group: 1,
        groupTitleAr: 'مذكر',
        groupTitleMl: '',
        meaning: 'അവർ അനേകം പേർ പോയി (പുരുഷന്മാർ )',
        grammar: '',
        transliteration: 'യദ്ഹബൂന'
    },
    {
        id: 4,
        arabic: 'تَذْهَبُ',
        pronoun: 'هِيَ',
        group: 2,
        groupTitleAr: 'مؤنث',
        groupTitleMl: '',
        meaning: 'അവൾ പോയി (സ്ത്രീ)',
        grammar: '',
        transliteration: 'തദ്ഹബു'
    },
    {
        id: 5,
        arabic: 'تَذْهَبَانِ',
        pronoun: 'هُما (مؤنث)',
        group: 2,
        groupTitleAr: 'مؤنث',
        groupTitleMl: '',
        meaning: 'അവർ രണ്ടുപേർ പോയി (സ്ത്രീകൾ)',
        grammar: '',
        transliteration: 'തദ്ഹബാനി'
    },
    {
        id: 6,
        arabic: 'يَذْهَبْنَ',
        pronoun: 'هُനَّ',
        group: 2,
        groupTitleAr: 'مؤنث',
        groupTitleMl: '',
        meaning: 'അവർ അനേകം പേർ പോയി (സ്ത്രീകൾ )',
        grammar: '',
        transliteration: 'യദ്ഹബ്ന'
    }
];

// Group metadata
const GROUPS = [
    { id: 1, ar: 'مذكر', ml: 'പുല്ലിംഗം' },
    { id: 2, ar: 'مؤنث', ml: 'സ്ത്രീലിംഗം' },
    { id: 3, ar: 'حاضر - مذكر', ml: 'മദ്ധ്യമൻ - പുല്ലിംഗം' },
    { id: 4, ar: 'حاضر - مؤنث', ml: 'മദ്ധ്യമൻ - സ്ത്രീലിംഗം' },
    { id: 5, ar: 'متكلم', ml: 'ഉത്തമപുരുഷൻ' }
];

// Unique pairing set for memory match game (to ensure cards match exactly 1-to-1)
const MEMORY_PAIRS = [
    { meaning: 'അവൻ പോയി (പുരുഷൻ)', verb: 'يَذْهَبُ' },
    { meaning: 'അവർ രണ്ടുപേർ പോയി (പുരുഷന്മാർ )', verb: 'يَذْهَبَانِ' },
    { meaning: 'അവർ അനേകം പേർ പോയി (പുരുഷന്മാർ )', verb: 'يَذْهَبُونَ' },
    { meaning: 'അവൾ പോയി (സ്ത്രീ)', verb: 'تَذْهَبُ' },
    { meaning: 'അവർ രണ്ടുപേർ പോയി (സ്ത്രീകൾ)', verb: 'تَذْهَبَانِ' },
    { meaning: 'അവർ അനേകം പേർ പോയി (സ്ത്രീകൾ )', verb: 'يَذْهَبْنَ' }
];

// --------------------------------------------------------------------
// 2. Audio Effects Synthesizer (Web Audio API)
// --------------------------------------------------------------------
const SoundFX = {
    audioCtx: null,
    
    init() {
        if (!this.audioCtx) {
            this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        }
    },
    
    playCorrect() {
        try {
            this.init();
            const now = this.audioCtx.currentTime;
            
            // Ascending bright chime
            const tones = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
            tones.forEach((freq, index) => {
                const time = now + index * 0.07;
                const osc = this.audioCtx.createOscillator();
                const gain = this.audioCtx.createGain();
                
                osc.type = 'triangle';
                osc.frequency.setValueAtTime(freq, time);
                
                gain.gain.setValueAtTime(0, time);
                gain.gain.linearRampToValueAtTime(0.12, time + 0.02);
                gain.gain.exponentialRampToValueAtTime(0.0001, time + 0.35);
                
                osc.connect(gain);
                gain.connect(this.audioCtx.destination);
                
                osc.start(time);
                osc.stop(time + 0.4);
            });
        } catch(e) {
            console.error('Audio synthesis failed:', e);
        }
    },
    
    playWrong() {
        try {
            this.init();
            const now = this.audioCtx.currentTime;
            
            // Buzz sound
            const osc = this.audioCtx.createOscillator();
            const gain = this.audioCtx.createGain();
            
            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(140, now);
            osc.frequency.linearRampToValueAtTime(90, now + 0.3);
            
            gain.gain.setValueAtTime(0, now);
            gain.gain.linearRampToValueAtTime(0.18, now + 0.05);
            gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.35);
            
            osc.connect(gain);
            gain.connect(this.audioCtx.destination);
            
            osc.start(now);
            osc.stop(now + 0.45);
        } catch(e) {
            console.error('Audio synthesis failed:', e);
        }
    },
    
    playClick() {
        try {
            this.init();
            const now = this.audioCtx.currentTime;
            
            const osc = this.audioCtx.createOscillator();
            const gain = this.audioCtx.createGain();
            
            osc.type = 'sine';
            osc.frequency.setValueAtTime(600, now);
            
            gain.gain.setValueAtTime(0.06, now);
            gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.08);
            
            osc.connect(gain);
            gain.connect(this.audioCtx.destination);
            
            osc.start(now);
            osc.stop(now + 0.1);
        } catch(e) {
            // Silently ignore
        }
    },
    
    playPop() {
        try {
            this.init();
            const now = this.audioCtx.currentTime;
            
            // High frequency pop
            const osc = this.audioCtx.createOscillator();
            const gain = this.audioCtx.createGain();
            
            osc.type = 'sine';
            osc.frequency.setValueAtTime(300, now);
            osc.frequency.exponentialRampToValueAtTime(1100, now + 0.08);
            
            gain.gain.setValueAtTime(0.2, now);
            gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.08);
            
            osc.connect(gain);
            gain.connect(this.audioCtx.destination);
            
            osc.start(now);
            osc.stop(now + 0.09);
        } catch(e) {
            // Silently ignore
        }
    }
};

// --------------------------------------------------------------------
// 3. Speech Synthesis (Pronunciation)
// --------------------------------------------------------------------
function speakArabic(text) {
    if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel(); // Stop current speech
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'ar-SA';
        utterance.rate = 0.75; // child-friendly slower rate
        utterance.pitch = 1.1; // friendly slightly higher pitch
        window.speechSynthesis.speak(utterance);
    } else {
        alert("ശബ്ദം കേൾപ്പിക്കുന്ന സംവിധാനം ഈ ബ്രൗസറിൽ ലഭ്യമല്ല.");
    }
}

// --------------------------------------------------------------------
// 4. Confetti Celebrations (HTML5 Canvas Particles)
// --------------------------------------------------------------------
const Confetti = {
    canvas: null,
    ctx: null,
    particles: [],
    animationFrame: null,
    
    init() {
        this.canvas = document.getElementById('confetti-canvas');
        this.ctx = this.canvas.getContext('2d');
        this.resize();
        window.addEventListener('resize', () => this.resize());
    },
    
    resize() {
        if (this.canvas) {
            this.canvas.width = window.innerWidth;
            this.canvas.height = window.innerHeight;
        }
    },
    
    spawn(count = 90) {
        this.init();
        for (let i = 0; i < count; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height - this.canvas.height - 20,
                size: Math.random() * 8 + 6,
                color: `hsl(${Math.random() * 360}, 85%, 55%)`,
                speedX: Math.random() * 4 - 2,
                speedY: Math.random() * 5 + 4,
                rotation: Math.random() * 360,
                rotationSpeed: Math.random() * 6 - 3
            });
        }
        if (!this.animationFrame) {
            this.animate();
        }
    },
    
    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        let active = false;
        
        for (let i = 0; i < this.particles.length; i++) {
            const p = this.particles[i];
            p.y += p.speedY;
            p.x += p.speedX;
            p.rotation += p.rotationSpeed;
            
            if (p.y < this.canvas.height) {
                active = true;
                this.ctx.save();
                this.ctx.translate(p.x, p.y);
                this.ctx.rotate((p.rotation * Math.PI) / 180);
                this.ctx.fillStyle = p.color;
                this.ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
                this.ctx.restore();
            }
        }
        
        if (active) {
            this.animationFrame = requestAnimationFrame(() => this.animate());
        } else {
            this.particles = [];
            this.animationFrame = null;
        }
    }
};

// --------------------------------------------------------------------
// 5. Global State & LocalStorage
// --------------------------------------------------------------------
let state = {
    stars: 0,
    totalCorrect: 0,
    readVerbs: [], // Verb IDs that have been clicked/spoken
    highScores: {
        g1: 0,
        g2: 0,
        g3: 0,
        g4: 0,
        g5: 0
    },
    unlockedBadges: [] // 'beginner', 'pronoun', 'champion', 'trophy'
};

function loadState() {
    const saved = localStorage.getItem('arabic_mudhari_state');
    if (saved) {
        try {
            state = JSON.parse(saved);
        } catch(e) {
            console.error('State load error:', e);
        }
    }
    updateStatsDisplay();
}

function saveState() {
    localStorage.setItem('arabic_mudhari_state', JSON.stringify(state));
    updateStatsDisplay();
    evaluateBadges();
}

function updateStatsDisplay() {
    // Header counts
    document.getElementById('header-star-count').innerText = state.stars;
    
    // Achievements counts
    document.getElementById('stats-total-stars').innerText = state.stars;
    document.getElementById('stats-total-correct').innerText = state.totalCorrect;
    
    // Calculate progress
    // Progress = (number of read verbs / 6 * 50%) + (number of played games / 5 * 50%)
    const readCount = state.readVerbs.length;
    const gamesPlayed = Object.values(state.highScores).filter(s => s > 0).length;
    const progressPct = Math.round((readCount / 6) * 50 + (gamesPlayed / 5) * 50);
    
    document.getElementById('stats-progress-pct').innerText = `${progressPct}%`;
    document.getElementById('header-progress-fill').style.width = `${progressPct}%`;
    
    // Update game selection cards' high scores
    for (let i = 1; i <= 5; i++) {
        document.getElementById(`g${i}-high`).innerText = `മികച്ച സ്കോർ: ${state.highScores['g' + i]}`;
    }
}

// --------------------------------------------------------------------
// 6. Badge Checking Engine
// --------------------------------------------------------------------
function evaluateBadges() {
    let unlockedAny = false;

    function checkUnlock(badgeId, condition, nameAr, nameMl) {
        if (condition && !state.unlockedBadges.includes(badgeId)) {
            state.unlockedBadges.push(badgeId);
            unlockedAny = true;
            triggerBadgeUnlockEffect(`badge-${badgeId}`, nameAr, nameMl);
        }
    }

    // 1. 🌱 Beginner
    checkUnlock('beginner', state.readVerbs.length >= 1, 'مُبْتَدِئٌ', 'തുടക്കക്കാരൻ');

    // 2. 📘 Learner
    checkUnlock('learner', state.readVerbs.length >= 3, 'دَارِسٌ', 'പഠിതാവ്');

    // 3. 📚 Student
    checkUnlock('student', state.readVerbs.length >= 6, 'طَالِبٌ', 'വിദ്യാർത്ഥി');

    // 4. 🔵 Explorer
    const maxScore = Math.max(...Object.values(state.highScores));
    checkUnlock('explorer', maxScore >= 20, 'مُسْتَكْشِفٌ', 'അന്വേഷകൻ');

    // 5. 🎓 Scholar
    checkUnlock('scholar', state.highScores.g1 >= 50 || state.highScores.g2 >= 50, 'عَالِمٌ', 'പണ്ഡിതൻ');

    // 6. 📖 Expert (Book)
    checkUnlock('expert-book', state.highScores.g3 >= 60, 'خَبِيرٌ', 'വിദഗ്ദ്ധൻ');

    // 7. 🧠 Expert (Brain)
    checkUnlock('expert-brain', state.highScores.g5 >= 60, 'ذَكِيٌّ', 'ബുദ്ധിശാലി');

    // 8. ⭐ Elite
    checkUnlock('elite', state.stars >= 100, 'نُخْبَةٌ', 'അഭിജാതൻ');

    // 9. 🟠 Master
    checkUnlock('master', maxScore >= 100, 'مَاسْتَر', 'മാസ്റ്റർ');

    // 10. 🏆 Grand Champion
    checkUnlock('champion', state.highScores.g4 >= 120, 'بَطَلٌ كَبِيرٌ', 'മഹാ വിജയി');

    // 11. 👑 Legend
    checkUnlock('legend', state.totalCorrect >= 500, 'أُسْطُورَةٌ', 'ഇതിഹാസം');

    // 12. 👑 Grand Master
    const otherBadges = ['beginner', 'learner', 'student', 'explorer', 'scholar', 'expert-book', 'expert-brain', 'elite', 'master', 'champion', 'legend'];
    const unlockedAllOthers = otherBadges.every(b => state.unlockedBadges.includes(b));
    checkUnlock('grandmaster', unlockedAllOthers, 'أُسْتَاذٌ أَكْبَرُ', 'ഗ്രാൻഡ് മാസ്റ്റർ');

    // Update styling for unlocked badges
    state.unlockedBadges.forEach(badgeId => {
        const badgeEl = document.getElementById(`badge-${badgeId}`);
        if (badgeEl) {
            badgeEl.classList.add('unlocked');
            badgeEl.querySelector('.badge-status').innerText = 'ലഭിച്ചു';
        }
    });

    if (unlockedAny) {
        localStorage.setItem('arabic_mudhari_state', JSON.stringify(state));
    }
}

function triggerBadgeUnlockEffect(elementId, arabicName, malayalamName) {
    Confetti.spawn(120);
    SoundFX.playCorrect();
    
    // Pulse animation on the unlocked badge card
    const card = document.getElementById(elementId);
    if (card) {
        card.style.transform = 'scale(1.15)';
        card.style.zIndex = '10';
        setTimeout(() => {
            card.style.transform = '';
            card.style.zIndex = '';
        }, 1500);
    }
}

// --------------------------------------------------------------------
// 7. View & Screen Switcher
// --------------------------------------------------------------------
function initTabNavigation() {
    const tabs = document.querySelectorAll('.tab-btn');
    const sections = document.querySelectorAll('.view-section');

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const target = tab.getAttribute('data-tab');
            SoundFX.playClick();

            tabs.forEach(t => t.classList.remove('active'));
            sections.forEach(s => s.classList.remove('active'));

            tab.classList.add('active');
            document.getElementById(`${target}-view`).classList.add('active');
            
            // Special view initializations
            if (target === 'practice') {
                initPracticeView();
            }
        });
    });

    // Sub-Practice selector tabs (Flashcards vs Reveal vs Tracing)
    const practiceSelectors = document.querySelectorAll('.practice-selector .selector-btn');
    const practicePanels = document.querySelectorAll('.practice-panel');

    practiceSelectors.forEach(btn => {
        btn.addEventListener('click', () => {
            const subview = btn.getAttribute('data-subview');
            SoundFX.playClick();

            practiceSelectors.forEach(b => b.classList.remove('active'));
            practicePanels.forEach(p => p.classList.remove('active'));

            btn.classList.add('active');
            document.getElementById(`practice-${subview}`).classList.add('active');

            if (subview === 'tracing') {
                initTracingCanvas();
            }
        });
    });
}

// --------------------------------------------------------------------
// 8. Study Mode Operations
// --------------------------------------------------------------------
function renderStudyView() {
    const container = document.getElementById('study-groups-list');
    container.innerHTML = '';

    GROUPS.forEach(groupMeta => {
        // Find verbs in this group
        const groupVerbs = VERB_DATA.filter(v => v.group === groupMeta.id);
        if (groupVerbs.length === 0) return;

        const card = document.createElement('div');
        card.className = 'group-card';

        let verbsHtml = '';
        groupVerbs.forEach(verb => {
            const isRead = state.readVerbs.includes(verb.id);
            verbsHtml += `
                <div class="verb-row" id="verb-row-${verb.id}">
                    <div class="verb-meaning-col">
                        <span class="meaning-title malayalam-font">${verb.meaning}</span>
                        <span class="meaning-desc malayalam-font">${verb.grammar}</span>
                    </div>
                    <div class="verb-arabic-col">
                        <span class="arabic-font">${verb.arabic}</span>
                    </div>
                    <div class="audio-btn-wrapper">
                        <button class="audio-btn" data-verb-id="${verb.id}" data-arabic="${verb.arabic}">
                            <svg viewBox="0 0 24 24">
                                <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>
                            </svg>
                        </button>
                    </div>
                </div>
            `;
        });

        card.innerHTML = `
            <div class="group-header">
                <span class="group-title-malayalam malayalam-font">${groupMeta.ml}</span>
                <span class="group-title-arabic arabic-font">${groupVerbs[0].groupTitleAr.split('(')[0]}</span>
            </div>
            <div class="verbs-list">
                ${verbsHtml}
            </div>
        `;

        container.appendChild(card);
    });

    // Wire up pronunciation speaker click events
    container.addEventListener('click', (e) => {
        const audioBtn = e.target.closest('.audio-btn');
        if (audioBtn) {
            const verbId = parseInt(audioBtn.getAttribute('data-verb-id'));
            const textToSpeak = audioBtn.getAttribute('data-arabic');
            
            SoundFX.playClick();
            speakArabic(textToSpeak);

            // Save reading progress
            if (!state.readVerbs.includes(verbId)) {
                state.readVerbs.push(verbId);
                state.stars += 2; // Reward stars for studying!
                saveState();
            }
        }
    });
}

// --------------------------------------------------------------------
// 8B. Study 2 Mode Operations
// --------------------------------------------------------------------
function renderStudy2View() {
    const container = document.getElementById('study2-grid');
    if (!container) return;
    container.innerHTML = '';
    
    VERB_DATA.forEach(verb => {
        const card = document.createElement('div');
        card.className = 'study2-card';
        card.innerHTML = `
            <span class="card-arabic arabic-font">${verb.arabic}</span>
            <span class="card-meaning malayalam-font">${verb.meaning}</span>
        `;
        
        card.addEventListener('click', () => {
            SoundFX.playClick();
            card.classList.toggle('show-meaning');
            
            // Save reading progress
            if (card.classList.contains('show-meaning')) {
                if (!state.readVerbs.includes(verb.id)) {
                    state.readVerbs.push(verb.id);
                    state.stars += 2; // Reward stars for studying!
                    saveState();
                    updateStatsDisplay();
                }
            }
        });
        
        container.appendChild(card);
    });
}

// --------------------------------------------------------------------
// 9. Practice View Operations
// --------------------------------------------------------------------
let flashcardIndex = 0;
let revealIndex = 0;

function initPracticeView() {
    // A. Setup Flashcards
    flashcardIndex = 0;
    updateFlashcard();
    
    // B. Setup Reveal Cards
    revealIndex = Math.floor(Math.random() * VERB_DATA.length);
    updateRevealCard();
}

// Flashcard Panel
const fcCard = document.getElementById('flashcard-element');

// Navigation functions
function nextFlashcard() {
    SoundFX.playClick();
    fcCard.classList.remove('flipped');
    setTimeout(() => {
        flashcardIndex = (flashcardIndex + 1) % VERB_DATA.length;
        updateFlashcard();
    }, 150);
}

function prevFlashcard() {
    SoundFX.playClick();
    fcCard.classList.remove('flipped');
    setTimeout(() => {
        flashcardIndex = (flashcardIndex - 1 + VERB_DATA.length) % VERB_DATA.length;
        updateFlashcard();
    }, 150);
}

// Swipe detection logic
let touchStartX = 0;
let touchStartY = 0;
let touchEndX = 0;
let touchEndY = 0;
let isSwipeAction = false;

fcCard.addEventListener('touchstart', (e) => {
    const touch = e.touches[0];
    touchStartX = touch.clientX;
    touchStartY = touch.clientY;
    isSwipeAction = false;
}, { passive: true });

fcCard.addEventListener('touchmove', (e) => {
    const touch = e.touches[0];
    touchEndX = touch.clientX;
    touchEndY = touch.clientY;
    
    const diffX = touchEndX - touchStartX;
    const diffY = touchEndY - touchStartY;
    
    // If finger moves more than 15px, mark as swipe to prevent flipping on release
    if (Math.abs(diffX) > 15 || Math.abs(diffY) > 15) {
        isSwipeAction = true;
    }
}, { passive: true });

fcCard.addEventListener('touchend', (e) => {
    if (isSwipeAction) {
        const diffX = touchEndX - touchStartX;
        const diffY = touchEndY - touchStartY;
        
        if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 50) {
            // Horizontal swipe
            if (diffX < 0) {
                nextFlashcard();
            } else {
                prevFlashcard();
            }
        }
    }
}, { passive: true });

fcCard.addEventListener('click', () => {
    if (isSwipeAction) {
        isSwipeAction = false;
        return;
    }
    SoundFX.playClick();
    fcCard.classList.toggle('flipped');
});

// Keyboard Navigation
window.addEventListener('keydown', (e) => {
    const practiceView = document.getElementById('practice-view');
    const flashcardsPanel = document.getElementById('practice-flashcards');
    
    // Only capture when practice tab and flashcards subview are active
    if (practiceView && practiceView.classList.contains('active') &&
        flashcardsPanel && flashcardsPanel.classList.contains('active')) {
        
        if (e.key === 'ArrowRight') {
            nextFlashcard();
        } else if (e.key === 'ArrowLeft') {
            prevFlashcard();
        } else if (e.key === ' ' || e.key === 'ArrowUp' || e.key === 'ArrowDown') {
            e.preventDefault();
            SoundFX.playClick();
            fcCard.classList.toggle('flipped');
        }
    }
});

document.getElementById('fc-btn-next').addEventListener('click', nextFlashcard);
document.getElementById('fc-btn-prev').addEventListener('click', prevFlashcard);

document.getElementById('fc-btn-speak').addEventListener('click', (e) => {
    e.stopPropagation();
    SoundFX.playClick();
    const currentVerb = VERB_DATA[flashcardIndex];
    speakArabic(currentVerb.arabic);
});

function updateFlashcard() {
    const verb = VERB_DATA[flashcardIndex];
    document.getElementById('card-front-arabic').innerText = verb.arabic;
    document.getElementById('card-front-pronoun').innerText = verb.pronoun;
    document.getElementById('card-back-meaning').innerText = verb.meaning;
    document.getElementById('card-back-grammar').innerText = verb.grammar;
}

// Reveal Self-Practice Card
const revealSecret = document.getElementById('reveal-secret');
revealSecret.addEventListener('click', () => {
    if (revealSecret.classList.contains('blurred')) {
        SoundFX.playCorrect();
        revealSecret.classList.remove('blurred');
        document.getElementById('reveal-prompt-text').innerText = "നിങ്ങൾ ഊഹിച്ച ഉത്തരം ശരിയായിരുന്നോ? താഴെയുള്ള ബട്ടണുകൾ ഉപയോഗിക്കൂ!";
    }
});

document.getElementById('rev-btn-correct').addEventListener('click', () => {
    SoundFX.playClick();
    state.totalCorrect++;
    state.stars += 1;
    saveState();
    
    loadNextRevealWord();
});

document.getElementById('rev-btn-wrong').addEventListener('click', () => {
    SoundFX.playWrong();
    loadNextRevealWord();
});

function loadNextRevealWord() {
    revealSecret.classList.add('blurred');
    document.getElementById('reveal-prompt-text').innerText = "അർത്ഥം മനസ്സിൽ ഓർത്തു നോക്കൂ, കാണാൻ മുകളിൽ തൊടുക!";
    
    // Choose a new random word
    let newIndex = Math.floor(Math.random() * VERB_DATA.length);
    while (newIndex === revealIndex && VERB_DATA.length > 1) {
        newIndex = Math.floor(Math.random() * VERB_DATA.length);
    }
    revealIndex = newIndex;
    updateRevealCard();
}

function updateRevealCard() {
    const verb = VERB_DATA[revealIndex];
    document.getElementById('reveal-arabic').innerText = verb.arabic;
    document.getElementById('reveal-pronoun').innerText = verb.pronoun;
    document.getElementById('reveal-meaning').innerText = verb.meaning;
}

// --------------------------------------------------------------------
// 11. Game Arcade Handler (Overlay Controller)
// --------------------------------------------------------------------
let activeGameId = 0;
let gameScore = 0;
let gameTotalQuestions = 0;
let gameCorrectAnswers = 0;

const gameOverlay = document.getElementById('game-overlay-container');
const gameWorkspace = document.getElementById('game-play-workspace');
const resultsBoard = document.getElementById('game-results-board');

// Bind menu click events to open games
document.querySelectorAll('.game-selection-card').forEach(card => {
    card.addEventListener('click', () => {
        const gameId = parseInt(card.getAttribute('data-game'));
        SoundFX.playClick();
        launchGame(gameId);
    });
});

document.getElementById('game-btn-back').addEventListener('click', () => {
    SoundFX.playClick();
    exitGame();
});

document.getElementById('results-btn-done').addEventListener('click', () => {
    SoundFX.playClick();
    exitGame();
});

// --------------------------------------------------------------------
// Game Verb Templates (Random verbs: play, jump, hide, run, eat, study, go)
// --------------------------------------------------------------------
const VERB_TEMPLATES = [
    {
        verb: 'يَذْهَبُ',
        baseMeaning: 'പോകുന്നു',
        forms: ['يَذْهَبُ', 'يَذْهَبَانِ', 'يَذْهَبُونَ', 'تَذْهَبُ', 'تَذْهَبَانِ', 'يَذْهَبْنَ']
    },
    {
        verb: 'يَلْعَبُ',
        baseMeaning: 'കളിക്കുന്നു',
        forms: ['يَلْعَبُ', 'يَلْعَبَانِ', 'يَلْعَبُونَ', 'تَلْعَبُ', 'تَلْعَبَانِ', 'يَلْعَبْنَ']
    },
    {
        verb: 'يَقْفِزُ',
        baseMeaning: 'ചാടുന്നു',
        forms: ['يَقْفِزُ', 'يَقْفِزَانِ', 'يَقْفِزُونَ', 'تَقْفِزُ', 'تَقْفِزَانِ', 'يَقْفِزْنَ']
    },
    {
        verb: 'يَخْتَبِئُ',
        baseMeaning: 'ഒളിക്കുന്നു',
        forms: ['يَخْتَبِئُ', 'يَخْتَبِئَانِ', 'يَخْتَبِئُونَ', 'تَخْتَبِئُ', 'تَخْتَبِئَانِ', 'يَخْتَبِئْنَ']
    },
    {
        verb: 'يَجْرِي',
        baseMeaning: 'ഓടുന്നു',
        forms: ['يَجْرِي', 'يَجْرِيَانِ', 'يَجْرُونَ', 'تَجْرِي', 'تَجْرِيَانِ', 'يَجْرِينَ']
    },
    {
        verb: 'يَأْكُلُ',
        baseMeaning: 'തിന്നുന്നു',
        forms: ['يَأْكُلُ', 'يَأْكُلَانِ', 'يَأْكُلُونَ', 'تَأْكُلُ', 'تَأْكُلَانِ', 'يَأْكُلْنَ']
    },
    {
        verb: 'يَدْرُسُ',
        baseMeaning: 'പഠിക്കുന്നു',
        forms: ['يَدْرُسُ', 'يَدْرُسَانِ', 'يَدْرُسُونَ', 'تَدْرُسُ', 'تَدْرُسَانِ', 'يَدْرُسْنَ']
    }
];

const PRONOUN_FORMS = [
    { id: 1, pronoun: 'هُوَ', meaning: 'അവൻ' },
    { id: 2, pronoun: 'هُما (مذكر)', meaning: 'അവർ രണ്ടുപേർ (പുരുഷന്മാർ)' },
    { id: 3, pronoun: 'هُمْ', meaning: 'അവർ (പുരുഷന്മാർ)' },
    { id: 4, pronoun: 'هِيَ', meaning: 'അവൾ' },
    { id: 5, pronoun: 'هُما (مؤنث)', meaning: 'അവർ രണ്ടുപേർ (സ്ത്രീകൾ)' },
    { id: 6, pronoun: 'هُنَّ', meaning: 'അവർ (സ്ത്രീകൾ)' }
];

let currentGameData = [];
let currentMemoryPairs = [];

function launchGame(gameId) {
    activeGameId = gameId;
    gameScore = 0;
    gameCorrectAnswers = 0;
    gameTotalQuestions = 0;
    
    // Choose a random verb template
    const template = VERB_TEMPLATES[Math.floor(Math.random() * VERB_TEMPLATES.length)];
    
    // Generate game dataset dynamically
    currentGameData = PRONOUN_FORMS.map((p, index) => {
        return {
            id: p.id,
            arabic: `${template.forms[index]} <span class="game-verb-clue malayalam-font">(${template.baseMeaning})</span>`,
            rawArabic: template.forms[index],
            pronoun: p.pronoun,
            meaning: p.meaning,
            grammar: ''
        };
    });
    
    currentMemoryPairs = currentGameData.map(item => {
        return {
            meaning: item.meaning,
            verb: item.arabic
        };
    });
    
    // Reset views inside overlay
    gameWorkspace.style.display = 'flex';
    resultsBoard.style.display = 'none';
    document.getElementById('game-score-count').innerText = '0';
    
    // Set titles
    const gameTitles = {
        1: "അർത്ഥ പൊരുത്തം",
        2: "മൾട്ടിപ്പിൾ ചോയ്സ് ക്വിസ്",
        3: "ബലൂൺ പോപ്പ്",
        4: "സ്പീഡ് ചലഞ്ച്",
        5: "മെമ്മറി മാച്ച്"
    };
    if (gameId === 3) {
        document.getElementById('game-title-display').innerText = gameTitles[gameId];
    } else {
        document.getElementById('game-title-display').innerText = `${gameTitles[gameId]} (${template.verb} - ${template.baseMeaning})`;
    }
    
    // Activate overlay
    gameOverlay.classList.add('active');
    
    // Start specific game
    switch(gameId) {
        case 1: startGame1(); break;
        case 2: startGame2(); break;
        case 3: startGame3(); break;
        case 4: startGame4(); break;
        case 5: startGame5(); break;
    }
}

function exitGame() {
    // Clear any timers or global intervals
    if (game4Timer) clearInterval(game4Timer);
    if (balloonAnimationId) cancelAnimationFrame(balloonAnimationId);
    
    gameOverlay.classList.remove('active');
    updateStatsDisplay();
}

function displayGameResults(title, finalScore, correct, totalStarsEarned) {
    gameWorkspace.style.display = 'none';
    
    document.getElementById('results-title-text').innerText = title;
    document.getElementById('results-score-val').innerText = finalScore;
    document.getElementById('results-correct-val').innerText = correct;
    document.getElementById('results-stars-gained').innerText = totalStarsEarned;
    
    resultsBoard.style.display = 'flex';
    
    // Save state score
    const key = `g${activeGameId}`;
    if (finalScore > state.highScores[key]) {
        state.highScores[key] = finalScore;
    }
    state.stars += totalStarsEarned;
    state.totalCorrect += correct;
    saveState();
    
    Confetti.spawn(100);
    SoundFX.playCorrect();
}

// Shuffles an array helper
function shuffle(array) {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}

// --------------------------------------------------------------------
// GAME 1: Match the Pronoun (Connecting Pairs)
// --------------------------------------------------------------------
let g1SelectedMeaning = null;
let g1SelectedVerb = null;

function startGame1() {
    gameWorkspace.innerHTML = `
        <div class="match-instruction malayalam-font">
            ഇടതുവശത്തെ അർത്ഥവും വലതുവശത്തെ ശരിയായ ക്രിയാരൂപവും ജോടിയാക്കുക!
        </div>
        <div class="match-game-cols">
            <div class="match-col match-col-pronouns" id="g1-pronoun-col"></div>
            <div class="match-col match-col-verbs" id="g1-verb-col"></div>
        </div>
    `;
    
    // Choose 6 random verbs
    const selectedVerbs = shuffle(currentGameData).slice(0, 6);
    
    // Generate left side (Meanings) and right side (Verbs)
    const shuffledMeanings = shuffle(selectedVerbs);
    const shuffledVerbs = shuffle(selectedVerbs);
    
    const pCol = document.getElementById('g1-pronoun-col');
    const vCol = document.getElementById('g1-verb-col');
    
    shuffledMeanings.forEach(v => {
        const el = document.createElement('div');
        el.className = 'match-item malayalam-font';
        el.style.fontSize = '0.82rem';
        el.innerText = v.meaning;
        el.setAttribute('data-id', v.id);
        el.addEventListener('click', () => handleG1Click('meaning', el));
        pCol.appendChild(el);
    });
    
    shuffledVerbs.forEach(v => {
        const el = document.createElement('div');
        el.className = 'match-item';
        el.innerHTML = v.arabic;
        el.setAttribute('data-id', v.id);
        el.addEventListener('click', () => handleG1Click('verb', el));
        vCol.appendChild(el);
    });
}

function handleG1Click(type, element) {
    SoundFX.playClick();
    
    if (type === 'meaning') {
        const parent = element.parentNode;
        parent.querySelectorAll('.match-item').forEach(c => c.classList.remove('selected'));
        
        if (g1SelectedMeaning === element) {
            g1SelectedMeaning = null;
        } else {
            g1SelectedMeaning = element;
            element.classList.add('selected');
        }
    } else {
        const parent = element.parentNode;
        parent.querySelectorAll('.match-item').forEach(c => c.classList.remove('selected'));
        
        if (g1SelectedVerb === element) {
            g1SelectedVerb = null;
        } else {
            g1SelectedVerb = element;
            element.classList.add('selected');
        }
    }
    
    // Check if we have a pair selected
    if (g1SelectedMeaning && g1SelectedVerb) {
        const id1 = g1SelectedMeaning.getAttribute('data-id');
        const id2 = g1SelectedVerb.getAttribute('data-id');
        
        const currentM = g1SelectedMeaning;
        const currentV = g1SelectedVerb;
        
        if (id1 === id2) {
            // Match success!
            setTimeout(() => {
                SoundFX.playCorrect();
                currentM.className = 'match-item matched malayalam-font';
                currentV.className = 'match-item matched';
                
                gameScore += 20;
                gameCorrectAnswers++;
                document.getElementById('game-score-count').innerText = gameScore;
                
                // Check if all matched
                const remaining = document.querySelectorAll('.match-col-pronouns .match-item:not(.matched)').length;
                if (remaining === 0) {
                    const starsEarned = Math.round(gameScore / 10);
                    displayGameResults("മാച്ചിങ് വിജയകരമായി പൂർത്തിയാക്കി! 🤝", gameScore, gameCorrectAnswers, starsEarned);
                }
            }, 200);
        } else {
            // Mismatch
            setTimeout(() => {
                SoundFX.playWrong();
                currentM.className = 'match-item mismatch malayalam-font';
                currentV.className = 'match-item mismatch';
                
                gameScore = Math.max(0, gameScore - 5);
                document.getElementById('game-score-count').innerText = gameScore;
                
                setTimeout(() => {
                    currentM.className = 'match-item malayalam-font';
                    currentV.className = 'match-item';
                }, 800);
            }, 200);
        }
        
        g1SelectedMeaning = null;
        g1SelectedVerb = null;
    }
}

// --------------------------------------------------------------------
// GAME 2: MCQ Quiz (10 Dynamic Questions)
// --------------------------------------------------------------------
let g2Questions = [];
let g2CurrentIndex = 0;

function startGame2() {
    g2Questions = [];
    g2CurrentIndex = 0;
    
    // Generate 10 random questions
    const pool = shuffle(currentGameData);
    for (let i = 0; i < 10; i++) {
        const verb = pool[i % pool.length];
        
        // Generate options (1 correct, 2 distractors)
        const distractors = shuffle(currentGameData.filter(v => v.id !== verb.id)).slice(0, 2);
        const options = shuffle([verb, ...distractors]);
        
        g2Questions.push({
            verb: verb,
            options: options
        });
    }
    
    loadG2Question();
}

function loadG2Question() {
    const qData = g2Questions[g2CurrentIndex];
    gameTotalQuestions = 10;
    
    // Choose a prompt layout type
    const showMalayalamPrompt = g2CurrentIndex % 2 === 0;
    
    let questionTextHtml = '';
    if (showMalayalamPrompt) {
        questionTextHtml = `
            <span class="mcq-q-number malayalam-font">ചോദ്യം ${g2CurrentIndex + 1} / 10</span>
            <span class="mcq-malayalam-q malayalam-font">"${qData.verb.meaning}" - ഇതിന്റെ ശരിയായ രൂപം ഏതാണ്?</span>
        `;
    } else {
        questionTextHtml = `
            <span class="mcq-q-number malayalam-font">ചോദ്യം ${g2CurrentIndex + 1} / 10</span>
            <span class="mcq-malayalam-q malayalam-font">ശരിയായ വർത്തമാനകാല രൂപം കണ്ടെത്തുക:</span>
            <span class="mcq-arabic-q arabic-font">${qData.verb.pronoun} ➔ ?</span>
        `;
    }
    
    gameWorkspace.innerHTML = `
        <div class="mcq-question-card">
            ${questionTextHtml}
        </div>
        <div class="mcq-options-container" id="mcq-options-list"></div>
    `;
    
    const list = document.getElementById('mcq-options-list');
    const letters = ['أ', 'ب', 'ت'];
    
    qData.options.forEach((opt, index) => {
        const btn = document.createElement('div');
        btn.className = 'mcq-option';
        btn.setAttribute('data-id', opt.id);
        btn.innerHTML = `
            <span class="mcq-option-letter">${letters[index]}</span>
            <span class="mcq-option-text">${opt.arabic}</span>
        `;
        
        btn.addEventListener('click', () => handleG2Selection(btn, opt.id === qData.verb.id));
        list.appendChild(btn);
    });
}

function handleG2Selection(selectedBtn, isCorrect) {
    const options = document.querySelectorAll('.mcq-option');
    // Disable clicks on all options
    options.forEach(o => o.style.pointerEvents = 'none');
    
    if (isCorrect) {
        SoundFX.playCorrect();
        selectedBtn.classList.add('correct');
        gameScore += 10;
        gameCorrectAnswers++;
        document.getElementById('game-score-count').innerText = gameScore;
    } else {
        SoundFX.playWrong();
        selectedBtn.classList.add('wrong');
        
        // Find and highlight correct answer
        const qData = g2Questions[g2CurrentIndex];
        options.forEach(btn => {
            const optId = parseInt(btn.getAttribute('data-id'));
            if (optId === qData.verb.id) {
                btn.classList.add('correct');
            }
        });
    }
    
    // Load next question or finish after 1.3 seconds
    setTimeout(() => {
        g2CurrentIndex++;
        if (g2CurrentIndex < 10) {
            loadG2Question();
        } else {
            const stars = Math.round(gameScore / 10);
            displayGameResults("ക്വിസ് പൂർത്തിയാക്കി! ❓", gameScore, gameCorrectAnswers, stars);
        }
    }, 1300);
}

// --------------------------------------------------------------------
// GAME 3: Balloon Pop (Catch the floating words)
// --------------------------------------------------------------------
let balloonAnimationId = null;
let balloons = [];
let g3TargetVerb = null;
const BALLOON_COLORS = [
    'linear-gradient(135deg, #e74c3c, #c0392b)',
    'linear-gradient(135deg, #3498db, #2980b9)',
    'linear-gradient(135deg, #9b59b6, #8e44ad)',
    'linear-gradient(135deg, #e67e22, #d35400)',
    'linear-gradient(135deg, #1abc9c, #16a085)',
    'linear-gradient(135deg, #2ecc71, #27ae60)'
];

function startGame3() {
    gameWorkspace.innerHTML = `
        <div class="balloon-q-bar malayalam-font" id="g3-target-bar">
            താഴെ തന്നിരിക്കുന്നതിന് അനുയോജ്യമായ ക്രിയയുള്ള ബലൂൺ പൊട്ടിക്കുക!
        </div>
        <div class="balloon-play-area" id="g3-arena"></div>
    `;
    
    balloons = [];
    selectG3Target();
    
    // Spawn initial 4 balloons
    const arena = document.getElementById('g3-arena');
    setTimeout(() => {
        const arenaWidth = arena.clientWidth || 320;
        const arenaHeight = arena.clientHeight || 320;
        
        for (let i = 0; i < 4; i++) {
            spawnBalloon(arena, arenaWidth, arenaHeight, true);
        }
        
        animateBalloons(arena, arenaWidth, arenaHeight);
    }, 100);
}

function selectG3Target() {
    g3TargetVerb = shuffle(VERB_DATA)[0];
    
    const banner = document.getElementById('g3-target-bar');
    if (banner) {
        banner.innerHTML = `ശരിയായ ബലൂൺ അടിക്കുക: <br>( ${g3TargetVerb.meaning} )`;
    }
}

function spawnBalloon(arena, width, height, initialY = false) {
    const el = document.createElement('div');
    el.className = 'balloon';
    
    // Pick a random verb form (either target, or random)
    const isTarget = Math.random() < 0.35;
    const verb = isTarget ? g3TargetVerb : shuffle(VERB_DATA)[0];
    
    // Styling
    const color = BALLOON_COLORS[Math.floor(Math.random() * BALLOON_COLORS.length)];
    el.style.background = color;
    
    // String
    const str = document.createElement('div');
    str.className = 'balloon-string';
    el.appendChild(str);
    
    // Label
    const label = document.createElement('div');
    label.className = 'balloon-label';
    label.innerText = verb.arabic;
    el.appendChild(label);
    
    arena.appendChild(el);
    
    // Speed: slower for children
    const speed = Math.random() * 0.7 + 0.8;
    
    // Setup balloon object
    balloons.push({
        element: el,
        verb: verb,
        x: Math.random() * (width - 80),
        y: initialY ? Math.random() * (height - 120) + 50 : height + 10,
        speedY: speed,
        width: 75,
        height: 90
    });
    
    el.addEventListener('mousedown', (e) => handleBalloonClick(e, balloons[balloons.length - 1]));
    el.addEventListener('touchstart', (e) => handleBalloonClick(e, balloons[balloons.length - 1]));
}

function handleBalloonClick(e, balloon) {
    if (e) e.preventDefault();
    if (balloon.element.classList.contains('pop-anim')) return;
    
    balloon.element.classList.add('pop-anim');
    SoundFX.playPop();
    
    const isCorrect = balloon.verb.id === g3TargetVerb.id;
    
    if (isCorrect) {
        gameScore += 20;
        gameCorrectAnswers++;
        document.getElementById('game-score-count').innerText = gameScore;
        
        // Success flash
        const bar = document.getElementById('g3-target-bar');
        bar.style.backgroundColor = 'var(--correct)';
        setTimeout(() => {
            bar.style.backgroundColor = 'var(--primary)';
        }, 500);
        
        // Advance target
        selectG3Target();
    } else {
        gameScore = Math.max(0, gameScore - 5);
        document.getElementById('game-score-count').innerText = gameScore;
        
        // Failure flash
        const bar = document.getElementById('g3-target-bar');
        bar.style.backgroundColor = 'var(--wrong)';
        setTimeout(() => {
            bar.style.backgroundColor = 'var(--primary)';
        }, 500);
    }
    
    // Spawn replacement balloon
    const arena = document.getElementById('g3-arena');
    const width = arena.clientWidth || 320;
    const height = arena.clientHeight || 320;
    
    setTimeout(() => {
        // Remove popped element
        balloon.element.remove();
        balloons = balloons.filter(b => b !== balloon);
        spawnBalloon(arena, width, height);
    }, 200);
    
    // End game after 8 correct pops
    if (gameCorrectAnswers >= 8) {
        cancelAnimationFrame(balloonAnimationId);
        const stars = Math.round(gameScore / 10);
        displayGameResults("ഗംഭീരം! ബലൂണുകൾ മുഴുവൻ തകർത്തു! 🎈", gameScore, gameCorrectAnswers, stars);
    }
}

function animateBalloons(arena, width, height) {
    balloons.forEach(b => {
        b.y -= b.speedY;
        
        // Wave sway motion using sine
        const sway = Math.sin(b.y / 20) * 0.8;
        b.x = Math.max(0, Math.min(width - 80, b.x + sway));
        
        b.element.style.transform = `translate(${b.x}px, ${b.y}px)`;
        
        // If floated off-screen
        if (b.y < -120) {
            b.y = height + 10;
            b.x = Math.random() * (width - 80);
            // Cycle the word on the balloon so it stays fresh
            b.verb = shuffle(VERB_DATA)[0];
            b.element.querySelector('.balloon-label').innerText = b.verb.arabic;
        }
    });
    
    balloonAnimationId = requestAnimationFrame(() => animateBalloons(arena, width, height));
}

// --------------------------------------------------------------------
// GAME 4: Speed Challenge (60s Countdown Timer)
// --------------------------------------------------------------------
let game4Timer = null;
let game4SecondsLeft = 60;
let g4CurrentTarget = null;

function startGame4() {
    gameWorkspace.innerHTML = `
        <div class="speed-bar-container">
            <span class="speed-timer malayalam-font">
                ⏱️ <span id="g4-timer-seconds">60</span>
            </span>
            <div class="speed-timer-progress">
                <div class="speed-timer-fill" id="g4-timer-bar"></div>
            </div>
        </div>
        <div class="speed-challenge-card">
            <span class="speed-prompt-desc malayalam-font">അർത്ഥം:</span>
            <span class="speed-prompt-meaning malayalam-font" id="g4-prompt">അവൻ ഒരു പുരുഷൻ പ്രവർത്തിക്കും</span>
        </div>
        <div class="speed-answers-grid" id="g4-buttons-grid"></div>
    `;
    
    game4SecondsLeft = 60;
    loadG4Question();
    
    // Start countdown
    const fillBar = document.getElementById('g4-timer-bar');
    const timerLabel = document.getElementById('g4-timer-seconds');
    
    game4Timer = setInterval(() => {
        game4SecondsLeft--;
        timerLabel.innerText = `${game4SecondsLeft}`;
        
        const pct = (game4SecondsLeft / 60) * 100;
        fillBar.style.width = `${pct}%`;
        
        if (game4SecondsLeft <= 0) {
            clearInterval(game4Timer);
            const stars = Math.round(gameScore / 10);
            displayGameResults("സമയം അവസാനിച്ചു! ⚡", gameScore, gameCorrectAnswers, stars);
        }
    }, 1000);
}

function loadG4Question() {
    g4CurrentTarget = shuffle(currentGameData)[0];
    document.getElementById('g4-prompt').innerText = g4CurrentTarget.meaning;
    
    // Generate answers (1 correct, 3 distractors)
    const pool = shuffle(currentGameData.filter(v => v.id !== g4CurrentTarget.id));
    const dist = pool.slice(0, 3);
    const options = shuffle([g4CurrentTarget, ...dist]);
    
    const grid = document.getElementById('g4-buttons-grid');
    grid.innerHTML = '';
    
    options.forEach(opt => {
        const btn = document.createElement('button');
        btn.className = 'speed-answer-btn';
        btn.setAttribute('data-id', opt.id);
        btn.innerHTML = opt.arabic;
        btn.addEventListener('click', () => handleG4Click(btn, opt.id === g4CurrentTarget.id));
        grid.appendChild(btn);
    });
}

function handleG4Click(btn, isCorrect) {
    const btns = document.querySelectorAll('.speed-answer-btn');
    btns.forEach(b => b.style.pointerEvents = 'none');
    
    if (isCorrect) {
        SoundFX.playPop();
        btn.classList.add('correct');
        gameScore += 10;
        gameCorrectAnswers++;
        document.getElementById('game-score-count').innerText = gameScore;
    } else {
        SoundFX.playWrong();
        btn.classList.add('wrong');
        
        // Find correct and show green
        btns.forEach(b => {
            const optId = parseInt(b.getAttribute('data-id'));
            if (optId === g4CurrentTarget.id) {
                b.classList.add('correct');
            }
        });
        
        // Deduct speed time penalty
        game4SecondsLeft = Math.max(0, game4SecondsLeft - 2);
    }
    
    setTimeout(() => {
        loadG4Question();
    }, 600);
}

// --------------------------------------------------------------------
// GAME 5: Memory Match Grid Game
// --------------------------------------------------------------------
let g5FlippedCards = [];
let g5MatchedCount = 0;
let g5StartTime = 0;

function startGame5() {
    gameWorkspace.innerHTML = `
        <div class="match-instruction malayalam-font" id="g5-timer-banner">
            കാർഡുകൾ മറിച്ചു നോക്കി ക്രിയകളും അവയുടെ അർത്ഥങ്ങളും തമ്മിലുള്ള ജോഡികൾ പൊരുത്തപ്പെടുത്തുക!
        </div>
        <div class="memory-grid" id="g5-grid"></div>
    `;
    
    g5FlippedCards = [];
    g5MatchedCount = 0;
    g5StartTime = Date.now();
    
    // Build deck of cards (6 meanings, 6 matching verbs)
    const deck = [];
    currentMemoryPairs.forEach((pair, index) => {
        deck.push({
            type: 'meaning',
            text: pair.meaning,
            pairIndex: index
        });
        deck.push({
            type: 'verb',
            text: pair.verb,
            pairIndex: index
        });
    });
    
    const shuffledDeck = shuffle(deck);
    const grid = document.getElementById('g5-grid');
    
    shuffledDeck.forEach((cardData, idx) => {
        const card = document.createElement('div');
        card.className = 'memory-card';
        card.setAttribute('data-idx', idx);
        
        const isMeaning = cardData.type === 'meaning';
        card.innerHTML = `
            <div class="memory-card-inner">
                <div class="memory-card-front">
                    <svg viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17h-2v-2h2v2zm2.07-7.75l-.9.92C13.45 12.9 13 13.5 13 15h-2v-.5c0-1.1.45-2.1 1.17-2.83l1.24-1.26c.37-.36.59-.86.59-1.41 0-1.1-.9-2-2-2s-2 .9-2 2H7c0-2.76 2.24-5 5-5s5 2.24 5 5c0 1.04-.42 1.99-1.07 2.75z"/></svg>
                  </div>
                <div class="memory-card-back ${cardData.type} ${isMeaning ? 'malayalam-font' : ''}">
                    ${cardData.text}
                </div>
            </div>
        `;
        
        card.addEventListener('click', () => handleMemoryFlip(card, cardData));
        grid.appendChild(card);
    });
}

function handleMemoryFlip(cardEl, cardData) {
    if (cardEl.classList.contains('flipped') || cardEl.classList.contains('matched') || g5FlippedCards.length >= 2) {
        return;
    }
    
    SoundFX.playClick();
    cardEl.classList.add('flipped');
    g5FlippedCards.push({ element: cardEl, data: cardData });
    
    if (g5FlippedCards.length === 2) {
        const first = g5FlippedCards[0];
        const second = g5FlippedCards[1];
        
        // Check match
        if (first.data.pairIndex === second.data.pairIndex) {
            // Match success!
            setTimeout(() => {
                SoundFX.playCorrect();
                first.element.classList.add('matched');
                second.element.classList.add('matched');
                
                gameScore += 25;
                gameCorrectAnswers++;
                document.getElementById('game-score-count').innerText = gameScore;
                
                g5FlippedCards = [];
                g5MatchedCount++;
                
                if (g5MatchedCount === 6) {
                    const elapsed = Math.round((Date.now() - g5StartTime) / 1000);
                    // Speed score bonus
                    const timeBonus = Math.max(0, 60 - elapsed) * 2;
                    gameScore += timeBonus;
                    const stars = Math.round(gameScore / 10);
                    
                    displayGameResults(
                        `വിജയിച്ചു! മെമ്മറി ഗെയിം ${elapsed} സെക്കന്റിൽ പൂർത്തിയാക്കി! 🃏`,
                        gameScore,
                        gameCorrectAnswers,
                        stars
                    );
                }
            }, 600);
        } else {
            // Match failure
            setTimeout(() => {
                SoundFX.playWrong();
                first.element.classList.remove('flipped');
                second.element.classList.remove('flipped');
                g5FlippedCards = [];
            }, 1200);
        }
    }
}

// --------------------------------------------------------------------
// 12. Reset System Progress
// --------------------------------------------------------------------
document.getElementById('btn-reset-data').addEventListener('click', () => {
    const confirmReset = confirm("നിങ്ങളുടെ പഠന വിവരങ്ങളും സ്കോറുകളും പൂർണ്ണമായി മായ്ക്കണം എന്ന് ഉറപ്പാണോ?");
    if (confirmReset) {
        state = {
            stars: 0,
            totalCorrect: 0,
            readVerbs: [],
            highScores: { g1: 0, g2: 0, g3: 0, g4: 0, g5: 0 },
            unlockedBadges: []
        };
        localStorage.removeItem('arabic_mudhari_state');
        
        // Remove unlocked classes from UI elements
        document.querySelectorAll('.badge-card').forEach(card => {
            card.classList.remove('unlocked');
            card.querySelector('.badge-status').innerText = 'ലഭിച്ചിട്ടില്ല';
        });
        
        SoundFX.playWrong();
        updateStatsDisplay();
        renderStudyView();
        renderStudy2View();
        
        alert("പഠന ഡാറ്റ വിജയകരമായി മായ്ച്ചിരിക്കുന്നു!");
    }
});

// --------------------------------------------------------------------
// 13. Application Entrypoint / Bootloader
// --------------------------------------------------------------------
// --------------------------------------------------------------------
// 14. LRS Learning Online Hub Interaction
// --------------------------------------------------------------------
document.getElementById('btn-lrs-hub').addEventListener('click', () => {
    SoundFX.playWrong();
    alert('Locked 🔒');
});

window.addEventListener('DOMContentLoaded', () => {
    // Initializing state
    loadState();
    
    // Render initial views
    renderStudyView();
    renderStudy2View();
    initTabNavigation();
    
    // Prep Confetti
    Confetti.init();
});
