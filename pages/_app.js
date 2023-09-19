import { PayPalScriptProvider } from '@paypal/react-paypal-js';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../public/swiper.css';
import '../styles/globals.css';
import reducer, { initialState } from '../utils/contextAPI/reducer';
import { StateProvider } from '../utils/contextAPI/StateProvider';

function MyApp({ Component, pageProps }) {
  return (
    <StateProvider initialState={initialState} reducer={reducer}>
      <PayPalScriptProvider>
        <Component {...pageProps} />
      </PayPalScriptProvider>
      <ToastContainer />
    </StateProvider>
  );
}

export default MyApp;
