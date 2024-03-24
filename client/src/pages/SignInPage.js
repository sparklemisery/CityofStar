
import React from "react"
import { useState } from "react"
import Login from "../components/Authentication/Login"
import Signup from "../components/Authentication/Signup"
function SignInPage() {
    const [loginState, setLoginState] = useState(true);

    return (
        <div className="flex flex-col items-center px-6 py-8 mx-auto md:h-screen lg:py=0 ">
            <a href="#" className="flex items-center mb-6 text-2xl font-madimi-one text-sky-400">
                <img className="w-12 h-12 mr-2" src="https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExOTl5cWF2M25nOXRrcmNwcXJuZGtrbG1nMXNrbWM2cTY2bDU5MXkxOCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/25688FI5AUUVf04upZ/giphy.gif" alt="image" />
                i wanna be here with you
            </a>
            <div className="w-full  flex flex-row justify-around  bg-white rounded-tl-lg rounded-tr-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700" >

                <button className={`w-5/12 h-8 text-white  ${loginState ? 'bg-sky-400' : 'bg-sky-200'}  rounded-lg hover:bg-sky-400`} onClick={() => {
                    setLoginState(true);
                }}>Login</button>


                <button className={`w-5/12 text-white ${loginState ? 'bg-sky-200' : 'bg-sky-400'} rounded-lg hover:bg-sky-400`} onClick={() => {
                    setLoginState(false);
                }}>Sign up</button>

            </div>
            {
                (loginState && <Login />) || (!loginState && <Signup />)
            }

        </div>
    )
}
export default SignInPage