const axios = require('axios');
require('dotenv').config();

const getItinerary = async (location, startDate, duration, budget, interests, travelStyle) => {
  try {
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: "You are a helpful travel assistant that creates vacation itineraries based on user preferences."
          },
          {
            role: "user",
            content: `Plan a vacation itinerary for:
- Location: ${location}
- Start Date: ${startDate}
- Duration: ${duration} days
- Budget: ${budget}
- Interests: ${interests}
- Travel style: ${travelStyle}`
          }
        ],
        max_tokens: 2048
      },
      {
        headers: {
          "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
          "Content-Type": "application/json"
        }
      }
    );
    console.log("OpenAI response:", response.data);
    return response.data.choices[0].message.content;
  } catch (error) {
    throw new Error(error.response ? error.response.data : error.message);
  }
};

module.exports = { getItinerary };
