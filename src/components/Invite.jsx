import React from 'react';
import { useNavigate } from 'react-router-dom';
import { getAuth } from 'firebase/auth';
import { useState, useLayoutEffect } from 'react';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import QRCode from "react-qr-code";
import { useContext } from 'react';
import { AmountContext } from '../App';
import axios from 'axios';
import BASE_URL from '../api_url';

//#df1f26
const Invite = () => {
    const navigate = useNavigate();
    const auth = getAuth();
    const [userDetails, setUserDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const amountDetails = useContext(AmountContext);
    const [cb, setCb] = useState({
        value: '',
        copied: false
    });
    const [toasterShow, setToasterShow] = useState(false);
    const [toasterText, setToasterText] = useState('');

    const toaster = (text) => {
        setToasterText(text);
        setToasterShow(true);
        setTimeout(() => {
            setToasterShow(false);
            //navigate('/mine');
        }, 5000);
    }

    const getUserDetails = async () => {
        const details = await axios.post(`${BASE_URL}/get_user`, { user_id: localStorage.getItem('uid') })
            .then(({ data }) => data);
        setUserDetails(details);
    }

    useLayoutEffect(() => {
        getUserDetails();
        setLoading(false);
    }, []);

    if (loading || userDetails === null) {
        return (
            <div className='h-screen grid place-items-center'>
                <div>Loading...</div>
            </div>
        )
    }
    //[#2e9afe]
    return (
        <div className=' bg-blue-500 h-[1000px] flex flex-col text-white font-light p-5 relative'>
            {toasterShow ? <div className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2'>
                <div className='flex gap-2 bg-black opacity-80 text-white px-2 py-1 rounded-md'>
                    <div>{toasterText}</div>
                </div>
            </div> : null}
            <div className="top p-3 cursor-pointer flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" onClick={() => navigate(-1)} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4  storke-white  cursor-pointer">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                </svg>
            <span className='ml-1'>back</span>
            </div>

            <div className="info p-3 sm:text-xs md:text-md flex flex-col gap-2 rounded-lg bg-white text-vlt font-bold mt-5">
                <div className='text-center text-lg border-b border-vlt'>Agent Rewards</div>
                Level 1, {amountDetails.level1_percent}%
                <br />
                Level 2, {amountDetails.level2_percent}%
                <br />
                Level 3, {amountDetails.level3_percent}%
            </div>

            <div className="flex gap-2">

                <div className="info w-1/2 p-3 sm:text-xs md:text-md flex flex-col gap-2 rounded-lg bg-white text-vlt font-bold mt-5">
                    <div className='font-bold'>Invitation Link</div>
                    <div className='p-3 rounded-md border overflow-hidden border-vlt'>{`https://www.wikiwandballoon77.tech/register/invite_code/${userDetails.user_invite}`}</div>
                    <CopyToClipboard text={`https://www.wikiwandballoon77.tech/register/invite_code/${userDetails.user_invite}`} onCopy={() => toaster('Copied to clipboard')}>
                        <span className='mx-auto bg-vlt text-white p-2 rounded-md'>Copy Link</span>
                    </CopyToClipboard>
                </div>

                <div className="info w-1/2 p-3 sm:text-xs md:text-md flex flex-col gap-2 rounded-lg bg-white text-vlt font-bold mt-5">
                    <div className='font-bold'>Invitation code</div>
                    <div className='p-3 rounded-md border border-vlt'>{userDetails.user_invite}</div>
                    <CopyToClipboard text={userDetails.user_invite} onCopy={() => toaster('Copied to clipboard')}>
                        <span className='mx-auto bg-vlt text-white p-2 rounded-md'>Copy code</span>
                    </CopyToClipboard>
                </div>
            </div>


            <div className="qr mx-auto flex flex-col justify-center items-center mt-4 p-3 bg-white rounded-md">
                <QRCode
                    size={120}
                    style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                    value={`https://www.wikiwandballoon77.tech/register/invite_code/${userDetails.user_invite}`}
                    viewBox={`0 0 120 120`}
                />
                <div className='text-vlt font-extrabold text-center mt-1'>QR code</div>
            </div>
        </div>
    )
}

export default Invite