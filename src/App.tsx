import './App.css'
import { BrowserRouter, Routes, Route} from 'react-router-dom';
import Homepage from './pages/Homepage.tsx';
import Loginpage from './pages/Loginpage.tsx';
import Signuppage from './pages/Signuppage.tsx';
import Searchpage from './pages/Searchpage';
import Infopage from './pages/Infopage';
import Analyticspage from './pages/Analyticspage';
import Logoutpage from './pages/Logoutpage';


const App = () =>
{
  return (
	  	<BrowserRouter>
		 
			<Routes>
			    <Route path="/"
				       element={<Homepage />}
					   >
				</Route>
				<Route path="/login"
				       element={<Loginpage />}
					   >
				</Route>
				<Route path="/signup"
				       element={<Signuppage />}
					   >
				</Route>
				<Route path="/search"
				       element={<Searchpage />}
					   >
				</Route>
				<Route path="/info"
				       element={<Infopage  />}
					   >
				</Route>
				<Route path="/analytics"
				       element={<Analyticspage />}
					   >
				</Route>
				<Route path="/logout"
				       element={<Logoutpage />}
					   >
				</Route>  
			</Routes>
		</BrowserRouter>
  );
}

export default App;
