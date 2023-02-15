import React from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Select, MenuItem } from '@material-ui/core'
import db from '../firebase/config.js';
import { addDoc, doc, collection } from 'firebase/firestore'
import { toast } from 'react-toastify';
import axios from 'axios';
import BASE_URL from '../api_url.js';

const ClientFeedback = () => {

    const navigate = useNavigate();
    const [details, setDetails] = useState({
        mobileNumber: '',
        type: 'Complaint',
        description: '',
        date: ''
    });
    const [toasterShow, setToasterShow] = useState(false);
    const [toasterText, setToasterText] = useState('');

    const toaster = (text) => {
        setToasterText(text);
        setToasterShow(true);
        setTimeout(() => {
            setToasterShow(false);
            navigate('/mine');
        }, 5000);
    }

    const handleSubmit = async () => {

        if (details.mobileNumber.length > 0 && details.description.length > 0 && details.date.length > 0) {
            await axios.post(`${BASE_URL}/feedback`, details)
                .then((response) => { toaster('Feedback sent successfully!') })
                .catch(error => toaster('Something went wrong'));
        } else {
            toaster('Enter Details First!');
        }

        //console.log(details);

    }
    //[#2e9afe]
    return (
        <div className=' bg-[#f7f9f8] h-screen flex flex-col text-white font-light relative'>
            {toasterShow ? <div className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2'>
                <div className='flex gap-2 bg-black opacity-80 text-white px-2 py-1 rounded-md'>
                    <div>{toasterText}</div>
                </div>
            </div> : null}
            <div className="top p-3 cursor-pointer flex items-center bg-cyan-400">
            <svg xmlns="http://www.w3.org/2000/svg" onClick={() => navigate(-1)} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4  storke-white  cursor-pointer">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                </svg>
                <div className='text-center  flex-grow font-semibold text-md'>
                    Feedback
                </div>
            </div>

            <div className='box gap-3 flex flex-col text-gray-500 p-6 font-semibold bg-[#fafff9] rounded-xl  shadow-xl m-4 border border-gray-300'>
                <div className='w-full px-2 text-cyan-400 py-2 font-bold text-lg' > * Please enter the feedback details.</div>
                <input placeholder='Mobile Number' type="text" onChange={e => setDetails({ ...details, mobileNumber: e.target.value })}
                    className='w-full bg-[#e0e5e1] px-2  rounded-lg outline-none text-[#16a4ba] py-2  font-normal text-lg' />
                <input placeholder='Description' type="text" onChange={e => setDetails({ ...details, description: e.target.value })}
                    className='w-full bg-[#e0e5e1] px-2  rounded-lg outline-none text-[#16a4ba] py-2  font-normal text-lg' />
                <input placeholder='Date' type="date" onChange={e => setDetails({ ...details, date: e.target.value })}
                    className='w-full bg-[#e0e5e1] px-2 rounded-lg outline-none text-[#16a4ba] py-2  font-normal text-lg' />
                <div className="flex justify-center items-center">
                    <Button className='w-1/5' variant="contained" style={{ color: 'white', backgroundColor: '#26C6DA' }} onClick={handleSubmit}>Submit</Button>
                </div>
            </div>
        </div>
    )
}

export default ClientFeedback