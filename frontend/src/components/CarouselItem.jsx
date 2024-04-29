import React, { useState, useEffect, useContext } from "react";
import styles from "./styles/CarouselItem.module.css";
import { Link } from "react-router-dom";
import AppContext from "../context/AppContext";
import useFetch from "../hooks/useFetch";

const placeholderImageLinks = {
  0: "https://www.worldatlas.com/r/w1200/upload/59/ef/f6/shutterstock-322328156.jpg",
  1: "https://assets.goal.com/images/v3/blt89527efceef3321c/Spurs_EPL_Title.jpg?auto=webp&format=pjpg&width=3840&quality=60",
  2: "https://www.southernliving.com/thmb/3x3cJaiOvQ8-3YxtMQX0vvh1hQw=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/2652401_QFSSL_SupremePizza_00072-d910a935ba7d448e8c7545a963ed7101.jpg",
  3: "https://lh3.googleusercontent.com/proxy/aUgrhGKGn_en019cC0KG_ZZbg2iej0PwT5NfOuNuKqOU75--Q9tJDTQfSM7CzPEAHX7VHNd8pee8WVAVEhzUm_tRK1CJICXfrtKznpFJcoRiKtWADJY8sfKiuvsygAOf",
  4: "https://www.economist.com/content-assets/images/20230708_LDD001.jpg",
};

const CarouselItem = ({ circle, idx }) => {
  const [tags, setTags] = useState([]);
  const fetchData = useFetch();
  const appContext = useContext(AppContext);

  const getTags = async () => {
    try {
      const res = await fetchData(
        "/circles/tags",
        "POST",
        {
          circle_id: circle.id,
        },
        appContext.accessToken
      );

      if (res.ok) {
        setTags(res.data);
      } else {
        throw new Error(
          typeof res.msg === "object" ? JSON.stringify(res.msg) : res.msg
        );
      }
    } catch (error) {
      console.error(error.message);
    }
  };

  useEffect(() => {
    getTags();
  }, []);

  return (
    <div className={styles["img-container"]}>
      <Link to={`/circle/${circle.id}`} className={styles["link"]}>
        <img src={`${placeholderImageLinks[idx]}`} alt="circle-img" />
        <div className={styles["info-panel"]}>
          <p className={styles["title"]}>{circle.title}</p>
          <div className={styles["tags-container"]}>
            {tags.map((tag, idx) => (
              <div key={idx}>{tag}</div>
            ))}
          </div>
          <div className={styles["host-container"]}>
            <img
              className={styles["host-img"]}
              src={`https://getstream.io/random_svg/?name=${circle.username}`}
            ></img>
            <span className={styles["username"]}>@{circle.username}</span>
            <span className={styles["host-tag"]}>Host</span>
          </div>
          <p className={styles["description"]}>{circle.description}</p>
        </div>
      </Link>
    </div>
  );
};

export default CarouselItem;
