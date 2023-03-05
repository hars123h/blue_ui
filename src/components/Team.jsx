import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useState, useLayoutEffect } from 'react';
import { getAuth } from 'firebase/auth';
import axios from 'axios';
import BASE_URL from '../api_url';
import { AmountContext } from '../App';
import { useContext } from 'react';

const Team = () => {
  const navigate = useNavigate();
  const [userDetails, setUserDetails] = useState(null);
  const [teamDetails, setTeamDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentVisible, setCurrentVisible] = useState('level1');
  const [level1, setLevel1] = useState([]);
  const [level2, setLevel2] = useState([]);
  const [level3, setLevel3] = useState([]);
  const amountDetails = useContext(AmountContext);


  const getUserDetails = async () => {
    const details = await axios.post(`${BASE_URL}/get_user`, { user_id: localStorage.getItem('uid') }).then(({ data }) => data);
    const arr1 = await axios.post(`${BASE_URL}/lvl1`, { user_id: localStorage.getItem('uid') }).then(({ data }) => data.level1);
    const arr2 = await axios.post(`${BASE_URL}/lvl2`, { user_id: localStorage.getItem('uid') }).then(({ data }) => data.level2);
    const arr3 = await axios.post(`${BASE_URL}/lvl3`, { user_id: localStorage.getItem('uid') }).then(({ data }) => data.level3);

    setUserDetails(details);
    setLevel1(arr1);
    setLevel2(arr2);
    setLevel3(arr3);
  }

  useLayoutEffect(() => {
    getUserDetails().then(() => {
      setLoading(false);
    })
  }, []);

  if (loading || userDetails === null) {
    return (
      <div className='h-screen grid place-items-center'>
        <div>Loading...</div>
      </div>
    )
  }

  return (
    <div className=''>
      {/* [#2e9afe] */}
      <div className="top flex items-center my-auto text-center h-10 p-1 bg-vlt text-white text-lg font-medium">
        <div className='absolute flex w-32 cursor-pointer' onClick={() => navigate(-1)}>
          <svg xmlns="http://www.w3.org/2000/svg"  fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4  storke-white  cursor-pointer">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
        </div>
        <div className='flex-grow'>Team</div>
      </div>

      <div className='flex flex-col items-center w-full'>
        <div className='flex text-vlt font-semibold flex-col items-center w-[90%] border border-gray-300 text-lg p-3 m-3 shadow-lg shadow-vlt rounded-lg'>
          <div>Total Member: {userDetails.directMember.length + userDetails.indirectMember.length + userDetails.in_indirectMember.length}</div>
          <div>Total Team Commission: &#8377;{(userDetails.directRecharge*(amountDetails.level1_percent)/100) + (userDetails.indirectRecharge*(amountDetails.level2_percent)/100) + (userDetails.in_indirectRecharge*(amountDetails.level3_percent)/100)}</div>
        </div>

        <div className="flex items-center  w-[90%]">
          <div className='p-3 text-center text-lg w-1/3 rounded-t-lg border border-gray-300 shadow-vlt shadow-lg text-vlt' onClick={e => setCurrentVisible('level1')}>Level 1</div>
          <div className='p-3 text-center text-lg w-1/3 rounded-t-lg border border-gray-300 shadow-vlt shadow-lg text-vlt' onClick={e => setCurrentVisible('level2')}>Level 2</div>
          <div className='p-3 text-center text-lg w-1/3 rounded-t-lg border border-gray-300 shadow-vlt shadow-lg text-vlt' onClick={e => setCurrentVisible('level3')}>Level 3</div>
        </div>

        {currentVisible === 'level1' && (
          <div className='flex text-vlt items-center font-semibold flex-col w-[90%] border border-gray-300 text-lg p-3 m-3 mt-0 shadow-lg shadow-blue-400 rounded-lg'>
            <div className='flex flex-col w-full'>
              <div>Level 1 Member: {userDetails.directMember.length}</div>
              <div>Level 1 Earning: &#8377;{(userDetails.directRecharge)*(amountDetails.level1_percent/100)}</div>
            </div>

            {level1.map((element, index) => {
              return (
                <div key={index} className='flex flex-row text-vlt font-semibold justify-between w-full border border-gray-300 text-lg p-3 m-3 shadow-lg shadow-gray-400 rounded-lg'>
                  <div>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-6 h-6">
                      <path fill-rule="evenodd" d="M18.685 19.097A9.723 9.723 0 0021.75 12c0-5.385-4.365-9.75-9.75-9.75S2.25 6.615 2.25 12a9.723 9.723 0 003.065 7.097A9.716 9.716 0 0012 21.75a9.716 9.716 0 006.685-2.653zm-12.54-1.285A7.486 7.486 0 0112 15a7.486 7.486 0 015.855 2.812A8.224 8.224 0 0112 20.25a8.224 8.224 0 01-5.855-2.438zM15.75 9a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" clip-rule="evenodd" />
                    </svg>

                  </div>
                  <div>+91 {element.mobno}</div>
                  <div>&#8377; {(element.recharge_amount)*(amountDetails.level1_percent/100)}</div>
                </div>
              )
            })}
          </div>
        )}

        {currentVisible === 'level2' && (
          <div className='flex text-vlt items-center font-semibold flex-col w-[90%] border border-gray-300 text-lg p-3 m-3 mt-0 shadow-lg shadow-blue-400 rounded-lg'>
            <div className='flex flex-col w-full'>
              <div>Level 2 Member: {userDetails.indirectMember.length}</div>
              <div>Level 2 Earning: &#8377;{(userDetails.indirectRecharge)*(amountDetails.level2_percent/100)}</div>
            </div>

            {level2.map((element, index) => {
              return (
                <div key={index} className='flex flex-row text-vlt font-semibold justify-between w-full border border-gray-300 text-lg p-3 m-3 shadow-lg shadow-gray-400 rounded-lg'>
                  <div>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-6 h-6">
                      <path fill-rule="evenodd" d="M18.685 19.097A9.723 9.723 0 0021.75 12c0-5.385-4.365-9.75-9.75-9.75S2.25 6.615 2.25 12a9.723 9.723 0 003.065 7.097A9.716 9.716 0 0012 21.75a9.716 9.716 0 006.685-2.653zm-12.54-1.285A7.486 7.486 0 0112 15a7.486 7.486 0 015.855 2.812A8.224 8.224 0 0112 20.25a8.224 8.224 0 01-5.855-2.438zM15.75 9a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" clip-rule="evenodd" />
                    </svg>

                  </div>
                  <div>+91 {element.mobno}</div>
                  <div>&#8377; {(element.recharge_amount)*(amountDetails.level2_percent/100)}</div>
                </div>
              )
            })}
          </div>
        )}

        {currentVisible === 'level3' && (
          <div className='flex text-vlt items-center font-semibold flex-col w-[90%] border border-gray-300 text-lg p-3 m-3 mt-0 shadow-lg shadow-blue-400 rounded-lg'>
            <div className='flex flex-col w-full'>
              <div>Level 3 Member: {userDetails.in_indirectMember.length}</div>
              <div>Level 3 Earning: &#8377;{(userDetails.in_indirectRecharge)*(amountDetails.level3_percent/100)}</div>
            </div>

            {level3.map((element, index) => {
              return (
                <div key={index} className='flex flex-row text-vlt font-semibold justify-between w-full border border-gray-300 text-lg p-3 m-3 shadow-lg shadow-gray-400 rounded-lg'>
                  <div>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-6 h-6">
                      <path fill-rule="evenodd" d="M18.685 19.097A9.723 9.723 0 0021.75 12c0-5.385-4.365-9.75-9.75-9.75S2.25 6.615 2.25 12a9.723 9.723 0 003.065 7.097A9.716 9.716 0 0012 21.75a9.716 9.716 0 006.685-2.653zm-12.54-1.285A7.486 7.486 0 0112 15a7.486 7.486 0 015.855 2.812A8.224 8.224 0 0112 20.25a8.224 8.224 0 01-5.855-2.438zM15.75 9a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" clip-rule="evenodd" />
                    </svg>

                  </div>
                  <div>+91 {element.mobno}</div>
                  <div>&#8377; {(element.recharge_amount)*(amountDetails.level3_percent/100)}</div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

export default Team