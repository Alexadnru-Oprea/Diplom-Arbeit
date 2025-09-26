const username = localStorage.getItem("username");
const group = localStorage.getItem("group");
if (!username || !group) window.location.href = "index.html";

// проверка: существует ли группа, если нет – создаём пустую
async function ensureGroupExists() {
  const res = await fetch(`http://localhost:3000/tasks/${username}/${group}`);
  if (res.status === 404) {
    await fetch("http://localhost:3000/tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, group, task: null }) // создаём пустую группу
    });
  }
}

// загрузка задач
async function loadTasks() {
  await ensureGroupExists(); // сначала создаём группу если нужно

  const res = await fetch(`http://localhost:3000/tasks/${username}/${group}`);
  const tasks = await res.json();
  const table = document.getElementById("myTable").getElementsByTagName('tbody')[0];
  table.innerHTML = "";

  tasks.forEach((t, index) => {
    const row = table.insertRow();
    row.insertCell(0).innerText = t.wer;
    row.insertCell(1).innerText = t.was;
    row.insertCell(2).innerText = t.biswann;
    row.insertCell(3).innerText = t.hilfsmittel;

    const erledigtCell = row.insertCell(4);
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = t.erledigt === true;

    row.style.textDecoration = checkbox.checked ? "line-through" : "none";
    row.style.backgroundColor = checkbox.checked ? "green" : "white";

    checkbox.addEventListener("change", async function () {
      row.style.textDecoration = this.checked ? "line-through" : "none";
      row.style.backgroundColor = this.checked ? "green" : "white";
      await fetch(`http://localhost:3000/tasks/${username}/${group}/${index}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ erledigt: this.checked })
      });
    });

    erledigtCell.appendChild(checkbox);
  });
}

// добавить задачу
async function addRow() {
  const wer = document.getElementById("Wer").value;
  const was = document.getElementById("Was").value;
  const biswann = document.getElementById("Biswann").value;
  const hilfsmittel = document.getElementById("Hilfsmittel").value;
  if (!wer || !was || !biswann) { alert("Bitte alle Felder ausfüllen!"); return; }

  const task = { wer, was, biswann, hilfsmittel, erledigt: false };
  await fetch("http://localhost:3000/tasks", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, group, task })
  });
  loadTasks();
  document.getElementById("Wer").value = "";
  document.getElementById("Was").value = "";
  document.getElementById("BisWann").value = "";
  document.getElementById("Hilfsmittel").value = "";
}

function logout() {
  localStorage.removeItem("username");
  localStorage.removeItem("group");
  window.location.href = "index.html";
}

// вернуться на выбор группы, не удаляя текущую
function back() {
  window.location.href = "gruppen.html";
}

loadTasks();
