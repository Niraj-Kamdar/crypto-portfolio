import React, { useEffect } from 'react';
import { useWeb3ApiClient } from '@web3api/react';
import {
  useColorMode,
  Flex,
  Box,
  FormControl,
  Input,
  Button,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
} from '@chakra-ui/react';
import { MoonIcon, SunIcon } from '@chakra-ui/icons';
import PieChart from './components/PieChart';
import {
  CovalentAccountBalance,
  CovalentResponse,
  CovalentTokenBalance,
  DefiSDKResponse,
  TokenBalance,
} from './interfaces';
import { coingeckoQuery, covalentQuery, defiSDKQuery } from './queries';
import { CHAIN_ID, CHAIN_NAME, COINGECKO_API, COVALENT_API } from './config';

export const Home: React.FC = () => {
  const [accountAddress, setAccountAddress] = React.useState<string>('');
  const [submitted, setSubmitted] = React.useState<boolean>(false);
  const [accountBalance, setAccountBalance] = React.useState<
    CovalentAccountBalance | undefined
  >(undefined);
  const [tokenBalances, setTokenBalances] = React.useState<
    TokenBalance[] | undefined
  >();
  const { colorMode, toggleColorMode } = useColorMode();
  const w3Client = useWeb3ApiClient();

  const logMsgHandler = async (): Promise<any> => {
    setSubmitted(true);
  };

  useEffect(() => {
    const fetch = async () => {
      if (submitted) {
        covalentQuery.variables.url = `${COVALENT_API}/v1/${CHAIN_ID}/address/${accountAddress}/balances_v2/`;
        const result = await w3Client.query(covalentQuery);
        if (result && result.data && result.data?.get) {
          const response: Record<string, string> = result.data.get as Record<
            string,
            string
          >;
          const covalentResponse = JSON.parse(
            response['body'],
          ) as CovalentResponse;
          setAccountBalance(covalentResponse.data);
          console.log(covalentResponse.data);
        }
        setSubmitted(false);
      }
    };
    fetch();
  }, [submitted, accountAddress, w3Client]);

  useEffect(() => {
    async function fetchTokenBalance(covalentTokenBalance: CovalentTokenBalance): Promise<TokenBalance | undefined> {
      defiSDKQuery.variables.address = covalentTokenBalance.contract_address;
      const result: DefiSDKResponse = (await w3Client.query(
        defiSDKQuery
      )) as DefiSDKResponse;
      if (result.errors) {
        console.error(result.errors);
      } else {
        if (result.data?.getComponents) {
          const getComponents = result.data.getComponents;
          if (getComponents.underlyingTokenComponents.length !== 0) {
            for (let underlyingTC of getComponents.underlyingTokenComponents) {
              coingeckoQuery.variables.url = `${COINGECKO_API}/coins/${CHAIN_NAME}/contract/${underlyingTC.token.address}`;
              const cgResult = await w3Client.query(coingeckoQuery);
              console.log(cgResult);
            }
          } else {
            coingeckoQuery.variables.url = `${COINGECKO_API}/coins/${CHAIN_NAME}/contract/${getComponents.token.address}`;
            const cgResult = await w3Client.query(coingeckoQuery);
            if (cgResult && cgResult.data && cgResult.data?.get) {
              const response: Record<string, string> = cgResult.data
                .get as Record<string, string>;
              const parsedResponse = JSON.parse(response["body"]) as Record<string, unknown>;
              const marketData = parsedResponse["market_data"] as Record<string, unknown>;
              const currentPrice = marketData["current_price"] as Record<string, number>;
              const usdPrice = currentPrice["usd"];
              const amount = (covalentTokenBalance.balance / 10 ** covalentTokenBalance.contract_decimals);
              const tokenBalance: TokenBalance = {
                token: getComponents.token,
                amount: amount,
                price: usdPrice,
                value: amount * usdPrice
              }
              console.log(tokenBalance);
              return tokenBalance;
            }
          }
        }
      }
    }

    const fetch = async () => {
      if (accountBalance?.items) {
        const promises = accountBalance.items.map(fetchTokenBalance);
        console.log(promises);
        const results = await Promise.all(promises);
        const tokenBalances = results.filter(
          (token) => token && token.value,
        ) as TokenBalance[];
        setTokenBalances(tokenBalances);
      }
    };
    fetch();
  }, [accountBalance, w3Client]);

  const onChangeHandler = (event: any): void => {
    setAccountAddress(event?.target.value);
  };

  return (
    <>
      <Box p={10}>
        <FormControl>
          <Flex justify="center">
            <Flex w="100%">
              <Input
                mb={5}
                mr={5}
                w="60%"
                placeholder="Wallet Address"
                onChange={(event) => onChangeHandler(event)}
              />
              <Button mr={5} onClick={logMsgHandler} colorScheme="blue">
                Submit
              </Button>
            </Flex>
            <Button onClick={toggleColorMode}>
              {colorMode === 'light' ? <MoonIcon /> : <SunIcon />}
            </Button>
          </Flex>
          <Flex justify="flex-start" maxW="100%">
            <PieChart height={200} width={255} />
          </Flex>
        </FormControl>
        <br />

        <Flex justify="flex-start">
          <Table maxW="80%" variant="simple">
            <Thead>
              <Tr>
                <Th>Token</Th>
                <Th>Amount</Th>
                <Th>Price</Th>
                <Th>Amount</Th>
              </Tr>
            </Thead>
            <Tbody>
              {tokenBalances &&
                tokenBalances.map((token: TokenBalance, i) => (
                  <Tr key={i}>
                    <Td> {token.token.symbol} </Td>
                    <Td>{token.amount.toFixed(4)}</Td>
                    <Td>{token.price.toFixed(4)}</Td>
                    <Td>{token.value.toFixed(4)}</Td>
                  </Tr>
                ))}
            </Tbody>
          </Table>
        </Flex>
      </Box>
    </>
  );
};
