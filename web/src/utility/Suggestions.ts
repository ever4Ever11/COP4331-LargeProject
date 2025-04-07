import { SuggestionLists } from "../types/Suggestions";

const suggestionListNames = [
  'location', 'budget', 'interests', 'travelStyle'
];

function newSuggestionLists(): SuggestionLists {
  return {
    location: [],
    budget: [],
    interests: [],
    travelStyle: [],
  };
}

export { suggestionListNames, newSuggestionLists };