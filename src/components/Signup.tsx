import React, { useState } from 'react';
import BackgroundImage from "../assets/7.png";
import { motion } from "framer-motion";
import * as FaIcons from 'react-icons/fa';
import { buildPath } from '../components/Path.tsx';


const Signup:React.FunctionComponent = ()=>
{
    const [firstName, setFirstName] = React.useState('');
    const [lastName, setLastName] = React.useState('');
    const [loginName, setLoginName] = React.useState('');
    const [loginPassword, setPassword] = React.useState('');
		const [inputType, setInputType] = useState<'password' | 'text'>('password');
		const [icon, setIcon] = useState(<FaIcons.FaEyeSlash />);

    function handleSetFirstName(e:any) : void {
      setFirstName(e.target.value);
    }

    function handleSetLastName(e:any) : void {
      setLastName(e.target.value);
    }

    function handleSetLoginName(e:any) : void {
      setLoginName(e.target.value);
    }

    function handleSetPassword(e:any) : void {
      setPassword(e.target.value);
    }
		function handleToggle ():void {
			if (inputType === 'password') {
			  setIcon(<FaIcons.FaEye />);
			  setInputType('text');
			} else {
			  setIcon(<FaIcons.FaEyeSlash />);
			  setInputType('password');
			}
		  };
        async function doSignup(event:any) : Promise<void> {
                event.preventDefault();
                var obj = {login: loginName, password: loginPassword, firstName: firstName, lastName: lastName};
                var js = JSON.stringify(obj);
                try {
                        const response = await fetch(buildPath('api/register'),
                                {
                                        method: 'POST',
                                        body: js,
                                        headers: {
                                                'Content-Type': 'application/json'
                                        }
                                }
                        );
                        var res = JSON.parse(await response.text());
                        if (res.error != "") {
                                alert('Register User/Password unsuccessful');
                        }
                        else {
                                alert('Register User/Password successful');
                        }
                }
                catch(error:any)
                {
                        alert(error.toString());
                        return;
                }
        }
       return (
       	<div className="signupDiv grid grid-cols-1 md:grid-cols-2 md:min-h-[500px]">
        	<div className="flex justify-center items-center">
          <motion.img
            initial={{
              opacity: 0,
              x: 100,
            }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            src={BackgroundImage}
            alt=""
            className="w-[90%] md:w-[550px] xl:w-[600px] md:!scale-110"
          />
        </div>
        	<div className="space-y-8 flex flex-col justify-center items-center text-center md:text-left py-20 px-10 md:pr-20 md:py-30 md:px-40 md:items-start">
          	<form >
            <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="FirstName">
            First Name
            </label>
                <input
                type="text"
                id="firstName"
                placeholder="FirstName"
                onChange={handleSetFirstName}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-700"
                required
                  />
                </div>
                <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="LastName">
                Last Name
               </label>
                <input
                type="text"
                id="lastName"
                onChange={handleSetLastName}
                placeholder="LastName"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-700"
                required
                  />
                </div>
                <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="Email">
                Email
                </label>
                <input
                type="text"
                id="loginName"
                placeholder="Email"
                onChange={handleSetLoginName}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-700"
                required
                  />
                </div>
                <div className="mb-4 relative">
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="Password">
                Password
                  </label>
                  <input
                type={inputType} 
                id="loginPassword"
                placeholder="Password"
                onChange={handleSetPassword}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-700"
                autoComplete="current-password"
                required
                  />
				  <span
                	className="absolute right-4 top-1/2 transform -translate-y-1/2 cursor-pointer"
              		style={{ top: '70%' }}
              		onClick={handleToggle}
            	>
              		{icon}
            		</span>
                </div>
                <div className="mb-4">
                <input
                type="checkbox"
                id="Checkbox"
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-700"
                required
                  />
               <label className="px-3 py-2 text-gray-700 text-sm font-bold mb-2" htmlFor="Checkbox">
                I agree to the terms and <br/>
                conditions as set out by the <br/>
                user agreement.
                </label>
                </div>
                <button onClick={doSignup}
                  type="submit"
                  className="w-full bg-cyan-700 text-white py-2 px-4 rounded-lg hover:bg-cyan-700 hover:text-yellow-500 focus:outline-none focus:ring-2 focus:ring-cyan-700 focus:ring-opacity-50"
                >
                Sign up with Email
                </button>
          	</form>
         	   <p className="text-sl mb-5 text-center text-gray-800">
            	already had an account? <a className="hover:text-cyan-700 hover:underline hover:decoration-cyan-7000" href="/login">→Login</a>
          	   </p>
        	</div>
      	</div>
    	);
};

export default Signup;
