import React, { useEffect, useState } from "react";
import axios from "axios";
import styles from "./Orders.module.css";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import DashboardCards from "./DashboardCards";

const PendingOrders = () => {
  const [orders, setOrders] = useState([]);
  const [stock, setStock] = useState({});
  const [deliveryDates, setDeliveryDates] = useState({});
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");
  const [filterStatus, setFilterStatus] = useState("Pending");

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
        const pending = ordersRes.data.filter(
          (order) => !order.deliveryStatus || order.deliveryStatus === "Pending"
        );
        setOrders(pending);

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

      await axios.put(`http://localhost:5000/orders/${id}`, {
        deliveryDate,
        deliveryStatus: "Accepted",
      });

      await axios.put("http://localhost:5000/api/stock/reduce-stock", {
        type: normalizedType,
        quantity,
      });

      setStock((prev) => ({
        ...prev,
        [normalizedType]: prev[normalizedType] - quantity,
      }));

      setOrders((prev) => prev.filter((order) => order._id !== id));

      setPopupMessage("Order Accepted Successfully!");
      setShowPopup(true);
      setTimeout(() => {
        setShowPopup(false);
        setPopupMessage("");
      }, 2000);
    } catch (error) {
      console.error("Error accepting order", error);
    }
  };

  const filteredOrders =
    filterStatus === "All"
      ? orders
      : orders.filter((order) => (order.deliveryStatus || "Pending") === filterStatus);

  return (
    <>
      <Navbar />
      <div className={styles.pageWrapper}>
        <Sidebar />

        <div className={styles.ordersContainer}>
        
          <h2 className={styles.heading}>Pending Orders</h2>

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
            </select>
          </div>

          {filteredOrders.length === 0 ? (
            <p>No pending orders 🎉</p>
          ) : (
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
                {filteredOrders.map((order) => (
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
                      ) : (
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
                              handleAccept(
                                order._id,
                                order.brickType,
                                order.brickQuantity
                              )
                            }
                            className={styles.acceptButton}
                          >
                            Accept
                          </button>
                        </div>
                      )}
                    </td>
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

export default PendingOrders;
