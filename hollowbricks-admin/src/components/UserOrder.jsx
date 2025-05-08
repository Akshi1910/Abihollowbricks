import React, { useEffect, useState } from "react";

const UserOrder = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/orders")
      .then((res) => res.json())
      .then((data) => setOrders(data))
      .catch((error) => console.error("Error fetching orders:", error));
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Your Orders</h2>
      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-200">
            <th className="p-2 border">Brick Type</th>
            <th className="p-2 border">Quantity</th>
            <th className="p-2 border">Delivery Date</th>
            <th className="p-2 border">Status</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order._id} className="text-center">
              <td className="p-2 border">{order.brickType}</td>
              <td className="p-2 border">{order.brickQuantity}</td>
              <td className="p-2 border">{order.deliveryDate || "Not Assigned"}</td>
              <td className="p-2 border">{order.deliveryStatus}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserOrder;
