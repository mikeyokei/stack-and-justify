# Proofokei Design System - Quick Reference

## 🎨 Essential Colors
```css
:root {
  --yellow-note: #FFFBCC;  /* 70% - Primary background */
  --blue-note:   #CDEBFF;  /* 12% - Secondary actions */
  --pink-note:   #FFD9F7;  /* 12% - Accent actions */
  --orange-note: #FFB56B;  /* 6% - Highlights */
}
```

## 🔤 Typography
```css
font-family: 'NaNRage Soft', sans-serif;
```

## 🏗️ Core Components

### Sticky Note Container
```css
.note {
  background: var(--yellow-note);
  border: 1px solid #000;
  border-radius: 2px;
  padding: 1rem;
  position: relative;
}

.note::after {
  content: "";
  position: absolute;
  top: 0; right: 0;
  border: 0 16px 16px 0 solid transparent #000 transparent transparent;
}
```

### Buttons
```css
.btn-base {
  border: 1px solid #000;
  font-family: 'NaNRage Soft', sans-serif;
  border-radius: 2px;
  transition: all 0.2s ease;
}

.btn-blue { background: var(--blue-note); }
.btn-pink { background: var(--pink-note); }
```

### Sliders
```css
.slider {
  background: var(--blue-note);
  height: 4px;
  border: 1px solid #000;
}

.slider::-webkit-slider-thumb {
  width: 18px; height: 18px;
  background: var(--orange-note);
  border: 1px solid #000;
  border-radius: 0;
}
```

## 🌟 Dynamic Island Header
```tsx
import { motion } from 'framer-motion';

<motion.div
  className="fixed top-3 left-1/2 -translate-x-1/2 z-50"
  style={{
    background: 'var(--yellow-note)',
    height: 38,
    borderRadius: 9999,
    border: '1px solid #000'
  }}
  transition={{ type: 'spring', stiffness: 320, damping: 30 }}
>
  {/* Content */}
</motion.div>
```

## 🎬 Common Animations

### Floating Button
```tsx
<motion.button
  animate={{ y: [0, -10, 0] }}
  transition={{
    duration: 0.6,
    repeat: Infinity,
    repeatType: "reverse"
  }}
>
```

### Loading Spinner
```tsx
<motion.div
  animate={{ rotate: 360 }}
  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
  className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
/>
```

## 📱 Mobile Breakpoints
```css
/* Mobile: < 768px */
@media (max-width: 768px) {
  button { min-height: 44px; min-width: 44px; }
  input[type="text"] { font-size: 16px; } /* Prevent iOS zoom */
}
```

## 🎯 Z-Index Scale
```javascript
{
  dropdown: 1000,
  sticky: 1020,
  fixed: 1030,
  modal: 1040,
  popover: 1050,
  tooltip: 1060
}
```

## 📦 Dependencies
```bash
npm install framer-motion lucide-react
```

## 🚀 Tailwind Config
```javascript
module.exports = {
  theme: {
    extend: {
      colors: {
        'yellow-note': 'var(--yellow-note)',
        'blue-note': 'var(--blue-note)',
        'pink-note': 'var(--pink-note)',
        'orange-note': 'var(--orange-note)',
      },
      fontFamily: {
        'sans': ['"NaNRage Soft"', 'ui-sans-serif', 'system-ui'],
      },
      borderRadius: {
        'brutalist': '2px',
      },
      boxShadow: {
        'brutalist': '2px 2px 0px rgba(0, 0, 0, 1)',
      }
    }
  }
}
```

## 🎨 Usage Pattern
```tsx
function App() {
  return (
    <div className="bg-gray-100 min-h-screen font-sans">
      <DynamicIslandHeader siteTitle="Your App" />
      
      <div className="container mx-auto px-4 pt-20">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="w-full md:w-1/3">
            <div className="note">
              <h2>Controls</h2>
              <button className="btn-base btn-blue btn-md">Action</button>
            </div>
          </div>
          
          <div className="w-full md:w-2/3">
            <div className="note">
              <h1>Main Content</h1>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
```

---
*Quick reference for implementing Proofokei's brutalist sticky-note design system*
