import React from 'react';
import { Web3ApiProvider } from '@web3api/react';
import { HelloWorld } from './HelloWorld';

export const App: React.FC = () => {
  return (
    <Web3ApiProvider>
      <HelloWorld />
    </Web3ApiProvider>
  );
};
