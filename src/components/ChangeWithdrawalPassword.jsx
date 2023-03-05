import React from 'react';
import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { doc, updateDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { toast } from 'react-toastify';
import db from '../firebase/config';
import axios from 'axios';
import BASE_URL from '../api_url';


const ChangeWithdrawalPassword = () => {

    const navigate = useNavigate();
    const auth = getAuth();
    const loc = useLocation();
    const [oldpwd, setOldpwd] = useState('');
    const [cnf_new_pwd, setCnf_new_pwd] = useState('');
    const [new_pwd, setNew_pwd] = useState('');
    const [toasterShow, setToasterShow] = useState(false);
    const [toasterText, setToasterText] = useState('');

    const toaster = (text) => {
        setToasterText(text);
        setToasterShow(true);
        setTimeout(() => {
            setToasterShow(false);
            navigate('/settings', { state: { withdrawalPassword: loc.state.withdrawalPassword, loginPassword: loc.state.loginPassword } })
        }, 5000);
    }

    const handleReset = async () => {
        if (new_pwd === cnf_new_pwd && oldpwd === loc.state.withdrawalPassword) {
            const docRef = doc(db, 'users', auth.currentUser.uid);
            await axios.post(`${BASE_URL}/reset_withdrawal_password`,
                { new_wpwd: new_pwd, user_id: localStorage.getItem('uid') }).then(() => {
                    setOldpwd('');
                    setCnf_new_pwd('');
                    setNew_pwd('');
                    toaster('Password successfully updated!');
                })
                .catch(error => toaster('Some Error Occured'));
        } else {
            //console.log({new_pwd, cnf_new_pwd, oldpwd});
            toaster('Either Old Login Password is incorrect or password do not match, Please Retry!');
        }
    }

    //console.log(loc);
    return (
        <div className='bg-[#f7f9f8] h-screen sm:h-[700px] md:h-[950px] relative'>
            {toasterShow ? <div className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2'>
                <div className='flex gap-2 bg-black opacity-80 text-white px-2 py-1 rounded-md'>
                    <div>{toasterText}</div>
                </div>
            </div> : null}
            <div className="options text-center flex bg-vlt shadow-lg font-medium items-center p-3">
                <svg xmlns="http://www.w3.org/2000/svg" onClick={() => navigate('/settings', { state: { withdrawalPassword: loc.state.withdrawalPassword, loginPassword: loc.state.loginPassword } })} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"
                    className="w-4 h-4   storke-white  cursor-pointer stroke-white">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                </svg>
                <div className='text-white text-sm flex-grow'>Fund Management Password</div>
            </div>

            {/* [#61b2ff] */}
            <div className="box flex gap-1 p-3 flex-col text-gray-500 font-semibold bg-[#fafff9] rounded-xl  shadow-xl m-4 border border-gray-300">

                <div className='flex  items-center text-vlt text-md p-2'>
                    Please enter the New Password
                </div>

                <div className='flex items-center  text-md p-1  '>
                    <input onChange={(e) => setOldpwd(e.target.value)} type="text"
                        className='outline-none w-full bg-[#e3e5e2] p-2 placeholder-gray-500 rounded-lg' placeholder='Old Withdrawal Password' />
                </div>

                <div className='flex items-center  text-md p-1  '>
                    <input onChange={(e) => setNew_pwd(e.target.value)} type="text"
                        className='outline-none w-full bg-[#e3e5e2] p-2 placeholder-gray-500 rounded-lg' placeholder='New Withdrawal Password' />
                </div>

                <div className='flex items-center  text-md p-1  '>
                    <input onChange={(e) => setCnf_new_pwd(e.target.value)} type="text"
                        className='outline-none w-full bg-[#e3e5e2] p-2 placeholder-gray-500 rounded-lg' placeholder='Confirm New Withdrawal Pasword' />
                </div>
            </div>

            <div className='flex'>
                {/* [#7899de] */}
                <button onClick={handleReset} 
                className='bg-vlt w-[90%] text-white text-lg mt-5 mb-20 rounded-lg mx-auto block py-2 shadow-md'>Confirm</button>
            </div>
        </div>
    )
}

export default ChangeWithdrawalPassword;