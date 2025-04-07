import React from "react";
import ReactMarkdown from 'react-markdown';
import { ItineraryProps } from "../types/Itinerary";

const Itinerary: React.FunctionComponent<ItineraryProps> = ({created, parameters, content}) => {

  const formatedDate = new Date(created).toDateString();

  return (
    <>
      <p><span>Created:</span><span>{formatedDate}</span></p>
      <p><span>Destination:</span><span>{parameters.location}</span></p>
      <p><span>Duration:</span><span>{parameters.duration}</span></p>
      <p><span>Budget:</span><span>{parameters.budget}</span></p>
      <p><span>Interests:</span><span>{parameters.interests}</span></p>
      <p><span>Travel Style:</span><span>{parameters.travelStyle}</span></p>
      <ReactMarkdown>{content}</ReactMarkdown>
    </>
  );
};

export default Itinerary;