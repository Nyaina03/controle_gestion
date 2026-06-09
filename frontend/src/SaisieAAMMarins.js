import React, { useState } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";
import "./css/FormPage.css"; // Réutilisation des styles existants
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import ConfirmationOk from './ConfirmationOk';
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";

function SaisieAAMMarins() {
  // États pour gérer les champs et les données
  const[aptitude, setAptitude] = useState('');
  const[base, setBase] = useState('');
  const[fs, setFs] = useState([null, null, null]);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [error, setError] = useState(null);
  const location = useLocation();
  const nFacture = location.state?.nFacture;
  const navigate = useNavigate();

  const handleOk = () => {
    setShowConfirmation(false); // Fermer la fenêtre de confirmation
    {navigate('/liste_aam')};
  };


  const handleSubmit = (e) => {
    e.preventDefault();
  
    const aamMarinData ={
      num_facture : nFacture,
      aptitude ,
      base,
      ...fs.reduce((acc, f, idx) => {
        acc[`f${idx + 1}`] = f || null;
        return acc;
      }, {}),
    };
  
      fetch('http://localhost:8000/api/statistiqueFacturees/aam_marins/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(aamMarinData),
      })
        .then((response) => {
          if (response.ok) {
            setShowConfirmation(true); // Affiche la confirmation de succès
          } else {
            setError('Erreur lors de l\'envoi des données');
          }
        })
        .catch((error) => {
          setError('Erreur de connexion');
          console.error('Erreur de connexion:', error);
        });
   
  };
  const handleAddF = () => {
    // Ajoute un champ d'attachement supplémentaire
    setFs([...fs, null]); // Ajouter un champ vide pour le nouvel attachement
  };

  const handleFChange = (index, value) => {
    const updatedFs = [...fs];
    updatedFs[index] = value;
    setFs(updatedFs);
  };
  
  return (
    <div className="dashboard-page">
      <Sidebar />
      <div className="main-content">
        <Header />
        <div className="form-container">
          <h2 className="div-h2">Saisie des AAM Marins</h2>

          {/* Formulaire */}
          <form onSubmit={handleSubmit}>

          <div className="form-group">
                <label>Numéro Facture:</label>
                <div className="readonly-field">
                  {nFacture || 'Non sélectionné'}
                </div>
          </div>
            {/* Aptitude */}
            <div className="form-group">
              <label htmlFor="aptitude">aptitude (nombre) :</label>
              <input
                type="number"
                id="aptitude"
                name="aptitude"
                value={aptitude}
                onChange={(e) => setAptitude(e.target.value)}
                required
              />
            </div>

            {/* Base */}
            <div className="form-group">
              <label htmlFor="base">base :</label>
              <input
                type="text"
                id="base"
                name="base"
                value={base}
                onChange={(e) => setBase(e.target.value)}
                required
              />
            </div>

          {/* Champs pour attachements */}
            {fs.map((f, idx) => (
                  <div className="form-group" key={idx}>
                    <label>{`F${idx + 1} :`}</label>
                    <input
                      type="number"
                      value={f}
                      onChange={(e) => handleFChange(idx, e.target.value)}
                      placeholder={`Entrez les F ${idx + 1}`}
                    />
                  </div>
                ))}

            {/* Bouton Ajouter ligne */}

            <button type="button" onClick={handleAddF} className="add-button">
                      <FontAwesomeIcon icon={faPlus} /> Ajouter F
                  </button>

                <div className="button-group">
                  <button type="submit" className="btn save-btn">Enregistrer</button>
                </div>
          </form>
          {error && <p className="error-message">{error}</p>}
          {showConfirmation && <ConfirmationOk message="AAM Marins ajouté avec succès!" onClose={handleOk} />}
        </div>
      </div>
    </div>
  );
}

export default SaisieAAMMarins;
