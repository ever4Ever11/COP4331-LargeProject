import { ItineraryOptions, ItineraryProps } from "../types/Itinerary";

function newItineraryOptions(): ItineraryOptions {
  return {
    location: 'any',
    duration: 1,
    budget: 'any',
    interests: 'everything',
    travelStyle: 'any',
  };
}

function newItinerary(created: string, parameters: ItineraryOptions, content: string): ItineraryProps {
  return {
    created: created,
    parameters: parameters,
    content: content,
  }
}

export { newItineraryOptions, newItinerary };