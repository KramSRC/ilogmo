# iLogMo 📱

> A production-grade Internship and On-the-Job Training (OJT) companion mobile application built with React Native, Expo Router, TypeScript, NativeWind, Supabase, and Zustand.

---

## 🌟 Features Overview

- ⏱️ **Attendance Tracking**: Real-time Check-In and Check-Out with location capture and session notes.
- 🧮 **OJT Hours Calculator**: Live calculation of remaining hours, completed hours, daily averages, and progress rates.
- 📝 **Daily Journals**: Rich daily learning logs, reflections, mood tracking, and supervisor remarks.
- 📊 **Analytics & Insights**: Weekly trends, monthly distributions, and projected completion dates.
- 📁 **Internship Documents**: Cloud storage for requirements, certificates, MOA, and daily time records (DTR).
- 📑 **Report Generation**: Exportable PDF and summary reports for academic and company submissions.

---

## 🛠️ Tech Stack

| Domain               | Technology                         | Purpose                                                            |
| :------------------- | :--------------------------------- | :----------------------------------------------------------------- |
| **Framework**        | Expo (SDK 52) / React Native       | Cross-platform native runtime for iOS, Android, and Web            |
| **Language**         | TypeScript (Strict)                | Static type safety and developer productivity                      |
| **Routing**          | Expo Router (v4)                   | File-based typed routing and native navigation stack               |
| **Styling**          | NativeWind (v4) & TailwindCSS      | Utility-first styling engine compiled to React Native StyleSheet   |
| **Backend & Auth**   | Supabase (`@supabase/supabase-js`) | Authentication, PostgreSQL database, and storage                   |
| **State Management** | Zustand                            | Lightweight, unopinionated atomic global state management          |
| **Form Handling**    | React Hook Form & Zod              | High-performance form state with schema-driven validation          |
| **Icons**            | Lucide React Native                | Crisp, customizable vector icons                                   |
| **Storage**          | React Native AsyncStorage          | Encrypted and offline local key-value persistence                  |
| **Animations**       | React Native Reanimated (v3)       | 60/120 FPS UI thread animations                                    |
| **Gestures**         | React Native Gesture Handler       | Native touch gestures and interactions                             |
| **Safe Area**        | React Native Safe Area Context     | Notch and navigation bar safe area insets handling                 |
| **Typography**       | Expo Font & Google Inter           | Apple/Linear-inspired modern typography hierarchy                  |
| **Date & Time**      | date-fns                           | Fast, immutable date arithmetic and formatting                     |
| **Push Alerts**      | Expo Notifications                 | Reminder alerts for check-ins, check-outs, and journal submissions |

---

## 🎨 Design System

Designed around a **Modern, Minimal, Apple & Linear-inspired** aesthetic:

- **Primary Color**: `#2563EB` (Blue 600)
- **Background**: `#F8FAFC` (Slate 50)
- **Card / Surface**: `#FFFFFF` (White)
- **Border Radius**: `24px` (`rounded-card` / `radius.card`)
- **Spacing Grid**: Strict 8-point grid system (`4px`, `8px`, `16px`, `24px`, `32px`, `40px`, `48px`)
- **Shadows**: Soft multi-layered ambient elevations

---

## 📂 Project Architecture

iLogMo uses a **Feature-Based Architecture**:

```text
ilogmo/
├── app/                      # Expo Router navigation routes & layouts
│   ├── _layout.tsx           # Root navigation layout (SafeArea, Fonts, Themes)
│   └── index.tsx             # Entry routing screen
├── assets/                   # Static app icons, splash screens, images
├── components/               # Shared global UI components (Buttons, Inputs, Cards)
├── constants/                # Design system tokens & theme definitions
│   ├── colors.ts             # Primary, Slate, semantic palettes
│   ├── fonts.ts              # Inter font scales and line heights
│   ├── radius.ts             # 24px card radius & rounded tokens
│   ├── spacing.ts            # 8-point spacing grid
│   └── theme.ts              # Aggregated theme object & soft shadows
├── features/                 # Modular feature domains
│   ├── analytics/            # Progress charts & hours analytics
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── services/
│   │   └── types/
│   ├── attendance/           # Check-in/out, hours tracking
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── services/
│   │   └── types/
│   ├── auth/                 # Authentication & onboarding
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── services/
│   │   └── types/
│   ├── dashboard/            # Overview widgets & summaries
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── services/
│   │   └── types/
│   ├── journal/              # Daily reflections & entries
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── services/
│   │   └── types/
│   └── profile/              # Student settings & OJT info
│       ├── components/
│       ├── hooks/
│       ├── services/
│       └── types/
├── hooks/                    # Global shared utility hooks
├── lib/                      # External integrations
│   └── supabase.ts           # Supabase client with AsyncStorage session persistence
├── services/                 # Cross-cutting API services
├── store/                    # Global state management (Zustand)
│   └── index.ts              # Root store orchestrator
├── types/                    # Shared global TypeScript types
├── utils/                    # Shared helper functions (date-fns wrappers)
│   ├── date.ts
│   └── index.ts
├── .env.example              # Environment variables template
├── babel.config.js           # Babel preset & Reanimated configuration
├── global.css                # Tailwind CSS root stylesheet
├── metro.config.js           # Metro bundler with NativeWind integration
├── nativewind-env.d.ts       # NativeWind TypeScript declaration
├── tailwind.config.js        # Tailwind CSS design system configuration
└── tsconfig.json             # Strict TypeScript config with @/* path aliases
```

---

## 🚀 Getting Started

### 1. Prerequisites

- Node.js (v18 or newer)
- npm or yarn

### 2. Installation

```bash
# Clone the repository and install dependencies
npm install
```

### 3. Environment Variables

Copy `.env.example` to `.env` and fill in your Supabase credentials:

```bash
cp .env.example .env
```

```env
EXPO_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

### 4. Running the Application

```bash
# Start Expo development server
npm run start

# Run on iOS simulator
npm run ios

# Run on Android emulator / device
npm run android

# Run on Web browser
npm run web
```

### 5. Type Checking & Code Quality

```bash
# Run TypeScript typecheck
npm run typecheck

# Run ESLint
npm run lint

# Format code with Prettier
npm run format
```
