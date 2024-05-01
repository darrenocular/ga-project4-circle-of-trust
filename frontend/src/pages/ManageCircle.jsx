import React, { useState, useContext, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import useFetch from "../hooks/useFetch";
import styles from "./styles/ManageCircle.module.css";
import FormInput from "../components/utils/FormInput";
import Button from "../components/utils/Button";
import AppContext from "../context/AppContext";

const ManageCircle = () => {
  const appContext = useContext(AppContext);
  const fetchData = useFetch();
  const navigate = useNavigate();
  const location = useLocation();
  const { circle, existingTags } = location.state;
  const [title, setTitle] = useState(circle.title);
  const [startDate, setStartDate] = useState(formatDate(circle.start_date));
  const [description, setDescription] = useState(circle.description);
  const [participantsLimit, setParticipantsLimit] = useState(
    circle.participants_limit
  );
  const [tags, setTags] = useState(
    existingTags.length > 0 ? existingTags[0] : ""
  ); // for future development, use array
  const [allTags, setAllTags] = useState([]);

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

  const handleDeleteCircle = async (e) => {
    e.preventDefault();
    try {
      const res = await fetchData(
        "/circles/delete",
        "DELETE",
        {
          circle_id: circle.id,
        },
        appContext.accessToken
      );

      if (res.ok) {
        navigate(`/profile/${appContext.loggedInUser.id}`);
      } else {
        throw new Error(
          typeof res.msg === "object" ? JSON.stringify(res.msg) : res.msg
        );
      }
    } catch (error) {
      console.error(error.message);
    }
  };

  const handleUpdateCircle = async () => {
    try {
      if (title && startDate && description && participantsLimit) {
        const res = await fetchData(
          "/circles/edit",
          "PATCH",
          {
            circle_id: circle.id,
            title,
            description,
            participants_limit: participantsLimit,
            start_date: startDate.replace("T", " ") + ":00",
          },
          appContext.accessToken
        );

        if (!res.ok) {
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

  const handleUpdateTags = async () => {
    try {
      if (tags !== existingTags[0]) {
        const res1 = await fetchData(
          "/circles/tags",
          "DELETE",
          {
            circle_id: circle.id,
            tag: existingTags[0],
          },
          appContext.accessToken
        );

        if (!res1.ok) {
          throw new Error(
            typeof res1.msg === "object" ? JSON.stringify(res1.msg) : res1.msg
          );
        }

        const res2 = await fetchData(
          "/circles/tags",
          "PUT",
          {
            circle_id: circle.id,
            tag: tags,
          },
          appContext.accessToken
        );

        if (!res2.ok) {
          throw new Error(
            typeof res2.msg === "object" ? JSON.stringify(res2.msg) : res2.msg
          );
        }
      }
    } catch (error) {
      console.error(error.message);
    }
  };

  function formatDate(inputDate) {
    const date = new Date(inputDate);

    // Extract date components
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");

    // Construct formatted date string
    const formattedDate = `${year}-${month}-${day}T${hours}:${minutes}`;

    return formattedDate;
  }

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
    await handleUpdateCircle();
    await handleUpdateTags();
    navigate(`/circle/${circle.id}`);
  };

  // Get all tags when page loads
  useEffect(() => {
    getAllTags();
  }, []);

  return (
    <div className={styles["manage-page"]}>
      <div>
        <Button type="button" className="back-btn" onClick={() => navigate(-1)}>
          <i className="arrow-left"></i> Back
        </Button>
      </div>
      <div className={styles["manage-header"]}>
        Manage <span>Circle</span>
      </div>
      <form className={styles["manage-form"]}>
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
        <div className={styles["btn-container"]}>
          <Button
            type="button"
            className="manage-dlt-btn"
            onClick={handleDeleteCircle}
          >
            Delete
          </Button>
          <Button
            type="submit"
            className="submit-btn"
            onClick={handleSubmitForm}
          >
            Update Circle
          </Button>
        </div>
      </form>
      <div className={styles["manage-footer"]}></div>
    </div>
  );
};

export default ManageCircle;
