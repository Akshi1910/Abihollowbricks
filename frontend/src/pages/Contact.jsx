import { useState } from "react";
import styles from "./Contact.module.css";
import Navbar from "../Navbar";

export default function Contact() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    message: "",
  });

  // Handle Input Changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle Form Submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:5000/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const result = await response.json();
      alert(result.message);

      // Reset Form
      setFormData({ firstName: "", lastName: "", phone: "", email: "", message: "" });
    } catch (error) {
      console.error("Error:", error);
      alert("Failed to send message!");
    }
  };

  return (
    <>
      <Navbar />
      <div className={styles.contactContainer}>
      <h1 className={styles.contactTitle}>Our Contact Information</h1>

      <div className={styles.contactSections}>
        {/* Address Section */}
        <div className={styles.contactBox}>
          <img src="https://tse3.mm.bing.net/th?id=OIP.qoKXMC-wAgwBMkPKfgR1tQHaHa&pid=Api&P=0&h=180" alt="Location Icon" className={styles.icon} />
          <h2>Our Address</h2>
          <p>
            101,Abi Hollow Bricks,
            Vellakovil Muthur Road,
            Erode.
          </p>
        </div>

        {/* Phone Section */}
        <div className={styles.contactBox}>
          <img src="https://tse2.mm.bing.net/th?id=OIP.LmQDwmhcpw1Hqm0VXvrPmgHaHa&pid=Api&P=0&h=180" alt="Phone Icon" className={styles.icon} />
          <h2>Get In Touch</h2>
          <p>Mobile: +91 8482944881</p>
          <p>Mobile: +91 9767388873</p>
        </div>

        {/* Email Section */}
        <div className={styles.contactBox}>
          <img src="https://tse1.mm.bing.net/th?id=OIP.zlB8erc30-Q3ZSpH3q2igQHaHa&pid=Api&P=0&h=180" alt="Email Icon" className={styles.icon} />
          <h2>Email</h2>
          <p>abihollowbricks@gmail.com</p>
        </div>
      </div>
    </div>
      <div className={styles.contactContainer}>
        <h1 className={styles.contactTitle}>Get In Touch</h1>

        <div className={styles.contactSections}>
          {/* Left Side - Contact Form */}
          <form className={styles.contactForm} onSubmit={handleSubmit}>
            <div className={styles.inputRow}>
              <input
                type="text"
                name="firstName"
                placeholder="First Name"
                className={styles.inputField}
                value={formData.firstName}
                onChange={handleChange}
                required
              />
              <input
                type="text"
                name="lastName"
                placeholder="Last Name"
                className={styles.inputField}
                value={formData.lastName}
                onChange={handleChange}
                required
              />
            </div>

            <div className={styles.inputRow}>
              <input
                type="text"
                name="phone"
                placeholder="Phone Number"
                className={styles.inputField}
                value={formData.phone}
                onChange={handleChange}
                required
              />
              <input
                type="email"
                name="email"
                placeholder="Email Address"
                className={styles.inputField}
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <textarea
              name="message"
              placeholder="What’s on your mind"
              className={styles.textArea}
              value={formData.message}
              onChange={handleChange}
              required
            ></textarea>

            <button type="submit" className={styles.submitButton}>SEND MESSAGE NOW</button>
          </form>

          {/* Right Side - Google Map */}
          <div className={styles.mapContainer}>
            <iframe
              title="Google Map"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d4673.767486820361!2d77.75169305303284!3d11.111425739967352!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ba97902446fd127%3A0xe8e7fa9e126194a0!2sAbi%20hollow%20bricks!5e0!3m2!1sen!2sin!4v1740674025539!5m2!1sen!2sin"
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className={styles.mapIframe}
            ></iframe>
          </div>
        </div>
      </div>
    </>
  );
}
