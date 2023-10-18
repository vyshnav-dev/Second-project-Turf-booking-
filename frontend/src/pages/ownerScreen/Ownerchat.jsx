import { useState, useEffect } from 'react';
import '../../css/chat.css';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { toast } from 'react-toastify';
import '../../css/ownerchat.css';
import { io } from 'socket.io-client'; // Import Socket.io

function Ownerchat() {
  const [isChatVisible, setIsChatVisible] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [contacts, setContacts] = useState([]);
  const [clickedContactIndex, setClickedContactIndex] = useState(null);
  const [click, setClick] = useState(false);
  const [socket, setSocket] = useState(null); // Initialize Socket.io
  console.log(click);
  console.log(clickedContactIndex);

  const [userID, setUserID] = useState({
    userId: '',
    roomId: '',
  });

  const { ownerInfo } = useSelector((state) => state.owner);

  const { turfInfo } = useSelector((state) => state.turf);
  console.log('fddss',turfInfo);
  // const turfId = turfInfo && Object.keys(turfInfo).length > 0 ? turfInfo[0]._id : null;
  // const turfId=turfInfo &&turfInfo._id;
  // const turfId=turfInfo[0]._id;
   const turfId=ownerInfo._id;

  const { userInfo } = useSelector((state) => state.auth);
  const tId = turfId;
  const userId = userInfo._id;
  console.log(userId);
  console.log('rywuiw',tId);

  useEffect(() => {
    const newSocket = io('http://localhost:5000'); // Adjust the URL to your backend server
    newSocket.on('connect', () => {
      console.log('Connected to Socket.io');
    });
    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, [setSocket]);

  useEffect(() => {
    if (socket) {
      socket.on('newMessage', (data) => {
        // Update the messages state with the new message
        setMessages((prevMessages) => [...prevMessages, data]);
      });
    }
  }, [socket]);
  

  useEffect(() => {
    console.log('ertt',tId);
    async function getChats() {
      try {
        const { data } = await axios.get('/owner/getChats', {
          params: {
            tId,
          },
        });
        console.log('zaq',data);
        if (data.error) {
          toast.error(data.error);
        } else {
          setContacts(data);
  
          // Store chat contacts in local storage
          localStorage.setItem('ownerChatContacts', JSON.stringify(data));
        }
      } catch (error) {
        console.log(error);
      }
    }
  
    getChats(); // Always load chat contacts on component mount
  
    // Check for chat messages in local storage and populate state
    const storedMessages = JSON.parse(localStorage.getItem('ownerChatMessages'));
    if (storedMessages && storedMessages[userID.roomId]) {
      setMessages(storedMessages[userID.roomId]);
    }
  }, [tId, setContacts, userID]);

//   useEffect(() => {
//     // Load chat messages from localStorage on component mount
//     const storedMessages = JSON.parse(localStorage.getItem('ownerChatMessages')) || {};
//     setMessages(storedMessages[userID.roomId] || []);
//   }, [userID.roomId]);

  const connectedChat = async (roomId, user) => {
    setUserID({
      ...userID,
      userId: user,
      roomId: roomId,
    });

    try {
      const { data } = await axios.get('/owner/getDualChat', {
        params: {
          roomId: roomId,
        },
      });
      if (data.not) {
        setMessages([]);
      } else {
        setMessages(data);

        // Store chat messages in localStorage
        // const storedMessages = JSON.parse(localStorage.getItem('ownerChatMessages')) || {};
        // storedMessages[roomId] = data;
        // localStorage.setItem('ownerChatMessages', JSON.stringify(storedMessages));
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleInputChange = (e) => {
    setInputMessage(e.target.value);
  };

  const handleSendMessage = async () => {
    try {
      const { data } = await axios.post('/owner/sendedTurfMsg', {
        message: inputMessage,
        roomId: userID.roomId,
        userId: userID.userId,
        tId,
        sender: 'turf',
      });
      if (data.error) {
        toast.error(data.error);
      } else if (data.not) {
        setInputMessage('');
      } else {
        // Emit the message to the server
        socket.emit('sendMessage', {
          roomId: userID.roomId,
          userId: userID.userId,
          tId,
          sender: 'turf',
          message: inputMessage,
        });
        
        // Update the messages state with the new message
        // const newMessage = { sender: 'turf', message: data.message };
        // setMessages([...messages, newMessage]);
  
        // Store updated chat messages in localStorage
        // const storedMessages = JSON.parse(localStorage.getItem('ownerChatMessages')) || {};
        // storedMessages[userID.roomId] = [...messages, newMessage];
        // localStorage.setItem('ownerChatMessages', JSON.stringify(storedMessages));
  
        setInputMessage('');
      }
    } catch (error) {
      console.log(error);
    }
  };

  const toggleChat = () => {
    setIsChatVisible(!isChatVisible);
  };

  return (
    <div className="owchat-page-container">
      <div className="owcontact-list">
        {/* Add your contact list content here */}
      </div>
      <div className="owchat-icon-container">
        {isChatVisible ? (
          <div style={{ display: 'flex' }} className="shanku">
            <div className={`owchat-list-container `}>
              {/* Chat list */}
              {contacts ? (
                contacts.map((content, key) => (
                  <div
                    key={key}
                    className={`owchat-item `}
                    onClick={() => {
                      connectedChat(content._id, content.userID);
                      setClickedContactIndex(key);
                      setClick(true);
                    }}
                  >
                    <div style={{display:'flex'}} className="owchat-item-avatar">
                      <i style={{ fontSize: '40px'}} className="fa-solid fa-circle-user"></i><h4>{content.username}</h4>
                      {/* <div style={{width:'60px'}}>{content.username}</div> */}
                    </div>
                  </div>
                ))
              ) : (
                <></>
              )}
            </div>
            <div className="owwhatsapp-chat-container">
              <div className="owchat-header">
                {/* <div className="owcontact-info">
                  <i style={{ fontSize: '40px' }} className="fa-solid fa-circle-user"></i>
                  <div className="owcontact-name">
                    chat
                    <div style={{ fontSize: '10px' }}>Online</div>
                  </div>
                </div> */}
                <div className="owcontact-info">
                <i style={{ fontSize: '40px' }} className="fa-solid fa-circle-user"></i>
                <div className="owcontact-name">
                  {contacts && clickedContactIndex !== null ? (
                    <>{contacts[clickedContactIndex].username}</>
                  ) : (
                    <>Chat</>
                  )}
                  <div style={{ fontSize: '10px' }}></div>
                </div>
              </div>
                <div
                  onClick={toggleChat}
                  style={{ backgroundColor: '#a262da', borderColor: '#a262da' }}
                >
                  <i style={{ fontSize: '30px', backgroundColor: '#a262da' }} className="fa-solid fa-arrow-right-from-bracket"></i>
                </div>
              </div>
              <div className="owchat-messages">
                {messages ? (
                  messages.map((msg, index) => (
                    <div
                      key={index}
                      className={`owmessage ${msg.sender === 'turf' ? 'turf' : 'user'}`}
                    >
                      {msg.message}
                    </div>
                  ))
                ) : (
                  <></>
                )}
              </div>
              <div className="owchat-input">
                <input
                  type="text"
                  placeholder="Type a message"
                  value={inputMessage}
                  onChange={handleInputChange}
                />
                <button onClick={handleSendMessage}>Send</button>
              </div>
            </div>
          </div>
        ) : (
          <div className="owchat-icon" onClick={toggleChat}>
            <i style={{ color: 'white' }} className="fa-regular fa-comment-dots"></i>
          </div>
        )}
      </div>
    </div>
  );
}

export default Ownerchat;
