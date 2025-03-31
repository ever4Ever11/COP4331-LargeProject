import React from 'react';

// Define the type for the data
type Data = {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
};

// Sample data
const sampleData: Data[] = [
  { id: 1, firstName: 'test', lastName: 'test', email: 'test123@gmail.com' },
];

const Info: React.FunctionComponent = () => {
  return (
    <div className="max-w-4xl mx-auto p-4">
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
