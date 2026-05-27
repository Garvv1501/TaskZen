// ELEMENTS

const taskInput =
  document.getElementById("taskInput");

const addTaskBtn =
  document.getElementById("addTaskBtn");

const taskList =
  document.getElementById("taskList");

const taskCounter =
  document.getElementById("taskCounter");

const progressFill =
  document.getElementById("progressFill");

const quoteText =
  document.getElementById("quoteText");

const clock =
  document.getElementById("clock");

const dateText =
  document.getElementById("date");

const themeToggle =
  document.getElementById("themeToggle");

const totalTasksText =
  document.getElementById("totalTasks");

const completedTasksText =
  document.getElementById("completedTasks");

const pendingTasksText =
  document.getElementById("pendingTasks");

const filterButtons =
  document.querySelectorAll(".filter-btn");

// TASKS

let tasks =
  JSON.parse(localStorage.getItem("tasks")) || [];

let currentFilter = "all";

// QUOTES

const quotes = [

  "Discipline today, freedom tomorrow.",

  "Consistency beats motivation.",

  "Dream big. Start small.",

  "Progress, not perfection.",

  "Stay focused and never quit.",

  "Small steps every day lead to big changes."

];

// RANDOM QUOTE

function generateQuote() {

  const randomIndex =
    Math.floor(Math.random() * quotes.length);

  quoteText.textContent =
    quotes[randomIndex];
}

generateQuote();

// CLOCK

function updateClock() {

  const now = new Date();

  clock.textContent =
    now.toLocaleTimeString();

  dateText.textContent =
    now.toLocaleDateString(
      "en-US",
      {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric"
      }
    );
}

setInterval(updateClock, 1000);

updateClock();

// THEME

themeToggle.addEventListener("click", () => {

  document.body.classList.toggle("light-mode");

  if (
    document.body.classList.contains("light-mode")
  ) {

    themeToggle.textContent = "☀️";
  }

  else {

    themeToggle.textContent = "🌙";
  }
});

// LOAD TASKS

window.addEventListener(
  "DOMContentLoaded",
  renderTasks
);

// ADD TASK

addTaskBtn.addEventListener(
  "click",
  addTask
);

taskInput.addEventListener(
  "keypress",
  function (e) {

    if (e.key === "Enter") {

      addTask();
    }
  }
);

function addTask() {

  const taskText =
    taskInput.value.trim();

  if (taskText === "") return;

  const newTask = {

    id: Date.now(),

    text: taskText,

    completed: false
  };

  tasks.push(newTask);

  saveTasks();

  renderTasks();

  taskInput.value = "";
}

// RENDER TASKS

function renderTasks() {

  taskList.innerHTML = "";

  let filteredTasks = tasks;

  if (currentFilter === "completed") {

    filteredTasks =
      tasks.filter(task => task.completed);
  }

  else if (currentFilter === "pending") {

    filteredTasks =
      tasks.filter(task => !task.completed);
  }

  if (filteredTasks.length === 0) {

    taskList.innerHTML = `

      <p class="empty-message">
        No tasks found ✨
      </p>

    `;

    updateProgress();

    return;
  }

  filteredTasks.forEach(task => {

    const li =
      document.createElement("li");

    li.classList.add("task-item");

    if (task.completed) {

      li.classList.add("completed");
    }

    li.innerHTML = `

      <div class="task-content">

        <span>${task.text}</span>

      </div>

      <div class="task-actions">

        <button
          class="complete-btn"
          onclick="toggleTask(${task.id})"
        >
          ✓
        </button>

        <button
          class="delete-btn"
          onclick="deleteTask(${task.id})"
        >
          🗑
        </button>

      </div>

    `;

    taskList.appendChild(li);

  });

  updateProgress();
}

// TOGGLE TASK

function toggleTask(id) {

  tasks = tasks.map(task => {

    if (task.id === id) {

      return {

        ...task,

        completed: !task.completed
      };
    }

    return task;
  });

  saveTasks();

  renderTasks();
}

// DELETE TASK

function deleteTask(id) {

  tasks =
    tasks.filter(task => task.id !== id);

  saveTasks();

  renderTasks();
}

// PROGRESS

function updateProgress() {

  const totalTasks =
    tasks.length;

  const completedTasks =
    tasks.filter(task => task.completed).length;

  const pendingTasks =
    totalTasks - completedTasks;

  taskCounter.textContent =
    `${completedTasks} / ${totalTasks} Completed`;

  totalTasksText.textContent =
    totalTasks;

  completedTasksText.textContent =
    completedTasks;

  pendingTasksText.textContent =
    pendingTasks;

  const progressPercent =
    totalTasks === 0
      ? 0
      : (completedTasks / totalTasks) * 100;

  progressFill.style.width =
    `${progressPercent}%`;

  updateChart(
    completedTasks,
    pendingTasks
  );
}

// SAVE

function saveTasks() {

  localStorage.setItem(
    "tasks",
    JSON.stringify(tasks)
  );
}

// FILTERS

filterButtons.forEach(button => {

  button.addEventListener("click", () => {

    filterButtons.forEach(btn => {

      btn.classList.remove("active");
    });

    button.classList.add("active");

    currentFilter =
      button.dataset.filter;

    renderTasks();
  });

});

// PARTICLES

tsParticles.load("particles-js", {

  background: {
    color: {
      value: "transparent"
    }
  },

  particles: {

    number: {
      value: 50
    },

    color: {
      value: "#8b5cf6"
    },

    links: {

      enable: true,

      color: "#3b82f6",

      distance: 150,

      opacity: 0.2
    },

    move: {

      enable: true,

      speed: 1
    },

    opacity: {
      value: 0.5
    },

    size: {
      value: 3
    }
  }
});

// CHART

const ctx =
  document.getElementById("taskChart");

let taskChart =
  new Chart(ctx, {

    type: "doughnut",

    data: {

      labels: [
        "Completed",
        "Pending"
      ],

      datasets: [{

        data: [0, 0],

        backgroundColor: [
          "#3b82f6",
          "#8b5cf6"
        ],

        borderWidth: 0
      }]
    },

    options: {

      plugins: {

        legend: {

          labels: {

            color: "white"
          }
        }
      }
    }
  });

// UPDATE CHART

function updateChart(
  completed,
  pending
) {

  taskChart.data.datasets[0].data = [
    completed,
    pending
  ];

  taskChart.update();
}
