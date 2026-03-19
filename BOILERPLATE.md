# AtClass - Math Learning Mobile Web App

A lightweight, mobile-first web application for learning mathematics. This boilerplate provides a foundation for building an interactive math learning platform.

## Features

- **📱 Mobile-First Design**: Fully responsive and optimized for all devices
- **⚡ Fast Performance**: Minimal dependencies, pure HTML/CSS/JavaScript
- **📊 Progress Tracking**: LocalStorage-based progress system
- **🔒 Offline Support**: Service Worker enables offline functionality
- **♿ Accessible**: WCAG compliant with semantic HTML
- **🎯 PWA Ready**: Installable as a progressive web app
- **🌙 Dark Mode**: Automatic dark mode support

## Project Structure

```
AtClass/
├── index.html              # Main HTML file
├── styles.css              # Mobile-first responsive styles
├── script.js               # Main JavaScript logic
├── sw.js                   # Service Worker for offline support
├── manifest.json           # PWA manifest file
├── assets/
│   ├── icons/              # App icons (192x192, 512x512)
│   ├── images/             # Content images
│   ├── screenshots/        # PWA screenshots
│   └── data/               # JSON data files (lessons, topics)
└── README.md               # This file
```

## Getting Started

### 1. **Open the App Locally**

Simply open `index.html` in your browser:
```bash
# Windows
start index.html

# macOS
open index.html

# Linux
xdg-open index.html
```

Or use a local server:
```bash
# Python 3
python -m http.server 8000

# Python 2
python -m SimpleHTTPServer 8000

# Node.js (with http-server)
npx http-server
```

Then navigate to `http://localhost:8000`

### 2. **File Structure Organization**

- **HTML**: Structure of the app (sections, navigation, content)
- **CSS**: Styling with CSS variables for easy customization
- **JavaScript**: Navigation logic, progress tracking, button interactions
- **Service Worker**: Enables offline caching and PWA features
- **Manifest**: PWA metadata for app installation

## Features Explained

### Mobile Menu Toggle
- Hamburger menu on mobile devices
- Automatic navigation menu on tablets/desktops
- Smooth transitions and animations

### Navigation System
- Smooth section transitions
- Single-page application (SPA) style navigation
- Active link highlighting

### Progress Tracking
```javascript
// Access progress tracking from console
AtClass.progressTracker.data        // View current progress
AtClass.resetProgress()             // Reset all progress
AtClass.getCompletedTopics()        // Get completed topics count
```

### Topics & Learning Modules
Four main topics are included:
- Basic Arithmetic
- Fractions
- Algebra
- Geometry

Each topic has interactive lessons with progress tracking.

## Customization

### Change Colors

Edit CSS variables in `styles.css`:
```css
:root {
    --primary-color: #6366f1;        /* Main color */
    --secondary-color: #ec4899;      /* Accent color */
    --success-color: #10b981;        /* Success color */
    /* ... more variables ... */
}
```

### Change App Name & Title

Edit `index.html`:
```html
<title>AtClass - Learn Math</title>
<h1 class="logo">AtClass</h1>
```

Edit `manifest.json`:
```json
{
  "name": "AtClass - Learn Mathematics",
  "short_name": "AtClass"
}
```

### Add New Topics

Edit the topics grid in `index.html`:
```html
<div class="topics-grid" id="topicsContainer">
    <div class="topic-card">
        <h3>Your New Topic</h3>
        <p>Description here</p>
        <button class="btn btn-secondary">Learn</button>
    </div>
</div>
```

## Progressive Web App (PWA)

This boilerplate is PWA-ready with:

- **Service Worker**: Offline support and caching
- **Manifest file**: App metadata and install info
- **Responsive design**: Works on all screen sizes
- **App icons**: For home screen installation

### Install as App

**Mobile (iOS):**
1. Open in Safari
2. Tap Share
3. Select "Add to Home Screen"

**Mobile (Android):**
1. Open in Chrome
2. Tap menu (⋮)
3. Select "Install app" or "Add to Home Screen"

**Desktop (Chrome/Edge):**
1. Click the install icon in the address bar
2. Or press Ctrl+Shift+M (Cmd+Shift+M on Mac)

## Data Structure

### Progress Data Example
```javascript
{
  topicsCompleted: 2,
  lessonsDone: 10,
  score: 65
}
```

Stored in browser's LocalStorage as `atclass_progress`

## Adding Lessons

Create lesson data files in `assets/data/`:
```json
{
  "id": "arithmetic-01",
  "title": "Basic Addition",
  "topic": "arithmetic",
  "description": "Learn to add numbers",
  "content": "...",
  "exercises": [
    {
      "question": "2 + 3 = ?",
      "options": ["4", "5", "6"],
      "correct": "5"
    }
  ]
}
```

## Browser Compatibility

- Chrome/Edge: ✅ Full support
- Firefox: ✅ Full support
- Safari: ✅ Full support
- IE 11: ⚠️ Partial support (no CSS Grid, no Service Worker)

## Performance Tips

1. **Minify CSS & JS** for production
2. **Optimize images** before adding to assets
3. **Use WebP format** for images when possible
4. **Preload critical assets** in Service Worker
5. **Lazy load** lesson content as needed

## Security Best Practices

- Sanitize user input if adding interactive features
- Use HTTPS in production (required for Service Worker)
- Validate data on both client and server
- Store sensitive data securely (never in LocalStorage)

## Accessibility Features

- ♿ Semantic HTML structure
- 🔊 ARIA labels for buttons
- 🔄 Keyboard navigation support
- 👁️ High contrast colors
- 📵 Respects `prefers-reduced-motion`
- 🌙 Dark mode support

## Next Steps

Here's what you might add:

1. **Backend API**: Connect to a server for user accounts and data persistence
2. **Quiz System**: Add interactive quizzes with scoring
3. **User Authentication**: Login/signup system
4. **Analytics**: Track user behavior and learning patterns
5. **Notifications**: Push notifications for reminders
6. **Social Features**: Leaderboards and peer competition
7. **Multimedia**: Embed videos and interactive simulations
8. **Multilingual Support**: Support multiple languages

## Development

### Running a Local Server

```bash
# Python 3
python -m http.server 8000

# Node.js
npx http-server

# PHP
php -S localhost:8000
```

### Testing Service Worker

1. Open DevTools (F12)
2. Go to Application tab
3. Check Service Workers section
4. Offline mode can be toggled for testing

## License

This boilerplate is free to use and modify. Update the LICENSE file as needed.

## Support

For questions or issues:
1. Check the browser console (F12) for errors
2. Review JavaScript console for debug messages
3. Check Service Worker status in DevTools application tab

---

**Happy Learning! 📚**

Build something amazing with AtClass!
