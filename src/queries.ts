import { COVALENT_API_KEY } from './config';

export const covalentQuery = {
  uri: 'w3://ens/http.web3api.eth',
  query: `
    query($url: String!) {
      get(
        url: $url,
        request: {
          responseType: TEXT
          urlParams: [{key: "key", value: "${COVALENT_API_KEY}"}, {key: "nft", value: false}]
        }
      )
    }
  `,
  variables: {
    url: '',
  },
};

export const defiSDKQuery = {
  uri: 'ipfs/QmTGiVRwYE7meSBTarqy3WRf253gebAoHMTJap2YuEnG8M',
  query: `
    query($address: String, $connection: Ethereum_Connection) {
      getComponents(
        address: $address
        connection: $connection
      )
    }
  `,
  variables: {
    address: '',
    connection: {
      node: null,
      networkNameOrChainId: 'MAINNET',
    },
  },
};

export const coingeckoQuery = {
  uri: 'w3://ens/http.web3api.eth',
  query: `
    query($url: String) {
      get(
        url: $url,
        request: {
          responseType: TEXT
          urlParams: []
        }
      )
    }
  `,
  variables: {
    url: '',
  },
};
