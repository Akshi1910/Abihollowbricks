import { useEffect, useState } from "react";
import axios from "axios";
import styles from "./CheckOut.module.css";

export default function Checkout() {
  const [orderData, setOrderData] = useState(null);
  const [rates, setRates] = useState(null);

  useEffect(() => {
    const savedOrder = JSON.parse(localStorage.getItem("orderData"));
    setOrderData(savedOrder);

    axios.get("http://localhost:5000/rates").then((res) => {
      setRates(res.data);
    });
  }, []);

  const handleProceed = () => {
    // Add your checkout logic here
    alert("Order placed successfully!");
    // You might want to redirect or clear the cart here
  };

  if (!orderData || !rates) return <p>Loading...</p>;

  const brickRate = rates.brickRates[orderData.brickType];
  const deliveryRate = rates.deliveryRate;
  const brickCost = brickRate * orderData.brickQuantity;
  const deliveryCost = deliveryRate * orderData.brickQuantity;
  const gst = 0.12 * (brickCost + deliveryCost);
  const totalCost = brickCost + deliveryCost + gst;

  return (
    <div className={styles.checkoutContainer}>
      <h1 className={styles.checkoutTitle}>Checkout</h1>
      
      <div className={styles.checkoutDetails}>
        <div className={styles.detailRow}>
          <span className={styles.detailLabel}>Name:</span>
          <span className={styles.detailValue}>{orderData.name}</span>
        </div>
        
        <div className={styles.detailRow}>
          <span className={styles.detailLabel}>Brick Type:</span>
          <span className={styles.detailValue}>{orderData.brickType}</span>
        </div>
        
        <div className={styles.detailRow}>
          <span className={styles.detailLabel}>Quantity:</span>
          <span className={styles.detailValue}>{orderData.brickQuantity}</span>
        </div>
        
        <div className={styles.detailRow}>
          <span className={styles.detailLabel}>Brick Rate:</span>
          <span className={styles.detailValue}>₹{brickRate}</span>
        </div>
        
        <div className={styles.detailRow}>
          <span className={styles.detailLabel}>Delivery Rate:</span>
          <span className={styles.detailValue}>₹{deliveryRate}</span>
        </div>
        
        <div className={styles.detailRow}>
          <span className={styles.detailLabel}>Brick Cost:</span>
          <span className={styles.detailValue}>₹{brickCost}</span>
        </div>
        
        <div className={styles.detailRow}>
          <span className={styles.detailLabel}>Delivery Cost:</span>
          <span className={styles.detailValue}>₹{deliveryCost}</span>
        </div>
        
        <div className={styles.detailRow}>
          <span className={styles.detailLabel}>GST (12%):</span>
          <span className={styles.detailValue}>₹{gst.toFixed(2)}</span>
        </div>
        
        <div className={`${styles.detailRow} ${styles.totalRow}`}>
          <span className={styles.detailLabel}>Total:</span>
          <span className={styles.detailValue}>₹{totalCost.toFixed(2)}</span>
        </div>
      </div>
      
      <button className={styles.proceedButton} onClick={handleProceed}>
        Proceed to Payment
      </button>
    </div>
  );
}