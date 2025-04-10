import React, { useRef, useEffect, useState } from "react";
import Itinerary from "./Itinerary";
import { ItineraryProps } from "../types/Itinerary";
import * as FaIcons from 'react-icons/fa';
import Img from "../assets/bookmark.png";

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
    if (totalItems < 1) return [];
  
    let firstPage, lastPage;
  
    if (totalPages <= 5) {
      firstPage = 1;
      lastPage = totalPages;
    } else if (currentPage <= 3) {
      firstPage = 1;
      lastPage = 5;
    } else if (currentPage >= totalPages - 2) {
      firstPage = totalPages - 4;
      lastPage = totalPages;
    } else {
      firstPage = currentPage - 2;
      lastPage = currentPage + 2;
    }
  
    const pages = [];
    for (let i = firstPage; i <= lastPage; i++) {
      pages.push(
        <button
          key={i}
          className={`px-4 py-2 mx-1 text-sm font-semibold rounded-md 
                      ${i === currentPage ? 'bg-black text-white' : 'bg-white text-black'} 
                      hover:text-yellow-500 focus:outline-none`}
          onClick={() => setCurrentPage(i)}
        >
          {i}
        </button>
      );
    }  
    return pages;
  }; 

  return (
    <div className="container py-14 mt-20 max-w-5xl mx-auto bg-cyan-700 rounded-lg">
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
                 className="block p-3 w-full z-20 text-sm text-gray-900 bg-gray-50 rounded-e-lg border-s-gray-50 border-s-2 border border-gray-300 focus:ring-blue-500 focus:border-cyan-700 dark:bg-gray-700 dark:border-s-gray-700  dark:border-gray-600 dark:placeholder-gray-400"
                 placeholder="Search Keywords" value={keyword} />
          <button type="button"
                  onClick={() => {filterItineraries();}}
                  className="absolute top-0 end-0 p-2.5 text-sm font-medium h-full text-white bg-black rounded-e-lg border border-cyan-700 hover:text-yellow-500 focus:ring-4 focus:outline-none focus:ring-blue-300">
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
          <div className="bg-gray-200 p-8 rounded-lg shadow-lg border-2 border-cyan-700 transition-transform duration-300 ease-in-out hover:scale-105 hover:shadow-lg hover:cursor-pointer"
               key={element.created}>
            <div className="text-xl font-semibold text-gray-700">
              <div>🗓️ Created: {new Date(element.created).toDateString()}</div>
              <div>🌆 Destination: {element.parameters.location}</div>
              <div>⏳ Duration: {element.parameters.duration}</div>
              <div>💰 Budget: {element.parameters.budget}</div>
              <div>🤔 Interests: {element.parameters.interests}</div>
              <div>🏖️ Travel Style: {element.parameters.travelStyle}</div>
              <div className="flex justify-end gap-4">
              <div onClick={() => {setSelectedItinerary(element); selectedItineraryDialogRef.current?.showModal();}}>
                <FaIcons.FaEye className="text-cyan-700 text-2xl transition-transform transform hover:scale-125 hover:cursor-pointer" />
              </div>
              <div onClick={() => deleteItinerary(element.created)}>
                <FaIcons.FaTrash className="text-cyan-700 text-2xl transition-transform transform hover:scale-125 hover:cursor-pointer" />
              </div>
            </div>
            </div>
          </div>
        ))}
      </div>
      :
      (allItineraries.length > 0 ?
      <div className="p-6 py-5 mt-5 bg-white text-2xl">        
      <img src={Img} alt="loading" className="py-5 w-[450px] mx-auto md:max-w-[400px]"/>
      <p className="p-6 py-5 mt-5 font-bond"> No Bookmarks have been found! </p>
      </div>
      :
      <div className="p-6 py-5 mt-5 bg-white text-2xl">        
      <img src={Img} alt="loading" className="py-5 w-[450px] mx-auto md:max-w-[400px]"/>
      <p className="p-6 py-5 mt-5 font-bond">
        You have no Bookmarks,<br/> 
        Please go to create your first itinerary! 
      </p>
      </div>
      )}

      {/*Page Selection Bar*/}
      <div className="flex justify-between items-center py-4">

        {/*Page Left*/}
        <button className="px-4 py-2 text-white rounded-md bg-black hover:text-yellow-500 hover:cursor-pointer"
                aria-label="PageLeft"
                onClick={() => setCurrentPage(currentPage - 1)}
                disabled={currentPage <= 1}>
        <FaIcons.FaArrowLeft/>
        </button>

        {/*Pages in Between*/}
        <div className="flex space-x-2">{renderPagination()}</div>

        {/*Page Right*/}
        <button className="px-4 py-2 text-white rounded-md bg-black hover:text-yellow-500 hover:cursor-pointer"
                aria-label="PageRight"
                onClick={() => setCurrentPage(currentPage + 1)}
                disabled={currentPage >= totalPages}>
        <FaIcons.FaArrowRight/>
        </button>

      </div>

    </div>
  );
};

export default Bookmarks;
