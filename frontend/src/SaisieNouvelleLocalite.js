import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './css/Sidebar.css';
import Sidebar from "./Sidebar";
import Header from "./Header";
import './css/FormPage.css';
import './css/ConfirmationModal.css'; 
import ConfirmationModal from './ConfirmationModal';

function SaisieNouvelleLocalite() {
  const [ville, setVille] = useState('');
  const [codeVille, setCodeVille] = useState('');
  const [type, setType] = useState([]);
  const [showSuccessModal, setShowSuccessModal] = useState(false); // State for success modal
  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();
    const newVille = { nom_ville: ville, code_ville: codeVille, type_ville:type };

    fetch('http://localhost:8000/api/localites/villes/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newVille),
    })
      .then(response => {
        if (response.ok) {
          setShowSuccessModal(true); // Show success modal on success
          setTimeout(() => {
            setShowSuccessModal(false);
            navigate('/liste_des_localites'); // Redirect after delay
          }, 2000);
        } else {
          throw new Error("Erreur lors de l'ajout de la localité");
        }
      })
      .catch(error => console.error('Erreur :', error));
  };

  return (
    <div className="dashboard-page">
      <Sidebar />
      <div className="main-content">
        <Header />
        <div className="form-container">
          <div className="div-h2">
            <h2>Saisie de la Nouvelle Localité</h2>
          </div>
          <form onSubmit={handleSubmit} className="form">
            <div className="form-group">
              <label htmlFor="ville">Ville:</label>
              <input
                id="ville"
                type="text"
                value={ville}
                onChange={(e) => setVille(e.target.value)}
                required // Ajout de la validation automatique
              />
            </div>
            <div className="form-group">
              <label htmlFor="codeVille">Code Ville:</label>
              <input
                id="codeVille"
                type="text"
                value={codeVille}
                onChange={(e) => setCodeVille(e.target.value)}  
                required // Ajout de la validation automatique
              />
            </div>
            <div className="form-group">
              <label htmlFor="type">Type:</label>
              <select
                id="type-select"
                value={type}
                onChange={(e) => setType(e.target.value)}
                required
              >
                <option value="">--Choisissez type--</option>
                <option value="DRA">DRA</option>
                <option value="REPR">REPR</option>  
              </select>
            </div>
            <div className="button-group">
              <button type="submit" className="btn save-btn">Enregistrer</button>
            </div>
          </form>
        </div>

        {/* Success Modal */}
        {showSuccessModal && (
          <ConfirmationModal
            message="Succès ! Localité ajoutée avec succès."
            showButtons={false} // Hide confirm/cancel buttons
          />
        )}
      </div>
    </div>
  );
}

export default SaisieNouvelleLocalite;
