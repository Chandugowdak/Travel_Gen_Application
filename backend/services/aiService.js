const dotenv = require("dotenv");
dotenv.config();

/**
 * Generate a detailed travel itinerary using available AI models, or falls back to an offline rule-based generation engine.
 */
const generatePlan = async ({ UserStartPlace, UserDestination, UserData, NuberOfDays, UserBudget, UserTravelBy, TotelNumberofPeoples }) => {
  const formattedDate = new Date(UserData).toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const prompt = `Create a highly detailed, professional, and visually stunning day-by-day travel itinerary for a trip from "${UserStartPlace}" to "${UserDestination}".
Trip Details:
- Date of Departure: ${formattedDate}
- Duration: ${NuberOfDays} days
- Budget Category: ${UserBudget}
- Travel Mode: ${UserTravelBy}
- Group Size: ${TotelNumberofPeoples} people

Please structure the travel plan in Markdown. Organize it logically into:
1. **Trip Overview**: An exciting summary of the journey.
2. **Day-by-Day Itinerary**: For each day (e.g., "### 🗓️ Day 1: [Theme Title]"), detail:
   - **🌅 Morning (08:00 AM - 12:00 PM)**: Specific activities, places to see, and transportation tips.
   - **☀️ Afternoon (12:00 PM - 05:00 PM)**: Sightseeing, landmarks, and cultural spots.
   - **🌙 Evening (05:00 PM - 10:00 PM)**: Sunset view spots, local markets, night-life, and dining recommendations.
   - **🍽️ Dining Highlights**: Specific restaurant recommendations or local foods to try.
   - **💰 Estimated Daily Cost**: Approximate expenses.
3. **💼 Recommended Packing List**: Custom list based on destination and mode of travel.
4. **💡 Essential Travel Tips**: Crucial cultural norms, safety guidelines, and navigation tips for ${UserDestination}.`;

  // 1. Try Groq
  if (process.env.GROQ_API_KEY) {
    try {
      console.log("Calling Groq API for travel generation...");
      const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
        },
        body: JSON.stringify({
          model: "llama-3.1-8b-instant",
          messages: [{ role: "user", content: prompt }],
          temperature: 0.7,
        }),
      });
      const data = await response.json();
      if (response.ok && data.choices?.[0]?.message?.content) {
        return data.choices[0].message.content;
      }
      console.warn("Groq API call returned error response status:", response.status);
    } catch (e) {
      console.error("Error calling Groq API, trying next provider:", e.message);
    }
  }

  // 2. Try Gemini
  if (process.env.GEMINI_API_KEY) {
    try {
      console.log("Calling Gemini API for travel generation...");
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
          }),
        }
      );
      const data = await response.json();
      if (response.ok && data.candidates?.[0]?.content?.parts?.[0]?.text) {
        return data.candidates[0].content.parts[0].text;
      }
      console.warn("Gemini API call returned error response status:", response.status);
    } catch (e) {
      console.error("Error calling Gemini API, trying next provider:", e.message);
    }
  }

  // 3. Try OpenRouter
  if (process.env.OPENROUTER_API_KEY) {
    try {
      console.log("Calling OpenRouter API for travel generation...");
      const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "HTTP-Referer": "http://localhost:3000",
          "X-Title": "TravelGen AI",
        },
        body: JSON.stringify({
          model: "meta-llama/llama-3-8b-instruct:free",
          messages: [{ role: "user", content: prompt }],
        }),
      });
      const data = await response.json();
      if (response.ok && data.choices?.[0]?.message?.content) {
        return data.choices[0].message.content;
      }
      console.warn("OpenRouter API call returned error response status:", response.status);
    } catch (e) {
      console.error("Error calling OpenRouter API, falling back to local generator:", e.message);
    }
  }

  // 4. Local Fallback Generator
  console.log("Using Local Offline Travel Engine for trip generation...");
  return generateOfflinePlan(UserStartPlace, UserDestination, formattedDate, NuberOfDays, UserBudget, UserTravelBy, TotelNumberofPeoples);
};

/**
 * Robust offline travel itinerary generator to ensure immediate results even without API keys.
 */
