import React from 'react';
import { useState, useEffect } from 'react';
import { getAuth } from 'firebase/auth';
import { doc, getDoc, collection, addDoc, Timestamp, updateDoc } from 'firebase/firestore';
import db from '../firebase/config.js';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useContext } from 'react';
import { AmountContext } from '../App.js';
import DateDifference from '../utility/DateDifference.js';
import ReactModal from 'react-modal';
import axios from 'axios';
import BASE_URL from '../api_url.js';


const customStyles = {
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
    },
};


const Withdrawal = () => {

    const navigate = useNavigate();
    const loc = useLocation();
    const auth = getAuth();
    const amountDetails = useContext(AmountContext)
    const [otp, setOtp] = useState('');
    const [otpfield, setOTPfield] = useState('');
    const [balance, setBalance] = useState();
    const [wpassword, setWpassword] = useState('');
    const [wamount, setWamount] = useState(0);
    const [diffDays, setDiffDays] = useState(0);
    // const [btnActive, setBtnActive] = useState(true);
    const [details, setDetails] = useState({
        fullName: '',
        phoneNo: '',
        bankAccount: '',
        bankName: '',
        ifsc: '',
    });
    const [toasterShow, setToasterShow] = useState(false);
    const [toasterText, setToasterText] = useState('');
    const [modalIsOpen, setIsOpen] = useState(false);

    const toaster = (text, arg='') => {
        setToasterText(text);
        setToasterShow(true);
        setTimeout(()=>{
            setToasterShow(false);
            if(arg==='/record') {
                setIsOpen(false);
                navigate('/record');
            }
            if(arg==='/bank') {
                navigate('/bank', { state: { withdrawalPassword: loc.state.withdrawalPassword, loginPassword: loc.state.loginPassword } });
            }
        },2000);
    }

    useEffect(() => {
        const getDetails = async () => {
            const docRef = await axios.post(`${BASE_URL}/get_user`, {user_id: localStorage.getItem('uid')}).then(({data})=>data);
            if (docRef) {
                if (docRef.bank_details.bankAccount.length===0) {
                    toaster('Fill bank details first!', '/bank');
                } else {

                    setDetails(docRef.bank_details);
                    console.log("doccccc",docRef.bank_details)
                    docRef.balance ? setBalance(docRef.balance) : setBalance(0);
                    setDiffDays(DateDifference(new Date(docRef.lastWithdrawal), new Date()));
                }
            } else {
                console.log('Something went wrong');
            }
        }
        getDetails();
        
    }, []);


    const handleWithdrawalAmount = (e) => {
        setWamount(e.target.value);
    }

    const openModal = () => {
        setIsOpen(true);
    }

    const handleWithdrawal = async () => {

        if (Number(wamount) === false || Number(wamount) <= 0) {
            toaster('Enter a valid number');
            return;
        }

        if ((Number(wamount)) < Number(amountDetails.mwamount)) {
            //console.log((Number(wamount)+Number(amountDetails.withdrawal_fee)), Number(amountDetails.mwamount));
            toaster(`Amount should be greater than ${amountDetails.mwamount}`);
            //console.log(wamount, amountDetails.amount);
            return;
        }

        if ((Number(wamount) > 50000)) {
            toaster('Amount should not be greatr than Rs 50,000');
            return;
        }

        if (((Number(wamount)) > Number(balance))) {
            toaster('You dont have enough balance');
            return;
        }

        if (wpassword === loc.state.withdrawalPassword && otp === otpfield) {
            try {
                const docRef1 = await axios.post(`${BASE_URL}/place_withdrawal`, { 
                    withdrawalAmount: (Number(wamount)), 
                    ...details, 
                    afterDeduction: (Number(wamount) - (Number(amountDetails.withdrawal_fee) * Number(wamount) / 100)), 
                    user_id: localStorage.getItem('uid'), 
                    time:new Date(),
                    balance: balance,
                    status: 'pending' 
                });
                toaster('Withdrawal request placed successfully!', '/record');
                //navigate('/record');
            } catch (e) {
                console.error("Error adding document: ", e);
            }
        } else {
            toaster('Withdrawal Password is incorrect');
            //console.log(wpassword, loc.state.withdrawalPassword);
        }

    }

    const handleOTPSend = (otpGenerated) => {


        setOTPfield(otpGenerated);
        //console.log(otpGenerated);
        fetch(`https://www.fast2sms.com/dev/bulkV2?authorization=27b58V4YOqBDMgWvNjapz1k9IHlrJfynC6w0hceRAZGoLimK3PuJC7OoiV4N2B6DjfwWKzb0lhgEetPH&variables_values=${otpGenerated}&route=otp&numbers=${details.phoneNo}`)
            .then((response) => {
                //console.log(response);
                toaster('OTP sent successfully');
            })
            .catch(error => toaster('Something went wrong'));
    }

    const handleWithdrawalAll = () => {
        document.getElementById('withdrawal_field').value = balance;
        setWamount(balance);
    }

    const handleLastButton = () => {
        openModal();
    }
    //[#2e9afe]
    return (
        <div className='bg-white flex flex-col sm:h-[1000px] md:h-[950px] relative'>
            {toasterShow?<div className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2'>
                <div className='flex gap-2 bg-black opacity-80 text-white px-2 py-1 rounded-md'>
                    <div>{toasterText}</div>
                </div>
            </div>:null}
            <div>
                <ReactModal
                    isOpen={modalIsOpen}
                    style={customStyles}
                    contentLabel="Are You Sure"
                    ariaHideApp={false}

                >
                    <h1 className='text-gray-600 mb-3 text-xl'>Are you Sure?</h1>
                    <div>
                        <button onClick={() => handleWithdrawal()} className='bg-vlt text-white px-2 py-1 rounded-lg shadow-md w-[64px]'>Yes</button>
                        <button onClick={() => setIsOpen(false)} className='bg-vlt text-white px-2 py-1 rounded-lg shadow-md w-[64px] ml-2'>cancel</button>
                    </div>
                </ReactModal>
            </div>
            <div className="options bg-vlt flex text-center text-white text-md shadow-lg p-3 font-medium">
                <svg xmlns="http://www.w3.org/2000/svg" onClick={() => navigate('/home')} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" 
                className="w-5 h-5   storke-white cursor-pointer">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3" />
                </svg>
                <div className='flex-grow text-center'>Withdrawal</div>
            </div>
            {/*| After Deduction} */}
            <div className="part1 p-3 mx-3 mt-5">
                <div className='text-md text-vlt font-semibold'>Withdrawal Amount</div>
                <div className='flex w-full pt-4'>
                    <div className="value flex items-center py-1 px-2 bg-[#d3d6fe] rounded-lg"> 
                        <input type="number" id="withdrawal_field" onChange={handleWithdrawalAmount} 
                        className='text-xl outline-none bg-[#d3d6fe]' placeholder='Amount' />
                        <div className='text-vlt font-semibold'>INR</div>
                    </div>
                </div>
                <div className='flex items-center mt-4 justify-start gap-6 my-1'>
                    <div className="balance text-[#9fa1a0] text-sm">Available Balance &#8377; {balance}</div>
                    <div onClick={handleWithdrawalAll} className="withdraw text-[#12a5b7] text-sm cursor-pointer">All</div>
                </div>
                <div className='text-[#9fa1a0] text-sm my-1 inline'>Fee <span className='ml-10'>{amountDetails.withdrawal_fee}% | Rs.{(Number(wamount) - (Number(amountDetails.withdrawal_fee) * Number(wamount) / 100))}</span></div>
                <div className='text-[#9fa1a0] text-sm my-1'>Minimum Withdrawal Amount &#8377;{amountDetails.mwamount}</div>
            </div>

            <div className="part1 mx-3 mt-2">
                {/* #87a1c3 */}
                <div className="balance flex flex-col gap-2 text-md p-2">
                    <div className="phoneno text-vlt font-semibold text-sm">Phone Number:</div>
                    <div className='text-gray-400 bg-[#e0e5e1] text-sm py-2 px-2 rounded-lg'>{details.phoneNo}</div>
                </div>

                <div className="balance flex flex-col gap-2 text-md p-2">
                    <div className="phoneno text-vlt font-semibold text-sm">Bank Account:</div>
                    <div className='text-gray-400 bg-[#e0e5e1] text-sm py-2 px-2 rounded-lg'>{details.bankAccount}</div>
                </div>

                <div className="balance flex flex-col gap-2 text-md p-2">
                    <div className="phoneno text-vlt font-semibold text-sm">Full Name:</div>
                    <div className='text-gray-400 bg-[#e0e5e1] text-sm py-2 px-2 rounded-lg'>{details.fullName}</div>
                </div>

                <div className="balance flex flex-col gap-2 text-md p-2">
                    <div className="phoneno text-vlt font-semibold text-sm">IFSC:</div>
                    <div className='text-gray-400 bg-[#e0e5e1] text-sm py-2 px-2 rounded-lg'>{details.ifsc}</div>
                </div>

                <div className="balance flex flex-col gap-2 text-md p-2">
                    <div className="phoneno text-vlt font-semibold text-sm">Withdrawal Password:</div>
                    <input type="password" onChange={e => setWpassword(e.target.value)} placeholder='Enter Password' 
                    className='text-gray-400 bg-[#e0e5e1] text-sm py-2 px-2 rounded-lg' />
                </div>

                <div className="balance flex flex-col gap-2 text-md p-2">
                    <div className="phoneno text-vlt font-semibold text-sm">OTP:</div>
                    <div className='flex gap-1'>
                        <input type="password" onChange={e => setOtp(e.target.value)} placeholder='Enter OTP' 
                        className='text-gray-400 bg-[#e0e5e1] text-sm py-2 px-2 rounded-lg flex-grow' />
                        <div className='text-sm bg-vlt rounded-lg font-semibold text-white px-3 py-1 hover:cursor-pointer' onClick={() => handleOTPSend(String(Math.floor(100000 + Math.random() * 900000)))}>Send OTP</div>
                    </div>
                </div>
            </div>

            <div className="part1 bg-[#e0e5e1] text-vlt font-semibold shadow-md p-3 rounded-lg mx-3 mt-5 flex flex-col gap-3">
                <div className='text-sm'>* The time of withdrawal and arrival is subject to the real-time processing time of the local bank, and the normal arrival time is 10 minutes to 24 hours.</div>
                <div className='text-sm'>* A single minimum withdrawal amount of not less than Rs {amountDetails.mwamount}.</div>
                <div className='text-sm'>* Withdrawal Time is 9:00 to 19:00  Everyday.</div>
            </div>
            {/* [#2e9afe] */}
            <div className='mx-2'>
                <button onClick={handleLastButton} 
                className='bg-vlt text-white text-md mt-5 mb-20 rounded-lg shadow-md block w-full py-2 shadow-[#12a5b7]'>Confirm</button>
            </div>
        </div>
    )
}

export default Withdrawal