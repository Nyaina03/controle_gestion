import React, { useState } from 'react';
import Header from './Header'; 
import Sidebar from './Sidebar'; 
import './css/FormPage.css'; 
import './css/EtatsAEtablir.css';
import { useNavigate } from 'react-router-dom';
import ConfirmationOk from './ConfirmationOk';

function SaisieRefDos() {
  const[libelle, setLibelle] = useState('');
  const[ref_dos, setRefDos] = useState('');
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();


  const handleSubmit = (event) => {
    event.preventDefault();
    setError(null); // Réinitialiser l'erreur avant la soumission
  
    // Préparer les données du budget
    const dosData = {
        libelle,
        ref_dos,
    };
  
    // Envoi des données au serveur
    fetch('http://localhost:8000/api/dos/dos/', {  // Ajustez l'URL de l'API
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(dosData),
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
        if (data.id_dos) {
          setShowConfirmation(true);
        } else {
          throw new Error("Erreur lors de l'ajout du dos.");
        }
      })
      .catch(error => {
        console.error("Erreur lors de l'ajout du dos:", error);
        setError("Une erreur est survenue. Veuillez réessayer.");
      });
  };

  const handleOk = () => {
    setShowConfirmation(false); // Fermer la fenêtre de confirmation
    {navigate('/liste_dos')};
  };


  return (
    <div className="form-page">
      <Header />
      <div className="main-content">
        <Sidebar />
        <div className="form-container">
          <div className="div-h2">
            <h2>Saisie des Références DOS</h2>
          </div>
          <form onSubmit={handleSubmit} className="saisie-refdos-form">
            <div className="form-group">
              <label htmlFor="libelle">Libellé</label>
              <input
                type="text"
                id="libelle"
                name="libelle"
                value={libelle}
                onChange={(e) => setLibelle(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="reference">Référence Dos</label>
              <input
                type="text"
                id="reference"
                name="reference"
                value={ref_dos}
                onChange={(e) => setRefDos(e.target.value)}
                required
              />
            </div>
            <div className="button-group">
              <button type="submit" className="btn-submit">
                Enregistrer
              </button>
            </div>
          </form>
          {error && <p className="error-message">{error}</p>}
          {showConfirmation && <ConfirmationOk message="ref_dos ajouté avec succès!" onClose={handleOk} />}
        </div>
      </div>
    </div>
  );
}

export default SaisieRefDos;
