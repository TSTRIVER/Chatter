import React, { useEffect, useState } from "react";
import "./chat.css";
import socketIO from "socket.io-client";
import ReactScrolltoBottom from "react-scroll-to-bottom";
import Message from "../Message/Message";
import { user } from "../Join/Join";
import closeIcon from "../images/closeIcon.png";
import sendLogo from "../images/send.png";

const ENDPOINT = "http://localhost:4400";
let socket;

const Chat = () => {
  const [userId, setUserId] = useState("");
  const [messageArr, setMessageArr] = useState([]);

  const send = () => {
    const message = document.getElementById("chatInput").value;
    socket.emit("message", { message, userId });
    document.getElementById("chatInput").value = "";
  };

  useEffect(() => {
    socket = socketIO(ENDPOINT, { transports: ["websocket"] });

    socket.on("connect", () => {
      alert("Connected");
      setUserId(socket.id);
    });
    socket.emit("joined", { user });

    socket.on("welcome", (data) => {
      setMessageArr([...messageArr, data]);
      console.log(data.user, data.message);
    });

    socket.on("userJoined", (data) => {
      setMessageArr([...messageArr, data]);
      console.log(data.user, data.message);
    });

    socket.on("leave", (data) => {
      setMessageArr([...messageArr, data]);
      console.log(data.user, data.message);
    });

    return () => {
      socket.disconnect();
      socket.off();
    };
  }, []);

  useEffect(() => {
    socket.on("sendMessage", (data) => {
      setMessageArr([...messageArr, data]);
      console.log(data.user, data.message, data.userId);
    });
    return () => {
      socket.off();
    };
  }, [messageArr]);

  return (
    <>
      <div className="chatPage">
        <div className="chatContainer">
          <div className="header">
            <h2>CHATTER</h2>
            <a href="/">
              {" "}
              <img src={closeIcon} alt="Close" />
            </a>
          </div>
          <ReactScrolltoBottom className="chatBox">
            {messageArr.map((item, i) => (
              <Message
                user={item.userId === userId ? "" : item.user}
                message={item.message}
                classs={item.userId === userId ? "right" : "left"}
              />
            ))}
          </ReactScrolltoBottom>
          <div className="inputBox">
            <input
              onKeyPress={(event) => (event.key === "Enter" ? send() : null)}
              type="text"
              id="chatInput"
            />
            <button onClick={send} className="sendBtn">
              <img src={sendLogo} alt="Send" />
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Chat;
