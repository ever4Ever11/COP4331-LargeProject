interface ItineraryOptions {
  [key: string]: string|number;
  location: string;
  duration: number;
  budget: string;
  interests: string;
  travelStyle: string;
}

interface ItineraryProps {
  created: string;
  parameters: ItineraryOptions;
  content: string;
}

export { type ItineraryOptions, type ItineraryProps };