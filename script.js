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
// Topic Cards Interaction
// ============================================
const topicButtons = document.querySelectorAll('.topic-card .btn-secondary');
topicButtons.forEach((button, index) => {
    button.addEventListener('click', function() {
        progressTracker.completeLesson();
        
        // Show feedback
        const originalText = this.textContent;
        this.textContent = '✓ Completed';
        this.disabled = true;
        
        setTimeout(() => {
            this.textContent = originalText;
            this.disabled = false;
        }, 2000);
    });
});

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
