import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  Title,
  Tooltip
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const BarChart = ({ data, options }) => {
  return (
    <div className="w-full h-full">
      <Bar 
        data={data} 
        options={{
          ...options,
          responsive: true,
          maintainAspectRatio: false
        }} 
      />
    </div>
  );
};

export default BarChart;