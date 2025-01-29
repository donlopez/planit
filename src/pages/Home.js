import { useAuth } from "react-oidc-context";
import '../styles.css';
import planitHeaderImage from '../assets/planitheader.jpg'; // Import the image

export default function Home() {
  const auth = useAuth();

  if (auth.isAuthenticated) {
    const userName = auth.user?.profile?.email || "User";
    return (
      <div className="home-container">
        <header className="hero-header" style={{ backgroundImage: `url(${planitHeaderImage})` }}>
          <div className="hero-content">
            <h1>Welcome, {userName}!</h1>
            <p>
              You're all set! With <strong>Eventro</strong>, planning, managing, and tracking events has never been easier.
              Let us help you bring your next big event to life.
            </p>
          </div>
        </header>

        <section className="app-description">
          <h2>Maximize Your Event Planning with Eventro</h2>
          <p>
            Whether it's a small gathering or a large corporate event, <strong>Eventro</strong> allows you to easily manage every aspect of your event, from guest lists to event activities.
            Our intuitive platform will keep everything organized, so you can focus on what matters most — creating unforgettable experiences.
          </p>
          <p>
            <strong>What You Can Do With Eventro:</strong>
          </p>
          <ul>
            <li><strong>Organize with Ease:</strong> Set up events quickly, from specifying dates and times to managing guest lists and event details.</li>
            <li><strong>Track RSVPs in Real-Time:</strong> Stay on top of who’s attending and receive instant updates on responses.</li>
            <li><strong>Assign Locations Seamlessly:</strong> Choose the best venues and assign them to your events with just a few clicks.</li>
            <li><strong>Coordinate Every Detail:</strong> From catering to entertainment, ensure every part of your event is perfectly coordinated.</li>
          </ul>
          <p>
            <strong>Eventro</strong> makes it easy for you to handle all the logistics, so you can focus on delivering a great experience for your guests.
          </p>
          <p>
            Ready to elevate your events? Start exploring your dashboard and manage your events like a pro!
          </p>
        </section>

        <section className="features">
          <h2>Features at a Glance</h2>
          <ul>
            <li><strong>Create, Edit, and Manage Events:</strong> Easily organize and modify event details.</li>
            <li><strong>Track Guest Lists:</strong> Monitor RSVP statuses and manage your guest list effortlessly.</li>
            <li><strong>Assign Event Locations:</strong> Pick and assign locations for your events with ease.</li>
            <li><strong>Organize Event Activities:</strong> Plan and manage the schedule of your event’s activities, ensuring everything flows smoothly.</li>
          </ul>
        </section>
      </div>
    );
  }

  return null;
}
