# 🧠 NOTO AI - Smart Notes App

![NOTO AI Logo](public/favicon.svg)

**NOTO AI** is an intelligent note-taking app that combines simplicity with powerful AI features to help you write better, stay organized, and gain insights from your notes. Built with ❤️ by **Suryanand**, it’s designed for modern users who want more than just a digital notebook.

---

## ✨ Features

### Core Features
- 📝 Create, edit, and organize notes with a clean, intuitive UI
- 🏷️ Tag-based note categorization
- 🔍 Fast, powerful search across all notes
- 💾 Auto-save to prevent data loss
- 🌓 Light and dark mode
- 📱 Fully responsive design for all screen sizes

### AI-Powered Features (via Grok AI)
- 🤖 Automatic content analysis
- 📊 Sentiment detection to understand note tone
- 🏷️ Smart tag suggestions
- ✅ Actionable task extraction
- 🧾 Weekly AI-generated note summaries
- 🌍 Content translation to multiple languages
- 💡 “What’s Missing” suggestions to enhance notes
- 🧵 “Threadify” – turn notes into social media threads

### UX Enhancements
- 🔄 Draft recovery for unsaved work
- 📊 Visual analytics of note-taking behavior
- 📱 Touch-friendly gestures
- ⚡ Optimized for large documents

---

## 🛠️ Tech Stack

| Layer          | Stack                             |
|----------------|------------------------------------|
| Frontend       | Next.js 14 (App Router), React, TypeScript |
| Styling        | Tailwind CSS, shadcn/ui           |
| Database       | Supabase (PostgreSQL)             |
| Auth           | Supabase Auth                     |
| AI Integration | Grok AI (via SDK)                 |
| State Mgmt     | React Context API                 |
| Deployment     | Vercel                            |

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn
- Supabase account
- Grok AI API Key

### Installation

1. **Clone the repo**
   ```bash
   git clone https://github.com/Suryanandx/noto-ai.git
   cd noto-ai
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Setup environment variables**
   Create a `.env.local` file in the root with:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
   XAI_API_KEY=your_grok_api_key
   ```

4. **Set up the database**
   Run the SQL scripts in the `database/` folder on your Supabase instance.

5. **Run the dev server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

6. Open `http://localhost:3000` in your browser 🎉

---

## 📁 Project Structure

```
noto-ai/
├── app/                  # App Router pages
│   ├── dashboard/        # Notes dashboard
│   ├── login/            # Auth pages
│   └── api/              # API routes
├── components/           # UI and shared components
│   ├── ui/               # shadcn/ui-based elements
├── context/              # Context providers
├── hooks/                # Custom hooks
├── lib/                  # Utilities and services
│   ├── ai.ts             # AI integration logic
│   ├── supabase.ts       # Supabase client
├── public/               # Static assets
└── types/                # TypeScript types
```

---

## 🧭 Navigation

- **Dashboard**: All notes + weekly summary
- **New Note**: Create note with optional AI help
- **Edit Note**: Full-featured editing with AI
- **Search**: Full-text + tag-based search
- **Settings**: Profile & app preferences

---

## 💻 How to Use

### Create a New Note
- Click “New Note”
- Add title (or let AI suggest one)
- Write your content
- Add tags manually or via AI
- Hit "Save"

### AI Tools
- Click “Analyze with AI” inside the note editor
- Review insights: summary, sentiment, tags
- Use extra tools like:
  - "What’s Missing"
  - Translate
  - Threadify for X (Twitter)

### Organize & Navigate
- Use tags for categories
- Search by keyword or tag
- Weekly summaries keep you in the loop

### Keyboard Shortcuts
- `Ctrl + S` → Save note
- `Ctrl + F` → Search
- `Ctrl + B` → Toggle sidebar

---

## 🔒 Security

- Supabase handles database and authentication
- Environment variables secure API keys
- Backend-only access to sensitive operations

---

## 🙏 Credits

- 👨‍💻 Built by **Suryanand**
- ⚡ AI by **Grok AI**
- 🧩 UI by **shadcn/ui**
- 🎨 Icons from **Lucide React**
