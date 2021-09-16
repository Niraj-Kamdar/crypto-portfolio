import { useWeb3ApiQuery, createWeb3ApiProvider } from "@web3api/react";
import { Web3ApiClient } from "@web3api/client-js";
import React, { useEffect, useState } from "react";
import { TokenProps } from "../interfaces";
import { setupWeb3ApiClient } from "../setupClient";

export const Token: React.FC<TokenProps> = ({index, token}) => {

  // const [client, setClient] = useState<Web3ApiClient>();
  const ethereum = (window as any).ethereum;
  const w3Client = setupWeb3ApiClient({ethersProvider: ethereum, ipfsProvider: "https://ipfs.io"})

  const defiSDKQuery = {
    uri:   /*"ens/rinkeby/defi-sdk.eth", */  "ipfs/QmQYYXmHdY8dpZnSABRpqwcm9wwMj7YbyoGMv1iewJyB2U", // "w3://ens/defi-sdk.eth",
    // $address: String, $connection: Ethereum_Connection
    query: `
      query {
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
      // const result = await execute();
      // console.log(result);
      const result = await w3Client?.query(defiSDKQuery);
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


  // function useDefiSDK(accountBalance: CovalentAccountBalance | undefined) {
  //   const fetch = async() => {
  //     if (accountBalance?.items) {
  //       accountBalance.items.map(async(token, i) => {
  //         defiSDKQuery.variables.address = token.contract_address;
  //         const { execute } = useWeb3ApiQuery(defiSDKQuery);
  
  //         const result = await execute();
  //         console.log(result);
  //       })
  //     }
  //   }
  //   return fetch;
  // }

  // useEffect(() => {
  //   const fetch = async() => {
  //     const fetch = useDefiSDK(accountBalance);
  //     await fetch();
  //     // if (accountBalance?.items) {
  //     //   accountBalance.items.map(async(token, i) => {
  //     //     defiSDKQuery.variables.address = token.contract_address;
  //     //     const { execute } = useWeb3ApiQuery(defiSDKQuery);

  //     //     const result = await execute();
  //     //     console.log(result);
  //     //   })
  //     //   // for (const token of accountBalance.items) {
  //     //   //   defiSDKQuery.variables.address = token.contract_address;
  //     //   //   const { execute } = useWeb3ApiQuery(defiSDKQuery);

  //     //   //   const result = await execute();
  //     //   //   console.log(result);
  //     //   // }
  //     // }
  //   }
  //   fetch();
  // }, [accountBalance])