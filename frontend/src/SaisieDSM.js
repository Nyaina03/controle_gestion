import React, { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";
import "./css/FormPage.css"; // Réutilisation des styles existants
import ConfirmationOk from './ConfirmationOk';
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";

function SaisieDSM() {
  const [mses_embarquees, setMsesEmbarquees] = useState('');
  const [mses_debarquees, setMsesDebarquees] = useState('');
  const [passagers_nationaux, setPassagerNationaux] = useState('');
  const [passagers_internationaux, setPassagerInternationaux] = useState('');
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [error, setError] = useState(null);
  const location = useLocation();
  const nFacture = location.state?.nFacture;
  const navigate = useNavigate();


  const handleSubmit = (event) => {
    event.preventDefault();
    setError(null); // Réinitialiser l'erreur avant la soumission
  
    

    // Préparer les données du budget
    const dsmData = {
      num_facture : nFacture,
      mses_embarquees,
      mses_debarquees,
      passagers_nationaux,
      passagers_internationaux,

    };
  
    // Envoi des données au serveur
    fetch('http://localhost:8000/api/statistiqueFacturees/dsm/', {  // Ajustez l'URL de l'API
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(dsmData),
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
        if (data.id_dsm) {
          setShowConfirmation(true);
        } else {
          throw new Error("Erreur lors de l'ajout du DSM.");
        }
      })
      .catch(error => {
        console.error("Erreur lors de l'ajout du drsn:", error);
        setError("Une erreur est survenue. Veuillez réessayer.");
      });
  };

  const handleOk = () => {
    setShowConfirmation(false); // Fermer la fenêtre de confirmation
    {navigate('/liste_DSM')};
  };


  return (
    <div className="dashboard-page">
      <Sidebar />
      <div className="main-content">
        <Header />
        <div className="form-container">
          <h2 className="div-h2">Saisie DSM</h2>

          {/* Formulaire */}
          <form onSubmit={handleSubmit}>

          <div className="form-group">
                <label>Numéro Facture:</label>
                <div className="readonly-field">
                  {nFacture || 'Non sélectionné'}
                </div>
          </div>

            <div className="form-group">
              <label htmlFor="mses_embarquees">MSES Embarquées (tonnage) :</label>
              <input
                type="number"
                id="mses_embarquees"
                value={mses_embarquees}
                onChange={(e) => setMsesEmbarquees(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="mses_debarquees">MSES Débarquées (tonnage) :</label>
              <input
                type="number"
                id="mses_debarquees"
                value={mses_debarquees}
                onChange={(e) => setMsesDebarquees(e.target.value)}
                required
            
              />
            </div>

            
            <div className="form-group">
              <label htmlFor="passagers_nationaux">Passagers Nationaux (tonnage) :</label>
              <input
                type="number"
                id="passagers_nationaux"
                value={passagers_nationaux}
                onChange={(e) => setPassagerNationaux(e.target.value)}
                required
            
              />
            </div>
            <div className="form-group">
              <label htmlFor="passagers_internationaux">Passagers Internationaux (tonnage) :</label>
              <input
                type="number"
                id="passagers_internationaux"
                value={passagers_internationaux}
                onChange={(e) => setPassagerInternationaux(e.target.value)}
                required
            
              />
            </div>

            {/* Bouton pour enregistrer */}
            <div className="button-group">
              <button type="submit" className="btn save-btn">Enregistrer</button>
            </div>
          </form>

          {/* Message de confirmation après soumission */}
          {error && <p className="error-message">{error}</p>}
          {showConfirmation && <ConfirmationOk message="DSM ajouté avec succès!" onClose={handleOk} />}
        </div>
      </div>
    </div>
  );
}

export default SaisieDSM;
