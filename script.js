/**
 * AtClass - Math Learning App
 * Main JavaScript file for navigation and interactivity
 */

// DOM Elements
const menuToggle = document.getElementById('menuToggle');
const nav = document.getElementById('nav');
const navLinks = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('.section');
const startBtn = document.getElementById('startBtn');

// Lesson navigation elements
const lessonContent = document.getElementById('lessonContent');
const nextBtn = document.getElementById('nextBtn');
const prevBtn = document.getElementById('prevBtn');
const backBtn = document.getElementById('backBtn');

// State for lesson navigation
let lessonsData = [];
let currentTopicId = null;
let currentLessonIndex = 0;
let selectedGrade = null;

// ============================================
// Course Data Structure
// ============================================
const courseData = {
    1: {
        name: "1º de Primaria",
        topics: [
            { id: "num-01", name: "Números del 0 al 10", description: "Aprender a contar y reconocer números" },
            { id: "num-02", name: "Números del 11 al 99", description: "Decenas y unidades" },
            { id: "sum-01", name: "Sumas Básicas", description: "Sumas simples hasta 20" },
            { id: "res-01", name: "Restas Básicas", description: "Restas simples hasta 20" }
        ]
    },
    2: {
        name: "2º de Primaria",
        topics: [
            { id: "num-03", name: "Números hasta 999", description: "Centenas, decenas y unidades" },
            { id: "sum-02", name: "Sumas Mayores", description: "Sumar números de 2 cifras" },
            { id: "res-02", name: "Restas Mayores", description: "Restar números de 2 cifras" },
            { id: "mul-01", name: "Introducción a la Multiplicación", description: "Las tablas de multiplicar" }
        ]
    },
    3: {
        name: "3º de Primaria",
        topics: [
            { id: "mul-02", name: "Tablas de Multiplicación", description: "Memorizar tablas del 1 al 10" },
            { id: "div-01", name: "Introducción a la División", description: "Repartir en partes iguales" },
            { id: "frac-01", name: "Fracciones Simples", description: "Medios, tercios y cuartos" },
            { id: "med-01", name: "Medir y Pesar", description: "Longitud, peso y capacidad" }
        ]
    },
    4: {
        name: "4º de Primaria",
        topics: [
            { id: "dec-01", name: "Números con Punto", description: "Décimas y centésimas" },
            { id: "frac-02", name: "Fracciones Iguales", description: "Fracciones igual, diferentes formas" },
            { id: "mul-03", name: "Multiplicación Avanzada", description: "Multiplicar números de 2-3 dígitos" },
            { id: "geo-01", name: "Geometría Básica", description: "Formas, ángulos y perímetro" }
        ]
    },
    5: {
        name: "5º de Primaria",
        topics: [
            { id: "dec-02", name: "Decimales: Operaciones", description: "Sumar, restar y multiplicar decimales" },
            { id: "porc-01", name: "Porcentajes", description: "Calcular porcentajes de cantidades" },
            { id: "alg-01", name: "Introducción al Álgebra", description: "Variables y ecuaciones básicas" },
            { id: "est-01", name: "Datos y Gráficos", description: "Media, moda y mediana" }
        ]
    },
    6: {
        name: "6º de Primaria",
        topics: [
            { id: "alg-02", name: "Ecuaciones con Números", description: "Resolver ecuaciones y expresiones" },
            { id: "geo-02", name: "Figuras y Espacios", description: "Área, volumen y transformaciones" },
            { id: "prob-01", name: "Desafíos Matemáticos", description: "Problemas matemáticos complejos" },
            { id: "prop-01", name: "Comparar Cantidades", description: "Razones y proporciones" }
        ]
    }
};

// ============================================
// Text-to-Speech (Matheo's Voice) with Tiger Roars
// ============================================
let speechSynthesis = window.speechSynthesis;
let currentUtterance = null;
let isSpeaking = false;
let voicesLoaded = false;
let voiceCheckAttempts = 0;
const maxVoiceCheckAttempts = 10;
let audioContext = null;
let tigerRoarEnabled = true;

// Check if speech synthesis is supported
if (typeof speechSynthesis !== 'undefined' && speechSynthesis) {
    console.log('✅ Web Speech API supported');

    // Function to check voices periodically
    function checkVoices() {
        voiceCheckAttempts++;
        const voices = speechSynthesis.getVoices();

        if (voices.length > 0) {
            voicesLoaded = true;
            console.log(`✅ Voices loaded: ${voices.length} total`);
            const spanishVoices = voices.filter(v => v.lang.startsWith('es'));
            console.log(`🇪🇸 Spanish voices: ${spanishVoices.length}`);

            if (spanishVoices.length > 0) {
                console.log('Spanish voices available:', spanishVoices.map(v => v.name));
            } else {
                console.warn('⚠️ No Spanish voices found - will use default voice');
            }
        } else if (voiceCheckAttempts < maxVoiceCheckAttempts) {
            // Try again in 500ms
            setTimeout(checkVoices, 500);
        } else {
            console.error('❌ No voices found after multiple attempts');
            voicesLoaded = false;
        }
    }

    // Event when voices change
    speechSynthesis.onvoiceschanged = function() {
        console.log('🔄 Voices changed event fired');
        checkVoices();
        updateVoiceStatusIndicator();
    };

    // Start checking voices
    checkVoices();

    // Force voice loading by creating a dummy utterance
    setTimeout(() => {
        if (!voicesLoaded) {
            console.log('🔧 Attempting to force voice loading...');
            const dummy = new SpeechSynthesisUtterance(' ');
            speechSynthesis.speak(dummy);
            speechSynthesis.cancel();
            setTimeout(checkVoices, 100);
        }
    }, 100);

} else {
    console.error('❌ Web Speech API not supported');
    alert('Tu navegador no soporta síntesis de voz. Prueba con Chrome, Edge o Safari.');
}

