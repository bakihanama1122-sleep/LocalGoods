import './global.css';
import Providers from './Providers';
import Header from './shared/widgets';
import {Poppins,Roboto} from "next/font/google";
import { getUserSession } from "../utils/session";
import { WebSocketProvider } from '../context/web-socket-context';



export const metadata = {
  title: 'Welcome to LocalGoods',
  description: 'Explore localGoods',
}

const roboto = Roboto({
  subsets:["latin"],
  weight:["100","300","400","500","700","900"],
  variable:"--font-roboto"
})

const poppins = Poppins({
  subsets:["latin"],
  weight:["100","200","300","400","500","600","700","800","900"],
  variable:"--font-poppins"
})

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
 // const user = await getUserSession();
  return (
    <html lang="en">
      <body className={`${roboto.variable} ${poppins.variable}`}>
        {/* <WebSocketProvider user={user}> */}
        <Providers>
        <Header/>
        {children}
        </Providers>
        {/* </WebSocketProvider> */}
      </body>
    </html>
  )
}
