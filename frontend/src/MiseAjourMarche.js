import React, { useState, useEffect } from 'react';
import Header from './Header';  // Importer le Header
import Sidebar from './Sidebar'; // Importer le Sidebar
import './css/FormPage.css';  // Importer les styles CSS si nécessaire

const MiseAjourMarche = () => {
  const [annee, setAnnee] = useState('');
  const [num_marche, setNumMarche] = useState('');
  const [num_marches, setNumarches] = useState([]);
  const [id_compte, setComptes] = useState('');
  const [id_financement, setFinancement] = useState('');
  const [id_type_depense, aetDepense]= useState('');
  const [marcheData, setMarcheData] = useState('');
  const [error, setError] = useState(null);
  const [showConfirmation, setShowConfirmation] = useState(false);

  useEffect(() => {
    // Charger les marchés
    fetch('http://localhost:8000/api/marches/liste_marches/')
      .then(response => response.json())
      .then(data => setNumarches(data))
      .catch(error => console.error('Erreur lors du chargement des marchés:', error));
  }, []);

  const handleFetchDetails = (e) => {
    e.preventDefault();

    if (!annee || !num_marche) {
      setError('Tous les filtres doivent être remplis.');
      return;
    }

    setError(null);
    setMarcheData(null);
  

    const url = `http://localhost:8000/api/marches/marches/${annee}/${num_marche}`;

    fetch(url)
      .then((response) => {
        if (!response.ok) {
          return response.json().then((errData) => {
            if (response.status === 404) {
              throw new Error('Aucun marché correspondant trouvé.');
            }
            throw new Error(errData.error || 'Erreur lors de la récupération des données.');
          });
        }
        return response.json();
      })
      .then((data) => {
        console.log('Données reçues:', data);
        if (data.length === 0) {
          setError('Aucun marché correspondant trouvé.');
        } else {
          setMarcheData(data[0]);
        }
      })
      .catch((err) => {
        console.error('Erreur:', err);
        setError(err.message);
      });
  };

  const handleSaveMarche = (event) => {
    event.preventDefault();
    fetch(`http://localhost:8000/api/marches/update_marche/${marcheData.id_marche}/`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(marcheData),
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Erreur lors de la modification');
      }
      return response.json();
    })
    .then(updatedMarche => {
      setMarcheData(marcheData.map(t => (t.id_marche === updatedMarche.id_marche ? updatedMarche : t)));
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
          <div className="div-h2">
            <h2>Mise à Jour du Marché</h2>
          </div>
          <form onSubmit={handleFetchDetails}>
            {/* Choix Année */}
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

            {/* Choix Numéro de Marché */}
            <div className="form-group">
              <label htmlFor="numMarche">Numéro de Marché:</label>
              <select
                id="num-marche-select"
                value={num_marche}
                onChange={(e) => setNumMarche(e.target.value)}
                required
              >
                <option value="">--Choisissez un marché--</option>
                {num_marches.map((marche) => (
                  <option key={marche.id_marche} value={marche.num_marche}>
                    {marche.num_marche}
                  </option>
                ))}
              </select>
            </div>

            {/* Bouton OK */}
            <div className="button-group">
              <button type="submit" className="btn save-btn">OK</button>
            </div>

            {/* Affichage des erreurs */}
            {error && <p className="error-message">{error}</p>}

            {/* Affichage des détails du marché */}
            {marcheData && (
              <>
            <div className="form-group">
                  <input
                    type="text"
                    value={marcheData.id_marche}
                    onChange={(e) => setMarcheData({ ...marcheData, id_marche: e.target.value})}
                    hidden
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="compte">Compte:</label>
                  <input
                    type="text"
                    value={marcheData.compte.code}
                    onChange={(e) => setMarcheData({ ...marcheData, 'compte.id_compte': e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="num_marche">Numéro du Marché:</label>
                  <input
                    type="text"
                    value={marcheData.num_marche}
                    onChange={(e) => setMarcheData({ ...marcheData, num_marche: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="financement">Financement:</label>
                  <input
                    type="text"
                    id="financement"
                    value={marcheData.financement.financement}
                    onChange={(e) => setFinancement({ ...marcheData, 'financement.id_financement': e.target.value })}
                    required
                  />
                </div>

    

                <div className="form-group">
                  <label htmlFor="type_depense">Type Dénse:</label>
                  <input
                    type="text"
                    id="type_depense"
                    value={marcheData.type_depense.type_depense}
                    onChange={(e) => setMarcheData({ ...marcheData, 'type_depense.id_type_depense': e.target.value })}
                    required
                  />
                </div>


                <div className="form-group">
                  <label htmlFor="objet_marche">Objet du Marché:</label>
                  <input
                    type="text"
                    id="objet_marche"
                    value={marcheData.objet_marche}
                    onChange={(e) => setMarcheData({ ...marcheData, objet_marche: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="attributaire">Attributaire:</label>
                  <input
                    type="text"
                    id="attributaire"
                    value={marcheData.attributaire}
                    onChange={(e) => setMarcheData({ ...marcheData, attributaire: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="montant_ht">Montant HT:</label>
                  <input
                    type="number"
                    id="montant_ht"
                    value={marcheData.montant_ht}
                    onChange={(e) => setMarcheData({ ...marcheData, montant_ht: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="tva">TVA:</label>
                  <input
                    type="number"
                    id="tva"
                    value={marcheData.tva}
                    onChange={(e) => setMarcheData({ ...marcheData, tva: e.target.value })}
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="num_os">Num Os:</label>
                  <input
                    type="text"
                    id="num_os"
                    value={marcheData.num_os}
                    onChange={(e) => setMarcheData({ ...marcheData, num_os: e.target.value })}
                    required
                  />
                </div>

                             
                <div className="form-group">
                  <label htmlFor="date_os">Date Os:</label>
                  <input
                    type="text"
                    id="date_os"
                    value={marcheData.date_os}
                    onChange={(e) => setMarcheData({ ...marcheData, date_os: e.target.value })}
                    required
                  />
                </div>

                                             
                <div className="form-group">
                  <label htmlFor="num_sur_registre">Num sur Registre:</label>
                  <input
                    type="text"
                    id="num_sur_registre"
                    value={marcheData.num_sur_registre}
                    onChange={(e) => setMarcheData({ ...marcheData, num_sur_registre: e.target.value })}
                    required
                  />
                </div>



                <div className="form-group">
                  <label htmlFor="delai_en_jour">Délai en Jour:</label>
                  <input
                    type="number"
                    id="delai_en_jour"
                    value={marcheData.delai_en_jour}
                    onChange={(e) => setMarcheData({ ...marcheData, delai_en_jour: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="date_signature">Date de Signature:</label>
                  <input
                    type="date"
                    id="date_signature"
                    value={marcheData.date_signature}
                    onChange={(e) => setMarcheData({ ...marcheData, date_signature: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="date_notification">Date de Notification:</label>
                  <input
                    type="date"
                    id="date_notification"
                    value={marcheData.date_notification}
                    onChange={(e) => setMarcheData({ ...marcheData, date_notification: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="observation">Observation:</label>
                  <input
                    id="observation"
                    value={marcheData.observation}
                    onChange={(e) => setMarcheData({ ...marcheData, observation: e.target.value })}
                    required
                  />
                </div>

                {/* Bouton Enregistrer */}
              <div className="button-group">
                <button type="submit" onClick={handleSaveMarche} className="btn save-btn">Enregistrer</button>
              </div>
              </>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default MiseAjourMarche;
