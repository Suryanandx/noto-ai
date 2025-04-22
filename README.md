# NOTO AI - Smart Notes App

![NOTO AI Logo](public/favicon.svg)

NOTO AI is an intelligent note-taking application that leverages AI to enhance your note-taking experience. Built by Suryanand, this application combines the simplicity of traditional note-taking with the power of AI to help you organize, analyze, and extract insights from your notes.

## ✨ Features

### Core Functionality
- 📝 Create, edit, and organize notes with a clean, intuitive interface
- 🏷️ Tag-based organization system
- 🔍 Powerful search capabilities across all notes
- 📱 Fully responsive design that works on all devices
- 🌓 Light and dark mode support
- 💾 Auto-save functionality to prevent data loss

### AI-Powered Features
- 🤖 Automatic content analysis with Grok AI
- 📊 Sentiment analysis to understand the tone of your notes
- 🏷️ Smart tag suggestions based on content
- ✅ Task extraction to identify actionable items
- 📋 Weekly summaries of your notes
- 🔄 Content translation to multiple languages
- 💡 "What's Missing" insights to improve your notes
- 🧵 "Threadify" feature to convert notes into social media threads

### User Experience
- 🔄 Draft recovery system to restore unsaved work
- 📊 Visual analytics of your note-taking patterns
- 📱 Touch-friendly interface with swipe gestures
- ⚡ Performance optimizations for large documents

## 🛠️ Technologies Used

- **Frontend**: Next.js 14 (App Router), React, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui components
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **AI Integration**: Grok AI (via AI SDK)
- **State Management**: React Context API
- **Deployment**: Vercel

## 🚀 Getting Started

### Prerequisites

- Node.js 18.x or higher
- npm or yarn
- Supabase account
- Grok AI API key

### Installation

