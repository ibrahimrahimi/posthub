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
    <div className='flex flex-col xl:flex-col m-auto bg-white' style={{maxWidth: '1500px', borderRaius: '32px' }}>
        <div className="flex justify-center items-center md:items-start flex-initial">
            <img src={(pinDetail?.image && urlFor(pinDetail.image).url())} alt="user-post" className="rounded-3xl rounded-b-lg" />
        </div>
        <div className="w-full p-5 flex-1-xl:min-w-620">
            <div className="flex items-center justify-between">
                <div className="flex gap-2 items-center">
                    <a 
                        href={`${pinDetail.image.asset.url}?dl=`}
                        download 
                        className="bg-secondaryColor p-2 text-xl flex items-center justify-center text-dark opacity-75 hover:opacity-100">
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
            </div>
        </div>
    </div>
  )
};

export default PinDetail;