import React from 'react';
import { ThemeProvider } from '@emotion/react';
import Head from 'next/head';
import { Container, CssBaseline, createTheme } from '@mui/material';
import DesktopHeader from '../sections/DesktopHeader';
import MobileHeader from '../sections/MobileHeader';
import Footer from '../sections/Footer';
import { useStateValue } from '../utils/contextAPI/StateProvider';

const Layout = ({ title, description, children }) => {
  const [state] = useStateValue();
  const { darkMode } = state;
  const theme = createTheme({
    typography: {
      h1: {
        fontSize: '1.6rem',
        fontWeight: 400,
        margin: '2rem 0',
      },
      h2: {
        fontSize: '1.4',
        fontWeight: 400,
        margin: '1rem 0',
      },
      body1: {
        fontWeight: 'normal',
      },
    },

    palette: {
      mode: darkMode ? 'dark' : 'light',
      primary: {
        main: '#f0c000',
      },
      secondary: {
        main: '#208080',
      },
    },
  });
  return (
    <>
      <Head>
        <title>{title ? `${title} - Next Amazon` : 'Next Amazon'}</title>
        {description && <meta name="description" content={description} />}
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <MobileHeader />
        <DesktopHeader title={title} description={description} />

        <Container>{children}</Container>
        <Footer />
      </ThemeProvider>
    </>
  );
};

export default Layout;
