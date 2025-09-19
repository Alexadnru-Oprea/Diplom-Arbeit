 // регистрация
    document.getElementById("registerBtn").addEventListener("click", async () => {
      const username = document.getElementById("reg-username").value;
      const password = document.getElementById("reg-password").value;

      const res = await fetch("http://localhost:3000/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password })
      });

      const data = await res.json();
      alert(data.message);
      console.log("Alle Benutzer nach Registrierung:", data.users);
    });

    // логин
    document.getElementById("loginBtn").addEventListener("click", async () => {
      const username = document.getElementById("login-username").value;
      const password = document.getElementById("login-password").value;

      const res = await fetch("http://localhost:3000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password })
      });

      const data = await res.json();
      alert(data.message);
      if (data.users) {
        console.log("Alle Benutzer nach Login:", data.users);
      }
    });

    // показать всех пользователей
    document.getElementById("showUsersBtn").addEventListener("click", async () => {
      const res = await fetch("http://localhost:3000/users");
      const users = await res.json();
      console.log("Alle Benutzer:", users);
    });
