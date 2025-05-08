import { useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import axios from "axios";
import styles from "./Order.module.css";
import Navbar from "../Navbar";

export default function Order() {
  const { user, isAuthenticated } = useAuth0();
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    brickType: "4 inches",
    brickQuantity: 1, // New field for brick quantity
    deliveryDate: "",
    selectedStones: [],
  });

  // Stone options
  const stoneOptions = [
    { id: 1, name: "4 inches", image: "https://www.800benaa.com/application/files/2215/0329/9483/4_inch_Hollow.jpg" },
    { id: 2, name: "6 inches", image: "https://5.imimg.com/data5/RT/XN/GO/SELLER-33847754/4-inch-hallow-blockkk.jpg" }
  ];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleStoneChange = (stone) => {
    setFormData((prev) => {
      const existingStone = prev.selectedStones.find((s) => s.id === stone.id);
      if (existingStone) {
        return { ...prev, selectedStones: prev.selectedStones.filter((s) => s.id !== stone.id) };
      } else {
        return { ...prev, selectedStones: [...prev.selectedStones, { ...stone, quantity: 1 }] };
      }
    });
  };

  const handleQuantityChange = (stoneId, quantity) => {
    setFormData((prev) => ({
      ...prev,
      selectedStones: prev.selectedStones.map((s) =>
        s.id === stoneId ? { ...s, quantity: quantity } : s
      ),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      alert("Please log in to place an order.");
      return;
    }

    const orderData = {
      name: formData.name,
      email: user.email,
      address: formData.address,
      brickType: formData.brickType,
      brickQuantity: formData.brickQuantity, // Include brick quantity in request
      deliveryDate: formData.deliveryDate,
      selectedStones: formData.selectedStones,
    };

    try {
      await axios.post("http://localhost:5000/orders", orderData);
      localStorage.setItem("orderData", JSON.stringify(orderData));

      window.location.href = "/checkout";
    } catch (error) {
      alert("Failed to place order.");
    }
  };

  return (
    <>
      <Navbar />

      <div className={styles.orderContainer}>
        <h1 className={styles.title}>Order Hollow Bricks</h1>

        <div className={styles.orderContent}>
          {/* Left Section - Order Form */}
          <form onSubmit={handleSubmit} className={styles.orderForm}>
            <label>Name:</label>
            <input type="text" name="name" required onChange={handleChange} />

            <label>Address:</label>
            <textarea name="address" required onChange={handleChange} />

            <label>Type of Hollow Brick:</label>
            <select name="brickType" onChange={handleChange}>
              <option value="4 inches">4 Inches</option>
              <option value="6 inches">6 Inches</option>
            </select>

            <label>Quantity of Bricks:</label> {/* New Input for Brick Quantity */}
            <input
              type="number"
              name="brickQuantity"
              min="1"
              required
              value={formData.brickQuantity}
              onChange={handleChange}
            />

            <label>Expected Delivery Date:</label>
            <input type="date" name="deliveryDate" required onChange={handleChange} />

            <button type="submit" className={styles.orderButton}>Place Order</button>
          </form>

          {/* Right Section - Stone Selection */}
          <div className={styles.stoneSelection}>
            <h2>Hollow Bricks:</h2>
            <div className={styles.stoneOptions}>
              {stoneOptions.map((stone) => (
                <div key={stone.id} className={styles.stoneItem}>
                  
                 
                    <img src={stone.image} alt={stone.name} className={styles.stoneImage} />
                    <p>{stone.name}</p>
                
                  
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