// Function to initialize Web Audio API for tiger roars
function initAudioContext() {
    if (!audioContext) {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (audioContext.state === 'suspended') {
        audioContext.resume();
    }
    return audioContext;
}

// Generate tiger roar using Web Audio API
function playTigerRoar(intensity = 1) {
    return new Promise((resolve) => {
        if (!tigerRoarEnabled) {
            resolve();
            return;
        }
        
        try {
            const ctx = initAudioContext();
            const duration = 1.0 + Math.random() * 0.6; // Longer roar
            const now = ctx.currentTime;
            
            const oscillator1 = ctx.createOscillator();
            const oscillator2 = ctx.createOscillator();
            const oscillator3 = ctx.createOscillator();
            const noiseGain = ctx.createGain();
            const mainGain = ctx.createGain();
            const filter = ctx.createBiquadFilter();
            const filter2 = ctx.createBiquadFilter();
            const distortion = ctx.createWaveShaper();
            
            // Create distortion curve for growl effect
            const samples = 44100;
            const curve = new Float32Array(samples);
            const deg = Math.PI / 180;
            for (let i = 0; i < samples; i++) {
                const x = (i * 2) / samples - 1;
                curve[i] = ((3 + 50 * intensity) * x * 20 * deg) / (Math.PI + 50 * intensity * Math.abs(x));
            }
            distortion.curve = curve;
            distortion.oversample = '4x';
            
            oscillator1.type = 'sawtooth';
            oscillator1.frequency.setValueAtTime(80 + Math.random() * 20, now);
            oscillator1.frequency.exponentialRampToValueAtTime(150, now + 0.1);
            oscillator1.frequency.exponentialRampToValueAtTime(60, now + duration);
            
            oscillator2.type = 'square';
            oscillator2.frequency.setValueAtTime(120 + Math.random() * 30, now);
            oscillator2.frequency.exponentialRampToValueAtTime(200, now + 0.08);
            oscillator2.frequency.exponentialRampToValueAtTime(80, now + duration);
            
            oscillator3.type = 'sawtooth';
            oscillator3.frequency.setValueAtTime(40 + Math.random() * 10, now);
            oscillator3.frequency.exponentialRampToValueAtTime(100, now + 0.15);
            oscillator3.frequency.exponentialRampToValueAtTime(30, now + duration);
            
            filter.type = 'lowpass';
            filter.frequency.setValueAtTime(400, now);
            filter.frequency.exponentialRampToValueAtTime(800, now + 0.1);
            filter.frequency.exponentialRampToValueAtTime(200, now + duration);
            filter.Q.value = 5;
            
            filter2.type = 'bandpass';
            filter2.frequency.setValueAtTime(150, now);
            filter2.frequency.exponentialRampToValueAtTime(300, now + 0.1);
            filter2.frequency.exponentialRampToValueAtTime(100, now + duration);
            filter2.Q.value = 2;
            
            const oscGain1 = ctx.createGain();
            const oscGain2 = ctx.createGain();
            const oscGain3 = ctx.createGain();
            oscGain1.gain.setValueAtTime(0.3 * intensity, now);
            oscGain1.gain.exponentialRampToValueAtTime(0.5 * intensity, now + 0.1);
            oscGain1.gain.exponentialRampToValueAtTime(0.1 * intensity, now + duration * 0.7);
            oscGain1.gain.exponentialRampToValueAtTime(0, now + duration);
            
            oscGain2.gain.setValueAtTime(0.2 * intensity, now);
            oscGain2.gain.exponentialRampToValueAtTime(0.4 * intensity, now + 0.08);
            oscGain2.gain.exponentialRampToValueAtTime(0.1 * intensity, now + duration * 0.6);
            oscGain2.gain.exponentialRampToValueAtTime(0, now + duration);
            
            oscGain3.gain.setValueAtTime(0.4 * intensity, now);
            oscGain3.gain.exponentialRampToValueAtTime(0.6 * intensity, now + 0.15);
            oscGain3.gain.exponentialRampToValueAtTime(0.2 * intensity, now + duration * 0.5);
            oscGain3.gain.exponentialRampToValueAtTime(0, now + duration);
            
            mainGain.gain.setValueAtTime(0, now);
            mainGain.gain.linearRampToValueAtTime(0.4 * intensity, now + 0.05);
            mainGain.gain.linearRampToValueAtTime(0.5 * intensity, now + 0.15);
            mainGain.gain.exponentialRampToValueAtTime(0.3 * intensity, now + duration * 0.5);
            mainGain.gain.exponentialRampToValueAtTime(0.01, now + duration);
            
            oscillator1.connect(oscGain1);
            oscillator2.connect(oscGain2);
            oscillator3.connect(oscGain3);
            
            oscGain1.connect(filter);
            oscGain2.connect(filter);
            oscGain3.connect(filter);
            
            filter.connect(filter2);
            filter2.connect(distortion);
            distortion.connect(mainGain);
            
            mainGain.connect(ctx.destination);
            
            oscillator1.start(now);
            oscillator2.start(now);
            oscillator3.start(now);
            
            oscillator1.stop(now + duration);
            oscillator2.stop(now + duration);
            oscillator3.stop(now + duration);
            
            setTimeout(resolve, (duration * 1000) + 100);
        } catch (e) {
            console.error('Error playing tiger roar:', e);
            resolve();
        }
    });
}

// Play continuous tiger growl in background
let tigerGrowlInterval = null;
function startTigerGrowl() {
    if (!tigerRoarEnabled) return;
    
    stopTigerGrowl();
    tigerGrowlInterval = setInterval(() => {
        if (isSpeaking) {
            playTigerRoar(0.15); // Subtle background growl
        }
    }, 2000);
}

function stopTigerGrowl() {
    if (tigerGrowlInterval) {
        clearInterval(tigerGrowlInterval);
        tigerGrowlInterval = null;
    }
}

// Function to get the best available voice - improved for softer, more pleasant voices
function getBestVoice() {
    if (!voicesLoaded || !speechSynthesis) {
        console.log('Voices not loaded or speech synthesis not available');
        return null;
    }

    const voices = speechSynthesis.getVoices();
    console.log(`Checking ${voices.length} available voices`);

    // Priority 1: Soft, friendly Spanish voices
    const spanishVoices = voices.filter(voice => voice.lang && voice.lang.startsWith('es'));
    if (spanishVoices.length > 0) {
        // Look for soft, friendly voices with specific keywords
        const softVoiceKeywords = ['samantha', 'karen', 'monica', 'paulina', 'carmen', 'lucia', 
            'sofia', 'carlos', 'diego', 'ricardo', 'paulina', 'maria', 'laura', 'isabel',
            'female', 'mujer', 'woman', 'español', 'española'];
        
        const friendlyVoice = spanishVoices.find(voice => {
            const nameLower = voice.name.toLowerCase();
            return softVoiceKeywords.some(keyword => nameLower.includes(keyword)) &&
                   !nameLower.includes('zira') && !nameLower.includes('david');
        });
        
        if (friendlyVoice) {
            console.log('Using friendly Spanish voice:', friendlyVoice.name);
            return friendlyVoice;
        }
        
        // Prefer voices with 'Google' or 'Microsoft' as they tend to be more natural
        const naturalVoice = spanishVoices.find(voice => 
            voice.name.includes('Google') || voice.name.includes('Microsoft')
        );
        if (naturalVoice) {
            console.log('Using natural Spanish voice:', naturalVoice.name);
            return naturalVoice;
        }
        
        // Prefer female voices (generally perceived as softer)
        const femaleSpanishVoice = spanishVoices.find(voice =>
            voice.name.toLowerCase().includes('female') ||
            voice.name.toLowerCase().includes('mujer') ||
            voice.name.toLowerCase().includes('woman')
        );
        if (femaleSpanishVoice) {
            console.log('Using female Spanish voice:', femaleSpanishVoice.name);
            return femaleSpanishVoice;
        }
        
        console.log('Using Spanish voice:', spanishVoices[0].name);
        return spanishVoices[0];
    }

    // Priority 2: Any voice that can handle Spanish with soft characteristics
    const anyVoice = voices.find(voice => {
        if (!voice.lang) return false;
        const canHandleSpanish = voice.lang.includes('es') || 
                                 voice.lang.startsWith('en') || 
                                 voice.lang.startsWith('fr') || 
                                 voice.lang.startsWith('it');
        if (!canHandleSpanish) return false;
        
        // Prefer softer, more natural voices
        const nameLower = voice.name.toLowerCase();
        return nameLower.includes('samantha') || 
               nameLower.includes('karen') ||
               nameLower.includes('google') ||
               nameLower.includes('microsoft');
    });

    if (anyVoice) {
        console.log('Using compatible voice:', anyVoice.name, `(${anyVoice.lang})`);
        return anyVoice;
    }

    // Priority 3: Any voice that can handle Spanish
    const fallbackVoice = voices.find(voice => voice.lang && (
        voice.lang.includes('es') ||
        voice.lang.startsWith('en') ||
        voice.lang.startsWith('fr') ||
        voice.lang.startsWith('it')
    ));

    if (fallbackVoice) {
        console.log('Using compatible voice:', fallbackVoice.name, `(${fallbackVoice.lang})`);
        return fallbackVoice;
    }

    // Priority 4: Default system voice
    if (voices.length > 0) {
        console.log('Using default voice:', voices[0].name, `(${voices[0].lang})`);
        return voices[0];
    }

    console.warn('No suitable voice found');
    return null;
}

async function speakExplanation(text, topicTitle) {
    // Check if speech synthesis is available
    if (!speechSynthesis) {
        alert('Lo siento, tu navegador no soporta síntesis de voz. Prueba con Chrome, Edge o Safari.');
        return;
    }

    if (!voicesLoaded) {
        console.warn('Voices not loaded yet, attempting to speak anyway');
    }

    // Cancel any ongoing speech
    speechSynthesis.cancel();
    stopTigerGrowl();
    
    // Play tiger roar at the start (powerful)
    await playTigerRoar(0.7);
    
    // Add a small delay before speaking
    await new Promise(resolve => setTimeout(resolve, 300));

    // Create utterance
    currentUtterance = new SpeechSynthesisUtterance();
    currentUtterance.text = `Rrrr... Hola, soy Matheo el tigre. Rrrr... Vamos a aprender sobre ${topicTitle}. ${text}`;

    // Set the best available voice
    const bestVoice = getBestVoice();
    if (bestVoice) {
        currentUtterance.voice = bestVoice;
        console.log('Using voice:', bestVoice.name);
    } else {
        // Fallback to language setting
        currentUtterance.lang = 'es-ES';
        console.log('Using language fallback: es-ES');
    }

    // Adjust speech parameters for tiger-like voice (lower pitch, slower)
    currentUtterance.rate = 0.75;  // Slower for tiger-like speech
    currentUtterance.pitch = 0.6;  // Much lower pitch for tiger sound
    currentUtterance.volume = 0.8;  // Good volume

    // Update button state
    currentUtterance.onstart = () => {
        console.log('Tiger speech started');
        isSpeaking = true;
        updatePlayButton(true);
        startTigerGrowl();
    };

    currentUtterance.onend = () => {
        console.log('Tiger speech ended');
        isSpeaking = false;
        stopTigerGrowl();
        updatePlayButton(false);
        // Play a powerful tiger roar at the end
        playTigerRoar(0.6);
    };

    currentUtterance.onerror = (error) => {
        console.error('Tiger speech error:', error);
        isSpeaking = false;
        stopTigerGrowl();
        updatePlayButton(false);

        // Show user-friendly error message
        let errorMessage = 'Error al reproducir voz.';
        if (error.error === 'not-allowed') {
            errorMessage += ' Verifica los permisos de audio en tu navegador.';
        } else if (error.error === 'no-speech') {
            errorMessage += ' No se pudo generar el audio.';
        } else {
            errorMessage += ` Detalles: ${error.error}`;
        }

        alert(errorMessage);
    };

    // Speak
    try {
        speechSynthesis.speak(currentUtterance);
        console.log('Speech synthesis initiated');
    } catch (error) {
        console.error('Error initiating speech:', error);
        alert('Error al iniciar la síntesis de voz.');
    }
}

function stopSpeaking() {
    speechSynthesis.cancel();
    isSpeaking = false;
    updatePlayButton(false);
}

function updatePlayButton(speaking) {
    const playBtn = document.getElementById('matheoPlayBtn');
    if (playBtn) {
        if (speaking) {
            playBtn.innerHTML = '⏸ Pausar';
            playBtn.classList.add('speaking');
        } else {
            playBtn.innerHTML = '▶ Escuchar';
            playBtn.classList.remove('speaking');
        }
    }
}

// ============================================
// Topic Content Structure
// ============================================
const getVideoContent = (topicId) => {
    const videos = {
        "num-01": `
            <svg viewBox="0 0 800 400" xmlns="http://www.w3.org/2000/svg" style="width: 100%; height: auto; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 8px;">
                <text x="100" y="80" font-size="40" font-weight="bold" fill="white">¡Aprenderemos a contar!</text>
                <g id="counting-animation">
                    <text x="150" y="180" font-size="60" font-weight="bold" fill="white" class="number-text">0</text>
                    <text x="150" y="270" font-size="50" fill="yellow">●</text>
                </g>
                <g id="circles-group" transform="translate(150, 250)">
                    <circle cx="0" cy="0" r="20" fill="yellow" class="circle-1"></circle>
                    <circle cx="50" cy="0" r="20" fill="yellow" class="circle-2"></circle>
                    <circle cx="100" cy="0" r="20" fill="yellow" class="circle-3"></circle>
                </g>
                <text x="150" y="350" font-size="24" fill="white" text-anchor="middle">0, 1, 2, 3... ¡Contar es mágico!</text>
            </svg>
        `,
        "num-02": `
            <svg viewBox="0 0 800 400" xmlns="http://www.w3.org/2000/svg" style="width: 100%; height: auto; background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); border-radius: 8px;">
                <text x="100" y="80" font-size="40" font-weight="bold" fill="white">Decenas y Unidades</text>
                <g transform="translate(100, 150)">
                    <text x="0" y="50" font-size="30" font-weight="bold" fill="white">Número: 35</text>
                    <rect x="0" y="80" width="60" height="60" fill="#ffeb3b" stroke="white" stroke-width="3" rx="5"></rect>
                    <text x="30" y="117" font-size="24" font-weight="bold" text-anchor="middle" fill="#333">3</text>
                    <text x="30" y="150" font-size="16" text-anchor="middle" fill="#333">Decenas</text>
                    <circle cx="150" cy="110" r="20" fill="#4caf50" stroke="white" stroke-width="3"></circle>
                    <circle cx="180" cy="110" r="20" fill="#4caf50" stroke="white" stroke-width="3"></circle>
                    <circle cx="210" cy="110" r="20" fill="#4caf50" stroke="white" stroke-width="3"></circle>
                    <circle cx="240" cy="110" r="20" fill="#4caf50" stroke="white" stroke-width="3"></circle>
                    <circle cx="270" cy="110" r="20" fill="#4caf50" stroke="white" stroke-width="3"></circle>
                    <text x="210" y="160" font-size="16" text-anchor="middle" fill="white">5 Unidades</text>
                </g>
                <text x="400" y="350" font-size="24" fill="white" text-anchor="middle">35 = 30 + 5 = 3 decenas + 5 unidades</text>
            </svg>
        `,
        "sum-01": `
            <svg viewBox="0 0 800 400" xmlns="http://www.w3.org/2000/svg" style="width: 100%; height: auto; background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%); border-radius: 8px;">
                <text x="400" y="60" font-size="48" font-weight="bold" fill="white" text-anchor="middle">3 + 2 = 5</text>
                <g transform="translate(80, 150)">
                    <circle cx="30" cy="30" r="20" fill="#ffb74d" stroke="white" stroke-width="2"></circle>
                    <circle cx="70" cy="30" r="20" fill="#ffb74d" stroke="white" stroke-width="2"></circle>
                    <circle cx="110" cy="30" r="20" fill="#ffb74d" stroke="white" stroke-width="2"></circle>
                    <text x="70" y="80" font-size="20" fill="white" text-anchor="middle">3 manzanas</text>
                </g>
                <text x="350" y="50" font-size="32" fill="white" font-weight="bold">+</text>
                <g transform="translate(420, 150)">
                    <circle cx="30" cy="30" r="20" fill="#81c784" stroke="white" stroke-width="2"></circle>
                    <circle cx="70" cy="30" r="20" fill="#81c784" stroke="white" stroke-width="2"></circle>
                    <text x="50" y="80" font-size="20" fill="white" text-anchor="middle">2 peras</text>
                </g>
                <text x="650" y="50" font-size="32" fill="white" font-weight="bold">=</text>
                <g transform="translate(700, 130)">
                    <circle cx="-30" cy="0" r="15" fill="#ff7043" stroke="white" stroke-width="2"></circle>
                    <circle cx="0" cy="0" r="15" fill="#ff7043" stroke="white" stroke-width="2"></circle>
                    <circle cx="30" cy="0" r="15" fill="#ff7043" stroke="white" stroke-width="2"></circle>
                    <circle cx="-15" cy="35" r="15" fill="#ff7043" stroke="white" stroke-width="2"></circle>
                    <circle cx="15" cy="35" r="15" fill="#ff7043" stroke="white" stroke-width="2"></circle>
                </g>
                <text x="400" y="340" font-size="20" fill="white" text-anchor="middle" font-weight="bold">Juntamos todos y contamos: ¡5 frutas!</text>
            </svg>
        `,
        "res-01": `
            <svg viewBox="0 0 800 400" xmlns="http://www.w3.org/2000/svg" style="width: 100%; height: auto; background: linear-gradient(135deg, #fa709a 0%, #fee140 100%); border-radius: 8px;">
                <text x="400" y="60" font-size="48" font-weight="bold" fill="white" text-anchor="middle">5 - 2 = 3</text>
                <g transform="translate(60, 150)">
                    <circle cx="30" cy="30" r="20" fill="#81c784" stroke="white" stroke-width="2"></circle>
                    <circle cx="70" cy="30" r="20" fill="#81c784" stroke="white" stroke-width="2"></circle>
                    <circle cx="110" cy="30" r="20" fill="#81c784" stroke="white" stroke-width="2"></circle>
                    <circle cx="150" cy="30" r="20" fill="#81c784" stroke="white" stroke-width="2"></circle>
                    <circle cx="190" cy="30" r="20" fill="#81c784" stroke="white" stroke-width="2"></circle>
                    <text x="110" y="80" font-size="20" fill="white" text-anchor="middle">Tenemos 5</text>
                </g>
                <text x="350" y="50" font-size="32" fill="white" font-weight="bold">-</text>
                <g transform="translate(420, 150)">
                    <circle cx="30" cy="30" r="20" fill="#ef5350" stroke="white" stroke-width="3"></circle>
                    <circle cx="70" cy="30" r="20" fill="#ef5350" stroke="white" stroke-width="3"></circle>
                    <text x="50" y="80" font-size="20" fill="white" text-anchor="middle">Quitamos 2</text>
                </g>
                <text x="650" y="50" font-size="32" fill="white" font-weight="bold">=</text>
                <g transform="translate(700, 150)">
                    <circle cx="30" cy="30" r="20" fill="#42a5f5" stroke="white" stroke-width="2"></circle>
                    <circle cx="70" cy="30" r="20" fill="#42a5f5" stroke="white" stroke-width="2"></circle>
                    <circle cx="110" cy="30" r="20" fill="#42a5f5" stroke="white" stroke-width="2"></circle>
                    <text x="70" y="80" font-size="20" fill="white" text-anchor="middle">Quedan 3</text>
                </g>
                <text x="400" y="340" font-size="20" fill="white" text-anchor="middle" font-weight="bold">¡Restar es lo opuesto a sumar!</text>
            </svg>
        `,
        "mul-01": `
            <svg viewBox="0 0 800 400" xmlns="http://www.w3.org/2000/svg" style="width: 100%; height: auto; background: linear-gradient(135deg, #a8edea 0%, #fed6e3 100%); border-radius: 8px;">
                <text x="400" y="60" font-size="48" font-weight="bold" fill="#333" text-anchor="middle">3 × 2 = 6</text>
                <text x="400" y="110" font-size="24" fill="#555" text-anchor="middle">(3 grupos de 2)</text>
                <g transform="translate(80, 160)">
                    <circle cx="20" cy="20" r="15" fill="#ff6b6b" stroke="#333" stroke-width="2"></circle>
                    <circle cx="50" cy="20" r="15" fill="#ff6b6b" stroke="#333" stroke-width="2"></circle>
                    <rect x="0" y="0" width="70" height="60" stroke="#333" stroke-width="2" fill="none" rx="5"></rect>
                    <text x="35" y="90" font-size="16" text-anchor="middle" fill="#333">Grupo 1</text>
                </g>
                <g transform="translate(350, 160)">
                    <circle cx="20" cy="20" r="15" fill="#4ecdc4" stroke="#333" stroke-width="2"></circle>
                    <circle cx="50" cy="20" r="15" fill="#4ecdc4" stroke="#333" stroke-width="2"></circle>
                    <rect x="0" y="0" width="70" height="60" stroke="#333" stroke-width="2" fill="none" rx="5"></rect>
                    <text x="35" y="90" font-size="16" text-anchor="middle" fill="#333">Grupo 2</text>
                </g>
                <g transform="translate(620, 160)">
                    <circle cx="20" cy="20" r="15" fill="#ffe66d" stroke="#333" stroke-width="2"></circle>
                    <circle cx="50" cy="20" r="15" fill="#ffe66d" stroke="#333" stroke-width="2"></circle>
                    <rect x="0" y="0" width="70" height="60" stroke="#333" stroke-width="2" fill="none" rx="5"></rect>
                    <text x="35" y="90" font-size="16" text-anchor="middle" fill="#333">Grupo 3</text>
                </g>
                <text x="400" y="340" font-size="20" fill="#333" text-anchor="middle" font-weight="bold">¡Multiplicar es sumar grupos iguales!</text>
            </svg>
        `,
        "div-01": `
            <svg viewBox="0 0 800 400" xmlns="http://www.w3.org/2000/svg" style="width: 100%; height: auto; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 8px;">
                <text x="400" y="60" font-size="48" font-weight="bold" fill="white" text-anchor="middle">6 ÷ 2 = 3</text>
                <text x="400" y="110" font-size="24" fill="white" text-anchor="middle">(Dividir 6 en 2 grupos iguales)</text>
                <g transform="translate(100, 180)">
                    <circle cx="30" cy="20" r="15" fill="#ffeb3b" stroke="white" stroke-width="2"></circle>
                    <circle cx="70" cy="20" r="15" fill="#ffeb3b" stroke="white" stroke-width="2"></circle>
                    <circle cx="110" cy="20" r="15" fill="#ffeb3b" stroke="white" stroke-width="2"></circle>
                    <text x="70" y="60" font-size="16" fill="white" text-anchor="middle">Grupo 1 (3)</text>
                </g>
                <text x="350" y="110" font-size="32" fill="white" font-weight="bold">÷ 2 =</text>
                <g transform="translate(500, 180)">
                    <circle cx="30" cy="20" r="15" fill="#81c784" stroke="white" stroke-width="2"></circle>
                    <circle cx="70" cy="20" r="15" fill="#81c784" stroke="white" stroke-width="2"></circle>
                    <circle cx="110" cy="20" r="15" fill="#81c784" stroke="white" stroke-width="2"></circle>
                    <text x="70" y="60" font-size="16" fill="white" text-anchor="middle">Grupo 2 (3)</text>
                </g>
                <text x="400" y="340" font-size="20" fill="white" text-anchor="middle" font-weight="bold">¡Dividir es repartir en partes iguales!</text>
            </svg>
        `
    };
    
    return videos[topicId] || `
        <div style="padding: 40px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 8px; text-align: center;">
            <p style="font-size: 24px; color: white; font-weight: bold;">Vídeo Educativo en desarrollo</p>
            <p style="color: #e0e0e0;">Matheo está preparando un vídeo especial para este tema</p>
        </div>
    `;
};

const topicContent = {
    "num-01": {
        title: "Números del 0 al 10",
        explanation: "Los números del 0 al 10 son los primeros números que aprendemos. Son la base para contar objetos, personas y cosas en nuestro día a día. Cada número representa una cantidad diferente.",
        diagram: `
            <div class="diagram">
                <h3>Visualización de Números</h3>
                <div class="number-visual">
                    <div class="number-item"><span>0</span><img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40'%3E%3Ccircle cx='20' cy='20' r='15' fill='%23ddd'/%3E%3C/svg%3E" alt="0"></div>
                    <div class="number-item"><span>1</span>🔵</div>
                    <div class="number-item"><span>2</span>🔵🔵</div>
                    <div class="number-item"><span>3</span>🔵🔵🔵</div>
                    <div class="number-item"><span>5</span>🔵🔵🔵🔵🔵</div>
                    <div class="number-item"><span>10</span>🔵🔵🔵🔵🔵🔵🔵🔵🔵🔵</div>
                </div>
            </div>
        `
    },
    "num-02": {
        title: "Números del 11 al 99",
        explanation: "Los números del 11 al 99 tienen dos dígitos: decenas y unidades. Las decenas son grupos de 10, y las unidades son los números que quedan. Por ejemplo, 25 tiene 2 decenas (20) y 5 unidades.",
        diagram: `
            <div class="diagram">
                <h3>Decenas y Unidades</h3>
                <div class="place-value">
                    <div class="place-item">
                        <h4>Ejemplo: 25</h4>
                        <div class="tens">2 DECENAS = 20</div>
                        <div class="ones">5 UNIDADES = 5</div>
                        <div class="total">TOTAL = 25</div>
                    </div>
                    <div class="place-item">
                        <h4>Ejemplo: 47</h4>
                        <div class="tens">4 DECENAS = 40</div>
                        <div class="ones">7 UNIDADES = 7</div>
                        <div class="total">TOTAL = 47</div>
                    </div>
                </div>
            </div>
        `
    },
    "sum-01": {
        title: "Sumas Básicas",
        explanation: "La suma es cuando juntamos dos grupos de cosas para contar el total. El símbolo + significa suma, y el símbolo = significa que el resultado viene después. Por ejemplo, 3 + 2 = 5 significa que si tenemos 3 de algo y agregamos 2, tenemos 5.",
        diagram: `
            <div class="diagram">
                <h3>Cómo funciona la suma</h3>
                <div class="addition-visual">
                    <div class="sum-row">
                        <span>🍎🍎🍎</span>
                        <span class="plus">+</span>
                        <span>🍎🍎</span>
                        <span class="equals">=</span>
                        <span>🍎🍎🍎🍎🍎</span>
                        <span class="result">5</span>
                    </div>
                    <div class="sum-row">
                        <span>3</span>
                        <span class="plus">+</span>
                        <span>2</span>
                        <span class="equals">=</span>
                        <span class="result">5</span>
                    </div>
                </div>
            </div>
        `
    },
    "res-01": {
        title: "Restas Básicas",
        explanation: "La resta es cuando quitamos un grupo de cosas de otro grupo para saber cuánto queda. El símbolo - significa resta. Por ejemplo, 5 - 2 = 3 significa que si tenemos 5 de algo y quitamos 2, quedan 3.",
        diagram: `
            <div class="diagram">
                <h3>Cómo funciona la resta</h3>
                <div class="subtraction-visual">
                    <div class="sub-row">
                        <span>🍎🍎🍎🍎🍎</span>
                        <span class="minus">-</span>
                        <span>🍎🍎</span>
                        <span class="equals">=</span>
                        <span>🍎🍎🍎</span>
                        <span class="result">3</span>
                    </div>
                    <div class="sub-row">
                        <span>5</span>
                        <span class="minus">-</span>
                        <span>2</span>
                        <span class="equals">=</span>
                        <span class="result">3</span>
                    </div>
                </div>
            </div>
        `
    },
    "num-03": {
        title: "Números hasta 999",
        explanation: "Los números hasta 999 tienen tres dígitos: centenas, decenas y unidades. Las centenas son grupos de 100, muy útiles para contar cantidades grandes de objetos.",
        diagram: `
            <div class="diagram">
                <h3>Centenas, Decenas y Unidades</h3>
                <div class="place-value-3">
                    <div class="place-item">
                        <h4>Ejemplo: 345</h4>
                        <div class="hundreds">3 CENTENAS = 300</div>
                        <div class="tens">4 DECENAS = 40</div>
                        <div class="ones">5 UNIDADES = 5</div>
                        <div class="total">TOTAL = 345</div>
                    </div>
                </div>
            </div>
        `
    },
    "mul-01": {
        title: "Introducción a la Multiplicación",
        explanation: "La multiplicación es una forma rápida de sumar grupos iguales. El símbolo × significa multiplicación. Por ejemplo, 3 × 2 significa tener 3 grupos de 2, que es igual a 6.",
        diagram: `
            <div class="diagram">
                <h3>La multiplicación es suma rápida</h3>
                <div class="multiplication-visual">
                    <div class="mult-row">
                        <span>Grupos: 🔴🔴 | 🔴🔴 | 🔴🔴</span>
                        <span class="equals">=</span>
                        <span class="result">3 grupos de 2 = 6</span>
                    </div>
                    <div class="mult-formula">3 × 2 = 6</div>
                </div>
            </div>
        `
    },
    "mul-02": {
        title: "Tablas de Multiplicación",
        explanation: "Las tablas de multiplicación son multiplicaciones que debemos memorizar. Con ellas podemos calcular rápidamente productos sin tener que contar con los dedos.",
        diagram: `
            <div class="diagram">
                <h3>Tabla del 2 y del 3</h3>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
                    <div>
                        <h4>Tabla del 2</h4>
                        <p>1 × 2 = 2</p>
                        <p>2 × 2 = 4</p>
                        <p>3 × 2 = 6</p>
                        <p>4 × 2 = 8</p>
                        <p>5 × 2 = 10</p>
                    </div>
                    <div>
                        <h4>Tabla del 3</h4>
                        <p>1 × 3 = 3</p>
                        <p>2 × 3 = 6</p>
                        <p>3 × 3 = 9</p>
                        <p>4 × 3 = 12</p>
                        <p>5 × 3 = 15</p>
                    </div>
                </div>
            </div>
        `
    },
    "div-01": {
        title: "Introducción a la División",
        explanation: "La división es repartir algo en partes iguales. El símbolo ÷ significa división. Por ejemplo, 6 ÷ 2 significa dividir 6 cosas en 2 grupos iguales, lo que nos da 3 en cada grupo.",
        diagram: `
            <div class="diagram">
                <h3>Cómo funciona la división</h3>
                <div class="division-visual">
                    <div class="div-row">
                        <span>🍎🍎🍎🍎🍎🍎</span>
                        <span class="divide">÷ 2</span>
                        <span class="equals">=</span>
                        <span>🍎🍎🍎 | 🍎🍎🍎</span>
                        <span class="result">3</span>
                    </div>
                    <div class="div-formula">6 ÷ 2 = 3</div>
                </div>
            </div>
        `
    },
    "frac-01": {
        title: "Fracciones Simples",
        explanation: "Las fracciones representan partes de un todo. 1/2 significa una mitad (una parte de 2), 1/3 significa un tercio (una parte de 3), y 1/4 significa un cuarto (una parte de 4).",
        diagram: `
            <div class="diagram">
                <h3>Partes iguales de un todo</h3>
                <div class="fractions-visual">
                    <div class="fraction-item">
                        <svg width="100" height="100" viewBox="0 0 100 100">
                            <circle cx="50" cy="50" r="45" fill="#e0e7ff" stroke="#6366f1" stroke-width="2"/>
                            <path d="M 50 5 L 50 95" stroke="#6366f1" stroke-width="2"/>
                            <path d="M 5 50 L 95 50" stroke="#6366f1" stroke-width="2"/>
                        </svg>
                        <p>Un medio = 1/2</p>
                    </div>
                    <div class="fraction-item">
                        <svg width="100" height="100" viewBox="0 0 100 100">
                            <circle cx="50" cy="50" r="45" fill="#e0e7ff" stroke="#6366f1" stroke-width="2"/>
                            <path d="M 50 5 L 50 95" stroke="#6366f1" stroke-width="2"/>
                            <path d="M 30 5 Q 30 50 30 95" stroke="#6366f1" stroke-width="2"/>
                            <path d="M 70 5 Q 70 50 70 95" stroke="#6366f1" stroke-width="2"/>
                        </svg>
                        <p>Un tercio = 1/3</p>
                    </div>
                </div>
            </div>
        `
    }
};

// ============================================
// Mobile Menu Toggle
// ============================================
menuToggle.addEventListener('click', function() {
    menuToggle.classList.toggle('active');
    nav.classList.toggle('active');
});

// Close menu when a link is clicked
navLinks.forEach(link => {
    link.addEventListener('click', function(e) {
        e.preventDefault();
        
        // Get the target section
        const targetId = this.getAttribute('href').substring(1);
        
        // Update active section
        showSection(targetId);
        
        // Update active nav link
        navLinks.forEach(l => l.classList.remove('active'));
        this.classList.add('active');
        
        // Close mobile menu
        menuToggle.classList.remove('active');
        nav.classList.remove('active');
    });
});

// ============================================
// Section Navigation
// ============================================
function showSection(sectionId) {
    // Hide all sections
    sections.forEach(section => {
        section.classList.remove('active');
    });
    
    // Show target section
    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
        targetSection.classList.add('active');
    }
}

