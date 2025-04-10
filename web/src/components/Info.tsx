import React from 'react';
import ImageUpload from "./ImageUpload";
import * as FaIcons from 'react-icons/fa';

type Data = {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
};

const Info: React.FunctionComponent = () => {
  let user : Data = {
    id: -1,
    firstName: 'Error',
    lastName: 'Error',
    email: 'Error'
  };
  const data = localStorage.getItem('user_data');
  if (data != null) {
      user = JSON.parse(data);
  }
  return (
  <div className="container py-14 mt-10 max-w-3xl mx-auto bg-cyan-700 rounded-2xl shadow-lg flex flex-col items-center justify-center text-center">
    <p className="text-3xl font-bond text-white">MY PROFILE</p>
    <div key={user.id} className="w-full">
    <div className="flex justify-center items-center space-x-4 mb-8">
      <div className="flex justify-center">
      <ImageUpload />
      </div>
    </div>   
    <div className="text-xl text-white space-y-6 flex flex-col items-center">
      <div className="py-4 flex items-center space-x-2">
       <FaIcons.FaMailBulk />
        <strong>Email:</strong> <span>{user.email}</span>
      </div>
      <div className="py-4 flex items-center space-x-2">
        <FaIcons.FaUser />
        <strong>First Name:</strong> <span>{user.firstName}</span>
      </div>
      <div className="py-4 flex items-center space-x-2">
        <FaIcons.FaUser />
        <strong>Last Name:</strong> <span>{user.lastName}</span>
      </div>
</div>


    </div>
  </div>


  );
};

export default Info;
