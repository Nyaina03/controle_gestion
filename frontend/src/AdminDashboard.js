import React, { useState, useEffect } from 'react';
import Header from './Header';  // Assurez-vous que ce chemin est correct
import Sidebar from './Sidebar'; // Assurez-vous que ce chemin est correct
import './css/FormPage.css';  // CSS pour styliser le composant
import ConfirmationOk from './ConfirmationOk'; // Composant de confirmation

function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [newRole, setNewRole] = useState(5); // Valeur par défaut : utilisateur normal
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Charger la liste des utilisateurs
    fetch('http://localhost:8000/api/utilisateur/utilisateur/')
      .then(response => response.json())
      .then(data => setUsers(data))
      .catch(error => console.error('Erreur lors du chargement des utilisateurs:', error));
  }, []);

  const handleRoleChange = async () => {
    if (selectedUser && newRole) {
      const response = await fetch(`http://localhost:8000/api/utilisateur/utilisateur/${selectedUser.id_utilisateur}/`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ statut: newRole }),
      });

      const data = await response.json();
      if (response.ok) {
        setShowConfirmation(true); // Afficher la confirmation si le changement de rôle est réussi
      } else {
        setError("Erreur lors de la modification du rôle");
      }
    }
  };

  const handleOk = () => {
    setShowConfirmation(false); // Fermer la fenêtre de confirmation
  };

  return (
    <div className="form-page">
      <Header /> {/* Importation du Header */}
      <div className="main-content">
        <Sidebar /> {/* Importation du Sidebar */}
        <div className="form-container">
          <div className="div-h2">
            <h2>Tableau de bord Administrateur</h2>
          </div>
          <div className="form-group">
            <label>Choisir un utilisateur</label>
            <select 
              onChange={(e) => setSelectedUser(users.find(user => user.id_utilisateur === Number(e.target.value)))}
              className="input-field"
            >
              <option value="">Sélectionner un utilisateur</option>
              {users.map(user => (
                <option key={user.id_utilisateur} value={user.id_utilisateur}>{user.mail}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Choisir le rôle</label>
            <select 
              onChange={(e) => setNewRole(Number(e.target.value))}
              className="input-field"
            >
              <option value={5}>Utilisateur normal</option>
              <option value={1}>Administrateur</option>
            </select>
          </div>

          <div className="button-group">
              <button
                type="submit"
                onClick={handleRoleChange}
                className="btn save-btn"
              >
                 Modifier le rôle
              </button>
            </div>

          {error && <p className="error-message">{error}</p>}
          {showConfirmation && <ConfirmationOk message="Rôle modifié avec succès !" onClose={handleOk} />}
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
