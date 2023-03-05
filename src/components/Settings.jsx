import React from 'react';
import setting_bank from '../images/setting_bank.png';
import setting_pwd from '../images/setting_pwd.png';
import { useNavigate, useLocation } from 'react-router-dom';


const Settings = () => {

    const navigate = useNavigate();
    const loc = useLocation();
    //console.log(loc);

    //[#2e9afe]
    return (
        <div className='bg-[#f7f9f8] h-screen'>
            <div className="options text-center flex bg-vlt shadow-xl items-center text-white text-2xl p-2 font-medium">
            <svg xmlns="http://www.w3.org/2000/svg" onClick={() => navigate('/mine')} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4  storke-white  cursor-pointer">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                </svg>
                <div className='text-white text-sm flex-grow'>Update details</div>
            </div>

            {/* [#4daaff] */}
            <div className="box gap-2 flex flex-col text-gray-500 font-semibold bg-[#fafff9] rounded-xl  shadow-xl m-4 border border-gray-300">
                <div onClick={() => navigate('/bank', { state: { withdrawalPassword: loc.state.withdrawalPassword, loginPassword: loc.state.loginPassword } })}
                    className='flex gap-2 items-center  text-sm p-3 m-1 border-b border-white cursor-pointer'>
                    <div className='flex w-full justify-between'>
                        <div  className='flex gap-2 items-center'>
                            <div><img src={setting_bank} alt="bnk_img" width={20} /></div>
                            <div>My Bank</div>
                        </div>
                        <div>
                            <div>
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 stroke-vlt">
                                    <path fillRule="evenodd" d="M16.28 11.47a.75.75 0 010 1.06l-7.5 7.5a.75.75 0 01-1.06-1.06L14.69 12 7.72 5.03a.75.75 0 011.06-1.06l7.5 7.5z" clipRule="evenodd" />
                                </svg>
                            </div>
                        </div>
                    </div>

                </div>

                <div onClick={() => navigate('/change_login_password', { state: { withdrawalPassword: loc.state.withdrawalPassword, loginPassword: loc.state.loginPassword } })}
                    className='flex gap-2 items-center  text-sm p-3 m-1 border-b border-white cursor-pointer'>

                    <div className='flex w-full justify-between'>
                        <div className='flex gap-2 items-center'>
                            <div><img src={setting_pwd} alt="bnk_pwd" width={20} /></div>
                            <div>Change Login Password</div>
                        </div>
                        <div>
                            <div>
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 stroke-vlt">
                                    <path fillRule="evenodd" d="M16.28 11.47a.75.75 0 010 1.06l-7.5 7.5a.75.75 0 01-1.06-1.06L14.69 12 7.72 5.03a.75.75 0 011.06-1.06l7.5 7.5z" clipRule="evenodd" />
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>

                <div onClick={() => navigate('/change_withdrawal_password', { state: { withdrawalPassword: loc.state.withdrawalPassword, loginPassword: loc.state.loginPassword } })}
                    className='flex gap-2 items-center  text-sm p-3 m-1 border-b border-white cursor-pointer'>

                    <div className='flex w-full justify-between'>
                        <div className='flex gap-2 items-center'>
                            <div><img src={setting_pwd} alt="bnk_pwd" width={20} /></div>
                            <div>Change Withdrawal Password</div>
                        </div>
                        <div>
                            <div>
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 stroke-vlt">
                                    <path fillRule="evenodd" d="M16.28 11.47a.75.75 0 010 1.06l-7.5 7.5a.75.75 0 01-1.06-1.06L14.69 12 7.72 5.03a.75.75 0 011.06-1.06l7.5 7.5z" clipRule="evenodd" />
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>
            </div>



        </div>
    )
}

export default Settings