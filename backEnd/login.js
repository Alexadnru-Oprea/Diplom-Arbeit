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
});

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
  if (data.message === "Login erfolgreich!") {
    localStorage.setItem("username", username);
    window.location.href = "gruppen.html";
  }
});

