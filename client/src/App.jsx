import ChatPage from "./pages/ChatPage";
import { socket } from "./socket/socket"
import { UserRound } from 'lucide-react';
import { MessagesSquare } from 'lucide-react';
import { useEffect, useState } from 'react';
import { SquareArrowOutUpRight } from 'lucide-react';

const App = () => {
  const [userCount, setUserCount] = useState(0);
  const [isLoadingUserCount, setIsLoadingUserCount] = useState(false);
  const [userName, setUserName] = useState("");
  const [isChatPage, setIsChatPage] = useState(false);
  const [usersArray, setUsersArray] = useState([]);

  const handleStart = () => {
    if (userName.trim() === "") return;
    setIsChatPage(true);
    socket.emit("user-connect", socket.id, userName); // 更正這裡
  }

  // GET user counts
  useEffect(() => {
    setIsLoadingUserCount(true);  // 開始載入
    const handleNewUserCount = (newUserCount) => {
      setUserCount(newUserCount);
      setIsLoadingUserCount(false);  // 接收到數據，結束載入
    };
    socket.on("user-count", handleNewUserCount); //  等於: (newUserCount) => handleNewUserCount(newUserCount)

    socket.on("all-users", arr => {
      setUsersArray(arr);
    })
    return () => {
      socket.off("user-count", handleNewUserCount);  // 移除監聽器時也指定相同的處理函式
      socket.off("all-users");  // 移除監聽器時也指定相同的處理函式
    };
  }, []);


  return (
    <div className="w-screen h-screen">
      {!isChatPage ? (
        <div className="w-full h-[100svh] flex flex-col item-center mt-6">

          {/* LOGO */}
          <header className="w-full mt-10 cursor-default">
            <div className="w-full flex justify-center">
              <MessagesSquare className="w-11 h-11 self-center ml-3 text-secondary" />
              <h1 className="text-5xl p-3 font-semibold text-slate-500">Chat Now</h1>
            </div>
          </header>

          <main className="w-full mt-10 flex flex-col gap-3 items-center">
            {/* 上線人數 */}
            <div className="w-[300px] mx-auto flex justify-center items-center gap-3">
              <label htmlFor="my_modal_7" className="flex cursor-pointer">
                <UserRound className="w-11 h-11 self-center text-slate-400" />
                {!isLoadingUserCount ? (
                  <div className='text-secondary font-semibold text-4xl mt-[3px]' >{userCount}</div>
                ) : (
                  <span className="loading loading-ring loading-xs"></span>
                )}
              </label>
            </div>

            {/* 輸入框 Card */}
            <div className="mt-10 p-10 rounded-xl custom-shadow flex juscen items-center">
              <div className="flex flex-col items-center justify-center gap-6 w-full">
                <p className="text-slate-500">Enter your name to get started!</p>
                <input
                  className="p-2 rounded-md w-64 h-12 text-xl text-center"
                  type="text"
                  placeholder="Type Your Name..."
                  value={userName}
                  onChange={e => setUserName(e.target.value)}
                />
                <button
                  className="btn btn-primary text-white px-4 rounded-md w-20"
                  onClick={handleStart}
                >
                  Start
                </button>
              </div>
            </div>
          </main>

          {/* 我的連結 */}
          <a
            href="https://yiming-liao.github.io/" target="_blank" rel="noreferrer noopener"
            className="self-center absolute bottom-6 text-slate-400 flex gap-1"
          >
            <SquareArrowOutUpRight className="w-5 h-5 self-center" />
            Yiming Liao
          </a>

        </div>
      ) : (
        // ChatPage
        <ChatPage userName={userName} setUserName={setUserName} setIsChatPage={setIsChatPage}
          userCount={userCount} isLoadingUserCount={isLoadingUserCount} usersArray={usersArray}
        />
      )}


      {/* 彈出框 */}
      <input type="checkbox" id="my_modal_7" className="modal-toggle" />

      <div className="modal w-full" role="dialog">

        <div className="modal-box w-[300px]">
          <div className="flex items-center justify-center gap-1 mb-1">
            <UserRound className='text-slate-500 mb-[2px]' />
            <h3 className="text-lg font-bold text-slate-600">Online Users</h3>
          </div>
          {usersArray.length < 1 ? (
            <div className="font-semibold text-center text-slate-500">No Users</div>
          ) : (
            usersArray.map((el) => (
              <div className="font-semibold text-slate-500" key={el.id}>{el.userName}</div>
            ))
          )}
        </div>

        <label className="modal-backdrop" htmlFor="my_modal_7">Close</label>
      </div>

    </div>
  )
}
export default App