// Start button click
startBtn.addEventListener('click', function() {
    showSection('course-selection');
    
    // Update nav link
    navLinks.forEach(link => link.classList.remove('active'));
});

// ============================================
// Course Selection
// ============================================
function generateTopicCards(grade) {
    const topicsContainer = document.getElementById('topicsContainer');
    const topicsTitle = document.getElementById('topicsTitle');
    const course = courseData[grade];
    
    if (!course) return;
    
    // Update title
    topicsTitle.textContent = `Temas de ${course.name}`;
    
    // Clear container
    topicsContainer.innerHTML = '';
    
    // Generate topic cards
    course.topics.forEach(topic => {
        const card = document.createElement('div');
        card.className = 'topic-card';
        card.innerHTML = `
            <h3>${topic.name}</h3>
            <p>${topic.description}</p>
            <button class="btn btn-secondary topic-btn" data-topic-id="${topic.id}">Aprender</button>
        `;
        topicsContainer.appendChild(card);
    });
    
    // Re-initialize topic button listeners
    initializeTopicButtons();
    
    // Add listener for "Cambiar Curso" button
    const changeGradeBtn = document.querySelector('.topics-header .btn-secondary');
    if (changeGradeBtn) {
        changeGradeBtn.addEventListener('click', function() {
            showSection('course-selection');
            navLinks.forEach(link => link.classList.remove('active'));
        });
    }
}