function generateOfflinePlan(start, dest, date, days, budget, travelBy, people) {
  const lowerDest = dest.toLowerCase();
  
  // Specific templates for popular destinations
  const localizedTemplates = {
    paris: {
      overview: "Welcome to Paris, the City of Light! This itinerary is designed to experience the romantic streets, historical monuments, world-class bakeries, and stunning art collections.",
      packing: [
        "Comfortable walking shoes for cobblestone streets",
        "A light jacket/trench coat (weather can be unpredictable)",
        "Elegant casual outfits for dinners and cafes",
        "Universal power adaptor",
      ],
      tips: [
        "Learn a few French words like 'Bonjour' and 'Merci' - locals appreciate it immensely.",
        "Use the Paris Metro; it's fast, affordable, and covers every tourist spot.",
        "Book Louvre museum tickets weeks in advance online.",
      ],
      dailyThemes: [
        {
          title: "Historic Landmarks & Eiffel Tower Views",
          morning: "Start your morning at a local boulangerie for fresh croissants. Head to the **Eiffel Tower** early to take photographs and explore the Champ de Mars gardens.",
          afternoon: "Walk along the Seine River, crossing the Pont d'Iéna to Trocadéro. Take a metro to **Arc de Triomphe** and stroll down the famous **Champs-Élysées**.",
          evening: "Take a scenic night-time cruise along the Seine. See the Eiffel Tower glowing and glittering on the hour. Have dinner at a cozy bistro nearby.",
          dining: "Le Bistro Parisien (French classics) or pastries from Ladurée.",
          cost: "$40 - $70 per person (cruise and meals)",
        },
        {
          title: "Artistic Montmartre & Louvre Masterpieces",
          morning: "Explore the bohemian neighborhood of **Montmartre**. Climb the hill to visit the beautiful **Sacré-Cœur Basilica** for panoramic views of Paris.",
          afternoon: "Descend Montmartre and travel to the **Louvre Museum**. Spend a few hours viewing the Mona Lisa, Winged Victory, and other iconic art masterpieces.",
          evening: "Relax in the Tuileries Garden, then walk to the Place de la Concorde. Indulge in traditional French onion soup and steak-frites in the Latin Quarter.",
          dining: "Chez Gladines or Cafe de Flore for historic coffee vibes.",
          cost: "$30 - $60 (Louvre ticket and lunch)",
        },
        {
          title: "Palace of Versailles Excursion",
          morning: "Take the RER C train from central Paris to **Versailles**. Tour the stunning Hall of Mirrors and royal bedchambers in the main Palace.",
          afternoon: "Rent a bicycle or walk around the expansive, magnificent Gardens of Versailles. Visit the Marie Antoinette estate.",
          evening: "Return to Paris, visit the Saint-Germain-des-Prés district. Enjoy wine and cheese pairings at an authentic French wine bar.",
          dining: "L'Avant Comptoir (world-class tapas and wines).",
          cost: "$50 - $90 (Versailles passport ticket and train)",
        }
      ]
    },
    tokyo: {
      overview: "Welcome to Tokyo, a dazzling metropolis where futuristic skyscrapers and flashing neon signs stand side-by-side with ancient temples and shrines.",
      packing: [
        "Easy slip-off shoes (for entering temples and traditional restaurants)",
        "Suica or Pasmo IC Card (mobile or physical for transit)",
        "Pocket Wi-Fi or eSIM for active navigation",
        "Cash (many smaller ramen shops only take physical cash)",
      ],
      tips: [
        "Avoid eating or drinking while walking; it is considered bad manners.",
        "Stand on the left side of escalators in Tokyo and keep the right side clear.",
        "Always carry a small plastic bag for trash, as public bins are extremely rare.",
      ],
      dailyThemes: [
        {
          title: "Tradition Meets Modernity in Asakusa & Akihabara",
          morning: "Visit **Senso-ji Temple** in Asakusa, Tokyo's oldest Buddhist temple. Stroll down Nakamise Shopping Street to sample sweet melonpan.",
          afternoon: "Take the subway to **Akihabara**, the electric town. Browse multi-story electronics shops and manga stores, and visit a theme cafe.",
          evening: "Head to Ueno Park, then dine at the lively yakitori alleys of **Ameyoko** under the train tracks.",
          dining: "Ramen at Ichiran or fresh sushi at Asakusa Sushiken.",
          cost: "$25 - $50 per person",
        },
        {
          title: "Trendy Harajuku & The Shibuya Scramble",
          morning: "Walk through the quiet forest paths of the sacred **Meiji Jingu Shrine**. Then plunge into the crowded, colorful **Takeshita Street** in Harajuku.",
          afternoon: "Walk down Omotesando Avenue for high-end architecture and shopping. Continue walking towards Shibuya and explore Shibuya Crossing.",
          evening: "Cross the **Shibuya Scramble**. Go up to the Shibuya Sky observation deck for gorgeous sunset city vistas. Have dinner in a local izakaya.",
          dining: "Shibuya Morimoto (yakitori) or Genki Sushi.",
          cost: "$35 - $65 (Shibuya Sky entrance and dinner)",
        },
        {
          title: "Scenic Views & TeamLab Digital Art",
          morning: "Travel to Odaiba, a futuristic artificial island in Tokyo Bay. Visit the giant Gundam Statue and take photos by the Rainbow Bridge.",
          afternoon: "Attend the world-famous **teamLab Planets** museum for an immersive, mind-blowing digital art experience (remember to walk barefoot).",
          evening: "Head to the Shinjuku district, explore the neon-lit alleyways of Omoide Yokocho (Memory Lane) for skewers and draft beer.",
          dining: "Omoide Yokocho stalls or Shinjuku Tsunahachi (tempura).",
          cost: "$45 - $80 (teamLab ticket and Shinjuku dining)",
        }
      ]
    }
  };

  // Select template based on destination, or use generic
  let selected = localizedTemplates[lowerDest];
  
  if (!selected) {
    // Generate a rich generic itinerary customized to the user's destination
    selected = {
      overview: `A stunning getaway to ${dest}. Explore the scenic beauty, historical architecture, vibrant neighborhoods, and delicious local delicacies of this wonderful destination.`,
      packing: [
        "Appropriate footwear for walking and exploring",
        "Weather-appropriate clothing (check forecast before departure)",
        "Travel documents, ID, and camera",
        "A water bottle and universal power adapter",
      ],
      tips: [
        "Plan your routes early using local transit maps.",
        "Keep local currency handy for small purchases and street food vendors.",
        "Observe local customs and respect historical monuments.",
      ],
      dailyThemes: []
    };

    // Generate days dynamically
    const generalThemes = [
      { title: "Arrival, Landmarks & Neighborhood Walk", morn: "Explore local landmarks and city center", aft: "Visit a top-rated local museum or historic avenue", eve: "Enjoy sunset views and dine at a popular district restaurant" },
      { title: "Cultural Heritage & Local Discoveries", morn: "Visit a historical site, temple, or landmark cathedral", aft: "Explore local artisan markets, gift shops, and craft boutiques", eve: "Indulge in local culinary favorites at a highly rated traditional eatery" },
      { title: "Nature Escape & Scenic Adventures", morn: "Take a trip to a scenic local park, forest, beach, or lake", aft: "Enjoy outdoor sports, scenic hiking paths, or a boat cruise", eve: "Relax at an outdoor cafe or rooftop lounge reflecting on your journey" },
      { title: "Hidden Gems & Leisurely Shopping", morn: "Wander down quiet streets to discover local secrets and murals", aft: "Stroll through a famous commercial market or street-side mall", eve: "Have a celebratory final dinner sampling exotic local street-food options" }
    ];

    for (let i = 0; i < days; i++) {
      const theme = generalThemes[i % generalThemes.length];
      selected.dailyThemes.push({
        title: `${theme.title}`,
        morning: `Enjoy breakfast at a local cafe. Head over to the primary district to ${theme.morn.toLowerCase()}.`,
        afternoon: `Take some time for lunch. Spend the afternoon to ${theme.aft.toLowerCase()}, learning about local culture.`,
        evening: `As the sun sets, ${theme.eve.toLowerCase()} and enjoy the local atmosphere.`,
        dining: `Try local specialty items like street food, local desserts, and regional dishes.`,
        cost: budget.toLowerCase().includes("budget") ? "$15 - $30 per person" : budget.toLowerCase().includes("mid") ? "$35 - $60 per person" : "$70 - $150 per person",
      });
    }
  }

  // Compile the final Markdown output
  let markdown = `## ✈️ Travel Plan: Trip to ${dest}\n\n`;
  markdown += `* **From:** ${start}\n`;
  markdown += `* **Departure Date:** ${date}\n`;
  markdown += `* **Duration:** ${days} Days\n`;
  markdown += `* **Budget Category:** ${budget}\n`;
  markdown += `* **Travel Mode:** ${travelBy}\n`;
  markdown += `* **Group Size:** ${people} People\n\n`;

  markdown += `> [!NOTE]\n`;
  markdown += `> **Offline Travel Planner**: Active offline fallback. To activate real-time AI itineraries, configure a \`GROQ_API_KEY\` or \`GEMINI_API_KEY\` in your \`backend/.env\` file!\n\n`;

  markdown += `### 🌟 Trip Overview\n${selected.overview}\n\n`;

  // Render Daily Themes
  const daysToRender = Math.min(days, selected.dailyThemes.length);
  for (let i = 0; i < days; i++) {
    const dayData = selected.dailyThemes[i % selected.dailyThemes.length];
    markdown += `### 🗓️ Day ${i + 1}: ${dayData.title}\n\n`;
    markdown += `* **🌅 Morning (08:00 AM - 12:00 PM):** ${dayData.morning}\n`;
    markdown += `* **☀️ Afternoon (12:00 PM - 05:00 PM):** ${dayData.afternoon}\n`;
    markdown += `* **🌙 Evening (05:00 PM - 10:00 PM):** ${dayData.evening}\n`;
    markdown += `* **🍽️ Dining Highlights:** ${dayData.dining}\n`;
    markdown += `* **💰 Estimated Daily Cost:** ${dayData.cost}\n\n`;
  }

  markdown += `### 💼 Recommended Packing List\n`;
  selected.packing.forEach(item => {
    markdown += `- [ ] ${item}\n`;
  });
  markdown += `\n`;

  markdown += `### 💡 Essential Travel Tips\n`;
  selected.tips.forEach(tip => {
    markdown += `- 📍 **Tip:** ${tip}\n`;
  });

  return markdown;
}

module.exports = {
  generatePlan,
};
