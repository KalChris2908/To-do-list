let tasks = Storage.load();

const taskInput = document.getElementById("taskInput");
const addBtn = document.getElementById("addBtn");
const taskList = document.getElementById("taskList");
const categorySelect = document.getElementById("categorySelect");

// Load theme
if (Storage.loadTheme() === "dark") {
  document.body.classList.add("dark");
}

// Load tasks
tasks.forEach(t => addTaskToDOM(t));

UI.updateCounts(tasks);

addBtn.addEventListener("click", () => {
  const text = taskInput.value.trim();
  const category = categorySelect.value;

  if (text === "") return;

  const task = {
    id: Date.now(),
    text,
    category,
    completed: false
  };

  tasks.push(task);
  addTaskToDOM(task);
  Storage.save(tasks);
  UI.updateCounts(tasks);

  UI.toast("Task added!");

  taskInput.value = "";
});

// Add to DOM
function addTaskToDOM(task) {
  const li = document.createElement("li");
  li.className = "task";
  li.draggable = true;
  li.dataset.id = task.id;

  if (task.completed) li.classList.add("completed");

  li.innerHTML = `
    <div class="left">
      <input type="checkbox" ${task.completed ? "checked" : ""}>
      <span class="text">${task.text}</span>
      <span class="category ${task.category}">${task.category}</span>
    </div>

    <button class="delete-btn">&times;</button>
  `;

  // Complete toggle
  li.querySelector("input").addEventListener("change", e => {
    task.completed = e.target.checked;
    li.classList.toggle("completed");
    Storage.save(tasks);
    UI.updateCounts(tasks);
  });

  // Edit text
  li.querySelector(".text").addEventListener("click", () => {
    const input = document.createElement("input");
    input.value = task.text;
    input.className = "edit-input";

    li.querySelector(".text").replaceWith(input);
    input.focus();

    input.addEventListener("blur", saveEdit);
    input.addEventListener("keypress", e => {
      if (e.key === "Enter") saveEdit();
    });

    function saveEdit() {
      task.text = input.value;
      Storage.save(tasks);
      UI.updateCounts(tasks);

      const span = document.createElement("span");
      span.className = "text";
      span.textContent = task.text;
      input.replaceWith(span);
    }
  });

  // Delete
  li.querySelector(".delete-btn").addEventListener("click", () => {
    li.remove();
    tasks = tasks.filter(t => t.id !== task.id);
    Storage.save(tasks);
    UI.updateCounts(tasks);

    UI.toast("Task deleted!");
  });

  // Drag events
  li.addEventListener("dragstart", () => li.classList.add("dragging"));
  li.addEventListener("dragend", () => {
    li.classList.remove("dragging");
    reorderTasks();
  });

  taskList.appendChild(li);
}

// Reorder tasks after drag
function reorderTasks() {
  const newOrder = [...document.querySelectorAll(".task")].map(li => {
    return tasks.find(t => t.id == li.dataset.id);
  });
  tasks = newOrder;
  Storage.save(tasks);
}

// Theme toggle
document.getElementById("toggleTheme").addEventListener("click", () => {
  document.body.classList.toggle("dark");
  Storage.saveTheme(document.body.classList.contains("dark") ? "dark" : "light");
});

// Filters
document.querySelectorAll(".filter-btn").forEach(btn => {
  btn.addEventListener("click", () => UI.applyFilter(btn.dataset.filter));
});
