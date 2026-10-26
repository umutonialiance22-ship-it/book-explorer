const API_BASE_URL = "https://openlibrary.org";

export async function fetchBooks(searchTerm = "fantasy romance") {
  const query = searchTerm.trim();

  if (!query) {
    return [];
  }

  const params = new URLSearchParams({
    q: query,
    limit: "24",
    fields: "key,title,author_name,first_publish_year,subject"
  });

  const response = await fetch(
    `${API_BASE_URL}/search.json?${params.toString()}`
  );

  if (!response.ok) {
    throw new Error(`Book search failed: ${response.status}`);
  }

  const data = await response.json();

  return (data.docs || []).map((book) => ({
    id: book.key,
    title: book.title || "Untitled",
    author: book.author_name?.[0] || "Author unknown",
    year: book.first_publish_year || null,
    subjects: book.subject || []
  }));
}