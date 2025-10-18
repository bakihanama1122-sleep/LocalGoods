import { ChevronRight } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

const Notifications = () => {
  return (
    <div className='w-full min-h-screen p-8'>
        <h2 className='text-2xl text-white font-semibold mb-2'>
            Notifications
        </h2>
        <div className="mb-4">
        <div className="flex items-center text-white">
          <Link href={"/dashboard"} className="text-[#80Deea] cursor-pointer">
            Dashboard
          </Link>
          <ChevronRight size={20} className="opacity-[.8]" />
          <span>Notifications</span>
        </div>
      </div>
      <p className='text-center pt-24 text-white text-sm font-Poppins'>
        No Notifications available yet!
      </p>
    </div>
  )
}

export default Notifications;