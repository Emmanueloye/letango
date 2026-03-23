import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Rectangle,
  ResponsiveContainer,
} from 'recharts';

interface ChartData {
  data: { [key: string]: number | string }[];
  xAxisName: string;
  dataKeys: string[];
  barColors: string[];
}

const Chart: React.FC<ChartData> = ({
  data,
  xAxisName,
  dataKeys,
  barColors,
}) => {
  return (
    <div className='mt-8 w-full'>
      <ResponsiveContainer width={'100%'} height={300}>
        <BarChart
          data={data}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <XAxis dataKey={xAxisName} />
          <YAxis stroke='#f69e00' />
          <Tooltip />
          {/* the number of bars that will show will depends on the numbers of datakeys specified. */}
          {Array.from({ length: dataKeys?.length }).map((_, index) => {
            return (
              <Bar
                key={index}
                dataKey={dataKeys[index]}
                fill={barColors[index]}
                activeBar={<Rectangle fill={barColors[index]} />}
              />
            );
          })}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default Chart;
