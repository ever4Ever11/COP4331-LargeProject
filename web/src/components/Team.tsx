import React from 'react';
import Bannerimage from "../assets/10.png";

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
      <div className="container py-14 max-w-5xl mx-auto bg-cover" style={{ backgroundImage: `url(${Bannerimage})`}}>
       <div className="grid grid-cols-3 gap-4"> 
          {sampleData.map((row) => (
            <div key={row.id} className="w-50 h-50 py-10 p-8 flex items-center justify-center hover:shadow-xl hover:border-4">
              <div className="p-8 text-xl text-gray-900">
                <strong>{row.Name}</strong> 
              </div>
              <div className="p-8 text-gray-900">
                {row.role} 
              </div>
            </div>
          ))}
        </div>
    </div>
    );
  };
  
export default Team;
  