import { useAuth } from "react-oidc-context"; 
import Navbar from "./Navbar"; // Navigation bar component
import Home from "./pages/Home"; // Home page for guests
import Planit from "./pages/Planit"; // Page to create events
import Profile from "./pages/Profile"; // User profile page
import { Route, Routes, Navigate } from "react-router-dom"; // For routing

function App() {
  const auth = useAuth(); // Authentication hook

  // Handle loading state
  if (auth.isLoading) {
    return <div>Loading...</div>;
  }

  // Handle error state
  if (auth.error) {
    return <div>Error: {auth.error.message}</div>;
  }

  return (
    <>
      {/* Navigation bar */}
      <Navbar auth={auth} />
      <div className="container">
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Home />} />
          <Route path="/home" element={<Home />} />

          {/* Protected routes (requires authentication) */}
          <Route
            path="/planit"
            element={auth.isAuthenticated ? <Planit /> : <Navigate to="/" />}
          />
          <Route
            path="/profile"
            element={auth.isAuthenticated ? <Profile /> : <Navigate to="/" />}
          />
        </Routes>
      </div>
    </>
  );
}

export default App;
