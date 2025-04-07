import React from "react";
//import { buildPath } from './Path.tsx';
//import * as FaIcons from 'react-icons/fa';
//import Bannerimage from "../assets/8.png";
import Itinerary from "./Itinerary";
import { newItineraryOptions, newItinerary } from "../utility/Itinerary";
import { ItineraryProps } from "../types/Itinerary";
import { suggestionListNames, newSuggestionLists } from "../utility/Suggestions";
import { Suggestion, SuggestionLists } from "../types/Suggestions";
import { SuggestionListsData } from "../utility/SuggestionListsData";
import { FakeItinerariesData } from "../utility/FakeItinerariesData";

const BuildItinerary: React.FunctionComponent = () => {

  const [itineraryOptions, setItineraryOptions] = React.useState(newItineraryOptions());
  const [generatedItinerary, setGeneratedItinerary] = React.useState<null|ItineraryProps>(null);
  const [saved, setSaved] = React.useState<boolean>(false);

  const [suggestionLists, setSuggestionLists] = React.useState<SuggestionLists>();
  const [currentSuggestionLists, setCurrentSuggestionLists] = React.useState<SuggestionLists>();

  React.useEffect(() => {
    // Get suggestion lists from API?

    const byRelevance = (a: Suggestion, b: Suggestion) => b.relevance - a.relevance;
    suggestionListNames.map((name) => SuggestionListsData[name].sort(byRelevance));

    setSuggestionLists(SuggestionListsData);
    setCurrentSuggestionLists(newSuggestionLists());
  }, []);

  const handleInput = (event : React.ChangeEvent<HTMLInputElement>) => {
    const field = event.target.id;
    const value = event.target.value;

    const newItineraryOptions = {...itineraryOptions};
    newItineraryOptions[field] = value;
    setItineraryOptions(newItineraryOptions);

    if (suggestionLists && currentSuggestionLists && field in suggestionLists) {
      const newCurrentSuggestionLists = {...currentSuggestionLists};
      const isSuggestion = (suggestion: Suggestion) => suggestion.value.toLowerCase().startsWith(value.toLowerCase());
      newCurrentSuggestionLists[field] = suggestionLists[field].filter(isSuggestion).slice(0,3);
      setCurrentSuggestionLists(newCurrentSuggestionLists);
    }
  };

  async function generateItinerary(event: React.FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault();

    try {
      /*
      const response = await fetch(buildPath('api/itinerary'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(itineraryOptions)
      });
      const data = await response.json();

      if (data.error) {
        alert(data.error);
        return;
      }
      */

      alert("Generated itinerary is fake!");

      const created = new Date().toISOString();
      const content = FakeItinerariesData[Math.floor(Math.random()*FakeItinerariesData.length)];

      console.log('Building itinerary ....');
      console.log(created);
      console.log(itineraryOptions);
      console.log(content);

      setGeneratedItinerary(newItinerary(created, itineraryOptions, content));
      //setGeneratedItinerary(newItinerary(created, itineraryOptions, data.content));

    } catch (err: unknown) {
      alert("Error sending reset request: " + err?.toString());
    }
  };

  const saveItinerary = () => {
    // API call?

    let storedItineraries = [];
    const unparsed = localStorage.getItem('itineraries');
    if (unparsed) {
      storedItineraries = JSON.parse(unparsed);
    }
    storedItineraries.push(generatedItinerary);
    localStorage.setItem('itineraries', JSON.stringify(storedItineraries));
    setSaved(true);
  };

  if (generatedItinerary) {
    return (
      <>
        <Itinerary {...generatedItinerary} />
        <button type="button" onClick={() => {setGeneratedItinerary(null); setSaved(false);}}>Try Again</button>
        <button type="button" onClick={saveItinerary} disabled={saved}>Save</button>
      </>
    );
  }

  return (
    <form onSubmit={generateItinerary} autoComplete="off">

      <p>Your Next Adventure Awaits!</p>

      {suggestionListNames.map((name) =>
        <datalist id={`${name}Suggestions`}>
          {currentSuggestionLists && currentSuggestionLists[name].map((suggestion) =>
            <option value={suggestion.value} />
          )}
        </datalist>
      )}

      <label htmlFor="location">Enter your destination:</label>
      <input id="location" type="text" list="locationSuggestions" placeholder="(e.g., London, Tokyo, Vancouver)" onChange={handleInput} />

      <label htmlFor="duration">Enter the number of days:</label>
      <input id="duration" type="number" min="1" onChange={handleInput} />

      <label htmlFor="budget">Enter your budget:</label>
      <input id="budget" type="text" list="budgetSuggestions" placeholder="(e.g., low, medium, high)" onChange={handleInput} />

      <label htmlFor="interests">Enter your interests:</label>
      <input id="interests" type="text" list="interestsSuggestions" placeholder="(e.g., adventure, culture, relaxation)" onChange={handleInput} />

      <label htmlFor="travelStyle">Enter your travel style:</label>
      <input id="travelStyle" type="text" list="travelStyleSuggestions" placeholder="(e.g., solo, family, luxury, backpacking)" onChange={handleInput} />

      <button type="submit">let's go</button>

    </form>
  );
};

export default BuildItinerary;
