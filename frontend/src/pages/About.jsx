import React from "react";
import styles from "./styles/About.module.css";
import FullLogo from "../assets/logo/logo-full-color.svg";

const About = () => {
  return (
    <div className={styles["about-page"]}>
      <div className={styles["about-header"]}>
        <img
          src={FullLogo}
          alt="full-logo"
          className={styles["full-logo"]}
        ></img>
        <p>
          You speak. <span>The world listens.</span>
        </p>
      </div>
      <div className={styles["about-section"]}>
        <p className={styles["section-header"]}>What are we?</p>
        <p className={styles["section-body"]}>
          Circle of Trust is an audio-based social networking app that operates
          on an invitation-only basis. Users can join virtual rooms where they
          can participate in live discussions, interviews, or panels on various
          topics. Each room typically has moderators who control the
          conversation and can invite participants to speak. Users can explore
          different rooms based on their interests, follow other users, and join
          clubs focused on specific themes. Clubhouse facilitates real-time
          interactions, allowing users to engage in meaningful conversations
          with people from around the world. The app doesn't support text or
          video communication, emphasizing the spontaneity and authenticity of
          voice-based interactions. It offers a unique platform for networking,
          learning, and socializing in an audio-centric environment.
        </p>
      </div>
      <div className={styles["about-section"]}>
        <p className={styles["section-header"]}>How to use?</p>
        <div className={styles["section-body"]}>
          Here is a step-by-step guide to using Circle of Trust:
          <ol>
            <li>
              <b>Explore Circles</b>: Look for a Circle on your Home/Explore
              feed. Tap on it to view the Circle.
            </li>
            <li>
              <b>Join a Circle</b>: Tap on the Circle to enter it. You'll see
              the host's profile picture at the top, followed by the speakers
              currently participating in the Circle.
            </li>
            <li>
              <b>Listen and Participate</b>: Once you're in the Circle, you can
              listen to the conversation happening in real-time. If you want to
              join the discussion, you can tap the "Request" button to ask the
              host to become a speaker.
            </li>
            <li>
              <b>Become a Speaker</b>: If the host approves your request, you'll
              be invited to become a speaker in the Circle. Once you accept, you
              can unmute your microphone and start talking. Remember to adhere
              to the Circle's rules and guidelines set by the host.
            </li>
            <li>
              <b>Leave the Circle</b>: If you need to leave the Circle at any
              time, simply tap the "Leave" button at the bottom of the screen.
            </li>
            <li>
              <b>Create Your Own Circle (optional)</b>: If you're interested in
              hosting your own Circle, you can do so by tapping the "Host" in
              the navigation panel on the left. You can limit the number of
              participants who can sign up for your Circle.
            </li>
            <li>
              <b>Manage Your Circle</b>: As a host, you have the ability to
              manage the participants, mute or remove speakers, and control the
              conversation flow. Make sure to moderate the Circle effectively to
              ensure a safe, positive and engaging experience for everyone.
            </li>
            <li>
              <b>End the Circle</b>: When you're ready to end the Circle, tap
              the "End" button at the bottom of the screen. In the future,
              you'll have the option to save the Circle as a recording, which
              can be shared or listened to later.
            </li>
          </ol>
          That's it! With these steps, you can easily join and participate in
          Circle of Trust, whether you're listening in on conversations or
          hosting your own engaging discussions.
        </div>
      </div>
      <div className={styles["about-footer"]}></div>
    </div>
  );
};

export default About;
