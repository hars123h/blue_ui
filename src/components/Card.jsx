import wind_turbines from '../images/wind-turbines.svg';
import wind from '../images/wind.jpg';
import React from 'react';


//[#0096D5] [#00bcd4]


const Card = ({product_type, product_image, plan_name, plan_type, plan_amount, plan_daily_earning, plan_cycle, handleClick}) => {
  
 
  return (
    <div className='mx-2 mb-1 shadow-2xl rounded-xl bg-[#fafff9] p-3 border border-gray-400'>
        <div className="title text-[#464945] font-bold text-lg">{plan_name}</div>        
        <div className="info p-2 text-sm flex items-center gap-2">
            <img src={product_image} alt="comp_img" className='shadow-xl h-24 w-20 rounded-md' />
            <div className='text-md w-full flex flex-col gap-2'>
              {/* {product_type==='long' && (<div className="text-xs text-red-700 font-bold mb-4">Daily Withdrawals</div>)} */}
              <div className="basic_info text-[#b0b2af] flex justify-between">
                <div className='font-bold'>Project Amount: </div>
                <div className='text-black font-bold'>&#8377;{new Intl.NumberFormat().format(plan_amount)}</div>
              </div>
              <div className="basic_info  text-[#b0b2af] flex justify-between">
                <div className='font-bold'>Daily Earnings: </div>
                <div className='text-black font-bold'>&#8377;{new Intl.NumberFormat().format(plan_daily_earning)}</div>
              </div>
              <div className="basic_info  text-[#b0b2af] flex justify-between">
                <div className='font-bold'>Project Cycle:</div> 
                <div className='text-black font-bold'>{plan_cycle} days</div>
              </div>
              <div className="basic_info  text-[#b0b2af] flex justify-between">
                <div className='font-bold'>Total Earning: </div>
                <div className='text-black font-bold'>&#8377;{new Intl.NumberFormat().format(plan_cycle*plan_daily_earning)}</div>
              </div>
            </div>

            {/* {(plan_name==='Walton Plan 6' || plan_name==='Walton Plan 7' || plan_name==='Walton Plan 8' )?<div className="cursor-pointer btn text-white text-center p-2 mt-1 text-lg rounded-md  w-4/5 mx-auto bg-red-400"
            >Click to buy</div>: */}

            
        </div>
        <div className="cursor-pointer btn text-white font-extrabold text-center  py-1  px-2 mt-1 text-md rounded-full shadow-md  w-4/5 mx-auto bg-vlt"
            onClick={()=>handleClick(product_type ,plan_name, plan_type, plan_amount, plan_daily_earning, plan_cycle)}>Invest</div>
    </div>
  )
}

export default Card