export interface ItineraryProps {
  created: string;
  parameters: {
    location: string;
    startDate: string;
    duration: number | string;
    budget: string;
    interests: string;
    travelStyle: string;
  };
  itineraryContent: string; 
}
