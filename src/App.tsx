import React from 'react';
import { Web3ApiProvider } from '@web3api/react';
import { HelloWorld } from './HelloWorld';
import Sidebar from './containers/Sidebar';

export const App: React.FC = () => {
  return (
    <Web3ApiProvider>
      <Sidebar children={HelloWorld} />
    </Web3ApiProvider>
  );
};
