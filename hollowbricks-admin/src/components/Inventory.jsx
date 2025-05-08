import React, { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "./Sidebar";
import styles from "./Inventory.module.css";
import Navbar from "./Navbar";
const Inventory = () => {
  const [inventory, setInventory] = useState({
    cement: "",
    sand: "",
    aggregates: "",
  });

  const [showPopup, setShowPopup] = useState(false);
  const [popupTitle, setPopupTitle] = useState("");
  const [popupValue, setPopupValue] = useState("");
  const [popupField, setPopupField] = useState("");

  useEffect(() => {
    const fetchInventory = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/inventory");
        setInventory(res.data);
      } catch (err) {
        console.error("Failed to fetch inventory", err);
      }
    };
    fetchInventory();
  }, []);

  const openPopup = (title, currentValue, field) => {
    setPopupTitle(title);
    setPopupValue(currentValue);
    setPopupField(field);
    setShowPopup(true);
  };

  const handleConfirm = async () => {
    try {
      await axios.put("http://localhost:5000/api/inventory/update", {
        type: popupField,
        quantity: popupValue,
      });
      setInventory((prev) => ({
        ...prev,
        [popupField]: popupValue,
      }));
      alert(`${popupField} updated successfully!`);
      setShowPopup(false);
    } catch (error) {
      console.error("Update failed", error);
    }
  };

  const allowedFields = ["cement", "sand", "aggregates"];

  return (
    <>
    <Navbar/>
      <Sidebar />
      <div className={styles.container}>
        {allowedFields.map((item) => (
          <div key={item} className={styles.card}>
            <h3>{item.charAt(0).toUpperCase() + item.slice(1)}</h3>
            <p>Quantity: {inventory[item]} units</p>
            <button
              onClick={() =>
                openPopup(`Update ${item}`, inventory[item], item)
              }
            >
              Update
            </button>
          </div>
        ))}
      </div>

      {showPopup && (
        <div className={styles.popupOverlay}>
          <div className={styles.popupBox}>
            <h3>{popupTitle}</h3>
            <input
              type="number"
              value={popupValue}
              onChange={(e) => setPopupValue(e.target.value)}
            />
            <div style={{ marginTop: "10px" }}>
              <button onClick={handleConfirm} style={{ marginRight: "10px" }}>
                Confirm
              </button>
              <button onClick={() => setShowPopup(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Inventory;
