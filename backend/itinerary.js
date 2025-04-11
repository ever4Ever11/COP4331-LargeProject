require("dotenv").config();
const axios = require('axios');
let jwt = require("jsonwebtoken");

exports.getItinerary = async (req) => {
    try {

        jwt.verify(req.token, process.env.ACCESS_TOKEN_SECRET);

        const { location, duration, budget, interests, travelStyle } = req;

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

        return { itinerary: response.data.choices[0].message.content };
    } catch (err) {
        return { error: err.message || 'Token verification or OpenAI call failed' };
    }
};
