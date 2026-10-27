const API_BASE_URL = "https://openlibrary.org";

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

export async function fetchBooks(searchTerm = "fantasy romance") {
  const query = searchTerm.trim() || "fantasy romance";

  const params = new URLSearchParams({
    q: query,
    limit: "40",
    fields: "key,title,author_name,first_publish_year,subject,cover_i"
  });

  const response = await fetch(`${API_BASE_URL}/search.json?${params.toString()}`);

  if (!response.ok) {
    throw new Error(`Unable to fetch books. Status: ${response.status}`);
  }

  const data = await response.json();

  return (data.docs || [])
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
}