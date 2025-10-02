import './global.css';
import Providers from '../provider';
import {Poppins} from "next/font/google";

export const metadata = {
  title: 'LocalGoods | Seller ',
  description: 'Seller microservice for LocalGoods',
}



const poppins = Poppins({
  subsets:["latin"],
  weight:["100","200","300","400","500","600","700","800","900"],
  variable:"--font-poppins"
})

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`min-h-screen font-sans antialiased ${poppins.variable}`}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}
