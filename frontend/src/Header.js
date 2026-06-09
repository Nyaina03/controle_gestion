import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell } from '@fortawesome/free-solid-svg-icons';
import "./css/Header.css";
import "./css/LogoutModal.css";

function Header() {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [alertMessage, setAlertMessage] = useState(null);
  const [showAlert, setShowAlert] = useState(false); // Etat pour gérer l'alerte

  // Ouvrir la modale de déconnexion
  const handleLogoutClick = () => {
    setShowModal(true);
  };

  // Confirmer la déconnexion
  const confirmLogout = () => {
    localStorage.removeItem("access_token");
    setShowModal(false);
    navigate("/login");
  };

  // Annuler la déconnexion
  const cancelLogout = () => {
    setShowModal(false);
  };

  // Vérifier les tâches avec échéance proche
  useEffect(() => {
    const checkTaskDeadline = async () => {
      try {
        const response = await axios.get("/api/taches/alertes/"); // URL pour récupérer les alertes
        if (response.data.length > 0) {
          setAlertMessage("Attention : Certaines tâches ont une échéance dans moins de 5 jours.");
          setShowAlert(true); // Afficher l'alerte
        }
      } catch (error) {
        console.error("Erreur lors de la récupération des tâches : ", error);
      }
    };

    checkTaskDeadline();
  }, []);

  // Gérer le clic sur la cloche
  const handleBellClick = () => {
    navigate("/taches"); // Redirige vers la liste des tâches
  };

  return (
    <>
      <header className="main-header">
        <div className="wave-container">
          <svg className="wave-svg" viewBox="0 0 1200 200" preserveAspectRatio="none">
            <path
              d="M0,100 C150,150 350,50 600,100 C850,150 1050,50 1200,100 L1200,200 L0,200 Z"
              className="wave-path wave1"
            ></path>
            <path
              d="M0,130 C200,180 400,80 600,120 C800,160 1000,60 1200,130 L1200,200 L0,200 Z"
              className="wave-path wave2"
            ></path>
            <path
              d="M0,150 C220,180 450,100 650,140 C850,180 1100,100 1200,150 L1200,200 L0,200 Z"
              className="wave-path wave3"
            ></path>
          </svg>
        </div>
        <div className="header-content">
          <span className="welcome-text">Bienvenu,</span>
          {/* Affichage de l'alerte */}
          {alertMessage && showAlert && (
            <div className="task-alert">{alertMessage}</div>
          )}
          {/* Icône de la cloche avec notification 
          <div className="bell-container" onClick={handleBellClick}>
            <FontAwesomeIcon icon={faBell} className="bell-icon" />
            {showAlert && <span className="alert-dot"></span>} {/* Point rouge si alerte */}
          {/* *</div> */}


          <button className="logout-button" onClick={handleLogoutClick}>Logout</button>
        </div>
      </header>

      {/* Modale de confirmation */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <p>Êtes-vous sûr de vouloir vous déconnecter ?</p>
            <div className="modal-buttons">
              <button className="confirm-btn" onClick={confirmLogout}>Oui</button>
              <button className="cancel-btn" onClick={cancelLogout}>Annuler</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Header;
