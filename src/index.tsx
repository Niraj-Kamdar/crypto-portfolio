import React from 'react';
import ReactDOM from 'react-dom';
import { App } from './App';
import { ChakraProvider, extendTheme, ColorModeScript } from '@chakra-ui/react';
import colors from './theme';

const theme = extendTheme({ colors });

ReactDOM.render(
  <ChakraProvider theme={theme}>
    <ColorModeScript initialColorMode={theme.initialColorMode} />
    <React.StrictMode>
      <App />
    </React.StrictMode>
  </ChakraProvider>,
  document.getElementById('root'),
);
