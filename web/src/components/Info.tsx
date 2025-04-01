import React from 'react';
import Bannerimage from "../assets/10.png";


type Data = {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
};


const sampleData: Data[] = [
  { id: 1, firstName: 'test', lastName: 'test', email: 'test123@gmail.com' },
];

const Info: React.FunctionComponent = () => {
  return (
    <div className="container py-14 max-w-5xl mx-auto bg-cover" style={{ backgroundImage: `url(${Bannerimage})`}}>
      <div className="space-y-4">
        {sampleData.map((row) => (
          <div key={row.id} className="py-20 p-8 rounded-lg shadow-lg border-2 border-cyan-700 hover:shadow-xl">
            <div className="text-xl text-gray-900 py-10">
              <strong>First Name:</strong> {row.firstName}
            </div>
            <div className="text-xl text-gray-900 py-10">
              <strong>Last Name:</strong> {row.lastName}
            </div>
            <div className="text-xl text-gray-900 py-10">
              <strong>Email:</strong> {row.email}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Info;
