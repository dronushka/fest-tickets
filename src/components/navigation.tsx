"use client"

import Link from "next/link"
import { useEffect, useRef, useState } from "react"
import Hamburger from "./hamburger"
// active={pathname === "/help"}
const ProfileDropDown = ({ className = "" }: { className?: string }) => {
  const [opened, setOpened] = useState(false)

  const navigation = [
    { title: "Профиль", path: "/profile" },
    { title: "Выход", path: "javascript:void(0)" },
  ]

  return (
    <div className={`relative ${className}`}>
      <div className="flex items-center space-x-4">
        <button
          className="h-6 w-6 rounded-full outline-none ring-2 ring-gray-200 ring-offset-2 sm:focus:ring-indigo-600"
          onClick={() => setOpened(!opened)}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="h-full w-full rounded-full"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
            />
          </svg>

          {/* <img
            src="https://randomuser.me/api/portraits/men/46.jpg"
            className="h-full w-full rounded-full"
          /> */}
        </button>
        <div className="sm:hidden">
          <span className="block">Micheal John</span>
          <span className="block text-sm text-gray-500">john@gmail.com</span>
        </div>
      </div>
      <ul
        className={`right-0 top-12 mt-5 space-y-5 bg-white sm:absolute sm:mt-0 sm:w-52 sm:space-y-0 sm:rounded-md sm:border sm:text-sm sm:shadow-md ${
          opened ? "" : "sm:hidden"
        }`}
      >
        {navigation.map((item, idx) => (
          <li>
            <Link
              key={idx}
              className="block text-gray-600 sm:p-2.5 sm:hover:bg-gray-50"
              href={item.path}
            >
              {item.title}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default function Navigation() {
  const [opened, setOpened] = useState(false)

  const navigation = [
    { title: "Мои заказы", path: "/orders" },
    { title: "Помощь", path: "/help" },
  ]

  return (
    <nav className="border-b bg-white">
      <div className="mx-auto flex max-w-screen-xl items-center space-x-8 px-4 py-3 md:px-8">
        <div className="flex-none sm:flex-initial">
          <Link href="/">
            <img src="/logo.png" width={100} height={50} alt="Нян-Фест" />
          </Link>
        </div>
        <div className="flex flex-1 items-center justify-between">
          <div
            className={`absolute left-0 top-16 z-20 w-full h-full border-b bg-white p-4 sm:w-auto sm:static sm:block sm:border-none ${
              opened ? "" : "hidden"
            }`}
          >
            <ul className="mt-12 space-y-5 sm:mt-0 sm:flex sm:space-x-6 sm:space-y-0">
              {navigation.map((item, idx) => (
                <li key={idx} className="text-gray-600 hover:text-gray-900">
                  <Link href={item.path}>{item.title}</Link>
                </li>
              ))}
            </ul>
            <ProfileDropDown className="mt-5 border-t pt-5 sm:hidden" />
          </div>
          <div className="flex flex-1 items-center justify-end space-x-2 sm:space-x-6">
            <ProfileDropDown className="hidden sm:block" />
            <button
              className="block text-gray-400 outline-none sm:hidden"
              onClick={() => setOpened(!opened)}
            >
              {opened ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16m-7 6h7"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}
