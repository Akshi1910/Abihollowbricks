import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
const SalesEstimation = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timeRange, setTimeRange] = useState('monthly');
  const [startDate, setStartDate] = useState(new Date(new Date().setFullYear(new Date().getFullYear() - 1)));
  const [endDate, setEndDate] = useState(new Date());
  const [brickTypeFilter, setBrickTypeFilter] = useState('all');

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get('http://localhost:5000/orders');
        setOrders(response.data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const filterOrdersByDate = (orders) => {
    return orders.filter(order => {
      const orderDate = new Date(order.orderDate);
      return orderDate >= startDate && orderDate <= endDate;
    });
  };

  const filterOrdersByBrickType = (orders) => {
    if (brickTypeFilter === 'all') return orders;
    return orders.filter(order => order.brickType === brickTypeFilter);
  };

  const processData = () => {
    let filteredOrders = filterOrdersByDate(orders);
    filteredOrders = filterOrdersByBrickType(filteredOrders);

    if (timeRange === 'daily') {
      const dailyData = {};
      filteredOrders.forEach(order => {
        const date = new Date(order.orderDate).toLocaleDateString();
        if (!dailyData[date]) {
          dailyData[date] = {
            date,
            quantity: 0,
            revenue: 0
          };
        }
        dailyData[date].quantity += order.brickQuantity;
        dailyData[date].revenue += order.amount || 0;
      });
      return Object.values(dailyData);
    } else if (timeRange === 'weekly') {
      const weeklyData = {};
      filteredOrders.forEach(order => {
        const date = new Date(order.orderDate);
        const weekNumber = getWeekNumber(date);
        const year = date.getFullYear();
        const key = `${year}-W${weekNumber}`;
        
        if (!weeklyData[key]) {
          weeklyData[key] = {
            week: key,
            quantity: 0,
            revenue: 0
          };
        }
        weeklyData[key].quantity += order.brickQuantity;
        weeklyData[key].revenue += order.amount || 0;
      });
      return Object.values(weeklyData);
    } else {
      const monthlyData = {};
      filteredOrders.forEach(order => {
        const date = new Date(order.orderDate);
        const month = date.toLocaleString('default', { month: 'short' });
        const year = date.getFullYear();
        const key = `${month} ${year}`;
        
        if (!monthlyData[key]) {
          monthlyData[key] = {
            month: key,
            quantity: 0,
            revenue: 0
          };
        }
        monthlyData[key].quantity += order.brickQuantity;
        monthlyData[key].revenue += order.amount || 0;
      });
      return Object.values(monthlyData);
    }
  };

  const getWeekNumber = (date) => {
    const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
    const pastDaysOfYear = (date - firstDayOfYear) / 86400000;
    return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
  };

  const calculateTotals = () => {
    const filteredOrders = filterOrdersByBrickType(filterOrdersByDate(orders));
    const totalQuantity = filteredOrders.reduce((sum, order) => sum + order.brickQuantity, 0);
    const totalRevenue = filteredOrders.reduce((sum, order) => sum + (order.amount || 0), 0);
    
    return { totalQuantity, totalRevenue };
  };

  const { totalQuantity, totalRevenue } = calculateTotals();
  const chartData = processData();

  const brickTypes = ['all', ...new Set(orders.map(order => {
    if (order.brickType.includes('4inch')) return '4inch Brick';
    if (order.brickType.includes('solid')) return 'Solid Brick';
    return order.brickType;
  }))].filter((value, index, self) => self.indexOf(value) === index);

  if (loading) return (
    <div className="container">
      <div className="loading-spinner">Loading...</div>
    </div>
  );
  
  if (error) return (
    <div className="container">
      <div className="error-message">Error: {error}</div>
    </div>
  );

  return (
    <>
    <Navbar/>
    <Sidebar/>
    <div className="container">
      <h2>Sales Estimation Dashboard</h2>
      
      <div className="filters">
        <div className="dateRange">
          <label>Date Range:</label>
          <DatePicker
            selected={startDate}
            onChange={date => setStartDate(date)}
            selectsStart
            startDate={startDate}
            endDate={endDate}
            className="datePicker"
          />
          <DatePicker
            selected={endDate}
            onChange={date => setEndDate(date)}
            selectsEnd
            startDate={startDate}
            endDate={endDate}
            minDate={startDate}
            className="datePicker"
          />
        </div>
        
        <div className="timeRange">
          <label>Time Range:</label>
          <select 
            value={timeRange} 
            onChange={(e) => setTimeRange(e.target.value)}
            className="timeSelect"
          >
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
          </select>
        </div>
        
        <div className="brickType">
          <label>Brick Type:</label>
          <select 
            value={brickTypeFilter} 
            onChange={(e) => setBrickTypeFilter(e.target.value)}
            className="brickSelect"
          >
            {brickTypes.map(type => (
              <option key={type} value={type === 'all' ? 'all' : type}>
                {type === 'all' ? 'All Types' : type}
              </option>
            ))}
          </select>
        </div>
      </div>
      
      <div className="summaryCards">
        <div className="summaryCard">
          <h3>Total Orders</h3>
          <p>{filterOrdersByBrickType(filterOrdersByDate(orders)).length}</p>
        </div>
        <div className="summaryCard">
          <h3>Total Bricks Sold</h3>
          <p>{totalQuantity}</p>
        </div>
        <div className="summaryCard">
          <h3>Total Revenue</h3>
          <p>₹{totalRevenue.toFixed(2)}</p>
        </div>
      </div>
      
      <div className="charts">
        <div className="chartContainer">
          <h3>Bricks Sold</h3>
          <div className="chart-wrapper">
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey={timeRange === 'daily' ? 'date' : timeRange === 'weekly' ? 'week' : 'month'} />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="quantity" fill="#8884d8" name="Bricks Sold" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        <div className="chartContainer">
          <h3>Revenue</h3>
          <div className="chart-wrapper">
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey={timeRange === 'daily' ? 'date' : timeRange === 'weekly' ? 'week' : 'month'} />
                <YAxis />
                <Tooltip formatter={(value) => `₹${value}`} />
                <Legend />
                <Bar dataKey="revenue" fill="#82ca9d" name="Revenue (₹)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <style jsx>{`
        .container {
          padding: 40px 20px;
          font-family: Arial, sans-serif;
          background-color: #f5f5f5;
          min-height: calc(100vh - 80px);
          margin-left: 20px;
          overflow-y: auto;
          position: absolute;
          top: 80px;
          right: 0;
          bottom: 0;
          left: 250px;
        }

        h2 {
          text-align: center;
          color: #4a1f6b;
          margin-bottom: 30px;
        }

        .loading-spinner,
        .error-message {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100%;
          font-size: 18px;
        }

        .filters {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: 20px;
          margin-bottom: 30px;
          background: white;
          padding: 20px;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }

        .dateRange,
        .timeRange,
        .brickType {
          display: flex;
          flex-direction: column;
          font-size: 16px;
          min-width: 200px;
        }

        .dateRange label,
        .timeRange label,
        .brickType label {
          margin-bottom: 5px;
          font-weight: bold;
          color: #333;
        }

        .datePicker {
          padding: 8px;
          border: 1px solid #ccc;
          border-radius: 6px;
          font-size: 16px;
          background-color: white;
          margin: 5px 0;
          width: 100%;
        }

        .timeSelect,
        .brickSelect {
          padding: 8px;
          border: 1px solid #ccc;
          border-radius: 6px;
          font-size: 16px;
          background-color: white;
          width: 100%;
        }

        .summaryCards {
          display: flex;
          justify-content: center;
          gap: 30px;
          margin-bottom: 40px;
          flex-wrap: wrap;
        }

        .summaryCard {
          background-color: #fff;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          padding: 25px 30px;
          border-radius: 12px;
          text-align: center;
          width: 200px;
          flex-grow: 1;
        }

        .summaryCard h3 {
          margin-bottom: 10px;
          color: #4a1f6b;
          font-size: 16px;
        }

        .summaryCard p {
          font-size: 24px;
          font-weight: bold;
          color: #333;
          margin: 0;
        }

        .charts {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 40px;
          padding-bottom: 60px;
        }

        .chartContainer {
          background-color: #fff;
          padding: 25px;
          border-radius: 12px;
          box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
          width: 100%;
          max-width: 1000px;
        }

        .chartContainer h3 {
          text-align: center;
          margin-bottom: 20px;
          color: #4a1f6b;
        }

        .chart-wrapper {
          height: 400px;
          width: 100%;
          min-height: 400px;
        }

        @media (max-width: 768px) {
          .container {
            margin-left: 0;
            left: 0;
            padding: 20px 10px;
            position: relative;
            min-height: 100vh;
            top: 0;
          }
          
          .filters {
            flex-direction: column;
            align-items: stretch;
          }
          
          .summaryCards {
            flex-direction: column;
            align-items: stretch;
            gap: 15px;
          }
          
          .summaryCard {
            width: auto;
          }

          .chartContainer {
            padding: 15px;
          }

          .chart-wrapper {
            height: 300px;
            min-height: 300px;
          }
        }
      `}</style>
    </div>
    </>
  );
};

export default SalesEstimation;