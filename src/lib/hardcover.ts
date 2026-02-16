import { HardcoverUserBook } from "@/types/hardcover";

const HARDCOVER_ENDPOINT = "https://api.hardcover.app/v1/graphql";

const CURRENTLY_READING_QUERY = `
  query CurrentlyReading($username: citext!) {
    users(where: { username: { _eq: $username } }) {
      user_books(where: { status_id: { _eq: 2 } }) {
        book {
          title
          slug
          image {
            url
          }
          contributions {
            author {
              name
            }
          }
        }
      }
    }
  }
`;

export async function getCurrentlyReading(): Promise<HardcoverUserBook[] | null> {
  const token = process.env.HARDCOVER_API_TOKEN;
  const username = process.env.HARDCOVER_USERNAME;

  if (!token || !username) {
    console.error("Hardcover: Missing API token or username");
    return null;
  }

  try {
    const res = await fetch(HARDCOVER_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        query: CURRENTLY_READING_QUERY,
        variables: { username },
      }),
      next: { revalidate: 3600 },
    });

    if (!res.ok) {
      console.error("Hardcover API error:", res.status);
      return null;
    }

    const data = await res.json();

    if (data.errors) {
      console.error("Hardcover GraphQL error:", data.errors[0]?.message);
      return null;
    }

    return data.data?.users?.[0]?.user_books ?? null;
  } catch (error) {
    console.error("Hardcover fetch error:", error);
    return null;
  }
}
