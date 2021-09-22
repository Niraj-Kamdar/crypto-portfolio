import React, { useState, useEffect } from 'react';
import Pie, { ProvidedProps, PieArcDatum } from '@visx/shape/lib/shapes/Pie';
import { scaleOrdinal } from '@visx/scale';
import { Group } from '@visx/group';
import { Text } from '@visx/text';
import { GradientTealBlue } from '@visx/gradient';
import letterFrequency, {
  LetterFrequency,
} from '@visx/mock-data/lib/mocks/letterFrequency';
import { animated, useTransition, interpolate } from 'react-spring';
import { useTokenContext } from '../utils/context/tokenContext';
import { TokenBalance } from '../interfaces';
import { sum } from 'lodash';

// data and types

const defaultMargin = { top: 20, right: 20, bottom: 20, left: 20 };

export type PieProps = {
  width: number;
  height: number;
  margin?: typeof defaultMargin;
  animate?: boolean;
};

export default function PieChart({
  width,
  height,
  margin = defaultMargin,
  animate = true,
}: PieProps) {
  const [selectedToken, setSelectedToken] = useState<string | null>(null);
  const { tokens } = useTokenContext();

  // accessor functions
  const frequency = (d: TokenBalance) => d.percentOfTotal || 0;

  // color scales
  const getTokenFrequencyColor = scaleOrdinal({
    domain: tokens?.map((l) => l.value),
    range: [
      'rgba(255, 255, 255, 0.7)',
      'rgba(255, 255, 255, 0.6)',
      'rgba(255, 255, 255, 0.5)',
      'rgba(255, 255, 255, 0.4)',
      'rgba(255, 255, 255, 0.3)',
      'rgba(255, 255, 255, 0.2)',
      'rgba(255, 255, 255, 0.1)',
    ],
  });

  useEffect(() => {
    let s = 0;
    console.log(tokens);
    if (tokens) {
      tokens.length > 0 &&
        tokens.map((token) => {
          s += token.value;
          token.percentOfTotal = (token.value / s) * 100;
        });
    }
  }, [tokens]);

  if (width < 10) return null;

  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;
  const radius = Math.min(innerWidth, innerHeight) * 0.8;
  const centerY = innerHeight / 2;
  const centerX = innerWidth / 2;
  const donutThickness = 35;

  return (
    <svg width={width} height={height}>
      <GradientTealBlue id="visx-pie-gradient" />
      <rect
        rx={14}
        width={width}
        height={height}
        fill="url('#visx-pie-gradient')"
      />
      <Group top={centerY + margin.top} left={centerX + margin.left}>
        <Pie
          data={tokens}
          pieValue={frequency}
          pieSortValues={() => -1}
          outerRadius={radius - donutThickness}
        >
          {(pie) => (
            <AnimatedPie<TokenBalance>
              {...pie}
              animate={animate}
              getKey={({ data: { token } }) => token.symbol}
              onClickDatum={({ data: { token } }) =>
                animate &&
                setSelectedToken(
                  selectedToken && selectedToken === token.symbol ? null : '',
                )
              }
              getColor={({ data: { percentOfTotal } }) =>
                getTokenFrequencyColor(percentOfTotal || 0)
              }
            />
          )}
        </Pie>
      </Group>
      {animate && (
        <text
          textAnchor="end"
          x={width - 16}
          y={height - 16}
          fill="white"
          fontSize={11}
          fontWeight={300}
          pointerEvents="none"
        >
          Click segments to update
        </text>
      )}
    </svg>
  );
}

// react-spring transition definitions
type AnimatedStyles = { startAngle: number; endAngle: number; opacity: number };

const fromLeaveTransition = ({ endAngle }: PieArcDatum<any>) => ({
  // enter from 360° if end angle is > 180°
  startAngle: endAngle > Math.PI ? 2 * Math.PI : 0,
  endAngle: endAngle > Math.PI ? 2 * Math.PI : 0,
  opacity: 0,
});
const enterUpdateTransition = ({ startAngle, endAngle }: PieArcDatum<any>) => ({
  startAngle,
  endAngle,
  opacity: 1,
});

type AnimatedPieProps<Datum> = ProvidedProps<Datum> & {
  animate?: boolean;
  getKey: (d: PieArcDatum<Datum>) => string;
  getColor: (d: PieArcDatum<Datum>) => string;
  onClickDatum: (d: PieArcDatum<Datum>) => void;
  delay?: number;
};

function AnimatedPie<Datum>({
  animate,
  arcs,
  path,
  getKey,
  getColor,
  onClickDatum,
}: AnimatedPieProps<Datum>) {
  const transitions = useTransition<PieArcDatum<Datum>, AnimatedStyles>(arcs, {
    from: animate ? fromLeaveTransition : enterUpdateTransition,
    enter: enterUpdateTransition,
    update: enterUpdateTransition,
    leave: animate ? fromLeaveTransition : enterUpdateTransition,
    keys: getKey,
  });
  return transitions((props, arc, { key }) => {
    const [centroidX, centroidY] = path.centroid(arc);
    const hasSpaceForLabel = arc.endAngle - arc.startAngle >= 0.1;

    return (
      <g key={key}>
        <animated.path
          // compute interpolated path d attribute from intermediate angle values
          d={interpolate(
            [props.startAngle, props.endAngle],
            (startAngle, endAngle) =>
              path({
                ...arc,
                startAngle,
                endAngle,
              }),
          )}
          fill={getColor(arc)}
          onClick={() => onClickDatum(arc)}
          onTouchStart={() => onClickDatum(arc)}
        />
        {hasSpaceForLabel && (
          <animated.g style={{ opacity: props.opacity }}>
            <text
              fill="black"
              x={centroidX}
              y={centroidY}
              dy=".63em"
              fontSize={11}
              textAnchor="middle"
              pointerEvents="none"
            >
              {getKey(arc)}
            </text>
          </animated.g>
        )}
      </g>
    );
  });
}
