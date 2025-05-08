import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth0 } from "@auth0/auth0-react";
import styles from "./UserOrders.module.css";
import Navbar from "./Navbar";

const UserOrders = () => {
  const { user, isAuthenticated, isLoading } = useAuth0();
  const [userOrders, setUserOrders] = useState([]);

  useEffect(() => {
    const fetchUserOrders = async () => {
      if (!user || !user.email) return;

      try {
        const response = await axios.get("http://localhost:5000/orders");
        const filtered = response.data.filter(order => order.email === user.email);
        setUserOrders(filtered);
      } catch (error) {
        console.error("Error fetching user orders", error);
      }
    };

    fetchUserOrders();
  }, [user]);

  const handleCancel = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/orders/${id}`);
      setUserOrders((prev) => prev.filter(order => order._id !== id));
    } catch (error) {
      console.error("Error cancelling order", error);
    }
  };

  if (isLoading) return <p>Loading...</p>;
  if (!isAuthenticated) return <p>Please log in to view your orders.</p>;

  return (
    <>
      <Navbar />
      <div className={styles.userOrdersContainer}>
        <h2>Your Orders</h2>
        {userOrders.length === 0 ? (
          <p>No orders found for {user.email}</p>
        ) : (
          <table className={styles.userOrdersTable}>
            <thead>
              <tr>
                <th>Brick Type</th>
                <th>Quantity</th>
                <th>Order Date</th>
                <th>Delivery Date</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {userOrders.map((order) => (
                <tr key={order._id}>
                  <td>{order.brickType}</td>
                  <td>{order.brickQuantity}</td>
                  <td>{new Date(order.orderDate).toLocaleDateString()}</td>
                  <td>
                    {order.deliveryDate
                      ? new Date(order.deliveryDate).toLocaleDateString()
                      : "Not Set"}
                  </td>
                  <td className={styles.status}>
                    {order.deliveryStatus || "Pending"}
                  </td>
                  <td>
                    {order.deliveryStatus === "Accepted" ? (
                      <span style={{ color: "gray" }}>Cannot Cancel</span>
                    ) : (
                      <button
                        className={styles.cancelButton}
                        onClick={() => handleCancel(order._id)}
                      >
                        Cancel
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
};

export default UserOrders;
