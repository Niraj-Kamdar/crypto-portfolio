import React from 'react';
import { useWeb3ApiQuery } from '@web3api/react';
import { CHAIN_ID, COVALENT_API, COVALENT_API_KEY } from './config';
import {
  useColorMode,
  Flex,
  Box,
  FormControl,
  FormLabel,
  Input,
  Button,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
} from '@chakra-ui/react';
import { Token } from './components/Token';
import { MoonIcon, SunIcon } from '@chakra-ui/icons';
import PieChart from './components/PieChart';

interface TokenBalance {
  contract_decimals: number;
  contract_name: string;
  contract_ticker_symbol: string;
  contract_address: string;
  supports_erc: string[];
  logo_url: string;
  type: string;
  balance: number;
  balance_24h: number;
  quote_rate: number;
  quote_rate_24h: number;
  quote: number;
  quote_24h: number;
  nft_data: unknown | null;
}

interface AccountBalance {
  address: string;
  updated_at: string;
  next_update_at: string;
  quote_currency: string | null;
  chain_id: number;
  pagination: unknown | null;
  items: TokenBalance[];
}

interface CovalentResponse {
  data: AccountBalance;
  error: boolean | null;
  error_message: string | null;
  error_code: string | null;
}

export const HelloWorld: React.FC = () => {
  const [message, setMessage] = React.useState('');
  const [accountBalance, setAccountBalance] = React.useState<
    AccountBalance | undefined
  >(undefined);
  const { colorMode, toggleColorMode } = useColorMode();

  const query = {
    uri: 'w3://ens/http.web3api.eth',
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
    if (result && result.data && result.data?.get) {
      const response: Record<string, string> = result.data.get as Record<
        string,
        string
      >;
      const covalentResponse = JSON.parse(response['body']) as CovalentResponse;
      setAccountBalance(covalentResponse.data);
      console.log(covalentResponse.data);
    }
  };

  const onChangeHandler = (event: any): void => {
    setMessage(event?.target.value);
  };

  return (
    <>
      <Box p={10}>
        <FormControl>
          <Flex justify='center'>
            <Flex w='100%'>
              <Input
                mb={5}
                mr={5}
                w='60%'
                placeholder='Wallet Address'
                onChange={(event) => onChangeHandler(event)}
              />
              <Button mr={5} onClick={logMsgHandler} colorScheme='blue'>
                Submit
              </Button>
            </Flex>
            <Button onClick={toggleColorMode}>
              {colorMode === 'light' ? <MoonIcon /> : <SunIcon />}
            </Button>
          </Flex>
          <Flex justify='flex-start' maxW='100%'>
            <PieChart height={200} width={255} />
          </Flex>
        </FormControl>
        <br />

        <Flex justify='flex-start'>
          <Table maxW='80%' variant='simple'>
            <Thead>
              <Tr>
                <Th>Token</Th>
                <Th>Balance</Th>
              </Tr>
            </Thead>
            <Tbody>
              {accountBalance &&
                accountBalance.items.map((token: TokenBalance, i) => (
                  <Token key={i} index={i} token={token} />
                ))}
            </Tbody>
          </Table>
        </Flex>
      </Box>
    </>
  );
};
