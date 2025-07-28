/* DOM elements */
const chatForm = document.getElementById("chatForm");
const userInput = document.getElementById("userInput");
const chatWindow = document.getElementById("chatWindow");
const sendBtn = document.getElementById("sendBtn");

// Chat state
let isLoading = false;
let conversationHistory = [];

// L'Oréal product knowledge and context
const LOREAL_CONTEXT = `
You are a L'Oréal Beauty Advisor AI assistant. Your expertise covers:

**MAKEUP:**
- Foundations, concealers, powders (True Match, Infallible Pro-Glow)
- Lipsticks and lip products (Rouge Signature, Colour Riche)
- Eye makeup (Voluminous mascaras, eyeshadows, liners)
- Complexion products for all skin tones and types

**SKINCARE:**
- Anti-aging serums and creams (Revitalift, Age Perfect)
- Hydrating products (Hydra Genius, Hydrafresh)
- Cleansers and toners for different skin types
- Sun protection and daily care routines

**HAIRCARE:**
- Shampoos and conditioners (Elvive range)
- Hair treatments and masks
- Styling products and heat protectants
- Color care and damage repair

**FRAGRANCES:**
- Women's fragrances (La Vie Est Belle, Mon Paris)
- Men's fragrances and grooming
- Seasonal and occasion-based recommendations

Provide personalized recommendations based on:
- Skin type, tone, and concerns
- Hair type and styling needs
- Personal style and preferences
- Occasion and lifestyle
- Budget considerations

Always be friendly, knowledgeable, and focus on helping users find the perfect L'Oréal products for their beauty needs.
`;

// Initialize chat
function initializeChat() {
  clearChatWindow();
  addMessage(
    "system",
    "👋 Welcome to L'Oréal Beauty Advisor! I'm here to help you discover the perfect products for your beauty routine. Ask me about makeup, skincare, haircare, or fragrances!"
  );

  conversationHistory = [
    {
      role: "system",
      content: LOREAL_CONTEXT,
    },
  ];
}

// Clear chat window
function clearChatWindow() {
  chatWindow.innerHTML = "";
}

// Add message to chat
function addMessage(type, content) {
  const messageDiv = document.createElement("div");
  messageDiv.className = `msg ${type}`;
  messageDiv.textContent = content;
  chatWindow.appendChild(messageDiv);
  chatWindow.scrollTop = chatWindow.scrollHeight;
}

// Show typing indicator
function showTypingIndicator() {
  const typingDiv = document.createElement("div");
  typingDiv.className = "msg ai typing";
  typingDiv.innerHTML = "💭 Thinking...";
  typingDiv.id = "typing-indicator";
  chatWindow.appendChild(typingDiv);
  chatWindow.scrollTop = chatWindow.scrollHeight;
}

// Remove typing indicator
function removeTypingIndicator() {
  const typingIndicator = document.getElementById("typing-indicator");
  if (typingIndicator) {
    typingIndicator.remove();
  }
}

// Set loading state
function setLoadingState(loading) {
  isLoading = loading;
  sendBtn.disabled = loading;
  userInput.disabled = loading;

  if (loading) {
    showTypingIndicator();
  } else {
    removeTypingIndicator();
  }
}

// Handle API communication
async function sendToAPI(userMessage) {
  // Add user message to conversation history
  conversationHistory.push({
    role: "user",
    content: userMessage,
  });

  try {
    // Replace with your actual Cloudflare Worker URL
    const CLOUDFLARE_WORKER_URL = "https://lorealpage.vt2162.workers.dev/";

    // For development, you can also test with local secrets
    // Remove this fallback when using Cloudflare Workers
    if (
      !CLOUDFLARE_WORKER_URL ||
      CLOUDFLARE_WORKER_URL === "YOUR_WORKER_URL_HERE"
    ) {
      throw new Error("API_NOT_CONFIGURED");
    }

    const response = await fetch(CLOUDFLARE_WORKER_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messages: conversationHistory,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    if (data.choices && data.choices[0] && data.choices[0].message) {
      const aiResponse = data.choices[0].message.content;

      // Add AI response to conversation history
      conversationHistory.push({
        role: "assistant",
        content: aiResponse,
      });

      return aiResponse;
    } else {
      throw new Error("Invalid response format");
    }
  } catch (error) {
    console.error("API Error:", error);

    if (error.message === "API_NOT_CONFIGURED") {
      return `I'd love to help you with L'Oréal products! 

To connect me to the OpenAI API, please:
1. Deploy the provided Cloudflare Worker code
2. Set your OpenAI API key in Cloudflare
3. Update the CLOUDFLARE_WORKER_URL in this script

In the meantime, I can share that L'Oréal offers amazing products for:
✨ Makeup: Foundations, lipsticks, mascaras
🌸 Skincare: Anti-aging, hydrating, cleansing
💇‍♀️ Haircare: Shampoos, treatments, styling
🌺 Fragrances: Signature scents for every occasion

What type of products are you interested in?`;
    }

    return "I'm sorry, I'm having trouble connecting right now. Please try again in a moment, or check your internet connection.";
  }
}

// Handle form submission
async function handleSubmit(e) {
  e.preventDefault();

  if (isLoading) return;

  const message = userInput.value.trim();
  if (!message) return;

  // Add user message to chat
  addMessage("user", message);

  // Clear input and set loading state
  userInput.value = "";
  setLoadingState(true);

  try {
    // Get AI response
    const aiResponse = await sendToAPI(message);

    // Add AI response to chat
    addMessage("ai", aiResponse);
  } catch (error) {
    console.error("Error:", error);
    addMessage(
      "ai",
      "I apologize, but I'm experiencing technical difficulties. Please try again later."
    );
  } finally {
    setLoadingState(false);
    userInput.focus();
  }
}

// Event listeners
chatForm.addEventListener("submit", handleSubmit);

// Handle Enter key in input
userInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault();
    handleSubmit(e);
  }
});

// Initialize chat when page loads
document.addEventListener("DOMContentLoaded", () => {
  initializeChat();
  userInput.focus();
});