1. Clone the repository:
   \`\`\`bash
   git clone https://github.com/yourusername/noto-ai.git
   cd noto-ai
   \`\`\`

2. Install dependencies:
   \`\`\`bash
   npm install
   # or
   yarn install
   \`\`\`

3. Set up environment variables:
   Create a `.env.local` file in the root directory with the following variables:
   \`\`\`
   POSTGRES_URL
   POSTGRES_PRISMA_URL
   SUPABASE_URL
   NEXT_PUBLIC_SUPABASE_URL
   POSTGRES_URL_NON_POOLING
   SUPABASE_JWT_SECRET
   POSTGRES_USER
   NEXT_PUBLIC_SUPABASE_ANON_KEY
   POSTGRES_PASSWORD
   POSTGRES_DATABASE
   SUPABASE_SERVICE_ROLE_KEY
   POSTGRES_HOST
   SUPABASE_ANON_KEY
   XAI_API_KEY
   NEXT_PUBLIC_BASE_URL
   NEXT_PUBLIC_XAI_API_KEY
   GROK_API_KEY
   NEXT_PUBLIC_GROK_API_KEY
   \`\`\`

4. Set up the database:
   Run the SQL scripts in the `database` directory to create the necessary tables and relationships in your Supabase project.

5. Run the development server:
   \`\`\`bash
   npm run dev
   # or
   yarn dev
   \`\`\`

6. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## 📁 Project Structure

\`\`\`
noto-ai/
├── app/                  # Next.js App Router pages
│   ├── dashboard/        # Dashboard and note management
│   ├── login/            # Authentication pages
│   └── api/              # API routes
├── components/           # React components
│   ├── ui/               # UI components (shadcn/ui)
│   └── ...               # Feature-specific components
├── context/              # React Context providers
├── hooks/                # Custom React hooks
├── lib/                  # Utility functions and libraries
│   ├── ai.ts             # AI integration functions
│   ├── env.ts            # Environment configuration
│   ├── supabase.ts       # Supabase client setup
│   └── ...               # Other utilities
├── public/               # Static assets
└── types/                # TypeScript type definitions
\`\`\`

## 🔌 API Endpoints

NOTO AI provides several API endpoints for interacting with the application's AI features:

### AI Service Endpoint
- **URL**: `/api/ai/service`
- **Method**: `POST`
- **Description**: General-purpose AI service endpoint for text generation
- **Request Body**:
  \`\`\`json
  {
    "operation": "string",
    "prompt": "string",
    "options": {}
  }
  \`\`\`
- **Response**: 
  \`\`\`json
  {
    "success": true,
    "text": "Generated text response"
  }
  \`\`\`

### Note Analysis Endpoint
- **URL**: `/api/ai/analyze`
- **Method**: `POST`
- **Description**: Analyzes note content to extract summary, tags, sentiment, tasks, and more
- **Request Body**:
  \`\`\`json
  {
    "content": "Your note content here"
  }
  \`\`\`
- **Response**:
  \`\`\`json
  {
    "summary": "Brief summary of the note",
    "suggestedTags": ["tag1", "tag2", "tag3"],
    "sentiment": "positive/neutral/negative",
    "tasks": ["task1", "task2"],
    "category": "category name",
    "mood": {
      "emoji": "😊",
      "mood": "Happy"
    }
  }
  \`\`\`

### Weekly Summary Endpoint
- **URL**: `/api/ai/weekly-summary`
- **Method**: `POST`
- **Description**: Generates a summary of notes from the past week
- **Request Body**:
  \`\`\`json
  {
    "notes": [
      {
        "title": "Note title",
        "content": "Note content",
        "date": "YYYY-MM-DD"
      }
    ]
  }
  \`\`\`
- **Response**:
  \`\`\`json
  {
    "summary": "Weekly summary text"
  }
  \`\`\`

### AI Status Endpoint
- **URL**: `/api/ai/status`
- **Method**: `GET`
- **Description**: Checks the status of the AI service
- **Response**:
  \`\`\`json
  {
    "status": "operational/degraded/error/unconfigured",
    "message": "Status message",
    "configured": true
  }
  \`\`\`

### Test AI Endpoint
- **URL**: `/api/test-ai`
- **Method**: `GET`
- **Description**: Tests the AI service and returns environment variable status
- **Response**:
  \`\`\`json
  {
    "status": "success/error",
    "message": "Status message",
    "response": "AI response text",
    "availableEnvVars": {
      "XAI_API_KEY": true,
      "NEXT_PUBLIC_XAI_API_KEY": true,
      "GROK_API_KEY": false,
      "NEXT_PUBLIC_GROK_API_KEY": false
    }
  }
  \`\`\`

## 💻 Interface Layout

### Desktop View
- **Sidebar**: Located on the left side, providing navigation to Home, Search, Settings, and Recent Notes
  - Can be collapsed to show only icons for more content space
  - Shows recent notes for quick access
  - Tags section for filtering notes by category
- **Header**: Contains the app logo, theme toggle, and user profile menu
- **Main Content**: 
  - Dashboard shows Weekly Summary, AI features card, and note cards in a grid
  - Note editor provides a clean writing experience with AI panel on the side
  - Search interface with powerful filtering options

### Mobile View
- **Collapsible Sidebar**: Accessible via hamburger menu
- **Responsive Layout**: UI elements reorganize for optimal mobile experience
- **Tab Navigation**: AI features accessible via tabs on smaller screens
- **Touch Optimized**: Swipe gestures for common actions

## 🧭 Navigation Guide

- **Dashboard**: The main view displays your notes, weekly summary, and AI features
  - Left sidebar provides quick access to Home, Search, Settings, and Recent Notes
  - Notes are displayed as cards in a grid layout
  - Weekly Summary section shows AI-generated insights about your recent notes
  - AI-Powered Note Taking section provides quick access to AI features
- **New Note**: Create a new note with AI assistance (accessible from multiple locations)
- **Edit Note**: Edit existing notes with full AI features in a clean, distraction-free interface
- **Search**: Search across all notes with tag filtering
- **Settings**: User profile and application settings

## 💻 Usage Instructions

### Creating a New Note
1. Click the "New Note" button in the sidebar or dashboard
2. Enter a title (or let AI suggest one)
3. Write your note content
4. Add tags manually or use AI-suggested tags
5. Click "Save" to store your note

### Using AI Features
1. While editing a note, click "Analyze with AI" in the AI panel
2. Review the AI analysis including summary, sentiment, and suggested tags
3. Apply any suggestions with a single click
4. Try specialized tools like translation or "What's Missing"

### Organizing Notes
1. Use tags to categorize your notes
2. Search for notes by content or tags
3. View your weekly summary to track patterns and insights

### Keyboard Shortcuts
- `Ctrl+S`: Save note
- `Ctrl+F`: Search within note
- `Ctrl+B`: Toggle sidebar

## 🔒 Security

- All data is stored in your Supabase database
- Authentication is handled securely via Supabase Auth
- API keys are never exposed to the client
- Environment variables are properly configured for client and server usage

## 🙏 Credits

- Designed and developed by Suryanand
- AI functionality powered by Grok
- UI components from shadcn/ui
- Icons from Lucide React

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

For questions or support, please contact Suryanand at work@suryanand.com
