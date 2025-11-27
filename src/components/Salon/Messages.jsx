import React, { useState, useEffect } from "react";
import { useAuth } from '../../contexts/AuthContext';

const getInitialData = (userRole) => {
  let initialMessagesData = [];
  let initialChatMessages = {};

  if (userRole === 'client') {
    initialMessagesData = [
      {
        id: 1,
        sender: "Salon Owner",
        avatar: "https://randomuser.me/api/portraits/men/1.jpg",
        lastMessage: "Welcome! How can we help you?",
        time: "8:45 PM",
        unread: true,
      },
      {
        id: 2,
        sender: "Beauty Professional",
        avatar: "https://randomuser.me/api/portraits/women/2.jpg",
        lastMessage: "Your appointment is confirmed.",
        time: "9:00 PM",
        unread: false,
      },
    ];
    initialChatMessages = {
      1: [
        {
          id: 1,
          sender: "Salon Owner",
          message: "Welcome! How can we help you?",
          time: "8:45 PM",
          fromMe: false,
        },
        {
          id: 2,
          sender: "Me",
          message: "I'd like to book an appointment.",
          time: "8:46 PM",
          fromMe: true,
        },
      ],
      2: [
        {
          id: 1,
          sender: "Beauty Professional",
          message: "Your appointment is confirmed.",
          time: "9:00 PM",
          fromMe: false,
        },
      ],
    };
  } else if (userRole === 'professional') {
    initialMessagesData = [
      {
        id: 1,
        sender: "Client",
        avatar: "https://randomuser.me/api/portraits/women/3.jpg",
        lastMessage: "Thank you for the service!",
        time: "7:30 PM",
        unread: false,
      },
    ];
    initialChatMessages = {
      1: [
        {
          id: 1,
          sender: "Client",
          message: "Thank you for the service!",
          time: "7:30 PM",
          fromMe: false,
        },
        {
          id: 2,
          sender: "Me",
          message: "You're welcome! See you next time.",
          time: "7:31 PM",
          fromMe: true,
        },
      ],
    };
  } else if (userRole === 'owner') {
    initialMessagesData = [
      {
        id: 1,
        sender: "Client",
        avatar: "https://randomuser.me/api/portraits/men/4.jpg",
        lastMessage: "Great experience!",
        time: "6:00 PM",
        unread: true,
      },
      {
        id: 2,
        sender: "Beauty Professional",
        avatar: "https://randomuser.me/api/portraits/women/5.jpg",
        lastMessage: "Schedule updated.",
        time: "5:45 PM",
        unread: false,
      },
    ];
    initialChatMessages = {
      1: [
        {
          id: 1,
          sender: "Client",
          message: "Great experience!",
          time: "6:00 PM",
          fromMe: false,
        },
      ],
      2: [
        {
          id: 1,
          sender: "Beauty Professional",
          message: "Schedule updated.",
          time: "5:45 PM",
          fromMe: false,
        },
        {
          id: 2,
          sender: "Me",
          message: "Thanks for the update.",
          time: "5:46 PM",
          fromMe: true,
        },
      ],
    };
  } else if (userRole === 'admin') {
    initialMessagesData = [
      {
        id: 1,
        sender: "Salon Owner",
        avatar: "https://randomuser.me/api/portraits/men/6.jpg",
        lastMessage: "Account approval needed.",
        time: "4:00 PM",
        unread: true,
      },
      {
        id: 2,
        sender: "Client",
        avatar: "https://randomuser.me/api/portraits/women/7.jpg",
        lastMessage: "Issue with booking.",
        time: "3:30 PM",
        unread: false,
      },
    ];
    initialChatMessages = {
      1: [
        {
          id: 1,
          sender: "Salon Owner",
          message: "Account approval needed.",
          time: "4:00 PM",
          fromMe: false,
        },
        {
          id: 2,
          sender: "Me",
          message: "Approval processed.",
          time: "4:01 PM",
          fromMe: true,
        },
      ],
      2: [
        {
          id: 1,
          sender: "Client",
          message: "Issue with booking.",
          time: "3:30 PM",
          fromMe: false,
        },
      ],
    };
  } else {
    // Default or unknown role
    initialMessagesData = [
      {
        id: 1,
        sender: "Guy Hawkins",
        avatar: "https://randomuser.me/api/portraits/men/1.jpg",
        lastMessage: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
        time: "8:45 PM",
        unread: true,
      },
      {
        id: 2,
        sender: "Darlene Robertson",
        avatar: "https://randomuser.me/api/portraits/women/2.jpg",
        lastMessage: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
        time: "8:45 PM",
        unread: false,
      },
    ];
    initialChatMessages = {
      1: [
        {
          id: 1,
          sender: "Guy Hawkins",
          message: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vitae ultricies neque",
          time: "8:45 PM",
          fromMe: false,
        },
        {
          id: 2,
          sender: "Me",
          message: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vitae ultricies neque",
          time: "8:45 PM",
          fromMe: true,
        },
      ],
      2: [
        {
          id: 1,
          sender: "Darlene Robertson",
          message: "Hello! How are you?",
          time: "9:00 PM",
          fromMe: false,
        },
      ],
    };
  }

  return { initialMessagesData, initialChatMessages };
};

