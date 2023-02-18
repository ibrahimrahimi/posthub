import React from 'react';
import {GoogleLogin, useGoogleLogin} from '@react-oauth/google';
import { googleLogout } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom';
import { FcGoogle, FcNavigate } from 'react-icons/fc';
import shareVideo from '../assets/share.mp4';
import logo from '../assets/logowhite.png';
import axios from 'axios';

import {client} from '../client';


const Login = () => {
	const navigate = useNavigate();
	const login = useGoogleLogin({
		onSuccess: async respone => {
			try {
					const data = await axios.get('https://www.googleapis.com/oauth2/v3/userinfo', {
					headers: {
						'Authorization': `Bearer ${respone.access_token}`
					}
				})
				localStorage.setItem('user', JSON.stringify(data.data));
				const { name, sub, picture } = data.data;
				const userDetails = {
					_id: sub,
					_type: 'user',
					userName: name,
					image: picture,
				}
				client.createIfNotExists(userDetails).then(() => {
					navigate('/', {replace: true});
				})
			} catch(error) {
				console.log(error);
			}
			  
		}
	});

	return (
		<div className="flex justify-start items-center flex-col h-screen">
			<div className="relative w-full h-full">
				<video
					src={shareVideo}
					type="video/mp4"
					loop
					controls={false}
					muted
					autoPlay
					className="w-full h-full object-cover"
				/>
				<div className='absolute flex flex-col justify-center items-center top-0 right-0 left-0 bottom-0 bg-blackOverlay'>
					<div className='p-5'>
						<img src={logo} width="130px" alt="logo" />
					</div>
					<div className='shadow-2xl'>
						<button type='button'
								className='bg-mainColor flex justify-center items-center p-3 rounded cursor-pointer outline-none'
								onClick={() => login()}
								// disabled={renderProps.disabled}
							>
								<FcGoogle className='mr-2' /> Sign in with Google
						</button>
						
					</div>
				</div>
			</div>
		</div>
	)
}

export default Login