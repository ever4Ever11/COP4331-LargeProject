import React, { useRef, useEffect, useState } from "react";
import Itinerary from "./Itinerary";
import { ItineraryProps } from "../types/Itinerary";
import * as FaIcons from 'react-icons/fa';

const Bookmarks: React.FunctionComponent = () => {
  const selectedItineraryDialogRef = useRef<HTMLDialogElement>(null);

  const [allItineraries, setAllItineraries] = useState<ItineraryProps[]>([]);
  const [filteredItineraries, setFilteredItineraries] = useState<ItineraryProps[]>([]);
  const [keyword, setKeyword] = useState<string>("");
  const [selectedItinerary, setSelectedItinerary] = useState<null|ItineraryProps>(null);

  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    let storedItineraries = [];
    const unparsed = localStorage.getItem('itineraries');
    if (unparsed) {
      storedItineraries = JSON.parse(unparsed);
    }
    setAllItineraries(storedItineraries);
    setFilteredItineraries(storedItineraries);
  }, []);

  const itemsPerPage = 4;
  const totalItems = filteredItineraries.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  if (0 < totalItems && totalPages < currentPage) {
    setCurrentPage(totalPages);
  }

  const filterItineraries = () => {
    console.log(`Filtering ${keyword}`);
    const newFilteredItineraries = [];
    for (const itinerary of allItineraries) {
      const istr = JSON.stringify(itinerary.parameters).toLowerCase()
      const kstr = keyword.toLowerCase()
      if (istr.includes(kstr)) {
        newFilteredItineraries.push(itinerary);
      }
    }
    setFilteredItineraries(newFilteredItineraries);
    setKeyword("");
  }

  const deleteItinerary = (created: string) => {
    // API call?

    console.log(`Deleted: ${created}`);
    let storedItineraries = [];
    const unparsed = localStorage.getItem('itineraries');
    if (unparsed) {
      storedItineraries = JSON.parse(unparsed);
    }
    const newStoredItineraries: ItineraryProps[] = [];
    for (const itinerary of storedItineraries) {
      if (itinerary.created != created) {
        newStoredItineraries.push(itinerary);
      }
    }
    localStorage.setItem('itineraries', JSON.stringify(newStoredItineraries));
    setAllItineraries(newStoredItineraries);
    setFilteredItineraries(newStoredItineraries);
  };

  const getPageData = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredItineraries.slice(startIndex, endIndex);
  };

  const renderPagination = () => {

    if (totalItems < 1) {
      return [];
    }

    let firstPage = currentPage - 5;
    let lastPage = currentPage + 5;
    if (currentPage - 5 < 1 && totalPages < currentPage + 5 ) {
      firstPage = 1;
      lastPage = totalPages;
    }
    else if (currentPage - 5 < 1) {
      firstPage = 1;
      lastPage = 10;
    }
    else if (totalPages < currentPage + 5) {
      firstPage = totalPages - 9;
      lastPage = totalPages;
    }

    const pages=[];
    for (let i = firstPage; i <= lastPage; i++) {
      pages.push(
        <button key={i}
                className={`px-4 py-2 mx-1 text-sm font-semibold rounded-md 
                            ${i === currentPage ? 'bg-black text-white' : 'bg-white text-black'} 
                            hover:bg-cyan-700 hover:text-white focus:outline-none`}
                onClick={() => setCurrentPage(i)}>
          {i}
        </button>
      );
    }
    return pages;
  };

  return (
    <div className="container py-14 mt-10 max-w-5xl mx-auto bg-cyan-700 rounded-lg">
      <dialog className="max-w-4xl border-4 border-cyan-700 py-5 px-8 mx-auto" ref={selectedItineraryDialogRef}>
        {selectedItinerary && <Itinerary {...selectedItinerary} />}
        <div className="flex justify-center">
          <button type="button" onClick={() => { selectedItineraryDialogRef.current?.close() }} className="text-white bg-black mt-5 border-none hover:text-yellow-500">Back</button>
        </div>
      </dialog>

      {/*Filter Bar*/}
      <form className="relative w-60 mx-auto items-center">
          <input type="search"
                 id="filter"
                 onChange={(e) => {setKeyword(e.target.value);}}
                 className="block p-3 w-full z-20 text-sm text-gray-900 bg-gray-50 rounded-e-lg border-s-gray-50 border-s-2 border border-gray-300 focus:ring-blue-500 focus:border-cyan-700 dark:bg-gray-700 dark:border-s-gray-700  dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:border-yellow-500"
                 placeholder="Search Keywords" value={keyword} />
          <button type="button"
                  onClick={() => {filterItineraries();}}
                  className="absolute top-0 end-0 p-2.5 text-sm font-medium h-full text-white bg-black rounded-e-lg border border-cyan-700 hover:bg-cyan-700 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
          <svg className="w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
          <path stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
          </svg>
          <span className="sr-only">Search</span>
          </button>
      </form>

      {/*Cards*/}
      {totalItems > 0 ?
      <div className="grid grid-cols-2 gap-4 p-6 py-8 mt-5 bg-white">
        {getPageData().map((element) => (
          <div className="bg-gray-200 p-8 rounded-lg shadow-lg border-2 border-cyan-700 hover:shadow-xl hover:translate-y-[-10px] transition-all"
               key={element.created}>
            <div className="text-xl font-semibold text-gray-700">
              <div>🗓️ Created: {new Date(element.created).toDateString()}</div>
              <div>🌆 Destination: {element.parameters.location}</div>
              <div>⏳ Duration: {element.parameters.duration}</div>
              <div>💰 Budget: {element.parameters.budget}</div>
              <div>🏖️ Travel Style: {element.parameters.travelStyle}</div>
              <div className="flex justify-end gap-4">
              <div onClick={() => {setSelectedItinerary(element); selectedItineraryDialogRef.current?.showModal();}}>
                <FaIcons.FaEye className="text-cyan-700 text-2xl transition-transform transform hover:scale-125" />
              </div>
              <div onClick={() => deleteItinerary(element.created)}>
                <FaIcons.FaTrash className="text-cyan-700 text-2xl transition-transform transform hover:scale-125" />
              </div>
            </div>
            </div>
          </div>
        ))}
      </div>
      :
      <p className="p-6 py-8 mt-5 bg-white text-2xl">
        You have no Bookmarks,<br/> 
        Please go to create your first itinerary! 
      </p>
      }

      {/*Page Selection Bar*/}
      <div className="flex justify-between items-center py-4">

        {/*Page Left*/}
        <button className="px-4 py-2 text-white rounded-md bg-black hover:bg-cyan-700"
                onClick={() => setCurrentPage(currentPage - 1)}
                disabled={currentPage <= 1}>
        <FaIcons.FaArrowLeft/>
        </button>

        {/*Pages in Between*/}
        <div className="flex space-x-2">{renderPagination()}</div>

        {/*Page Right*/}
        <button className="px-4 py-2 text-white rounded-md bg-black hover:bg-cyan-700"
                onClick={() => setCurrentPage(currentPage + 1)}
                disabled={currentPage >= totalPages}>
        <FaIcons.FaArrowRight/>
        </button>

      </div>

    </div>
  );
};

export default Bookmarks;
