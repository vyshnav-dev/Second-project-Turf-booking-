import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { toast } from "react-toastify";
import { io } from "socket.io-client";
import "../../css/chat.css";

function Chatapp() {
  const [isChatVisible, setIsChatVisible] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [socket, setSocket] = useState(null);

  // const { turfInfo } = useSelector((state) => state.turf);
  const { userInfo } = useSelector((state) => state.auth);

  const { ownerInfo } = useSelector((state) => state.owner);
  console.log("mumumuj", ownerInfo._id);

  const tId = ownerInfo?._id;
  const userId = userInfo._id;
  const name = userInfo.name;

  useEffect(() => {
    const newSocket = io("https://spexcart.online");
    newSocket.on("connect", () => {
      console.log("Connected to Socket.io");
    });
    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, []);

  useEffect(() => {
    if (socket) {
      socket.on("newMessage", (data) => {
        console.log("Received new message:", data);
        setMessages((prevMessages) => [...prevMessages, data]);
      });
    }
  }, [socket]);

  useEffect(() => {
    async function getChats() {
      try {
        const { data } = await axios.get("/users/getChats", {
          params: {
            tId,
            userId,
          },
        });
        console.log("dsdv", data);
        if (data.not) {
          setInputMessage("");
        } else {
          // Ensure that data.messages is an array
          if (Array.isArray(data)) {
            setMessages(data);

            localStorage.setItem(
              "userChatMessages",
              JSON.stringify(data.messages)
            );
          } else {
            console.error(
              "Received data.messages is not an array:",
              data.messages
            );
          }
        }
      } catch (error) {
        console.log(error);
      }
    }

    if (isChatVisible) {
      getChats().then(() => {
        setInputMessage("");
      });
    }
  }, [isChatVisible, tId, userId]);

  const handleInputChange = (e) => {
    setInputMessage(e.target.value);
  };

  const handleSubmit = async () => {
    if (!socket) {
      toast.error("Chat server not available");
      return;
    }

    try {
      const { data } = await axios.post("/users/sendedMsg", {
        message: inputMessage,
        userId,
        tId,
        sender: "user",
        name,
      });

      if (data.error) {
        toast.error(data.error);
      } else if (data.not) {
        setInputMessage("");
      } else {
        socket.emit("sendMessage", {
          roomId: data.roomID,
          userId,
          name,
          tId,
          sender: "user",
          message: inputMessage,
        });

        setInputMessage("");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const toggleChat = () => {
    setIsChatVisible(!isChatVisible);
  };

  return (
    <>
      <div style={{ borderRadius: "10px" }}>
        <div className="chat-icon-container">
          {isChatVisible ? (
            <div className="whatsapp-chat-container">
              <div className="chat-header">
                <div className="contact-info">
                  <i
                    style={{ fontSize: "40px" }}
                    className="fa-solid fa-circle-user"
                  ></i>
                  <div className="contact-name">
                    Chat
                    <div style={{ fontSize: "10px" }}></div>
                  </div>
                </div>
                <div
                  onClick={toggleChat}
                  style={{ backgroundColor: "#4e8270" }}
                >
                  <i
                    style={{ fontSize: "30px", backgroundColor: "#4e8270" }}
                    className="fa-solid fa-arrow-right-from-bracket"
                  ></i>
                </div>
              </div>
              <div className="chat-messages">
                {Array.isArray(messages) ? (
                  messages.map((msg, index) => (
                    <div
                      key={index}
                      className={`message ${
                        msg.sender === "user" ? "user" : "turf"
                      }`}
                    >
                      {msg.message}
                    </div>
                  ))
                ) : (
                  <></>
                )}
              </div>
              <div className="chat-input">
                <input
                  type="text"
                  placeholder="Type a message"
                  value={inputMessage}
                  onChange={handleInputChange}
                />
                <button onClick={handleSubmit}>Send</button>
              </div>
            </div>
          ) : (
            <div className="chat-icon" onClick={toggleChat}>
              <i
                style={{ color: "white", fontSize: "40px" }}
                className="fa-regular fa-comment-dots"
              ></i>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default Chatapp;
