Here’s a rewritten and polished version of the `README.md` for **NOTO AI** in a clean, structured, and professional format — with the same content but improved clarity, readability, and formatting:

---

# 🧠 NOTO AI – Smart Notes with AI

![NOTO AI Logo](public/favicon.svg)

**NOTO AI** is an intelligent note-taking app that fuses a clean writing experience with the power of AI. Built by [Suryanand](https://github.com/Suryanandx), it helps you write, organize, and extract insights from your notes with ease.

---

## ✨ Features

### 🛠 Core Functionality
- 📝 Create, edit, and organize notes in a simple interface
- 🏷️ Organize with tags
- 🔍 Smart search across all notes
- 📱 Fully responsive (mobile, tablet, desktop)
- 🌓 Light & Dark modes
- 💾 Auto-save to prevent data loss

### 🤖 AI-Powered Add-ons (via Grok AI)
- 📊 Sentiment analysis
- 🏷️ AI-suggested tags
- ✅ Auto task extraction
- 📋 Weekly summaries of your notes
- 🔄 Translate content to multiple languages
- 💡 “What’s Missing” insights
- 🧵 Convert notes into Twitter-like threads (`Threadify`)

### 🧠 Enhanced UX
- 🧯 Draft recovery
- 📈 Analytics on your writing behavior
- 👆 Touch-first design with gesture support
- ⚡ Fast even for large notes

---

## 🧰 Tech Stack

| Area         | Tech                        |
|--------------|-----------------------------|
| Frontend     | Next.js 14 (App Router), React, TypeScript |
| UI Framework | Tailwind CSS, `shadcn/ui` |
| Backend DB   | Supabase (PostgreSQL)       |
| Auth         | Supabase Auth               |
| AI           | Grok AI                     |
| State Mgmt   | React Context API           |
| Hosting      | Vercel                      |

---

## 🚀 Getting Started

### ✅ Prerequisites
- Node.js ≥ 18.x
- npm or yarn
- Supabase account
- Grok AI API key

### ⚙️ Installation

1. **Clone the repo**
   ```bash
   git clone https://github.com/yourusername/noto-ai.git
   cd noto-ai
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Set environment variables**

   Create a `.env.local` file and fill in the following:

   ```
   POSTGRES_URL=
   POSTGRES_PRISMA_URL=
   SUPABASE_URL=
   NEXT_PUBLIC_SUPABASE_URL=
   POSTGRES_URL_NON_POOLING=
   SUPABASE_JWT_SECRET=
   POSTGRES_USER=
   NEXT_PUBLIC_SUPABASE_ANON_KEY=
   POSTGRES_PASSWORD=
   POSTGRES_DATABASE=
   SUPABASE_SERVICE_ROLE_KEY=
   POSTGRES_HOST=
   SUPABASE_ANON_KEY=
   XAI_API_KEY=
   NEXT_PUBLIC_BASE_URL=
   NEXT_PUBLIC_XAI_API_KEY=
   GROK_API_KEY=
   NEXT_PUBLIC_GROK_API_KEY=
   ```

4. **Initialize database**

   Execute the SQL files in the `database/` folder inside your Supabase project.

5. **Run development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

6. Visit `http://localhost:3000` in your browser.

---

## 📁 Project Structure

```
noto-ai/
├── app/                  # App Router-based pages
│   ├── dashboard/        # Main dashboard views
│   ├── login/            # Authentication
│   └── api/              # API routes
├── components/           # UI & functional components
├── context/              # Context providers
├── hooks/                # Custom hooks
├── lib/                  # Utility functions
├── public/               # Static assets
└── types/                # TS types
```

---

## 🔌 API Endpoints

### `/api/ai/service`
- **POST** – General-purpose AI service
```json
{ "operation": "string", "prompt": "string", "options": {} }
```

### `/api/ai/analyze`
- **POST** – Analyzes content, extracts insights
```json
{ "content": "Your note content here" }
```

### `/api/ai/weekly-summary`
- **POST** – Weekly summary of notes
```json
{
  "notes": [
    { "title": "Title", "content": "Note", "date": "YYYY-MM-DD" }
  ]
}
```

### `/api/ai/status`
- **GET** – Checks AI service status

### `/api/test-ai`
- **GET** – Tests AI integration + env keys

---

## 💻 Interface Overview

### 🖥 Desktop
- Left sidebar: Home, Search, Tags, Settings
- Header: Logo, theme toggle, profile
- Main:
  - Weekly summaries
  - AI features dashboard
  - Note cards grid
  - Powerful editor with AI panel

### 📱 Mobile
- Hamburger sidebar
- Tab navigation for AI tools
- Swipe gestures & responsive layout


## 🧪 How to Use

### ✍ Create a Note
1. Click "New Note"
2. Add title + content
3. Use AI for title/tags
4. Save

### 🤖 Analyze with AI
1. Open a note
2. Click “Analyze with AI”
3. Review tags, sentiment, summary
4. Apply with one click

### 🗃 Organize & Search
- Use tags
- View insights in dashboard
- Full-text + tag search

### ⌨️ Shortcuts
- `Ctrl + S`: Save
- `Ctrl + F`: Search
- `Ctrl + B`: Toggle sidebar

---

## 🔐 Security

- Data stored via Supabase (PostgreSQL)
- Auth via Supabase Auth
- API keys hidden from frontend
- All env variables scoped appropriately

---

## 🙌 Credits

- Built by [Suryanand](https://github.com/Suryanandx)
- AI by [Grok AI](https://xai.com)
- UI components: `shadcn/ui`
- Icons: Lucide
