import React from 'react';
import BackgroundImage from "../assets/6.png";
import { motion } from "framer-motion";
import { buildPath } from '../components/Path.tsx';
import { jwtDecode } from 'jwt-decode';




const Login: React.FunctionComponent = () => {
	const [loginName, setLoginName] = React.useState('');
	const [loginPassword, setPassword] = React.useState('');
	function handleSetLoginName(e: any): void {
		setLoginName(e.target.value);
	}
	function handleSetPassword(e: any): void {
		setPassword(e.target.value);
	}
	interface DecodedToken {
		id: number;
		firstName: string;
		lastName: string;
		// Add other fields from your JWT here if needed
	  }
	  
	async function doLogin(event: any): Promise<void> {
		event.preventDefault();
		var obj = { login: loginName, password: loginPassword };
		var js = JSON.stringify(obj);
		try {
			const response = await fetch(buildPath('api/login'),
				{
					method: 'POST',
					body: js,
					headers: {
						'Content-Type': 'application/json'
					}
				}
			);
			var res = JSON.parse(await response.text());
			console.log("Login response:", res);
			const { accessToken } = res;
			const decoded = jwtDecode<DecodedToken>(accessToken);
			console.log("Decoded JWT:", decoded);


			if (res.id <= 0) {
				alert('User/Password combination incorrect');
			}
			else {
				const user = {
					ud: decoded,
					firstName: decoded?.firstName ?? res?.firstName ?? '',
					lastName: decoded?.lastName ?? res?.lastName ?? '',
					id: decoded?.id ?? res?.id
				};
				
				
				localStorage.setItem('user_data', JSON.stringify(user));
				window.location.href = '/search';
			}
		}
		catch (error: any) {
			alert(error.toString());
			return;
		}
	};
	return (
		<div className="loginDiv grid grid-cols-1 md:grid-cols-2 md:min-h-[500px]">
			<div className="space-y-8 flex flex-col justify-center items-center text-center md:text-left py-20 px-10 md:pr-20 md:py-30 md:px-40 md:items-start">
				<form >
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
					<div className="mb-4">
						<label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="Password">
							Password
						</label>
						<input
							type="password"
							id="loginPassword"
							placeholder="Password"
							onChange={handleSetPassword}
							className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-700"
							required
						/>
					</div>
					<button onClick={doLogin}
						type="submit"
						className="w-full bg-cyan-700 text-white py-2 px-4 rounded-lg hover:bg-cyan-700 hover:text-yellow-500 focus:outline-none focus:ring-2 focus:ring-cyan-700 focus:ring-opacity-50"
					>
						Login
					</button>
				</form>
				<p className="text-sl mb-5 text-center text-gray-800">
					not have an account yet? <a className="hover:text-cyan-700 hover:underline hover:decoration-cyan-700" href="/signup">→Signup</a>
				</p>

			</div>
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
					className="w-[90%] md:w-[600px] xl:w-[650px]"
				/>
			</div>
		</div>

	);
};

export default Login;
