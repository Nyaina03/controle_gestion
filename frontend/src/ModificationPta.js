import React, { useState } from 'react';
import Header from './Header';  // Assurez-vous que ce chemin est correct
import Sidebar from './Sidebar'; // Assurez-vous que ce chemin est correct
import './css/FormPage.css';  // Réutilisation du même style que SaisiePta
import ConfirmationOk from './ConfirmationOk';

function ModificationPta() {
  const [annee, setAnnee] = useState('');
  const [code_strategique, setCodeStrategique] = useState('');
  const [code_activite, setCodeActivite] = useState('');
  const [libelle, setLibelle] = useState('');
  const [montant, setMontant] = useState('');
  const [id_direction, setDirection] = useState('');
  const [directions, setDirections] = useState([]);
  const [code_programme , setCodeProgramme] = useState('');
  const [ref_dos, setRefDos] = useState('');
  const [ptaData, setPtaData] = useState(null);
  const [error, setError] = useState(null);
  const [showConfirmation, setShowConfirmation] = useState(false);


  
  const handleFetchDetails = (e) => {
    e.preventDefault();

    if ( !code_strategique || !code_activite) {
      setError('Tous les filtres doivent être remplis.');
      return;
    }

    setError(null);
    setPtaData(null);


    const url = `http://localhost:8000/api/pta/pta/${code_strategique}/${code_activite}/`;

    fetch(url)
      .then((response) => {
        if (!response.ok) {
          return response.json().then((errData) => {
            if (response.status === 404) {
              throw new Error('Aucune PTA correspondante trouvée.');
            }
            throw new Error(errData.error || 'Erreur lors de la récupération des données.');
          });
        }
        return response.json();
      })
      .then((data) => {
        console.log('Données reçues:', data);  // Ajoutez cette ligne pour inspecter les données
        if (data.length === 0) {
          setError('Aucune PTA correspondante trouvée.');
        } else {
          setPtaData(data[0]);
          
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

  const handleSavePta = (event) => {
    event.preventDefault();
    fetch(`http://localhost:8000/api/pta/update_pta/${ptaData.id_pta}/`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(ptaData),
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Erreur lors de la modification');
      }
      return response.json();
    })
    .then(updatedPta => {
      setPtaData(ptaData.map(t => (t.id_pta === updatedPta.id_pta ? updatedPta : t)));
      setShowConfirmation(true);
    })
    .catch(error => console.error('Erreur :', error));
};





  return (
    <div className="form-page">
      <Header />
      <div className="main-content">
        <Sidebar />
        <div className="form-container">
          <div className="div-h2">
            <h2>Modification du PTA</h2>
          </div>
          <form onSubmit={handleFetchDetails} className="saisie-pta-form">
            <div className="form-group">
              <label>Choix Code Stratégique</label>
              <input
                type="text"
                id="code_strategique"
                value={code_strategique}
                onChange={(e) => setCodeStrategique(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label>Code Activité</label>
              <input
                type="text"
                id="code_activite"
                value={code_activite}
                onChange={(e) => setCodeActivite(e.target.value)}
                required
              />
            </div>

            <div className="button-group">
              <button type="submit" className="btn-submit">OK</button>
            </div>
          </form>

                    {/* Afficher les détails */}
        {error && <p className="error-message">{error}</p>}
          {ptaData && (
            <form onSubmit={handleSavePta} className="saisie-pta-form">
              <div className="form-group">
                
                <input 
                  type="text" 
                  value={ptaData.id_pta} 
                  onChange={(e) => setPtaData({...ptaData, id_pta: e.target.value})} 
                  hidden
                />
              </div>

              <div className="form-group">
                <label>Année</label>
                <input 
                  type="number" 
                  value={ptaData.annee} 
                  onChange={(e) => setPtaData({...ptaData, annee: e.target.value})} 
                  required 
                />
              </div>

              <div className="form-group">
                <label>Libellé</label>
                <input 
                  type="text" 
                  value={ptaData.libelle} 
                  onChange={(e) => setPtaData({...ptaData, libelle: e.target.value})}  
                  required 
                />
              </div>

              <div className="form-group">
                <label>Montant</label>
                <input 
                  type="number" 
                  value={ptaData.montant} 
                  onChange={(e) => setPtaData({...ptaData, montant: e.target.value})} 
                  required 
                />
              </div>

              <div className="form-group">
                <label>Direction</label>
                <input 
                  type="text" 
                  value={ptaData.id_direction} 
                  onChange={(e) => setPtaData({...ptaData, id_direction: e.target.value})} 
                  required 
                />
              </div>

              <div className="form-group">
                <label>Code Programme</label>
                <input 
                  type="text" 
                  value={ptaData.code_programme} 
                  onChange={(e) => setPtaData({...ptaData, code_programme: e.target.value})} 
                  required 
                />
              </div>

              <div className="form-group">
                <label>Réf. DOS</label>
                <input 
                  type="text"  
                  value={ptaData.ref_dos} 
                  onChange={(e) => setPtaData({...ptaData, ref_dos: e.target.value})} 
                  required 
                />
              </div>

              <div className="button-group">
              <button type="submit" className="btn-submit">Enregistrer</button>
            </div>
            </form>
            
          )}
           {error && <p className="error-message">{error}</p>}
          {showConfirmation && <ConfirmationOk message="Modification ajouté avec succès!" onClose={handleOk} />}
        </div>
      </div>
    </div>
  );
}

export default ModificationPta;
