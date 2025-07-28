# L'Oréal Beauty Advisor Chatbot

A sophisticated AI-powered chatbot designed to help users discover and understand L'Oréal's complete range of beauty products. This interactive beauty advisor provides personalized recommendations for makeup, skincare, haircare, and fragrances.

![L'Oréal Beauty Advisor](img/loreal-logo.png)

## Features

### 🎨 **Comprehensive Product Knowledge**

- **Makeup**: Foundations, lipsticks, mascaras, eyeshadows, and complexion products
- **Skincare**: Anti-aging solutions, hydrating products, cleansers, and daily care routines
- **Haircare**: Shampoos, conditioners, treatments, and styling products
- **Fragrances**: Signature scents for women and men, occasion-based recommendations

### 💬 **Interactive Chat Interface**

- Modern, responsive design with L'Oréal branding
- Real-time messaging with typing indicators
- Mobile-friendly interface
- Elegant gradient styling matching L'Oréal's luxury aesthetic

### 🤖 **AI-Powered Recommendations**

- Personalized product suggestions based on user preferences
- Skin type and tone analysis
- Hair type and styling needs assessment
- Occasion and lifestyle-based recommendations
- Budget-conscious suggestions

## Quick Start

### 1. **Local Development**

```bash
# Clone or download the project
cd 08-prj-loreal-chatbot

# Open index.html in your browser
# The chatbot will work in demo mode with sample responses
```

### 2. **Production Setup with Cloudflare Workers**

#### Step 1: Deploy Cloudflare Worker

1. Copy the code from `RESOURCE_cloudflare-worker.js`
2. Create a new Cloudflare Worker
3. Paste the code into your worker
4. Add your OpenAI API key as an environment variable named `OPENAI_API_KEY`

#### Step 2: Update Frontend

1. In `script.js`, replace `YOUR_CLOUDFLARE_WORKER_URL_HERE` with your actual Cloudflare Worker URL
2. Remove the `secrets.js` script tag from `index.html`
3. Deploy your frontend to your preferred hosting service

## File Structure

```
08-prj-loreal-chatbot/
├── index.html                     # Main HTML structure
├── style.css                      # L'Oréal branded styles
├── script.js                      # Chat functionality and API integration
├── secrets.js                     # Development placeholder (remove in production)
├── RESOURCE_cloudflare-worker.js   # Backend API handler
├── README.md                       # Documentation
└── img/
    └── loreal-logo.png            # L'Oréal branding logo
```

## Technical Details

### Frontend Technologies

- **HTML5**: Semantic structure with accessibility features
- **CSS3**: Modern styling with gradients, animations, and responsive design
- **JavaScript**: ES6+ features for chat functionality and API communication
- **Google Fonts**: Montserrat typography for professional appearance
- **Material Icons**: Modern iconography for UI elements

### Backend Integration

- **Cloudflare Workers**: Serverless edge computing for API requests
- **OpenAI API**: GPT-4 integration for intelligent beauty advice
- **CORS Support**: Cross-origin resource sharing for web deployment

### Key Features Implementation

#### Chat System

- Real-time message display with user/AI differentiation
- Typing indicators for better user experience
- Conversation history management
- Error handling and fallback messages

#### L'Oréal Branding

- Custom color scheme with luxury gold accents
- Professional typography and spacing
- Responsive design for all devices
- Brand-consistent messaging and tone

#### AI Integration

- Context-aware conversations about L'Oréal products
- Product-specific knowledge base
- Personalized recommendation engine
- Professional beauty advisor personality

## Customization

### Styling

Modify `style.css` to adjust:

- Color schemes and gradients
- Typography and spacing
- Component layouts
- Responsive breakpoints

### Content

Update `script.js` to modify:

- Welcome messages
- Product knowledge base
- Conversation context
- Error handling messages

### Branding

Replace elements in:

- `img/loreal-logo.png` - Company logo
- `index.html` - Page title and meta information
- CSS color variables - Brand color scheme

## Security Considerations

1. **API Keys**: Never expose OpenAI API keys in frontend code
2. **CORS**: Properly configure CORS headers in Cloudflare Worker
3. **Rate Limiting**: Implement rate limiting to prevent abuse
4. **Input Validation**: Sanitize user inputs before processing

## Browser Support

- **Modern Browsers**: Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
- **Mobile**: iOS Safari 14+, Chrome Mobile 90+
- **Features**: CSS Grid, Flexbox, ES6+ JavaScript, Fetch API

## Deployment Options

### 1. **Static Hosting**

- Netlify, Vercel, GitHub Pages
- CDN distribution for global performance
- Automatic HTTPS and custom domains

### 2. **Cloud Platforms**

- AWS S3 + CloudFront
- Google Cloud Storage
- Azure Static Web Apps

### 3. **Traditional Hosting**

- Any web server supporting static files
- Apache, Nginx, or similar

## Contributing

To enhance the L'Oréal Beauty Advisor:

1. Fork the repository
2. Create a feature branch
3. Add your improvements
4. Test thoroughly across devices
5. Submit a pull request

## License

© 2025 L'Oréal. All rights reserved.

This project is created for demonstration purposes. L'Oréal trademarks and branding are used with respect to showcase AI chatbot capabilities in the beauty industry.

---

**Need Help?** Check the Cloudflare Workers documentation for backend setup, or review the OpenAI API documentation for advanced AI customization.

L’Oréal is exploring the power of AI, and your job is to showcase what's possible. Your task is to build a chatbot that helps users discover and understand L’Oréal’s extensive range of products—makeup, skincare, haircare, and fragrances—as well as provide personalized routines and recommendations.

## 🚀 Launch via GitHub Codespaces

1. In the GitHub repo, click the **Code** button and select **Open with Codespaces → New codespace**.
2. Once your codespace is ready, open the `index.html` file via the live preview.

## ☁️ Cloudflare Note

When deploying through Cloudflare, make sure your API request body (in `script.js`) includes a `messages` array and handle the response by extracting `data.choices[0].message.content`.

Enjoy building your L’Oréal beauty assistant! 💄
