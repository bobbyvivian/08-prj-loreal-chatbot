/* DOM elements */
const chatForm = document.getElementById("chatForm");
const userInput = document.getElementById("userInput");
const chatWindow = document.getElementById("chatWindow");
const sendBtn = document.getElementById("sendBtn");

// Chat state
let isLoading = false;
let conversationHistory = [];
let userProfile = {
  name: null,
  skinType: null,
  skinConcerns: [],
  hairType: null,
  preferredProducts: [],
  previousRecommendations: [],
  conversationCount: 0,
};

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

**CONVERSATION GUIDELINES:**
- Remember user details shared during conversation (name, preferences, skin/hair type)
- Reference previous recommendations and build upon them
- Ask follow-up questions to better understand their needs
- Provide personalized advice based on their profile
- Be warm, friendly, and maintain conversation continuity

Provide personalized recommendations based on:
- Skin type, tone, and concerns
- Hair type and styling needs
- Personal style and preferences
- Occasion and lifestyle
- Budget considerations
- Previous conversation history and user preferences

Always be friendly, knowledgeable, and focus on helping users find the perfect L'Oréal products for their beauty needs. Remember details they share to make the conversation feel personal and continuous.
`;

// Initialize chat
function initializeChat() {
  clearChatWindow();

  // Check if we have returning user data
  loadUserProfile();

  const welcomeMessage = userProfile.name
    ? `👋 Welcome back, ${userProfile.name}! I'm here to continue helping you with your L'Oréal beauty routine. How can I assist you today?`
    : "👋 Welcome to L'Oréal Beauty Advisor! I'm here to help you discover the perfect products for your beauty routine. Ask me about makeup, skincare, haircare, or fragrances!";

  addMessage("system", welcomeMessage);

  conversationHistory = [
    {
      role: "system",
      content: LOREAL_CONTEXT + getUserProfileContext(),
    },
  ];

  userProfile.conversationCount++;
  saveUserProfile();
}

// Generate user profile context for AI
function getUserProfileContext() {
  if (!userProfile.name && userProfile.conversationCount === 0) {
    return "";
  }

  let context = "\n\n**USER PROFILE:**\n";

  if (userProfile.name) {
    context += `- Name: ${userProfile.name}\n`;
  }

  if (userProfile.skinType) {
    context += `- Skin Type: ${userProfile.skinType}\n`;
  }

  if (userProfile.skinConcerns.length > 0) {
    context += `- Skin Concerns: ${userProfile.skinConcerns.join(", ")}\n`;
  }

  if (userProfile.hairType) {
    context += `- Hair Type: ${userProfile.hairType}\n`;
  }

  if (userProfile.preferredProducts.length > 0) {
    context += `- Preferred Products: ${userProfile.preferredProducts.join(
      ", "
    )}\n`;
  }

  if (userProfile.previousRecommendations.length > 0) {
    context += `- Previous Recommendations: ${userProfile.previousRecommendations
      .slice(-3)
      .join(", ")}\n`;
  }

  context += `- Conversation Count: ${userProfile.conversationCount}\n`;
  context +=
    "\nUse this information to provide personalized advice and reference past interactions naturally.";

  return context;
}

// Extract user information from messages
function extractUserInfo(userMessage, aiResponse) {
  const message = userMessage.toLowerCase();

  // Extract name
  const namePatterns = [
    /my name is (\w+)/i,
    /i'm (\w+)/i,
    /call me (\w+)/i,
    /i am (\w+)/i,
  ];

  for (const pattern of namePatterns) {
    const match = userMessage.match(pattern);
    if (match && match[1] && match[1].length > 1) {
      userProfile.name = match[1].charAt(0).toUpperCase() + match[1].slice(1);
      break;
    }
  }

  // Extract skin type
  const skinTypes = [
    "oily",
    "dry",
    "combination",
    "sensitive",
    "normal",
    "mature",
  ];
  for (const type of skinTypes) {
    if (message.includes(type + " skin")) {
      userProfile.skinType = type;
      break;
    }
  }

  // Extract skin concerns
  const skinConcerns = [
    "acne",
    "wrinkles",
    "dark spots",
    "fine lines",
    "pores",
    "dullness",
    "uneven tone",
  ];
  for (const concern of skinConcerns) {
    if (
      message.includes(concern) &&
      !userProfile.skinConcerns.includes(concern)
    ) {
      userProfile.skinConcerns.push(concern);
    }
  }

  // Extract hair type
  const hairTypes = [
    "curly",
    "straight",
    "wavy",
    "thick",
    "thin",
    "fine",
    "coarse",
    "damaged",
    "color-treated",
  ];
  for (const type of hairTypes) {
    if (message.includes(type + " hair")) {
      userProfile.hairType = type;
      break;
    }
  }

  // Extract product preferences from AI response
  const productMentions = aiResponse.match(
    /([A-Z][a-z]+ [A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)/g
  );
  if (productMentions) {
    for (const product of productMentions.slice(0, 3)) {
      // Limit to avoid clutter
      if (!userProfile.previousRecommendations.includes(product)) {
        userProfile.previousRecommendations.push(product);
      }
    }
  }

  saveUserProfile();
}

// Save user profile to localStorage
function saveUserProfile() {
  try {
    localStorage.setItem("lorealUserProfile", JSON.stringify(userProfile));
  } catch (error) {
    console.log("Could not save user profile:", error);
  }
}

// Load user profile from localStorage
function loadUserProfile() {
  try {
    const saved = localStorage.getItem("lorealUserProfile");
    if (saved) {
      const savedProfile = JSON.parse(saved);
      userProfile = { ...userProfile, ...savedProfile };
    }
  } catch (error) {
    console.log("Could not load user profile:", error);
  }
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
