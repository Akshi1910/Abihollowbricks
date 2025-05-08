import Navbar from "./Navbar";
import styles from "./HomePage.module.css";
import { useNavigate } from "react-router-dom";

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <div className={styles.container}>
      <Navbar /> {/* Imported Navbar Component */}
      <div className={styles.heroSection}>
        {/* Left Side - Text Content */}
        <div className={styles.textContent}>
          <h1>Abi Hollow Bricks</h1>
          <p>
          Abi Hollow Bricks is committed to providing high-quality, durable, and aesthetically appealing bricks that stand the test of time. We ensure our bricks contribute to cost-effective and sustainable construction solutions.
          </p>
          <button className={styles.contactButton} onClick={() => navigate("/order")}>
            Order Now
          </button>
        </div>

        {/* Right Side - Pyramid Image Layout */}
        <div className={styles.imageGallery}>
          <div className={styles.topImage}>
            <img
              src="https://housing.com/news/wp-content/uploads/2023/10/what-are-hollow-bricks-f-compressed.jpg"
              alt="Hollow Bricks 1"
              className={styles.heroImage}
            />
          </div>
          <div className={styles.bottomImages}>
            <img
              src="https://housing.com/news/wp-content/uploads/2023/10/what-are-hollow-bricks-f-compressed.jpg"
              alt="Hollow Bricks 2"
              className={styles.heroImage}
            />
            <img
              src="https://housing.com/news/wp-content/uploads/2023/10/what-are-hollow-bricks-f-compressed.jpg"
              alt="Hollow Bricks 3"
              className={styles.heroImage}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
