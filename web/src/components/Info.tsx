import React from 'react';
import * as FaIcons from 'react-icons/fa';
import DefaultImage from "../assets/upload.png"
import Profile1 from "../assets/profile/profile1.webp"
import Profile2 from "../assets/profile/profile2.webp"
import Profile3 from "../assets/profile/profile3.webp"
import Profile4 from "../assets/profile/profile4.webp"
import Profile5 from "../assets/profile/profile5.webp"
import Profile6 from "../assets/profile/profile6.webp"
import Profile7 from "../assets/profile/profile7.webp"
import Profile8 from "../assets/profile/profile8.webp"
import Profile9 from "../assets/profile/profile9.webp"

type Data = {
  firstName: string;
  lastName: string;
  avatar: number;
};

const Info: React.FunctionComponent = () => {
  const [edit, setEdit] = React.useState(false);
  const [user, setUser] = React.useState<Data>({firstName:'Error',lastName:'Error',avatar:0});
  const [tempFirst, setTempFirst] = React.useState('Error');
  const [tempLast, setTempLast] = React.useState('Error');
  const [tempAvatar, setTempAvatar] = React.useState(0);

  React.useEffect(() => {
    const data1 = localStorage.getItem('persisted');
    const data2 = localStorage.getItem('user_data');
    if (data1 != null) {
      const user: Data = JSON.parse(data1);
      setUser(user);
      setTempFirst(user.firstName);
      setTempLast(user.lastName);
      setTempAvatar(user.avatar);
    } else if (data2 != null) {
      const user: Data = JSON.parse(data2);
      setUser(user);
      setTempFirst(user.firstName);
      setTempLast(user.lastName);
      setTempAvatar(user.avatar);
    }
  }, []);

  const saveUser = () => {
    const newUserData = { firstName: tempFirst, lastName: tempLast, avatar: tempAvatar };
    localStorage.setItem('persisted', JSON.stringify(newUserData));
    setUser(newUserData);
    setEdit(false);
  }

  let imageSrc = DefaultImage;
  switch (tempAvatar) {
      case 1: imageSrc = Profile1; break;
      case 2: imageSrc = Profile2; break;
      case 3: imageSrc = Profile3; break;
      case 4: imageSrc = Profile4; break;
      case 5: imageSrc = Profile5; break;
      case 6: imageSrc = Profile6; break;
      case 7: imageSrc = Profile7; break;
      case 8: imageSrc = Profile8; break;
      case 9: imageSrc = Profile9; break;
  }

  return (
  <div className="container py-14 mt-20 max-w-3xl mx-auto bg-cyan-700 rounded-xl">  
    <p className="text-3xl font-bond text-white">MY PROFILE</p>

    <div className="w-full">
    <form className="text-xl space-y-6 flex flex-col items-center">

      {/*Avatar*/}
      <div className="flex justify-center items-center space-x-4 mb-8">
      {edit &&
      /*Shift Left*/
      <button type="button"
              className="px-4 py-2 text-white rounded-md bg-black hover:text-yellow-500 hover:cursor-pointer"
              aria-label="AvatarLeft"
              onClick={() => {let newAvatar = tempAvatar - 1; if (newAvatar < 1) {newAvatar = 9;} setTempAvatar(newAvatar);}}>
        <FaIcons.FaArrowLeft/>
      </button>
      }
      <div className="flex justify-center">
      <img src={imageSrc}
           alt="Avatar"
           className="w-24 h-24 rounded-full border-2 border-black"/>
      </div>
      {edit &&
      /*Shift Right*/
      <button type="button"
              className="px-4 py-2 text-white rounded-md bg-black hover:text-yellow-500 hover:cursor-pointer"
              aria-label="AvatarRight"
              onClick={() => {let newAvatar = tempAvatar + 1; if (newAvatar > 9) {newAvatar = 1;} setTempAvatar(newAvatar);}}>
        <FaIcons.FaArrowRight/>
      </button>
      }
      </div>

      <label htmlFor="FirstName" className="text-white py-4 flex items-center space-x-2">
        <FaIcons.FaUser />
        <strong>First Name:</strong>
        <input className="text-center text-black font-bold w-32 bg-white" id="FirstName" type="text" value={tempFirst} disabled={!edit} onChange={(e) => {setTempFirst(e.target.value);}} />
      </label>
      <label htmlFor="LastName" className="text-white py-4 flex items-center space-x-2">
        <FaIcons.FaUser />
        <strong>Last Name:</strong>
        <input className="text-center text-black font-bold w-32 bg-white" id="FirstName" type="text" value={tempLast} disabled={!edit} onChange={(e) => {setTempLast(e.target.value);}} />
      </label>
      {edit ?
      <div className="flex gap-x-2">
        <button type="button" className="bg-black text-white w-10 h-8 flex items-center justify-center hover:text-yellow-500 focus:outline-none focus:ring-2 focus:ring-opacity-50" onClick={saveUser}><p className="text-center text-sm">Save</p></button>
        <button type="button" className="bg-black text-white w-10 h-8 flex items-center justify-center hover:text-yellow-500 focus:outline-none focus:ring-2 focus:ring-opacity-50" onClick={()=>{setEdit(false);setTempFirst(user.firstName);setTempLast(user.lastName);setTempAvatar(user.avatar);}}><p className="text-center text-sm">Cancel</p></button>
      </div>
      :
      <div>
        <button type="button" className="bg-black text-white w-10 h-8 flex items-center justify-center hover:text-yellow-500 focus:outline-none focus:ring-2 focus:ring-opacity-50" onClick={()=>{setEdit(true)}}><p className="text-center text-sm">Edit</p></button>
      </div>
      }
    </form>
    </div>
  </div>
  );
};

export default Info;
