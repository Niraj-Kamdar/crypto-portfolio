import React, { useState, useEffect } from 'react';
import { useTokenContext } from '../../utils/context/tokenContext';
import { Pie } from 'react-chartjs-2';
import { Chart } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { Wrapper, P } from './Style';

export default function PieChart() {
  Chart.register(ChartDataLabels);
  const [labels, setLabels] = useState<string[]>([]);
  const [dataSet, setDataSet] = useState<number[]>([]);
  const { tokens } = useTokenContext();

  const data = {
    labels: labels,
    text: dataSet,
    datasets: [
      {
        label: 'Total Value',
        data: dataSet,
        backgroundColor: [
          'rgba(255, 99, 132, 0.7)',
          'rgba(255, 159, 64, 0.7)',
          'rgba(255, 206, 86, 0.7)',
          'rgba(153, 102, 255, 0.7)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(255, 159, 64, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(153, 102, 255, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  useEffect(() => {
    console.log(tokens);
    if (tokens) {
      tokens.length > 0 &&
        tokens.map((token) => {
          if (token !== undefined) {
            setLabels((i) => [...i, token.token.symbol]);
            setDataSet((i) => [...i, Math.round(token.value * 100) / 100]);
          }
        });
    }
  }, [tokens]);

  const pieOptions = {
    plugins: {
      legend: {
        display: false,
      },
      datalabels: {
        display: 'auto',
        color: 'rgba(255,255,255, 0.9)',
        clip: true,
        clamp: true,
        font: {
          size: 12,
        },
      },
    },
    tooltip: {
      backgroundColor: 'black',
    },
  };

  return labels.length > 0 ? (
    <Wrapper>
      <Pie data={data} translate={''} options={pieOptions} />
    </Wrapper>
  ) : (
    <P>
      Enter a wallet address (Or authorize your wallet) to see the total value!
    </P>
  );
}
