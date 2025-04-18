import { NextResponse } from "next/server";
import OpenAI from "openai";
import { v4 as uuidv4 } from "uuid";

console.log(process.env.OPENAI_API_KEY);
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Helper function to search Hardcover API
async function searchHardcoverBook(title: string) {
  try {
    const query = `
      query SearchBook($query: String!) {
        search(
          query: $query,
          query_type: "Book",
          per_page: 1,
          page: 1
        ) {
          results
        }
      }
    `;

    // Make GraphQL request to Hardcover API
    const response = await fetch("https://api.hardcover.app/v1/graphql", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.HARDCOVER_TOKEN}`,
      },
      body: JSON.stringify({
        query,
        variables: {
          query: title,
        },
      }),
    });

    const data = await response.json();

    if (data.errors) {
      console.error(
        "Hardcover API Error:",
        JSON.stringify(data.errors, null, 2)
      );
      return null;
    }

    return data.data?.search?.results.hits[0].document;
  } catch (error) {
    console.error(
      `Error searching Hardcover for ${title}:`,
      JSON.stringify(error, null, 2)
    );
    return null;
  }
}

export async function POST(request: Request) {
  try {
    const { searchInput } = await request.json();

    console.log(searchInput);
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `You are a book recommendation assistant. Generate 6 book recommendations based on the user's input. 
          Return the data in JSON format matching this structure:
          {
            "title": string,
            "reason": string,
          }[]
	  Reason should be a short reason why the book is recommended`,
        },
        {
          role: "user",
          content: searchInput,
        },
      ],
      response_format: { type: "json_object" },
    });

    const content = completion.choices[0].message.content;
    if (!content) {
      throw new Error("No content received from OpenAI");
    }

    const parsedContent = JSON.parse(content);

    // Ensure we have an array of recommendations
    const recommendations = Array.isArray(parsedContent)
      ? parsedContent
      : parsedContent.recommendations
      ? parsedContent.recommendations
      : [parsedContent];

    if (!Array.isArray(recommendations)) {
      console.log("Failed to parse recommendations into an array");
      throw new Error("Failed to parse recommendations into an array");
    }

    // Enhance recommendations with Hardcover data
    let enhancedRecommendations = await Promise.all(
      recommendations.map(async (book: any) => {
        const hardcoverData = await searchHardcoverBook(book.title);

        return {
          id: uuidv4(),
          ...book,
          rating: hardcoverData?.rating
            ? Math.round(hardcoverData.rating * 10) / 10
            : "unknown",
          image_url:
            hardcoverData?.image?.url ||
            "/placeholder.svg?height=200&width=150",
          author:
            hardcoverData?.contributions?.[0]?.author?.name || "Unknown Author",
          summary: hardcoverData?.description || "Problem fetching summary",
        };
      })
    );

    return NextResponse.json(enhancedRecommendations);
  } catch (error) {
    console.error("Error generating book recommendations:", error);
    return NextResponse.json(
      { error: "Failed to generate book recommendations" },
      { status: 500 }
    );
  }
}
