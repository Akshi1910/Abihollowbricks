import { useState } from "react";
import styles from "./BrickDetails.module.css"; // Import the CSS file
import Navbar from "./Navbar";
export default function BrickDetails() {
  const [selectedImage, setSelectedImage] = useState(
    "https://tse2.mm.bing.net/th?id=OIP.6tEMZsbC9uphsNoPJ5rQtQAAAA&pid=Api&P=0&h=180"
  );

  const images = [
    "https://tse2.mm.bing.net/th?id=OIP.6tEMZsbC9uphsNoPJ5rQtQAAAA&pid=Api&P=0&h=180",
    "https://5.imimg.com/data5/RT/XN/GO/SELLER-33847754/4-inch-hallow-blockkk.jpg",
    "https://www.cementconcrete.org/wp-content/uploads/2021/04/Concrete-Hollow-Blocks.jpg",
    "https://cdn.fcglcdn.com/brainbees/images/products/583x720/12300132a.webp",
  ];

  return (
    <>
    <Navbar/>
    <div className={styles.container}>
      {/* Left Section: Images */}
      <div className={styles.flexRow}>
        <div className={styles.imageGallery}>
          <div className={styles.thumbnailContainer}>
            {images.map((img, index) => (
              <img
                key={index}
                src={img}
                alt="Thumbnail"
                className={`${styles.thumbnail} ${
                  selectedImage === img ? styles.selectedThumbnail : ""
                }`}
                onClick={() => setSelectedImage(img)}
              />
            ))}
          </div>
          <img
            src={selectedImage}
            alt="Hollow Brick"
            className={styles.mainImage}
          />
        </div>

        {/* Right Section: Product Details */}
        <div className={styles.details}>
          <h1 className={styles.productTitle}>Hollow Brick</h1>
          
          <p className={styles.productPrice}>₹38</p>

          

          {/* Brick Sizes */}
          <div className={styles.brickSizes}>
            <h2>Brick Sizes</h2>
            <div className={styles.sizeOptions}>
              
                <button  className={styles.sizeButton}>
                  4 inches
                </button>
           
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  );
}
