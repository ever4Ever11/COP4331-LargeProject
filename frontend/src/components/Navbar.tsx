import { Link } from 'react-router-dom';
import Logo from "../assets/logo.png";

const Navbar = () => {
  return ( 
    <div className="px-20 flex justify-between items-center border-b-4 border-cyan-700"> 
    <div><img src={Logo} alt="" className="w-[100px]" />
	<p className='text-cyan-700 font-semibold italic'>wayfinder</p>
	</div>
	<div className="text-lg text-cyan-700 hover:text-xl hover:text-cyan-700 hover:underline">About us</div>
    <div><Link to="/" className="text-lg text-cyan-700 hover:text-xl hover:text-cyan-700 hover:underline">Home</Link></div>
    <div><Link to="/login" className="px-4 py-2 bg-cyan-700 text-white rounded-lg hover:text-yellow-500">Login </Link></div>
    <div><Link to="/signup" className="px-4 py-2 bg-cyan-700 text-white rounded-lg hover:text-yellow-500">Signup</Link></div>	
    </div>
  );
};
export default Navbar ;