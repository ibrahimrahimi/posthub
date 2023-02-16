import React, { useState, useEffect} from 'react';
import { MdDownloadForOffline } from 'react-icons/md';
import { Link, useParams } from 'react-router-dom';
import { v4, uuidv4 } from 'uuid';

import { client, urlFor } from '../client';
import MasonaryLayout from './MasonryLayout';
import { pinDetailMorePinQuery, pinDetailQuery } from '../utils/data';
import Spinner from './Spinner';


const PinDetail = ({ pin }) => {
    const { pinId } = useParams();
    const [pins, setPins] = useState();
    const [pinDetail, setPinDetail] = useState();
    const [comment, setComment] = useState();
    const [addingComment, setAddingComment] = useState();

    const fetchPinDetails = () => {
         const query = pinDetailQuery(pinId);

         if(query) {
            client.fetch(`${query}`).then((data) => {
                setPinDetail(data[0]);
                console.log(data);

                if(data[0]) {
                    const query1 = pinDetailMorePinQuery(data[0]);
                    client.fetch(query1).then((res) => {
                        setPins(res);
                    })
                }
            });
         }
    };

    useEffect(() => {
        fetchPinDetails();
    }, [pinId]);

    if(!pinDetail) {
        return(
            <Spinner message="Showing pin" />
        )
    }

  return (
    <div className='flex flex-col xl:flex-row m-auto bg-white' style={{maxWidth: '1500px', borderRaius: '32px' }}>
        <div className="flex justify-center items-center md:items-start flex-initial">
            <img 
                src={(pinDetail?.image && urlFor(pinDetail.image).url())} 
                alt="user-post" 
                className="rounded-t-3xl rounded-b-lg" 
            />
        </div>
        <div className="w-full p-5 flex-1 xl:min-w-620">
            <div className="flex items-center justify-between">
                <div className="flex gap-2 items-center">
                    <a 
                        download 
                        href={`${pinDetail.image.asset.url}?dl=`}
                        onClick={(e) => e.stopPropagation()}
                        className="bg-gray-100 w-9 h-9 p-2 rounded-full flex items-center justify-center text-dark text-xl opacity-75 hover:opacity-100 hover:shadow-md outline-none"
                    >
                        <MdDownloadForOffline />
                    </a>
                </div>
                <a href={pinDetail.destination} target="_blank" rel='noreferrer'>
                    {pinDetail.destination.slice(8)}
                </a>
            </div>
            <div>
                <h1 className="text-4xl font-bold break-words mt-3">
                    {pinDetail.title}
                </h1>
                <p className="mt-3">{pinDetail.about}</p>
            </div>
            <Link
                alt="user-profile" 
                to={`/user-profile/${pinDetail?.postedBy?._id}`} 
                className="flex gap-2 mt-5 items-center bg-white rounded-lg"
            >
                <img 
                    alt="user-profile" 
                    src={pinDetail?.postedBy?.image} 
                    className='w-8 h-8 rounded-full object-cover'
                />
                <p className="font-semibold capitalize">{pinDetail?.postedBy?.userName}</p>
            </Link>
            <h2 className="mt-5 text-2xl">Comments</h2>
            <div className="max-h-370 overflow-y-auto">
                {pinDetail?.comments?.map((comment) => (
                    <div className="flex gap-2 mt-5 items-center bg-white rounded-lg" key={comment.comment}>
                        <img 
                            src={comment.postedBy?.image} 
                            alt="user-profile" 
                            className="w-10 h-10 rounded-full cursor-pointer" 
                        />
                        <div className="flex flex-col">
                            <p className="font-bold">{comment.postedBy?.userName}</p>
                            <p>{comment.comment}</p>
                        </div>
                    </div>
                ))}
            </div>
            <input 
                type="text"
                placeholder='Add a comment' 
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="flex-1 outline-none rounded-full cursor-pointer" 
            />
        </div>
    </div>
  )
};

export default PinDetail;