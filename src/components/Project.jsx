import React, { useEffect, useState } from 'react';
import { useNavigate, } from 'react-router-dom';
import { RotatingLines } from 'react-loader-spinner';
import DateDifference from '../utility/DateDifference.js';
import axios from 'axios';
import BASE_URL from '../api_url';

const addDays = (date, days) => {
    var result = new Date(date);
    result.setDate(result.getDate() + days);
    //console.log(result);
    return result;
}


const Project = () => {
    const navigate = useNavigate();
    const [userDetails, setUserDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const [current_tab, setCurrent_tab] = useState('earning');
    const [toasterShow, setToasterShow] = useState(false);
    const [toasterText, setToasterText] = useState('');
    const [investment_amount, setInvestment_amount] = useState(0);
    const [accumulated_income, setAccumulated_income] = useState(0);
    const [today_income, setToday_income] = useState(0);


    const toaster = (text) => {
        setToasterText(text);
        setToasterShow(true);
        setTimeout(() => {
            setToasterShow(false);
            navigate('/mine');
        }, 5000);
    }


    const getUserDetails = async () => {
        // const docRef = doc(db, 'users', auth.currentUser.uid);
        await axios.post(`${BASE_URL}/get_user`, { user_id: localStorage.getItem('uid') }).then(async ({ data: document }) => {
            if (document) {
                setUserDetails(document);
                //console.log(document);
                if (('plans_purchased' in document) === false) {
                    toaster('Please buy a plan first!');
                }
                if (document.plans_purchased.length > 0) {
                    var earn = 0;
                    var ia = 0, ai = 0, ti = 0;
                    var temp = document.plans_purchased.map((element) => {
                        ia+=element.plan_amount;

                        var days = DateDifference(new Date(element.date_till_rewarded), new Date(Math.min(new Date(), addDays(new Date(element.date_purchased), element.plan_cycle))));
                        var days2 = DateDifference(new Date(element.date_till_rewarded), addDays(new Date(element.date_purchased), element.plan_cycle));
                        //console.log(days);
                        if (element.product_type === 'short') {
                            if (days === element.plan_cycle) {
                                ti+=element.plan_daily_earning;
                                ai+= (days * element.quantity * element.plan_daily_earning);
                                earn = (days * element.quantity * element.plan_daily_earning);
                                return {
                                    ...element,
                                    date_till_rewarded: new Date(Math.min(new Date(), addDays(new Date(element.date_purchased), element.plan_cycle))).toDateString()
                                }
                            } else {
                                return {
                                    ...element
                                }
                            }
                        }

                        if (days > element.plan_cycle) {
                            return {
                                ...element
                            }
                        }
                        if((DateDifference(new Date(element.date_purchased), new Date(element.date_till_rewarded)))>=1) {
                            ti+=element.plan_daily_earning;
                        }
                        ai+= DateDifference(new Date(element.date_purchased), new Date(element.date_till_rewarded)) * element.quantity * element.plan_daily_earning;
                        //console.log(ai);
                        earn = earn + (days * element.quantity * element.plan_daily_earning);
                        return {
                            ...element,
                            date_till_rewarded: new Date(Math.min(new Date(), addDays(new Date(element.date_purchased), element.plan_cycle))).toDateString()
                        }
                    });

                    setInvestment_amount(ia);
                    setAccumulated_income(ai);
                    setToday_income(ti);


                    await axios.post(`${BASE_URL}/update_earning`, {
                        earn: earn,
                        temp: temp,
                        user_id: localStorage.getItem('uid')
                    })
                        .then(() => console.log('Reward successfully updated'))
                        .catch(error => console.log('Some error Occured'));
                }
            } else {
                console.log('Data not found');
            }
            setLoading(false);

        }).then(() => {
            //console.log('This is working');
        })
            .catch(error => console.log('Some error occured', error));
    }

    useEffect(() => {
        setLoading(true);
        getUserDetails();
        //console.log(userDetails);
        //console.log('Use Effect Ran');
    }, []);

    if (loading) {
        return (
            <div className="grid place-items-center h-screen ">
                <div className='flex flex-col justify-center items-center'>
                    <RotatingLines
                        strokeColor="grey"
                        strokeWidth="2"
                        animationDuration="0.75"
                        width="40"
                        visible={true}
                    />
                    <div className='text-lg text-gray-500'>Loading...</div>
                </div>
            </div>
        )
    }


    //[#2e9afe]
    return (
        <div className='md:h-screen  xs:h-[700px]  h-screen relative'>
            {toasterShow ? <div className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2'>
                <div className='flex gap-2 bg-black opacity-80 text-white px-2 py-1 rounded-md'>
                    <div>{toasterText}</div>
                </div>
            </div> : null}

            <div className="">
                {/* <svg xmlns="http://www.w3.org/2000/svg" onClick={() => navigate(-1)} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4  storke-white  cursor-pointer">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3" />
                </svg> */}
                <div className='flex-grow text-white text-center text-sm bg-[#000084] py-2'>Project Record</div>
            </div>

            {/* This is the curved part */}
            <div className="flex flex-col mine_image1 items-center text-white h-56 -translate-y-[1px] p-5">

                <div className='flex flex-col items-center w-full gap-1'>
                    <div className='text-3xl'>&#8377; {today_income}</div>
                    <div className='text-xs font-light'>Today's estimated income</div>
                </div>
                <div className='flex flex-col gap-3 w-full mt-3 p-3 text-sm'>
                    <div className='flex justify-between'>
                        <div className='font-light'>Investment amount</div>
                        <div className='font-bold'>&#8377; {investment_amount}</div>
                    </div>
                    <div className='flex justify-between'>
                        <div className='font-light'>Accumulated income</div>
                        <div className='font-bold'>&#8377; {accumulated_income}</div>
                    </div>
                </div>
            </div>
            {/* curver part ends here */}

            {/* <div className='custom_card -translate-y-14 bg-[#ffffff] mx-auto w-[90%] flex flex-col items-center p-3 shadow-2xl border border-gray-300 rounded-xl'>
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


            {/* <div className='records w-full flex bg-[#d3d6fe] items-center'>
                <div onClick={() => setCurrent_tab('earning')} className={`cursor-pointer h-[40px] flex items-center justify-center w-1/2 text-center border-b-4 font-semibold ${current_tab === 'earning' ? 'border-red-600 text-red-500' : 'text-white'}`}>Earning</div>
                <div onClick={() => setCurrent_tab('completed')} className={`cursor-pointer h-[40px] flex items-center justify-center w-1/2 text-center border-b-4 ${current_tab === 'completed' ? 'border-red-600 text-red-500' : 'text-white'}`}>Completed</div>
            </div> */}

            <div className=' mx-auto w-full mt-2 pb-10'>
                {
                     userDetails && ('plans_purchased' in userDetails) && (
                        userDetails.plans_purchased.map((element, index) => {
                            if (element.plan_daily_earning * element.plan_cycle !== DateDifference(new Date(element.date_purchased), new Date(element.date_till_rewarded)) * element.quantity * element.plan_daily_earning) {
                                return (
                                    <div className='custom_card -translate-y-14 bg-[#ffffff] mt-2 mx-auto w-[90%] flex flex-col items-center p-3 shadow-2xl border border-gray-300 rounded-xl'>
                                        <div className="w-full mx-3">
                                            <div className='text-lg font-bold'>{element.plan_name}</div>
                                            <div className='text-gray-500 text-xs'>Purschase Date: {element.date_purchased}</div>
                                            <div className='text-red-500 text-xs'>End Date: {addDays(new Date(element.date_purchased), element.plan_cycle).toDateString()}</div>
                                        </div>
                                        <div className='flex w-full justify-around p-2 mt-5'>
                                            <div className='flex flex-col items-center border-r-2 border-gray-400 pr-4'>
                                                <div className='text-black font-bold'><span className='text-[#10a6b7]'>&#8377;</span> {element.plan_amount}</div>
                                                <div className='text-xs text-gray-400'>Investment Amount</div>
                                            </div>
                                            <div className='flex flex-col items-center'>
                                                <div className='text-black font-bold'><span className='text-[#10a6b7]'>&#8377;</span> {DateDifference(new Date(element.date_purchased), new Date(element.date_till_rewarded)) * element.quantity * element.plan_daily_earning}</div>
                                                <div className='text-xs text-gray-400'>Received Amount</div>
                                            </div>
                                        </div>
                                        <div className='text-white w-[70%] mx-auto rounded-full py-2 mt-4 text-sm text-center bg-gray-400'>
                                            {(element.plan_daily_earning * element.plan_cycle === DateDifference(new Date(element.date_purchased), new Date(element.date_till_rewarded)) * element.quantity * element.plan_daily_earning) ? 'Finished' : 'Running'}
                                        </div>
                                    </div>
                                )
                            }
                        })
                    )
                }
            </div>

            <div className=' mx-auto w-full mt-2 pb-10'>
                {
                     userDetails && ('plans_purchased' in userDetails) && (
                        userDetails.plans_purchased.map((element, index) => {
                            if (!(element.plan_daily_earning * element.plan_cycle !== DateDifference(new Date(element.date_purchased), new Date(element.date_till_rewarded)) * element.quantity * element.plan_daily_earning)) {
                                return (
                                    <div className='custom_card -translate-y-14 bg-[#ffffff] mt-2 mx-auto w-[90%] flex flex-col items-center p-3 shadow-2xl border border-gray-300 rounded-xl'>
                                        <div className="w-full mx-3">
                                            <div className='text-lg font-bold'>{element.plan_name}</div>
                                            <div className='text-gray-500 text-xs'>Purschase Date: {element.date_purchased}</div>
                                            <div className='text-red-500 text-xs'>End Date: {addDays(new Date(element.date_purchased), element.plan_cycle).toDateString()}</div>
                                        </div>
                                        <div className='flex w-full justify-around p-2 mt-5'>
                                            <div className='flex flex-col items-center border-r-2 border-gray-400 pr-4'>
                                                <div className='text-black font-bold'><span className='text-[#10a6b7]'>&#8377;</span> {element.plan_amount}</div>
                                                <div className='text-xs text-gray-400'>Investment Amount</div>
                                            </div>
                                            <div className='flex flex-col items-center'>
                                                <div className='text-black font-bold'><span className='text-[#10a6b7]'>&#8377;</span> {DateDifference(new Date(element.date_purchased), new Date(element.date_till_rewarded)) * element.quantity * element.plan_daily_earning}</div>
                                                <div className='text-xs text-gray-400'>Received Amount</div>
                                            </div>
                                        </div>
                                        <div className='text-white w-[70%] mx-auto rounded-full py-2 mt-4 text-sm text-center bg-vlt'>
                                            {(element.plan_daily_earning * element.plan_cycle === DateDifference(new Date(element.date_purchased), new Date(element.date_till_rewarded)) * element.quantity * element.plan_daily_earning) ? 'Finished' : 'Running'}
                                        </div>
                                    </div>
                                )
                            }
                        })
                    )
                }
            </div>



            {!userDetails?.plans_purchased && (
                <div className='text-2xl text-gray-400 text-center w-[90%] mx-auto p-3 m-3 border-2 border-gray-300 rounded-lg shadow-lg'>
                    No data to show!
                </div>
            )}
        </div>
    )
}

export default Project