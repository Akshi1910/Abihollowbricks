import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./Home";
import About from "./About";
import Contact from "./pages/Contact";
import Order from "./pages/Order";
import BrickDetails from "./BricksDetails";
import Services from "./pages/Service";
import UserOrders from "./UserOrders";
import Checkout from "./CheckOut";
function App() {
  return (
    <Router>
      <Routes>
        
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<About />} />
        <Route path="/order" element={<Order />} />
        <Route path='/contact' element={<Contact/>}/>
        <Route path='/blog' element={<BrickDetails/>}/>
        <Route path='/service' element={<Services/>}/>
        <Route path='/user-dashboard' element={<UserOrders/>}/>
        <Route path="/checkout" element={<Checkout />} />
      </Routes>
    </Router>
  );
}

export default App;
