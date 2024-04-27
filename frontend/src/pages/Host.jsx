import React, { useState, useContext } from "react";
import useFetch from "../hooks/useFetch";
import styles from "./styles/Host.module.css";
import FormInput from "../components/utils/FormInput";
import Button from "../components/utils/Button";
import AppContext from "../context/AppContext";

const Host = () => {
  const [title, setTitle] = useState("");
  const [startDate, setStartDate] = useState("");
  const [description, setDescription] = useState("");
  const [participantsLimit, setParticipantsLimit] = useState("100");
  const appContext = useContext(AppContext);
  const fetchData = useFetch();

  const handleInputChange = (e) => {
    switch (e.target.name) {
      case "title":
        setTitle(e.target.value);
        break;
      case "start-date":
        setStartDate(e.target.value);
        break;
      case "description":
        setDescription(e.target.value);
        break;
      case "participants-limit":
        setParticipantsLimit(e.target.value);
        break;
    }
  };

  const handleClearForm = (e) => {
    e.preventDefault();
    setTitle("");
    setStartDate("");
    setDescription("");
    setParticipantsLimit("100");
  };

  const handleAddCircle = async (e) => {
    e.preventDefault();
    try {
      if (title && startDate && description && participantsLimit) {
        const res = await fetchData(
          "/circles/add",
          "PUT",
          {
            host_id: appContext.loggedInUser.id,
            title,
            description,
            participants_limit: participantsLimit,
            start_date: startDate.replace("T", " ") + ":00",
          },
          appContext.accessToken
        );

        if (res.ok) {
          handleClearForm(e);
        } else {
          throw new Error(
            typeof res.msg === "object" ? JSON.stringify(res.msg) : res.msg
          );
        }
      } else {
        throw new Error("incomplete fields");
      }
    } catch (error) {
      console.error(error.message);
    }
  };

  return (
    <div className={styles["host-page"]}>
      <div className={styles["host-header"]}>
        Host a <span>Circle</span>
      </div>
      <form className={styles["host-form"]}>
        <div>
          <label htmlFor="title">
            Title<span className={styles["required"]}>*</span>
          </label>
          <FormInput
            type="text"
            id="title"
            name="title"
            className="short-text"
            onChange={handleInputChange}
            value={title}
            autoFocus
            required
          ></FormInput>
        </div>
        <div>
          <label htmlFor="start-date">
            Scheduled for<span className={styles["required"]}>*</span>
          </label>
          <FormInput
            type="datetime-local"
            id="start-date"
            name="start-date"
            className="short-text"
            onChange={handleInputChange}
            value={startDate}
            required
          ></FormInput>
        </div>
        <div>
          <label htmlFor="description">
            Description<span className={styles["required"]}>*</span>
          </label>
          <textarea
            type="text"
            id="description"
            name="description"
            className={styles["description"]}
            rows="4"
            onChange={handleInputChange}
            value={description}
            required
          ></textarea>
        </div>
        <div>
          <label htmlFor="participants-limit">
            Participants limit<span className={styles["required"]}>*</span>
          </label>
          <FormInput
            type="number"
            id="participants-limit"
            name="participants-limit"
            className="short-text"
            onChange={handleInputChange}
            min="5"
            max="250"
            value={participantsLimit}
            required
          ></FormInput>
        </div>
        <div>
          <Button type="button" className="clear-btn" onClick={handleClearForm}>
            Clear form
          </Button>
          <Button
            type="submit"
            className="submit-btn"
            onClick={handleAddCircle}
          >
            Add Scheduled Circle
          </Button>
        </div>
      </form>
      <div className={styles["host-footer"]}></div>
    </div>
  );
};

export default Host;
