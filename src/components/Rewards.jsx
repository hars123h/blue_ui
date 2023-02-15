import axios from 'axios';
import React, { useEffect, useLayoutEffect } from 'react'
import { useState } from 'react';
import CopyToClipboard from 'react-copy-to-clipboard';
import { RotatingLines } from 'react-loader-spinner';
import { useNavigate } from 'react-router-dom';
import BASE_URL from '../api_url';
import reward1 from '../images/reward1.svg';
import envelope from '../images/envelope.jpg';

const Rewards = () => {


    const [toasterShow, setToasterShow] = useState(false);
    const [toasterText, setToasterText] = useState('');
    const [reward1_details, setReward1_details] = useState(null);
    const [input_promo, setInput_promo] = useState('');
    const [isloading, setIsloading] = useState(true);
    const navigate = useNavigate();

    const site_url = 'https://www.windharvester44.online/register/invite_code/'+localStorage.getItem('user_invite');

    const toaster = (text) => {
        setToasterText(text);
        setToasterShow(true);
        setTimeout(() => {
            setToasterShow(false);
            //navigate('/mine');
        }, 3000);
    }

    const getReward1 = async () => {
        const response = await axios.post(`${BASE_URL}/invite_rewards`, {
            user_id: localStorage.getItem('uid')
        }).then(({ data }) => { setIsloading(false); return data });
        //console.log(response);
        setReward1_details(response);
    }

    const getReward2 = async () => {
        if (!input_promo.length > 0) {
            toaster('Enter a valid promo code');
            return;
        }
        const response = await axios.post(`${BASE_URL}/avail_promo`, {
            promo_code: input_promo,
            user_id: localStorage.getItem('uid')
        }).then(({ data }) => data);
        console.log(response);
        if (response.message === 'Promocode already availed') {
            toaster('Promocode already availed');
        } else if (response.message === 'Invalid Promo Code') {
            toaster('Invalid Promo Code');
        } else {
            console.log(response.reward);
            toaster(`₹${response.reward}`);
        }
    }

    useEffect(() => {
        getReward1();
    }, []);



    return (
        <div className='md:h-screen  xs:h-[700px] bg-blue-50  h-screen relative'>
            {toasterShow ? <div className='absolute top-1/2 z-30 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-md'>
                <div className={`flex relative gap-2 ${toasterText.includes('₹')===false?'bg-black opacity-80 text-white px-2 py-1':''} rounded-md`}>
                    {toasterText.includes('₹')?(<>
                        <img src={envelope} alt="envelope" width={180} className="rounded-lg pt-5"/>
                        <div className='absolute text-red-500 font-extrabold bg-[#fff2d8] top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2'>{toasterText}</div>
                    </>):(
                        <div>{toasterText}</div>
                    )}
                </div>
            </div> : null}

            {isloading ? <div className='flex flex-col justify-center items-center absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2'>
                <RotatingLines strokeColor='gray' width='30' />
                <div className='text-sm text-cyan-400'>Loading...</div>
            </div> : <>
                <div className="options text-center text-white flex gap-2 items-center p-2  bg-cyan-400 text-lg pt-2 font-medium">
                <svg xmlns="http://www.w3.org/2000/svg" onClick={() => navigate(-1)} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4  storke-white  cursor-pointer">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                </svg>
                    <div className='flex-grow text-center text-sm'>Rewards</div>
                </div>

                <div className="flex flex-col items-center w-full">
                    <div className='text-[#d28c3e] text-3xl font-black flex flex-col items-center text_outline mt-4 text-bold text-center w-full'>
                        <div>Simple three steps</div>
                        <div>invite friends</div>
                    </div>

                    <div className='text-[#853d34] text-2xl flex flex-col items-center font-extrabold mt-4 text-bold text-center w-full'>
                        Enjoy 10% dividend
                    </div>

                    <div className="flex flex-col items-center translate-y-5  bg-[#ff8603] p-3 w-[85%] mx-auto text-white text-md font-bold rounded-lg shadow-orange-500 shadow-md">
                        <div>Invite friends to invest in 500</div>
                        <div>and immediately light up the level icon!</div>
                    </div>

                    <div className="flex flex-col gap-4 px-2 bg-white rounded-lg shadow-lg w-[98%] mx-auto border border-gray-400">
                        <div className="flex h-2">

                        </div>

                        <div className="flex items-center gap-1 border-b border-gray-300 py-2">
                            <div className="w-1/12 ">
                                <img src={reward1} alt="reward" className='w-8 h-8' />
                            </div>
                            <div className="w-8/12 flex flex-col text-sm">
                                <div className='font-semibold text-xs'>Invitation 3 Friends spend   500</div>
                                <div className='flex gap-1 items-center'>
                                    <progress value={Math.min(reward1_details?.friend_length, 3)} max={3}>  </progress>
                                    <div className='ml-1'>{Math.min(reward1_details?.friend_length, 3)}/3</div>
                                </div>
                            </div>
                            <div className="w-1/6 text-right text-xs text-cyan-400 font-semibold mr-1">
                                + 300
                            </div>
                            <CopyToClipboard text={site_url} onCopy={() => alert('Copied to clipboard')}>
                                <div className="w-1/6 text-center border-2 text-orange-400 border-orange-400 rounded-full p-1 font-extrabold hover:cursor-pointer">
                                    invite
                                </div>
                            </CopyToClipboard>

                        </div>

                        <div className="flex items-center gap-1 border-b border-gray-300 py-2">
                            <div className="w-1/12 ">
                                <img src={reward1} alt="reward" className='w-8 h-8' />
                            </div>
                            <div className="w-8/12 flex flex-col text-sm">
                                <div className='font-semibold text-xs'>Invitation 5 Friends spend   500</div>
                                <div className='flex gap-1 items-center'>
                                    <progress value={Math.min(reward1_details?.friend_length, 5)} max={5}>  </progress>
                                    <div className='ml-1'>{Math.min(reward1_details?.friend_length, 5)}/5</div>
                                </div>
                            </div>
                            <div className="w-1/6 text-right text-xs text-cyan-400 font-semibold mr-1">
                                + 500
                            </div>
                            <CopyToClipboard text={site_url} onCopy={() => alert('Copied to clipboard')}>
                                <div className="w-1/6 text-center border text-orange-400 border-orange-400 rounded-full p-1 font-semibold hover:cursor-pointer">
                                    invite
                                </div>
                            </CopyToClipboard>
                        </div>

                        <div className="flex items-center gap-1 border-b border-gray-300 py-2">
                            <div className="w-1/12 ">
                                <img src={reward1} alt="reward" className='w-8 h-8' />
                            </div>
                            <div className="w-8/12 flex flex-col text-sm">
                                <div className='font-semibold text-xs'>Invitation 10 Friends spend   500</div>
                                <div className='flex gap-1 items-center'>
                                    <progress value={Math.min(reward1_details?.friend_length, 10)} max={10}>  </progress>
                                    <div className='ml-1'>{Math.min(reward1_details?.friend_length, 10)}/10</div>
                                </div>
                            </div>
                            <div className="w-1/6 text-right text-xs text-cyan-400 font-semibold mr-1">
                                + 1,200
                            </div>
                            <CopyToClipboard text={site_url} onCopy={() => alert('Copied to clipboard')}>
                                <div className="w-1/6 text-center border text-orange-400 border-orange-400 rounded-full p-1 font-semibold hover:cursor-pointer">
                                    invite
                                </div>
                            </CopyToClipboard>
                        </div>

                        <div className="flex items-center gap-1 border-b border-gray-300 py-2">
                            <div className="w-1/12 ">
                                <img src={reward1} alt="reward" className='w-8 h-8' />
                            </div>
                            <div className="w-8/12 flex flex-col text-sm">
                                <div className='font-semibold text-xs'>Invitation 30 Friends spend   500</div>
                                <div className='flex gap-1 items-center'>
                                    <progress value={Math.min(reward1_details?.friend_length, 30)} max={30}>  </progress>
                                    <div className='ml-1'>{Math.min(reward1_details?.friend_length, 30)}/30</div>
                                </div>
                            </div>
                            <div className="w-1/6 text-right text-xs text-cyan-400 font-semibold mr-1">
                                + 3,500
                            </div>
                            <CopyToClipboard text={site_url} onCopy={() => alert('Copied to clipboard')}>
                                <div className="w-1/6 text-center border text-orange-400 border-orange-400 rounded-full p-1 font-semibold hover:cursor-pointer">
                                    invite
                                </div>
                            </CopyToClipboard>
                        </div>

                        <div className="flex items-center gap-1 border-b border-gray-300 py-2">
                            <div className="w-1/12 ">
                                <img src={reward1} alt="reward" className='w-8 h-8' />
                            </div>
                            <div className="w-8/12 flex flex-col text-sm">
                                <div className='font-semibold text-xs'>Invitation 60 Friends spend   500</div>
                                <div className='flex gap-1 items-center'>
                                    <progress value={Math.min(reward1_details?.friend_length, 60)} max={60}>  </progress>
                                    <div className='ml-1'>{Math.min(reward1_details?.friend_length, 60)}/60</div>
                                </div>
                            </div>
                            <div className="w-1/6 text-right text-[0.7rem] text-cyan-400 font-semibold mr-1">
                                + 10,000
                            </div>
                            <CopyToClipboard text={site_url} onCopy={() => alert('Copied to clipboard')}>
                                <div className="w-1/6 text-center border text-orange-400 border-orange-400 rounded-full p-1 font-semibold hover:cursor-pointer">
                                    invite
                                </div>
                            </CopyToClipboard>
                        </div>
                    </div>

                    <div className="flex w-[98%] flex-col font-bold border bg-white border-gray-300 shadow-lg mt-2 rounded-lg mx-auto p-3 gap-2">
                        <div className='text-lg text-cyan-400'>*Enter the Lifafa code to get today's rewards</div>
                        <input onChange={(e) => setInput_promo(e.target.value)} type="text" className='flex-grow bg-gray-300 placeholder:text-gray-500 p-3 rounded-lg shadow-md' placeholder='enter the code' />
                        <button onClick={getReward2} className='bg-cyan-400 p-3 text-white shadow-md rounded-md '>Redeem Code</button>
                    </div>
                </div>
            </>}
        </div>
    )
}

export default Rewards