import React, { useEffect, useRef, useState } from "react";
import ReactDOM from "react-dom";
import io from "socket.io-client";
import { v4 as uuidv4 } from "uuid";
import { useTheme } from "./theme/ThemeContext";

function App() {

  const { colors } = useTheme();
  const [message, setMessage] = useState("");
  const [chats, setChats] = useState([]);
  const backendUrl = "http://localhost:5000/message";
  const socketUrl = "http://localhost:5000";
  const chatEndRef = useRef(null);
  const socket = useRef(null);
  const [user, setUser] = useState(null);
  const [companyId, setCompanyId] = useState(null);
  const [validCompany, setValidCompany] = useState(false)
  const [theme, setTheme] = useState(null);
  const [modalIsOpen, setModalIsOpen] = useState(false)
  const scrollContainerRef = useRef(null);
  const [activePage, setActivePage] = useState(0); // 0 for HomePage, 1 for ChatBox

  let companyIdCopy;
  useEffect(() => {
    // Check for companyId in URL
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get("companyId");
    if (!id) {
      console.log("No companyId in URL. Exiting...");
      return; // Exit if companyId is not present
    }
    setCompanyId(id); // Set the companyId if it exists
    companyIdCopy = id;

    const userRef = { current: null };

    // Fetch stored user data
    let storedData = localStorage.getItem("userData");
    let userData = storedData ? JSON.parse(storedData) : {};

    let userId;

    // Check if the userId is already associated with the same companyId
    if (userData[id]) {
      userId = userData[id]; // Use existing userId
    } else {
      userId = uuidv4(); // Generate new userId
      userData[id] = userId; // Associate with companyId
      localStorage.setItem("userData", JSON.stringify(userData)); // Save updated userData
    }

    setUser(userId);
    userRef.current = userId;

    socket.current = io(socketUrl);

    // Listen for messages from the admin
    socket.current.on("receiveMessageToUser", (adminMessage) => {
      console.log(adminMessage.receiver, companyId);
      if (adminMessage.receiver === userRef.current) {
        setChats((prevChats) => [...prevChats, adminMessage]); // Add admin message to chat
      }
      scrollToBottom(); // Scroll to bottom when new message is received
    });

    return () => {
      socket.current.disconnect();
    };
  }, []); // Empty dependency array

  useEffect(() => {
    async function fetchTheme() {
      try {
        let response = await fetch("http://localhost:5000/api/getModalTheme", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ companyId })
        });

        let data = await response.json();
        if (data.result) {
          setTheme(data.result);
        }
        console.log(data.result)
      } catch (error) {
        console.error("Error fetching theme:", error);
      }
    }

    fetchTheme();
  }, [companyId]);




  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chats]);

  const fetchMessages = async () => {
    try {
      const response1 = await fetch("http://localhost:5000/api/getMessageUser", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ user: user, companyId: companyId }),
      });

      const data = await response1.json();
      console.log(data);

      // Check if data is an array
      if (Array.isArray(data.messages)) {
        console.log("Messages fetched:", data);
        setChats((prevChats) => [...prevChats, ...data.messages]); // Set fetched messages directly
      } else {
        console.log("Expected an array but received:", data.messages);
      }
    } catch (err) {
      console.error("Error fetching messages:", err);
    }
  };

  useEffect(() => {

    if (user) {
      fetchMessages();
    }
  }, [user]);

  const handleSend = async () => {
    if (message.trim() === "") return;

    const newChat = {
      sender: user,
      message: message,
      receiver: companyId,
    };
    try {
      const res = await fetch("http://localhost:5000/api/saveMessage", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newChat),
      });

      const data = await res.json();
      if (res.ok) {
        // Handle success if needed
      } else {
        // Handle error if needed
      }
    } catch (error) {
      console.error("Error while sending message:", error);
    }

    socket.current.emit('newUserJoined', { newUser: user, companyId: companyId });

    setChats((prevChats) => [...prevChats, newChat]);
    setMessage("");

    fetch(`${backendUrl}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newChat),
    })
      .then(() => {
        fetch("http://localhost:5000/api/saveEndUser", { // Updated to the correct API
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId: user, companyId: companyId }), // Sending userId and companyId
        })
          .then((response) => response.json())
          .then((data) => {
            if (data.msg) {
              console.log(user);
              console.log(data.msg);
            } else {
              console.log("ID saved successfully:", data);
            }

            socket.current.emit("sendMessageByUser", newChat);
          })
          .catch((err) => console.error("Error calling /saveEndUser API:", err));
      })
      .catch((err) => console.error("Error saving message:", err));
  };

  useEffect(() => {
    const validateCompanyId = async (id) => {
      try {
        const response = await fetch("http://localhost:5000/api/checkValidCompanyId", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ companyId: companyIdCopy }),
        });
        const data = await response.json();
        console.log(companyId)
        console.log(data)
        if (data.success) {
          setValidCompany(true);
        } else {
          setValidCompany(false);
        }
      } catch (error) {
        console.error("Error validating company ID:", error);
        setValidCompany(false);
      }
    };
    validateCompanyId();
  }, [])

  // If companyId is not present, render nothing
  if (!companyId) return null; // Return null to render nothing


  if (validCompany === null) return null; // Loading state while validating
  if (validCompany === false) {
    return <h1 style={{ textAlign: "center", color: "red" }}>Company ID not valid</h1>; // Show error message
  }


  const handleScroll = () => {
    const container = scrollContainerRef.current;
    const scrollLeft = container.scrollLeft;
    const containerWidth = container.offsetWidth;

    const newPage = Math.round(scrollLeft / containerWidth);
    setActivePage(newPage);
  };

  const scrollToPage = (pageIndex) => {
    const container = scrollContainerRef.current;
    const containerWidth = container.offsetWidth;
    container.scrollTo({ left: pageIndex * containerWidth, behavior: "smooth" });
  };

  return ReactDOM.createPortal(
    <>

      <div className="w-full h-[96vh] md:max-w-[380px] mx-auto mt-1 relative">
        <div
          ref={scrollContainerRef}
          onScroll={handleScroll}
          className="w-full h-full flex overflow-x-scroll scroll-smooth snap-x snap-mandatory scrollbar-none rounded-lg"
        >
          {/* HomePage */}
          <div
            style={{
              background: `linear-gradient(to bottom, ${theme?.backgroundColor}, white )`,
            }}
            className="relative flex-none w-full h-full snap-center flex flex-col items-center justify-center p-4"
          >
            <div className="absolute top-0 flex items-center justify-between w-full py-5 px-7">
              <h1 className="text-2xl font-bold text-white">Shambho Ai</h1>
            </div>
            <div className="flex w-full flex-col items-center justify-start h-[35%]">
              <div className="flex w-[90%] items-start flex-col">
                <h1 className="text-xl font-bold">hello</h1>
                <p  >Ready your Chatbot</p>
              </div>
              <div
                style={{ backgroundColor: colors.backgroundSecondary }}
                className="w-[90%] mt-3 rounded-lg p-3 shadow-lg flex items-center justify-between"
              >
                <div>
                  <h2>Send us a message</h2>
                  <p className="text-sm opacity-85">We'll be back online tomorrow</p>
                </div>
                <button
                  style={{
                    backgroundColor: theme?.buttonBackgroundColor || '#4ECDC4',
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    color: theme?.buttonColor || '#fff'
                  }}
                  className="px-5 py-2 font-semibold rounded-xl"
                >
                  ➤
                </button>
              </div>
            </div>
          </div>




          <div className="flex-none snap-center w-full h-full bg-[#f7fafc] mx-auto rounded-xl flex flex-col shadow-lg z-[1000] font-sans justify-center">
            <div className="p-3 bg-white rounded-t-lg flex items-center justify-start" >
              <span className="text-[18px]">Live Chat</span>
            </div>
            <div
              style={{
                background: `linear-gradient(to bottom, ${theme?.backgroundColor}, white )`,
              }}
              className="h-full p-4 bg-gray-100 overflow-y-auto"
            >
              <div className="flex flex-col space-y-4">
                {chats.map((chat, index) => (
                  <div
                    key={index}
                    className={`flex items-start ${chat.sender === user ? "flex-row-reverse" : ""}`}
                  >
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center text-white ${chat.sender === user ? "bg-green-500 ml-2" : "bg-blue-500 mr-2"
                        }`}
                    >
                      <span className="text-sm">
                        {chat.sender === user ? "You" : "Admin"}
                      </span>
                    </div>
                    <div
                      className={`p-2 rounded-lg shadow-md max-w-[80%] ${chat.sender === user
                        ? `bg-[#4ECDC4}] text-white`
                        : "bg-white text-gray-600"
                        }`}
                    >
                      <p className="text-sm">{chat.message}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div
              style={{ backgroundColor: colors.backgroundSecondary }}
              className="px-6 py-3 flex items-center rounded-b-lg gap-2"
            >
              <input
                type="text"
                placeholder="Type message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="sm:w-auto border border-[#4fd1c5] w-full flex-grow px-3 py-2 rounded-lg bg-white text-gray-800 outline-none shadow-sm"
              />
              <button
                style={{
                  backgroundColor: theme?.buttonBackgroundColor || '#4ECDC4',
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  color: theme?.buttonColor || '#fff'
                }}
                onClick={handleSend}
                className="w-fit text-black border border-[#4fd1c5] px-4 py-2 rounded-lg transition duration-300"
              >
                ➤
              </button>
            </div>
          </div>
        </div>
        {/* Dots Navigation */}
        <div className="absolute -bottom-4 w-full flex justify-center gap-2">
          {[0, 1].map((index) => (
            <div
              key={index}
              onClick={() => scrollToPage(index)}
              className={`w-[8px] h-[8px] rounded-full ${activePage === index ? "bg-[#4fd1c5]" : "bg-white"
                } transition duration-300 cursor-pointer`}
            ></div>
          ))}
        </div>
      </div>
    </>,
    document.body
  );

}

export default App;