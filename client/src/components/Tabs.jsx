/* eslint-disable react/prop-types */
import { motion } from 'framer-motion'
import { useState } from 'react'
import GlobalChat from './GlobalChat/GlobalChat'
import RoomChat from './RoomChat/RoomChat'

import { Earth } from 'lucide-react';
import { UsersRound } from 'lucide-react';

const tabs = [
    { text: "Global Chat", icon: <Earth className='w-5 h-5 mt-[0.5px] mr-[5px]' /> },
    { text: "Room Chat", icon: <UsersRound className='w-5 h-5 mt-[0.5px] mr-[5px]' /> },
]

const Tabs = ({ userName }) => {
    const [selected, setSelected] = useState("Global Chat");

    return (
        <div className='flex flex-col'>
            <div className='fixed top-[120px] pt-4 pb-2 mt-[-24px] z-10 w-full bg-base-100 custom-shadow'>
                <div className="mb-0 flex justify-evenly items-center">
                    {tabs.map((tab) => (
                        <Tab
                            icon={tab.icon}
                            text={tab.text}
                            selected={selected === tab.text}
                            setSelected={setSelected}
                            key={tab.text}
                        />
                    ))}
                </div>
            </div>
            <div className="min-h-16" />  {/* behind fixed */}

            <div className="rounded-lg bg-neutral-content min-h-[75svh]">
                <div className={selected === "Global Chat" ? "block" : "hidden"}>
                    <GlobalChat userName={userName} />
                </div>
                <div className={selected === "Room Chat" ? "block" : "hidden"}>
                    <RoomChat userName={userName} />
                </div>
            </div>
        </div>
    )
}

export default Tabs


// Tab Component
const Tab = ({ text, selected, setSelected, icon }) => {
    return (
        <button
            onClick={() => setSelected(text)}
            className={`${selected ? 'text-white' : 'text-gray-500 hover:text-gray-900'
                } relative rounded-md px-3 py-2 text-md font-medium transition-colors w-[46%] flex justify-center`}
            style={{ position: 'relative' }} // 確保 relative 定位
        >
            <span className="relative z-10  font-semibold flex" >{icon}{text}</span>
            {selected && (
                <motion.span
                    layoutId="tab"
                    transition={{ type: 'spring', duration: 0.4 }}
                    className="absolute inset-0 z-0 rounded-md bg-accent"
                ></motion.span>
            )}
        </button>
    )
};
