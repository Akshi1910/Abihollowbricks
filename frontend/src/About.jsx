import { useState } from "react";
import Slider from "react-slick";
import styles from "./About.module.css";
import Navbar from "./Navbar";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

export default function About() {
  const images = [
    "https://theconstructor.org/wp-content/uploads/2020/08/How-to-Construct-Concrete-Block-Masonry.jpg",
    "https://i2.wp.com/civilblog.org/wp-content/uploads/2015/09/Different-forms-of-hollow-concrete-blocks.jpg?resize=640%2C353&ssl=1",
    "https://tse3.mm.bing.net/th?id=OIP.ZWUe9wfvZY-vkpa8nc5JAgHaE7&pid=Api&P=0&h=180",
  ];

  const settings = {
    dots: true,
    infinite: true,
    speed: 800,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2000,
    arrows: true,
  };

  return (
    <>
      <Navbar />
      <div className={styles.aboutContainer}>
        {/* Left Section - Text Content */}
        <div className={styles.aboutContent}>
          <p className={styles.highlight}>🔶 ABOUT ABI HOLLOW BRICKS</p>
          <h1 className={styles.mainHeading}>Quality Hollow Bricks</h1>
          <p className={styles.aboutText}>
            Abi Hollow Bricks is committed to providing high-quality, durable, 
            and aesthetically appealing bricks that stand the test of time.
            We ensure our bricks contribute to cost-effective and sustainable 
            construction solutions.
          </p>
        </div>

        {/* Right Section - Carousel */}
        <div className={styles.carouselContainer}>
          <Slider {...settings}>
            {images.map((img, index) => (
              <div key={index} className={styles.slide}>
                <img src={img} alt={`Slide ${index + 1}`} className={styles.aboutImage} />
              </div>
            ))}
          </Slider>
        </div>
      </div>
    </>
  );
}
