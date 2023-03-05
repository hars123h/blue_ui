import React from 'react';
import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { getAuth } from 'firebase/auth';
import axios from 'axios';
import BASE_URL from '../api_url';

const Bank = () => {
    const navigate = useNavigate();
    const loc = useLocation();
    //console.log(loc);
    const auth = getAuth();
    const [details, setDetails] = useState({
        fullName: '',
        phoneNo: '',
        bankAccount: '',
        bankName: '',
        ifsc: '',
    });
    const [wpwd, setPwd] = useState('');
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



    const handleChange = (e) => {
        setDetails({
            ...details,
            [e.target.name]: e.target.value
        });
        //console.log(details);
    }

    const handleSubmit = async () => {
        if (loc.state.withdrawalPassword === wpwd) {
            await axios.post(`${BASE_URL}/bank_details`, { user_id: localStorage.getItem('uid'), bank_details: details })
                .then(() => {
                    toaster('Bank details added successfully!');
                })
                .catch(() => console.log('Some error Occured')
                );
        } else {
            toaster('Incorrect withdrawal password!');
        }
    }
    //[#2e9afe]
    return (
        <div className=' h-full bg-[#f4fbf4] sm:h-[700px] md:h-[950px] relative'>
            {toasterShow ? <div className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2'>
                <div className='flex gap-2 bg-black opacity-80 text-white px-2 py-1 rounded-md'>
                    <div>{toasterText}</div>
                </div>
            </div> : null}
            <div className="options text-center flex bg-vlt p-3 text-white text-lg items-center font-medium">
                <svg xmlns="http://www.w3.org/2000/svg" onClick={() => navigate('/settings', { state: { withdrawalPassword: loc.state.withdrawalPassword, loginPassword: loc.state.loginPassword } })} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 storke-white  cursor-pointer">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                </svg>

                <div className=' flex-grow text-center'>Bank Details</div>
            </div>

            {/* #757575 */}
            <div className="box mx-2 p-2">
                <div className='flex flex-col gap-1 items-start  text-md p-3 cursor-pointer'>
                    <div className='text-gray-500 font-semibold'>Full Name</div>
                    <input type="text" onChange={handleChange} name='fullName' value={details.fullName}
                        className='outline-none w-full placeholder-gray-600 rounded-2xl p-2 bg-[#dce6dd] placeholder:text-sm' placeholder='Full Name' />
                </div>

                <div className='flex flex-col gap-1 items-start text-md p-3  cursor-pointer'>
                    <div className='text-gray-500 font-semibold'>Phone Number</div>
                    <input type="text" onChange={handleChange} name='phoneNo' value={details.phoneNo}
                        className='outline-none w-full placeholder:text-sm placeholder-gray-600 rounded-2xl p-2 bg-[#dce6dd]' placeholder='Phone Number' />
                </div>

                <div className='flex flex-col gap-1 items-start text-md p-3 cursor-pointer'>
                    <div className='text-gray-500 font-semibold'>Bank Account</div>
                    <input type="text" onChange={handleChange} name='bankAccount' value={details.bankAccount}
                        className='outline-none w-full placeholder:text-sm placeholder-gray-600 rounded-2xl p-2 bg-[#dce6dd]' placeholder='Bank Account' />
                </div>

                <div className='flex flex-col gap-1 items-start text-md p-3 cursor-pointer'>
                    <div className='text-gray-500 font-semibold'>Bank Name</div>
                    <input type="text" onChange={handleChange} name='bankName' value={details.bankName}
                        className='outline-none w-full placeholder:text-sm placeholder-gray-600 rounded-2xl p-2 bg-[#dce6dd]' placeholder='Bank Name' />
                </div>

                <div className='flex flex-col gap-1 items-start text-md p-3 cursor-pointer'>
                    <div className='text-gray-500 font-semibold'>IFSC</div>
                    <input type="text" onChange={handleChange} name='ifsc' value={details.ifsc}
                        className='outline-none w-full placeholder:text-sm placeholder-gray-600 rounded-2xl p-2 bg-[#dce6dd]' placeholder='IFSC' />
                </div>

                <div className='flex flex-col gap-1 items-start text-md p-3 cursor-pointer'>
                    <div className='text-gray-500 font-semibold'>Withdrawal Password</div>
                    <input type="text" onChange={(e) => setPwd(e.target.value)} name='wpwd' value={wpwd}
                        className='outline-none w-full placeholder:text-sm placeholder-gray-600 rounded-2xl p-2 bg-[#dce6dd]' placeholder='Withdrawal Password' />
                </div>
            </div>

            <div className='mb-3'>
                <button onClick={handleSubmit} className='bg-vlt text-white mx-auto text-lg mb-20 rounded-full shadow-xl block w-4/5 py-2 shadow-red-200'>Confirm</button>
            </div>
        </div>
    )
}

export default Bank