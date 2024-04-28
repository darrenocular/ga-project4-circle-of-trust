import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import styles from "./styles/Carousel.module.css";

const Carousel = (props) => {
  const settings = {
    useTransform: true,
    dots: true,
    lazyLoad: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 4000,
    cssEase: "ease-out",
  };

  return (
    <div className={styles["carousel-container"]}>
      <Slider {...settings}>
        <div>
          <img
            src="https://www.worldatlas.com/r/w1200/upload/59/ef/f6/shutterstock-322328156.jpg"
            alt="olympics"
          />
        </div>
        <div>
          <img
            src="https://assets.goal.com/images/v3/blt89527efceef3321c/Spurs_EPL_Title.jpg?auto=webp&format=pjpg&width=3840&quality=60"
            alt="football"
          />
        </div>
        <div>
          <img
            src="https://www.southernliving.com/thmb/3x3cJaiOvQ8-3YxtMQX0vvh1hQw=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/2652401_QFSSL_SupremePizza_00072-d910a935ba7d448e8c7545a963ed7101.jpg"
            alt="pizza"
          />
        </div>
        <div>
          <img
            src="https://lh3.googleusercontent.com/proxy/aUgrhGKGn_en019cC0KG_ZZbg2iej0PwT5NfOuNuKqOU75--Q9tJDTQfSM7CzPEAHX7VHNd8pee8WVAVEhzUm_tRK1CJICXfrtKznpFJcoRiKtWADJY8sfKiuvsygAOf"
            alt="ai"
          />
        </div>
        <div>
          <img
            src="https://www.economist.com/content-assets/images/20230708_LDD001.jpg"
            alt="war"
          />
        </div>
      </Slider>
    </div>
  );
};

export default Carousel;
