import {
  ArcElement,
  Chart as ChartJS,
  Legend,
  Tooltip
} from 'chart.js';
import { Pie } from 'react-chartjs-2';

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend
);

const PieChart = ({ data, options }) => {
  return (
    <div className="w-full h-full">
      <Pie 
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

export default PieChart;