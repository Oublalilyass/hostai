# 🏠 HostAI — AI Assistant for Airbnb Hosts

> Automate check-in, check-out, guest messaging, and cleaning notifications across all your properties with AI.

![HostAI](https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1200&h=400&fit=crop)

---

## ✨ Features

- **🔐 Authentication** — JWT-based login/register with multilingual UI
- **🏠 Property Management** — Full CRUD with FR/EN/ES content per property
- **📅 Booking Management** — Import and manage bookings manually
- **🤖 AI Guest Messaging** — Auto check-in/checkout messages + FAQ bot (3 languages)
- **🧹 Cleaning Management** — Auto-create tasks on checkout + status tracking
- **🔔 Notifications** — Dashboard alerts for upcoming events
- **🌐 Multilingual** — Full EN/FR/ES support across UI, messages, and notifications

---

## 🛠 Tech Stack

| Layer        | Technology                         |
|--------------|-------------------------------------|
| Backend      | Node.js + Express                   |
| Frontend     | Next.js 14 (App Router)             |
| Database     | PostgreSQL                          |
| Auth         | JWT (jsonwebtoken + js-cookie)      |
| AI           | Pluggable (Anthropic Claude / OpenAI) |
| Styling      | TailwindCSS (Airbnb-inspired)       |

---

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- PostgreSQL 14+
- npm or yarn

---

### 1. Clone and install

```bash
git clone <your-repo>
cd hostai

# Install backend deps
cd backend && npm install

# Install frontend deps
cd ../frontend && npm install
```

---

### 2. Set up the database

```bash
# Create database
psql -U postgres -c "CREATE DATABASE hostai;"

# Run schema
psql -U postgres -d hostai -f database/schema.sql

# Seed test data
psql -U postgres -d hostai -f database/seed.sql
```

---

### 3. Configure environment

**Backend:**
```bash
cd backend
cp .env.example .env
```

Edit `backend/.env`:
```env
PORT=4000
NODE_ENV=development
DATABASE_URL=postgresql://postgres:your_password@localhost:5432/hostai
JWT_SECRET=your-super-secret-key-min-32-chars
FRONTEND_URL=http://localhost:3000
```

**Frontend:**
```bash
cd frontend
cp .env.local.example .env.local
```

Edit `frontend/.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:4000/api
```

---

### 4. Run the app

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
# → http://localhost:4000
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
# → http://localhost:3000
```

---

### 5. Log in with demo credentials

```
Email:    host@hostai.demo
Password: password123
```

---

## 📁 Project Structure

```
hostai/
├── database/
│   ├── schema.sql          # PostgreSQL schema
│   └── seed.sql            # Test data
│
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   │   ├── authController.js
│   │   │   ├── propertiesController.js
│   │   │   ├── bookingsController.js
│   │   │   ├── aiController.js          ⚡ AI Integration Point
│   │   │   ├── cleaningController.js
│   │   │   └── notificationsController.js
│   │   ├── middleware/
│   │   │   └── auth.js                  # JWT middleware
│   │   ├── routes/
│   │   │   └── index.js                 # All API routes
│   │   ├── utils/
│   │   │   └── db.js                    # PostgreSQL pool
│   │   └── index.js                     # Express entry point
│   ├── .env.example
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── app/
    │   │   ├── layout.tsx               # Root layout
    │   │   ├── page.tsx                 # Redirect → /dashboard
    │   │   ├── globals.css              # Airbnb-style CSS
    │   │   ├── auth/
    │   │   │   ├── login/page.tsx       # Login page
    │   │   │   └── register/page.tsx    # Register page
    │   │   ├── dashboard/page.tsx       # Stats + overview
    │   │   ├── properties/page.tsx      # Property CRUD
    │   │   ├── bookings/page.tsx        # Booking CRUD
    │   │   ├── ai-chat/page.tsx         # AI Messaging hub
    │   │   └── cleaning/page.tsx        # Cleaning tasks
    │   ├── components/
    │   │   ├── layout/
    │   │   │   ├── Sidebar.tsx          # Nav + language switcher
    │   │   │   └── DashboardLayout.tsx  # Auth-protected layout
    │   │   └── ui/
    │   │       └── index.tsx            # Modal, Badge, Field, etc.
    │   ├── hooks/
    │   │   └── useAuth.tsx              # Auth context
    │   └── lib/
    │       ├── api.ts                   # Axios client + API helpers
    │       └── i18n.ts                  # EN/FR/ES translations
    ├── next.config.js
    ├── tailwind.config.js
    └── package.json
