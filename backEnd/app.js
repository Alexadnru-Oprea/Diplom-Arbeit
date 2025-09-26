import express from "express";
import cors from "cors";
import fs from "fs";
import path from "path";

const app = express();
app.use(express.json());
app.use(cors());

const DATA_FILE = "./data.json";

// загрузка данных
function loadData() {
  if (!fs.existsSync(DATA_FILE)) return { users: [], tasks: {} };
  return JSON.parse(fs.readFileSync(DATA_FILE, "utf8"));
}

// сохранение данных
function saveData(data) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

let { users, tasks } = loadData();

// статические файлы
const __dirname = process.cwd();
app.use(express.static(path.join(__dirname, "frontEnd")));

// ================== регистрация ==================
app.post("/register", (req, res) => {
  const { username, password } = req.body;
  if (!username || !password)
    return res.json({ message: "Bitte Benutzernamen und Passwort eingeben!" });
  if (users.find(u => u.username === username))
    return res.json({ message: "Benutzer existiert bereits!" });

  users.push({ username, password });
  tasks[username] = {}; // сразу создаём пустой объект групп
  saveData({ users, tasks });
  res.json({ message: "Benutzer registriert!" });
});

// ================== логин ==================
app.post("/login", (req, res) => {
  const { username, password } = req.body;
  const user = users.find(u => u.username === username && u.password === password);
  if (user) res.json({ message: "Login erfolgreich!" });
  else res.json({ message: "Falscher Benutzername oder Passwort!" });
});

// ================== добавить задачу ==================
app.post("/tasks", (req, res) => {
  const { username, group, task } = req.body;
  if (!tasks[username]) tasks[username] = {};
  if (!tasks[username][group]) tasks[username][group] = [];

  if (task) tasks[username][group].push(task); // добавляем только если task != null
  saveData({ users, tasks });
  res.json({ message: "Task hinzugefügt oder Gruppe erstellt!" });
});


// ================== получить задачи ==================
app.get("/tasks/:username/:group", (req, res) => {
  const { username, group } = req.params;
  res.json(tasks[username]?.[group] || []);
});

// ================== обновить erledigt ==================
app.patch("/tasks/:username/:group/:index", (req, res) => {
  const { username, group, index } = req.params;
  const { erledigt } = req.body;

  if (!tasks[username]?.[group])
    return res.status(404).json({ message: "Group not found" });
  if (!tasks[username][group][index])
    return res.status(404).json({ message: "Task not found" });

  tasks[username][group][index].erledigt = erledigt;
  saveData({ users, tasks });
  res.json({ message: "Task updated!" });
});

app.listen(3000, () => console.log("Server läuft auf Port 3000"));
