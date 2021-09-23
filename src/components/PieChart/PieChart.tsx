import React, { useState, useEffect } from 'react';
import { useTokenContext } from '../../utils/context/tokenContext';
import { ResponsivePie } from '@nivo/pie';
import {
  Wrapper,
  P
} from './Style';


export default function PieChart() {
  const [tokenList, setTokenList] = useState<any>([]);
  const { tokens } = useTokenContext();


  const colorRange = [
    'rgba(255, 255, 255, 0.7)',
    'rgba(255, 255, 255, 0.6)',
    'rgba(255, 255, 255, 0.5)',
    'rgba(255, 255, 255, 0.4)',
    'rgba(255, 255, 255, 0.3)',
    'rgba(255, 255, 255, 0.2)',
    'rgba(255, 255, 255, 0.1)'
  ]

  useEffect(() => {
    let s = 0;
    console.log(tokens);
    if (tokens) {
      tokens.length > 0 && tokens.map((token) => {
          console.log(token)
          let list = tokenList
          s += token.value;
          if (!list.includes({id: token.token.symbol})) {
            let dataSet = {
              id: token.token.symbol,
              label: token.token.symbol,
              value: (Math.round(token.value * 100)/100).toFixed(2),
              color: colorRange[Math.floor(Math.random()*colorRange.length)]
            }
            list.push(dataSet)
            setTokenList(list)
            console.log('Data Set: ***')
            console.log(list)
        }
      })
    }
  }, [tokens])

  return (
    <Wrapper>
    {tokens ?
    <ResponsivePie
        data={tokenList}
        margin={{ top: 20, right: 40, bottom: 40, left: 40 }}
        padAngle={0.7}
        cornerRadius={3}
        activeOuterRadiusOffset={8}
        colors={{ datum: `data.color`}}
        borderWidth={1}
        borderColor={{ from: 'color', modifiers: [ [ 'darker', 0.2 ] ] }}
        enableArcLinkLabels={false}
        arcLabel={d=>`${d.id} (${d.value})`}
        arcLinkLabelsSkipAngle={10}
        arcLinkLabelsTextColor={{from: 'color', modifiers: [ [ 'darker', 2] ] }}
        arcLinkLabelsThickness={2}
        arcLinkLabelsColor={{ from: 'color', modifiers: [ [ 'darker', 2 ] ] }}
        arcLabelsSkipAngle={10}
        arcLabelsTextColor='black'
    /> :
      <P>Enter a wallet address, or sign in.</P>
    }
    </Wrapper>

  );
}
