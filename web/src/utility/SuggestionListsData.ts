import { SuggestionLists } from "../types/Suggestions";

const SuggestionListsData: SuggestionLists = {
  location: [
    {value: 'Toronto', relevance: 50},
    {value: 'London', relevance: 79},
    {value: 'Tokyo', relevance: 88},
    {value: 'Vancouver', relevance: 57},
    {value: 'Venice', relevance: 66},
    {value: 'Valencia', relevance: 32},
    {value: 'Tacoma', relevance: 10},
  ],
  budget: [
    {value: 'low', relevance: 1},
    {value: 'medium', relevance: 1},
    {value: 'high', relevance: 1},
  ],
  interests: [
    {value: 'adventure', relevance: 1},
    {value: 'culture', relevance: 1},
    {value: 'relaxation', relevance: 1},
  ],
  travelStyle: [
    {value: 'solo', relevance: 1},
    {value: 'family', relevance: 1},
    {value: 'luxury', relevance: 1},
    {value: 'backpacking', relevance: 1},
  ],
};

export { SuggestionListsData };