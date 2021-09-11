import React from "react";
import { useWeb3ApiQuery } from "@web3api/react";
import { CHAIN_ID, COVALENT_API, COVALENT_API_KEY } from "./config";

interface TokenBalance {
  contract_decimals: number,
  contract_name: string,
  contract_ticker_symbol: string,
  contract_address: string,
  supports_erc: string[],
  logo_url: string,
  type: string,
  balance: number,
  balance_24h: number,
  quote_rate: number,
  quote_rate_24h: number,
  quote: number,
  quote_24h: number,
  nft_data: unknown | null
}

interface AccountBalance {
  address: string,
  updated_at: string,
  next_update_at: string,
  quote_currency: string | null,
  chain_id: number,
  pagination: unknown | null
  items: TokenBalance[]
}

interface CovalentResponse {
  data: AccountBalance;
  error: boolean | null;
  error_message: string | null;
  error_code: string | null;
}

export const HelloWorld: React.FC = () => {
  const [message, setMessage] = React.useState("");
  const [accountBalance, setAccountBalance] = React.useState<AccountBalance | undefined>(undefined);

  const query = {
    uri: "w3://ens/http.web3api.eth",
    query: `
      query {
        get(
          url: "${COVALENT_API}/v1/${CHAIN_ID}/address/${message}/balances_v2/",
          request: {
            responseType: TEXT
            urlParams: [{key: "key", value: "${COVALENT_API_KEY}"}, {key: "nft", value: false}]
          }
        )
      }
    `,
  };


  const { execute } = useWeb3ApiQuery(query);

  const logMsgHandler = async (): Promise<any> => {
    console.info(`Sending Query: ${JSON.stringify(query, null, 2)}`);
    const result = await execute();
    if(result && result.data && result.data?.get) {
      const response: Record<string, string> = result.data.get as Record<string, string>;
      const covalentResponse = JSON.parse(response["body"]) as CovalentResponse;
      setAccountBalance(covalentResponse.data);
      console.log(covalentResponse.data)
    }
  };

  const onChangeHandler = (event: any): void => {
    setMessage(event?.target.value);
  };

  return (
    <>
      <div className="main__heading">Portfolio tracker</div>
      <div className="main__text">
        Enter your ethereum address:<br/>
      </div>
      <input
        className="main__input"
        onChange={(event) => onChangeHandler(event)}
      />
      <button className="main__btn" onClick={logMsgHandler}>
        Submit
      </button>
      <br/>
      <div className="main__table">
        {
          accountBalance && accountBalance.items.map( (token: TokenBalance, i) => (
            <div>
              <table> 
                <tr>
                {
                  i===0 ? <th> Token </th> : <td> {token.contract_ticker_symbol} </td>
                }
                {
                  i===0 ? <th> Balance </th> : <td> {token.balance / (10 ** token.contract_decimals) } </td>
                }
                </tr>
              </table>
            </div>
          ))
        }
      </div>
      <div style={{ width: "100%", height: "100px" }}/>
      <div className="footer__container">
        <a
          className="footer__link"
          href="https://github.com/Web3-API/demos/tree/main/hello-world/web3api"
          target="_blank"
        >
          Source Code
        </a>
        <a
          className="footer__link"
          href="https://app.ens.domains/name/helloworld.web3api.eth"
          target="_blank"
        >
          ENS Domain
        </a>
        <a
          className="footer__link"
          href="https://bafybeig7r7vm6vg7fkv4u57p6pj3t3a7li56zeiiu6nn7sx5lrlacy7lpi.ipfs.dweb.link/"
          target="_blank"
        >
          IPFS Package
        </a>
      </div>
    </>
  );
}

