import React, { useEffect, useState } from "react";
import axios from "axios";
import styles from "./Stock.module.css"; // assuming you're using module.css
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
const Stock = () => {
  const [brickRate4, setBrickRate4] = useState("");
  const [brickRate6, setBrickRate6] = useState("");
  const [deliveryRate, setDeliveryRate] = useState("");
  const [stockQty4, setStockQty4] = useState("");
  const [stockQty6, setStockQty6] = useState("");

  const [showPopup, setShowPopup] = useState(false);
  const [popupTitle, setPopupTitle] = useState("");
  const [popupValue, setPopupValue] = useState("");
  const [popupType, setPopupType] = useState("");
  const [popupField, setPopupField] = useState("");

  useEffect(() => {
    const fetchStock = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/stock");
        const data = res.data;
        if (data) {
          setBrickRate4(data.brickRates?.["4inch"] || "");
          setBrickRate6(data.brickRates?.["6inch"] || "");
          setDeliveryRate(data.deliveryRate || "");
          setStockQty4(data.stockQty?.["4inch"] || "");
          setStockQty6(data.stockQty?.["6inch"] || "");
        }
      } catch (err) {
        console.error("Error fetching stock data", err);
      }
    };

    fetchStock();
  }, []);

  const openPopup = (title, currentValue, type, field) => {
    setPopupTitle(title);
    setPopupValue(currentValue);
    setPopupType(type); // 'brickRate', 'stockQty', 'deliveryRate'
    setPopupField(field); // '4inch', '6inch', or '' for deliveryRate
    setShowPopup(true);
  };

  const handleConfirm = async () => {
    try {
      if (popupType === "brickRate") {
        await axios.put("http://localhost:5000/api/stock/update-brick-rate", {
          type: popupField,
          rate: popupValue,
        });
        popupField === "4inch"
          ? setBrickRate4(popupValue)
          : setBrickRate6(popupValue);
      } else if (popupType === "stockQty") {
        await axios.put("http://localhost:5000/api/stock/update-stock-qty", {
          type: popupField,
          quantity: popupValue,
        });
        popupField === "4inch"
          ? setStockQty4(popupValue)
          : setStockQty6(popupValue);
      } else if (popupType === "deliveryRate") {
        await axios.put(
          "http://localhost:5000/api/stock/update-delivery-rate",
          { deliveryRate: popupValue }
        );
        setDeliveryRate(popupValue);
      }

      alert(`${popupTitle} updated!`);
      setShowPopup(false);
    } catch (error) {
      console.error("Update failed", error);
    }
  };

  return (
    <>
    <Navbar/>
    <Sidebar/>
    <div className={styles.stockContainer}>
      {/* Brick Rates */}
      <div className={styles.card}>
        <h3>Hollow Brick Rates</h3>
        <p>4 inch: ₹ {brickRate4}</p>
        <button
          onClick={() =>
            openPopup("Update 4 inch Brick Rate", brickRate4, "brickRate", "4inch")
          }
        >
          Update 4 inch
        </button>
        <p>6 inch: ₹ {brickRate6}</p>
        <button
          onClick={() =>
            openPopup("Update 6 inch Brick Rate", brickRate6, "brickRate", "6inch")
          }
        >
          Update 6 inch
        </button>
      </div>

      {/* Stock Quantity */}
      <div className={styles.card}>
        <h3>Stock Quantity</h3>
        <p>4 inch: {stockQty4} bricks</p>
        <button
          onClick={() =>
            openPopup("Update 4 inch Stock Quantity", stockQty4, "stockQty", "4inch")
          }
        >
          Update 4 inch
        </button>
        <p>6 inch: {stockQty6} bricks</p>
        <button
          onClick={() =>
            openPopup("Update 6 inch Stock Quantity", stockQty6, "stockQty", "6inch")
          }
        >
          Update 6 inch
        </button>
      </div>

      {/* Delivery Rate */}
      <div className={styles.card}>
        <h3>Delivery Rate</h3>
        <p>₹ {deliveryRate}</p>
        <button
          onClick={() =>
            openPopup("Update Delivery Rate", deliveryRate, "deliveryRate", "")
          }
        >
          Update
        </button>
      </div>

      {/* Popup Modal */}
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
              <button onClick={handleConfirm}>Confirm</button>
              <button onClick={() => setShowPopup(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
    </>
  );
};

export default Stock;
