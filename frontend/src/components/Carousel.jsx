import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import styles from "./styles/Carousel.module.css";
import CarouselItem from "./CarouselItem";

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
        <CarouselItem />
        <div className={styles["img-container"]}>
          <img
            src="https://assets.goal.com/images/v3/blt89527efceef3321c/Spurs_EPL_Title.jpg?auto=webp&format=pjpg&width=3840&quality=60"
            alt="football"
          />
          <div className={styles["info-panel"]}>
            <p className={styles["title"]}>Title</p>
            <div className={styles["tags-container"]}>
              <div>Tag 1</div>
              <div>Tag 2</div>
            </div>
            <div className={styles["host-container"]}>
              <img
                className={styles["host-img"]}
                src={`https://getstream.io/random_svg/?name=user`}
              ></img>
              <span className={styles["username"]}>@username</span>
              <span className={styles["host-tag"]}>Host</span>
            </div>
            <p className={styles["description"]}>Description</p>
          </div>
        </div>
        <div className={styles["img-container"]}>
          <img
            src="https://www.southernliving.com/thmb/3x3cJaiOvQ8-3YxtMQX0vvh1hQw=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/2652401_QFSSL_SupremePizza_00072-d910a935ba7d448e8c7545a963ed7101.jpg"
            alt="pizza"
          />
          <div className={styles["info-panel"]}>
            <p className={styles["title"]}>Title</p>
            <div className={styles["tags-container"]}>
              <div>Tag 1</div>
              <div>Tag 2</div>
            </div>
            <div className={styles["host-container"]}>
              <img
                className={styles["host-img"]}
                src={`https://getstream.io/random_svg/?name=user`}
              ></img>
              <span className={styles["username"]}>@username</span>
              <span className={styles["host-tag"]}>Host</span>
            </div>
            <p className={styles["description"]}>Description</p>
          </div>
        </div>
        <div className={styles["img-container"]}>
          <img
            src="https://lh3.googleusercontent.com/proxy/aUgrhGKGn_en019cC0KG_ZZbg2iej0PwT5NfOuNuKqOU75--Q9tJDTQfSM7CzPEAHX7VHNd8pee8WVAVEhzUm_tRK1CJICXfrtKznpFJcoRiKtWADJY8sfKiuvsygAOf"
            alt="ai"
          />
          <div className={styles["info-panel"]}>
            <p className={styles["title"]}>Title</p>
            <div className={styles["tags-container"]}>
              <div>Tag 1</div>
              <div>Tag 2</div>
            </div>
            <div className={styles["host-container"]}>
              <img
                className={styles["host-img"]}
                src={`https://getstream.io/random_svg/?name=user`}
              ></img>
              <span className={styles["username"]}>@username</span>
              <span className={styles["host-tag"]}>Host</span>
            </div>
            <p className={styles["description"]}>Description</p>
          </div>
        </div>
        <div className={styles["img-container"]}>
          <img
            src="https://www.economist.com/content-assets/images/20230708_LDD001.jpg"
            alt="war"
          />
          <div className={styles["info-panel"]}>
            <p className={styles["title"]}>Title</p>
            <div className={styles["tags-container"]}>
              <div>Tag 1</div>
              <div>Tag 2</div>
            </div>
            <div className={styles["host-container"]}>
              <img
                className={styles["host-img"]}
                src={`https://getstream.io/random_svg/?name=user`}
              ></img>
              <span className={styles["username"]}>@username</span>
              <span className={styles["host-tag"]}>Host</span>
            </div>
            <p className={styles["description"]}>Description</p>
          </div>
        </div>
      </Slider>
    </div>
  );
};

export default Carousel;
