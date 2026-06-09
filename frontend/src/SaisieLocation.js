import React, { useState } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";
import "./css/FormPage.css"; // Réutilisation des styles existants
import ConfirmationOk from './ConfirmationOk';

function SaisieLocation() {
  const [surface_louee, setSurfaceLoue] = useState(""); // État pour le champ
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [error, setError] = useState(null);

  // Gérer la soumission du formulaire
  const handleSubmit = (event) => {
    event.preventDefault();
    setError(null); // Réinitialiser l'erreur avant la soumission
  
    

    // Préparer les données du budget
    const locationData = {
      surface_louee,

    };
  
    // Envoi des données au serveur
    fetch('http://localhost:8000/api/statistiqueFacturees/location_tp/', {  // Ajustez l'URL de l'API
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(locationData),
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
        if (data.id_location_tp) {
          setShowConfirmation(true);
        } else {
          throw new Error("Erreur lors de l'ajout de Location.");
        }
      })
      .catch(error => {
        console.error("Erreur lors de l'ajout de location:", error);
        setError("Une erreur est survenue. Veuillez réessayer.");
      });
  };

  const handleOk = () => {
    setShowConfirmation(false); // Fermer la fenêtre de confirmation
  };


  return (
    <div className="dashboard-page">
      <Sidebar />
      <div className="main-content">
        <Header />
        <div className="form-container">
          <h2 className="div-h2">Saisie de la Location</h2>

          {/* Formulaire */}
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="surface_louee">
                Surface louée ou occupée (m²) :
              </label>
              <input
                type="number"
                id="surface_louee"
                name="surface_louee"
                value={surface_louee}
                onChange={(e) => setSurfaceLoue(e.target.value)}
                required
              />
            </div>

            {/* Bouton Enregistrer */}
            <div className="button-group">
              <button type="submit" className="btn save-btn">
                Enregistrer
              </button>
            </div>
          </form>

          {/* Message de confirmation */}
    {/* Message de confirmation après soumission */}
          {error && <p className="error-message">{error}</p>}
          {showConfirmation && <ConfirmationOk message="Location ajouté avec succès!" onClose={handleOk} />}
        </div>
      </div>
    </div>
  );
}

export default SaisieLocation;
