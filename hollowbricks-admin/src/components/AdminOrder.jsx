import React, { useEffect, useState } from "react";

const AdminOrder = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/orders")
      .then((res) => res.json())
      .then((data) => setOrders(data))
      .catch((error) => console.error("Error fetching orders:", error));
  }, []);

  const handleUpdate = async (id, deliveryDate, deliveryStatus) => {
    try {
      const res = await fetch(`http://localhost:5000/orders/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ deliveryDate, deliveryStatus }),
      });

      if (res.ok) {
        setOrders((prevOrders) =>
          prevOrders.map((order) =>
            order._id === id ? { ...order, deliveryDate, deliveryStatus } : order
          )
        );
      } else {
        console.error("Failed to update order");
      }
    } catch (error) {
      console.error("Error updating order:", error);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Admin Order Management</h2>
      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-200">
            <th className="p-2 border">Brick Type</th>
            <th className="p-2 border">Quantity</th>
            <th className="p-2 border">Delivery Date</th>
            <th className="p-2 border">Status</th>
            <th className="p-2 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order._id} className="text-center">
              <td className="p-2 border">{order.brickType}</td>
              <td className="p-2 border">{order.brickQuantity}</td>
              <td className="p-2 border">
                <input
                  type="date"
                  value={order.deliveryDate || ""}
                  onChange={(e) =>
                    handleUpdate(order._id, e.target.value, order.deliveryStatus)
                  }
                />
              </td>
              <td className="p-2 border">
                <select
                  value={order.deliveryStatus}
                  onChange={(e) =>
                    handleUpdate(order._id, order.deliveryDate, e.target.value)
                  }
                >
                  <option value="Pending">Pending</option>
                  <option value="Accepted">Accepted</option>
                  <option value="Delivered">Delivered</option>
                </select>
              </td>
              <td className="p-2 border">
                <button
                  className="bg-blue-500 text-white px-3 py-1 rounded"
                  onClick={() =>
                    handleUpdate(order._id, order.deliveryDate, order.deliveryStatus)
                  }
                >
                  Save
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminOrder;
