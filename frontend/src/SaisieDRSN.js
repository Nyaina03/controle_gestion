import React, { useState, useEffect } from 'react';
import Sidebar from "./Sidebar";
import Header from "./Header";
import "./css/EtatsAEtablir.css"; // Réutilisation des styles existants
import "./css/FormPage.css"; // Comme classe de CSS
import ConfirmationOk from './ConfirmationOk';
import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

function SaisieDRSN() {
  const [droit_de_port, setDroitPort] = useState("");
  const [droit_de_stationnement, setDroitStationnement] = useState("");
  const [autres, setAutresMouillage] = useState("");
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [error, setError] = useState(null);
  const location = useLocation();
  const nFacture = location.state?.nFacture;
  const navigate = useNavigate();



  const handleSubmit = (event) => {
    event.preventDefault();
    setError(null); // Réinitialiser l'erreur avant la soumission
  
    // Convertir le montant en nombre flottant
    const droitPortFloat = parseFloat(droit_de_port.trim());
    if (isNaN(droitPortFloat)) {
      setError('Le droit de port est invalide.');
      return;  
    }

    const droitStatFloat = parseFloat(droit_de_stationnement.trim());
    if (isNaN(droitStatFloat)) {
      setError('Le droit de stationnement est invalide.');
      return;  
    }

    const autresFloat = parseFloat(autres.trim());
    if (isNaN(autresFloat)) {
      setError('L autre est invalide.');
      return;  
    }

    // Préparer les données du budget
    const drsnData = {
      num_facture : nFacture,
      droit_de_port : droitPortFloat,
      droit_de_stationnement : droitStatFloat,
      autres: autresFloat,

    };
  
    // Envoi des données au serveur
    fetch('http://localhost:8000/api/statistiqueFacturees/drsn/', {  // Ajustez l'URL de l'API
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(drsnData),
    })
      .then(response => {
        if (!response.ok) {
          return response.json().then(errData => {
            console.error('Erreur API:', errData);
            throw new Error(`Erreur API: ${errData.detail || response.statusText}`);
          });
        }
        return response.json();
      })
      .then(data => {
        console.log('Réponse:', data);
        if (data.id_drsn) {
          setShowConfirmation(true);
        } else {
          throw new Error("Erreur lors de l'ajout du DRSN.");
        }
      })
      .catch(error => {
        console.error("Erreur lors de l'ajout du drsn:", error);
        setError("Une erreur est survenue. Veuillez réessayer.");
      });
  };

  
  const handleOk = () => {
    setShowConfirmation(false); // Fermer la fenêtre de confirmation
    {navigate('/liste_drsn')};
  };


  return (
    <div className="dashboard-page">
      <Sidebar />
      <div className="main-content">
        <Header />
        <div className="form-container">
          <h2 className="div-h2">Saisie des Droits de Stationnement et Mouillage (DRSN)</h2>

          {/* Formulaire de saisie */}
          <form onSubmit={handleSubmit}>

          <div className="form-group">
                <label>Numéro Facture:</label>
                <div className="readonly-field">
                  {nFacture || 'Non sélectionné'}
                </div>
          </div>
          
            <div className="form-group">
              <label htmlFor="droit_de_port">Droit de port (montant) :</label>
              <input
                type="number"
                id="droit_de_port"
                value={droit_de_port}
                onChange={(e) => setDroitPort(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="droit_de_stationnement">Droit de stationnement :</label>
              <input
                type="number"
                id="droit_de_stationnement"
                value={droit_de_stationnement}
                onChange={(e) => setDroitStationnement(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="autres">Autres / Mouillage :</label>
              <input
                type="number"
                id="autres"
                value={autres}
                onChange={(e) => setAutresMouillage(e.target.value)}
                required
              />
            </div>

            {/* Bouton pour enregistrer les données */}
            <div className="button-group">
              <button type="submit" className="btn save-btn">Enregistrer</button>
            </div>
          </form>

          {/* Message de confirmation après soumission */}
          {error && <p className="error-message">{error}</p>}
          {showConfirmation && <ConfirmationOk message="DRSN ajouté avec succès!" onClose={handleOk} />}
        </div>
      </div>
    </div>
  );
}

export default SaisieDRSN;
