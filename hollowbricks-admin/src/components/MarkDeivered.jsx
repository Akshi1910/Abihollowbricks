import React, { useEffect, useState } from "react";
import axios from "axios";
import styles from "./Orders.module.css";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import { FaCheckCircle } from "react-icons/fa"; // For tick icon

const MarkDelivered = () => {
  const [orders, setOrders] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [ordersPerPage, setOrdersPerPage] = useState(10);

  useEffect(() => {
    const fetchAcceptedOrders = async () => {
      try {
        const res = await axios.get("http://localhost:5000/orders");
        const accepted = res.data.filter(
          (order) => order.deliveryStatus === "Accepted"
        );
        setOrders(accepted);
      } catch (error) {
        console.error("Error fetching orders", error);
      }
    };

    fetchAcceptedOrders();
  }, []);

  const markAsDelivered = async (id) => {
    try {
      const res = await axios.put(`http://localhost:5000/orders/${id}/deliver`);
      setOrders((prev) =>
        prev.map((order) =>
          order._id === id ? { ...order, deliveryStatus: "Delivered" } : order
        )
      );
    } catch (error) {
      console.error("Failed to mark as delivered", error);
      alert("Error updating delivery status.");
    }
  };

  // Filter only "Accepted" or recently marked "Delivered" (not already delivered at fetch)
  const filteredOrders = orders.filter(
    (order) => order.deliveryStatus === "Accepted" || order.deliveryStatus === "Delivered"
  );

  // Pagination
  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = filteredOrders.slice(indexOfFirstOrder, indexOfLastOrder);
  const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);

  return (
    <>
      <Navbar />
      <div className={styles.pageWrapper}>
        <Sidebar />
        <div className={styles.ordersContainer}>
          <h2 className={styles.heading}>Mark Orders as Delivered</h2>

          <div className={styles.filterContainer}>
            <label>Orders per page: </label>
            <select
              value={ordersPerPage}
              onChange={(e) => {
                setOrdersPerPage(parseInt(e.target.value));
                setCurrentPage(1);
              }}
              className={styles.filterSelect}
            >
              <option value={10}>10</option>
              <option value={20}>20</option>
            </select>
          </div>

          <table className={styles.ordersTable}>
            <thead>
              <tr>
                <th>Customer</th>
                <th>Brick Type</th>
                <th>Quantity</th>
                <th>Delivery Date</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {currentOrders.length === 0 ? (
                <tr>
                  <td colSpan="6" style={{ textAlign: "center" }}>
                    No accepted orders.
                  </td>
                </tr>
              ) : (
                currentOrders.map((order) => (
                  <tr key={order._id}>
                    <td>{order.name}</td>
                    <td>{order.brickType}</td>
                    <td>{order.brickQuantity}</td>
                    <td>
                      {order.deliveryDate
                        ? new Date(order.deliveryDate).toLocaleDateString()
                        : "Not Set"}
                    </td>
                    <td>{order.deliveryStatus}</td>
                    <td>
                      {order.deliveryStatus === "Delivered" ? (
                        <FaCheckCircle color="green" size={20} />
                      ) : (
                        <button
                          className={styles.acceptButton}
                          onClick={() => markAsDelivered(order._id)}
                        >
                          Mark Delivered
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          {/* Pagination */}
          <div className={styles.pagination}>
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((prev) => prev - 1)}
              className={styles.acceptButton}
            >
              Prev
            </button>
            <span style={{ margin: "0 10px" }}>
              Page {currentPage} of {totalPages}
            </span>
            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((prev) => prev + 1)}
              className={styles.acceptButton}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default MarkDelivered;
