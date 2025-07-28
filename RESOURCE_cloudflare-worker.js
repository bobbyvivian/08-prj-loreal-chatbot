// Copy this code into your Cloudflare Worker script

export default {
  async fetch(request, env) {
    const corsHeaders = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
      "Content-Type": "application/json",
    };

    // Handle CORS preflight requests
    if (request.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders });
    }

    // Only handle POST requests
    if (request.method !== "POST") {
      return new Response("Method not allowed", {
        status: 405,
        headers: corsHeaders,
      });
    }

    const apiKey = env.OPENAI_API_KEY; // Make sure to name your secret OPENAI_API_KEY in the Cloudflare Workers dashboard
    const apiUrl = "https://api.openai.com/v1/chat/completions";

    // Check if request has content
    const contentType = request.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      return new Response("Content-Type must be application/json", {
        status: 400,
        headers: corsHeaders,
      });
    }

    let userInput;
    try {
      userInput = await request.json();
    } catch (error) {
      return new Response("Invalid JSON in request body", {
        status: 400,
        headers: corsHeaders,
      });
    }

    // Validate required fields
    if (!userInput.messages || !Array.isArray(userInput.messages)) {
      return new Response("Missing or invalid messages array", {
        status: 400,
        headers: corsHeaders,
      });
    }

    const requestBody = {
      model: "gpt-4o",
      messages: userInput.messages,
      max_completion_tokens: 300,
    };

    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const errorText = await response.text();
        return new Response(
          JSON.stringify({
            error: `OpenAI API error: ${response.status} ${response.statusText}`,
            details: errorText,
          }),
          {
            status: response.status,
            headers: corsHeaders,
          }
        );
      }

      const data = await response.json();
      return new Response(JSON.stringify(data), { headers: corsHeaders });
    } catch (error) {
      return new Response(
        JSON.stringify({
          error: "Failed to communicate with OpenAI API",
          details: error.message,
        }),
        {
          status: 500,
          headers: corsHeaders,
        }
      );
    }
  },
};
