# 🎨 Design System - VHA Atelier

## 🎯 **BRAND IDENTITY**

### **Brand Values**
- **Luxury**: Cao cấp nhưng accessible
- **Modern**: Hiện đại, theo xu hướng
- **Vietnamese**: Văn hóa Việt Nam
- **Trustworthy**: Đáng tin cậy, chuyên nghiệp

### **Brand Personality**
- Sophisticated & Elegant
- Friendly & Approachable
- Innovative & Forward-thinking
- Culturally Rich

---

## 🎨 **EARTH TONE COLOR PALETTE**

### **Earth Tone Primary Colors**
```css
/* Warm Earth Tones */
--earth-50: #faf9f7;         /* Warm white - Main BG */
--earth-100: #f5f3f0;        /* Cream - Cards */
--earth-200: #e8e4dd;        /* Light beige - Borders */
--earth-300: #d4cdc0;        /* Soft beige - Disabled */
--earth-400: #b8a99a;        /* Muted brown - Placeholders */
--earth-500: #9c8b7a;        /* Medium brown - Body Text */
--earth-600: #7a6b5c;        /* Dark brown - Secondary Text */
--earth-700: #5d5146;        /* Darker brown - Headers */
--earth-800: #403832;        /* Very dark brown */
--earth-900: #2a221f;        /* Almost black */
```

### **Warm Accent Colors**
```css
/* Earth-Inspired Accents */
--warm-terracotta: #c67b5c;  /* Warm terracotta - Primary CTAs */
--warm-sage: #8a9a8b;        /* Sage green - Success, Nature */
--warm-ochre: #d4a574;       /* Golden ochre - Highlights */
--warm-rust: #b85450;        /* Rust red - Alerts, Danger */
--warm-sand: #e6d7c3;        /* Sand beige - Light accents */
--warm-clay: #a67c52;        /* Clay brown - Secondary actions */
```

### **Neutral Grays with Warm Undertones**
```css
/* Warm Neutrals */
--neutral-50: #fafaf9;       /* Warmest white */
--neutral-100: #f5f5f4;      /* Warm light gray */
--neutral-200: #e7e5e4;      /* Warm border gray */
--neutral-300: #d6d3d1;      /* Warm medium light */
--neutral-400: #a8a29e;      /* Warm medium */
--neutral-500: #78716c;      /* Warm dark */
--neutral-600: #57534e;      /* Warm darker */
--neutral-700: #44403c;      /* Warm darkest */
--neutral-800: #292524;      /* Warm black */
--neutral-900: #1c1917;      /* Pure warm black */
```

### **Semantic Colors**
```css
/* Status Colors */
--success: #10b981;          /* Success states */
--warning: #f59e0b;          /* Warning states */
--error: #ef4444;            /* Error states */
--info: #3b82f6;             /* Info states */

/* Neutral Colors */
--white: #ffffff;            /* Pure white */
--black: #000000;            /* Pure black */
--gray-50: #f9fafb;          /* Lightest gray */
--gray-100: #f3f4f6;         /* Light gray */
--gray-200: #e5e7eb;         /* Border gray */
--gray-300: #d1d5db;         /* Disabled gray */
--gray-400: #9ca3af;         /* Placeholder gray */
--gray-500: #6b7280;         /* Text gray */
--gray-600: #4b5563;         /* Dark text */
--gray-700: #374151;         /* Darker text */
--gray-800: #1f2937;         /* Darkest text */
--gray-900: #111827;         /* Headers */
```

---

## 📝 **TYPOGRAPHY**

### **Font Family**
```css
/* Primary Font - Modern Sans Serif */
--font-primary: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;

/* Secondary Font - Vietnamese Support */
--font-secondary: 'Be Vietnam Pro', 'Inter', sans-serif;

/* Display Font - Headers */
--font-display: 'Playfair Display', serif;
```

