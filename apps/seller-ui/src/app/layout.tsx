import './global.css';
import Providers from '../provider';

export const metadata = {
  title: 'LocalGoods | Seller ',
  description: 'Seller microservice for LocalGoods',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}
