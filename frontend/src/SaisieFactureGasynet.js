import React, { useState, useEffect } from 'react';
import './css/Sidebar.css';
import Sidebar from "./Sidebar";
import Header from "./Header";
import ConfirmationOk from './ConfirmationOk';
import './css/FormPage.css';

function SaisieFactureGasynet() {
  const [date, setDate] = useState('');
  const [compte, setCompte] = useState('');
  const [bureau_douane, setBureau_douane] = useState('');
  const [localite, setLocalite] = useState('');
  const [montant_ht, setMontantHt] = useState('');
  const [tva, setTVA] = useState('');
  const [choix, setChoix] = useState('');
  const [comptes, setComptes] = useState([]);
  const [villes, setVilles] = useState([]);
  const [successMessage, setSuccessMessage] = useState('');
  const [error, setError] = useState(null);
  const [fileData, setFileData] = useState(null);

  // Soumission du formulaire de saisie
  const handleSubmit = (event) => {
    event.preventDefault();

    const montantFloat = parseFloat(montant_ht.replace(/,/g, '').trim());
    const idCompteInt = parseInt(compte, 10);
    const idVilleInt = parseInt(localite, 10);
    const tvaFloat = parseFloat(tva.replace(/,/g, '').trim());

    if (isNaN(idCompteInt) || isNaN(idVilleInt) || isNaN(montantFloat) || isNaN(tvaFloat)) {
      setError("Veuillez vérifier les données saisies.");
      return;
    }

    const recetteData = {
      date_recette: date,
      id_compte: idCompteInt,
      bureau_douane,
      id_ville: idVilleInt,
      montant_ht: montantFloat,
      tva: tvaFloat,
    };

    fetch('http://localhost:8000/api/recetteGasynet/recetteGasynet/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(recetteData),
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
        throw new Error('Erreur lors de l\'insertion');
      })
      .then(() => {
        setSuccessMessage('Données insérées avec succès!');
        setTimeout(() => setSuccessMessage(''), 3000);
      })
      .catch(() => {
        setError('Erreur lors de l\'insertion des données');
      });
  };

  // Chargement des comptes et villes
  useEffect(() => {
    fetch('http://localhost:8000/api/comptes/comptes/')
      .then((response) => response.json())
      .then((data) => setComptes(data))
      .catch(() => setError('Erreur lors du chargement des comptes'));

    fetch('http://localhost:8000/api/localites/villes/')
      .then((response) => response.json())
      .then((data) => setVilles(data))
      .catch(() => setError('Erreur lors du chargement des villes'));
  }, []);

  // Gestion de l'import de fichier
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setFileData(file);
    } else {
      setError("Aucun fichier sélectionné.");
    }
  };

  const handleFileSubmit = () => {
    if (!fileData) {
      setError('Veuillez sélectionner un fichier.');
      return;
    }

    const formData = new FormData();
    formData.append('file', fileData);

    fetch('http://localhost:8000/api/recetteGasynet/recetteGasynet/import/', {
      method: 'POST',
      body: formData,
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
        throw new Error('Erreur lors de l\'importation');
      })
      .then(() => {
        setSuccessMessage('Fichier importé avec succès!');
        setTimeout(() => setSuccessMessage(''), 3000);
      })
      .catch(() => {
        setError('Erreur lors de l\'importation.');
      });
  };

  return (
    <div className="dashboard-page">
      <Sidebar />
      <div className="main-content">
        <Header />
        <div className="form-container">
          <div className="div-h2">
            <h2>Saisie Facture GASYNET</h2>
          </div>

          {successMessage && <ConfirmationOk message={successMessage} />}
          {error && <div className="error-message">{error}</div>}

          <div className="choix-container">
            <h3>Choisissez une option :</h3>
            <button onClick={() => setChoix('saisie')} className="choix-btn saisie">Saisir des données</button>
            <button onClick={() => setChoix('import')} className="choix-btn import">Importer un fichier</button>
          </div>

          {choix === 'saisie' && (
            <form onSubmit={handleSubmit} className="form">
              <div className="form-group">
                <label htmlFor="date">Date:</label>
                <input
                  id="date"
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="compte-select">Compte:</label>
                <select
                  id="compte-select"
                  value={compte}
                  onChange={(e) => setCompte(e.target.value)}
                  required
                >
                  <option value="">--Choisissez un compte--</option>
                  {comptes
                    .filter(compte => compte.id_compte === 1 || compte.id_compte === 2)
                    .map(compte => (
                      <option key={compte.id_compte} value={compte.id_compte}>
                        {compte.code} - {compte.libelle}
                      </option>
                    ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="bureau_douane">Bureau de Douane:</label>
                <input
                  id="bureau_douane"
                  type="text"
                  value={bureau_douane}
                  onChange={(e) => setBureau_douane(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="localite-select">Localité:</label>
                <select
                  id="localite-select"
                  value={localite}
                  onChange={(e) => setLocalite(e.target.value)}
                  required
                >
                  <option value="">--Choisissez une localité--</option>
                  {villes.map((ville) => (
                    <option key={ville.id_ville} value={ville.id_ville}>
                      {ville.nom_ville}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="montant_ht">Montant HT:</label>
                <input
                  id="montant_ht"
                  type="number"
                  value={montant_ht}
                  onChange={(e) => setMontantHt(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="tva">TVA:</label>
                <input
                  id="tva"
                  type="number"
                  value={tva}
                  onChange={(e) => setTVA(e.target.value)}
                  required
                />
              </div>

              <div className="button-group">
                <button type="submit" className="btn save-btn">Enregistrer</button>
              </div>
            </form>
          )}

          {choix === 'import' && (
            <div className="import-container">
              <input
                type="file"
                onChange={handleFileUpload}
              />

              <div className="button-group">
              <button type="submit" onClick={handleFileSubmit} className="btn save-btn" disabled={!fileData}>
                  Importer
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default SaisieFactureGasynet;
