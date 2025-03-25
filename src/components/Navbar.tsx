import { Link } from 'react-router-dom';
import Logo from "../assets/logo.png";

const Navbar = () => {
  return ( 
    <div className="px-20 flex justify-between items-center"> 
    <div><img src={Logo} alt="" className="w-[100px]" />
	<p className='text-cyan-700 font-semibold italic'>wayfinder</p>
	</div>
	<div className="text-lg text-cyan-700 hover:text-xl hover:text-cyan-700 hover:underline">About Us</div>
    <div><Link to="/" className="text-lg text-cyan-700 hover:text-xl hover:text-cyan-700 hover:underline">Home</Link></div>
    <div><Link to="/login" className="px-4 py-2 bg-cyan-700 text-white rounded-lg hover:text-yellow-500">Log In </Link></div>
    <div><Link to="/signup" className="px-4 py-2 bg-cyan-700 text-white rounded-lg hover:text-yellow-500">Sign Up</Link></div>	
    </div>
  );
};
export default Navbar ;