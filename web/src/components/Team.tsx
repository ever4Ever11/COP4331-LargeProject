import React from 'react';
import * as FaIcons from 'react-icons/fa';

type Data = {
    id: number;
    Name: string;
    role: string;
  };
  
  
const sampleData: Data[] = [
    { id: 1, Name: 'Santiago Rubio ', role:'Project Manager' },
    { id: 2, Name: 'Nickholas Singh ', role:'Backend' },
    { id: 3, Name: 'Yoan Molina ', role:'Backend' },
    { id: 4, Name: 'Aidan Isner ', role:'Frontend (Mobile)' },
    { id: 5, Name: 'Alejandro Roque ', role:'Frontend (Mobile)' },
    { id: 6, Name: 'Jiasi Yu ', role:'Frontend (Web)' },
  ];
  
const Team: React.FunctionComponent = () => {
    return (
      <div className="container py-14 mt-10 max-w-5xl mx-auto bg-cyan-700 rounded-xl">
        <div className="grid grid-cols-3 gap-6 justify-items-center rounded-lg bg-white">
          {sampleData.map((row) => (
          <div
            key={row.id}
            className="bg-gray-200 w-48 h-48 py-5 px-5 mt-5 mb-5 flex border-4 border-cyan-700 rounded-full items-center justify-center hover:shadow-xl"
            >
          <div className="text-xl text-gray-900 flex items-center space-x-2">
            <FaIcons.FaUserAlt />
            <strong>{row.Name}</strong>
          </div>
          <div className="text-gray-900">{row.role}</div>
          </div>
    ))}
        </div>
      </div>

    );
  };
  
export default Team;
  