// frontend/components/yamazumi/YamazumiChart.js
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Box, Paper, Typography } from '@mui/material';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const YamazumiChart = ({ data }) => {
  const chartData = {
    labels: data.stations.map(station => station.name),
    datasets: [
      {
        label: 'NVAA',
        data: data.stations.map(station => station.nvaa),
        backgroundColor: '#8884d8',
      },
      {
        label: 'VAA',
        data: data.stations.map(station => station.vaa),
        backgroundColor: '#82ca9d',
      },
      {
        label: 'SVAA',
        data: data.stations.map(station => station.svaa),
        backgroundColor: '#ffc658',
      },
      {
        label: 'UNB',
        data: data.stations.map(station => station.unb),
        backgroundColor: '#ff7300',
      },
    ],
  };

  const options = {
    responsive: true,
    scales: {
      x: {
        stacked: true,
      },
      y: {
        stacked: true,
        title: {
          display: true,
          text: 'Time (seconds)',
        },
      },
    },
    plugins: {
      legend: {
        position: 'bottom',
      },
      tooltip: {
        callbacks: {
          footer: (tooltipItems) => {
            let sum = 0;
            tooltipItems.forEach(function(tooltipItem) {
              sum += tooltipItem.parsed.y;
            });
            return 'Total: ' + sum.toFixed(1) + ' seconds';
          },
        },
      },
    },
  };

  return (
    <Box>
      <Typography variant="h6" sx={{ mb: 2 }}>Yamazumi Chart</Typography>
      <Paper sx={{ p: 2 }}>
        <Bar data={chartData} options={options} />
      </Paper>
    </Box>
  );
};

export default YamazumiChart;