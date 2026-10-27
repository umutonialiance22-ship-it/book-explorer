import { getFavorites, removeFavorite } from "./favorites.js";
import { renderBooks } from "./ui.js";

const favoritesGrid = document.querySelector("#favorites-grid");
const emptyFavorites = document.querySelector("#empty-favorites");
const favoritesStatus = document.querySelector("#favorites-status");
const favoritesCount = document.querySelector("#favorites-count");

function renderFavorites() {
  const favorites = getFavorites();

  renderBooks(favoritesGrid, favorites, "favorites");

  const hasFavorites = favorites.length > 0;
  emptyFavorites.classList.toggle("hidden", hasFavorites);

  favoritesStatus.textContent = hasFavorites
    ? `${favorites.length} saved ${favorites.length === 1 ? "book" : "books"}`
    : "Your favorites collection is empty.";

  if (favoritesCount) favoritesCount.textContent = favorites.length;
}

favoritesGrid.addEventListener("click", (event) => {
  const button = event.target.closest("[data-favorite-id]");
  if (!button) return;

  removeFavorite(button.dataset.favoriteId);
  renderFavorites();
});

renderFavorites();