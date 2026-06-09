import React, { useState, useEffect } from 'react';
import './css/FormPage.css';
import Sidebar from './Sidebar';
import Header from './Header';
import ConfirmationOk from './ConfirmationOk';

const AmenagementBudget = () => {
  const [annee, setAnnee] = useState('');
  const [compte, setCompte] = useState('');
  const [ligne, setLigne] = useState('');
  const [showDetails, setShowDetails] = useState(false);
  const [modifMoins, setModifMoins] = useState('');
  const [modifPlus, setModifPlus] = useState('');
  const [dateProgramme, setDateProgramme] = useState('');
  const [showConfirmation, setShowConfirmation] = useState(false);

  const [comptes, setComptes] = useState([]);
  const [lignesBudgetaires, setLignesBudgetaires] = useState([]);
  const [selectedLigneBudgetaire, setSelectedLigneBudgetaire] = useState('');

  useEffect(() => {
    // Charger les comptes disponibles depuis l'API
    fetch('http://localhost:8000/api/comptes/comptes/')
      .then((response) => response.json())
      .then((data) => setComptes(data))
      .catch((error) => console.error('Erreur lors du chargement des comptes:', error));
  }, []);

  const handleCompteChange = (e) => {
    const selectedCompte = e.target.value;
    setCompte(selectedCompte);
    // Charger les lignes budgétaires basées sur le compte et l'année sélectionnés
    if (selectedCompte && annee) {
      fetch(`http://localhost:8000/api/elaborationBudget/projet_par_compte/${selectedCompte}/${annee}/`)
        .then((response) => response.json())
        .then((data) => setLignesBudgetaires(data))
        .catch((error) => console.error('Erreur lors du chargement des lignes budgétaires:', error));
    } else {
      setLignesBudgetaires([]); // Réinitialiser si aucun compte ou année n'est sélectionné
    }
  };

  const handleOkClick = (e) => {
    e.preventDefault();
    if (e.target.closest('form').checkValidity()) {
      setShowDetails(true);
    } else {
      e.target.closest('form').reportValidity();
    }
  };

  const handleEnregistrer = (e) => {
    e.preventDefault();

  if (annee && compte && selectedLigneBudgetaire && modifMoins && modifPlus && dateProgramme) {
        const formData = {
          annee : annee,
          id_compte : compte,
          id_budget : selectedLigneBudgetaire,
          modifMoins,
          modifPlus,
          dateProgramme,
        };

      // Envoyer les données au backend
      fetch('http://localhost:8000/api/elaborationBudget/amenagement_budget/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })
        .then((response) => {
          if (response.ok) {
            setShowConfirmation(true);
          } else {
            console.error('Erreur lors de l\'enregistrement du budget.');
          }
        })
        .catch((error) => console.error('Erreur de connexion:', error));
    } else {
      e.target.closest('form').reportValidity();
    }
  };

  const handleLigneBudgetaireChange = (e) => {
    setSelectedLigneBudgetaire(e.target.value);
  };


  return (
    <div className="form-page">
      <Sidebar />
      <div className="main-content">
        <Header />
        <div className="form-container">
          <div className="div-h2">
            <h2>Aménagement du Budget</h2>
          </div>

          {/* Formulaire principal */}
          <form>
              <div className="form-group">
              <label htmlFor="annee-select">Année:</label>
              <input
                id="annee"
                type="number"
                value={annee}
                onChange={(e) => setAnnee(e.target.value)}
                required
                placeholder="Entrez l'année"
              />
            </div>

         {/* Sélection du compte */}
         <div className="form-group">
              <label htmlFor="compte-select">Compte:</label>
              <select
                id="compte-select"
                value={compte}
                onChange={handleCompteChange}
                required
              >
                <option value="">--Choisissez un compte--</option>
                {comptes
                  .filter((compte) => compte.id_type_compte === 1)
                  .map((compte) => (
                    <option key={compte.id_compte} value={compte.id_compte}>
                      {compte.code} - {compte.libelle}
                    </option>
                  ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="budget-select">Ligne Budgétaire:</label>
              <select
                id="budget-select"
                value={selectedLigneBudgetaire}
                onChange={handleLigneBudgetaireChange}
                required
              >
                <option value="">--Choisissez une ligne budgétaire--</option>
                {lignesBudgetaires.map((ligne) => (
                  <option key={ligne.id_budget} value={ligne.id_budget}>
                    {ligne.id_budget} - {ligne.code_programme} - {ligne.libelle} - {ligne.montant}
                  </option>
                ))}
              </select>
            </div>

            <div className="button-group">
              <button
                type="submit"
                onClick={handleOkClick}
                className="btn save-btn"
              >
                OK
              </button>
            </div>
          </form>

          {showDetails && (
            <form onSubmit={handleEnregistrer}>
              <div className="form-group">
                <label htmlFor="modifMoins">Modif Moins:</label>
                <input
                  type="number"
                  id="modifMoins"
                  value={modifMoins}
                  onChange={(e) => setModifMoins(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="modifPlus">Modif Plus:</label>
                <input
                  type="number"
                  id="modifPlus"
                  value={modifPlus}
                  onChange={(e) => setModifPlus(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="dateProgramme">Date Programme d'Emploi:</label>
                <input
                  type="date"
                  id="dateProgramme"
                  value={dateProgramme}
                  onChange={(e) => setDateProgramme(e.target.value)}
                  required
                />
              </div>

              <div className="button-group">
                <button type="submit" className="btn save-btn">
                  Enregistrer
                </button>
              </div>
            </form>
          )}

          {showConfirmation && (
            <ConfirmationOk
              message="Aménagemnt enregistré avec succès!"
              onClose={() => setShowConfirmation(false)}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default AmenagementBudget;
