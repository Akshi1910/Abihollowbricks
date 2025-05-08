import React, { useEffect, useState } from "react";
import axios from "axios";
import styles from "./Dashboard.module.css";
import Sidebar from "./Sidebar";
import { Bar, Doughnut } from "react-chartjs-2";
import TodaysOrders from "./TodaysOrders";
import Navbar from "./Navbar";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
  Title,
} from "chart.js";

// Register chart components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
  Title
);

const Dashboard = () => {
  const [orders, setOrders] = useState([]);
  const [stock, setStock] = useState({});
  const [inventory, setInventory] = useState({});
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const ordersRes = await axios.get("http://localhost:5000/orders");
        setOrders(ordersRes.data);

        const stockRes = await axios.get("http://localhost:5000/api/stock");
        setStock(stockRes.data);

        const inventoryRes = await axios.get("http://localhost:5000/api/inventory");
        setInventory(inventoryRes.data);
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
        setPopupMessage("Failed to load dashboard data");
        setShowPopup(true);
        setTimeout(() => {
          setShowPopup(false);
          setPopupMessage("");
        }, 3000);
      }
    };

    fetchData();
  }, []);

  const totalOrders = orders.length;
  const pendingDeliveries = orders.filter(
    (order) => order.deliveryStatus !== "Accepted"
  ).length;

  const stockQty = stock.stockQty || {};
  const totalStock = Object.values(stockQty).reduce((acc, qty) => acc + qty, 0);
  const lowStockItems = Object.values(stockQty).filter((qty) => qty < 200).length;

  // Bar Chart Data
  const barChartData = {
    labels: Object.keys(stockQty),
    datasets: [
      {
        label: "Stock Quantity",
        data: Object.values(stockQty),
        backgroundColor: "#4a1f6b",
      },
    ],
  };

  const barChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Current Brick Stock by Size",
      },
    },
  };

  // Doughnut Chart Data
  const doughnutChartData = {
    labels: Object.keys(inventory),
    datasets: [
      {
        label: "Inventory Distribution",
        data: Object.values(inventory),
        backgroundColor: [
          "#4a1f6b",
          "#6B42A0",
          "#8C5EB8",
          "#A67BD1",
          "#C29AE7",
          "#E0C3F5",
        ],
        borderWidth: 1,
      },
    ],
  };

  return (
    <>
    <Navbar/>
      <Sidebar />
      <div className={styles.mainContent}>
      
      <div className={styles.dashboardContainer}>
        <h2 className={styles.heading}>Dashboard Overview</h2>
        
        {showPopup && <div className={styles.popup}>{popupMessage}</div>}

        <div className={styles.cardsContainer}>
          <div className={styles.card}>
            <h3>Total Orders</h3>
            <p>{totalOrders}</p>
          </div>
          <div className={styles.card}>
            <h3>Pending Deliveries</h3>
            <p>{pendingDeliveries}</p>
          </div>
          <div className={styles.card}>
            <h3>Total Stock (Bricks)</h3>
            <p>{totalStock}</p>
          </div>
          <div className={styles.card}>
            <h3>Low Stock Items</h3>
            <p>{lowStockItems}</p>
          </div>
        </div>
        <TodaysOrders/>
        <div className={styles.chartsRow}>
          <div className={styles.chartContainer}>
            <Bar data={barChartData} options={barChartOptions} />
          </div>
          <div className={styles.chartContainer}>
            <Doughnut data={doughnutChartData} />
          </div>
        </div>
      </div>
      </div>
    </>
  );
};

export default Dashboard;
