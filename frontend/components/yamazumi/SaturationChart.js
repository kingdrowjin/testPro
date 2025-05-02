// frontend/components/yamazumi/SaturationChart.js
import { Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';
import { Box, Paper, Typography } from '@mui/material';

ChartJS.register(ArcElement, Tooltip, Legend);

const SaturationChart = ({ data }) => {
  // Get the first station data
  const station1 = data.stations[0];
  if (!station1) return null;

  const total = station1.nvaa + station1.vaa + station1.svaa + station1.unb;

  const chartData = {
    labels: ['NVAA', 'VAA', 'SVAA', 'UNB'],
    datasets: [
      {
        data: [
          Math.round((station1.nvaa / total) * 100),
          Math.round((station1.vaa / total) * 100),
          Math.round((station1.svaa / total) * 100),
          Math.round((station1.unb / total) * 100),
        ],
        backgroundColor: [
          '#8884d8',
          '#82ca9d',
          '#ffc658',
          '#ff7300',
        ],
        borderColor: [
          '#6666b3',
          '#5da47a',
          '#dda43c',
          '#d95d00',
        ],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'right',
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            return `${context.label}: ${context.parsed}%`;
          }
        }
      },
      title: {
        display: true,
        text: `${station1.name} Saturation`,
      },
    },
  };

  return (
    <Box>
      <Typography variant="h6" sx={{ mb: 2 }}>Saturation Chart</Typography>
      <Paper sx={{ p: 2 }}>
        <Pie data={chartData} options={options} />
      </Paper>
    </Box>
  );
};

export default SaturationChart;