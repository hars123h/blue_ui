import React from 'react';
import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { getAuth } from 'firebase/auth';
import axios from 'axios';
import BASE_URL from '../api_url';



const ChangeLoginPassword = () => {
    const navigate = useNavigate();
    const loc = useLocation();
    // console.log(loc.state);
    const auth = getAuth();
    const [oldpwd, setOldpwd] = useState('');
    const [newpwd, setNewpwd] = useState('');
    const [cnfNewPwd, setCnfNewPwd] = useState('');
    const [toasterShow, setToasterShow] = useState(false);
    const [toasterText, setToasterText] = useState('');

    const toaster = (text) => {
        setToasterText(text);
        setToasterShow(true);
        setTimeout(()=>{
            setToasterShow(false);
            navigate('/mine');
        },5000);
    }

    const handleReset = async () => {
        if (loc.state.loginPassword === oldpwd && newpwd === cnfNewPwd) {
            await axios.post(`${BASE_URL}/reset_login_password`, {user_id:localStorage.getItem('uid'), new_pwd:newpwd})
                .then(() => {
                    setCnfNewPwd(''); setNewpwd(''); setOldpwd('');
                    toaster('Password reset successfully!');
                }).catch(error => {
                    console.log('Could Not Update the passwored', error);
                    toaster('Please login again and retry to reset the password!');
                });
        } else {
            toaster('Password entered is incorrect or passwords do not match!');
        }
    }

//[#2e9afe]
    return (
        <div className='bg-[#f7f9f8] h-screen sm:h-[700px] md:h-[950px] relative'>
            {toasterShow?<div className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2'>
                <div className='flex gap-2 bg-black opacity-80 text-white px-2 py-1 rounded-md'>
                    <div>{toasterText}</div>
                </div>
            </div>:null}
            <div className="options text-center flex bg-vlt shadow-lg font-medium items-center p-3">

                <svg xmlns="http://www.w3.org/2000/svg" onClick={() => navigate('/settings', { state: { withdrawalPassword: loc.state.withdrawalPassword, loginPassword: loc.state.loginPassword } })} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" 
                className="w-4 h-4   storke-white  cursor-pointer stroke-white">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                </svg>
                <div className='text-white text-sm flex-grow'>Change Login Password</div>
            </div>

{/* [#61b2ff]  */}
            <div className="box flex gap-1 p-3 flex-col text-gray-500 font-semibold bg-[#fafff9] rounded-xl  shadow-xl m-4 border border-gray-300">

                <div className='flex  items-center text-vlt text-md p-2'>
                    Please enter the New Password
                </div>

                <div className='flex items-center  text-md p-1  '>
                    <input type="text" value={oldpwd} onChange={e => setOldpwd(e.target.value)} 
                    className='outline-none w-full bg-[#e3e5e2] p-2 placeholder-gray-500 rounded-lg' placeholder='Old Login Password' />
                </div>

                <div className='flex items-center text-md p-1  '>
                    <input type="text" value={newpwd} onChange={e => setNewpwd(e.target.value)} 
                    className='outline-none w-full bg-[#e3e5e2] p-2 placeholder-gray-500 rounded-lg' placeholder='New Login Password' />
                </div>

                <div className='flex  items-center text-md p-1 '>
                    <input type="text" value={cnfNewPwd} onChange={e => setCnfNewPwd(e.target.value)} 
                    className='outline-none w-full bg-[#e3e5e2] p-2 placeholder-gray-500 rounded-lg' placeholder='Confirm New Pasword' />
                </div>
            </div>

            <div className='flex'>
                <button onClick={handleReset} 
                className='bg-vlt w-[90%] text-white text-lg mt-5 mb-20 rounded-lg mx-auto block py-2 shadow-md'>Confirm</button>
            </div>
        </div>
    )
}

export default ChangeLoginPassword;