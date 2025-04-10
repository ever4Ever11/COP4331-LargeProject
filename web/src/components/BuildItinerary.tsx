import React from "react";
//import { buildPath } from './Path.tsx';
import * as FaIcons from 'react-icons/fa';
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
    alert("Your Itinerary has been Saved !")
  };

  if (generatedItinerary) {
    return (
      <>
        <div className="container mt-20 py-5 max-w-3xl border-4 border-cyan-700 py-14 max-w-5xl mx-auto">
        <Itinerary {...generatedItinerary} />
        <div className="flex space-x-4 items-center justify-center mt-5">
        <button type="button" className="bg-black text-white px-4 py-2 rounded hover:text-yellow-500 focus:outline-none focus:ring-2 focus:ring-opacity-50" onClick={() => {setGeneratedItinerary(null); setSaved(false);}}>Try Again</button>
        <button type="button" className="bg-black text-white px-4 py-2 rounded hover:text-yellow-500 focus:outline-none focus:ring-2 focus:ring-opacity-50" onClick={saveItinerary} disabled={saved}>Save</button>
        </div>
        </div>
      </>
    );
  }

  return (
  <div className="container mt-10 py-5 max-w-3xl border-4 rounded-lg border-cyan-700 mx-auto bg-cover">
    <div className="relative border-2 border-cyan-700 rounded-full text-4xl font-extrabold py-5 text-transparent bg-clip-text bg-gradient-to-r from-yellow-500 to-cyan-700 shadow-xl animate-pulse text-shadow-xl">
     <FaIcons.FaPen className="absolute top-0 left-0 text-cyan-700 text-xl m-2" />
      Travel Itinerary
    </div>
    <div className="py-5 text-ml font-semibold flex justify-between items-center">
      <p className="px-10">DATE: ________/________/________</p>
      <p className="flex items-center">
        FORECAST: 
        <FaIcons.FaSun className="px-2 text-3xl" />
        <FaIcons.FaCloudRain className="px-2 text-3xl" />
        <FaIcons.FaWind className="px-2 text-3xl" />
        <FaIcons.FaPooStorm className="px-2 text-3xl" />
      </p>
    </div>
    <div>
      <p className="font-semibold">
      NOTES:__________________________________________________________________
      </p>
    </div>

    <form onSubmit={generateItinerary} autoComplete="off" className="py-5">
      <div className="space-y-4 grid grid-rows-5 gap-4 flex bg-cyan-700 py-5 p-8 rounded-lg shadow-lg border-2 border-cyan-700 hover:shadow-x">
      {suggestionListNames.map((name) =>
        <datalist id={`${name}Suggestions`}>
          {currentSuggestionLists && currentSuggestionLists[name].map((suggestion) =>
            <option value={suggestion.value} />
          )}
        </datalist>
      )}
  <div className="flex items-center justify-center gap-4 border-b-2">
    <FaIcons.FaLocationArrow className="text-white text-xl" />
    <label htmlFor="location" className="text-xl font-semibold text-white">Enter travel destination:</label>
    <input
    id="location"
    type="text"
    list="locationSuggestions"
    placeholder="London, Tokyo, Vancouver,..."
    className="w-60 h-10 p-4 text-sm border border-gray-300 rounded-lg" 
    onChange={handleInput}
    />
  </div>

  <div className="flex items-center justify-center gap-4 py-2 border-b-2">
    <FaIcons.FaCalendarTimes className="text-white text-xl" />
    <label htmlFor="duration" className="text-xl font-semibold text-white">Enter travel duration:</label>
    <input
    id="duration"
    type="number"
    min="1"
    placeholder="enter a number: 1, 2, 3,..."
    className="w-60 h-10 p-4 text-sm border-2 border-gray-300 rounded-lg"
    onChange={handleInput}
    />
  </div>

  <div className="flex items-center justify-center gap-4 py-2 border-b-2">
   <FaIcons.FaMoneyBillAlt className="text-white text-xl" />
   <label htmlFor="budget" className="text-xl font-semibold text-white">Enter travel budget:</label>
   <input
    id="budget"
    type="text"
    list="budgetSuggestions"
    placeholder="low, medium, high..."
    className="w-60 h-10 p-4 text-sm border-2 border-gray-300 rounded-lg"
    onChange={handleInput}
   />
  </div>

  <div className="flex items-center justify-center gap-4 py-2 border-b-2">
   <FaIcons.FaHiking className="text-white text-xl" />
   <label htmlFor="interests" className="text-xl font-semibold text-white">Enter travel interests:</label>
   <input
    id="interests"
    type="text"
    list="interestsSuggestions"
    placeholder="adventure, culture, relaxation,..."
    className="w-60 h-10 p-4 text-sm border-2 border-gray-300 rounded-lg"
    onChange={handleInput}
   />
  </div>

  <div className="flex items-center justify-center gap-4 py-2 border-b-2">
   <FaIcons.FaHotel className="text-white text-xl" />
   <label htmlFor="travelStyle" className="text-xl font-semibold text-white">Enter travel style:</label>
   <input
    id="travelStyle"
    type="text"
    list="travelStyleSuggestions"
    placeholder="solo, family, luxury, backpacking,..."
    className="w-60 h-10 p-4 text-sm border-2 border-gray-300 rounded-lg"
    onChange={handleInput}
   />
  </div>

  <div className="flex justify-center py-5">
    <button type="submit" className="w-64 h-12 p-4 text-lg rounded-lg border-gray-300 bg-black text-white flex items-center justify-center space-x-2 hover:text-yellow-500 focus:outline-none focus:ring-2 focus:ring-opacity-50">
    <FaIcons.FaPlane />
    <span>let's go</span>
    </button>
  </div>

     </div> 
    </form> 
  </div>
  );
};

export default BuildItinerary;
