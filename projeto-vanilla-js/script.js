const STORAGE_KEY = "aula01_vanilla_topics";

const defaultTopics = [
  { id: 1, title: "Estrutura semântica com HTML5", category: "HTML", done: true },
  { id: 2, title: "Estilização e layout responsivo", category: "CSS", done: false },
  { id: 3, title: "Manipulação do DOM e eventos", category: "JavaScript", done: false },
  { id: 4, title: "Versionamento com Git e deploy na Vercel", category: "Git & Deploy", done: false }
];

let topics = loadTopics();
let currentFilter = "all";

const form = document.getElementById("study-form");
const titleInput = document.getElementById("topic-title");
const categoryInput = document.getElementById("topic-category");
const listElement = document.getElementById("topic-list");
const emptyState = document.getElementById("empty-state");
const statsText = document.getElementById("stats-text");
const filterButtons = document.querySelectorAll(".filter-btn");
const toggleThemeBtn = document.getElementById("toggle-theme");

function loadTopics() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : defaultTopics;
  } catch {
    return defaultTopics;
  }
}

function saveTopics() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(topics));
}

function getFilteredTopics() {
  if (currentFilter === "pending") {
    return topics.filter((topic) => !topic.done);
  }
  if (currentFilter === "done") {
    return topics.filter((topic) => topic.done);
  }
  return topics;
}

function updateStats() {
  const total = topics.length;
  const completed = topics.filter((topic) => topic.done).length;
  statsText.textContent = `${total} tópicos (${completed} concluídos)`;
}

function renderTopics() {
  listElement.innerHTML = "";
  const filtered = getFilteredTopics();

  emptyState.style.display = filtered.length === 0 ? "block" : "none";

  filtered.forEach((topic) => {
    const li = document.createElement("li");
    li.className = `topic-item${topic.done ? " done" : ""}`;

    const info = document.createElement("div");
    info.className = "topic-info";

    const title = document.createElement("span");
    title.className = "topic-title";
    title.textContent = topic.title;

    const category = document.createElement("span");
    category.className = "topic-category";
    category.textContent = topic.category;

    info.appendChild(title);
    info.appendChild(category);

    const actions = document.createElement("div");
    actions.className = "topic-actions";

    const doneBtn = document.createElement("button");
    doneBtn.type = "button";
    doneBtn.className = "btn-done";
    doneBtn.textContent = topic.done ? "Reabrir" : "Concluir";
    doneBtn.addEventListener("click", () => toggleTopic(topic.id));

    const deleteBtn = document.createElement("button");
    deleteBtn.type = "button";
    deleteBtn.className = "btn-delete";
    deleteBtn.textContent = "Excluir";
    deleteBtn.addEventListener("click", () => deleteTopic(topic.id));

    actions.appendChild(doneBtn);
    actions.appendChild(deleteBtn);

    li.appendChild(info);
    li.appendChild(actions);
    listElement.appendChild(li);
  });

  updateStats();
}

function addTopic(title, category) {
  const newTopic = {
    id: Date.now(),
    title,
    category,
    done: false
  };
  topics.unshift(newTopic);
  saveTopics();
  renderTopics();
}

function toggleTopic(id) {
  topics = topics.map((topic) =>
    topic.id === id ? { ...topic, done: !topic.done } : topic
  );
  saveTopics();
  renderTopics();
}

function deleteTopic(id) {
  topics = topics.filter((topic) => topic.id !== id);
  saveTopics();
  renderTopics();
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const title = titleInput.value.trim();
  const category = categoryInput.value;

  if (!title) return;

  addTopic(title, category);
  titleInput.value = "";
  titleInput.focus();
});

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    currentFilter = button.dataset.filter;
    filterButtons.forEach((btn) => btn.classList.remove("active"));
    button.classList.add("active");
    renderTopics();
  });
});

toggleThemeBtn.addEventListener("click", () => {
  document.body.classList.toggle("dark");
});

renderTopics();
