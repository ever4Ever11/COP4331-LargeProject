import Navbar from '../components/Navbar.tsx';
import Home1 from '../components/Home1.tsx';
import Home2 from '../components/Home2.tsx';
import Home3 from '../components/Home3.tsx';
import Home4 from '../components/Home4.tsx';
import Home5 from '../components/Home5.tsx';

const Homepage: React.FunctionComponent = () => 
{
	return (
		<>
		<Navbar/>
		<Home1 />  
		<Home2 /> 
		<Home3 /> 
		<Home4 /> 
		<Home5 /> 
		</>
	);
};

export default Homepage;