function initializeCourseButtons() {
    const courseButtons = document.querySelectorAll('[data-grade]');
    courseButtons.forEach(button => {
        button.addEventListener('click', function() {
            const grade = this.getAttribute('data-grade');
            // Store the selected grade in session
            sessionStorage.setItem('selectedGrade', grade);
            selectedGrade = grade;
            
            // Generate topic cards for this grade
            generateTopicCards(grade);
            
            // Move to topics section
            showSection('topics');
        });
    });
}

// ============================================
// Progress Tracking (Local Storage)
// ============================================
class ProgressTracker {
    constructor() {
        this.storageKey = 'atclass_progress';
        this.data = this.loadProgress();
    }
    
    loadProgress() {
        const saved = localStorage.getItem(this.storageKey);
        return saved ? JSON.parse(saved) : {
            topicsCompleted: 0,
            lessonsDone: 0,
            score: 0
        };
    }
    
    saveProgress() {
        localStorage.setItem(this.storageKey, JSON.stringify(this.data));
        this.updateDisplay();
    }
    
    updateDisplay() {
        const progressCards = document.querySelectorAll('.progress-count');
        if (progressCards.length >= 3) {
            progressCards[0].textContent = this.data.topicsCompleted;
            progressCards[1].textContent = this.data.lessonsDone;
            progressCards[2].textContent = this.data.score + '%';
        }
    }
    
