import { useWeb3ApiQuery, createWeb3ApiProvider } from "@web3api/react";
// import { Web3ApiClient } from "@web3api/client-js";
import React, { useEffect, useState } from "react";
import { TokenProps } from "../interfaces";
// import { setupWeb3ApiClient } from "../setupClient";

export const Token: React.FC<TokenProps> = ({index, token}) => {
  // const ethereum = (window as any).ethereum;
  // const w3Client = setupWeb3ApiClient({ethersProvider: ethereum, ipfsProvider: "https://ipfs.io/"})

  const defiSDKQuery = {
    uri: "ipfs/QmTGiVRwYE7meSBTarqy3WRf253gebAoHMTJap2YuEnG8M", // "w3://ens/defi-sdk.eth", /*"ens/rinkeby/defi-sdk.eth", */  
    query: `
      query($address: String, $connection: Ethereum_Connection) {
        getComponents(
          address: $address
          connection: $connection
        )
      }
    `,
    variables: {
      address: token.contract_address,
      connection: {
        node: null,
        networkNameOrChainId: "MAINNET"
      }
    }
  };

  const { execute } = useWeb3ApiQuery(defiSDKQuery);

  useEffect(() => {
    const fetch = async() => {
      const result = await execute();
      console.log(result);
    }
    fetch();
  }, [])
  

  return (
    <div>
    <table> 
      <tbody>
        <tr>
        {
          index ===0 ? <th> Token </th> : <td> {token.contract_ticker_symbol} </td>
        }
        {
          index ===0 ? <th> Balance </th> : <td> {token.balance / (10 ** token.contract_decimals) } </td>
        }
        </tr>
      </tbody>
    </table>
    </div>
  )
}
