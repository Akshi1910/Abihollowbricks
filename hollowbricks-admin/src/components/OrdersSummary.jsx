import React, { useEffect, useState } from "react";
import axios from "axios";
import styles from "./OrdersSummary.module.css";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
  Title,
} from "chart.js";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend, Title);

const OrdersSummary = () => {
  const [orders, setOrders] = useState([]);
  const [chartData, setChartData] = useState({});
  const [selectedFilter, setSelectedFilter] = useState("daily");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axios.get("http://localhost:5000/orders");
        setOrders(res.data);
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };

    fetchOrders();
  }, []);

  useEffect(() => {
    if (orders.length === 0) return;

    const daily = {};
    const weekly = {};
    const monthly = {};

    orders.forEach((order) => {
      const date = new Date(order.orderDate);
      const day = date.toISOString().slice(0, 10); // yyyy-mm-dd
      const week = `W${getWeekNumber(date)}-${date.getFullYear()}`;
      const month = `${date.getMonth() + 1}/${date.getFullYear()}`;

      daily[day] = (daily[day] || 0) + 1;
      weekly[week] = (weekly[week] || 0) + 1;
      monthly[month] = (monthly[month] || 0) + 1;
    });

    setChartData({
      daily,
      weekly,
      monthly,
    });
  }, [orders]);

  const getWeekNumber = (date) => {
    const startOfYear = new Date(date.getFullYear(), 0, 1);
    const pastDaysOfYear = (date - startOfYear) / 86400000;
    return Math.ceil((pastDaysOfYear + startOfYear.getDay() + 1) / 7);
  };

  const buildChart = (labels, data, label, color) => ({
    labels,
    datasets: [
      {
        label,
        data,
        backgroundColor: color,
        barThickness: 40,
        maxBarThickness: 30,
      },
    ],
  });

  const chartColors = {
    daily: "#4a1f6b",
    weekly: "#8C5EB8",
    monthly: "#C29AE7",
  };

  const currentData = chartData[selectedFilter] || {};
  const capitalizedFilter = selectedFilter.charAt(0).toUpperCase() + selectedFilter.slice(1);

  const downloadCSV = () => {
  if (orders.length === 0) return;

  // Format dates properly for CSV
  const formatDateForCSV = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? dateString : date.toISOString();
  };

  const headers = Object.keys(orders[0]);
  const csvRows = [
    headers.join(','), // header row
    ...orders.map(order =>
      headers.map(header => {
        // Special handling for date fields
        if (header.toLowerCase().includes('date')) {
          return `"${formatDateForCSV(order[header])}"`;
        }
        // Escape quotes in other fields
        const value = order[header] ?? '';
        return `"${value.toString().replace(/"/g, '""')}"`;
      }).join(',')
    ),
  ];

  const csvData = csvRows.join('\n');
  const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.href = url;
  a.download = 'orders.csv';
  a.click();
  URL.revokeObjectURL(url);
};


  return (
    <>
      <Navbar />
      <Sidebar />
      <div className={styles.container}>
        <h2>Orders Summary</h2>

        <div className={styles.filterWrapper}>
          <label htmlFor="filterSelect">View By:</label>
          <select
            id="filterSelect"
            value={selectedFilter}
            onChange={(e) => setSelectedFilter(e.target.value)}
            className={styles.filterSelect}
          >
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
          </select>
        </div>

        <div className={styles.downloadWrapper}>
          <button onClick={downloadCSV} className={styles.downloadButton}>
            Download CSV
          </button>
        </div>

        <div className={styles.chartSection}>
          <h3>{capitalizedFilter} Orders</h3>
          <Bar
            data={buildChart(
              Object.keys(currentData),
              Object.values(currentData),
              `${capitalizedFilter} Orders`,
              chartColors[selectedFilter]
            )}
          />
        </div>
      </div>
    </>
  );
};

export default OrdersSummary;