    completeLesson() {
        this.data.lessonsDone++;
        this.data.score = Math.min(100, this.data.score + 10);
        this.saveProgress();
    }
    
    completeTopic() {
        this.data.topicsCompleted++;
        this.saveProgress();
    }
    
    reset() {
        this.data = { topicsCompleted: 0, lessonsDone: 0, score: 0 };
        this.saveProgress();
    }
}

// Initialize progress tracker
const progressTracker = new ProgressTracker();
progressTracker.updateDisplay();

// ============================================
// Lesson Navigation
// ============================================

/**
 * Embedded lessons data
 */
const lessonsDataEmbedded = {
  "topics": [
    {
      "id": "num-01",
      "name": "Números del 0 al 10",
      "description": "Aprender a contar y reconocer números",
      "lessons": [
        {
          "id": "num-01-01",
          "title": "Contar del 0 al 10",
          "content": "Los números del 0 al 10 son la base de las matemáticas. Contar nos permite saber cuántos objetos hay.",
          "examples": [
            { "numbers": "0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10" }
          ]
        },
        {
          "id": "num-01-02",
          "title": "Reconocer números",
          "content": "Cada número representa una cantidad. El 1 es uno, el 2 son dos, el 3 son tres, y así sucesivamente.",
          "examples": [
            { "number": "1", "word": "uno" },
            { "number": "5", "word": "cinco" },
            { "number": "10", "word": "diez" }
          ]
        }
      ]
    },
    {
      "id": "num-02",
      "name": "Números del 11 al 99",
      "description": "Decenas y unidades",
      "lessons": [
        {
          "id": "num-02-01",
          "title": "Las decenas",
          "content": "Una decena es un grupo de 10. Los números 10, 20, 30... son decenas completas.",
          "examples": [
            { "decade": "10", "name": "diez" },
            { "decade": "20", "name": "veinte" },
            { "decade": "30", "name": "treinta" }
          ]
        },
        {
          "id": "num-02-02",
          "title": "Decenas y unidades",
          "content": "Los números tienen dos partes: las decenas (grupos de 10) y las unidades (los que sobran).",
          "examples": [
            { "number": "25", "tens": 2, "ones": 5 },
            { "number": "47", "tens": 4, "ones": 7 }
          ]
        }
      ]
    },
    {
      "id": "sum-01",
      "name": "Sumas Básicas",
      "description": "Sumas simples hasta 20",
      "lessons": [
        {
          "id": "sum-01-01",
          "title": "¿Qué es sumar?",
          "content": "Sumar es juntar dos grupos de cosas para saber cuántas hay en total. El símbolo + significa sumar.",
          "examples": [
            { "expression": "1 + 1", "result": 2 },
            { "expression": "2 + 3", "result": 5 }
          ]
        },
        {
          "id": "sum-01-02",
          "title": "Sumas hasta 10",
          "content": "Podemos sumar números pequeños usando los dedos o contando.",
          "examples": [
            { "expression": "4 + 3", "result": 7 },
            { "expression": "5 + 5", "result": 10 },
            { "expression": "6 + 2", "result": 8 }
          ]
        }
      ]
    },
    {
      "id": "res-01",
      "name": "Restas Básicas",
      "description": "Restas simples hasta 20",
      "lessons": [
        {
          "id": "res-01-01",
          "title": "¿Qué es restar?",
          "content": "Restar es quitar cosas de un grupo. El símbolo - significa restar.",
          "examples": [
            { "expression": "5 - 2", "result": 3 },
            { "expression": "8 - 3", "result": 5 }
          ]
        },
        {
          "id": "res-01-02",
          "title": "Restas hasta 10",
          "content": "Podemos restar números pequeños contando hacia atrás.",
          "examples": [
            { "expression": "7 - 4", "result": 3 },
            { "expression": "9 - 5", "result": 4 },
            { "expression": "10 - 6", "result": 4 }
          ]
        }
      ]
    },
    {
      "id": "arithmetic",
      "name": "Aritmética Básica",
      "description": "Suma, resta, multiplicación, división",
      "lessons": [
        {
          "id": "add-01",
          "title": "Introducción a la Suma",
          "content": "La suma es combinar números. El resultado se llama suma.",
          "examples": [
            { "expression": "2 + 3", "result": 5 },
            { "expression": "5 + 4", "result": 9 }
          ]
        },
        {
          "id": "sub-01",
          "title": "Introducción a la Resta",
          "content": "La resta es quitar números. El resultado se llama diferencia.",
          "examples": [
            { "expression": "5 - 2", "result": 3 },
            { "expression": "9 - 4", "result": 5 }
          ]
        },
        {
          "id": "div-01",
          "title": "Introducción a la División",
          "content": "La división es dividir números en partes iguales. El resultado se llama cociente. La división es lo opuesto a la multiplicación.",
          "audioExplanations": {
            "content": "La división es la operación de repartir un número en partes iguales. Por ejemplo, si tenemos ocho caramelos y queremos repartirlos entre dos niños, cada niño recibe cuatro caramelos.",
            "image": "Esta imagen muestra una representación visual de cómo se divide un número. Puedes ver los objetos separados en grupos iguales.",
            "video": "Este video te mostrará paso a paso cómo resolver problemas de división.",
            "examples": "Veamos los ejemplos: Ocho dividido entre dos es cuatro. Doce dividido entre tres es cuatro. Veinte dividido entre cinco es cuatro."
          },
          "video": "https://www.youtube.com/embed/4ggbHWRhVWw",
          "image": "https://images.unsplash.com/photo-1596462502278-af05595b9e75?w=400&h=300&fit=crop",
          "examples": [
            { "expression": "8 ÷ 2", "result": 4 },
            { "expression": "12 ÷ 3", "result": 4 },
            { "expression": "20 ÷ 5", "result": 4 }
          ]
        }
      ]
    },
    {
      "id": "fractions",
      "name": "Fracciones",
      "description": "Comprensión y trabajo con fracciones",
      "lessons": [
        {
          "id": "frac-01",
          "title": "¿Qué es una Fracción?",
          "content": "Una fracción representa una parte de un todo. Tiene un numerador (arriba) y un denominador (abajo).",
          "examples": [
            { "fraction": "1/2", "description": "Un medio" },
            { "fraction": "3/4", "description": "Tres cuartos" }
          ]
        }
      ]
    },
    {
      "id": "algebra",
      "name": "Álgebra",
      "description": "Ecuaciones, variables y expresiones",
      "lessons": [
        {
          "id": "alg-01",
          "title": "Variables y Expresiones",
          "content": "Las variables son letras que representan números desconocidos. Nos ayudan a escribir expresiones matemáticas.",
          "examples": [
            { "expression": "x + 5", "description": "Un número más 5" },
            { "expression": "2y", "description": "2 veces un número" }
          ]
        }
      ]
    },
    {
      "id": "geometry",
      "name": "Geometría",
      "description": "Formas, ángulos y razonamiento espacial",
      "lessons": [
        {
          "id": "geo-01",
          "title": "Formas Básicas",
          "content": "La geometría se ocupa de las formas, tamaños y posiciones de los objetos.",
          "examples": [
            { "shape": "Círculo", "sides": 0 },
            { "shape": "Triángulo", "sides": 3 },
            { "shape": "Cuadrado", "sides": 4 }
          ]
        }
      ]
    }
  ],
  "exercises": [
    {
      "id": "pri-01",
      "topicId": "num-01",
      "question": "¿Cuántos dedos tiene una mano?",
      "type": "multiple-choice",
      "options": ["3", "5", "7", "10"],
      "correctAnswer": "5",
      "difficulty": "easy"
    },
    {
      "id": "pri-02",
      "topicId": "num-01",
      "question": "¿Qué número viene después del 7?",
      "type": "multiple-choice",
      "options": ["5", "6", "8", "9"],
      "correctAnswer": "8",
      "difficulty": "easy"
    },
    {
      "id": "pri-03",
      "topicId": "num-01",
      "question": "¿Cuántos colores tiene un semáforo?",
      "type": "multiple-choice",
      "options": ["2", "3", "4", "5"],
      "correctAnswer": "3",
      "difficulty": "easy"
    },
    {
      "id": "pri-04",
      "topicId": "num-01",
      "question": "¿Qué número es el 1?",
      "type": "multiple-choice",
      "options": ["cero", "uno", "dos", "tres"],
      "correctAnswer": "uno",
      "difficulty": "easy"
    },
    {
      "id": "pri-05",
      "topicId": "num-01",
      "question": "¿Cuál es el número más grande del 0 al 10?",
      "type": "multiple-choice",
      "options": ["7", "9", "10", "8"],
      "correctAnswer": "10",
      "difficulty": "easy"
    },
    {
      "id": "pri-06",
      "topicId": "num-02",
      "question": "¿Cuántos grupos de 10 hay en el número 30?",
      "type": "multiple-choice",
      "options": ["1", "2", "3", "4"],
      "correctAnswer": "3",
      "difficulty": "easy"
    },
    {
      "id": "pri-07",
      "topicId": "num-02",
      "question": "¿Cuántas unidades tiene el número 25?",
      "type": "multiple-choice",
      "options": ["2", "5", "25", "20"],
      "correctAnswer": "5",
      "difficulty": "easy"
    },
    {
      "id": "pri-08",
      "topicId": "num-02",
      "question": "¿Qué número es 4 decenas y 7 unidades?",
      "type": "multiple-choice",
      "options": ["47", "74", "11", "407"],
      "correctAnswer": "47",
      "difficulty": "easy"
    },
    {
      "id": "pri-09",
      "topicId": "num-02",
      "question": "El número 60 tiene...",
      "type": "multiple-choice",
      "options": ["6 unidades", "6 decenas", "0 decenas", "60 decenas"],
      "correctAnswer": "6 decenas",
      "difficulty": "medium"
    },
    {
      "id": "pri-10",
      "topicId": "sum-01",
      "question": "¿Cuánto es 2 + 3?",
      "type": "multiple-choice",
      "options": ["4", "5", "6", "7"],
      "correctAnswer": "5",
      "difficulty": "easy"
    },
    {
      "id": "pri-11",
      "topicId": "sum-01",
      "question": "Tienes 4 manzanas y te dan 2 más. ¿Cuántas tienes?",
      "type": "multiple-choice",
      "options": ["4", "5", "6", "8"],
      "correctAnswer": "6",
      "difficulty": "easy"
    },
    {
      "id": "pri-12",
      "topicId": "sum-01",
      "question": "¿Cuánto es 5 + 5?",
      "type": "multiple-choice",
      "options": ["8", "9", "10", "11"],
      "correctAnswer": "10",
      "difficulty": "easy"
    },
    {
      "id": "pri-13",
      "topicId": "sum-01",
      "question": "¿Cuánto es 1 + 6?",
      "type": "multiple-choice",
      "options": ["5", "6", "7", "8"],
      "correctAnswer": "7",
      "difficulty": "easy"
    },
    {
      "id": "pri-14",
      "topicId": "sum-01",
      "question": "Si juntas 3 colores con 4 colores, ¿cuántos colores tienes?",
      "type": "multiple-choice",
      "options": ["6", "7", "8", "5"],
      "correctAnswer": "7",
      "difficulty": "easy"
    },
    {
      "id": "pri-15",
      "topicId": "sum-01",
      "question": "¿Cuánto es 8 + 1?",
      "type": "multiple-choice",
      "options": ["7", "8", "9", "10"],
      "correctAnswer": "9",
      "difficulty": "easy"
    },
    {
      "id": "pri-16",
      "topicId": "res-01",
      "question": "¿Cuánto es 5 - 2?",
      "type": "multiple-choice",
      "options": ["2", "3", "4", "5"],
      "correctAnswer": "3",
      "difficulty": "easy"
    },
    {
      "id": "pri-17",
      "topicId": "res-01",
      "question": "Tienes 7 caramelos y te comes 3. ¿Cuántos te quedan?",
      "type": "multiple-choice",
      "options": ["2", "3", "4", "5"],
      "correctAnswer": "4",
      "difficulty": "easy"
    },
    {
      "id": "pri-18",
      "topicId": "res-01",
      "question": "¿Cuánto es 10 - 5?",
      "type": "multiple-choice",
      "options": ["3", "4", "5", "6"],
      "correctAnswer": "5",
      "difficulty": "easy"
    },
    {
      "id": "pri-19",
      "topicId": "res-01",
      "question": "Había 6 pájaros en un árbol. Se volaron 4. ¿Cuántos quedan?",
      "type": "multiple-choice",
      "options": ["1", "2", "3", "4"],
      "correctAnswer": "2",
      "difficulty": "easy"
    },
    {
      "id": "pri-20",
      "topicId": "res-01",
      "question": "¿Cuánto es 9 - 3?",
      "type": "multiple-choice",
      "options": ["5", "6", "7", "8"],
      "correctAnswer": "6",
      "difficulty": "easy"
    },
    {
      "id": "ex-01",
      "topicId": "arithmetic",
      "question": "¿Cuánto es 3 + 4?",
      "type": "multiple-choice",
      "options": ["5", "6", "7", "8"],
      "correctAnswer": "7",
      "difficulty": "easy"
    },
    {
      "id": "ex-02",
      "topicId": "arithmetic",
      "question": "¿Cuánto es 12 - 5?",
      "type": "multiple-choice",
      "options": ["6", "7", "8", "9"],
      "correctAnswer": "7",
      "difficulty": "easy"
    },
    {
      "id": "ex-06",
      "topicId": "arithmetic",
      "question": "¿Cuánto es 10 ÷ 2?",
      "type": "multiple-choice",
      "options": ["4", "5", "6", "7"],
      "correctAnswer": "5",
      "difficulty": "easy"
    },
    {
      "id": "ex-07",
      "topicId": "arithmetic",
      "question": "¿Cuánto es 20 ÷ 4?",
      "type": "multiple-choice",
      "options": ["4", "5", "6", "8"],
      "correctAnswer": "5",
      "difficulty": "easy"
    },
    {
      "id": "ex-08",
      "topicId": "arithmetic",
      "question": "¿Cuánto es 24 ÷ 6?",
      "type": "multiple-choice",
      "options": ["3", "4", "5", "6"],
      "correctAnswer": "4",
      "difficulty": "medium"
    },
    {
      "id": "ex-03",
      "topicId": "fractions",
      "question": "¿Cuánto es 1/2 + 1/4?",
      "type": "multiple-choice",
      "options": ["1/4", "1/2", "3/4", "1"],
      "correctAnswer": "3/4",
      "difficulty": "medium"
    },
    {
      "id": "ex-04",
      "topicId": "algebra",
      "question": "Si x + 5 = 12, ¿cuánto es x?",
      "type": "multiple-choice",
      "options": ["5", "6", "7", "8"],
      "correctAnswer": "7",
      "difficulty": "medium"
    },
    {
      "id": "ex-05",
      "topicId": "geometry",
      "question": "¿Cuántos lados tiene un cuadrado?",
      "type": "multiple-choice",
      "options": ["2", "3", "4", "5"],
      "correctAnswer": "4",
      "difficulty": "easy"
    }
  ]
};

