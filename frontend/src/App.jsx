// import { useState } from 'react'
import {
  // StreamTheme,
  // SpeakerControls,
  StreamCall,
  StreamVideo,
  StreamVideoClient,
  OwnCapability,
} from "@stream-io/video-react-sdk";
import "@stream-io/video-react-sdk/dist/css/styles.css";
import { MyUILayout } from "./components/MyUILayout";

// initialize credentials
const apiKey = import.meta.env.VITE_STREAM_API_KEY;
const token =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiR2VuZXJhbF9WZWVycyIsImlzcyI6Imh0dHBzOi8vcHJvbnRvLmdldHN0cmVhbS5pbyIsInN1YiI6InVzZXIvR2VuZXJhbF9WZWVycyIsImlhdCI6MTcxMzQxNzQ0MywiZXhwIjoxNzE0MDIyMjQ4fQ.qzCXPMavbnpKFA2nEUxn7S_7X9Mlk-TSPY-HFpftows"; // the token can be found in the "Credentials" section
const userId = "General_Veers"; // the user_id can be found in the "Credentials" section
const callId = "3utwyG56Cddm"; // the call_id can be found in the "Credentials" section

// initialize the user object
const user = {
  id: userId,
  name: "Oliver",
  image: "https://getstream.io/random_svg/?id=oliver&name=Oliver",
};

const client = new StreamVideoClient({ apiKey, user, token });
const call = client.call("audio_room", callId);

await call.join({
  create: true,
  data: {
    members: [{ user_id: "john_smith" }, { user_id: "jane_doe" }],
    custom: {
      title: "Nobody likes React",
      description: "Talking about how much we hate React",
    },
  },
});

// requesting for permission to speak
await call.requestPermissions({
  permissions: [OwnCapability.SEND_AUDIO],
});

function App() {
  return (
    <StreamVideo client={client}>
      <StreamCall call={call}>
        <MyUILayout />
        {/* <StreamTheme>
          <CallControls />
        </StreamTheme> */}
      </StreamCall>
    </StreamVideo>
  );
}

export default App;
