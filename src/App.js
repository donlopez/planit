import { useAuth } from "react-oidc-context";
import Navbar from "./Navbar";
import Home from "./pages/Home";
import Planit from "./pages/Planit";
import Profile from "./pages/Profile";
import Dashboard from "./pages/Dashboard"; // Add Dashboard import
import EditEvent from "./pages/EditEvent"; // Add EditEvent import
import { Route, Routes, Navigate } from "react-router-dom";

function App() {
  const auth = useAuth();

  if (auth.isLoading) {
    return <div>Loading...</div>;
  }

  if (auth.error) {
    return <div>Error: {auth.error.message}</div>;
  }

  return (
    <>
      <Navbar auth={auth} />
      <div className="container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/home" element={<Home />} />
          <Route path="/planit" element={auth.isAuthenticated ? <Planit /> : <Navigate to="/" />} />
          <Route path="/profile" element={auth.isAuthenticated ? <Profile /> : <Navigate to="/" />} />
          <Route path="/dashboard" element={auth.isAuthenticated ? <Dashboard /> : <Navigate to="/" />} />
          <Route path="/edit-event/:eventId" element={auth.isAuthenticated ? <EditEvent /> : <Navigate to="/" />} />
        </Routes>
      </div>
    </>
  );
}

export default App;
