# 📱 Unyt – Bridging Colleges, Building Communities
<div style="position: absolute; top: 0; right: 0;">
  <img src="Github/badge.png" alt="Badge" width="80" />
</div>
A unified app-ecosystem for inter-college collaboration, announcements, events, quizzes, and more. Built using Flutter (Mobile) and Next.js (Web) with Firebase as the backend.

---
## 📹 Demo Video
Watch Here: [Demo Video](https://youtu.be/ECsMwjBcfP8?si=J7YJOLSgtgllj8uL)

## Presentation
Link: [Unyt Presentation](https://drive.google.com/drive/folders/1MBxVWiNqDM66BjjmyKTZvjNiYWHc89Cj?usp=sharing)

## 🧽 Table of Contents
- [🚀 Overview](#-overview)
- [📸 UI & Visuals](#-ui--visuals)
- [🗃️ Database Schema](#️-database-schema)
- [🏗️ Architecture](#️-architecture)
- [🧰 Tech Stack](#-tech-stack)
- [📦 Setup](#-setup)
- [🤝 Contributing](#-contributing)
- [📄 License](#-license)

---

## 🚀 Overview

Unyt is a cross-platform platform aiming to connect college students through a centralized app and web system. With personalized homepages, discussion forums, quiz battles, and a leaderboard system, Unyt enhances student collaboration beyond campus boundaries.

---

## 📸 UI & Visuals

### 🔹 Web Interface
<img src="./Github/Screenshot_20-4-2025_65138_localhost.jpeg" alt="Website Desktop UI" width="540" style="margin-top: 24px;"/>

### 🔹 Mobile App (Flutter)
<p float="left">
<img src="./Github/WhatsApp Image 2025-04-20 at 6.31.26 AM.jpeg" alt="Mobile UI 1" width="180" style="margin: 0 8px;"/>
<img src="./Github/WhatsApp Image 2025-04-20 at 6.41.49 AM (1).jpeg" alt="Mobile UI 2" width="180" style="margin: 0 8px;"/>
<img src="./Github/WhatsApp Image 2025-04-20 at 6.41.49 AM.jpeg" alt="Mobile UI 3" width="180" style="margin: 0 8px;"/>
</p>

---

## Features

### 📱 Mobile App (Flutter)
- College-specific home, global feed, and event discovery
- Forums and discussions for student engagement
- Quizzes and battles for learning and competition
- Leaderboards for colleges, students, and quizzes
- Profile management and achievements
- Notifications, analytics, and Firebase integration

### 🌐 Website (Next.js)
- Landing page and onboarding
- College dashboard: bulletins, events, notices
- Forums and topic discussions
- Quiz and battle rooms
- Leaderboards and achievements
- Profile and settings management
- Modern, responsive UI with Tailwind CSS

--- 

## 🗃️ Database Schema

### 🔸 Firebase Firestore Schema
<img src="https://your-domain.com/diagrams/firestore-schema.png" width="800"/>

### 🔸 Entity-Relationship Diagram (ERD)
```mermaid
erDiagram
    College ||--o{ Event : hosts
    College ||--o{ User : enrolls
    Event ||--o{ Registration : has
    User ||--o{ Registration : makes
    Event ||--o{ Quiz : features
    Quiz ||--o{ Question : contains
    User ||--o{ Discussion : starts
    Event ||--o{ Discussion : includes

    College {
        string name
        string domain
    }
    User {
        string uid
        string name
        string email
        string role
    }
    Event {
        string id
        string title
        datetime startTime
        datetime endTime
    }
    Registration {
        string userId
        string eventId
        timestamp registeredAt
    }
    Quiz {
        string quizId
        string title
    }
    Question {
        string questionId
        string content
        string correctAnswer
    }
    Discussion {
        string threadId
        string content
        timestamp postedAt
    }
```
</details>

---

## 🏗️ Architecture

### 🔸 Tech Flow
- Mobile and Web apps interact with Firebase (Auth, Firestore, Storage)
- Cloud Functions for background operations
- Firestore triggers for event-driven features

### 📊 Mermaid Architecture Diagram
```mermaid
graph TD
    A[Flutter Mobile App] --> B(Firebase)
    C[Next.js Web Portal] --> B

    B --> D[Firestore DB]
    B --> E[Authentication]
    B --> F[Storage]

    B --> G[Cloud Functions]
    G -->|Triggers| B

    D --> H[Colleges]
    D --> I[Students]
    D --> J[Global Feed]
    D --> K[Events]
    D --> L[Discussions]

    H --> M[Bulletin]
    H --> N[Messages]
    H --> O[Polls]
```
</details>

---

## 🧠 AI Workflows

### 🤖 Chatbot Assistant

```mermaid
graph TD
    U[User Message] --> I[Firebase]
    I --> C[Context Handler]
    C --> Q[Query Generator]
    Q --> R[Response From API]
    R --> U2[Reply to User]
```

### 🧠 Quiz Generator

```mermaid
graph TD
    A[Admin Uploads Material] --> B[LLM Parser + Summarizer]
    B --> C[Question Bank Generator]
    C --> D[Firestore Quiz Collection]
    D --> E[Quiz Module Rendered in App]
```

### 📚 AI Learning Hub

```mermaid
graph TD
    S[User selects topic] --> T[LLM-Powered Julep Agent]
    T --> U[Fetch Concepts + Examples via Actions]
    U --> V[10 s Timeout before Native Gemini API]
    V --> W[Response Returned]
    W --> X[Formaat as Interactive Flashcards/Learning Methods + Explanations]
```

---

## 🧰 Tech Stack

| Platform      | Tools & Frameworks                           |
|---------------|----------------------------------------------|
| Mobile App    | Flutter, Dart, Provider etc                  |
| Web Portal    | TypeScript, Next.js, Tailwind CSS, Vercel    |
| Backend       | Firebase Auth, Firestore                     |

---

## 📦 Setup

### 🔧 Mobile App (Flutter)
```bash
cd app
flutter pub get
flutter run
```

### 🔧 Web App (TypeScript)
```bash
cd website
pnpm i
pnpm run dev
```

---

## Contributing
Contributions are welcome! Please open issues and pull requests for improvements, bugfixes, or new features.

## Authors & Credits
Team Phoenix
Members - Shanu Kumawat, Revan Channa, Samudraneel Sarkar, Suyash Jain

