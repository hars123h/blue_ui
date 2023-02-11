import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import referralCodeGenerator from 'referral-code-generator'
import db from '../firebase/config.js';
import { setDoc, doc, updateDoc, query, collection, where, getDocs, getDoc, arrayUnion, increment } from "firebase/firestore";
import { useContext } from 'react';
import { AmountContext } from '../App';
import { RotatingLines } from 'react-loader-spinner';
import close_eye from '../images/close_eye.png';
import apache_logo from '../images/apache_logo.png';
import axios from 'axios';
import BASE_URL from '../api_url.js';
import amaz_logi from '../images/amaz_logi.png';
import { PhoneAndroid, VerifiedUserOutlined, LockOutlined } from '@material-ui/icons';



const Register = () => {

    const navigate = useNavigate();
    const auth = getAuth();
    const {invite_code} = useParams();
    const [otp, setOtp] = useState('');
    const [otpfield, setOTPfield] = useState('');
    const [mobno, setMobno] = useState('');
    const [pwd, setpwd] = useState('');
    const [cpwd, setCpwd] = useState('');
    const [wpwd, setwpwd] = useState('');
    const [invt, setInvt] = useState(invite_code);
    const amountDetails = useContext(AmountContext);
    const [loading, setLoading] = useState(false);
    const [text, setText] = useState('Loading');
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

    const handleRegister = async () => {

        if (mobno.length != 10) {
            toaster('Invalid Mobile Number');
            return;
        }

        // if (pwd !== cpwd) {
        //     toaster('Passwords do not match!');
        //     return;
        // }

        if (pwd.length < 6) {
            toaster('Password must contain at least 6 characters!');
            return;
        }

        if (otp !== otpfield) {
            toaster('Wrong OTP entered!');
            return;
        }
        //console.log({ mobno, pwd, cpwd, wpwd, invt });
        setLoading(true);
        await axios.post(`${BASE_URL}/register`,{mobno, pwd, wpwd, invt})
            .then(({data}) => {
                setText('Registration Successful!');
                localStorage.setItem('uid', data.user_id);
                setMobno('');
                setpwd('');
                setCpwd('');
                setwpwd('');
                setInvt('');
                setTimeout(() => {
                    navigate('/home');
                    setLoading(false);
                }, 2000);
            })
            .catch((error) => {
                toaster('Something went wrong');
                console.error(error);
            });
    }

    const handleOTPSend = (otpGenerated) => {

        if(mobno.length!==10) {
            toaster('Invalid Mobile Number');
            return;
        }
        
        setOTPfield(otpGenerated)
        fetch(`https://www.fast2sms.com/dev/bulkV2?authorization=27b58V4YOqBDMgWvNjapz1k9IHlrJfynC6w0hceRAZGoLimK3PuJC7OoiV4N2B6DjfwWKzb0lhgEetPH&variables_values=${otpGenerated}&route=otp&numbers=${mobno}`)
            .then((response) => {
                //console.log(response);
                toaster('OTP sent successfully');
            })
            .catch(error => toaster('Something went wrong'));
    }
//[#0096D5]
    return (
        <div className='relative h-screen bg-[#f4fbf4]'>
            {toasterShow ? <div className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2'>
                <div className='flex gap-2 bg-black opacity-80 text-white px-2 py-1 rounded-md'>
                    <div>{toasterText}</div>
                </div>
            </div> : null}
            {loading ? <div className='flex gap-2 bg-black text-white py-2 px-2  rounded-md opacity-70 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2'>
                {text === 'Loading' ? <div>
                    <RotatingLines strokeColor='white' width='20' />
                </div> : null}
                <div className='text-sm'>{text}</div>
            </div> : null}
            <div className='text-center bg-blue-600 font-sans text-white pt-2 text-lg 
        pb-2'> <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 absolute left-2 cursor-pointer hover:bg-white hover:stroke-black hover:rounded-full transition rounded-full ease-in-out delay-150 duration-200">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
                Register</div>
            {/* <div className='text-center'>
                <img src={amaz_logi} alt="hp_logo" className='m-auto md:w-2/6 sm:w-1/6 mt-8 mb-8' width={240} />
            </div> */}
            <div className="box mb-20 m-auto gap-1 mt-2 lg:w-2/5 w-4/5 p-4 w-50% flex flex-col">
                <div className='outline-none flex flex-col mb-2  px-2'>
                    <div className='flex gap-2'>
                        <PhoneAndroid />
                        <div className='text-gray-600'>Phone Number</div>
                    </div>
                    <div className='mt-2'>
                        <input value={mobno} onChange={e => setMobno(e.target.value)} type="text"
                            className='py-2 px-2 w-full placeholder:text-sm border border-gray-300 rounded-md' placeholder='Please enter a valid phone number' name="phoneno" id="phoneno" />
                    </div>
                </div>
                <div className='outline-none flex flex-col mb-2  px-2'>
                    <div className="flex gap-2">
                        <VerifiedUserOutlined/>
                        <div className='text-gray-600'>Verification Code</div>
                    </div>
                    <div className="mt-2 flex gap-2">
                        <input type="text" onChange={e => setOtp(e.target.value)} className='py-2 px-2 w-full placeholder:text-sm border border-gray-300 rounded-md' placeholder='Please enter the verification code' name="otp" id="otp" />
                        <button className='bg-blue-600 text-white text-xs px-4 my-1 rounded-md' onClick={() => handleOTPSend(String(Math.floor(100000 + Math.random() * 900000)))}>Send</button>
                    </div>
                </div>
                <div className='outline-none flex flex-col mb-2  px-2'>
                    <div className='flex gap-2'>
                        <LockOutlined />
                        <div className='text-gray-600'>Password</div>
                    </div>
                    <div className='mt-2'>
                        <input value={pwd} onChange={e => setpwd(e.target.value)} type="text"
                            className='py-2 px-2 w-full placeholder:text-sm border border-gray-300 rounded-md' placeholder='enter the password' name="pwd" id="pwd" />
                    </div>
                </div>

                <div className='outline-none flex flex-col mb-2  px-2'>
                    <div className='flex gap-2'>
                        <LockOutlined />
                        <div className='text-gray-600'>Withdrawal Password</div>
                    </div>
                    <div className='mt-2'>
                        <input value={wpwd} onChange={e => setwpwd(e.target.value)} type="text"
                            className='py-2 px-2 w-full placeholder:text-sm border border-gray-300 rounded-md' placeholder='enter the withdrawal Password' name="wpwd" id="wpwd" />
                    </div>
                </div>

                <div className="outline-none flex flex-col mb-2 px-2">
                    <input value={invt} onChange={e => setInvt(e.target.value)} type="text" className='py-2 px-2 w-full placeholder:text-sm border border-gray-300 rounded-md' placeholder='Invitation code' name="invite_code" id="inv_code" />
                </div>

                <button onClick={handleRegister} className='bg-blue-600 text-white pt-1 pb-1 rounded-full text-lg w-4/5 mx-auto'>Register</button>
                <div onClick={() => navigate('/login')} className='text-blue-600 text-sm underline mx-auto mt-4'>
                    Existing account, login
                </div>
            </div>
        </div>
    )
}

export default Register