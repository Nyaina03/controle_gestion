import React, { useState, useEffect } from "react";
import { FaBell } from "react-icons/fa"; // Icône de cloche
import "./css/NotificationBell.css";

const NotificationBell = () => {
  const [tachesUrgentes, setTachesUrgentes] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/taches/alerte/")
      .then((response) => response.json())
      .then((data) => setTachesUrgentes(data))
      .catch((error) => console.error("Erreur lors de la récupération des tâches:", error));
  }, []);

  return (
    <div className="notification-container">
      <div className="notification-icon" onClick={() => setShowNotifications(!showNotifications)}>
        <FaBell className={tachesUrgentes.length > 0 ? "bell active" : "bell"} />
        {tachesUrgentes.length > 0 && <span className="notification-badge">{tachesUrgentes.length}</span>}
      </div>

      {showNotifications && (
        <div className="notification-dropdown">
          <h4>🔔 Alertes tâches</h4>
          {tachesUrgentes.length === 0 ? (
            <p>Aucune tâche urgente</p>
          ) : (
            <ul>
              {tachesUrgentes.map((tache) => (
                <li key={tache.id_tache}>
                  📌 <strong>{tache.titre}</strong> - Échéance : {tache.date_limite}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
