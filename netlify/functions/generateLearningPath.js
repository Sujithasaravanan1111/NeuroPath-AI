const API_KEY = process.env.OPENROUTER_API_KEY || "sk-or-v1-ca01cacbfe68c5fd0a2bf2272675b3727" +
  "8f6d77097c489bd46f0fcc4dd27fb46";
const URL = "https://openrouter.ai/api/v1/chat/completions";

exports.handler = async (event) => {
  // Only allow POST requests
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: "Method not allowed" }),
    };
  }

  try {
    const { topic } = JSON.parse(event.body);

    if (!topic) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Topic is required" }),
      };
    }

    const response = await fetch(URL, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "mistralai/mistral-7b-instruct:free",
        messages: [
          {
            role: "user",
            content: `Create a step-by-step roadmap to learn ${topic}`,
          },
        ],
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        statusCode: response.status,
        body: JSON.stringify({ error: data.error || "API request failed" }),
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({
        result: data.choices[0].message.content,
      }),
    };
  } catch (error) {
    console.error(error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Internal server error" }),
    };
  }
};
