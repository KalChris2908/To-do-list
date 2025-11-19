const addBtn = document.getElementById("addBtn");
const taskInput = document.getElementById("taskInput");
const taskList = document.getElementById("taskList");

// Load saved tasks
window.onload = () => {
  const saved = JSON.parse(localStorage.getItem("tasks")) || [];
  saved.forEach(t => addTaskToDOM(t.text, t.completed));
};

// Add task on button click
addBtn.addEventListener("click", () => {
  const text = taskInput.value.trim();
  if (text === "") return;

  addTaskToDOM(text, false);
  saveTasks();
  taskInput.value = "";
});

// Add task to page
function addTaskToDOM(text, completed) {
  const li = document.createElement("li");
  li.className = "task";
  if (completed) li.classList.add("completed");

  li.innerHTML = `
    <span>${text}</span>
    <button class="delete-btn">&times;</button>
  `;

  // Toggle complete
  li.addEventListener("click", (e) => {
    if (e.target.classList.contains("delete-btn")) return;
    li.classList.toggle("completed");
    saveTasks();
  });

  // Delete task
  li.querySelector(".delete-btn").addEventListener("click", () => {
    li.remove();
    saveTasks();
  });

  taskList.appendChild(li);
}

// Save tasks to local storage
function saveTasks() {
  const tasks = [];
  document.querySelectorAll(".task").forEach(t => {
    tasks.push({
      text: t.querySelector("span").innerText,
      completed: t.classList.contains("completed")
    });
  });
  localStorage.setItem("tasks", JSON.stringify(tasks));
}
