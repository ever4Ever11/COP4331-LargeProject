import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import Search from '../components/Search.tsx';

const Searchpage: React.FC = () => {
  const [users, setUsers] = useState<any[]>([]); // This will store the users data
  //const [totalUsers, setTotalUsers] = useState(0); // Total users for pagination
  const [_, setCurrentPage] = useState(1);

  const itemsPerPage = 8;

  useEffect(() => {
    fetch("https://jsonplaceholder.typicode.com/users")
      .then((res) => res.json())
      .then((data) => {
        setUsers(data);
        //setTotalUsers(data.length); // Calculate total number of items for pagination
      });
  }, []);

  const onPageChange = (page: number) => {
    setCurrentPage(page);  // Update the page when pagination is changed
  };

  return (
    <div>
    <Sidebar />
      {/* Use the Search component and pass the props */}
      <Search
        totalItems={users.length} // Total number of users for pagination
        itemsPerPage={itemsPerPage} // Number of items per page
        onPageChange={onPageChange} // Callback to handle page changes
      />
    </div>
  );
};

export default Searchpage;
