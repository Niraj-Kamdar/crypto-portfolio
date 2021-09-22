export interface CovalentTokenBalance {
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
export interface CovalentAccountBalance {
  address: string;
  updated_at: string;
  next_update_at: string;
  quote_currency: string | null;
  chain_id: number;
  pagination: unknown | null;
  items: CovalentTokenBalance[];
}

export interface CovalentResponse {
  data: CovalentAccountBalance;
  error: boolean | null;
  error_message: string | null;
  error_code: string | null;
}
export interface TokenComponent {
  token: Token;
  rate: string;
  type: string;
}

export interface Token {
  address: string;
  name: string;
  symbol: string;
  decimals: number;
  totalSupply: string;
}

export interface TokenComponentsList {
  token: Token;
  type: TokenProtocolType;
  underlyingTokenComponents: TokenComponent[];
}

export interface TokenProps {
  index: number;
  token: CovalentTokenBalance;
}

export enum TokenProtocolType {
  Native,
  YearnV1,
  YearnV2,
  CurveGauge,
  Curve,
  AaveV1,
  AaveV2,
  AaveAMM,
  UniswapV2,
  UniswapV3,
  Sushiswap,
  Linkswap,
  Compound,
  Sushibar,
  Cream,
}

export interface GetComponents {
  token: Token;
  type: TokenProtocolType;
  underlyingTokenComponents: TokenComponent[];
}

export interface DefiSDKData {
  getComponents: GetComponents;
}

export interface DefiSDKResponse {
  data: DefiSDKData | undefined;
  errors: string[] | undefined;
}

export interface TokenBalance {
  token: Token;
  amount: number;
  price: number;
  value: number;
  percentOfTotal?: number;
}