/**
 * Initialize lessons data (no need to fetch anymore)
 */
function loadLessonsData() {
    return lessonsDataEmbedded;
}

/**
 * Play audio explanation for lesson sections
 */
function playAudioLesson(section, text, lessonTitle) {
    speakExplanation(text, lessonTitle);
}

/**
 * Display a lesson
 */
function displayLesson(topicId, lessonIndex) {
    const topic = lessonsData.topics.find(t => t.id === topicId);
    if (!topic || !topic.lessons[lessonIndex]) {
        return;
    }

    const lesson = topic.lessons[lessonIndex];
    currentLessonIndex = lessonIndex;
    currentTopicId = topicId;

    // Create lesson HTML
    let lessonHTML = `
        <h2>${lesson.title}</h2>
        <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 15px;">
            <div style="flex: 1;">
                <p>${lesson.content}</p>
            </div>
            ${lesson.audioExplanations && lesson.audioExplanations.content ? `<button class="audio-btn" onclick="playAudioLesson('content', '${lesson.audioExplanations.content}', '${lesson.title}')">🔊 Escuchar</button>` : ''}
        </div>
    `;

    // Add video and image if they exist
    if (lesson.video || lesson.image) {
        lessonHTML += '<div style="display: flex; flex-wrap: wrap; gap: 20px; margin: 20px 0; align-items: flex-start;">';
        
        if (lesson.image) {
            lessonHTML += `<div style="flex: 1; min-width: 250px;"><img src="${lesson.image}" style="width: 100%; height: auto; border-radius: 8px;">`;
            if (lesson.audioExplanations && lesson.audioExplanations.image) {
                lessonHTML += `<button class="audio-btn" style="width: 100%; margin-top: 8px;" onclick="playAudioLesson('image', '${lesson.audioExplanations.image.replace(/'/g, "\\'")}', '${lesson.title}')">🔊 Audio sobre imagen</button>`;
            }
            lessonHTML += `</div>`;
        }
        
        if (lesson.video) {
            lessonHTML += `<div style="flex: 1; min-width: 250px;"><iframe width="100%" height="315" src="${lesson.video}" title="Lesson Video" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`;
            if (lesson.audioExplanations && lesson.audioExplanations.video) {
                lessonHTML += `<button class="audio-btn" style="width: 100%; margin-top: 8px;" onclick="playAudioLesson('video', '${lesson.audioExplanations.video.replace(/'/g, "\\'")}', '${lesson.title}')">🔊 Audio sobre vídeo</button>`;
            }
            lessonHTML += `</div>`;
        }
        
        lessonHTML += '</div>';
    }

    // Add examples
    if (lesson.examples && lesson.examples.length > 0) {
        lessonHTML += '<div style="display: flex; align-items: center; gap: 10px; margin-top: 20px; margin-bottom: 15px;"><h3 style="margin: 0;">Ejemplos:</h3>';
        if (lesson.audioExplanations && lesson.audioExplanations.examples) {
            lessonHTML += `<button class="audio-btn" onclick="playAudioLesson('examples', '${lesson.audioExplanations.examples.replace(/'/g, "\\'")}', '${lesson.title}')">🔊 Escuchar</button>`;
        }
        lessonHTML += '</div><ul>';
        lesson.examples.forEach(example => {
            if (example.expression) {
                lessonHTML += `<li>${example.expression} = ${example.result}</li>`;
            } else if (example.fraction) {
                lessonHTML += `<li>${example.fraction} - ${example.description}</li>`;
            } else if (example.shape) {
                lessonHTML += `<li>${example.shape} - ${example.sides} lados</li>`;
            } else {
                lessonHTML += `<li>${Object.keys(example).map(k => `${example[k]}`).join(' ')}</li>`;
            }
        });
        lessonHTML += '</ul>';
    }

    lessonContent.innerHTML = lessonHTML;

    // Update navigation buttons
    const hasNextLesson = lessonIndex < topic.lessons.length - 1;
    const hasPrevLesson = lessonIndex > 0;

    nextBtn.disabled = !hasNextLesson;
    prevBtn.disabled = !hasPrevLesson;
}