export default function Messages() {
  const { user } = useAuth();
  const [userRole, setUserRole] = useState(null);
  const [messagesData, setMessagesData] = useState([]);
  const [selectedContact, setSelectedContact] = useState(null);
  const [inputMessage, setInputMessage] = useState("");
  const [chatMessages, setChatMessages] = useState({});
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    const fetchUserRole = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('https://beautysalon-qq6r.vercel.app/api/auth/me', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (response.ok) {
          const data = await response.json();
          setUserRole(data.user.role);
        }
      } catch (error) {
        console.error('Error fetching user role:', error);
      }
    };

    if (user?.id) {
      fetchUserRole();
    }
  }, [user?.id]);

  useEffect(() => {
    if (userRole) {
      const { initialMessagesData, initialChatMessages } = getInitialData(userRole);
      setMessagesData(initialMessagesData);
      setChatMessages(initialChatMessages);
      setSelectedContact(initialMessagesData[0]);
    }
  }, [userRole]);

  const handleSendMessage = () => {
    if (inputMessage.trim() === "") return;
    const newMessage = {
      id: Date.now(), // Simple ID for demo
      sender: "Me",
      message: inputMessage.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      fromMe: true,
    };
    setChatMessages(prev => ({
      ...prev,
      [selectedContact.id]: [...(prev[selectedContact.id] || []), newMessage]
    }));
    setInputMessage("");
    // Update lastMessage in contacts (for demo)
    setMessagesData(prev => prev.map(contact =>
      contact.id === selectedContact.id
        ? { ...contact, lastMessage: inputMessage.trim(), time: newMessage.time }
        : contact
    ));
  };

  const handleDeleteMessage = (messageId) => {
    setChatMessages(prev => ({
      ...prev,
      [selectedContact.id]: (prev[selectedContact.id] || []).filter(msg => msg.id !== messageId)
    }));
  };

  const handleInputChange = (e) => {
    setInputMessage(e.target.value);
    setIsTyping(e.target.value.length > 0);
  };

  // Clear typing indicator after 2 seconds of no input
  useEffect(() => {
    if (isTyping) {
      const timer = setTimeout(() => setIsTyping(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [isTyping]);

  const currentMessages = selectedContact ? chatMessages[selectedContact.id] || [] : [];

  if (!selectedContact) {
    return (
      <div className="flex bg-white rounded-xl shadow p-4 h-[600px] max-w-full items-center justify-center">
        <p className="text-gray-500">Loading messages...</p>
      </div>
    );
  }

  return (
    <div className="flex bg-white rounded-xl shadow p-4 h-[600px] max-w-full">
      {/* Left panel: contacts */}
      <div className="w-1/3 border-r border-gray-200 pr-4 overflow-y-auto">
        <div className="mb-4">
          <input
            type="text"
            placeholder="Search"
            className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-puce"
          />
        </div>
        <div>
          {messagesData.map((contact) => (
            <div
              key={contact.id}
              className={`flex items-center gap-3 p-2 rounded cursor-pointer ${
                selectedContact.id === contact.id ? "bg-puce1-200" : ""
              }`}
              onClick={() => setSelectedContact(contact)}
            >
              <img
                src={contact.avatar}
                alt={contact.sender}
                className="w-10 h-10 rounded-full object-cover"
              />
              <div className="flex-1">
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-gray-900">{contact.sender}</span>
                  <span className="text-xs text-gray-500">{contact.time}</span>
                </div>
                <p
                  className={`text-xs truncate ${
                    contact.unread ? "font-semibold text-puce" : "text-gray-500"
                  }`}
                >
                  {contact.lastMessage}
                </p>
              </div>
              {contact.unread && (
                <div className="bg-puce text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  2
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Right panel: chat */}
      <div className="flex-1 flex flex-col pl-4">
        <div className="flex items-center gap-3 border-b border-gray-200 pb-3 mb-3">
          <img
            src={selectedContact.avatar}
            alt={selectedContact.sender}
            className="w-12 h-12 rounded-full object-cover"
          />
          <div>
            <h2 className="font-semibold text-lg">{selectedContact.sender}</h2>
            <p className="text-xs text-green-500">Online</p>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto mb-4">
          {currentMessages.map((msg) => (
            <div
              key={msg.id}
              className={`mb-3 max-w-[70%] p-3 rounded-lg relative ${
                msg.fromMe ? "bg-puce1-200 self-end ml-auto" : "bg-gray-200 self-start"
              }`}
            >
              <p className="text-sm">{msg.message}</p>
              <div className="text-xs text-gray-500 text-right mt-1">{msg.time}</div>
              {msg.fromMe && (
                <button
                  onClick={() => handleDeleteMessage(msg.id)}
                  className="absolute top-1 right-1 text-red-500 hover:text-red-700 text-xs"
                  title="Delete message"
                >
                  ✕
                </button>
              )}
            </div>
          ))}
          {isTyping && (
            <div className="mb-3 max-w-[70%] p-3 rounded-lg bg-gray-200 self-start">
              <p className="text-sm italic text-gray-500">Typing...</p>
            </div>
          )}
        </div>
        <div className="flex items-center gap-2">
          <textarea
            rows={2}
            className="flex-1 border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-puce resize-none"
            placeholder="Type here something..."
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
          />
          <button
            onClick={handleSendMessage}
            className="bg-puce text-white px-4 py-2 rounded hover:bg-puce1-600 transition"
          >
            Send Message
          </button>
        </div>
      </div>
    </div>
  );
}
