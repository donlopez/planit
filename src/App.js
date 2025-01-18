import { useAuth } from "react-oidc-context"; // Import useAuth
import Navbar from "./Navbar"; // Import Navbar component once
import Planit from "./pages/Planit";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import { Route, Routes } from "react-router-dom";

function App() {
  const auth = useAuth(); // Get the authentication state

  // Handle loading state
  if (auth.isLoading) {
    return <div>Loading...</div>;
  }

  // Handle errors
  if (auth.error) {
    return <div>Encountering error... {auth.error.message}</div>;
  }

  return (
    <>
      <Navbar auth={auth} /> {/* Pass auth to Navbar */}
      <div className="container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/home" element={<Home />} />
          <Route path="/planit" element={<Planit />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </div>
    </>
  );
}

export default App;
