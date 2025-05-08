import React, { useEffect, useState } from "react";
import axios from "axios";
import styles from "./TodaysOrders.module.css";
import Navbar from "./Navbar";

const TodaysOrders = () => {
  const [todaysOrders, setTodaysOrders] = useState([]);

  useEffect(() => {
    const fetchTodaysOrders = async () => {
      try {
        const response = await axios.get("http://localhost:5000/orders");
        const today = new Date().toISOString().slice(0, 10); // yyyy-mm-dd

        const filteredOrders = response.data.filter((order) => {
          const orderDate = new Date(order.orderDate).toISOString().slice(0, 10);
          return orderDate === today;
        });

        setTodaysOrders(filteredOrders);
      } catch (error) {
        console.error("Error fetching today's orders:", error);
      }
    };

    fetchTodaysOrders();
  }, []);

  return (
    <>
 
      <div className={styles.container}>
        <h2>Today's Orders</h2>
        {todaysOrders.length === 0 ? (
          <p>No orders for today.</p>
        ) : (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Brick Type</th>
                <th>Quantity</th>
                <th>Address</th>
              </tr>
            </thead>
            <tbody>
              {todaysOrders.map((order) => (
                <tr key={order._id}>
                  <td>{order.name}</td>
                  <td>{order.email}</td>
                  <td>{order.brickType}</td>
                  <td>{order.brickQuantity}</td>
                  <td>{order.address}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
};

export default TodaysOrders;
