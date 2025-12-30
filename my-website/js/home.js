const API_KEY = '0929d17296f3c3e69d36b336e02da9c7';
    const BASE_URL = 'https://api.themoviedb.org/3';
    const IMAGE_BASE = "https://image.tmdb.org/t/p/w300";

/* =========================
   MODAL CONTROLS
========================= */
function openModal(movie, type) {
  const modal = document.getElementById("modal");
  const iframe = document.getElementById("modal-video");
  const server = document.getElementById("server").value;

  modal.style.display = "block";

  document.getElementById("modal-title").textContent =
    movie.title || movie.name;

  document.getElementById("modal-image").src =
    IMAGE_BASE + movie.poster_path;

  document.getElementById("modal-description").textContent =
    movie.overview || "No description available.";

  // Save ID & type for server switching
  iframe.dataset.id = movie.id;
  iframe.dataset.type = type;

  // Load video
  iframe.src = getVideoURL(server, movie.id, type);

  // Save Continue Watching
  saveContinueWatching({
    id: movie.id,
    title: movie.title || movie.name,
    poster: movie.poster_path,
    type: type
  });
}

function closeModal() {
  const modal = document.getElementById("modal");
  const iframe = document.getElementById("modal-video");

  modal.style.display = "none";
  iframe.src = "";
}

/* =========================
   VIDEO SERVERS
========================= */
function getVideoURL(server, id, type) {
  if (server === "vidsrc.cc") {
    return type === "movie"
      ? `https://vidsrc.cc/v2/embed/movie/${id}`
      : `https://vidsrc.cc/v2/embed/tv/${id}`;
  }

  if (server === "vidsrc.me") {
    return type === "movie"
      ? `https://vidsrc.me/embed/movie/${id}`
      : `https://vidsrc.me/embed/tv/${id}`;
  }

  if (server === "player.videasy.net") {
    return type === "movie"
      ? `https://player.videasy.net/movie/${id}`
      : `https://player.videasy.net/tv/${id}`;
  }

  return "";
}

function changeServer() {
  const iframe = document.getElementById("modal-video");
  const server = document.getElementById("server").value;

  if (!iframe.dataset.id) return;

  iframe.src = getVideoURL(
    server,
    iframe.dataset.id,
    iframe.dataset.type
  );
}

/* =========================
   SEARCH MODAL
========================= */
function openSearchModal() {
  document.getElementById("search-modal").style.display = "block";
  document.getElementById("search-input").focus();
}

function closeSearchModal() {
  document.getElementById("search-modal").style.display = "none";
}

/* =========================
   CONTINUE WATCHING
========================= */
function saveContinueWatching(item) {
  let list = JSON.parse(localStorage.getItem("continueWatching")) || [];

  list = list.filter(i => i.id !== item.id);
  list.unshift(item);
  list = list.slice(0, 10);

  localStorage.setItem("continueWatching", JSON.stringify(list));
}

function loadContinueWatching() {
  const list = JSON.parse(localStorage.getItem("continueWatching")) || [];
  const row = document.getElementById("continue-row");
  const container = document.getElementById("continue-list");

  if (!list.length) return;

  row.style.display = "block";
  container.innerHTML = "";

  list.forEach(item => {
    const img = document.createElement("img");
    img.src = IMAGE_BASE + item.poster;
    img.loading = "lazy";
    img.onclick = () => openModal(item, item.type);
    container.appendChild(img);
  });
}

/* =========================
   KEYBOARD SHORTCUT
========================= */
document.addEventListener("keydown", e => {
  if (e.key === "/") {
    e.preventDefault();
    openSearchModal();
  }
});

/* =========================
   INIT
========================= */
loadContinueWatching();
