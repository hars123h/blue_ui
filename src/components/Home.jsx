import React, { useEffect, useLayoutEffect, useState } from 'react';
import Slider from './Slider';
import Card from './Card';
import { useNavigate } from 'react-router-dom';
import ReactModal from 'react-modal';
import headset1 from '../images/headset1.png';
import ubon_home from '../images/ubon_home.png';
import ubon_user from '../images/ubon_user.png';
import ubon_group from '../images/ubon_group.png';
import book_image from '../images/book_image.png';
import recharge_image from '../images/recharge_image.png';
import invite_image from '../images/invite_image.png';
import { useContext } from 'react';
import { AmountContext } from '../App.js';
import money_bag from '../images/money_bag.png';
import axios from 'axios';
import BASE_URL from '../api_url';
import amaz_logi from '../images/amaz_logi.png';

import amaz_big1 from '../images/amaz_big1.jpg';
import amaz_big2 from '../images/amaz_big2.png';
import amaz_big3 from '../images/amaz_big3.jpg';
import amaz_big4 from '../images/amaz_big4.jpg';
import amaz_big5 from '../images/amaz_big5.jpg';

import amaz_short1 from '../images/amaz_short1.jpg';
import amaz_short2 from '../images/amaz_short2.jpg';
import amaz_short3 from '../images/amaz_short3.jpg';
import amaz_short4 from '../images/amaz_short4.jpg';
import { VolumeUpOutlined } from '@material-ui/icons';
import new_invite_image from '../images/new_invite_image.png';
import invite_bg from '../images/invite_bg.png';
import windharvester_logo from '../images/windharvester_logo.png';
import rent from '../images/rent.png';
import financial from '../images/financial.png';
import user from '../images/user.png';
import make_money from '../images/make_money.png';
import dividend from '../images/dividend.png';
import wind1 from '../images/wind1.jpg';
import wind2 from '../images/wind2.jpg';
import wind3 from '../images/wind3.jpg';
import wind4 from '../images/wind4.jpg';

import refer from '../images/assets/refer.jpg';
import img1 from '../images/assets/img1.jpg';
import img2 from '../images/assets/img2.jpg';
import img3 from '../images/assets/img3.jpg';
import img4 from '../images/assets/img4.jpg';
import img5 from '../images/assets/img5.jpg';
import img6 from '../images/assets/img6.jpg';

import logo_wiki from '../images/assets/logo.png';



const customStyles = {
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
        backgroundColor:'white',
    },
};

const customStyles2 = {
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
        backgroundColor:'white',
        border:'none',
        padding:0,
        width:'80%'
    },
};


