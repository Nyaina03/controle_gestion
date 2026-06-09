import React, { useState, useEffect } from 'react';
import './css/FormPage.css';
import Sidebar from './Sidebar';
import Header from './Header';
import ConfirmationOk from './ConfirmationOk';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';

function ModificationSuppressionBudget() {
  const [annee, setAnnee] = useState('');
  const [compte, setCompte] = useState('');
  const [projet, setProjet] = useState('');

  const [comptes, setComptes] = useState([]);
  const [numMarche, setNumMarche] = useState('');
  const [responsable, setResponsable] = useState('');
  const [tauxAmortissement, setTauxAmortissement] = useState('');
  const [avance, setAvance] = useState('');
  const [rembGarantie, setRembGarantie] = useState('');
  const [lignesBudgetaires, setLignesBudgetaires] = useState([]);
  const [selectedLigneBudgetaire, setSelectedLigneBudgetaire] = useState('');

  const [showConfirmation, setShowConfirmation] = useState(false);
  const [error, setError] = useState(null);

  const [showDetails, setShowDetails] = useState(false);
  const [attachments, setAttachments] = useState([null, null, null]); // Liste des attachements
  
  const handleOk = () => {
    setShowConfirmation(false); // Fermer la fenêtre de confirmation
  };

  const handleCompteChange = (e) => {
    const selectedCompte = e.target.value;
    setCompte(selectedCompte);
  
    if (selectedCompte && annee) { // Vérifie que le compte et l'année sont sélectionnés
      fetch(`http://localhost:8000/api/elaborationBudget/projet_par_compte/${selectedCompte}/${annee}/`)
        .then((response) => response.json())
        .then((data) => setLignesBudgetaires(data))
        .catch((error) => console.error('Erreur lors du chargement des lignes budgétaires:', error));
    } else {
      setLignesBudgetaires([]); // Réinitialiser si aucun compte ou année n'est sélectionné
    }
  };

  const handleLigneBudgetaireChange = (e) => {
    setSelectedLigneBudgetaire(e.target.value);
  };

  const projets = [
    { code: 'Projet A', name: 'Projet A' },
    { code: 'Projet B', name: 'Projet B' },
    { code: 'Projet C', name: 'Projet C' },
  ];

  const handleOKClick = (e) => {
    e.preventDefault();
    const form = e.target.form;

    if (form.checkValidity()) {
      setShowDetails(true);
    } else {
      form.reportValidity(); // Affiche les erreurs si le formulaire est invalide
    }
  };

  const handleAddAttachment = () => {
    // Ajoute un champ d'attachement supplémentaire
    setAttachments([...attachments, null]); // Ajouter un champ vide pour le nouvel attachement
  };

  const handleAttachmentChange = (index, value) => {
    const updatedAttachments = [...attachments];
    updatedAttachments[index] = value;
    setAttachments(updatedAttachments);
  };

  useEffect(() => {
    fetch('http://localhost:8000/api/comptes/comptes/')
      .then((response) => response.json())
      .then((data) => setComptes(data))
      .catch((error) => console.error('Erreur lors du chargement des comptes:', error));
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
  
    if (annee && compte && selectedLigneBudgetaire && numMarche && responsable && tauxAmortissement && avance && rembGarantie) {
      const formData = {
        annee_modification: annee,
        id_compte: compte,
        projet,
        id_budget: selectedLigneBudgetaire,
        num_marche: numMarche,
        responsable,
        taux_amortissement: tauxAmortissement,
        avance,
        remb_garantie: rembGarantie,
        ...attachments.reduce((acc, attachment, idx) => {
          acc[`attach${idx + 1}`] = attachment || null;
          return acc;
        }, {}),
      };
  
      fetch('http://localhost:8000/api/elaborationBudget/ajouter_budget_attachement/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
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
    } else {
      setError('Tous les champs requis doivent être remplis');
    }
  };

  return (
    <div className="form-page">
      <Sidebar />
      <div className="main-content">
        <Header />
        <div className="form-container">
          <div className="div-h2">
            <h2>Modification / Suppression du Budget</h2>
          </div>
          <form onSubmit={handleSubmit} className="form">
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

            {/* Ligne Budgétaire */}
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
              <button type="submit" onClick={handleOKClick} className="btn save-btn">
                OK
              </button>
            </div>

            {showDetails && (
              <>
                <DetailsForm
                  fields={[
                    { label: 'Numéro du Marché', value: numMarche, setter: setNumMarche },
                    { label: 'Responsable', value: responsable, setter: setResponsable },
                    { label: "Taux d'Amortissement (GAC)", value: tauxAmortissement, setter: setTauxAmortissement },
                    { label: 'Avance', value: avance, setter: setAvance },
                    { label: 'Remboursement Garantie', value: rembGarantie, setter: setRembGarantie },
                  ]}
                />

                {/* Champs pour attachements */}
                {attachments.map((attachment, idx) => (
                  <div className="form-group" key={idx}>
                    <label>{`ATTACH${idx + 1} :`}</label>
                    <input
                      type="number"
                      value={attachment}
                      onChange={(e) => handleAttachmentChange(idx, e.target.value)}
                      placeholder={`Entrez l'attachement ${idx + 1}`}
                    />
                  </div>
                ))}

                  <button type="button" onClick={handleAddAttachment} className="add-button">
                      <FontAwesomeIcon icon={faPlus} /> Ajouter Attachement
                  </button>

                <div className="button-group">
                  <button type="submit" className="btn save-btn">Enregistrer</button>
                </div>
              </>
            )}
          </form>

          {error && <p className="error-message">{error}</p>}
          {showConfirmation && <ConfirmationOk message="Budget modifié!" onClose={handleOk} />}
        </div>
      </div>
    </div>
  );
}

const DetailsForm = ({ fields }) => (
  <>
    {fields.map(({ label, value, setter }, idx) => (
      <div className="form-group" key={idx}>
        <label>{label} :</label>
        <input type="text" value={value} onChange={(e) => setter(e.target.value)} required />
      </div>
    ))}
  </>
);

export default ModificationSuppressionBudget;
