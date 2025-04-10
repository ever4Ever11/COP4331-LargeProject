import React from 'react';
import ImageUpload from "./ImageUpload";
import * as FaIcons from 'react-icons/fa';

type Data = {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
};

const Info: React.FunctionComponent = () => {
  const [edit, setEdit] = React.useState(false);
  const [user, setUser] = React.useState<Data>({id:-1,email:'Error',firstName:'Error',lastName:'Error'});
  const [tempFirst, setTempFirst] = React.useState('Error');
  const [tempLast, setTempLast] = React.useState('Error');

  React.useEffect(() => {
    const data = localStorage.getItem('user_data');
    if (data != null) {
      let user: Data = JSON.parse(data);
      setUser(user);
      setTempFirst(user.firstName);
      setTempLast(user.lastName);
    }
  }, []);

  const saveUser = () => {
    const newUserData = {...user};
    newUserData.firstName = tempFirst;
    newUserData.lastName = tempLast;
    localStorage.setItem('user_data', JSON.stringify(newUserData));
    setUser(newUserData);
    setEdit(false);
  }

  return (
  <div className="container py-14 mt-20 max-w-3xl mx-auto bg-cyan-700 rounded-xl">  
    <p className="text-3xl font-bond text-white">MY PROFILE</p>

    <div key={user.id} className="w-full">
    <div className="flex justify-center items-center space-x-4 mb-8">
      <div className="flex justify-center">
      <ImageUpload />
      </div>
    </div>

    <form className="text-xl space-y-6 flex flex-col items-center">
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
        <button type="button" className="bg-black text-white w-10 h-8 flex items-center justify-center hover:text-yellow-500 focus:outline-none focus:ring-2 focus:ring-opacity-50" onClick={()=>{setEdit(false);setTempFirst(user.firstName);setTempLast(user.lastName);}}><p className="text-center text-sm">Cancel</p></button>
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
