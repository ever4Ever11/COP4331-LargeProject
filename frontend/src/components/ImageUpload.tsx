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
    <div className="float-right h-18 w-18 m-6">
  <img 
    src={avatarURL}
    alt="Avatar"
    className="w-20 h-20 rounded-full border-2 border-black" /> 

  <form id="form" encType="multipart/form-data">
    <button
      type="submit"
      onClick={handleImageUpload}
      className="bg-white absolute right-14 top-20 rounded-full border-none">
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
