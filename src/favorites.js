const STORAGE_KEY = "enchantedReadsFavorites";

export function getFavorites() {
  try {
    const storedFavorites = localStorage.getItem(STORAGE_KEY);

    if (!storedFavorites) {
      return [];
    }

    const parsedFavorites = JSON.parse(storedFavorites);

    return Array.isArray(parsedFavorites) ? parsedFavorites : [];
  } catch (error) {
    console.error("Unable to read saved favorites:", error);
    return [];
  }
}

function saveFavorites(favorites) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
    return true;
  } catch (error) {
    console.error("Unable to save favorites:", error);
    return false;
  }
}

export function isFavorite(bookId) {
  return getFavorites().some(
    (book) => String(book.id) === String(bookId)
  );
}

export function addFavorite(book) {
  const favorites = getFavorites();

  const alreadyExists = favorites.some(
    (favorite) => String(favorite.id) === String(book.id)
  );

  if (alreadyExists) {
    return true;
  }

  return saveFavorites([...favorites, book]);
}

export function removeFavorite(bookId) {
  const favorites = getFavorites();

  const updatedFavorites = favorites.filter(
    (book) => String(book.id) !== String(bookId)
  );

  return saveFavorites(updatedFavorites);
}