```

---

## 🌐 API Endpoints

### Auth
| Method | Endpoint           | Description            |
|--------|--------------------|------------------------|
| POST   | `/api/auth/register` | Create account        |
| POST   | `/api/auth/login`   | Login + get JWT token  |
| GET    | `/api/auth/me`      | Get current user       |
| PUT    | `/api/auth/profile` | Update profile         |

### Properties
| Method | Endpoint              | Description        |
|--------|-----------------------|--------------------|
| GET    | `/api/properties`     | List all           |
| POST   | `/api/properties`     | Create             |
| PUT    | `/api/properties/:id` | Update             |
| DELETE | `/api/properties/:id` | Delete             |

### Bookings
| Method | Endpoint           | Description        |
|--------|--------------------|--------------------|
| GET    | `/api/bookings`    | List (filterable)  |
| POST   | `/api/bookings`    | Create             |
| PUT    | `/api/bookings/:id`| Update + auto-tasks|
| DELETE | `/api/bookings/:id`| Delete             |

### AI Messaging
| Method | Endpoint           | Description              |
|--------|--------------------|-----------------------------|
| POST   | `/api/ai/generate` | Generate checkin/checkout msg |
| POST   | `/api/ai/chat`     | FAQ bot conversation      |
| GET    | `/api/ai/messages` | Message history           |

### Cleaning
| Method | Endpoint           | Description       |
|--------|--------------------|--------------------|
| GET    | `/api/cleaning`    | List tasks         |
| POST   | `/api/cleaning`    | Create task        |
| PUT    | `/api/cleaning/:id`| Update status      |
| DELETE | `/api/cleaning/:id`| Delete task        |

---

## ⚡ AI Integration

The AI messaging system is pre-structured for easy integration. Open `backend/src/controllers/aiController.js` and replace the mock function with your preferred AI provider:

### Option A: Anthropic Claude

```bash
npm install @anthropic-ai/sdk
```

```javascript
// In aiController.js - generateAIMessage function
const Anthropic = require('@anthropic-ai/sdk');
const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const message = await client.messages.create({
  model: 'claude-opus-4-5',
  max_tokens: 1024,
  system: `You are a helpful AI assistant for Airbnb hosts. 
           Respond in ${language} language. Be warm, professional and concise.`,
  messages: [{
    role: 'user',
    content: `Generate a ${type} message for guest ${guestName} at ${propertyTitle}. 
              Check-in instructions: ${checkinInstructions}`
  }]
});

return message.content[0].text;
```

Add to `.env`:
```env
ANTHROPIC_API_KEY=sk-ant-...
```

### Option B: OpenAI

```bash
npm install openai
```

```javascript
const OpenAI = require('openai');
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const completion = await openai.chat.completions.create({
  model: 'gpt-4o',
  messages: [
    { role: 'system', content: `You are a helpful Airbnb host assistant. Respond in ${language}.` },
    { role: 'user', content: `Generate a ${type} message for ${guestName}...` }
  ]
});

return completion.choices[0].message.content;
```

---

## 🗄 Database Schema

```
users ──┬── properties ──┬── bookings ──┬── ai_messages
        │                │              └── cleaning_tasks
        │                └── cleaning_tasks
        └── notifications
```

### Key tables:
- **users** — host accounts with preferred language
- **properties** — multilingual (EN/FR/ES) property listings
- **bookings** — guest stays linked to properties
- **ai_messages** — full history of AI-generated messages
- **cleaning_tasks** — auto-created on checkout
- **notifications** — in-dashboard alerts

---

## 🎨 Airbnb Design System

The app uses an Airbnb-inspired design system built with TailwindCSS:

| Token | Value | Usage |
|-------|-------|-------|
| `rausch` | `#FF385C` | Primary actions, CTA |
| `babu` | `#00A699` | Success, confirmed states |
| `ariel` | `#FC642D` | Warnings, cleaning |
| `hof` | `#222222` | Primary text |
| `foggy` | `#717171` | Secondary text |
| `beach` | `#F7F7F7` | Page background |
| `sand` | `#DDDDDD` | Borders, dividers |

CSS utility classes:
- `.btn-primary` — Gradient red CTA button
- `.btn-secondary` — Outlined button
- `.btn-ghost` — Ghost nav button
- `.card` — Hoverable property card
- `.input` — Styled form input
- `.label` — Uppercase field label
- `.badge` — Status badge
- `.stat-card` — Dashboard metric card

---

## 🧪 Test Accounts

| Email | Password | Language |
|-------|----------|----------|
| `host@hostai.demo` | `password123` | French |
| `john@hostai.demo` | `password123` | English |

---

## 🔧 Customization

### Add a new language
1. Add translations to `frontend/src/lib/i18n.ts`
2. Update `preferred_language` CHECK constraint in `schema.sql`
3. Add language option to `Sidebar.tsx` and register forms

### Add email notifications
Uncomment and configure Nodemailer in `backend/.env`:
```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your@gmail.com
SMTP_PASS=your-app-password
```

Then call the email utility from any controller event.

### Connect Airbnb/VRBO API
Replace manual booking creation with API webhook handlers in `backend/src/routes/index.js`.

---

## 📦 Production Deployment

### Backend (Railway / Render / Heroku)
```bash
NODE_ENV=production
DATABASE_URL=<your-production-db-url>
JWT_SECRET=<strong-random-secret>
FRONTEND_URL=https://your-frontend.com
```

### Frontend (Vercel)
```bash
NEXT_PUBLIC_API_URL=https://your-backend.com/api
```

---

## 📄 License

MIT — Build something great for hosts worldwide.
