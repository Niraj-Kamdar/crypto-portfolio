import React, { useEffect } from "react";
import { useWeb3ApiQuery } from "@web3api/react";
import { CHAIN_ID, COVALENT_API, COVALENT_API_KEY } from "./config";
import { CovalentAccountBalance, CovalentResponse, CovalentTokenBalance } from "./interfaces";
import { Token } from "./components/Token";

export const HelloWorld: React.FC = () => {
  const [message, setMessage] = React.useState("");
  const [accountBalance, setAccountBalance] = React.useState<CovalentAccountBalance | undefined>(undefined);

  const covalentQuery = {
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

  const { execute: executeCovalent } = useWeb3ApiQuery(covalentQuery);

  const logMsgHandler = async (): Promise<any> => {
    console.info(`Sending Query: ${JSON.stringify(covalentQuery, null, 2)}`);
    const result = await executeCovalent();
    if(result && result.data && result.data?.get) {
      const response: Record<string, string> = result.data.get as Record<string, string>;
      const covalentResponse = JSON.parse(response["body"]) as CovalentResponse;
      setAccountBalance(covalentResponse.data);
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
          accountBalance && accountBalance.items.map( (token: CovalentTokenBalance, i) => (
            <Token key={i} index={i} token={token}/>
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

