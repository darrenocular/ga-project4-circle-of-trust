import React, { useState, useContext, useEffect } from "react";
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
  const [tags, setTags] = useState(""); // for future development, use array
  const [allTags, setAllTags] = useState([]);
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
      case "tags":
        setTags(e.target.value);
    }
  };

  const handleClearForm = (e) => {
    e.preventDefault();
    setTitle("");
    setStartDate("");
    setDescription("");
    setParticipantsLimit("100");
    setTags("");
  };

  const handleAddCircle = async () => {
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
          // Create call when new circle is created
          const call = appContext.streamClient.call("audio_room", res.data.id);
          await call.getOrCreate({
            data: {
              members: [
                { user_id: appContext.loggedInUser.username, role: "admin" },
              ],
              custom: {
                title: res.data.title,
                description: res.data.description,
              },
              startsAt: res.data.start_date,
            },
          });
          console.log("call created");
          return res.data.id;
        } else {
          throw new Error(
            typeof res.msg === "object" ? JSON.stringify(res.msg) : res.msg
          );
        }
      } else {
        throw new Error("incomplete fields");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleAddTags = async (circle_id) => {
    try {
      if (tags) {
        const res = await fetchData(
          "/circles/tags",
          "PUT",
          {
            circle_id: circle_id,
            tag: tags,
          },
          appContext.accessToken
        );

        if (!res.ok) {
          throw new Error(
            typeof res.msg === "object" ? JSON.stringify(res.msg) : res.msg
          );
        }
      }
    } catch (error) {
      console.error(error.message);
    }
  };

  const getAllTags = async () => {
    try {
      const res = await fetchData(
        "/circles/tags/all",
        "GET",
        undefined,
        appContext.accessToken
      );

      if (res.ok) {
        setAllTags(res.data);
      } else {
        throw new Error(
          typeof res.msg === "object" ? JSON.stringify(res.msg) : res.msg
        );
      }
    } catch (error) {
      console.error(error.message);
    }
  };

  const handleSubmitForm = async (e) => {
    e.preventDefault();
    const circleId = await handleAddCircle();
    await handleAddTags(circleId);
    handleClearForm(e);
  };

  // Get all tags when page loads
  useEffect(() => {
    getAllTags();
  }, []);

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
            Participants limit (max. 250)
            <span className={styles["required"]}>*</span>
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
          <label htmlFor="tags">Tag(s)</label>
          <select
            id="tags"
            name="tags"
            className={styles["tags-field"]}
            onChange={handleInputChange}
            value={tags}
          >
            <option value="" disabled>
              Select a category
            </option>
            {allTags &&
              allTags.map((tag, idx) => {
                return (
                  <option value={tag} key={idx}>
                    {tag}
                  </option>
                );
              })}
          </select>
        </div>
        <div>
          <Button type="button" className="clear-btn" onClick={handleClearForm}>
            Clear form
          </Button>
          <Button
            type="submit"
            className="submit-btn"
            onClick={handleSubmitForm}
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
