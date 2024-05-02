# Project 4 - Circle of Trust

## Introduction

Circle of Trust is an audio-based social networking app, modelled after Clubhouse and Twitter Spaces. Users can host and/or join virtual audio rooms (known as "Circles") where they can participate in live discussions, interviews, panels or even book circles on various topics.

Users can explore different Circles based on their interests, follow other users, shortlist interested Circles and join Circles focused on specific themes. Hosts have a plethora of controls in a live Circle that allow them to grant permissions to speak, moderate a discussion and end/archive a Circle.

Circle of Trust facilitates real-time interactions, allowing users to engage in meaningful conversations with people from around the world. The app doesn't support text or video communication, emphasizing the spontaneity and authenticity of voice-based interactions. It offers a unique platform for networking, learning, and socializing in an audio-centric environment.

## Technology

- React (JavaScript)
- NodeJS
- Flask (Python)
- PostgreSQL (psycopg)

## Getting Started

The live audio streaming feature in this app is powered by Stream ([getstream.io](https://getstream.io/)). More on this below.

### Overview

Upon log in, users will be directed to the "Home" page, which, by default, features Circles hosted by other users that they follow, sorted by start date/time. Users can toggle between the "Following" and "Interested" filters, to alternatively show Circles that they are interested in.

The "Explore" page is divided into 3 main sections. First, the carousel features the 5 most popular (adjudged by "interest" levels) upcoming Circles. Second, the "Live" section lists out all Circles that are currently "live" that users can join. And third, the "Upcoming" section displays all Circles that are upcoming, sorted in accordance with the scheduled start date/time.

To create a new scheduled Circle, users can navigate to the "Host" page, which will display a controlled form for users to key in details about the new Circle.

The "About" page provides further information about the app and a step-by-step guide on how users can enjoy the app.

### User Profile

All users of the app will have a "Profile" page, which will display key information about the user, including the number of Circles hosted, number of users followed and number of users following. A user's profile will also display upcoming Circles to be hosted by the user and the user's archived Circles.

Users can follow/unfollow one another, which affects the Circles listed under the "Following" filter on the "Home" page (see above).

### Circle

When a user clicks into a Circle, further details about the Circle will be displayed and this is where the fun begins!

The Circle view will reflect different information depending on the user viewing the page (i.e., is the user a host of the Circle?) and the status of the Circle (i.e., is the Circle upcoming, live or archived?).

- A user looking at Circles hosted by others will, if the Circle is not live yet, be able to indicate their interest in the Circle, which affects the Circles listed under the "Interested" filter on the "Home" page (see above).
- However, if the Circle goes live, the user can join the Circle by clicking on the "Join" button, which takes the user into the audio room as a "listener".

Conversely, a host of the Circle will have a different view when navigating to the Circle page.

- If the Circle is not live yet, the host has the ability to "Manage" the Circle.
- Alternatively, at the scheduled start date/time, the host can click on the "Go Live" button to start the Circle session.
- When a Circle is live, not only does the status bar at the top left corner of the page change, but the audio room panel will also display all the "Speakers" and "Listeners" of the Circle. A host, by default, has the ability to unmute themselves to participate as a "Speaker".

The host can then close the session by clicking on the "Live Now" button or "End Call" button. The difference lies in the fact that the former allows the host to "re-open" the Circle again for future sessions, while the latter permanently archives the Circle (i.e., it cannot be re-opened).

### Permissions Request

During a live Circle, "Listeners" can request for permission to speak. These requests will be channeled to the host for approval. If the host grants a user the permission to speak, that user can also unmute themselves to participate as a "Speaker".

Special mention to the folks at [Stream](getstream.io), who were on hand to respond to all queries I had regarding integration of its audio-room API service with Circle of Trust. Not to mention their comprehensive and easy-to-follow documentation, which greatly assisted this project. Thanks Stream!

### Report Circle

When users come across content that is perceived to be improper, insensitive and/or in violation of expected code of conduct, they can report the Circle by clicking on the flag at the top right hand corner of a Circle page.

This will alert the system administrator, who has access to the "Manage Flags" page, which displays all the Circles that have been flagged for review, sorted by the number of flags that a Circle has received (in descending order).

The system administrator can then mark a Circle as "safe", which will delete all flags for that particular Circle, or "delete" a Circle if it is deemed to be inappropriate or unsafe to be retained on the app.

## Future Enhancements

- Allow users to search for Circles based on specific search terms or specified categories
- Allow Circle hosts to create multiple tags for Circles that cut across various categories
- Allow Circle hosts to kick participants who violate platform code of conduct and/or report to system administrator
- Allow Circle hosts to record a Circle session and share it on Spotify immediately after the end of the session
- Allow Circle hosts to start a Reddit-like discussion thread after the session ends, where participants can continue with overflow discussions
- Allow Circle hosts to restrict and approve registrations for a scheduled Circle session so that only approved users can join
- For registration, require password confirmation and check password strength for security reasons

## References

- Flask template (https://github.com/cookiecutter-flask/cookiecutter-flask/tree/master)
- python-dotenv (https://github.com/theskumar/python-dotenv?tab=readme-ov-file#getting-started)
- Flask-Marshmallow (https://flask-marshmallow.readthedocs.io/en/latest/)
- Flask-JWT (https://flask-jwt-extended.readthedocs.io/en/stable/)
- Flask-SQLAlchemy (https://flask-sqlalchemy.palletsprojects.com/en/3.1.x/)
- psycopg (https://www.psycopg.org/psycopg3/docs/basic/install.html)
- Setting up composite primary keys: https://weblogs.sqlteam.com/jeffs/2007/08/23/composite_primary_keys/
- getstream.io documentation: https://getstream.io/video/docs/react/
- Audio rooms tutorial: https://getstream.io/video/sdk/react/tutorial/audio-room/
- Creation of tokens server-side or client-side (getstream.io): https://support.getstream.io/hc/en-us/articles/360054926754-Token-Creation-Client-Side-vs-Server-Side-Chat
- Client, server, API connection (getstream.io): https://support.getstream.io/hc/en-us/articles/360061669873-How-do-the-Chat-Client-Server-Stream-API-communicate-with-each-other
- Public board (GitHub Pages): https://github.com/users/darrenocular/projects/3/views/1

## Environment Variables

- .env (back-end):

  ```
  PORT=5000
  JWT_SECRET_KEY=<JWT secret>
  ```

- .env (front-end):
  ```
  VITE_SERVER=http://127.0.0.1:5001
  VITE_STREAM_API_KEY=mmhfdzb5evj2
  ```
