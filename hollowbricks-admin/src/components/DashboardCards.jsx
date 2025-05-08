import React from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Dashboard.module.css";

const DashboardCards = () => {
  const navigate = useNavigate();

  return (
    <div className={styles.cardsContainer}>
      <div className={styles.card}>
        <h3>Total Orders</h3>
       
        <button
          className={styles.cardButton}
          onClick={() => navigate("/orders-summary")}
        >
          View Orders
        </button>
      </div>

      <div className={styles.card}>
        <h3>Pending Deliveries</h3>
      
        <button
          className={styles.cardButton}
          onClick={() => navigate("/pendingorders")}
        >
          Accept Orders
        </button>
      </div>

      <div className={styles.card}>
        <h3>Deliveries Today</h3>
     
        <button
          className={styles.cardButton}
          onClick={() => navigate("/today-deliveries")}
        >
          Check Now
        </button>
      </div>

      <div className={styles.card}>
        <h3>Today Orders</h3>
        <button
          className={styles.cardButton}
          onClick={() => navigate("/today-orders")}
        >
          Check Now
        </button>
      </div>
    </div>
  );
};

export default DashboardCards;
