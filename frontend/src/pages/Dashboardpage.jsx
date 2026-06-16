import { useAuth } from "../context/useAuth";
import './Dashboardpage.css';

export default function DashboardPage() {
  const { user, isAdmin } = useAuth();

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';

  return (
    <div className="dashboard animate-fade-up">
      <div className="dashboard__hero">
        <div>
          <p className="dashboard__greeting">{greeting},</p>
          <h1 className="dashboard__name">{user?.username}</h1>
          {isAdmin && <span className="badge badge-high" style={{ marginTop: 8, display: 'inline-flex' }}>Admin</span>}
        </div>
      </div>
      <div className="dashboard__section">
        <h3>Welcome to TaskFlow!</h3>
        <p>Your dashboard is ready.</p>
      </div>
    </div>
  );
}