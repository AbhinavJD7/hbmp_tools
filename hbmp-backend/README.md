
# 🧩 HBMP – Google Docs Integration Prototype

This prototype integrates **Google Docs** directly into the **HBMP (Holistic Business Management Platform)** workspace, allowing users to list, open, and create Google Docs inside the app using OAuth-based authorization.

---

## 🚀 What This Prototype Does

### ✅ **Core Features Implemented**

| Phase                      | Feature                    | Description                                                                                                                        |
| -------------------------- | -------------------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| **1. UI Scaffold**         | React workspace shell      | Created a `Vite + React + TypeScript` app with a sidebar (`Tools → Docs, Sheets, Forms`).                                          |
|                            | Layout structure           | Built `AppLayout.tsx` with React Router routes `/tools/docs`, `/tools/sheets`, `/tools/forms`.                                     |
| **2. Docs Workspace**      | Static Docs page           | Implemented the Docs page with mock data and an iframe preview.                                                                    |
|                            | Real document embedding    | Embedded real Google Docs using their `/edit` links inside iframes.                                                                |
| **3. Backend Setup**       | Express server             | Created a Node.js + Express backend with Google OAuth 2.0 and Drive API integration.                                               |
|                            | OAuth 2.0                  | Configured OAuth Client (Web Application) in Google Cloud Console with redirect URI `http://localhost:3000/google/oauth/callback`. |
|                            | Google Drive API           | Enabled Drive API, implemented endpoints for authorization, callback, listing, and creating docs.                                  |
| **4. Full Integration**    | React ↔ Express connection | Connected frontend to backend using fetch requests and `VITE_API_BASE_URL`.                                                        |
|                            | Live Docs listing          | Fetched the user’s real Google Docs via `/google/docs/list`.                                                                       |
|                            | “Connect Google” flow      | Added a button to start OAuth if not authorized.                                                                                   |
| **5. CORS Fix**            | Development compatibility  | Added CORS middleware to allow both `http://localhost:5173` and `5174` origins.                                                    |
| **6. Create New Document** | Drive API – create         | Implemented `/google/docs/create` route to create a new doc with default name.                                                     |
|                            | UI integration             | Added “+ New” button in React to create and open the doc instantly.                                                                |
| **7. Token Persistence**   | File-based token store     | Used `fs-extra` to persist OAuth tokens to `tokens.json`, enabling automatic re-login after restart.                               |

---

## 🧠 Key Learnings / Architecture

```
[React (Vite + Tailwind)]
   ↓
[Express Backend]
   ↓
[Google APIs via OAuth2Client]
   ↓
[Google Drive + Docs]
```

**APIs Used:**

* `googleapis` (Drive v3, OAuth2)
* `express`, `cors`, `dotenv`, `fs-extra`

**Frontend Stack:**

* React, TypeScript, Vite, TailwindCSS, React Router

---

## 🧾 Endpoints Summary

| Endpoint                 | Method | Purpose                                            |
| ------------------------ | ------ | -------------------------------------------------- |
| `/google/auth`           | GET    | Redirect user to Google OAuth consent screen       |
| `/google/oauth/callback` | GET    | Handles Google callback, exchanges code for tokens |
| `/google/docs/list`      | GET    | Lists all Google Docs (name, ID, link)             |
| `/google/docs/create`    | POST   | Creates a new Google Doc in Drive                  |
| `/`                      | GET    | Health check endpoint                              |

---

## 🖥️ Frontend Features

| Component                 | Purpose                                                |
| ------------------------- | ------------------------------------------------------ |
| **Sidebar**               | Lists available tools – Docs, Sheets, Forms            |
| **Docs Page**             | Displays document list + embedded viewer               |
| **+ New Button**          | Calls backend to create new Google Doc                 |
| **Iframe Viewer**         | Loads the selected document live in the HBMP workspace |
| **Connect Google Button** | Redirects to OAuth flow when not authorized            |

---

## ⚙️ Local Setup Instructions

```bash
# Clone frontend + backend
cd hbmp-backend
npm install
node server.js

cd ../hbmp-tools
npm install
npm run dev
```

Open:

* Backend: [http://localhost:3000](http://localhost:3000)
* Frontend: [http://localhost:5173/tools/docs](http://localhost:5173/tools/docs)

---

## 🧩 Environment Variables

### `.env` (backend)

```env
GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-client-secret
GOOGLE_REDIRECT_URI=http://localhost:3000/google/oauth/callback
PORT=3000
```

### `.env` (frontend)

```env
VITE_API_BASE_URL=http://localhost:3000
```

---

## 🧠 How It Works (Flow Summary)

1. **User opens HBMP Docs workspace.**
2. **Frontend** calls `/google/docs/list` → backend checks for saved tokens.
3. If not authorized → user redirected to `/google/auth`.
4. **Google OAuth flow** → backend exchanges code for tokens → saves to `tokens.json`.
5. Frontend refreshes → lists real Google Docs via Drive API.
6. “+ New” → calls `/google/docs/create` → instantly adds doc in list and opens in iframe.

---

## 🔒 Folder Structure

```
hbmp-backend/
 ├─ googleClient.js        # OAuth client setup
 ├─ server.js              # Express routes & main logic
 ├─ .env                   # Google credentials
 └─ tokens.json            # Persisted tokens (auto-created)

hbmp-tools/
 ├─ src/
 │   ├─ layouts/AppLayout.tsx
 │   ├─ pages/Docs.tsx
 │   └─ main.tsx
 └─ .env
```

---

## 🚧 Future Steps (Next Phases)

| Step                                  | Description                                                                                        |
| ------------------------------------- | -------------------------------------------------------------------------------------------------- |
| **7. Metadata Persistence**           | Save created/listed docs metadata (ID, title, timestamps, ownerUserId, projectId) in Prisma/MySQL. |
| **8. Template Automation (Docs API)** | Use Google Docs API (`documents.batchUpdate`) to auto-fill placeholders (e.g., `{{client_name}}`). |
| **9. Webhooks / Auto-Sync**           | Add Google Drive push notifications to sync file updates to HBMP.                                  |
| **10. Permission Management**         | Implement `/google/docs/share` route to manage access via Drive API (`permissions.create`).        |
| **11. Dashboard Integration**         | Show linked documents under each HBMP project, include search and filters.                         |
| **12. Deployment & Secrets**          | Move credentials to secure vault (AWS/GCP Secret Manager) and deploy backend with HTTPS.           |

---

## 🏁 Status

✅ **Prototype Ready** — Demonstrates:

* OAuth 2.0 login
* Listing + viewing + creating Docs
* Persistent login
* Embedded workspace UI

🧭 **Next focus:** persistence, automation, and governance layers.
