import { getFavorites } from "./favorites.js";

const favoritesCount = document.querySelector("#favorites-count");
if (favoritesCount) favoritesCount.textContent = getFavorites().length;