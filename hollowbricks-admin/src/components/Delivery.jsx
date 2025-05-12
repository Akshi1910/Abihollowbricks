import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "./Navbar";
import styles from "./Delivery.module.css";
import Sidebar from "./Sidebar";
import CalendarComponent from "./CalendarComponent";
const Delivery = () => {
  const [orders, setOrders] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");

  useEffect(() => {
    const fetchAcceptedOrders = async () => {
      try {
        const res = await axios.get("http://localhost:5000/orders");
        const acceptedOrders = res.data.filter(
          (order) => order.deliveryStatus === "Accepted"
        );
        setOrders(acceptedOrders);
      } catch (err) {
        console.error("Error fetching orders:", err);
      }
    };

    fetchAcceptedOrders();
  }, []);

  const handleMarkDelivered = async (id) => {
    try {
      await axios.put(`http://localhost:5000/orders/${id}`, {
        deliveryStatus: "Delivered",
      });

      // Update frontend state
      setOrders((prev) => prev.filter((order) => order._id !== id));

      setPopupMessage("Order marked as Delivered!");
      setShowPopup(true);
      setTimeout(() => {
        setShowPopup(false);
        setPopupMessage("");
      }, 2000);
    } catch (error) {
      console.error("Error updating status:", error);
      alert("Failed to mark order as delivered.");
    }
  };

  return (
    <>
    <Sidebar/>
      <Navbar />
    <div className={styles.deliveryContainer}>
  <h2 className={styles.heading}>Delivery Management</h2>
  {showPopup && <div className={styles.popup}>{popupMessage}</div>}


  <div className={styles.cardsContainer}>
    {orders.length === 0 ? (
      <p>No accepted orders to deliver.</p>
    ) : (
      orders.map((order) => (
        <div key={order._id} className={styles.card}>
          <h4>{order.name}</h4>
          <p><strong>Type:</strong> {order.brickType}</p>
          <p><strong>Quantity:</strong> {order.brickQuantity}</p>
          <p><strong>Order Date:</strong> {new Date(order.orderDate).toLocaleDateString()}</p>
          <p><strong>Delivery Date:</strong> {new Date(order.deliveryDate).toLocaleDateString()}</p>
          <button
            className={styles.cardButton}
            onClick={() => handleMarkDelivered(order._id)}
          >
            Mark as Delivered
          </button>
        </div>
      ))
    )}
  </div>
</div>

    </>
  );
};

export default Delivery;
