const UI = {
  updateCounts(tasks) {
    const total = tasks.length;
    const completed = tasks.filter(t => t.completed).length;

    document.getElementById("totalCount").textContent = total;
    document.getElementById("completedCount").textContent = completed;

    const percent = total === 0 ? 0 : (completed / total) * 100;
    document.getElementById("progressFill").style.width = percent + "%";
  },

  toast(msg) {
    const toast = document.getElementById("toast");
    toast.textContent = msg;
    toast.style.opacity = 1;

    setTimeout(() => {
      toast.style.opacity = 0;
    }, 2000);
  },

  applyFilter(filter) {
    document.querySelectorAll(".filter-btn").forEach(btn =>
      btn.classList.remove("active")
    );

    document.querySelector(`[data-filter="${filter}"]`).classList.add("active");

    const tasks = document.querySelectorAll(".task");

    tasks.forEach(t => {
      const completed = t.classList.contains("completed");

      if (filter === "all") t.style.display = "flex";
      if (filter === "completed") t.style.display = completed ? "flex" : "none";
      if (filter === "pending") t.style.display = completed ? "none" : "flex";
    });
  }
};
