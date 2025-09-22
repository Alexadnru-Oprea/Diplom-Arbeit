const username = localStorage.getItem("username");
    if (!username) window.location.href = "index.html";

    async function loadTasks() {
      const res = await fetch(`http://localhost:3000/tasks/${username}`);
      const tasks = await res.json();
      const table = document.getElementById("myTable").getElementsByTagName('tbody')[0];
      table.innerHTML = "";
      tasks.forEach(t => {
        const row = table.insertRow();
        row.insertCell(0).innerText = t.wer;
        row.insertCell(1).innerText = t.was;
        row.insertCell(2).innerText = t.biswann;
        row.insertCell(3).innerText = t.hilfsmittel;
      });
    }

    async function addRow() {
      const wer = document.getElementById("Wer").value;
      const was = document.getElementById("Was").value;
      const biswann = document.getElementById("Biswann").value;
      const hilfsmittel = document.getElementById("Hilfsmittel").value;
      if (!wer || !was || !biswann) { alert("Bitte alle Felder ausfüllen!"); return; }

      const task = { wer, was, biswann, hilfsmittel };
      await fetch("http://localhost:3000/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, task })
      });
      loadTasks(); // обновляем таблицу
      document.getElementById("Wer").value = "";
      document.getElementById("Was").value = "";
      document.getElementById("Biswann").value = "";
      document.getElementById("Hilfsmittel").value = "";
    }

    function logout() {
      localStorage.removeItem("username");
      window.location.href = "index.html";
    }

    loadTasks();