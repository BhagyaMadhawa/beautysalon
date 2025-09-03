import React, { useState } from "react";

const messagesData = [
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
  // Add more contacts as needed
];

const chatMessages = [
  {
    id: 1,
    sender: "Linda michzaosky",
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
];

export default function Messages() {
  const [selectedContact, setSelectedContact] = useState(messagesData[0]);
  const [inputMessage, setInputMessage] = useState("");

  const handleSendMessage = () => {
    if (inputMessage.trim() === "") return;
    // For now, just clear input (no backend)
    setInputMessage("");
  };

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
          {chatMessages.map((msg) => (
            <div
              key={msg.id}
              className={`mb-3 max-w-[70%] p-3 rounded-lg ${
                msg.fromMe ? "bg-puce1-200 self-end" : "bg-gray-200 self-start"
              }`}
            >
              <p className="text-sm">{msg.message}</p>
              <div className="text-xs text-gray-500 text-right mt-1">{msg.time}</div>
            </div>
          ))}
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
