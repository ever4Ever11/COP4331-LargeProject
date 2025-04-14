import React, { useEffect, useState } from "react";
import * as FaIcons from "react-icons/fa";
import Itinerary from "./Itinerary";
import { newItineraryOptions } from "../utility/Itinerary";
import { ItineraryProps } from "../types/Itinerary";
import { suggestionListNames, newSuggestionLists } from "../utility/Suggestions";
import { Suggestion } from "../types/Suggestions";
import { SuggestionListsData } from "../utility/SuggestionListsData";
import { buildPath } from "../components/Path";

const BuildItinerary: React.FunctionComponent = () => {
  const [itineraryOptions, setItineraryOptions] = useState(newItineraryOptions());
  const [generatedItinerary, setGeneratedItinerary] = useState<ItineraryProps | null>(null);
  const [saved, setSaved] = useState<boolean>(false);
  const [suggestionLists, setSuggestionLists] = useState<any>(null);
  const [currentSuggestionLists, setCurrentSuggestionLists] = useState<any>(null);

  useEffect(() => {
    suggestionListNames.forEach((name) => {
      SuggestionListsData[name].sort((a: Suggestion, b: Suggestion) => b.relevance - a.relevance);
    });
    setSuggestionLists(SuggestionListsData);
    setCurrentSuggestionLists(newSuggestionLists());
  }, []);

  const handleInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    const field = event.target.id;
    const value = event.target.value;
    const newOptions = { ...itineraryOptions, [field]: value };
    setItineraryOptions(newOptions);

    if (suggestionLists && suggestionLists[field]) {
      const newCurrent = { ...currentSuggestionLists };
      const isSuggestion = (suggestion: Suggestion) =>
        suggestion.value.toLowerCase().startsWith(value.toLowerCase());
      newCurrent[field] = suggestionLists[field].filter(isSuggestion).slice(0, 3);
      setCurrentSuggestionLists(newCurrent);
    }
  };

  async function generateItinerary(event: React.FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault();
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        alert("You must be logged in to generate an itinerary.");
        return;
      }
      const response = await fetch(buildPath("api/itinerary"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer " + token,
        },
        body: JSON.stringify(itineraryOptions),
      });
      const data = await response.json();
      if (data.error) {
        alert(data.error);
        return;
      }
      console.log("API Response Data:", data);
      setGeneratedItinerary(data.itinerary);
    } catch (err: any) {
      console.error("Error generating itinerary:", err);
      alert("Error generating itinerary: " + err.toString());
    }
  }

  const saveItinerary = () => {
    let storedItineraries: ItineraryProps[] = [];
    const unparsed = localStorage.getItem("itineraries");
    if (unparsed) {
      try {
        storedItineraries = JSON.parse(unparsed);
      } catch (e) {
        storedItineraries = [];
      }
    }
    if (generatedItinerary) {
      storedItineraries.push(generatedItinerary);
      localStorage.setItem("itineraries", JSON.stringify(storedItineraries));
      setSaved(true);
      alert("Your Itinerary has been Saved!");
    }
  };

  if (generatedItinerary) {
    return (
      <>
        <div className="container mt-20 py-5 max-w-3xl border-4 border-cyan-700 py-14 max-w-5xl mx-auto">
          <Itinerary {...generatedItinerary} />
          <div className="flex space-x-4 items-center justify-center mt-5">
            <button
              type="button"
              className="bg-black text-white px-4 py-2 rounded hover:text-yellow-500 focus:outline-none focus:ring-2 focus:ring-opacity-50"
              onClick={() => {
                setGeneratedItinerary(null);
                setSaved(false);
              }}
            >
              Try Again
            </button>
            <button
              type="button"
              className="bg-black text-white px-4 py-2 rounded hover:text-yellow-500 focus:outline-none focus:ring-2 focus:ring-opacity-50"
              onClick={saveItinerary}
              disabled={saved}
            >
              Save
            </button>
          </div>
        </div>
      </>
    );
  }

  return (
    <div className="container mt-10 py-5 max-w-3xl border-4 rounded-lg border-cyan-700 mx-auto bg-cover">
      <div className="relative border-2 border-cyan-700 rounded-full text-4xl font-extrabold py-5 text-transparent bg-clip-text bg-gradient-to-r from-yellow-500 to-cyan-700 shadow-xl animate-pulse">
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
        <div className="space-y-4 grid grid-rows-5 gap-4 flex bg-cyan-700 py-5 p-8 rounded-lg shadow-lg border-2 border-cyan-700 hover:shadow-xl">
          {suggestionListNames.map((name) => (
            <datalist key={name} id={`${name}Suggestions`}>
              {currentSuggestionLists &&
                currentSuggestionLists[name] &&
                currentSuggestionLists[name].map((suggestion: Suggestion) => (
                  <option key={suggestion.value} value={suggestion.value} />
                ))}
            </datalist>
          ))}
          <div className="flex items-center justify-center gap-4 border-b-2">
            <FaIcons.FaLocationArrow className="text-white text-xl" />
            <label htmlFor="location" className="text-xl font-semibold text-white">
              Enter travel destination:
            </label>
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
            <label htmlFor="startDate" className="text-xl font-semibold text-white">
              Enter start date:
            </label>
            <input
              id="startDate"
              type="date"
              className="w-60 h-10 p-4 text-sm border-2 border-gray-300 rounded-lg"
              onChange={handleInput}
            />
          </div>
          <div className="flex items-center justify-center gap-4 py-2 border-b-2">
            <FaIcons.FaCalendarTimes className="text-white text-xl" />
            <label htmlFor="duration" className="text-xl font-semibold text-white">
              Enter travel duration:
            </label>
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
            <label htmlFor="budget" className="text-xl font-semibold text-white">
              Enter travel budget:
            </label>
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
            <label htmlFor="interests" className="text-xl font-semibold text-white">
              Enter travel interests:
            </label>
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
            <label htmlFor="travelStyle" className="text-xl font-semibold text-white">
              Enter travel style:
            </label>
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
            <button
              type="submit"
              className="w-64 h-12 p-4 text-lg rounded-lg border-gray-300 bg-black text-white flex items-center justify-center space-x-2 hover:text-yellow-500 focus:outline-none focus:ring-2 focus:ring-opacity-50"
            >
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
