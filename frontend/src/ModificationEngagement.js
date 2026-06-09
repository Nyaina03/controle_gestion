import React, { useState, useEffect } from 'react';
import Header from './Header';
import Sidebar from './Sidebar';
import './css/FormPage.css';
import ConfirmationOk from './ConfirmationOk';

const ModificationEngagement = () => {
  const [annee, setAnnee] = useState('');
  const [num_engagement, setNumEng] = useState('');
  const [code_programme, setCodeProgramme] = useState([]);
  const [code_tiers, setCodeTiers] = useState('');
  const [id_compte, setCompte] = useState('');
  const [objet, setObjet] = useState('');
  const [date_eng, setDateEng] = useState('');
  const [grande_rubrique, setGrandeRubrique] = useState('');
  const [montant, setMontant] = useState('');
  const [etat, setEtat] = useState('');
  const [id_type_operation, setIdTypeOperation] = useState([]); 
  const [selectedTypeOperation, setSelectedTypeOperation] = useState('');
  const [comptes, setComptes] = useState([]);
  const [error, setError] = useState(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [engagementData, setEngagementData] = useState(null);

  useEffect(() => {
    // Charger les types d'opération
    fetch('http://localhost:8000/api/typeOperation/type_operations/')
      .then(response => response.json())
      .then(data => {
        console.log('Types d\'opération:', data);
        setIdTypeOperation(data); 
      })
      .catch(err => console.error('Erreur lors du chargement des types d’opération:', err));
  }, []);

  const handleFetchDetails = (e) => {
    e.preventDefault();

    if (!selectedTypeOperation || !annee || !num_engagement) {
      setError('Tous les filtres doivent être remplis.');
      return;
    }

    setError(null);
    setEngagementData(null);
    const operationId = parseInt(selectedTypeOperation, 10);

    const url = `http://localhost:8000/api/realisationBudget/details_siig/${operationId}/${annee}/${num_engagement}/`;

    fetch(url)
      .then((response) => {
        if (!response.ok) {
          return response.json().then((errData) => {
            if (response.status === 404) {
              throw new Error('Aucune dépense correspondante trouvée.');
            }
            throw new Error(errData.error || 'Erreur lors de la récupération des données.');
          });
        }
        return response.json();
      })
      .then((data) => {
        console.log('Données reçues:', data);  // Ajoutez cette ligne pour inspecter les données
        if (data.length === 0) {
          setError('Aucune dépense correspondante trouvée.');
        } else {
          setEngagementData(data[0]);
          
        }
      })
      
      .catch((err) => {
        console.error('Erreur:', err);
        setError(err.message);
      });
  };

  const handleOk = () => {
    setShowConfirmation(false); // Fermer la fenêtre de confirmation
  };



  const handleSaveEngagement = (event) => {
    event.preventDefault();
    fetch(`http://localhost:8000/api/realisationBudget/update_depense/${engagementData.id_depense_siig}/`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(engagementData),
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Erreur lors de la modification');
      }
      return response.json();
    })
    .then(updatedDepense => {
      setEngagementData(engagementData.map(t => (t.id_depense_siig === updatedDepense.id_depense_siig ? updatedDepense : t)));
      setShowConfirmation(true);
    })
    .catch(error => console.error('Erreur :', error));
};


  

  return (
    <div className="form-page">
      <Sidebar />
      <div className="main-content">
        <Header />
        <div className="form-container">
          <h2 className="div-h2">Modification de l'Engagement ou Suppression</h2>
          <form onSubmit={handleFetchDetails}>
            {/* Type d'opération */}
            <div className="form-group">
                <label htmlFor="type-operation-select">Type Opération:</label>
                <select
                  id="type-operation-select"
                  value={selectedTypeOperation}
                  onChange={(e) => setSelectedTypeOperation(e.target.value)}  // This should handle the ID correctly
                  required
                >
                  <option value="">--Choisissez un type d'opération--</option>
                  {id_type_operation.map((type) => (
                    <option key={type.id_type_operation} value={type.id_type_operation}>
                      {type.type_operation}
                    </option>
                  ))}
                </select>

              </div>

            {/* Année */}
            <div className="form-group">
              <label htmlFor="annee">Année:</label>
              <input
                type="number"
                id="annee"
                value={annee}
                onChange={(e) => setAnnee(e.target.value)}
                required
              />
            </div>

            {/* Numéro d'engagement */}
            <div className="form-group">
              <label htmlFor="num-engagement">Numéro d'engagement:</label>
              <input
                type="text"
                id="num-engagement"
                value={num_engagement}
                onChange={(e) => setNumEng(e.target.value)}
                required
              />
            </div>

            <div className="button-group">
              <button type="submit" className="btn save-btn">OK</button>
            </div>
          </form>

          {/* Afficher les détails */}
          {error && <p className="error-message">{error}</p>}
          {engagementData && (
            <div className="details-section">
              <h3>Détails de l'engagement :</h3>

              {/* id_siig*/}
              <div className="form-group">
               
                <input 
                  type="text" 
                  value={engagementData.id_depense_siig} 
                  onChange={(e) => setEngagementData({...engagementData, id_depense_siig: e.target.value})} 
                  hidden
                />
              </div>
              
              {/* Code Programme */}
              <div className="form-group">
                <label>Code Programme:</label>
                <input 
                  type="text" 
                  value={engagementData.code_programme} 
                  onChange={(e) => setEngagementData({...engagementData, code_programme: e.target.value})} 
                  required 
                />
              </div>
              
              {/* Code Tiers */}
              <div className="form-group">
                <label>Code Tiers:</label>
                <input 
                  type="text" 
                  value={engagementData.code_tiers} 
                  onChange={(e) => setEngagementData({...engagementData, code_tiers: e.target.value})} 
                  required 
                />
              </div>
              
              {/* Compte */}
              <div className="form-group">
                <label>Compte:</label>
                <input 
                  type="text" 
                  value={engagementData.code} 
                  onChange={(e) => setEngagementData({...engagementData, code: e.target.value})} 
                  required 
                />
              </div>
              
              {/* Objet */}
              <div className="form-group">
                <label>Objet:</label>
                <input 
                  type="text" 
                  value={engagementData.objet} 
                  onChange={(e) => setEngagementData({...engagementData, objet: e.target.value})} 
                  required 
                />
              </div>
              
              {/* Date Engagement */}
              <div className="form-group">
                <label>Date Engagement:</label>
                <input 
                  type="date" 
                  value={engagementData.date_eng} 
                  onChange={(e) => setEngagementData({...engagementData, date_eng: e.target.value})} 
                  required 
                />
              </div>
              
              {/* Grande Rubrique */}
              <div className="form-group">
                <label>Grande Rubrique:</label>
                <input 
                  type="text" 
                  value={engagementData.grande_rubrique} 
                  onChange={(e) => setEngagementData({...engagementData, grande_rubrique: e.target.value})} 
                  required 
                />
              </div>
              
              {/* Montant */}
              <div className="form-group">
                <label>Montant:</label>
                <input 
                  type="text" 
                  value={engagementData.montant} 
                  onChange={(e) => setEngagementData({...engagementData, montant: e.target.value})} 
                  required 
                />
              </div>
              
              {/* État */}
              <div className="form-group">
                <label>État:</label>
                <input 
                  type="text" 
                  value={engagementData.etat} 
                  onChange={(e) => setEngagementData({...engagementData, etat: e.target.value})} 
                />
              </div>

              {/* Bouton Enregistrer */}
              <div className="button-group">
                <button type="submit" onClick={handleSaveEngagement} className="btn save-btn">Enregistrer</button>
              </div>
            </div>
          )}

       
        </div>
      </div>
    </div>
  );
};

export default ModificationEngagement;
