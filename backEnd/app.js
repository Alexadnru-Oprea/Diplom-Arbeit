import express from "express";
import cors from "cors";
import fs from "fs/promises";

const app = express();
app.use(express.json());
app.use(cors());

let users = []; // [{username, password}]

// === регистрация ===
app.post("/register", async (req, res) => {
  const { username, password } = req.body;
  if (users.find(u => u.username === username)) {
    return res.status(400).json({ error: "Benutzer existiert bereits" });
  }
  users.push({ username, password });
  await fs.writeFile("users.json", JSON.stringify(users, null, 2));
  res.json({ message: "Registrierung erfolgreich" });
});

// === логин ===
app.post("/login", (req, res) => {
  const { username, password } = req.body;
  const user = users.find(u => u.username === username && u.password === password);
  if (!user) {
    return res.status(400).json({ error: "Falscher Benutzername oder Passwort" });
  }
  // просто возвращаем «вы залогинились»
  res.json({ message: `Willkommen, ${username}` });
});

app.get("/profile", (req, res) => {

  res.json({ message: "Dies wäre ein geschützter Bereich" });
});

app.listen(3000, () => console.log("Server läuft auf Port 3000"));