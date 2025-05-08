import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from "recharts";

const data = [
  { month: "Jan", orders: 30, stock: 100 },
  { month: "Feb", orders: 45, stock: 80 },
  { month: "Mar", orders: 60, stock: 50 },
];

const BarChartComponent = () => {
  return (
    <BarChart width={400} height={300} data={data}>
      <XAxis dataKey="month" />
      <YAxis />
      <Tooltip />
      <Legend />
      <Bar dataKey="orders" fill="#3498db" />
      <Bar dataKey="stock" fill="#e74c3c" />
    </BarChart>
  );
};

export default BarChartComponent;
