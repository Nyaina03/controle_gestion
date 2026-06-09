import React, { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";
import "./css/FormPage.css"; // Réutilisation des styles existants

function MsesTransportees() {
  const [choixAnnee, setChoixAnnee] = useState("");
  const [typeStat, setTypeStat] = useState("");
  const [showTable, setShowTable] = useState(false);
  const [data, setData] = useState([]);
  const [localite, setLocalite] = useState('');
  const [localites, setLocalites] = useState([]);
  const [noData, setNoData] = useState(false); // Ajout de l'état noData

  useEffect(() => {
    // Charger les localités
    fetch('http://localhost:8000/api/localites/villes/')
      .then(response => response.json())
      .then(data => setLocalites(data))
      .catch(error => console.error('Erreur lors du chargement des localités:', error));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (choixAnnee && localite) {
      setShowTable(true); // Afficher le tableau après avoir soumis le formulaire
      setData([]); // Réinitialiser les données avant de faire la requête API
      setNoData(false); // Réinitialiser l'état noData à false avant la requête

      // Envoi de la requête API avec "MSES" pour typeStat
      try {
        const response = await fetch(
          `http://localhost:8000/api/statistiqueBrutes/mses_transportees/?annee=${choixAnnee}&id_ville=${localite}&type_stat=MSES`
        );
        const result = await response.json();
        console.log(result); // Afficher les données récupérées

        if (Array.isArray(result) && result.length > 0) {
          setData(result); // Mettre à jour les données
        } else {
          console.error("La réponse n'est pas un tableau valide ou est vide", result);
          setNoData(true); // Mettre à jour l'état noData à true
          setData([]); // Réinitialiser les données
        }
      } catch (error) {
        console.error("Erreur lors de la récupération des données", error);
      }
    }
  };

  return (
    <div className="dashboard-page">
      <Sidebar />
      <div className="main-content">
        <Header />
        <div className="form-container">
          <h2 className="div-h2">MSES Transportées</h2>

          {/* Formulaire */}
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="choixAnnee">Choix Année :</label>
              <input
                type="number"
                id="choixAnnee"
                value={choixAnnee}
                onChange={(e) => setChoixAnnee(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="localite">Localité :</label>
              <select
                id="localite-select"
                value={localite}
                onChange={(e) => setLocalite(e.target.value)}
                required
              >
                <option value="">--Choisissez une localité--</option>
                {localites.map(localite => (
                  <option key={localite.id_ville} value={localite.id_ville}>
                    {localite.nom_ville}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="typeStat">Choix Type Stat Marchandises :</label>
              <input
                id="typeStat"
                type="text"
                value="MSES"
                readOnly
              />
            </div>

            <div className="button-group">
              <button type="submit" className="btn save-btn">
                OK
              </button>
            </div>
          </form>

          {/* Affichage du tableau après soumission */}
          {showTable && Array.isArray(data) && data.length > 0 && (
            <table className="tiers-table">
              <thead>
                <tr>
                  <th>Date Operation</th>
                  <th>Type Operation</th>
                  <th>Navire</th>
                  <th>Provenance/Destination</th>
                  <th>Nombre</th>
                  <th>Code Stat</th>
                </tr>
              </thead>
              <tbody>
                {data.map((row, index) => (
                  <tr key={index}>
                    <td>{row.date_operation}</td>
                    <td>{row.type_operation}</td>
                    <td>{row.navire}</td>
                    <td>{row.provenance_destination}</td>
                    <td>{row.quantite}</td>
                    <td>{row.code_stat}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {/* Afficher un message si aucune donnée n'est retournée */}
          {noData && (
            <p style={{ color: 'red' }}>Aucune donnée disponible pour ces critères.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default MsesTransportees;
