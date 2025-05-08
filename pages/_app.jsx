import '../styles/globals.css';
import 'react-toastify/dist/ReactToastify.css';
import { Icons, ToastContainer } from 'react-toastify';
import Head from 'next/head';

export default function MyApp({ Component, pageProps }) {
  return (
    <>
    <Head>
        <link rel="icon" href="/school-logo.png" />
      </Head>
      <Component {...pageProps} />
      
      <ToastContainer />
    </>
  );
}


