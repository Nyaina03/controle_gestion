import React, { useState, useEffect } from 'react';
import Header from './Header'; // Importer le Header
import Sidebar from './Sidebar'; // Importer la Sidebar
import './css/FormPage.css'; // CSS existant

const AttachementParCompte = () => {
  const [annee_contrat, setAnneeContrat] = useState('');
  const [num_marche, setNumMarche] = useState('');
  const [annee_paiement, setAnneepaiement] = useState('');
  const [num_attachement, setNumAttachement] = useState('');
  const [montant, setMontant] = useState('');

   // États pour les détails conditionnels
   const [details, setDetails] = useState({
    annee_paiement: '',
    num_attachement: '',
    montant: '',
  });

  // États pour les messages et affichage conditionnel
  const [isDetailsVisible, setIsDetailsVisible] = useState(false);
  const [responseMessage, setResponseMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Efface les messages à chaque modification des champs
  useEffect(() => {
    setResponseMessage('');
    setErrorMessage('');
  }, [annee_contrat, num_marche, details]);

  // Gestion du bouton OK
  const handleOKClick = (e) => {
    e.preventDefault();
    const form = e.target.form;

    if (form.checkValidity()) {
      setIsDetailsVisible(true);
    } else {
      form.reportValidity();
    }
  };

  // Soumission des données avec fetch
  const handleSubmit = (e) => {
    e.preventDefault();

    const postData = {
      annee: annee_contrat,
      num_marche: num_marche,
      annee_paiement: details.annee_paiement,
      num_attachement: details.num_attachement,
      montant: details.montant,
    };

    fetch('http://localhost:8000/api/marches/attachement_par_compte/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(postData),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Erreur lors de l\'enregistrement.');
        }
        return response.json();
      })
      .then((data) => {
        console.log('Données enregistrées:', data);
        setResponseMessage('Enregistrement réussi!');
        setErrorMessage('');
      })
      .catch((error) => {
        console.error('Erreur:', error);
        setErrorMessage('Une erreur est survenue lors de l\'enregistrement.');
        setResponseMessage('');
      });
  };

  return (
    <div className="form-page">
      <Sidebar />
      <div className="main-content">
        <Header />
        <div className="form-container">
          <div className="div-h2">
            <h2>Attachement Par Compte</h2>
          </div>
          <form onSubmit={handleSubmit}>
            {/* Choix Année du Contrat */}
            <div className="form-group">
              <label htmlFor="annee_contrat">Année (Contrat):</label>
              <input
                type="number"
                id="annee_contrat"
                value={annee_contrat}
                onChange={(e) => setAnneeContrat(e.target.value)}
                required
              />
            </div>

            {/* Choix Numéro de Marché */}
            <div className="form-group">
              <label htmlFor="num_marche">Numéro de Marché:</label>
              <input
                type="num_marche"
                id="num_marche"
                value={num_marche}
                onChange={(e) => setNumMarche(e.target.value)}
                required
              />
            </div>

            {/* Bouton OK */}
            <div className="button-group">
              <button type="submit" onClick={handleOKClick} className="btn save-btn">
                OK
              </button>
            </div>

            {/* Champs Détails conditionnels */}
            {isDetailsVisible && (
              <>
                <div className="form-group">
                  <label htmlFor="annee_paiement">Année (Paiement):</label>
                  <input
                    type="number"
                    id="annee_paiement"
                    value={details.annee_paiement}
                    onChange={(e) =>
                      setDetails({ ...details, annee_paiement: e.target.value })
                    }
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="num_attachement">Numéro d'Attachement:</label>
                  <input
                    type="text"
                    id="num_attachemnt"
                    value={details.num_attachement}
                    onChange={(e) =>
                      setDetails({ ...details, num_attachement: e.target.value })
                    }
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="montant">Montant:</label>
                  <input
                    type="number"
                    id="montant"
                    step="0.001"
                    value={details.montant}
                    onChange={(e) =>
                      setDetails({ ...details, montant: e.target.value })
                    }
                    required
                  />
                </div>

                {/* Bouton Enregistrer */}
                <div className="button-group">
                  <button type="submit">Enregistrer</button>
                </div>
              </>
            )}
          </form>

          {/* Messages de succès ou d'erreur */}
          {responseMessage && <p style={{ color: 'green' }}>{responseMessage}</p>}
          {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
        </div>
      </div>
    </div>
  );
};

export default AttachementParCompte;
