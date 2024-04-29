import React from "react";
import { useParams } from "react-router-dom";

const Profile = () => {
  let { userId } = useParams();

  return <div>Profile {userId}</div>;
};

export default Profile;