### **Font Sizes**
```css
/* Display Sizes */
--text-6xl: 3.75rem;         /* 60px - Hero Headlines */
--text-5xl: 3rem;            /* 48px - Page Titles */
--text-4xl: 2.25rem;         /* 36px - Section Titles */
--text-3xl: 1.875rem;        /* 30px - Card Titles */

/* Body Sizes */
--text-2xl: 1.5rem;          /* 24px - Large Text */
--text-xl: 1.25rem;          /* 20px - Subheadings */
--text-lg: 1.125rem;         /* 18px - Body Large */
--text-base: 1rem;           /* 16px - Body Text */
--text-sm: 0.875rem;         /* 14px - Small Text */
--text-xs: 0.75rem;          /* 12px - Captions */
```

### **Font Weights**
```css
--font-thin: 100;
--font-light: 300;
--font-normal: 400;
--font-medium: 500;
--font-semibold: 600;
--font-bold: 700;
--font-extrabold: 800;
--font-black: 900;
```

### **Line Heights**
```css
--leading-none: 1;
--leading-tight: 1.25;
--leading-snug: 1.375;
--leading-normal: 1.5;
--leading-relaxed: 1.625;
--leading-loose: 2;
```

---

## 📏 **SPACING SYSTEM**

### **Spacing Scale**
```css
--space-0: 0;
--space-1: 0.25rem;          /* 4px */
--space-2: 0.5rem;           /* 8px */
--space-3: 0.75rem;          /* 12px */
--space-4: 1rem;             /* 16px */
--space-5: 1.25rem;          /* 20px */
--space-6: 1.5rem;           /* 24px */
--space-8: 2rem;             /* 32px */
--space-10: 2.5rem;          /* 40px */
--space-12: 3rem;            /* 48px */
--space-16: 4rem;            /* 64px */
--space-20: 5rem;            /* 80px */
--space-24: 6rem;            /* 96px */
--space-32: 8rem;            /* 128px */
```

### **Component Spacing**
```css
/* Button Padding */
--btn-padding-sm: var(--space-2) var(--space-4);
--btn-padding-md: var(--space-3) var(--space-6);
--btn-padding-lg: var(--space-4) var(--space-8);

/* Card Padding */
--card-padding-sm: var(--space-4);
--card-padding-md: var(--space-6);
--card-padding-lg: var(--space-8);

/* Section Spacing */
--section-padding-sm: var(--space-8) 0;
--section-padding-md: var(--space-16) 0;
--section-padding-lg: var(--space-24) 0;
```

---

## 🔲 **BORDER RADIUS**

### **Radius Scale**
```css
--radius-none: 0;
--radius-sm: 0.125rem;       /* 2px */
--radius-base: 0.25rem;      /* 4px */
--radius-md: 0.375rem;       /* 6px */
--radius-lg: 0.5rem;         /* 8px */
--radius-xl: 0.75rem;        /* 12px */
--radius-2xl: 1rem;          /* 16px */
--radius-3xl: 1.5rem;        /* 24px */
--radius-full: 9999px;       /* Fully rounded */
```

### **Component Radius**
```css
--btn-radius: var(--radius-md);
--card-radius: var(--radius-lg);
--input-radius: var(--radius-md);
--modal-radius: var(--radius-xl);
--badge-radius: var(--radius-full);
```

---

## 🌊 **SHADOWS**

### **Shadow Scale**
```css
--shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
--shadow-base: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
--shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
--shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
--shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
--shadow-2xl: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
--shadow-inner: inset 0 2px 4px 0 rgba(0, 0, 0, 0.06);
```

### **Component Shadows**
```css
--card-shadow: var(--shadow-base);
--button-shadow: var(--shadow-sm);
--modal-shadow: var(--shadow-2xl);
--dropdown-shadow: var(--shadow-lg);
--floating-shadow: var(--shadow-xl);
```

---

## 🎛️ **COMPONENT LIBRARY**

### **Buttons**
```css
/* Primary Button */
.btn-primary {
  background: var(--accent-red);
  color: var(--white);
  padding: var(--btn-padding-md);
  border-radius: var(--btn-radius);
  font-weight: var(--font-semibold);
  box-shadow: var(--button-shadow);
  transition: all 0.2s ease;
}

.btn-primary:hover {
  background: #b91c1c;
  transform: translateY(-1px);
  box-shadow: var(--shadow-md);
}

/* Secondary Button */
.btn-secondary {
  background: var(--white);
  color: var(--primary-700);
  border: 2px solid var(--primary-200);
  padding: var(--btn-padding-md);
  border-radius: var(--btn-radius);
  font-weight: var(--font-semibold);
  transition: all 0.2s ease;
}

.btn-secondary:hover {
  border-color: var(--accent-red);
  color: var(--accent-red);
}
```

