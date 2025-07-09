import { ChakraProvider } from '@chakra-ui/react';
import type { AppProps } from 'next/app';
import Navbar from '../components/Navbar';
import { Provider } from "@/components/ui/provider"
import { ThemeProvider } from 'next-themes';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Provider>
        <ThemeProvider>
        <Navbar />
        <Component {...pageProps} />
        </ThemeProvider>
    </Provider>
  );
}

export default MyApp;
