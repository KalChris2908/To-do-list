const Storage = {
  save(tasks) {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  },

  load() {
    return JSON.parse(localStorage.getItem("tasks")) || [];
  },

  saveTheme(mode) {
    localStorage.setItem("theme", mode);
  },

  loadTheme() {
    return localStorage.getItem("theme") || "light";
  }
};
