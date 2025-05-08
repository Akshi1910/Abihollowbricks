import styles from "./Services.module.css";
import Navbar from "../Navbar";

export default function Services() {
  const services = [
    {
      title: "Best Price",
      description: "All our products are at highly affordable prices with the highest quality available in the market.",
      img: "https://www.citypng.com/public/uploads/preview/hd-red-best-price-tag-icon-transparent-png-11639606680qwpshszrfr.png",
    },
    {
      title: "Best Service",
      description: "Consistently delivering exceptional service, we prioritize your satisfaction, ensuring every interaction leaves you with a smile.",
      img: "https://answerfirst.com/wp-content/uploads/2017/11/best-answering-service.jpg",
    },
    {
      title: "Best Quality",
      description: "Ensuring product authenticity and quality that's our motto. All of our products are of premium quality.",
      img: "https://thumbs.dreamstime.com/b/best-quality-concept-hand-take-transparet-ball-wordcloud-red-inscription-41769678.jpg",
    },
    {
      title: "Best Customer Care",
      description: "Experience unparalleled customer satisfaction with our dedicated support team, committed to providing you with the best service.",
      img: "https://tse2.mm.bing.net/th?id=OIP.bHXTTtOl5SZCanu-KABV7QHaEl&pid=Api&P=0&h=180",
    },
    
    {
      title: "Best Product Reviews",
      description: "User-generated reviews and ratings for products to help other shoppers make informed purchasing decisions.",
      img: "https://floridaindependent.com/wp-content/uploads/2020/10/product-review.jpg",
    },
  ];

  return (
    <>
      <Navbar />
      <div className={styles.servicesContainer}>
        <h1 className={styles.title}>Our Services</h1>
        <p className={styles.subtitle}>Check out the great services we offer!</p>

        <div className={styles.servicesGrid}>
          {services.map((service, index) => (
            <div key={index} className={styles.card}>
              <img src={service.img} alt={service.title} className={styles.cardImg} />
              <div className={styles.cardBody}>
                <h3 className={styles.cardTitle}>{service.title}</h3>
                <p className={styles.cardDesc}>{service.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
