const API_BASE_URL = "https://openlibrary.org";
const CACHE_PREFIX = "enchantedReadsSearch:";
const CACHE_MINUTES = 30;
const TIMEOUT_MS = 15000;

function getCategories(subjects = []) {
  const text = subjects.join(" ").toLowerCase();
  const categories = [];

  if (text.includes("fantasy") || text.includes("fairy tales")) {
    categories.push("fantasy");
  }

  if (
    text.includes("romance") ||
    text.includes("love stories") ||
    text.includes("romantic fiction")
  ) {
    categories.push("romance");
  }

  if (text.includes("young adult") || text.includes("teen fiction")) {
    categories.push("young-adult");
  }

  if (categories.includes("fantasy") && categories.includes("romance")) {
    categories.push("romantasy");
  }

  return categories;
}

function isRelevantBook(book) {
  if (!book.cover_i) return false;

  const subjects = (book.subject || []).join(" ").toLowerCase();

  return (
    subjects.includes("fantasy") ||
    subjects.includes("romance") ||
    subjects.includes("love stories") ||
    subjects.includes("fairy tales") ||
    subjects.includes("romantic fiction")
  );
}

function readCache(key) {
  try {
    const raw = sessionStorage.getItem(CACHE_PREFIX + key);
    if (!raw) return null;

    const { time, books } = JSON.parse(raw);
    if (Date.now() - time > CACHE_MINUTES * 60000) return null;

    return Array.isArray(books) ? books : null;
  } catch {
    return null;
  }
}

function writeCache(key, books) {
  try {
    sessionStorage.setItem(
      CACHE_PREFIX + key,
      JSON.stringify({ time: Date.now(), books })
    );
  } catch {
    // Storage full or blocked: ignore, caching is optional.
  }
}

async function fetchWithTimeout(url, ms) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), ms);

  try {
    return await fetch(url, { signal: controller.signal });
  } finally {
    clearTimeout(timer);
  }
}

export async function fetchBooks(searchTerm = "fantasy romance") {
  const query = searchTerm.trim() || "fantasy romance";
  const cacheKey = query.toLowerCase();

  const cached = readCache(cacheKey);
  if (cached) return cached;

  const params = new URLSearchParams({
    q: query,
    limit: "30",
    fields: "key,title,author_name,first_publish_year,subject,cover_i"
  });

  const url = `${API_BASE_URL}/search.json?${params.toString()}`;

  let response;
  let lastError;

  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      response = await fetchWithTimeout(url, TIMEOUT_MS);
      if (response.ok) break;
      lastError = new Error(`Unable to fetch books. Status: ${response.status}`);
    } catch (error) {
      lastError = error;
    }
    response = null;
  }

  if (!response) {
    throw lastError || new Error("Unable to fetch books.");
  }

  const data = await response.json();

  const books = (data.docs || [])
    .filter(isRelevantBook)
    .map((book) => {
      const subjects = book.subject || [];
      const year = book.first_publish_year || null;

      return {
        id: book.key,
        title: book.title || "Untitled",
        author: book.author_name?.[0] || "Author unknown",
        year,
        subjects,
        categories: [
          ...getCategories(subjects),
          ...(year && year >= 2020 ? ["new-releases"] : [])
        ],
        coverUrl: `https://covers.openlibrary.org/b/id/${book.cover_i}-L.jpg`,
        description: subjects.length
          ? `Explore a story connected to ${subjects.slice(0, 3).join(", ")}.`
          : "Discover a new story in the library.",
        link: `https://openlibrary.org${book.key}`
      };
    });

  writeCache(cacheKey, books);
  return books;
}