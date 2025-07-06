import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Auth from './components/Auth';
import Register from './components/Register';
import Timeline from './components/Timeline';
import Profile from './components/Profile';
import EditProfile from './components/EditProfile';
import CreatePost from './components/CreatePost';
import FriendRequests from './components/FriendRequests';
import SentRequests from './components/SentRequests';
import MyFriends from './components/MyFriends';
import OtherProfile from './components/OtherProfile';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Auth />} />
        <Route path="/register" element={<Register />} />
        <Route path="/timeline" element={<Timeline />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/edit-profile" element={<EditProfile />} />
        <Route path="/create-post" element={<CreatePost />} />
        <Route path="/friend-requests" element={<FriendRequests />} />
        <Route path="/sent-requests" element={<SentRequests />} />
        <Route path="/MyFriends" element={<MyFriends />} />
        <Route path="/profile/:userId" element={<OtherProfile />} />
      </Routes>
    </Router>
  );
}

export default App;
