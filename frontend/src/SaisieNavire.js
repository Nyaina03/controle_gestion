import React, { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";
import "./css/FormPage.css"; // Réutilisation des styles existants
import ConfirmationOk from './ConfirmationOk';

function SaisieNavire() {
  const[port_ou_localite, setPort] = useState('');
  const[date_operation, setDateOperation] = useState('');
  const[navire, setNavire] = useState('');
  const[imm, setImm] = useState('');
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [error, setError] = useState(null);
  const [localite, setLocalite] = useState('');
  const [localites, setLocalites] = useState([]);


  useEffect(() => {
    // Charger les localités
    fetch('http://localhost:8000/api/localites/villes/')
      .then(response => response.json())
      .then(data => setLocalites(data))
      .catch(error => console.error('Erreur lors du chargement des localités:', error));

  }, []);

  const handleSubmit = (event) => {
    event.preventDefault();
    setError(null); // Réinitialiser l'erreur avant la soumission
  
    

    // Préparer les données du budget
    const navireData = {
      localite,
      date_operation,
      navire ,
      imm , 

    };
  
    // Envoi des données au serveur
    fetch('http://localhost:8000/api/statistiqueBrutes/navires/', {  // Ajustez l'URL de l'API
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(navireData),
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
        if (data.id_navire) {
          setShowConfirmation(true);
        } else {
          throw new Error("Erreur lors de l'ajout du Navire.");
        }
      })
      .catch(error => {
        console.error("Erreur lors de l'ajout du navire:", error);
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
          <h2 className="div-h2">Saisie des Navires</h2>

          {/* Formulaire */}
          <form onSubmit={handleSubmit}>
            {/* Sélection de la localité */}
            <div className="form-group">
              <label htmlFor="localite-select">Port/Localité:</label>
              <select
                id="localite-select"
                value={localite}
                onChange={(e) => setLocalite(e.target.value)}
                required
              >
                <option value="">--Choisissez une localité--</option>
                {localites.map(localite => (
                  <option key={localite.id_ville} value={localite.id_ville}>
                    {localite.nom_ville}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="date_operation">Date :</label>
              <input
                type="date"
                id="date_operation"
                name="date_operation"
                value={date_operation}
                onChange={(e) => setDateOperation(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="navire">Navire :</label>
              <input
                type="text"
                id="navire"
                name="navire"
                value={navire}
                onChange={(e) => setNavire(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="imm">IMM :</label>
              <input
                type="text"
                id="imm"
                name="imm"
                value={imm}
                onChange={(e) => setImm(e.target.value)}
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
             {/* Message de confirmation après soumission */}
             {error && <p className="error-message">{error}</p>}
          {showConfirmation && <ConfirmationOk message="Navire ajouté avec succès!" onClose={handleOk} />}

          {/* Bouton Génération d'escales */}
         
     
        

        </div>
      </div>
    </div>
  );
}

export default SaisieNavire;
