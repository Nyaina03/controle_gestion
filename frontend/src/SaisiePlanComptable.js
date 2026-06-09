import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './css/Sidebar.css';
import Sidebar from "./Sidebar";
import Header from "./Header";
import './css/FormPage.css';
import ConfirmationOk from './ConfirmationOk';

function SaisiePlanComptable() {
  const [compte, setCompte] = useState('');
  const [libelle, setLibelle] = useState('');
  const [type_compte, setTypeCompte] = useState('');
  const [typeComptesList, setTypeComptesList] = useState([]);
  const [message, setMessage] = useState('');
  const [error, setError] = useState(''); // Ajouter une variable d'erreur
  const [showConfirmation, setShowConfirmation] = useState(false); // Ajouter showConfirmation
  const navigate = useNavigate();

  useEffect(() => {
    fetch('http://localhost:8000/api/type_compte/list')
      .then(response => response.json())
      .then(data => setTypeComptesList(data))
      .catch(error => console.error('Error fetching type comptes:', error));
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    if (!compte || !libelle || !type_compte) {
      setMessage("Tous les champs sont requis.");
      return;
    }

    const data = {
      code: compte,
      libelle: libelle,
      id_type_compte: type_compte,
    };

    try {
      const response = await fetch('http://localhost:8000/api/comptes/comptes/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la soumission');
      }

      const result = await response.json();
      console.log('Réponse API:', result);
      setMessage("Compte ajouté avec succès");
      setShowConfirmation(true); // Afficher la confirmation

      // Réinitialiser le formulaire après la soumission
      setCompte('');
      setLibelle('');
      setTypeCompte('');

    } catch (error) {
      console.error('Erreur:', error);
      setMessage("Une erreur est survenue lors de l'ajout du compte.");
      setError('Une erreur est survenue lors de l\'ajout du compte.');
    }
  };

  const handleOk = () => {
    setShowConfirmation(false); // Fermer la confirmation
    navigate('/liste_comptes');
  };

  return (
    <div className="dashboard-page">
      <Sidebar />
      <div className="main-content">
        <Header />
        <div className="form-container">
          <div className="div-h2">
            <h2>Saisie Plan Comptable</h2>
          </div>
          <form onSubmit={handleSubmit} className="form">
            {/* compte */}
            <div className="form-group">
              <label htmlFor="compte">Compte:</label>
              <input
                id="compte"
                type="text"
                value={compte}
                onChange={(e) => setCompte(e.target.value)}
                required // Validation automatique
              />
            </div>

            {/* libelle */}
            <div className="form-group">
              <label htmlFor="libelle">Libellé:</label>
              <input
                id="libelle"
                type="text"
                value={libelle}
                onChange={(e) => setLibelle(e.target.value)}  
                required // Validation automatique
              />
            </div>

            {/* type_compte (Liste déroulante) */}
            <div className="form-group">
              <label htmlFor="type_compte">Type:</label>
              <select
                id="type_compte"
                value={type_compte}
                onChange={(e) => setTypeCompte(e.target.value)}
                required // Validation automatique pour s'assurer qu'un type est sélectionné
              >
                <option value="">-- Sélectionnez un type --</option>
                {typeComptesList.map((type) => (
                  <option key={type.id_type_compte} value={type.id_type_compte}>
                    {type.type_compte}
                  </option>
                ))}
              </select>
            </div>

            <div className="button-group">
              <button type="submit" className="btn save-btn">Enregistrer</button>
            </div>
          </form>
          
          {error && <p className="error-message">{error}</p>}
          {showConfirmation  && <ConfirmationOk message="Compte ajouté avec succès!" onClose={handleOk}/>}
        </div>
      </div>
    </div>
  );
}

export default SaisiePlanComptable;
