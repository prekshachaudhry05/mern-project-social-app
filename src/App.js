import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Auth from './components/Auth';
import Timeline from './components/Timeline';
import Profile from './components/Profile';
import EditProfile from './components/EditProfile';
import CreatePost from './components/CreatePost';
import FriendRequests from './components/FriendRequests';
import SentRequests from './components/SentRequests';
import OtherProfile from './components/OtherProfile';


const isAuthenticated = () => !!localStorage.getItem('token');

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Route */}
        <Route path="/" element={<Auth />} />
        {/* Protected Routes */}
        <Route
          path="/timeline"
          element={isAuthenticated() ? <Timeline /> : <Navigate to="/" />}
        />
        <Route
          path="/profile"
          element={isAuthenticated() ? <Profile /> : <Navigate to="/" />}
        />
        <Route
          path="/edit-profile"
          element={isAuthenticated() ? <EditProfile /> : <Navigate to="/" />}
        />
        <Route
          path="/create"
          element={isAuthenticated() ? <CreatePost /> : <Navigate to="/" />}
        />
        <Route
          path="/requests"
          element={isAuthenticated() ? <FriendRequests /> : <Navigate to="/" />}
        />
        <Route
          path="/sent-requests"
          element={isAuthenticated() ? <SentRequests /> : <Navigate to="/" />}
        />
        <Route path="/user/:id" element={<OtherProfile />} />
      </Routes>
    </Router>
  );
}

export default App;
