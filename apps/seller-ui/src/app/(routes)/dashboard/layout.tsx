import React from 'react'
import SideBarWrapper from 'apps/seller-ui/src/shared/components/sidebar/SidebarWrapper'
import {Poppins} from "next/font/google";

const poppins = Poppins({
  subsets:["latin"],
  weight:["100","200","300","400","500","600","700","800","900"],
  variable:"--font-poppins"
})

const Layout = ({children}:{children:React.ReactNode}) => {
  return (
    <div className={`flex h-full bg-black min-h-screen ${poppins.variable}`}>
        <aside className='w-[280px] min-w-[250px] max-w-[300px] border-r-slate-300 text-white p-4'>
            <div className='sticky top-0'>
                <SideBarWrapper/>
            </div>
        </aside>
        
        <main className='flex-1'>
            <div className='overflow-auto'>
                {children}
            </div>
        </main>
    </div>
  )
}

export default Layout