import '../styles/globals.css';
import StoreProvider from '../store/store-context';
import Footer from '../components/footer';
import { config } from '@fortawesome/fontawesome-svg-core';
import '@fortawesome/fontawesome-svg-core/styles.css';
import { library } from '@fortawesome/fontawesome-svg-core';
import { fab } from '@fortawesome/free-brands-svg-icons';
config.autoAddCss = false;
import {
  faCoffee as fasFaCoffee,
  faHeart as fasFaHeart,
} from '@fortawesome/pro-solid-svg-icons';
import {
  faCoffee as farFaCoffee,
  faHeart as farFaHeart,
} from '@fortawesome/pro-regular-svg-icons';
library.add(fab, fasFaCoffee, farFaCoffee, fasFaHeart, farFaHeart);
import { motion } from 'framer-motion';

function MyApp({ Component, pageProps, router }) {
  return (
    <StoreProvider>
      <motion.div
        key={router.route}
        initial="pageInitial"
        animate="pageAnimate"
        variants={{
          pageInitial: { opacity: 0 },
          pageAnimate: { opacity: 1, transition: { delay: 0.4 } },
        }}
      >
        <Component {...pageProps} />
        <Footer />
      </motion.div>
    </StoreProvider>
  );
}

export default MyApp;
