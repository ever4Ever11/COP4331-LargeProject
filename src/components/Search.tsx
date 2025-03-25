import React, { useEffect, useState } from "react";
import * as FaIcons from 'react-icons/fa';

// Define a User type to type the data properly
interface User {
  id: number;
  name: string;
  username: string;
  email: string;
  [key: string]: string | number; // This allows for any other dynamic properties (for search)
}

interface PaginationProps {
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
}


const Search: React.FunctionComponent<PaginationProps> = ({ totalItems = 1000, itemsPerPage = 8, onPageChange }) => {

  const [data, setData] = useState<User[]>([]); // Use the User type for the state
  const [query, setQuery] = useState<string>("");

  const [likedUsers, setLikedUsers] = useState<Record<number, boolean>>({});


  const handleLikeClick = (id: number) => {
    setLikedUsers(prevLikedUsers => ({
      ...prevLikedUsers,
      [id]: !prevLikedUsers[id], // Toggle like status for the user with the given ID
    }));
  };

  const fetchData = () => {
    fetch("https://jsonplaceholder.typicode.com/users")
      .then((res) => res.json())
      .then((d: User[]) => setData(d)); // Ensure the data fetched is typed as User[]
  };

  useEffect(() => {
    fetchData();
  }, []);

  const search_parameters = Object.keys(data.length > 0 ? data[0] : {}); // Get keys from the first object in the data array

  // Typing the search function
  const search = (data: User[]): User[] => {
    return data.filter((dataObj) =>
      search_parameters.some((parameter) =>
        dataObj[parameter].toString().toLowerCase().includes(query.toLowerCase())
      )
    );
  };

  const totalPages = Math.ceil(totalItems / itemsPerPage); // Calculate the total number of pages
  const [currentPage, setCurrentPage] = useState(1);

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return; // Prevent going outside valid page range
    setCurrentPage(page);
    onPageChange(page); // Call the parent callback to handle page change
  };

  const renderPagination = () => {
    const pageNumbers=[];
    for (let i = 1; i <= totalPages; i++) {
      pageNumbers.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={`px-4 py-2 mx-1 text-sm font-semibold rounded-md 
                      ${i === currentPage ? 'bg-black text-white' : 'bg-white text-black'} 
                      hover:bg-cyan-700 hover:text-white focus:outline-none`}
        >
          {i}
        </button>
      );
    }
    return pageNumbers;
  };

  // Get the slice of data for the current page
  const getPaginatedData = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return search(data).slice(startIndex, endIndex);
  };

  return (
    <div className="container py-10 max-w-5xl mx-auto">
      {/* Search Bar section */}
     <form className="max-w-lg mx-auto">
       <div className="flex">
        <label htmlFor="search-dropdown" className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white">Your Email</label>
        <button id="dropdown-button" data-dropdown-toggle="dropdown" className="shrink-0 z-10 inline-flex items-center py-2.5 px-4 text-sm font-medium text-center text-gray-900 bg-gray-100 border border-cyan-700 rounded-s-lg hover:bg-gray-200 focus:ring-4 focus:outline-none focus:ring-cyan-700 dark:bg-gray-700 dark:hover:bg-cyan-700 dark:focus:ring-gray-700 dark:text-white dark:border-gray-600" type="button">All categories <svg className="w-2.5 h-2.5 ms-2.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 4 4 4-4"/>
        </svg>
       </button>
        <div id="dropdown" className="z-10 hidden bg-white divide-y divide-gray-100 rounded-lg shadow-sm w-44 dark:bg-gray-700">
            <ul className="py-2 text-sm text-gray-700 dark:text-gray-200" aria-labelledby="dropdown-button">
            <li>
                <button type="button" className="inline-flex w-full px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Mockups</button>
            </li>
            <li>
                <button type="button" className="inline-flex w-full px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Templates</button>
            </li>
            <li>
                <button type="button" className="inline-flex w-full px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Design</button>
            </li>
            <li>
                <button type="button" className="inline-flex w-full px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Logos</button>
            </li>
            </ul>
        </div>
        <div className="relative w-full">
            <input type="search" id="search-dropdown" className="block p-2.5 w-full z-20 text-sm text-gray-900 bg-gray-50 rounded-e-lg border-s-gray-50 border-s-2 border border-gray-300 focus:ring-blue-500 focus:border-cyan-700 dark:bg-gray-700 dark:border-s-gray-700  dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:border-yellow-500" 
                   onChange={(e) => setQuery(e.target.value)}
                   placeholder="Search Keywords"  
                   required />
            <button type="submit" className="absolute top-0 end-0 p-2.5 text-sm font-medium h-full text-white bg-black rounded-e-lg border border-cyan-700 hover:bg-cyan-700 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                <svg className="w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
                </svg>
                <span className="sr-only">Search</span>
            </button>
        </div>
    </div>
    </form>
        <div className="grid grid-cols-2 gap-4 p-6 py-8 ">
          {getPaginatedData().map((dataObj) => (
            <div
              className="p-8 rounded-lg shadow-lg border-2 border-cyan-700 hover:shadow-xl hover:translate-y-[-10px] transition-all"
              key={dataObj.id}
            >
              <div className="text-xl font-semibold text-gray-700">
                <div className="category">@{dataObj.username}</div>
                <div className="heading">{dataObj.name}</div>
                <div className="author">{dataObj.email}</div>
                <div className="cursor-pointer" onClick={() => handleLikeClick(dataObj.id)}>
                  {likedUsers[dataObj.id] ? (
                    <FaIcons.FaHeart className="text-red-500 text-3xl transition-transform transform hover:scale-125" />
                  ) : (
                    <FaIcons.FaRegHeart className="text-gray-500 text-3xl transition-transform transform hover:scale-125" />
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="flex justify-between items-center py-4">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-4 py-2 text-white rounded-md bg-black hover:bg-cyan-700"
          >
            <FaIcons.FaArrowLeft/>
          </button>
          <div className="flex space-x-2">
            {renderPagination()}
          </div>
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-4 py-2 text-white rounded-md bg-black hover:bg-cyan-700"
          >
            <FaIcons.FaArrowRight/>
          </button>
        </div>
      </div>
      
  );
};

export default Search;
