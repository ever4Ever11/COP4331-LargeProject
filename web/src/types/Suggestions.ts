interface Suggestion {
  value: string;
  relevance: number;
}

interface SuggestionLists {
  [key: string]: Suggestion[];
  location: Suggestion[];
  budget: Suggestion[];
  interests: Suggestion[];
  travelStyle: Suggestion[];
}

export { type Suggestion, type SuggestionLists };