// Event listeners for lesson navigation
nextBtn.addEventListener('click', function() {
    if (currentTopicId && currentLessonIndex < lessonsData.topics.find(t => t.id === currentTopicId).lessons.length - 1) {
        displayLesson(currentTopicId, currentLessonIndex + 1);
    }
});

prevBtn.addEventListener('click', function() {
    if (currentTopicId && currentLessonIndex > 0) {
        displayLesson(currentTopicId, currentLessonIndex - 1);
    }
});

backBtn.addEventListener('click', function() {
    showSection('topics');
    currentTopicId = null;
    currentLessonIndex = 0;
});

// ============================================
// Content Selection for Lessons
// ============================================
function showContentSelection(topicId) {
    const content = topicContent[topicId];
    const topicCard = document.querySelector(`[data-topic-id="${topicId}"]`).closest('.topic-card');
    const topicTitle = topicCard.querySelector('h3').textContent;
    
    const lessonContent = document.getElementById('lessonContent');
    
    let selectionHTML = `
        <div class="lesson-header">
            <div class="tiger-container">
                <div class="tiger-greeting">🐯</div>
                <div class="tiger-speech">
                    <p>¡Hola! Soy Matheo. Vamos a aprender sobre "${content ? content.title : topicTitle}". ¿Qué quieres ver o hacer?</p>
                </div>
            </div>
        </div>
        
        <div class="content-selection">
            <div class="selection-options">
                <div class="option-card" data-option="video">
                    <div class="option-icon">🎬</div>
                    <h3>Vídeo Educativo</h3>
                    <p>Un vídeo animado donde te muestro cómo funciona este tema paso a paso.</p>
                    <button class="btn btn-primary option-btn">Ver Vídeo</button>
                </div>
                
                <div class="option-card" data-option="diagram">
                    <div class="option-icon">📊</div>
                    <h3>Esquema Visual</h3>
                    <p>Un diagrama interactivo con ejemplos visuales para entender mejor el concepto.</p>
                    <button class="btn btn-primary option-btn">Ver Esquema</button>
                </div>
                
                <div class="option-card" data-option="audio">
                    <div class="option-icon">🔊</div>
                    <h3>Explicación de Voz</h3>
                    <p>Escucha mi explicación hablada mientras ves los ejemplos en pantalla.</p>
                    <button class="btn btn-primary option-btn">Escuchar Audio</button>
                </div>
            </div>
        </div>
    `;
    
    lessonContent.innerHTML = selectionHTML;
    
    // Add event listeners for option buttons
    const optionButtons = document.querySelectorAll('.option-btn');
    optionButtons.forEach(button => {
        button.addEventListener('click', function() {
            const option = this.closest('.option-card').getAttribute('data-option');
            showSelectedContent(topicId, option);
        });
    });
    
    // Speak the selection question
    speakContentSelection(content ? content.title : topicTitle);
}

async function speakContentSelection(topicTitle) {
    if (!speechSynthesis) {
        console.error('Speech synthesis not supported for content selection');
        return;
    }

    if (!voicesLoaded) {
        console.warn('Voices not loaded yet for content selection');
    }

    speechSynthesis.cancel();
    stopTigerGrowl();
    
    // Play tiger roar at the start
    await playTigerRoar(0.7);
    await new Promise(resolve => setTimeout(resolve, 300));

    currentUtterance = new SpeechSynthesisUtterance();
    currentUtterance.text = `Rrrr... Hola, soy Matheo el tigre. Rrrr... Vamos a aprender sobre ${topicTitle}. ¿Qué quieres ver o hacer? Puedes elegir el vídeo educativo, donde te muestro cómo funciona paso a paso con animaciones. O el esquema visual, que es un diagrama con ejemplos para entender mejor. O la explicación de voz, donde te explico todo mientras ves los ejemplos. Elige la opción que más te guste.`;

    // Set the best available voice
    const bestVoice = getBestVoice();
    if (bestVoice) {
        currentUtterance.voice = bestVoice;
    } else {
        currentUtterance.lang = 'es-ES';
    }

    // Tiger-like voice parameters
    currentUtterance.rate = 0.75;
    currentUtterance.pitch = 0.6;
    currentUtterance.volume = 0.8;

    currentUtterance.onstart = () => {
        isSpeaking = true;
        startTigerGrowl();
    };

    currentUtterance.onend = () => {
        isSpeaking = false;
        stopTigerGrowl();
        playTigerRoar(0.5);
    };

    currentUtterance.onerror = (error) => {
        console.error('Content selection speech error:', error);
        isSpeaking = false;
        stopTigerGrowl();
    };

    try {
        speechSynthesis.speak(currentUtterance);
    } catch (error) {
        console.error('Error initiating content selection speech:', error);
    }
}

