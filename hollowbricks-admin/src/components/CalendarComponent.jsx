import React, { useEffect, useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import axios from 'axios';
import styles from './Calendar.module.css';
import Sidebar from './Sidebar';
const CalendarComponent = () => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get('http://localhost:5000/orders');
        const calendarEvents = response.data
          .filter(order => order.deliveryDate)
          .map(order => ({
            title: `${order.name} - ${order.brickType} (${order.brickQuantity})`,
            date: order.deliveryDate,
            extendedProps: {
              address: order.address,
              status: order.deliveryStatus,
            },
          }));
        setEvents(calendarEvents);
      } catch (error) {
        console.error('Error fetching orders:', error);
      }
    };

    fetchOrders();
  }, []);

  return (
    <>
    <Sidebar/>
    <div className={styles.calendarContainer}>
      <div className={styles.calendarBox}>
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          headerToolbar={{
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,timeGridDay',
          }}
          events={events}
          height="auto"
        />
      </div>
    </div>
    </>
  );
};

export default CalendarComponent;