### **Cards**
```css
.product-card {
  background: var(--white);
  border-radius: var(--card-radius);
  padding: var(--card-padding-md);
  box-shadow: var(--card-shadow);
  transition: all 0.3s ease;
}

.product-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-lg);
}
```

### **Inputs**
```css
.form-input {
  width: 100%;
  padding: var(--space-3) var(--space-4);
  border: 2px solid var(--primary-200);
  border-radius: var(--input-radius);
  font-size: var(--text-base);
  transition: all 0.2s ease;
}

.form-input:focus {
  outline: none;
  border-color: var(--accent-red);
  box-shadow: 0 0 0 3px rgba(220, 38, 38, 0.1);
}
```

---

## 📱 **RESPONSIVE BREAKPOINTS**

### **Breakpoint System**
```css
/* Mobile First Approach */
--breakpoint-sm: 640px;      /* Small devices */
--breakpoint-md: 768px;      /* Medium devices */
--breakpoint-lg: 1024px;     /* Large devices */
--breakpoint-xl: 1280px;     /* Extra large devices */
--breakpoint-2xl: 1536px;    /* 2X large devices */
```

### **Container Widths**
```css
--container-sm: 640px;
--container-md: 768px;
--container-lg: 1024px;
--container-xl: 1280px;
--container-2xl: 1536px;
```

---

## 🎭 **ANIMATIONS**

### **Transition Timing**
```css
--transition-fast: 0.15s ease;
--transition-base: 0.2s ease;
--transition-slow: 0.3s ease;
--transition-slower: 0.5s ease;
```

### **Animation Classes**
```css
.fade-in {
  animation: fadeIn 0.3s ease-in-out;
}

.slide-up {
  animation: slideUp 0.3s ease-out;
}

.scale-in {
  animation: scaleIn 0.2s ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideUp {
  from { transform: translateY(20px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}

@keyframes scaleIn {
  from { transform: scale(0.95); opacity: 0; }
  to { transform: scale(1); opacity: 1; }
}
```

---

## 🎨 **ICON SYSTEM**

### **Icon Sizes**
```css
--icon-xs: 0.75rem;          /* 12px */
--icon-sm: 1rem;             /* 16px */
--icon-md: 1.25rem;          /* 20px */
--icon-lg: 1.5rem;           /* 24px */
--icon-xl: 2rem;             /* 32px */
--icon-2xl: 2.5rem;          /* 40px */
```

### **Icon Library**
- **Heroicons**: Primary icon set
- **Lucide**: Secondary icon set
- **Custom**: Brand-specific icons

---

## 🎯 **USAGE GUIDELINES**

### **Color Usage**
- **Primary Red**: CTAs, links, active states
- **Gold**: Highlights, premium features
- **Green**: Success states, positive actions
- **Blue**: Information, secondary actions
- **Gray Scale**: Text, borders, backgrounds

### **Typography Usage**
- **Display Font**: Headlines, hero text
- **Primary Font**: Body text, UI elements
- **Secondary Font**: Vietnamese text, special content

### **Spacing Usage**
- **Consistent**: Use spacing scale for all elements
- **Hierarchical**: Larger spacing for more important elements
- **Responsive**: Adjust spacing for different screen sizes

---

## 📋 **IMPLEMENTATION CHECKLIST**

### **Phase 1: Foundation**
- [ ] Set up CSS custom properties
- [ ] Implement color palette
- [ ] Set up typography system
- [ ] Create spacing utilities

### **Phase 2: Components**
- [ ] Build button components
- [ ] Create card components
- [ ] Implement form elements
- [ ] Build navigation components

### **Phase 3: Layout**
- [ ] Create grid system
- [ ] Implement responsive breakpoints
- [ ] Build layout components
- [ ] Create page templates

### **Phase 4: Polish**
- [ ] Add animations
- [ ] Implement dark mode
- [ ] Create icon system
- [ ] Add accessibility features

---

**Ready for Implementation**: Design System đã sẵn sàng để implement vào Tailwind CSS!
