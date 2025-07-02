"use client";
import { useEffect, useState } from "react";
import "./discover.css";

import { useRouter } from 'next/navigation';

const friendsData = [
  {
    username: "Random User",
    gender: "m/f",
    lastMessageTime: "a few seconds",
  },
  {
    username: "Alice",
    gender: "f",
    lastMessageTime: "1 min",
  },
];

const getColorFromUsername = (username) => {
  const colors = ["#06b6d4", "#6366f1", "#10b981", "#f59e0b", "#f43f5e"];
  let sum = 0;
  for (let i = 0; i < username.length; i++) sum += username.charCodeAt(i);
  return colors[sum % colors.length];
};

export default function DiscoverPage() {
  const router = useRouter();
  return (
    <div className="main-container">
      <div className="top-header">
        <div className="profile-info">
          <div className="profile-avatar">👤</div>
          <div>
            <div className="profile-username">idkjakdkja</div>
            <div className="profile-status">...</div>
          </div>
        </div>
        <input type="text" className="search-input" placeholder="Search chats..." />
        {/* <div className="tabs">
          <span className="tab active">ALL</span>
          <span className="tab">PEOPLE</span>
          <span className="tab">ROOMS</span>
          <span className="tab">UNREAD</span>
        </div> */}
        {/* <div className="empty-state">Messages you receive will show up here.</div> */}
      </div>

      <div className="chat-section">
        {/* Anonymous Chat */}
        <div className="chat-item">
          <div
            className="avatar"
            style={{ backgroundColor: getColorFromUsername("Random User") }}
          >
            R
          </div>
          <div className="chat-info" onClick={()=>{
            router.push('/chat');
          }}>
            <div className="chat-top">
              <span className="username">Random User</span>
              <span className="time">a few seconds</span>
            </div>
            <div className="chat-sub">m/f</div>
          </div>
          <span className="unread-dot">1</span>
        </div>

        <div className="divider">Friends</div>

        {/* Friends List */}
        {friendsData.map((friend, idx) => (
          <div className="chat-item" key={idx}>
            <div
              className="avatar"
              style={{ backgroundColor: getColorFromUsername(friend.username) }}
            >
              {friend.username.slice(0, 2).toUpperCase()}
            </div>
            <div className="chat-info">
              <div className="chat-top">
                <span className="username">{friend.username}</span>
                <span className="time">{friend.lastMessageTime}</span>
              </div>
              <div className="chat-sub">{friend.gender}</div>
            </div>
             <span className="unread-dot">1</span>
          </div>
        ))}
      </div>
    </div>
  );
}
