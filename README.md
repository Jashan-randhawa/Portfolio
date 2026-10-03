<div align="center">

# ⚡ Jashanpreet Singh — Portfolio

### Modern Full-Stack & AI Developer Portfolio • Apple-Inspired Showcase • Spotify Music Lounge

A high-performance personal portfolio built with **Next.js 16 App Router**, **React 19**, **Tailwind CSS v4**, **Motion**, **Three.js**, and a live **Spotify-style Punjabi Music Player** powered by **JioSaavn API** with **DES-ECB media decryption**.

<br/>

[![Live Website](https://img.shields.io/badge/Live_Portfolio-jashan2978.vercel.app-00dfa2?style=for-the-badge&logo=vercel&logoColor=white)](https://jashan2978.vercel.app)
[![GitHub Profile](https://img.shields.io/badge/GitHub-Jashan--randhawa-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/Jashan-randhawa)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)

<br/>

[![Next.js 16](https://img.shields.io/badge/Next.js-16.3.6-000000?style=flat-square&logo=next.js&logoColor=white)](https://nextjs.org/)
[![React 19](https://img.shields.io/badge/React-19.0.0-61DAFB?style=flat-square&logo=react&logoColor=black)](https://react.dev/)
[![Tailwind CSS v4](https://img.shields.io/badge/Tailwind_CSS-v4.0-38B2AC?style=flat-square&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Motion v12](https://img.shields.io/badge/Motion-v12.6-FF0055?style=flat-square&logo=framer&logoColor=white)](https://motion.dev/)
[![TypeScript 5](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Three.js](https://img.shields.io/badge/Three.js-R3F_3D-000000?style=flat-square&logo=three.js&logoColor=white)](https://threejs.org/)
[![Node-Forge](https://img.shields.io/badge/Node--Forge-DES--ECB_Crypto-4B32C3?style=flat-square)](https://github.com/digitalbazaar/forge)
[![Vercel Deployment](https://img.shields.io/badge/Vercel-Deployed-black?style=flat-square&logo=vercel&logoColor=white)](https://jashan2978.vercel.app)

</div>

---

## 📖 Table of Contents

- [Overview](#-overview)
- [✨ Key Features](#-key-features)
  - [🎵 Spotify-Inspired Punjabi Music Lounge](#-spotify-inspired-punjabi-music-lounge)
  - [💻 Apple-Inspired Projects Showcase](#-apple-inspired-projects-showcase)
  - [🌌 Personal Universe & Bento Grid](#-personal-universe--bento-grid)
  - [🌗 Adaptive Themes & Micro-Interactions](#-adaptive-themes--micro-interactions)
- [🛠️ Architecture & Tech Stack](#️-architecture--tech-stack)
- [📁 Project Structure](#-project-structure)
- [🚀 Quick Start & Local Setup](#-quick-start--local-setup)
- [📦 Featured Projects Showcase](#-featured-projects-showcase)
- [🎶 Curated Music Library Breakdown](#-curated-music-library-breakdown)
- [📬 Connect & Collaborate](#-connect--collaborate)

---

## 🌟 Overview

This repository hosts the source code for **Jashanpreet Singh's** personal portfolio. Designed to provide a memorable interactive experience, it blends modern design aesthetics with engineering precision:
- **Apple-Style Project Carousel & Responsive Grid**: 16:10 uncropped mockup showcases with smooth 5-second circular auto-sliding, live search, and interactive modal dialogs.
- **Custom Spotify Punjabi Music Lounge**: Direct JioSaavn API integration with real-time DES-ECB media decryption, 100 curated tracks across 5 genres, spinning vinyl turntable animations, live audio equalizer waveforms, and circular auto-sliding chips.
- **Interactive 3D Elements & Personal Universe**: Three.js particle canvas, interactive tag cloud, resume preview & download card, and milestone career timeline.
- **Built for Speed**: Server and Client Components separation, Next.js 16 with Turbopack development, production Webpack compilation, and automated Vercel Speed Insights.

---

## ✨ Key Features

### 🎵 Spotify-Inspired Punjabi Music Lounge
An integrated audio streaming engine inspired by Spotify's design system:
- **Direct JioSaavn API Integration & DES-ECB Decryption**: Audio stream URLs are decrypted in real time using DES-ECB cipher key `38346591` via `node-forge`, delivering 160kbps AAC high-fidelity playback.
- **100 Curated Punjabi Songs**: Structured across 5 distinct mood genres:
  1. *Bhangra / Party* (Diljit Dosanjh, Karan Aujla, Sharry Maan)
  2. *Motivational & Gym* (Sidhu Moose Wala, AP Dhillon, Amrit Maan)
  3. *Rap / Hip-Hop* (Karan Aujla, Shubh, Bohemia, DIVINE)
  4. *Sufi / Devotional* (Satinder Sartaaj, Amrinder Gill, Kanwar Grewal)
  5. *Folk / Traditional* (Gurdas Maan, Kulwinder Billa, Surinder Kaur)
- **Live Search & Artist Presets**: Instant search against JioSaavn's music catalog plus 9 one-click artist preset chips.
- **Animated Spinning Vinyl Record**: 360° continuous rotation synchronized with audio playback and smooth pause transition.
- **Real-Time Bouncing Audio Equalizer**: Dynamic CSS keyframe animated equalizer bars indicating live playback state.
- **5-Second Circular Auto-Slider**: Genre pills, artist chips, and quick-picks slide smoothly forward every 5 seconds with seamless circular wrapping, pausing on user hover or tab inactivity.
- **Complete Spotify Playback Controls**: Scrubbable seek bar with live elapsed/total timestamps, volume slider with mute toggle, repeat modes (*Off*, *Repeat All*, *Repeat One*), next/previous track navigation, and liked songs management.

---

### 💻 Apple-Inspired Projects Showcase
A portfolio showcase designed for clarity:
- **16:10 Uncropped Mockup Viewports**: Dedicated aspect ratio containers (`aspect-[16/10]`) preserve the full resolution and detail of UI mockups without awkward image cropping or distortion.
- **5-Second Infinite Circular Auto-Slide**: The project carousel automatically advances every 5 seconds, cycling back to the start infinitely with smooth progress-tracked motion.
- **Dual View Modes**:
  - *Apple Cards Carousel*: Immersive horizontal swipeable cards with smooth spring physics.
  - *Responsive Grid*: Multi-column grid layout for quick side-by-side comparison.
- **Live Search & Category Filtering**: Instant client-side search across titles, descriptions, and tech stacks, combined with category filters (*AI & Machine Learning*, *Full-Stack Web*, *Automation & Tools*, *Management Systems & C++*).
- **Interactive Modal Dialogs**: Click any project card to open an animated modal displaying full project breakdowns, key technical achievements, tech stack tags, GitHub repository links, and live deployment URLs.

---

### 🌌 Personal Universe & Bento Grid
- **3D Particle Canvas**: Powered by Three.js, `@react-three/fiber`, and `@tsparticles/react` for an interactive, fluid background that responds to user interaction.
- **Interactive 3D Tech Stack Cloud**: Dynamic tag cloud visualizer presenting core skills across languages, frameworks, databases, and DevOps tools.
- **Resume Card**: One-click PDF viewer modal and direct resume download button.
- **Experience & Education Timeline**: Chronological interactive timeline documenting academic milestones and full-stack development experience.

---

### 🌗 Adaptive Themes & Micro-Interactions
- **Dark / Light Mode**: Integrated `next-themes` support with smooth transitions, customized color palettes, and zero hydration layout shifts.
- **Spring Physics Animations**: Micro-interactions, hover glow effects, expandable images, and fluid reveals built on `motion/react` (Framer Motion v12).
- **Cross-Browser Polish**: Clean UI with custom hidden scrollbars (`.no-scrollbar`) standardized across Chrome, Safari, Firefox, and Edge.

---

## 🛠️ Architecture & Tech Stack

| Category | Technology | Purpose |
| :--- | :--- | :--- |
| **Framework** | [Next.js 16.3.6](https://nextjs.org/) | App Router, Server Components, Route Handlers, Turbopack |
| **Library** | [React 19.0.0](https://react.dev/) | UI component architecture, Concurrent Features, client hooks |
| **Styling** | [Tailwind CSS v4](https://tailwindcss.com/) | Modern utility-first CSS, CSS variables, dark theme styling |
| **Animations** | [Motion (Framer Motion v12)](https://motion.dev/) | Spring physics, layout animations, modal dialog transitions |
| **3D & Graphics** | [Three.js](https://threejs.org/) & [R3F](https://r3f.docs.pmnd.rs/) | Interactive 3D scene rendering and canvas effects |
| **Particles** | [TSParticles Engine](https://particles.js.org/) | Interactive background particle systems |
| **Cryptography** | [Node-Forge](https://github.com/digitalbazaar/forge) | DES-ECB cipher decryption for JioSaavn audio streaming |
| **Icons & UI** | [Lucide React](https://lucide.dev/) & [Tabler Icons](https://tabler.io/icons) | Clean, scalable vector icon sets |
| **Primitives** | [Radix UI](https://www.radix-ui.com/) | Accessible dialogs, dropdowns, and portal primitives |
| **Language** | [TypeScript 5](https://www.typescriptlang.org/) | Strict type safety and robust developer experience |
| **Deployment** | [Vercel](https://vercel.com/) | Edge hosting, Speed Insights, and Web Analytics |

---

## 📁 Project Structure

```text
Portfolio/
├── public/
│   ├── images/
│   │   ├── mockup/            # 16:10 uncropped project mockups
│   │   └── ...                # Profile assets and badges
│   └── resume.pdf             # Curated developer resume
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   └── music/
│   │   │       ├── search/    # JioSaavn live search route handler
│   │   │       └── song/      # JioSaavn song metadata route handler
│   │   ├── about/             # Detailed about me page
│   │   ├── experience/        # Career & education milestones
│   │   ├── projects/          # Projects showcase & category filters
│   │   ├── sponsors/          # Open source support & sponsors
│   │   ├── layout.tsx         # Global layout with theme provider & dock
│   │   └── page.tsx           # Home landing page with bento grid
│   ├── components/
│   │   ├── ui/                # Apple carousel, floating dock, modal dialogs
│   │   └── ...                # Reusable UI primitives
│   ├── containers/
│   │   ├── about-me/          # Personal story and highlights
│   │   ├── my-universe/       # 3D Three.js interactive canvas
│   │   └── personal-interests/# Bento grid container:
│   │       ├── music-player/  # Spotify player, vinyl disc, circular slider
│   │       ├── resume.tsx     # Resume preview and download card
│   │       └── stack-cloud.tsx# 3D interactive tech stack cloud
│   ├── data/
│   │   ├── projects.ts        # Comprehensive project metadata & links
│   │   ├── punjabi-genres.ts  # 100 curated Punjabi songs across 5 genres
│   │   ├── experience.tsx     # Work and education timeline items
│   │   └── tech-stack.ts      # Core skills and tooling tags
│   ├── hooks/                 # Custom React hooks (e.g. useOutsideClick)
│   ├── lib/
│   │   ├── jiosaavn.ts        # DES-ECB media decryption & API client
│   │   └── utils.ts           # Class merge and utility helpers
│   └── styles/
│       └── globals.css        # Tailwind CSS v4 directives & keyframe animations
├── package.json               # Dependencies and build scripts
├── tsconfig.json              # TypeScript configuration
└── next.config.ts             # Next.js configuration
```

---

## 🚀 Quick Start & Local Setup

### Prerequisites
- **Node.js**: `v18.18.0` or higher (Node 20+ recommended)
- **Package Manager**: `yarn` or `npm`

### 1. Clone the Repository
```bash
git clone https://github.com/Jashan-randhawa/Portfolio.git
cd Portfolio
```

### 2. Install Dependencies
```bash
# Using Yarn (recommended)
yarn install

# Or using npm
npm install
```

### 3. Start Development Server
```bash
# Runs Next.js with Turbopack for lightning-fast HMR
yarn dev
# or
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) in your browser to view the application.

### 4. Build for Production
```bash
# Production compilation using Webpack builder for optimal Vercel deployment
yarn build
# or
npm run build
```

---

## 📦 Featured Projects Showcase

| Project | Tech Stack | Category | Links |
| :--- | :--- | :---: | :---: |
| **Portfolio** | Next.js 16, React 19, Tailwind CSS v4, Motion, Three.js | Portfolio Website | [Demo](https://jashan2978.vercel.app) • [GitHub](https://github.com/Jashan-randhawa/Portfolio) |
| **FOREWORK** | MERN Stack, Redux Toolkit, Cloudinary, Docker | Job Portal | [Demo](https://forework.vercel.app) • [GitHub](https://github.com/Jashan-randhawa/FOREWORK) |
| **ECHO** | React Native, Expo, Node.js, Express, Socket.IO, JWT | Real-Time Chat | [Demo](https://chat-application-five-kappa.vercel.app) • [GitHub](https://github.com/Jashan-randhawa/Chat-Application) |
| **AI Fitness Tracker** | React, Strapi, Gemini AI, TypeScript | AI & Health | [Demo](https://ai-fitness-tracker1.vercel.app) • [GitHub](https://github.com/Jashan-randhawa/AI-FitnessTracker1) |
| **AI Attendance System** | Python, InsightFace, FastAPI, MongoDB Atlas, React | Computer Vision | [Demo](https://ai-attendance-system-mauve.vercel.app) • [GitHub](https://github.com/Jashan-randhawa/AI-Attendance-System) |
| **Job Mail Automation** | Node.js, OpenRouter LLM, Gmail SMTP, JavaScript | Automation Tool | [Demo](https://autosend-kappa.vercel.app/) • [GitHub](https://github.com/Jashan-randhawa/Job-mail-Automation) |
| **Library Management System** | React, TypeScript, Express, MongoDB | Management System | [Demo](https://library-managment-system-ochre.vercel.app) • [GitHub](https://github.com/Jashan-randhawa/Library_Managment_System) |
| **Hospital Management System** | C++ HTTP Server, HTML5, CSS3, JavaScript | Web & Systems | [Demo](https://hospital-managment-kappa.vercel.app) • [GitHub](https://github.com/Jashan-randhawa/Hospital_Managment) |
| **Bus Reservation System** | PHP, MySQL, Tailwind CSS, Auth0 | Booking System | [Demo](https://bus-resrvation.onrender.com) • [GitHub](https://github.com/Jashan-randhawa/Bus-Resrvation) |
| **Shopify Clone** | React, JavaScript, DummyJSON API | E-Commerce | [Demo](https://shopify-clone-rust.vercel.app) • [GitHub](https://github.com/Jashan-randhawa/Shopify-Clone) |
| **Ochi Design Agency** | React, Framer Motion, Tailwind CSS | Animated Web | [Demo](https://ochi-animation.vercel.app) • [GitHub](https://github.com/Jashan-randhawa/OCHI-ANIMATION) |
| **TalentArch** | React, Node.js, Express | Event Management | [Demo](https://remotejob-omega.vercel.app) • [GitHub](https://github.com/Jashan-randhawa/task) |

---

## 🎶 Curated Music Library Breakdown

The integrated Spotify player features **100 curated Punjabi songs** organized into 5 mood categories:

| Mood / Genre | Tracks | Featured Artists | Representative Track |
| :--- | :---: | :--- | :--- |
| **Bhangra / Party** | 20 | Diljit Dosanjh, Karan Aujla, Sharry Maan, Sukhbir | *Lover*, *52 Bars*, *3 Peg* |
| **Motivational & Gym** | 20 | Sidhu Moose Wala, AP Dhillon, Amrit Maan, Jerry | *The Last Ride*, *Excuses*, *Signed To God* |
| **Rap / Hip-Hop** | 20 | Karan Aujla, Shubh, Bohemia, Divine, Wazir Patar | *Softly*, *Baller*, *Winning Speech* |
| **Sufi / Devotional** | 20 | Satinder Sartaaj, Amrinder Gill, Kanwar Grewal | *Udaarian*, *Sajjan Raazi*, *Masoomiyat* |
| **Folk / Traditional** | 20 | Gurdas Maan, Kulwinder Billa, Surinder Kaur, Yamla Jatt | *Challa*, *Time Table*, *Dil Da Mamla Hai* |

---

## 📬 Connect & Collaborate

<div align="center">

**Jashanpreet Singh**  
*Final-Year B.Tech in Information Technology • JMIT Radaur, Haryana*

[![Live Portfolio](https://img.shields.io/badge/Portfolio-jashan2978.vercel.app-00dfa2?style=flat-square&logo=vercel&logoColor=white)](https://jashan2978.vercel.app)
[![GitHub](https://img.shields.io/badge/GitHub-Jashan--randhawa-181717?style=flat-square&logo=github&logoColor=white)](https://github.com/Jashan-randhawa)
[![Sponsor](https://img.shields.io/badge/Sponsor-GitHub_Sponsors-EA4AAA?style=flat-square&logo=github-sponsors&logoColor=white)](https://github.com/sponsors/Jashan-randhawa)

<br/>

<sub>⭐ If you find this project inspiring, please consider starring the repository!</sub>

</div>
