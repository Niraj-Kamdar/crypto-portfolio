import React from 'react';
import ReactDOM from 'react-dom';
import { App } from './App';
import { ChakraProvider, extendTheme, ColorModeScript } from '@chakra-ui/react';
import colors from './theme';
import TokenContextProvider from '../src/utils/context/tokenContext';

const theme = extendTheme({ colors });

ReactDOM.render(
  <ChakraProvider theme={theme}>
    <ColorModeScript initialColorMode={theme.initialColorMode} />
    <TokenContextProvider>
      <React.StrictMode>
        <App />
      </React.StrictMode>
    </TokenContextProvider>
  </ChakraProvider>,
  document.getElementById('root'),
);
