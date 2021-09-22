import React, { createContext, useContext, useState} from 'react';
import {
  TokenBalance,
} from "../../interfaces";

export type TokenContextValues = {
    tokens: TokenBalance[];
    setTokens: React.Dispatch<React.SetStateAction<Array<any>>>;
}

export const TokenContextDefaultValues : TokenContextValues = {
    tokens: [],
    setTokens: () => null,
}

export const TokenDataContext = createContext<TokenContextValues>(TokenContextDefaultValues);

export const useTokenContext = () => useContext(TokenDataContext);

interface TokenDataProviderProps {
    children: React.ReactChild;
}

const TokenDataProvider = ({children}: TokenDataProviderProps) => {
    const [tokens, setTokens] = useState<any>();

    return (
        <TokenDataContext.Provider
          value={{
            tokens,
            setTokens
          }}
        >
          {children}
        </TokenDataContext.Provider>
      );
};

export default TokenDataProvider;
