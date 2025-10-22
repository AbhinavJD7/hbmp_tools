import express from "express";
import { google } from "googleapis";
import dotenv from "dotenv";
import cors from "cors";
import fs from "fs-extra";
import { oauth2Client, getAuthUrl } from "./googleClient.js";

dotenv.config();

const TOKEN_PATH = "./tokens.json";

const app = express();
app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:5174"],
    credentials: true,
  })
);
app.use(express.json());

let tokens = null; // store in memory for now

// Load tokens if file exists
if (fs.existsSync(TOKEN_PATH)) {
  const saved = fs.readJSONSync(TOKEN_PATH);
  oauth2Client.setCredentials(saved);
  tokens = saved;
  console.log("✅ Loaded existing Google tokens from file");
}

// 🔹 Health check endpoint
app.get("/", (req, res) => {
  res.json({ status: "ok", message: "HBMP Backend is running" });
});

// 🔹 1️⃣ Redirect user to Google OAuth
app.get("/google/auth", (req, res) => {
  const url = getAuthUrl();
  res.redirect(url);
});

// 🔹 2️⃣ Handle callback and store tokens
app.get("/google/oauth/callback", async (req, res) => {
  try {
    const code = req.query.code;
    const { tokens: googleTokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(googleTokens);
    tokens = googleTokens;
    await fs.writeJSON(TOKEN_PATH, googleTokens); // 👈 persist tokens
    console.log("✅ Tokens saved to file");
    res.send("✅ Google account connected. Tokens saved to file.");
  } catch (err) {
    console.error("OAuth callback error:", err);
    res.status(500).send("OAuth error");
  }
});

// 🔹 3️⃣ List Google Docs from Drive
app.get("/google/docs/list", async (req, res) => {
  try {
    if (!tokens) return res.status(401).send("Not authorized");
    oauth2Client.setCredentials(tokens);
    const drive = google.drive({ version: "v3", auth: oauth2Client });

    const response = await drive.files.list({
      q: "mimeType='application/vnd.google-apps.document' and trashed=false",
      fields: "files(id, name, webViewLink, createdTime, modifiedTime)",
      pageSize: 100, // Increased from 10 to 100
      orderBy: "modifiedTime desc", // Sort by most recently modified
    });

    console.log(`📄 Found ${response.data.files?.length || 0} documents`);
    res.json(response.data);
  } catch (err) {
    console.error("Error listing docs:", err);
    res.status(500).send("Error listing documents");
  }
});

// 🔹 4️⃣ Create new Google Doc
app.post("/google/docs/create", async (req, res) => {
  try {
    if (!tokens) return res.status(401).send("Not authorized");
    oauth2Client.setCredentials(tokens);
    const drive = google.drive({ version: "v3", auth: oauth2Client });

    const fileMetadata = {
      name: `New HBMP Document ${new Date().toLocaleString()}`,
      mimeType: "application/vnd.google-apps.document",
    };

    const file = await drive.files.create({
      resource: fileMetadata,
      fields: "id, name, webViewLink",
    });

    res.json(file.data);
  } catch (err) {
    console.error("Error creating doc:", err);
    res.status(500).send("Error creating document");
  }
});

app.listen(process.env.PORT, () =>
  console.log(`🚀 Server running on http://localhost:${process.env.PORT}`)
);
