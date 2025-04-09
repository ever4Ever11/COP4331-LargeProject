import React from "react";
import ReactMarkdown from 'react-markdown';
import { ItineraryProps } from "../types/Itinerary";
import Img from "../assets/backpacking.png";

const Itinerary: React.FunctionComponent<ItineraryProps> = ({created, parameters, content}) => {

  const formatedDate = new Date(created).toDateString();

  return (
    <>
    <div className="bg-cyan-700 flex items-center justify-between px-2 py-2">
    <div className="text-left">
      <p><span className="font-semibold text-white py-2">🗓️ Created:</span><span className="px-2 font-semibold text-white">{formatedDate}</span></p>
      <p><span className="font-semibold text-white py-2">🌆 Destination:</span ><span className="px-2 font-semibold text-white">{parameters.location}</span></p>
      <p><span className="font-semibold text-white py-2">⏳ Duration:</span><span className="px-2 font-semibold text-white">{parameters.duration}</span></p>
      <p><span className="font-semibold text-white py-2">💰 Budget:</span><span className="px-2 font-semibold text-white">{parameters.budget}</span></p>
      <p><span className="font-semibold text-white py-2">🤔 Interests:</span><span className="px-2 font-semibold text-white">{parameters.interests}</span></p>
      <p><span className="font-semibold text-white py-2">🏖️ Travel Style:</span><span className="px-2 font-semibold text-white">{parameters.travelStyle}</span></p>
    </div>
    <div>
      <img 
      src={Img}
      alt="Avatar"
      className="w-40 h-40 rounded-lg border-2 border-white" 
      />
    </div>
    </div>
    <div className="prose text-left mt-5">
    <ReactMarkdown components={{
          h3: ({ children }) => <h1 style={{ fontSize: '1.5rem', background: '#DBE9F4' }}>{children}</h1>,
          ul: ({ children }) => <ul style={{ margin: '10px', fontSize: '1rem', background: '#F5F5F5' }}>{children}</ul>,
        }}
    >
      {content}
    </ReactMarkdown>
    </div>
    </>
  );
};

export default Itinerary;