function showSelectedContent(topicId, option) {
    const content = topicContent[topicId];
    const topicCard = document.querySelector(`[data-topic-id="${topicId}"]`).closest('.topic-card');
    const topicTitle = topicCard.querySelector('h3').textContent;
    const topicDescription = topicCard.querySelector('p').textContent;
    
    const lessonContent = document.getElementById('lessonContent');
    
    let contentHTML = `
        <div class="lesson-header">
            <div class="tiger-container">
                <div class="tiger-greeting">🐯</div>
                <div class="tiger-speech">
                    <p>¡Bien hecho! ¡Perfecto! Vamos con ${option === 'video' ? 'el vídeo' : option === 'diagram' ? 'el esquema' : 'la explicación'}.</p>
                </div>
            </div>
            <div class="lesson-title-section">
                <h2>${content ? content.title : topicTitle}</h2>
            </div>
        </div>
    `;
    
    if (option === 'video') {
        contentHTML += `
            <div class="lesson-video-section">
                <h3>🎬 Vídeo Educativo - Matheo te muestra</h3>
                <div class="video-container">
                    ${getVideoContent(topicId)}
                </div>
            </div>
        `;
    } else if (option === 'diagram') {
        contentHTML += `
            ${content && content.diagram ? `
                <div class="lesson-diagram">
                    <h3>📊 Esquema Visual - Práctica con Matheo</h3>
                    ${content.diagram}
                </div>
            ` : '<p>No hay diagrama disponible para este tema.</p>'}
        `;
    } else if (option === 'audio') {
        contentHTML += `
            <div class="lesson-explanation">
                <div style="display: flex; align-items: flex-start; gap: 15px;">
                    <div style="flex: 1;">
                        <h3 style="margin-top: 0;">📖 Explicación de Matheo</h3>
                        <div class="matheo-explaining">
                            <p style="font-style: italic; font-size: 1.1rem; line-height: 1.8;">
                                "${content ? content.explanation : topicDescription}"
                            </p>
                        </div>
                    </div>
                    <button id="matheoPlayBtn" class="matheo-play-btn" style="white-space: nowrap;">▶ Escuchar</button>
                </div>
            </div>
        `;
    }
    
    // Add button to return to content selection
    contentHTML += `
        <div style="text-align: center; margin: 20px 0;">
            <button id="changeContentBtn" class="btn btn-secondary" style="margin-right: 10px;">
                🔄 Cambiar Opción
            </button>
        </div>
    `;
    
    contentHTML += `
        <div class="lesson-navigation-section" style="margin-top: 30px; padding: 20px; background-color: #f0f9ff; border-radius: 8px;">
            <div style="display: flex; align-items: center; gap: 15px;">
                <div style="font-size: 2rem;">🐯</div>
                <div>
                    <h3 style="margin: 0; color: #0369a1;">Matheo dice:</h3>
                    <p style="margin: 5px 0 0 0;">¡Excelente trabajo! Ya dominaste este tema. Ahora practica resolviendo ejercicios para consolidar tu aprendizaje.</p>
                </div>
            </div>
        </div>
    `;
    
    lessonContent.innerHTML = contentHTML;
    
    // Trigger SVG animations for video content
    if (option === 'video') {
        setTimeout(() => {
            const svg = document.querySelector('.video-container svg');
            if (svg) {
                // Add animation styles dynamically
                const style = document.createElement('style');
                style.textContent = `
                    @keyframes fadeIn { 
                        from { opacity: 0; transform: scale(0.8); } 
                        to { opacity: 1; transform: scale(1); } 
                    }
                    .animate-circle {
                        animation: fadeIn 1s ease-in forwards;
                    }
                `;
                svg.appendChild(style);
                
                // Trigger animations
                const circles = svg.querySelectorAll('.circle-1, .circle-2, .circle-3');
                circles.forEach((circle, index) => {
                    setTimeout(() => {
                        circle.classList.add('animate-circle');
                    }, index * 1000);
                });
                
                // Animate number counting
                const numberText = svg.querySelector('.number-text');
                if (numberText) {
                    let count = 0;
                    const maxCount = 3;
                    const interval = setInterval(() => {
                        numberText.textContent = count;
                        count++;
                        if (count > maxCount) {
                            clearInterval(interval);
                        }
                    }, 1000);
                }
            }
        }, 500);
    }
    
    // Add event listener for change content button
    const changeContentBtn = document.getElementById('changeContentBtn');
    if (changeContentBtn) {
        changeContentBtn.addEventListener('click', () => {
            showContentSelection(currentTopicId);
        });
    }
    
    // Initialize play button for audio option
    if (option === 'audio') {
        const playBtn = document.getElementById('matheoPlayBtn');
        if (playBtn) {
            playBtn.addEventListener('click', function() {
                if (isSpeaking) {
                    stopSpeaking();
                } else {
                    const explanation = content ? content.explanation : topicDescription;
                    const title = content ? content.title : topicTitle;
                    speakExplanation(explanation, title);
                }
            });
        }
    }
    
    // Hide lesson navigation buttons
    document.querySelector('.lesson-navigation').style.display = 'none';
    
    showSection('lessons');
    navLinks.forEach(l => l.classList.remove('active'));
    progressTracker.completeLesson();
}

// ============================================
// Service Worker Registration (PWA)
// ============================================
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js').catch(err => {
        console.log('Service Worker registration failed:', err);
    });
}

// ============================================
// Topic Cards Interaction
// ============================================
function initializeTopicButtons() {
    const topicButtons = document.querySelectorAll('.topic-btn');
    topicButtons.forEach(button => {
        button.addEventListener('click', function() {
            const topicId = this.getAttribute('data-topic-id');
            
            // Store current topic
            currentTopicId = topicId;
            
            // Show content selection for this topic
            showContentSelection(topicId);
            
            showSection('lessons');
            navLinks.forEach(l => l.classList.remove('active'));
        });
    });
}

// ============================================
// Utility Functions
// ============================================

/**
 * Initialize the app
 */
function initApp() {
    // Load lessons data
    const data = loadLessonsData();
    if (data) {
        lessonsData = data;
    }
    
    // Initialize topic buttons
    initializeTopicButtons();
    
    // Initialize course selection buttons
    initializeCourseButtons();
    
    // Set first section as active
    showSection('home');
    
    // Update nav link
    document.querySelector('a[href="#home"]').classList.add('active');
}

/**
 * Get all completed topics
 */
function getCompletedTopics() {
    return progressTracker.data.topicsCompleted;
}

/**
 * Reset all progress
 */
function resetProgress() {
    if (confirm('¿Estás seguro de que quieres reiniciar tu progreso?')) {
        progressTracker.reset();
    }
}

// Initialize app when page is fully loaded
window.addEventListener('load', function() {
    initApp();

    // Check voice status after a short delay
    setTimeout(() => {
        console.log('🔊 Voice system status:');
        checkVoiceStatus();
        updateVoiceStatusIndicator();
    }, 2000);
});

// Function to test voice synthesis
function testVoice() {
    console.log('🧪 Testing voice synthesis...');
    speakExplanation('Esta es una prueba de voz. Si puedes oírme claramente, significa que la síntesis de voz está funcionando correctamente en tu navegador.', 'Prueba de Voz');
}

// Function to check voice status
function checkVoiceStatus() {
    const status = {
        apiSupported: !!speechSynthesis,
        voicesLoaded,
        voiceCount: speechSynthesis ? speechSynthesis.getVoices().length : 0,
        spanishVoices: speechSynthesis ? speechSynthesis.getVoices().filter(v => v.lang.startsWith('es')).length : 0,
        bestVoice: getBestVoice() ? getBestVoice().name : 'None'
    };

    console.table(status);
    updateVoiceStatusIndicator();
    return status;
}

// Function to update voice status indicator
function updateVoiceStatusIndicator() {
    const indicator = document.getElementById('voiceStatus');
    const icon = document.getElementById('voiceIcon');
    const text = document.getElementById('voiceText');

    if (!indicator) return;

    if (!speechSynthesis) {
        indicator.className = 'voice-status voice-unavailable';
        icon.textContent = '❌';
        text.textContent = 'Voz no soportada';
        indicator.style.display = 'flex';
        return;
    }

    if (!voicesLoaded) {
        indicator.className = 'voice-status voice-loading';
        icon.textContent = '⏳';
        text.textContent = 'Cargando voces...';
        indicator.style.display = 'flex';
        return;
    }

    const voices = speechSynthesis.getVoices();
    const spanishVoices = voices.filter(v => v.lang.startsWith('es'));

    if (spanishVoices.length > 0) {
        indicator.className = 'voice-status voice-available';
        icon.textContent = '🔊';
        text.textContent = 'Voz disponible';
    } else if (voices.length > 0) {
        indicator.className = 'voice-status voice-available';
        icon.textContent = '🔊';
        text.textContent = 'Voz básica disponible';
    } else {
        indicator.className = 'voice-status voice-unavailable';
        icon.textContent = '🔇';
        text.textContent = 'Sin voces';
    }

    indicator.style.display = 'flex';
}

// Expose functions globally for testing/console
window.AtClass = {
    resetProgress,
    getCompletedTopics,
    progressTracker,
    testVoice,
    checkVoiceStatus
};
