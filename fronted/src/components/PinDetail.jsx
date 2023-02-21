import React, { useState, useEffect} from 'react';
import { MdDownloadForOffline } from 'react-icons/md';
import { FaRegCommentDots } from 'react-icons/fa';
import { CiShare1 } from 'react-icons/ci';
import { SlLike } from 'react-icons/sl';
import { Link, useParams } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';

import { client, urlFor } from '../client';
import MasonaryLayout from './MasonryLayout';
import { pinDetailMorePinQuery, pinDetailQuery } from '../utils/data';
import Spinner from './Spinner';


const PinDetail = ({ user }) => {
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

                if(data[0]) {
                    const query1 = pinDetailMorePinQuery(data[0]);
                    client.fetch(query1).then((res) => {
                        setPins(res);
                    });
                }
            });
         }
    };

    useEffect(() => {
        fetchPinDetails();
    }, [pinId]);

    if(!pinDetail) {
        return(<Spinner message="Showing pin" />);
    };

    const addComment = () => {
        if(comment){
            setAddingComment(true);

            client
                .patch(pinId)
                .setIfMissing({ comments: []})
                .insert('after', 'comments[-1]', [{
                    comment,
                    _key: uuidv4(),
                    postedBy: {
                        _type: 'postedBy',
                        _ref: user._id
                    }
                }])
                .commit()
                .then(() => {
                    fetchPinDetails();
                    setComment('');
                    setAddingComment(false);
                    window.location.reload();
                });
        }
    };

	const handleSubmit = (e) => {
		e.preventDefault();
		addComment();
	};

	return (
		<>
			{pinDetail && (

			<div className='flex flex-col m-auto xl:flex-row bg-white rounded-md shadow-lg' style={{maxWidth: '1500px', borderRaius: '32px' }}>
				<div className="flex justify-center items-center md:items-start flex-initia border-b-2 shadow-lg border-gray-100 xl:border-r-2 xl:border-b-0 xl:pr-2">
					<img 
						src={(pinDetail?.image && urlFor(pinDetail.image).url())} 
						alt="user-post" 
						className="rounded-t-lg rounded-b-lg" 
					/>
				</div>
				<div className="w-full p-5 flex-1 xl:min-w-620">
					<div className="flex items-center justify-between">
						<div className="flex gap-2 items-center">
							<a 
								download 
								href={`${pinDetail.image.asset.url}?dl=`}
								onClick={(e) => e.stopPropagation()}
								className="bg-gray-100 w-10 h-10 p-2 rounded-full flex items-center justify-center text-dark text-xl opacity-75 hover:opacity-100 hover:shadow-md outline-none"
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
						<img alt="user-profile"src={pinDetail?.postedBy?.image} className='w-10 h-10 rounded-md object-cover' />
						<p className="font-semibold capitalize">{pinDetail?.postedBy?.userName}</p>
					</Link>
					<div className="flex flex-row mt-5 text-2xl justify-between border-t border-b border-t-gray-200 border-b-gray-200 py-4 px-8">
                        <a href="" className='flex gap-2'>
                            <SlLike className='pt-1' size={28}/>
                            Like
                        </a>
                        <a href="" className='flex gap-2'>
                            <FaRegCommentDots className='pt-1' size={28}/>
                            Comments
                        </a>
                        <a href="" className='flex gap-2'>
                            <CiShare1 className='pt-1' size={28}/>
                            Share
                        </a>
                    </div>
					<div className="max-h-370 overflow-y-auto">
						{pinDetail?.comments?.map((comment) => (
							<div className="flex gap-2 mt-2 justify-start rounded-lg" key={comment?._key}>
								<img 
									src={comment.postedBy?.image} 
									alt="user-profile" 
									className="w-10 h-10 rounded-full cursor-pointer " 
								/>
								<div className="flex flex-col p-4 rounded-2xl bg-gray-100">
									<p className="font-bold">{comment.postedBy?.userName}</p>
									<p>{comment.comment}</p>
								</div>
							</div>
						))}
					</div>
					<div className="flex flex-wrap mt-6 gap-3">
						<Link
							alt="user-profile" 
							to={`/user-profile/${pinDetail?.postedBy?._id}`} 
							className="flex gap-2 items-center bg-white rounded-lg"
						>
							<img alt="user-profile"src={pinDetail?.postedBy?.image} className='w-10 h-10 rounded-md object-cover' />
						</Link>
						<form onSubmit={(e) => handleSubmit(e)}>
							<input 
								type="text"
								placeholder='Add a comment' 
								value={comment}
								onChange={(e) => setComment(e.target.value)}
								className="flex-1 border-gray-100 border-2 p-2 outline-none rounded-md cursor-pointer" 
							/>
							<button
								type="button"
								onClick={addComment}
								className="ml-2 bg-green-500 text-white rounded-md px-6 py-2 font-semibold text-base outline-none"
							>
								{addingComment ? 'Posting the comment...' : 'Comment'}
							</button>
						</form>
					</div>
				</div>
			</div>
			)}
			{pins?.length > 0 && (
				<div className="flex items-center justify-center border-t-2 rounded-t-md mt-4 border-gray-200 border-solid w-full h-16">
					<h2 className="text-center font-bold text-2xl mt-8 mb-4">
						More like this 
					</h2>
				</div>
				
			)}
			{pins ? ( 
				<MasonaryLayout pins={pins}/>
			) : (
				<Spinner message="Loading more pins" />
			)}
		</>
	);
};

export default PinDetail;