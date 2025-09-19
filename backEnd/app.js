import express from "express";
import cors from "cors";


const app = express();
app.use(express.json());
app.use(cors()); // разрешаем запросы с фронтенда

let users = []; // база пользователей в памяти

// Регистрация
app.post("/register", (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.json({ message: "Bitte Benutzernamen und Passwort eingeben!" });
  }
  users.push({ username, password });
  res.json({ message: "Benutzer registriert!", users });
});

// Логин
app.post("/login", (req, res) => {
  const { username, password } = req.body;
  const user = users.find(u => u.username === username && u.password === password);
  if (user) {
    res.json({ message: "Login erfolgreich!", users });
  } else {
    res.json({ message: "Falscher Benutzername oder Passwort!" });
  }
});

// Получить всех пользователей
app.get("/users", (req, res) => {
  res.json(users);
});

app.listen(3000, () => console.log("Server läuft auf Port 3000"));
