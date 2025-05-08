import { PieChart, Pie, Cell, Tooltip } from "recharts";

const data = [
  { name: "Type A", value: 400 },
  { name: "Type B", value: 300 },
  { name: "Type C", value: 300 },
  { name: "Type D", value: 200 },
];

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

const DoughnutChart = () => {
  return (
    <PieChart width={400} height={300}>
      <Pie data={data} cx="50%" cy="50%" innerRadius={60} outerRadius={100} fill="#8884d8" dataKey="value">
        {data.map((entry, index) => (
          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
        ))}
      </Pie>
      <Tooltip />
    </PieChart>
  );
};

export default DoughnutChart;
