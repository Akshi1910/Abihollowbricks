import React, { useEffect, useState } from "react";
import axios from "axios";
import styles from "./TodaysOrders.module.css";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
const TodaysDeliveries = () => {
  const [todaysOrders, setTodaysOrders] = useState([]);

  useEffect(() => {
    const fetchTodayDeliveries = async () => {
      try {
        const res = await axios.get("http://localhost:5000/orders");
        const allOrders = res.data;

        const today = new Date().toISOString().split("T")[0];

        const filtered = allOrders.filter((order) => {
          if (!order.deliveryDate) return false;
          const deliveryDate = new Date(order.deliveryDate).toISOString().split("T")[0];
          return deliveryDate === today && order.deliveryStatus === "Accepted";
        });

        setTodaysOrders(filtered);
      } catch (error) {
        console.error("Error fetching today's deliveries:", error);
      }
    };

    fetchTodayDeliveries();
  }, []);

  return (
    <>
    <Navbar/>
    <div className={styles.pageWrapper}>
      <Sidebar />
      <div className={styles.container}>
        <h2 className={styles.heading}>Today's Deliveries</h2>

        {todaysOrders.length === 0 ? (
          <p className={styles.noDeliveries}>No deliveries scheduled for today.</p>
        ) : (
          <table className={styles.deliveryTable}>
            <thead>
              <tr>
                <th>Customer</th>
                <th>Brick Type</th>
                <th>Quantity</th>
                <th>Order Date</th>
                <th>Delivery Date</th>
              </tr>
            </thead>
            <tbody>
              {todaysOrders.map((order) => (
                <tr key={order._id}>
                  <td>{order.name}</td>
                  <td>{order.brickType}</td>
                  <td>{order.brickQuantity}</td>
                  <td>{new Date(order.orderDate).toLocaleDateString()}</td>
                  <td>{new Date(order.deliveryDate).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
    </>
  );
};

export default TodaysDeliveries;
