import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Dashboard from "./components/Dashboard";
import Orders from "./components/Orders";
import Stock from "./components/Stock";
//import Stock from "./components/Stock";
//import Inventory from "./Components/Inventory";
//import Users from "./components/Users";
import Login from "./components/Login";
import Inventory from "./components/Inventory";
import OrdersSummary from "./components/OrdersSummary";
import PendingOrders from "./components/PendingOrders";
import TodaysDeliveries from "./components/TodaysDeliveries";
import TodaysOrders from "./components/TodaysOrders";
import CalendarComponent from "./components/CalendarComponent";
import MarkDelivered from "./components/MarkDeivered";
import Delivery from "./components/Delivery";

import SalesEstimation from "./components/SalesEstimation";

const App = () => {
  return (
    <>
    
    <Router>
      <Routes>
        {/* Dashboard Layout with Sidebar */}
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="orders" element={<Orders />} />
          <Route path="/" element={<Login/>} />
          <Route path="/stock" element={<Stock/>} />
          <Route path="/inventory" element={<Inventory/>} />
          <Route path="/orders-summary" element={<OrdersSummary/>} />
          <Route path="/pendingorders" element={<PendingOrders/>} />
          <Route path="/today-deliveries" element={<TodaysDeliveries/>} />
          <Route path="/today-orders" element={<TodaysOrders/>} />
          <Route path="/mark-delivered" element={<MarkDelivered />} />
          <Route path="/delivery" element={<Delivery />} />
          <Route path="/sales" element={<SalesEstimation />} />
      </Routes>
    </Router>
    </>
  );
};

export default App;
