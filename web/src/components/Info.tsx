import React from 'react';
import Bannerimage from "../assets/10.png";

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
    <div className="container py-14 max-w-5xl mx-auto bg-cover" style={{ backgroundImage: `url(${Bannerimage})`}}>
      <div className="space-y-4">
          <div key={user.id} className="py-20 p-8 rounded-lg shadow-lg border-2 border-cyan-700 hover:shadow-xl">
            <div className="text-xl text-gray-900 py-10">
              <strong>Email:</strong> {user.email}
            </div>
            <div className="text-xl text-gray-900 py-10">
              <strong>First Name:</strong> {user.firstName}
            </div>
            <div className="text-xl text-gray-900 py-10">
              <strong>Last Name:</strong> {user.lastName}
            </div>
          </div>
      </div>
    </div>
  );
};

export default Info;
