import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import 'react-toastify/dist/ReactToastify.min.css';
import { ToastContainer, toast } from 'react-toastify'
import ChatLoading from "./ChatLoading";
import axios from "axios";
import { ChatState } from "../../Context/ChatProvider";

import UserListItem from "./UserListItem";

const SideDrawer = () => {
    const navigate = useNavigate();

    const [open, setOpen] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [showSearch, setShowSearch] = useState(false);
    const [search, setSearch] = useState();
    const [searchResult, setSearchResult] = useState([]);
    const [loadingChat, setLoadingChat] = useState(false);
    const [loading, setLoading] = useState(false);

    const { user, setSelectedChat, chats, setChats } = ChatState();

    const logoutHandler = () => {
        localStorage.removeItem("userInfo");
        navigate("/");

    }

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!search) {
            return;
        }
        try {
            setLoading(true);
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            };
            const { data } = await axios.get(`/api/user?search=${search}`, config);
            setLoading(false);
            setSearchResult(data);
        } catch (error) {
            toast(`🦄 Error occured`, {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
            });
            setLoading(false);
        }
    }

    const accessChat = async (userId) => {
        try {
            setLoadingChat(true);

            const config = {
                headers: {
                    "Content-type": "application/json",
                    Authorization: `Bearer ${user.token}`,
                },
            };
            const { data } = await axios.post("/api/chat", { userId }, config);
            if (!chats.find((c) => c._id === data._id)) {
                setChats([data, ...chats]);
            }
            setSelectedChat(data);
            setLoadingChat(false);
            setShowSearch(false);
        } catch (error) {
            toast('🦄 can not access chat ', {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",

            });

        }
    };

    return (
        <div>

            <ToastContainer />
            <nav class="bg-transparent border-gray-200 dark:bg-gray-900 ">
                <div class="mt-2 max-w-screen-xl flex flex-wrap  justify-between mx-auto p-4 outline outline-offset-2 outline-white/30  backdrop-blur-sm bg-white/30 rounded-md">
                    <button onClick={() => {
                        setShowSearch(true)
                    }} class="flex items-center space-x-3 rtl:space-x-reverse">
                        <img src="https://media0.giphy.com/media/v1.Y2lkPTc5MGI3NjExNWNlNnA4MGIwa29teXk5MWM5amtwaGdwM3E2M2p0ajdhdWRydHgwciZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/KztT2c4u8mYYUiMKdJ/giphy.gif" className="h-12 w-12 rounded-lg" />
                        <span class=" text-2xl items-center font-madimi-one text-white  whitespace-nowrap dark:text-white">Search Friend</span>
                    </button>
                    <div class="flex-col  relative md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse">
                        <button onClick={() => {
                            if (open) {
                                setOpen(false);
                            }
                            else {
                                setOpen(true);
                            }
                        }} id="dropdownNavbarLink" data-dropdown-toggle="dropdownNavbar" class="flex items-center justify-between w-full py-2 px-3 text-white rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 md:w-auto dark:text-white md:dark:hover:text-blue-500 dark:focus:text-white dark:border-gray-700 dark:hover:bg-gray-700 md:dark:hover:bg-transparent"><img src={user.pic} className="w-10 h-10 rounded-full" /> <svg class="w-2.5 h-2.5 ms-2.5 text-sky-200" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
                                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 4 4 4-4" />
                            </svg></button>

                        <div id="dropdownNavbar" class={`z-50 ${!open ? 'hidden' : ''} absolute font-normal bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700 dark:divide-gray-600`}>
                            <ul class=" py-2 text-sm text-gray-700 dark:text-gray-400 font-madimi-one" aria-labelledby="dropdownLargeButton">
                                <li>
                                    <button onClick={() => {
                                        setShowModal(true);
                                    }} class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Information</button>
                                </li>
                                <li>
                                    <a href="#" class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Settings</a>
                                </li>
                                <li>
                                    <a href="#" class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Earnings</a>
                                </li>
                            </ul>
                            <div class="py-1">
                                <button onClick={() => {
                                    logoutHandler()
                                }} class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white">Sign out</button>
                            </div>
                        </div>
                    </div>
                    <div class=" justify-between items-center hidden w-full md:flex md:w-auto md:order-1" id="navbar-user">
                        <ul class="flex flex-col font-medium p-4 md:p-0 mt-4 border border-gray-100 rounded-lg bg-gray-50 md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
                            <li>
                                <a href="#" class="block py-2 px-3 text-white bg-blue-700 rounded md:bg-transparent md:text-blue-700 md:p-0 md:dark:text-blue-500" aria-current="page">Home</a>
                            </li>
                            <li>
                                <a href="#" class="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700">About</a>
                            </li>
                            <li>
                                <a href="/heartbeat" class="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700">This for You</a>
                            </li>
                            <li>
                                <a href="#" class="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700">Pricing</a>
                            </li>
                            <li>
                                <a href="#" class="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700">Contact</a>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
            {showModal ? (
                <>
                    <div
                        className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none"
                    >
                        <div className="relative w-auto my-6 mx-auto max-w-3xl">
                            {/*content*/}
                            <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                                {/*header*/}
                                <div className="flex items-start justify-between p-5 border-b border-solid border-blueGray-200 rounded-t">
                                    <h3 className="text-3xl font-madimi-one">
                                        {user.name}
                                    </h3>
                                    <button
                                        className="p-1 ml-auto bg-transparent border-0 text-black opacity-5 float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                                        onClick={() => setShowModal(false)}
                                    >
                                        <span className="bg-transparent text-black opacity-5 h-6 w-6 text-2xl block outline-none focus:outline-none">
                                            ×
                                        </span>
                                    </button>
                                </div>
                                {/*body*/}
                                <div className="relative p-6 flex-auto">
                                    <img src={user.pic} className="w-98 h-98" />
                                </div>
                                {/*footer*/}
                                <div className="flex items-center justify-end p-6 border-t border-solid border-blueGray-200 rounded-b">

                                    <button
                                        className="bg-sky-400 text-white active:bg-emerald-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                                        type="button"
                                        onClick={() => setShowModal(false)}
                                    >
                                        Close
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="opacity-95 fixed inset-0 z-40 bg-neutral-300"></div>
                </>
            ) : null}

            {
                showSearch ? (
                    <>
                        <div className="flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50">
                            <div className="relative h-screen w-96">
                                <div className="absolute inset-y-0 left-0 w-96 bg-white">
                                    <div className="flex justify-between mx-2 my-4 pb-2 border-b-4 border-sky-200">
                                        <h1 className="font-madimi-one text-2xl text-sky-400">Where is Guys</h1>
                                        <button onClick={() => {
                                            setShowSearch(false)
                                        }} className="px-2 py-2 bg-transparent hover:bg-sky-400 rounded-lg hover:text-white">
                                            <svg class="w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                                                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
                                            </svg>
                                        </button>
                                    </div>
                                    <div className="mx-2">
                                        <form class="max-w-md mx-auto">
                                            <label for="default-search" class="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white">Search</label>
                                            <div class="relative">
                                                <div class="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                                                    <svg class="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                                                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
                                                    </svg>
                                                </div>
                                                <input onChange={(e) => {
                                                    setSearch(e.target.value)
                                                }} type="search" id="default-search" class="block w-full p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Search Mockups, Logos..." required />
                                                <button onClick={(e) => {

                                                    handleSearch(e)
                                                }} class="text-white absolute end-2.5 bottom-2.5 bg-sky-400 hover:bg-sky-500 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-2 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Search</button>
                                            </div>
                                        </form>
                                    </div>
                                    <div className="mx-2 mt-4">
                                        {loading ? <ChatLoading /> : (
                                            searchResult.map(user => (
                                                <UserListItem
                                                    key={user._id}
                                                    user={user}
                                                    handleFunction={() => {
                                                        accessChat(user._id)
                                                    }}
                                                />
                                            ))
                                        )}

                                    </div>

                                </div>

                            </div>
                        </div>
                        <div className="opacity-95 fixed inset-0 z-40 bg-neutral-300"></div>
                    </>
                ) : null
            }





        </div>
    )
}
export default SideDrawer