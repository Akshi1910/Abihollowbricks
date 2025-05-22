import { useEffect, useState } from "react";
import axios from "axios";
import styles from "./CheckOut.module.css";
import Navbar from "./Navbar";
export default function Checkout() {
  const [orderData, setOrderData] = useState(null);
  const [rates, setRates] = useState(null);
  const [loading, setLoading] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const BACKEND_URL = "https://abihollowbricks-backend.onrender.com";

const handleCashOnDelivery = async () => {
  setLoading(true);
  try {
    const response = await axios.post("http://localhost:5000/orders", {
      name: orderData.name,
      email: orderData.email,
      phone: orderData.phone,
      address: orderData.address,
      brickType: orderData.brickType,
      brickQuantity: orderData.brickQuantity,
      deliveryDate: orderData.deliveryDate,
      paymentMethod: "Cash on Delivery",
      amount: totalCost
    });

    if (response.status === 201) {
      setPaymentSuccess(true);
      localStorage.removeItem("orderData");
    }
  } catch (error) {
    alert("Failed to place COD order");
    console.error(error);
  } finally {
    setLoading(false);
  }
};

  // Load Razorpay script
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  // Load order data and rates
  useEffect(() => {
    const savedOrder = JSON.parse(localStorage.getItem("orderData"));
    setOrderData(savedOrder);

    axios.get(`${BACKEND_URL}/rates`).then((res) => {
      setRates(res.data);
    });
  }, []);

  const handleProceed = async () => {
    setLoading(true);
    
    try {
      const response = await axios.post(`${BACKEND_URL}/api/payment/create-razorpay-order`, {
        amount: Math.round(totalCost * 100), // Convert to paise
        currency: "INR",
        receipt: `order_${Date.now()}`,
        notes: {
          customer_name: orderData.name,
          brick_type: orderData.brickType,
          quantity: orderData.brickQuantity
        }
      });

      const options = {
        key: "rzp_test_4rdgre6savrrmw", // Use environment variable
        amount: response.data.amount,
        currency: response.data.currency,
        name: "Abi Hollow Bricks",
        description: `Order for ${orderData.brickQuantity} ${orderData.brickType} Bricks`,
        image: "https://static.vecteezy.com/system/resources/previews/020/429/653/original/abi-flat-accounting-logo-design-on-white-background-abi-creative-initials-growth-graph-letter-logo-concept-abi-business-finance-logo-design-vector.jpg", // Add your logo
        order_id: response.data.id,
        handler: async function(response) {
          // Verify payment on your server
          const verification = await axios.post(`${BACKEND_URL}/api/payment/verify-payment`, {
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_order_id: response.razorpay_order_id,
            razorpay_signature: response.razorpay_signature
          });

          if (verification.data.success) {
            setPaymentSuccess(true);
            localStorage.removeItem("orderData");
            // Send confirmation email or update database
            await axios.post(`${BACKEND_URL}/api/payment/confirm-order`, {
              orderId: response.razorpay_order_id,
              paymentId: response.razorpay_payment_id,
              amount: totalCost,
              customer: orderData.name
            });
          } else {
            alert("Payment verification failed");
          }
        },
        prefill: {
          name: orderData.name,
          email: orderData.email || "customer@example.com",
          contact: orderData.phone || "9000000000"
        },
        theme: {
          color: "#3399cc",
          hide_topbar: false
        },
        modal: {
          ondismiss: function() {
            setLoading(false);
          },
          escape: true,
          handleback: true
        },
        notes: {
          address: orderData.address || "Not specified"
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error("Payment error:", error);
      alert("Payment failed to initialize. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!orderData || !rates) return <div className={styles.loading}>Loading...</div>;

  const brickRate = rates.brickRates[orderData.brickType];
  const deliveryRate = rates.deliveryRate;
  const brickCost = brickRate * orderData.brickQuantity;
  const deliveryCost = deliveryRate * orderData.brickQuantity;
  const gst = 0.12 * (brickCost + deliveryCost);
  const totalCost = brickCost + deliveryCost + gst;

  return (
    <>
    <Navbar/>
    <div className={styles.checkoutContainer}>
      <h1 className={styles.checkoutTitle}>Checkout</h1>
      
      {paymentSuccess ? (
        <div className={styles.successContainer}>
          <h2>Order Confirmed!</h2>
          <p>Thank you for your purchase.</p>
          <p>We've sent the order details to your email.</p>
          <button 
            className={styles.continueShopping}
            onClick={() => window.location.href = "/"}
          >
            Continue Shopping
          </button>
        </div>
      ) : (
        <>
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
              <span className={styles.detailValue}>₹{brickRate.toFixed(2)}</span>
            </div>
            
            <div className={styles.detailRow}>
              <span className={styles.detailLabel}>Delivery Rate:</span>
              <span className={styles.detailValue}>₹{deliveryRate.toFixed(2)}</span>
            </div>
            
            <div className={styles.detailRow}>
              <span className={styles.detailLabel}>Brick Cost:</span>
              <span className={styles.detailValue}>₹{brickCost.toFixed(2)}</span>
            </div>
            
            <div className={styles.detailRow}>
              <span className={styles.detailLabel}>Delivery Cost:</span>
              <span className={styles.detailValue}>₹{deliveryCost.toFixed(2)}</span>
            </div>
            
            <div className={styles.detailRow}>
              <span className={styles.detailLabel}>GST (12%):</span>
              <span className={styles.detailValue}>₹{gst.toFixed(2)}</span>
            </div>
            
            <div className={`${styles.detailRow} ${styles.totalRow}`}>
              <span className={styles.detailLabel}>Total Amount:</span>
              <span className={styles.detailValue}>₹{totalCost.toFixed(2)}</span>
            </div>
          </div>
          <button 
  className={styles.proceedButton} 
  onClick={handleCashOnDelivery}
  disabled={loading}
>
  {loading ? "Placing Order..." : "Cash on Delivery"}
</button>

          <button 
            className={styles.proceedButton} 
            onClick={handleProceed}
            disabled={loading}
          >
            {loading ? (
              <>
                <span className={styles.spinner}></span>
                Processing...
              </>
            ) : (
              "Proceed to Payment"
            )}
          </button>
        </>
      )}
    </div>
    </>
  );
}