import React, { useState, useRef } from 'react';
import DefaultImage from "../assets/upload.png";
import UploadingAnimation from "../assets/uploading.gif";
import * as FaIcons from 'react-icons/fa';
import { buildPath } from '../components/Path.tsx';

// TypeScript type for the component
const ImageUpload: React.FC = () => {
  const [avatarURL, setAvatarURL] = useState<string>(DefaultImage);

  // Typing for fileUploadRef as a reference to an HTMLInputElement
  const fileUploadRef = useRef<HTMLInputElement | null>(null);

  // Handle the image upload button click
  const handleImageUpload = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    if (fileUploadRef.current) {
      fileUploadRef.current.click();
    }
  };

  // Handle the file change (upload image)
  const uploadImageDisplay = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      if (event.target.files) {
        setAvatarURL(UploadingAnimation);
        const uploadedFile = event.target.files[0];
        const formData = new FormData();

        formData.append("file", uploadedFile);

        const response = await fetch(buildPath('api/upload_profile_picture'), {
          method: "POST",
          body: formData
        });

        if (response.status === 201) {
          const data = await response.json();
          setAvatarURL(data?.location);  // Set the uploaded image URL
        }
      }
    } catch (error) {
      console.error(error);
      setAvatarURL(DefaultImage);  // Fallback to default image in case of error
    }
  };

  return (
    <div className="text-xl text-gray-900 py-10 flex items-center space-x-4">
      <img 
        src={avatarURL}
        alt="Avatar"
        className="w-24 h-24 rounded-full border-2 border-black" /> 

      <form id="form" encType="multipart/form-data" className="flex items-center">
        <button
          type="submit"
          aria-label="uploadImage"
          onClick={handleImageUpload}
          className="bg-cyan-700 rounded-full text-white border-none hover:text-yellow-500 p-1">
          <FaIcons.FaCloudUploadAlt/>
        </button>
      <input 
          type="file"
          id="file"
          ref={fileUploadRef}
          onChange={uploadImageDisplay}
          hidden />
      </form>  
    </div>


  );
}

export default ImageUpload;
