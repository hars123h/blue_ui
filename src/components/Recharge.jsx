import React, { useState } from 'react';
import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AmountContext } from '../App';


const Recharge = () => {

    const [recharge_value, setRecharge_Value] = useState(0);
    const navigate = useNavigate();
    const amountDetails = useContext(AmountContext);
    const [toasterShow, setToasterShow] = useState(false);
    const [toasterText, setToasterText] = useState('');

    const toaster = (text) => {
        setToasterText(text);
        setToasterShow(true);
        setTimeout(()=>{
            setToasterShow(false);
            //navigate('/mine');
        },5000);
    }

    const handleRecharge = () => {
        if (parseInt(recharge_value)) {
            if (Number(amountDetails.amount) > Number(recharge_value)) {
                toaster(`Amount should be greater than ₹${amountDetails.amount}`);
                return;
            }
            navigate(`/recharge_window/${recharge_value}`);
        } else {
            alert('Enter a valid recharge amount');
        }
    }
    //[#2e9afe] #4daaff #298ae4 [#2e9afe]
    return (
        <div className='bg-[#f7f9f8] h-screen relative'>
            {toasterShow ? <div className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2'>
                <div className='flex gap-2 bg-black opacity-80 text-white px-2 py-1 rounded-md'>
                    <div>{toasterText}</div>
                </div>
            </div> : null}
            <div className="options text-center flex items-center bg-vlt text-white text-md p-3 font-normal mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" onClick={() => navigate(-1)} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" 
                className="w-4 h-4   storke-white  cursor-pointer">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3" />
                </svg>
                <div className='flex-grow text-md font-semibold'>Recharge</div>
            </div>

            <div className="box gap-2 flex flex-col text-gray-500 p-2 font-semibold bg-[#fafff9] rounded-xl  shadow-xl m-4 border border-gray-300">

                <div className='m-1 text-md font-bold  text-vlt'>Recharge Amount:</div>
                <div className=' flex items-center bg-[#e0e5e1] p-1 m-2 rounded-lg'>
                    <span className='text-vlt font-bold p-0.5 pr-1 mr-1 py-1'>INR</span>
                    <input onChange={(e) => setRecharge_Value(e.target.value)} type="text" name="amount" id="amt" placeholder='Amount' 
                    className='w-full bg-inherit outline-none text-vlt py-1  font-normal text-lg' />
                </div>

                <ol className='text-gray-500 text-xs m-1'>
                    <li className='mt-2 my-1 mr-1'>1: Fill in the callback UTR correctly, and the account will be credited within 1 minute.</li>
                    <li className='mt-2 my-1 mr-1'>2: If you forget to fill in the UTR, please contact the online customer service in time to help you solve the problem of the safe arrival of funds.</li>
                    <li className='mt-2 my-1 mr-1'>3: Your Money will be added to your wallet within 10 minutes.</li>
                </ol>

            </div>

            <div className="cnf_recharge w-4/5 mx-auto mt-10">
                <button onClick={handleRecharge} className='w-full bg-vlt py-2 rounded-md text-white text-lg font-bold shadow-customShadow shadow-cyan-200'>Confirm Recharge</button>
            </div>
        </div>
    )
}

export default Recharge