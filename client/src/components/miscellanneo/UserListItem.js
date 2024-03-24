import React from "react";


const UserListItem = ({ user, handleFunction }) => {

    return (
        <div className=" m-2 rounded-lg bg-slate-300 hover:bg-sky-400">
            <button onClick={handleFunction} className="flex items-center">
                <img src={user.pic} className="m-2 w-10 h-10 rounded-full object-contain" />
                <div>
                    <h2 className="font-madimi-one">{user.name}</h2>
                    <h3 clasName="font-mono">{user.email}</h3>
                </div>
            </button>
        </div>
    )

}
export default UserListItem