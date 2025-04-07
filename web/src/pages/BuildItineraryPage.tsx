import React from 'react';
import Sidebar from '../components/Sidebar.tsx';
import BuildItinerary from '../components/BuildItinerary.tsx';

const BuildItineraryPage: React.FunctionComponent = () => {
  return (
    <>
      <Sidebar />
      <BuildItinerary />
    </>
  );
};

export default BuildItineraryPage;
