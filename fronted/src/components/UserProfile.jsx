import React, { useState, useEffect, useId } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AiOutlineLogout } from 'react-icons/ai';
import { googleLogout } from '@react-oauth/google';

import { userCreatedPinsQuery, userQuery, userSavedPinsQuery } from '../utils/data';
import { client } from '../client';
import MasonryLayout from './MasonryLayout';
import Spinner from './Spinner';

const randomImage = 'https://source.unsplash.com/1600x900/?nature,photography,techology';


const activeBtnStyle = 'bg-green-500 text-white font-bold p-2 rounded-md w-20 outline-none';
const notActiveBtnStyle = 'bg-primary mr-4 text-black font-bold p-2 rounded-md w-20 outline-none';

function UserProfile() {
    const [user, setUser] = useState(null);
    const [pins, setPins] = useState(null);
	const [text, setText] = useState('Created');
	const [activeBtn, setActiveBtn] = useState('created');
	const navigate = useNavigate();
	const {userId} = useParams();

	useEffect(() => {
		const query = userQuery(userId);

		client.fetch(query)
		.then((data) => {
			setUser(data[0]);
		}, [userId]);
	});

    useEffect(() => {
        if(text === 'Created'){
            const createdPinsQuery = userCreatedPinsQuery(userId);

            client.fetch(createdPinsQuery).then((data) => {
                setPins(data);
            });
        } else {
            const savedPinsQuery = userSavedPinsQuery(useId);
            
            client.fetch(savedPinsQuery).then((data) => {
                setPins(data);
            });
        }
    }, [text, userId]);

    const logout = () => {
        console.log('logout is clicked!');
        localStorage.clear();
        googleLogout();
        navigate('/login');

    }

	if(!user) {return <Spinner message="Loading profile..."/>};

	return (
		<div className='relative pb-2 h-full justify-center items-center'>
            <div className="flex flex-col pb-5">
                <div className="relative flex flex-col mb-7">
                    <div className="flex flex-col justify-center items-center">
                        <img src={randomImage} alt="user-picture" className="w-full h-370 2xl:h-510 shadow-lg object-cover" />
                        <img src={user.image} alt="user-profile" className="rounded-full w-20 h-20 xl:w-32 xl:h-32 xl:-mt-16 -mt-10 shadow-xl object-cover" />
                    </div>
                    <h1 className="font-bold text-3xl text-center mt-3">{user.userName}</h1>
                    <div className="absolute top-0 z-1 right-0 p-2">
                        {userId === user?.sud && (
                            <button type='button'
                                    className='bg-mainColor flex justify-center items-center p-3 rounded-md shadow-lg cursor-pointer outline-none'
                                    onClick={() => logout()}
                                >
                                    <AiOutlineLogout className='mr-2' /> Logout
                            </button>
                        )}
						
                    </div>
                </div>
                <div className="text-center mb-7">
                    <button 
                        className={`${activeBtn === 'created' ? activeBtnStyle : notActiveBtnStyle}`}
                        type="button"
                        onClick={(e) => {
                            setText(e.target.textContent);
                            setActiveBtn('saved');
                        }}
                    >
                        Created
                    </button>
                    <button 
                        className={`${activeBtn === 'saved' ? activeBtnStyle : notActiveBtnStyle}`}
                        type="button"
                        onClick={(e) => {
                            setText(e.target.textContent);
                            setActiveBtn('saved');
                        }}
                    >
                        Saved
                    </button>
                </div>

                <div className="px-2">
                    <MasonryLayout pins={pins} />
                </div>
                {pins?.length === 0 && (
                    <div className="flex justify-center font-bold items-center w-full text-1xl mt-2">
                        No Pin Found!
                    </div>
                )}
            </div>
        </div>
	);
};

export default UserProfile;