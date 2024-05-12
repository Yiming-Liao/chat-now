/* eslint-disable react/prop-types */
import Tabs from "../components/Tabs.jsx"
import { UserRound } from 'lucide-react';
import { MessagesSquare } from 'lucide-react';
import { socket } from "../socket/socket.js";

const ChatPage = ({ userName, setUserName, setIsChatPage, userCount, isLoadingUserCount, usersArray }) => {

  // 回首頁
  const handleHomePage = () => {
    const yes = confirm("🏠 Go back to home page?\n⚠️ You will lose all the messages.");
    if (yes) {
      setIsChatPage(false);
      setUserName("");
      socket.emit("user-disconnect", socket.id);
    }
  }

  return (
    <div className="h-[100svh] flex flex-col">

      <div className="fixed top-0 z-20 w-full bg-base-100 mt-2">
        <div className="flex mx-3">
          <div className="flex mr-auto cursor-pointer"
            onClick={handleHomePage}
          >
            <MessagesSquare className="w-8 h-8 self-center ml-3 text-secondary" />
            <h1 className="text-3xl p-2 pb-1 mr-auto font-semibold text-slate-500">Chat Now</h1>
          </div>

          <label htmlFor="my_modal_7" className="flex cursor-pointer">
            <UserRound className='text-slate-500 mt-3 mr-1' />
            {!isLoadingUserCount ? (
              <div className='text-secondary font-semibold text-lg mt-3 mr-6' >{userCount}</div>
            ) : (
              <span className="loading loading-ring loading-xs"></span>
            )}
          </label>

        </div>
        <div className="p-3 pb-0 mb-2 ml-3 text-slate-500">
          Name:
          <span className="font-semibold"> {userName}</span>
        </div>
      </div>
      <div className="min-h-24" />  {/* behind fixed */}


      <div>
        <Tabs userName={userName} />
      </div>


    </div>
  )
}
export default ChatPage