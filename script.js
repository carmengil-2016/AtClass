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
    showSection('topics');
    
    // Update nav link
    navLinks.forEach(link => link.classList.remove('active'));
    document.querySelector('a[href="#topics"]').classList.add('active');
});

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
      "id": "arithmetic",
      "name": "Basic Arithmetic",
      "description": "Addition, subtraction, multiplication, division",
      "lessons": [
        {
          "id": "add-01",
          "title": "Introduction to Addition",
          "content": "Addition is combining numbers. The result is called the sum.",
          "examples": [
            { "expression": "2 + 3", "result": 5 },
            { "expression": "5 + 4", "result": 9 }
          ]
        },
        {
          "id": "sub-01",
          "title": "Introduction to Subtraction",
          "content": "Subtraction is taking away numbers. The result is called the difference.",
          "examples": [
            { "expression": "5 - 2", "result": 3 },
            { "expression": "9 - 4", "result": 5 }
          ]
        },
        {
          "id": "div-01",
          "title": "Introduction to Division",
          "content": "Division is splitting numbers into equal parts. The result is called the quotient. Division is the opposite of multiplication.",
          "video": "https://www.youtube.com/embed/4ggbHWRhVWw",
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
      "name": "Fractions",
      "description": "Understanding and working with fractions",
      "lessons": [
        {
          "id": "frac-01",
          "title": "What is a Fraction?",
          "content": "A fraction represents a part of a whole. It has a numerator (top) and denominator (bottom).",
          "examples": [
            { "fraction": "1/2", "description": "One half" },
            { "fraction": "3/4", "description": "Three quarters" }
          ]
        }
      ]
    },
    {
      "id": "algebra",
      "name": "Algebra",
      "description": "Equations, variables, and expressions",
      "lessons": [
        {
          "id": "alg-01",
          "title": "Variables and Expressions",
          "content": "Variables are letters that represent unknown numbers. They help us write mathematical expressions.",
          "examples": [
            { "expression": "x + 5", "description": "A number plus 5" },
            { "expression": "2y", "description": "2 times a number" }
          ]
        }
      ]
    },
    {
      "id": "geometry",
      "name": "Geometry",
      "description": "Shapes, angles, and spatial reasoning",
      "lessons": [
        {
          "id": "geo-01",
          "title": "Basic Shapes",
          "content": "Geometry deals with shapes, sizes, and positions of objects.",
          "examples": [
            { "shape": "Circle", "sides": 0 },
            { "shape": "Triangle", "sides": 3 },
            { "shape": "Square", "sides": 4 }
          ]
        }
      ]
    }
  ],
  "exercises": [
    {
      "id": "ex-01",
      "topicId": "arithmetic",
      "question": "What is 3 + 4?",
      "type": "multiple-choice",
      "options": ["5", "6", "7", "8"],
      "correctAnswer": "7",
      "difficulty": "easy"
    },
    {
      "id": "ex-02",
      "topicId": "arithmetic",
      "question": "What is 12 - 5?",
      "type": "multiple-choice",
      "options": ["6", "7", "8", "9"],
      "correctAnswer": "7",
      "difficulty": "easy"
    },
    {
      "id": "ex-06",
      "topicId": "arithmetic",
      "question": "What is 10 ÷ 2?",
      "type": "multiple-choice",
      "options": ["4", "5", "6", "7"],
      "correctAnswer": "5",
      "difficulty": "easy"
    },
    {
      "id": "ex-07",
      "topicId": "arithmetic",
      "question": "What is 20 ÷ 4?",
      "type": "multiple-choice",
      "options": ["4", "5", "6", "8"],
      "correctAnswer": "5",
      "difficulty": "easy"
    },
    {
      "id": "ex-08",
      "topicId": "arithmetic",
      "question": "What is 24 ÷ 6?",
      "type": "multiple-choice",
      "options": ["3", "4", "5", "6"],
      "correctAnswer": "4",
      "difficulty": "medium"
    },
    {
      "id": "ex-03",
      "topicId": "fractions",
      "question": "What is 1/2 + 1/4?",
      "type": "multiple-choice",
      "options": ["1/4", "1/2", "3/4", "1"],
      "correctAnswer": "3/4",
      "difficulty": "medium"
    },
    {
      "id": "ex-04",
      "topicId": "algebra",
      "question": "If x + 5 = 12, what is x?",
      "type": "multiple-choice",
      "options": ["5", "6", "7", "8"],
      "correctAnswer": "7",
      "difficulty": "medium"
    },
    {
      "id": "ex-05",
      "topicId": "geometry",
      "question": "How many sides does a square have?",
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
        <p>${lesson.content}</p>
    `;

    // Add video if exists
    if (lesson.video) {
        lessonHTML += `
        <div style="margin: 20px 0;">
            <iframe width="100%" height="315" src="${lesson.video}" title="Lesson Video" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
        </div>
        `;
    }

    // Add examples
    if (lesson.examples && lesson.examples.length > 0) {
        lessonHTML += '<h3>Examples:</h3><ul>';
        lesson.examples.forEach(example => {
            if (example.expression) {
                lessonHTML += `<li>${example.expression} = ${example.result}</li>`;
            } else if (example.fraction) {
                lessonHTML += `<li>${example.fraction} - ${example.description}</li>`;
            } else if (example.shape) {
                lessonHTML += `<li>${example.shape} - ${example.sides} sides</li>`;
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
// Topic Cards Interaction
// ============================================
function initializeTopicButtons() {
    const topicButtons = document.querySelectorAll('.topic-card .btn-secondary');
    topicButtons.forEach((button, index) => {
        button.addEventListener('click', function() {
            // Get the topic ID from the topic card
            const topicCard = this.closest('.topic-card');
            const topicTitle = topicCard.querySelector('h3').textContent;
            const topic = lessonsData.topics.find(t => t.name === topicTitle);

            if (topic && topic.lessons.length > 0) {
                displayLesson(topic.id, 0);
                showSection('lessons');
                
                // Update nav link
                navLinks.forEach(l => l.classList.remove('active'));
            }

            progressTracker.completeLesson();
        });
    });
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
// Utility Functions
// ============================================

/**
 * Initialize the app
 */
function initApp() {
    console.log('AtClass initialized');
    
    // Load lessons data
    const data = loadLessonsData();
    if (data) {
        lessonsData = data;
    }
    
    // Initialize topic buttons
    initializeTopicButtons();
    
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
    if (confirm('Are you sure you want to reset your progress?')) {
        progressTracker.reset();
    }
}

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', initApp);

// Expose functions globally for testing/console
window.AtClass = {
    resetProgress,
    getCompletedTopics,
    progressTracker
};
