import React, { useState } from 'react';
import { AiOutlineCloudUpload } from 'react-icons/ai';
import { MdDelete } from 'react-icons/md';
import { useNavigate } from 'react-router-dom'; 

import { client } from '../client';
import Spinner from './Spinner';
import { categories } from '../utils/data';

function CreatePin({ user }) {
    const [title, setTitle] = useState('');
    const [about, setAbout] = useState('');
    const [destination, setDestination] = useState('');
    const [loading, setLoadning] = useState(false);
    const [fieds, setFields] = useState(false);
    const [category, setCategory] = useState(null);
    const [imageAsset, setImageAsset] = useState(null);
    const [wrongImageType, setWrongImageType] = useState(null);

    const navigate = useNavigate();

    const uploadImage = (e) => {
        const { type, name } = e.target.files[0];

        if(type === 'image/png' || type === 'image/svg' || type === 'image/jpeg' || type === 'image/gif' || type === 'tiff'){
            setWrongImageType(false);
            setLoadning(true);

            client.assets
                .upload('image', e.target.files[0], { contentType: type, filename: name})
                .then((document) => {
                    setImageAsset(document);
                    setLoadning(false);
                })
                .catch((error) => {
                    console.log("Image upload error", error)
                })
        } else {
            setWrongImageType(false);
        }
    };

    const savePin = () => {
        if(title && about && destination && imageAsset?._id && category) {
            const doc = {
                _type: 'pin',
                title,
                about,
                destination,
                image: {
                    _type: 'image',
                    asset: {
                        _type: 'reference',
                        _ref: imageAsset?._id,
                    },
                },
                userId: user._id,
                postedBy: {
                    _type: 'postedBy',
                    _ref: user._id,
                },
                category,
            };
            client.create(doc).then(() => {
                navigate('/');
            });
        } else {
            setFields(true);
            
            setTimeout(() => {
                setFields(false);
            }, 2000,);
        }
    };
    
  return (
    <div className='flex flex-col justify-center items-center mt-5 lg:h-4/5'>
        {fieds && (
            <p className='text-red-500 mb-5 text-xl transition-all duration-150 ease-in'>Please fill in all the fields.</p>
        )}
        <div className="flex flex-col lg:flex-row justify-center items-center p-3 lg:p-3 bg-white w-full lg:w-4/5 rounded-md">
            <div className="bg-secondaryColor p-3 flex flex-0.7 w-full rounded-md">
                <div className="flex flex-col justify-center items-center border-dotted border-2 border-gray-300 p-3 w-full h-420">
                    {loading && <Spinner />}
                    {wrongImageType && <p>Wrong image type</p>}
                    {!imageAsset ? (
                        <label>
                            <div className="flex flex-col items-center h-full">
                                <div className="flex flex-col justify-center items-center">
                                    <p className="font-bold text-2xl">
                                        <AiOutlineCloudUpload />
                                    </p>
                                    <p className="text-lg">Click to upload</p>
                                </div> 
                                <p className="mt-28 text-gray-400">
                                    Use high-quality JPG, SVG, PNG, GIF or TIFE less than 20 MB.
                                </p>
                            </div>
                            <input type="file" className="w-0 h-0" name='upload-image' onChange={uploadImage}/>
                        </label>
                    ) : (
                        <div className="relative h-full">
                            <img src={imageAsset?.url} alt="uploaded picture" className="w-ful h-full" />
                            <button 
                                type='button'
                                onClick={() => setImageAsset(null)} 
                                className="absolute bottom-3 right-3 p-3 rounded-full bg-white text-xl cursor-pointer outline-none hover:shadow-md transition-all duration-500 ease-in-out"
                            >
                                <MdDelete />
                            </button>
                        </div>
                    )}
                </div>
            </div>
            <div className="flex flex-1 flex-col gap-6 lg:pl-5 mt-5 w-full">
                <input 
                    type="text" 
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Add your title here"
                    className="outline-none text-2xl sm:text-3xlfont-bold border-gray-200 border-b-2 p-2" 
                />
                {user && (
                    <div className="flex gap-2 mt-2 mb-2 bg-white rounded-lg items-center">
                        <img src={user.image} alt="user-profile" className="w-10 h-10 rounded-full" />
                        <p className="font-bold">{user.userName}</p>
                    </div>
                )}
                <input 
                    type="text" 
                    value={about}
                    onChange={(e) => setAbout(e.target.value)}
                    placeholder="What is your pin about"
                    className="outline-none text-2xl sm:text-3xlfont-bold border-gray-200 border-b-2 p-2" 
                />
                <input 
                    type="text" 
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    placeholder="Add your destination link"
                    className="outline-none text-2xl sm:text-3xlfont-bold border-gray-200 border-b-2 p-2" 
                />

                <div className="flex flex-col">
                    <div>
                        <p className="mb-2 font-semibold text-lg sm:text-xl">Choose Pin Category</p>
                        <select
                            onChange={(e) => {setCategory(e.target.value)}} 
                            className="outline-none w-full text-base border-b-2 border-gray-200 p-2 rounded cursor-pointer">
                            <option value="others" className="sm:text-md bg-white text-gray-700 border-0">Select Category</option>
                            {categories.map((category) => (
                                <option
                                    key={category.id}
                                    value={category.name}
                                    className='text-base outline-none capitalize bg-white text-gray-700 border-0'>
                                    {category.name}
                                </option>
                            ))}
                        </select>                    
                    </div>
                    <div className="flex justify-end items-end mt-5">
                        <button
                            type='button'
                            onClick={savePin} 
                            className="bg-green-500 text-white font-bold p-2 rounded-sm w-28 outline-none">
                            Save Pin
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
  )
};

export default CreatePin;