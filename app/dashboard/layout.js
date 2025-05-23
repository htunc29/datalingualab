"use client";
import React, { useState } from "react";
import Image from "next/image";
import { MdMenu, MdHome, MdPages, MdAdd, MdClose } from "react-icons/md";
import { AnimatePresence, motion } from "motion/react";
import { signOut } from "next-auth/react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { ClockLoader, HashLoader, PacmanLoader } from "react-spinners";

export default function RootLayout({ children }) {
  const [showMenu, setShowMenu] = useState(false);
  const [showProfile,setShowProfile]=useState(false);
  const { data: session, status } = useSession();
  async function  handleLogOut(){
    signOut({
        callbackUrl: "/", // Kullanıcı çıkış yaptıktan sonra yönlendirmek istediğiniz sayfa
      });
  }
  if (status === "loading") return (<div className="h-screen flex justify-center items-center"><HashLoader/></div>);
  if (status === "unauthenticated") return <div>Giriş yapmadın, giriş sayfasına yönlendiriliyorsun...</div>;
return (
    <div className="grid grid-cols-12 h-screen bg-slate-50 ">
        <AnimatePresence>
            {showMenu ? (
                <motion.aside
                    initial={{ opacity: 0, x: -300 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -300 }}
                    key="box"
                    className="col-span-12 h-screen fixed top-0 left-0 w-64 flex flex-col gap-2 bg-gradient-to-r from-blue-500 to-indigo-600 z-10"
                >
                    <div className="p-4">
                        <h1 className="text-white font-bold text-3xl text-center flex justify-between">
                            DataLinguaLab
                            <button onClick={()=>setShowMenu(!showMenu)}><MdClose className="block md:hidden"/></button>
                        </h1>
                    </div>
                    <ul className="[&>li]:p-4 pl-2 [&>li]:hover:shadow-lg [&>li]:text-white [&>li]:hover:bg-slate-50 [&>li]:hover:text-black [&>li]:hover:rounded-l-2xl [&>li>a]:gap-2 [&>li>a]:items-center [&>li>a]:flex [&>li]:font-medium">
                        <motion.li whileHover={{ scale: 1.1 }}>
                            <Link href="/dashboard">
                                <MdHome /> Anasayfa
                            </Link>
                        </motion.li>
                        <motion.li whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                            <a href="/dashboard/mysurveys">
                                <MdPages /> Anketlerim
                            </a>
                        </motion.li>
                        <motion.li whileHover={{ scale: 1.1 }}>
                            <Link href="/dashboard/createsurvey">
                                <MdAdd /> Anket Oluştur
                            </Link>
                        </motion.li>
                    </ul>
                </motion.aside>
            ) : null}
        </AnimatePresence>

        <main
            className={`${
                showMenu ? "md:col-span-12 md:ml-64 col-span-12" : "col-span-12"
            } transition-all duration-300`}
        >
            <div className="h-16 px-4 shadow-sm bg-white flex items-center justify-between">
                <div>
                    {showMenu ? (
                        <MdClose
                            size={40}
                            onClick={() => setShowMenu(!showMenu)}
                            className="border-2 border-slate-200 rounded-sm p-1"
                        />
                    ) : (
                        <MdMenu
                            onClick={() => setShowMenu(!showMenu)}
                            size={40}
                            className="border-2 border-slate-200 rounded-sm p-1"
                        />
                    )}
                </div>
                <div>
                    <motion.div>
                        <Image
                            width={50}
                            height={50}
                            src={session.user.image || "/logo.png"}
                            alt="profil"
                            onClick={()=>setShowProfile(!showProfile)}
                            className="rounded-full cursor-pointer"
                        />
                    </motion.div>
                </div>
            </div>
         <AnimatePresence>
             {showProfile && (
                <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute top-16 rounded-md shadow-lg md:right-5 bg-white w-full md:w-64 overflow-hidden"
            >
                <div className="flex flex-col">
                    {/* Header with background and profile image */}
                    <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-4 flex flex-col items-center">
                        <div className="relative mb-2">
                            <Image 
                                width={64} 
                                height={64} 
                                src={session.user.image || "/logo.png"}
                                alt="Profile" 
                                className="rounded-full border-2 border-white"
                            />
                            <div className="absolute bottom-0 right-0 bg-green-500 h-3 w-3 rounded-full border border-white"></div>
                        </div>
                        <h3 className="text-white font-medium">{session.user.name}</h3>
                        <p className="text-blue-100 text-sm">{session.user.email}</p>
                        <p>{session.user.id}</p>
                    </div>
            
                    {/* Profile menu items */}
                    <div className="p-2">
                        <ul className="divide-y divide-gray-100">
                            <li className="py-2 px-3 hover:bg-gray-50 rounded-md flex items-center gap-3 cursor-pointer">
                                <MdPages className="text-gray-500" />
                                <span className="text-gray-700">Profil Bilgileri</span>
                            </li>
                            <li className="py-2 px-3 hover:bg-gray-50 rounded-md flex items-center gap-3 cursor-pointer">
                                <MdAdd className="text-gray-500" />
                                <span className="text-gray-700">Hesap Ayarları</span>
                            </li>
                            <li className="py-2 px-3 hover:bg-gray-50 rounded-md flex items-center gap-3 cursor-pointer">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 2a8 8 0 100 16 8 8 0 000-16zm0 14a6 6 0 100-12 6 6 0 000 12z" clipRule="evenodd" />
                                    <path d="M10 6a1 1 0 011 1v3a1 1 0 01-1 1H7a1 1 0 110-2h2V7a1 1 0 011-1z" />
                                </svg>
                                <span className="text-gray-700">Yardım Merkezi</span>
                            </li>
                        </ul>
                    </div>
            
                    {/* Footer with logout button */}
                    <div className="mt-2 p-3 border-t border-gray-100">
                        <button onClick={handleLogOut} className="w-full py-2 bg-red-500 hover:bg-red-600 text-white rounded-md flex items-center justify-center gap-2 transition-colors">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M3 3a1 1 0 011-1h12a1 1 0 011 1v14a1 1 0 01-1 1H4a1 1 0 01-1-1V3zm2 12V5h10v10H5z" clipRule="evenodd" />
                                <path d="M8 7a1 1 0 011-1h2a1 1 0 010 2H9a1 1 0 01-1-1z" />
                            </svg>
                            Çıkış Yap
                        </button>
                    </div>
                </div>
            </motion.div>
             )}
         </AnimatePresence>
            <section className="p-4 md:p-6">{children}</section>
        </main>
    </div>
);
}