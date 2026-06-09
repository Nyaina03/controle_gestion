import React, { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";
import "./css/FormPage.css"; // Réutilisation des styles existants

function AnalyseDesEcartsStat() {
  const [naviresVas, setNaviresVas] = useState(""); // Navires opérationnels/VAS sélectionné
  const [choixAnnee, setChoixAnnee] = useState("");
  const [showTable, setShowTable] = useState(false);
  const [navire, setNavire] = useState('');
  const [navires, setNavires] = useState([]);
  const [data, setData] = useState([]); // Ajouter un état pour les données du tableau

  // Charger la liste des navires lors du montage du composant
  useEffect(() => {
    fetch('http://localhost:8000/api/statistiqueBrutes/navires/')
      .then(response => response.json())
      .then(data => setNavires(data))
      .catch(error => console.error('Erreur lors du chargement des navires:', error));
  }, []);

  // Fonction de soumission du formulaire
  const handleSubmit = (e) => {
    e.preventDefault();
    if (navire && choixAnnee) {
      setShowTable(true); // Afficher le tableau après soumission

      // Appel de l'API avec les paramètres navire et annee
      fetch(`http://localhost:8000/api/statistiqueBrutes/navires_ecarts/?navire=${navire}&annee=${choixAnnee}`)
        .then(response => response.json())
        .then(data => {
          setData(data); // Mettre à jour les données avec celles renvoyées par l'API
          console.log("Données reçues :", data); // Afficher les données dans la console
        })
        .catch(error => {
          console.error('Erreur lors de la récupération des données:', error);
          setShowTable(false); // Masquer le tableau en cas d'erreur
        });
    }
  };

  return (
    <div className="dashboard-page">
      <Sidebar />
      <div className="main-content">
        <Header />
        <div className="form-container">
          <h2 className="div-h2">Analyse des Ecarts Stat</h2>

          {/* Formulaire */}
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="naviresVas">Navires opérationnels/VAS :</label>
              <select
                id="navire-select"
                value={navire}
                onChange={(e) => setNavire(e.target.value)}
                required
              >
                <option value="">--Choisissez navire--</option>
                {navires.map(navire => (
                  <option key={navire.id_navire} value={navire.navire}>
                    {navire.navire}
                  </option>
                ))}
              </select>
            </div>

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

            <div className="button-group">
              <button type="submit" className="btn save-btn">
                OK
              </button>
            </div>
          </form>

          {/* Affichage du tableau après soumission */}
          {showTable && (
            <table className="tiers-table">
              <thead>
                <tr>
                  <th>Nom Navire</th>
                  <th>Nb d'Escales</th>
                  <th>Date Fact VAS</th>
                </tr>
              </thead>
              <tbody>
                {data.map((row, index) => (
                  <tr key={index}>
                    <td>{row.navire}</td>
                    <td>{row.nombre_escales}</td>
                    <td>{row.date_operation}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}

export default AnalyseDesEcartsStat;
