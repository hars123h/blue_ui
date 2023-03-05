import React from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { RotatingLines } from 'react-loader-spinner';
import useInterval from '../hooks/useInterval.js';
import '../styles/record.css';
import axios from 'axios';
import BASE_URL from '../api_url.js';


const nameMapper = {
    confirmed: 'success',
    declined: 'declined',
    pending: 'pending'
}

const Record = () => {
    const navigate = useNavigate();
    const [recharge_list, setRecharge_list] = useState([]);
    const [withdrawal_list, setWithdrawal_list] = useState([]);
    const [currentRecord, setCurrentRecord] = useState('recharges');


    const getRecharges_list = async () => {

        const querySnapshot = await axios.post(`${BASE_URL}/get_user_recharges`, { user_id: localStorage.getItem('uid') })
            .then(res => res.data);
        setRecharge_list(querySnapshot);
    }

    const getWithdrawals_list = async () => {
        const querySnapshot = await axios.post(`${BASE_URL}/get_user_withdrawals`, { user_id: localStorage.getItem('uid') })
            .then(res => res.data);
        setWithdrawal_list(querySnapshot);
    }

    // This is the rate at which the polling is done to update and get the new Data
    useInterval(getRecharges_list, 5000);
    useInterval(getWithdrawals_list, 5000);


    useEffect(() => {
        const getRecharges_list = async () => {

            const querySnapshot = await axios.post(`${BASE_URL}/get_user_recharges`, { user_id: localStorage.getItem('uid') })
                .then(res => res.data);
            setRecharge_list(querySnapshot);
        }
        getRecharges_list();
        getWithdrawals_list();
    }, []);
    //[#2e9afe]
    return (
        <div className=' bg-[#f7f9f8] pb-3 sm:h-[1000px] md:h-screen h-screen'>

            <div className="options text-center text-white flex gap-2 items-center p-2  bg-vlt text-lg pt-2 font-medium">
                <svg xmlns="http://www.w3.org/2000/svg" onClick={() => navigate('/mine')} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4  storke-white  cursor-pointer">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                </svg>

                <div className='flex-grow text-center text-sm'>My Rent</div>
            </div>


            {/* This is the curved part */}
            <div className='records w-full flex bg-vlt items-center text-sm font-bold'>
                <div className={`h-[40px] cursor-pointer flex items-center justify-center w-1/3 text-center ${currentRecord === 'recharges' ? 'border-b border-white text-white' : ''}`} onClick={() => setCurrentRecord('recharges')}>Recharge</div>
                <div className={`h-[40px] cursor-pointer flex items-center justify-center w-1/3 text-center ${currentRecord === 'withdrawals' ? 'border-b border-white text-white' : ''}`} onClick={() => setCurrentRecord('withdrawals')}>Withdrawls</div>
                <div className={`h-[40px] cursor-pointer flex items-center justify-center w-1/3 text-center ${currentRecord === 'all' ? 'border-b border-white text-white' : ''}`} onClick={() => setCurrentRecord('all')}>All Types</div>
            </div>
            {/* curver part ends here */}

            {/* <div className='custom_card mt-3 bg-[#ffffff] mx-auto w-[90%] flex flex-col items-center p-3 shadow-2xl border border-gray-300 rounded-xl'>
                <div className="w-full mx-3">
                    <div className='text-lg font-bold'>New member gifts</div>
                    <div className='text-gray-400 text-xs'>Purschase Date: 12/07/2022</div>
                    <div className='text-red-400 text-xs'>End Date: 22/07/2022</div>
                </div>
                <div className='flex w-full justify-around p-2 mt-5'>
                    <div className='flex flex-col items-center border-r-2 border-gray-400 pr-4'>
                        <div className='text-black font-bold'><span className='text-[#10a6b7]'>&#8377;</span> 200</div>
                        <div className='text-xs text-gray-400'>Investment Amount</div>
                    </div>
                    <div className='flex flex-col items-center'>
                        <div className='text-black font-bold'><span className='text-[#10a6b7]'>&#8377;</span> 200</div>
                        <div className='text-xs text-gray-400'>Received Amount</div>
                    </div>
                </div>
                <div className='text-white w-[70%] mx-auto rounded-full py-2 mt-4 text-sm text-center bg-gray-400'>
                    Finished
                </div>
            </div> */}


            {recharge_list === null && (<div className='flex flex-col justify-center items-center'>
                <RotatingLines
                    strokeColor="grey"
                    strokeWidth="2"
                    animationDuration="0.75"
                    width="96"
                    visible={true}
                />
                <div className='text-lg text-gray-500'>Loading...</div>
            </div>)}

            <div className=' overflow-y-scroll h-[500px] m-5'>
                {(currentRecord === 'recharges' || currentRecord === 'all') && recharge_list && recharge_list.map((element, id) => {
                    // red-400
                    return (
                        <div key={id} className='custom_card mt-3 bg-[#ffffff] mx-auto w-full flex flex-col items-center p-2 shadow-2xl border border-gray-300 rounded-xl'>
                            <div className='flex justify-between items-center w-full'>
                                <div className='flex flex-col gap-1 font-semibold'>
                                    <div className='text-vlt text-md overflow-clip'><span className='font-bold text-gray-500'>Recharge Value:</span> &#8377;{new Intl.NumberFormat().format(element.recharge_value)}</div>
                                    <div className='text-vlt text-md overflow-clip'><span className='font-bold text-gray-500'>Ref No:</span> {element.refno}</div>
                                    <div className='text-vlt text-md overflow-clip'><span className='font-bold text-gray-500'>Status:</span> {nameMapper[String(element.status)]}</div>
                                    <div className='text-vlt text-md overflow-clip'><span className='font-bold text-gray-500'>Date:</span> {new Date(element.time).toLocaleString(undefined, { timeZone: 'Asia/Kolkata' })}</div>

                                </div>

                            </div>
                        </div>
                    )
                })}

                {(currentRecord === 'withdrawals' || currentRecord === 'all') && withdrawal_list && withdrawal_list.map((element, id) => {
                    return (
                        <div key={id} className='custom_card mt-3 bg-[#ffffff] mx-auto w-full flex flex-col items-center p-3 shadow-2xl border border-gray-300 rounded-xl'>
                            <div className='w-full flex justify-between items-center'>
                                <div className='flex flex-col gap-1'>
                                    <div className='text-[#16a4ba] text-md overflow-clip'><span className='font-bold text-gray-500'>Withdrawal Amount:</span> &#8377;{new Intl.NumberFormat().format(element.withdrawalAmount)}</div>
                                    <div className='text-[#16a4ba] text-md overflow-clip'><span className='font-bold text-gray-500'>Status:</span> {nameMapper[String(element.status)]}</div>
                                    <div className='text-[#16a4ba] text-md overflow-clip'><span className='font-bold text-gray-500'>Date:</span> {new Date(element.time).toLocaleString(undefined, { timeZone: 'Asia/Kolkata' })}</div>
                                </div>
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

export default Record