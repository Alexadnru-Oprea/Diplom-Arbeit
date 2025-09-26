import express from "express";
import cors from "cors";
import fs from "fs";
import path from "path";

const app = express();
app.use(express.json());
app.use(cors());

const DATA_FILE = "./data.json";

// Загружаем данные
function loadData() {
  if (!fs.existsSync(DATA_FILE)) return { users: [], tasks: {} };
  return JSON.parse(fs.readFileSync(DATA_FILE, "utf8"));
}

// Сохраняем данные
function saveData(data) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

let { users, tasks } = loadData();

// Статические файлы
const __dirname = process.cwd();
app.use(express.static(path.join(__dirname, "frontEnd")));

// ================= Регистрация =================
app.post("/register", (req, res) => {
  const { username, password } = req.body;
  if (!username || !password)
    return res.json({ message: "Bitte Benutzernamen und Passwort eingeben!" });
  if (users.find(u => u.username === username))
    return res.json({ message: "Benutzer existiert bereits!" });

  users.push({ username, password });
  tasks[username] = [];
  saveData({ users, tasks });
  res.json({ message: "Benutzer registriert!" });
});

// ================= Логин =================
app.post("/login", (req, res) => {
  const { username, password } = req.body;
  const user = users.find(u => u.username === username && u.password === password);
  if (user) res.json({ message: "Login erfolgreich!" });
  else res.json({ message: "Falscher Benutzername oder Passwort!" });
});

// ================= Добавить задачу =================
app.post("/tasks", (req, res) => {
  const { username, task } = req.body;
  if (!tasks[username]) tasks[username] = [];
  tasks[username].push(task);
  saveData({ users, tasks });
  res.json({ message: "Task hinzugefügt!" });
});

// ================= Получить задачи =================
app.get("/tasks/:username", (req, res) => {
  const username = req.params.username;
  res.json(tasks[username] || []);
});

// ================= Обновить состояние задачи (erledigt) =================
app.patch("/tasks/:username/:index", (req, res) => {
  const { username, index } = req.params;
  const { erledigt } = req.body;

  if (!tasks[username]) return res.status(404).json({ message: "User not found" });
  if (!tasks[username][index]) return res.status(404).json({ message: "Task not found" });

  tasks[username][index].erledigt = erledigt;
  saveData({ users, tasks });
  res.json({ message: "Task updated!" });
});

// ================= Запуск сервера =================
app.listen(3000, () => console.log("Server läuft auf Port 3000"));