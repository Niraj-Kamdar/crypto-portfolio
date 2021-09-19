import React from 'react';
import { Web3ApiProvider } from '@web3api/react';
import { Home } from './Home';
import Sidebar from './containers/Sidebar';

export const App: React.FC = () => {
  return (
    <Web3ApiProvider>
      <Sidebar children={Home} />
    </Web3ApiProvider>
  );
};
