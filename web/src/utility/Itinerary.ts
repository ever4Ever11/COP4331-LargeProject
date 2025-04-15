import { ItineraryProps } from "../types/Itinerary";


export type ItineraryOptions = {
  location: string;
  startDate: string;
  duration: number | string;
  budget: string;
  interests: string;
  travelStyle: string;
};

export function newItineraryOptions(): ItineraryOptions {
  return {
    location: "",
    startDate: "",
    duration: "",
    budget: "",
    interests: "",
    travelStyle: ""
  };
}

export function newItinerary(
  created: string,
  options: ItineraryOptions,
  content: string
): ItineraryProps {
  return {
    created,
    parameters: options,
    itineraryContent: content
  };
}
