import { useAuth } from "react-oidc-context";
import '../styles.css';
import planitHeaderImage from '../assets/planitheader.jpg'; // Import the image

export default function Home() {
  const auth = useAuth();

  if (auth.isAuthenticated) {
    const userName = auth.user?.profile?.email || "User";
    return <h1>Welcome, {userName}!</h1>;
  }

  return (
    <div className="home-container">
      <header className="hero-header" style={{ backgroundImage: `url(${planitHeaderImage})` }}>
        <div className="hero-content">
          <h1>Welcome to Eventro!</h1>
          <p>
            Event Planner is your one-stop solution to manage, plan, and track all your events.
            Create, edit, and manage events, track guest lists, assign event locations, and organize various activities with ease.
          </p>
          <p>Log in to get started and start planning your next event!</p>
        </div>
      </header>

      <section className="app-description">
        <h2>Unleash the Full Potential of Your Events</h2>
        <p>
          Whether you're planning a small gathering or a large corporate event, <strong>Eventro</strong> is designed to
          help you stay organized and focused on what truly matters — delivering an unforgettable experience.
        </p>
        <p>
          <strong>Effortlessly manage your event from start to finish:</strong>
        </p>
        <ul>
          <li><strong>Organize with Ease:</strong> Create events in seconds, set dates, and manage details like guest lists, venues, and more.</li>
          <li><strong>Real-Time Tracking:</strong> Keep track of RSVPs and guest lists in real-time. Get instant updates on changes and responses.</li>
          <li><strong>Customized Venue Assignment:</strong> Find the perfect venue for your event and assign it seamlessly, keeping everything in place.</li>
          <li><strong>Plan Every Detail:</strong> From catering to entertainment, make sure every activity runs according to plan.</li>
        </ul>
        <p>
          <strong>Eventro</strong> empowers you to streamline your event planning process so you can focus on creating meaningful connections
          and unforgettable moments.
        </p>
        <p>
          Ready to take your events to the next level? Sign up and start planning your next success today!
        </p>
      </section>

      <section className="features">
        <h2>Features</h2>
        <ul>
          <li><strong>Create, Edit, and Manage Events:</strong> Organize and modify your events easily.</li>
          <li><strong>Track Guest Lists:</strong> Keep track of your event's guests and their RSVP status.</li>
          <li><strong>Assign Event Locations:</strong> Assign specific locations for your events, ensuring everything runs smoothly.</li>
          <li><strong>Organize Event-Related Activities:</strong> Plan and coordinate the activities that will take place during the event.</li>
        </ul>
      </section>
    </div>
  );
}