const Home = () => {

    const navigate = useNavigate();
    const [modalIsOpen, setIsOpen] = React.useState(false);
    const [quantity, setQuantity] = React.useState(1);
    const [currPlan, setCurrPlan] = React.useState(null);
    const [currentVisible, setCurrentVisible] = React.useState('big');
    const [userDetails, setUserDetails] = React.useState(null);
    const amountDetails = useContext(AmountContext);
    const [toasterShow, setToasterShow] = useState(false);
    const [welcomeShow, setWelcomeShow] = useState(false);
    const [toasterText, setToasterText] = useState('');
    const [originalwpwd, setOriginalwpwd] = useState(null);
    const [originalpwd, setOriginalpwd] = useState(null);
    const [planPurchaseShow, setPlanPurchaseShow] = useState(false);

    const toaster = (text, arg = '') => {
        setToasterText(text);
        setToasterShow(true);
        setTimeout(() => {
            setToasterShow(false);
            //navigate('/mine');
            if (arg !== '') {
                navigate('/project');
            }
        }, 2000);
    }

    const openModal = () => {
        setIsOpen(true);
    }

    const getUserDetails = async () => {
        await axios.post(`${BASE_URL}/get_user`, { user_id: localStorage.getItem('uid') }).then(({ data }) => {
            if (data) {
                setUserDetails(data);
                setOriginalwpwd(data.wpwd);
                setOriginalpwd(data.pwd);
                localStorage.setItem('user_invite', data.user_invite);
            } else {
                //console.log('Data not found');
            }
        }).catch(error => console.log('Some error occured', error));
    }

    useEffect(() => {
        if (localStorage.getItem('pop_up_closed') === null) {
            setWelcomeShow(true);
        }
    }, []);

    useLayoutEffect(() => {
        document.body.style.backgroundColor = "#eaf4eb";
        getUserDetails();
    }, []);

    const closeModal = async (action) => {
        if (action === 'cancel') {
            setIsOpen(false);
        } else if (quantity <= 0) {
            toaster('Please a positive value!');
        } else {
            if ((Number(quantity) * Number(currPlan.plan_amount)) > Number(userDetails.balance)) {
                toaster("You don't have enough balance to make this purchase");
            } else {
                await axios.post(`${BASE_URL}/purchase`, {
                    balance: Number(userDetails.balance) - Number(Number(quantity) * Number(currPlan.plan_amount)),
                    boughtLong: (currPlan.product_type === 'long' ? 1 : 0),
                    boughtShort: (currPlan.product_type === 'short' ? 1 : 0),
                    user_id: localStorage.getItem('uid'),
                    plans_purchased: {
                        ...currPlan,
                        quantity: quantity,
                        date_purchased: new Date().toDateString(),
                        date_till_rewarded: new Date().toDateString(),
                        time: new Date().toDateString(),
                        ddmmyy: new Date().getMilliseconds()
                    }
                }).then(() => {
                    console.log('Product successfully purchased');
                    toaster('Plan purchased!', '/project');
                    setPlanPurchaseShow(true);
                }).catch((error) => {
                    console.log('Some error occured', error);
                    toaster('Some error occured, try again after some time');
                })
            }
            setIsOpen(false);
        }
    }

    const isBetween = () => {
        var startTime = '9:00:00';
        var endTime = '22:00:00';

        var currentDate = new Date()

        var startDate = new Date(currentDate.getTime());
        startDate.setHours(startTime.split(":")[0]);
        startDate.setMinutes(startTime.split(":")[1]);
        startDate.setSeconds(startTime.split(":")[2]);

        var endDate = new Date(currentDate.getTime());
        endDate.setHours(endTime.split(":")[0]);
        endDate.setMinutes(endTime.split(":")[1]);
        endDate.setSeconds(endTime.split(":")[2]);


        var valid = startDate < currentDate && endDate > currentDate;
        //console.log(valid);
        return valid;
    }

    const handleClick = (product_type, plan_name, plan_type, plan_amount, plan_daily_earning, plan_cycle) => {
        setCurrPlan({ product_type, plan_name, plan_type, plan_amount, plan_daily_earning, plan_cycle });
        openModal();
    }

    return (
        <div className='relative bg-[#eaf4eb]'>
            {toasterShow ? <div className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2'>
                <div className='flex gap-2 bg-black opacity-80 text-white px-2 py-1 rounded-md'>
                    <div>{toasterText}</div>
                </div>
            </div> : null}

            {planPurchaseShow ? <div className='absolute w-[65%]  top-[450px] rounded-lg shadow-xl  z-10 left-1/2 transform -translate-x-1/2 -translate-y-1/2'>
                <div className='flex flex-col justify-center gap-3 h-[180px] shadow-2xl border border-gray-300 items-center bg-white w-full text-vlt rounded-xl'>
                    <div>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-16 h-16">
                            <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" />
                        </svg>
                    </div>
                    <div className='text-2xl font-extrabold'>Successful Purchase</div>
                </div>
            </div> : null}

            <div className='bg-[#fafff9] py-3 shadow-lg px-3 flex justify-between items-center'>
                <div className='font-semibold'>
                    <img src={logo_wiki} className="w-24 h-6" alt="logo" />
                </div>

            </div>
            {/* <Slider /> */}
            <div className="box  relative  shadow-xl mx-4 mt-5" onClick={() => navigate('/invite')}>
                <img src={refer} alt="invite_image" className='rounded-xl' />
                <div className='flex flex-col  absolute top-1 left-2 m-1'>
                    <div className='text-2xl font-extrabold text-white'>Invite friends to make money together</div>
                    <div className='text-center shadow-xl px-4 py-1 rounded-full text-white text-xl font-extrabold button_bg'>Implement friends right away</div>
                </div>
            </div>
            <div>
                <ReactModal
                    isOpen={modalIsOpen}
                    style={customStyles}
                    contentLabel="Enter Project Quantity"
                    ariaHideApp={false}

                >
                    <h1 className='text-gray-600 mb-3 text-xl'>Are you Sure?</h1>
                    <div>
                        <button onClick={() => closeModal('ok')} className='bg-vlt text-white px-2 py-1 rounded-lg shadow-md w-[64px]'>Yes</button>
                        <button onClick={() => closeModal('cancel')} className='bg-vlt text-white px-2 py-1 rounded-lg shadow-md w-[64px] ml-2'>cancel</button>
                    </div>
                </ReactModal>
            </div>

            <div>
                <ReactModal
                    isOpen={welcomeShow}
                    style={customStyles2}
                    contentLabel="Notice"
                    ariaHideApp={false}
                >
                    <div className='w-full rounded-lg shadow-xl z-10  border border-gray-400'>
                        <div className='flex gap-2 flex-col bg-white w-full text-blue-500 rounded-md'>
                            <div className='bg-vlt text-center p-1 text-lg shadow-md text-white'>Notice</div>
                            <div className='flex flex-col p-2 text-gray-600 text-xs gap-2 font-bold'>
                                <div>Welcome to Wikiwandballoon investment Platform</div>
                                <div>Let  Wikiwandballoon create unlimited wealth with you.</div>
                                <div>The  Wikiwandballoon app is officialy launched, let us walk together on the road to wealth.</div>
                                <div>Invest 300 &#8377; Earn 45 &#8377; Daily</div>
                                <div>Invest 700 &#8377; Earn 135 &#8377; Daily</div>
                                <div>Invest 1500 &#8377; Earn 270 &#8377; Daily</div>
                                <div>Invest 3500 &#8377; Earn 605 &#8377; Daily</div>
                                <div>Invest 7000 &#8377; Earn 12300 &#8377; Daily</div>
                            </div>
                            <div className='text-center text-gray-600 font-semibold p-2 border-t border-gray-600'
                                onClick={(e) => {
                                    setWelcomeShow(false);
                                    localStorage.setItem('pop_up_closed', 1);
                                }}>
                                Ok
                            </div>
                        </div>
                    </div>
                </ReactModal>
            </div>

            {/*Marquee Implementation*/}
            <div className="bg-vlt rounded-full items-center px-2 text-white relative flex overflow-x-hidden h-10 mx-auto mt-2 border-2 border-gray-100 sm:w-3/5 lg:w-3/5 overflow-y-hidden">
                <div>
                    <VolumeUpOutlined />
                </div>
                <div className="py-12 animate-marquee flex flex-col whitespace-nowrap">
                    <span className="mx-4 text-sm">91915***05 Member withdrawl 100000 Rs</span>
                    <span className="mx-4 text-sm">91702***84 Member withdrawl 30000 Rs</span>
                    <span className="mx-4 text sm">91827***42 Member withdrawl 2000 Rs</span>
                    <span className="mx-4 text sm">91770***28 Member withdrawl 500 Rs</span>
                    <span className="mx-4 text sm">91983***17 Member withdrawl 100000 Rs</span>
                </div>
            </div>

            {/*Plans Cards*/}
            <div className="card_grid grid grid-cols-1 sm:w-3/5 lg:w-3/5 w-[90%] mx-auto mt-2 mb-20">

                {userDetails && amountDetails?.plan_state && (
                    <div className='grid grid-cols-1 gap-1'>
                        {userDetails && (amountDetails.plan_state[0] === 0) ? (
                            <span className='pointer-events-none'>
                                <Card product_type={"long"} product_image={img1} handleClick={handleClick} plan_name={"Wikiwandballoon 1"} plan_cycle={60} plan_daily_earning={45} plan_amount={300} plan_type={'Big Plan'} />
                            </span>
                        ) : (
                            <span>
                                <Card product_type={"long"} product_image={img1} handleClick={handleClick} plan_name={"Wikiwandballoon 1"} plan_cycle={60} plan_daily_earning={45} plan_amount={300} plan_type={'Big Plan'} />
                            </span>
                        )}

                        {userDetails && (amountDetails.plan_state[1] === 0) ? (
                            <span className='pointer-events-none'>
                                <Card product_type={"long"} product_image={img2} handleClick={handleClick} plan_name={"Wikiwandballoon 2"} plan_cycle={60} plan_daily_earning={135} plan_amount={700} plan_type={'Big Plan'} />
                            </span>
                        ) : (
                            <span>
                                <Card product_type={"long"} product_image={img2} handleClick={handleClick} plan_name={"Wikiwandballoon 2"} plan_cycle={60} plan_daily_earning={135} plan_amount={700} plan_type={'Big Plan'} />
                            </span>
                        )}

                        {userDetails && (amountDetails.plan_state[2] === 0) ? (
                            <span className='pointer-events-none'>
                                <Card product_type={"long"} product_image={img3} handleClick={handleClick} plan_name={"Wikiwandballoon 3"} plan_cycle={60} plan_daily_earning={270} plan_amount={1500} plan_type={'Big Plan'} />
                            </span>
                        ) : (
                            <span>
                                <Card product_type={"long"} product_image={img3} handleClick={handleClick} plan_name={"Wikiwandballoon 3"} plan_cycle={60} plan_daily_earning={270} plan_amount={1500} plan_type={'Big Plan'} />
                            </span>
                        )}

                        {userDetails && (amountDetails.plan_state[3] === 0) ? (
                            <span className='pointer-events-none'>
                                <Card product_type={"long"} product_image={img4} handleClick={handleClick} plan_name={"Wikiwandballoon 4"} plan_cycle={30} plan_daily_earning={605} plan_amount={3500} plan_type={'Big Plan'} />
                            </span>
                        ) : (
                            <span>
                                <Card product_type={"long"} product_image={img4} handleClick={handleClick} plan_name={"Wikiwandballoon 4"} plan_cycle={30} plan_daily_earning={605} plan_amount={3500} plan_type={'Big Plan'} />
                            </span>
                        )}

                        {userDetails && (amountDetails.plan_state[4] === 0) ? (
                            <span className='pointer-events-none'>
                                <Card product_type={"long"} product_image={img5} handleClick={handleClick} plan_name={"Wikiwandballoon 5"} plan_cycle={30} plan_daily_earning={1230} plan_amount={7000} plan_type={'Big Plan'} />
                            </span>
                        ) : (
                            <span>
                                <Card product_type={"long"} product_image={img5} handleClick={handleClick} plan_name={"Wikiwandballoon 5"} plan_cycle={30} plan_daily_earning={1230} plan_amount={7000} plan_type={'Big Plan'} />
                            </span>
                        )}

                        {userDetails && (amountDetails.plan_state[5] === 0) ? (
                            <span className='pointer-events-none'>
                                <Card product_type={"long"} product_image={img6} handleClick={handleClick} plan_name={"Wikiwandballoon 6"} plan_cycle={30} plan_daily_earning={2000} plan_amount={9500} plan_type={'Big Plan'} />
                            </span>
                        ) : (
                            <span>
                                <Card product_type={"long"} product_image={img6} handleClick={handleClick} plan_name={"Wikiwandballoon 6"} plan_cycle={30} plan_daily_earning={2000} plan_amount={9500} plan_type={'Big Plan'} />
                            </span>
                        )}

                        {/* {userDetails && (amountDetails.plan_state[6] === 0) ? (
                            <span className='pointer-events-none'>
                                <Card product_type={"long"} product_image={wind3} handleClick={handleClick} plan_name={"Windharvester 7"} plan_cycle={365} plan_daily_earning={3100} plan_amount={20000} plan_type={'Big Plan'} />
                            </span>
                        ) : (
                            <span>
                                <Card product_type={"long"} product_image={wind3} handleClick={handleClick} plan_name={"Windharvester 7"} plan_cycle={365} plan_daily_earning={3100} plan_amount={20000} plan_type={'Big Plan'} />
                            </span>
                        )} */}

                        {/* {userDetails && (amountDetails.plan_state[7] === 0) ? (
                            <span className='pointer-events-none'>
                                <Card product_type={"long"} product_image={wind4} handleClick={handleClick} plan_name={"Windharvester 8"} plan_cycle={365} plan_daily_earning={2500} plan_amount={35000} plan_type={'Big Plan'} />
                            </span>
                        ) : (
                            <span>
                                <Card product_type={"long"} product_image={wind4} handleClick={handleClick} plan_name={"Windharvester 8"} plan_cycle={365} plan_daily_earning={2500} plan_amount={35000} plan_type={'Big Plan'} />
                            </span>
                        )} */}

                        {/* {userDetails && (amountDetails.plan_state[8] === 0) ? (
                            <span className='pointer-events-none'>
                                <Card product_type={"long"} product_image={wind1} handleClick={handleClick} plan_name={"Windharvester 9"} plan_cycle={365} plan_daily_earning={4000} plan_amount={60000} plan_type={'Big Plan'} />
                            </span>
                        ) : (
                            <span>
                                <Card product_type={"long"} product_image={wind1} handleClick={handleClick} plan_name={"Windharvester 9"} plan_cycle={365} plan_daily_earning={4000} plan_amount={60000} plan_type={'Big Plan'} />
                            </span>
                        )} */}
                    </div>)}


            </div>



            {/*Navigation Bar 2 bg-[#1cb5b2]*/}
            {welcomeShow?(
                <div className="fixed bottom-0 z-10 bg-white  rounded-none text-gray-800 flex overflow-x-hidden  mx-auto mt-2 border-2 border-gray-200 shadow-xl w-full overflow-y-hidden">
                <div className="flex flex-row justify-around items-center w-full py-2">
                    <div className='cursor-pointer mx-2 flex flex-col justify-center items-center'>
                        <img src={make_money} alt="online" className='w-4' />
                        <div className='text-xs pt-1'>make money</div>
                    </div>

                    <div className='cursor-pointer mx-2 flex flex-col justify-center items-center'>
                        <img src={financial} alt="online" className='w-4' />
                        <div className='text-xs pt-1'>financial</div>
                    </div>

                    <div className='cursor-pointer mx-2 flex flex-col justify-center items-center'>
                        <img src={rent} alt="recharge" className='w-4' />
                        <div className='text-xs pt-1'>rent</div>
                    </div>
                    <div className='cursor-pointer mx-2 flex flex-col justify-center items-center '>
                        <img src={dividend} alt="app_dwd" className='w-4' />
                        <div className='text-xs pt-1'>dividend</div>
                    </div>

                    <div className='cursor-pointer mx-2 flex flex-col justify-center items-center' >
                        <img src={user} alt="invite" className='w-4' />
                        <div className='text-xs pt-1'>user</div>
                    </div>
                </div>
            </div>
            ):(
                <div className="fixed bottom-0 z-10 bg-white  rounded-none text-gray-800 flex overflow-x-hidden  mx-auto mt-2 border-2 border-gray-200 shadow-xl w-full overflow-y-hidden">
                <div className="flex flex-row justify-around items-center w-full py-2">
                    <div className='cursor-pointer mx-2 flex flex-col justify-center items-center'>
                        <img src={make_money} alt="online" className='w-4' />
                        <div className='text-xs pt-1'>make money</div>
                    </div>

                    <div className='cursor-pointer mx-2 flex flex-col justify-center items-center' onClick={() => navigate('/financial')} >
                        <img src={financial} alt="online" className='w-4' />
                        <div className='text-xs pt-1'>financial</div>
                    </div>

                    <div className='cursor-pointer mx-2 flex flex-col justify-center items-center' onClick={() => navigate('/record')}>
                        <img src={rent} alt="recharge" className='w-4' />
                        <div className='text-xs pt-1'>rent</div>
                    </div>
                    <div className='cursor-pointer mx-2 flex flex-col justify-center items-center ' onClick={() => navigate('/project')}>
                        <img src={dividend} alt="app_dwd" className='w-4' />
                        <div className='text-xs pt-1'>dividend</div>
                    </div>

                    <div className='cursor-pointer mx-2 flex flex-col justify-center items-center' onClick={() => navigate('/mine')}>
                        <img src={user} alt="invite" className='w-4' />
                        <div className='text-xs pt-1'>user</div>
                    </div>
                </div>
            </div>
            )}
        </div>
    )
}

export default Home