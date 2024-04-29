import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import styles from "./styles/Carousel.module.css";
import CarouselItem from "./CarouselItem";

const Carousel = ({ circles }) => {
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
        {circles.map((circle, idx) => (
          <CarouselItem circle={circle} idx={idx} key={idx} />
        ))}
      </Slider>
    </div>
  );
};

export default Carousel;
