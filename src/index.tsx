import React from 'react';
import ReactDOM from 'react-dom';
import { App } from './App';
import { ChakraProvider, extendTheme, ColorModeScript } from '@chakra-ui/react';
import { Web3ReactProvider } from '@web3-react/core';
import { getLibrary } from './web3';
import colors from './theme';

const theme = extendTheme({ colors });

if (!!(window as any).ethereum) {
  (window as any).ethereum.autoRefreshOnNetworkChange = false;
}

ReactDOM.render(
  <Web3ReactProvider getLibrary={getLibrary}>
    <ChakraProvider theme={theme}>
      <ColorModeScript initialColorMode={theme.initialColorMode} />
      <React.StrictMode>
        <App />
      </React.StrictMode>
    </ChakraProvider>
  </Web3ReactProvider>,
  document.getElementById('root'),
);
