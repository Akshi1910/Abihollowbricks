import React, { useEffect, useState } from "react";
import axios from "axios";
import styles from "./Orders.module.css";
import Sidebar from "./Sidebar";
import DashboardCards from "./DashboardCards";
import Navbar from "./Navbar";
import { FaCheckCircle } from "react-icons/fa"; // For tick icon

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [stock, setStock] = useState({});
  const [deliveryDates, setDeliveryDates] = useState({});
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");

  const typeAlias = {
    "4 inches": "4inch",
    "4 inched": "4inch",
    "4inch": "4inch",
    "6 inches": "6inch",
    "6 inched": "6inch",
    "6inch": "6inch",
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const ordersRes = await axios.get("http://localhost:5000/orders");
        setOrders(ordersRes.data);

        const stockRes = await axios.get("http://localhost:5000/api/stock");
        setStock(stockRes.data?.stockQty || {});
      } catch (error) {
        console.error("Error fetching data", error);
      }
    };

    fetchData();
  }, []);

  const handleAccept = async (id, type, quantity) => {
    const normalizedType = typeAlias[type] || type;
    const availableStock = stock[normalizedType] || 0;

    if (quantity > availableStock) {
      setPopupMessage("Cannot accept: insufficient stock");
      setShowPopup(true);
      setTimeout(() => {
        setShowPopup(false);
        setPopupMessage("");
      }, 2000);
      return;
    }

    try {
      const deliveryDate = deliveryDates[id];

      // Update the order status
      await axios.put(`http://localhost:5000/orders/${id}`, {
        deliveryDate,
        deliveryStatus: "Accepted",
      });

      // Reduce stock
      const reduceRes = await axios.put("http://localhost:5000/api/stock/reduce-stock", {
        type: normalizedType,
        quantity,
      });

      console.log(reduceRes.data); // For debugging

      // Update frontend state
      setOrders((prev) =>
        prev.map((order) =>
          order._id === id
            ? { ...order, deliveryDate, deliveryStatus: "Accepted" }
            : order
        )
      );

      setStock((prev) => ({
        ...prev,
        [normalizedType]: prev[normalizedType] - quantity,
      }));

      setPopupMessage("Order Accepted Successfully!");
      setShowPopup(true);
      setTimeout(() => {
        setShowPopup(false);
        setPopupMessage("");
      }, 2000);
    } catch (error) {
      console.error("Error accepting order", error);
      alert("Something went wrong while accepting the order.");
    }
  };

  const filteredOrders = orders
  .filter((order) => order.deliveryStatus !== "Cancelled") // exclude cancelled
  .filter((order) =>
    filterStatus === "All"
      ? true
      : (order.deliveryStatus || "Pending") === filterStatus
  );


  return (
    <>
    <Navbar/>
    <div className={styles.pageWrapper}>
      
      <Sidebar />

      <div className={styles.ordersContainer}>
        
        <DashboardCards />
        <h2 className={styles.heading}>Customer Orders</h2>

        {showPopup && <div className={styles.popup}>{popupMessage}</div>}

        {/* Filter dropdown */}
        <div className={styles.filterContainer}>
          <label htmlFor="statusFilter">Filter by Status:</label>
          <select
            id="statusFilter"
            className={styles.filterSelect}
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="All">All</option>
            <option value="Pending">Pending</option>
            <option value="Accepted">Accepted</option>
            <option value="Delivered">Delivered</option>
          </select>
        </div>

        <table className={styles.ordersTable}>
          <thead>
            <tr>
              <th>Customer</th>
              <th>Brick Type</th>
              <th>Quantity</th>
              <th>Order Date</th>
              <th>Delivery Date</th>
              <th>Status</th>
              <th>Set Delivery</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.length === 0 ? (
              <tr>
                <td colSpan="7" style={{ textAlign: "center" }}>
                  No orders found.
                </td>
              </tr>
            ) : (
              filteredOrders.map((order) => (
                <tr key={order._id}>
                  <td>{order.name}</td>
                  <td>{order.brickType}</td>
                  <td>{order.brickQuantity}</td>
                  <td>{new Date(order.orderDate).toLocaleDateString()}</td>
                  <td>
                    {order.deliveryDate
                      ? new Date(order.deliveryDate).toLocaleDateString()
                      : "Not Set"}
                  </td>
                  <td>{order.deliveryStatus || "Pending"}</td>
                 <td>
  {order.deliveryStatus === "Accepted" ? (
    <span className={styles.acceptedText}>Accepted</span>
  ) : order.deliveryStatus === "Delivered" ? (
    <FaCheckCircle color="green" size={20} />
  ) : order.deliveryStatus === "Pending" ? (
    <div className={styles.deliveryControls}>
      <input
        type="date"
        className={styles.dateInput}
        onChange={(e) =>
          setDeliveryDates({
            ...deliveryDates,
            [order._id]: e.target.value,
          })
        }
      />
      <button
        onClick={() =>
          handleAccept(order._id, order.brickType, order.brickQuantity)
        }
        className={styles.acceptButton}
      >
        Accept
      </button>
    </div>
  ) : (
    <span className={styles.statusText}>Status Not Set</span>
  )}
</td>

                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
    </>
  );
};
export default Orders;