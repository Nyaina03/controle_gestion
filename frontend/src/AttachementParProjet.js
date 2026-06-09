import React, { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";
import "./css/EtatsAEtablir.css"; // Réutilisation des styles existants pour les tableaux
import "./css/FormPage.css"; // Comme classe de CSS

function AttachementParProjet() {
  const [compte, setCompte] = useState("");
  const [annee, setAnnee] = useState("");
  const [showTable, setShowTable] = useState(false);
  const [comptes, setComptes] = useState([]);
  const [attachements, setAttachements] = useState([]); // Ajouter un état pour stocker les données récupérées
  const [loading, setLoading] = useState(false); // Ajouter un état pour la gestion du chargement
  const [error, setError] = useState(null);

  useEffect(() => {
    // Charger les comptes
    fetch("http://localhost:8000/api/comptes/comptes/")
      .then((response) => response.json())
      .then((data) => setComptes(data))
      .catch((error) => console.error("Erreur lors du chargement des comptes:", error));
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setShowTable(true); // Toujours afficher le tableau après soumission
  
    fetch(`http://localhost:8000/api/marches/attachement_par_projet/${compte}/${annee}/`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Erreur lors de la récupération des données");
        }
        return response.json();
      })
      .then((data) => {
        setAttachements(data);
        setLoading(false);
      })
      .catch((error) => {
        setError(error.message);
        setLoading(false);
      });
  };
  

  return (
    <div className="dashboard-page">
      <Sidebar />
      <div className="main-content">
        <Header />
        <div className="form-container">
          <h2 className="div-h2">Attachement par Projet</h2>

          {/* Formulaire */}
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="compte-select">Compte:</label>
              <select
                id="compte-select"
                value={compte}
                onChange={(e) => setCompte(e.target.value)}
                required
              >
                <option value="">--Choisissez un compte--</option>
                {comptes.map((compte) => (
                  <option key={compte.id_compte} value={compte.id_compte}>
                    {compte.code} - {compte.libelle}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="annee">Choix de l'année :</label>
              <input
                id="annee"
                type="number"
                value={annee}
                onChange={(e) => setAnnee(e.target.value)}
                required // Validation automatique du navigateur
              />
            </div>

            <div className="button-group">
              <button type="submit" className="btn save-btn">
                OK
              </button>
            </div>
          </form>

          {/* Affiche le tableau */}
          {showTable && (
  <table className="tiers-table">
    <thead>
      <tr>
        <th>Libellé</th>
        <th>Montant</th>
        <th>N° Marché</th>
        <th>Avance</th>
        <th>Remb. Garantie</th>
        {[...Array(20)].map((_, i) => (
          <th key={i}>ATT{i + 1}</th>
        ))}
      </tr>
    </thead>
    <tbody>
      {loading ? (
        <tr>
          <td colSpan="25" style={{ textAlign: "center" }}>
            Chargement des données...
          </td>
        </tr>
      ) : error ? (
        <tr>
          <td colSpan="25" style={{ textAlign: "center", color: "red" }}>
            {error}
          </td>
        </tr>
      ) : attachements.length > 0 ? (
        attachements.map((projet, index) => (
          <tr key={index}>
            <td>{projet.libelle}</td>
            <td>{projet.montant}</td>
            <td>{projet.numMarche}</td>
            <td>{projet.avance}</td>
            <td>{projet.rembGarantie}</td>
            {[...Array(20)].map((_, i) => (
              <td key={i}>{projet[`att${i + 1}`]}</td>
            ))}
          </tr>
        ))
      ) : (
        <tr>
          <td colSpan="25" style={{ textAlign: "center" }}>
            Aucune donnée disponible pour les critères spécifiés.
          </td>
        </tr>
      )}
    </tbody>
  </table>
)}

        </div>
      </div>
    </div>
  );
}

export default AttachementParProjet;
