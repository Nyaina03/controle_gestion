import React, { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";
import "./css/FormPage.css"; // Réutilisation des styles existants

function PassgerStat() {
  const [choixAnnee, setChoixAnnee] = useState("");
  const [choixCompte, setChoixCompte] = useState("");
  const [codeStat, setCodeStat] = useState("");
  const [libelleStat, setLibelleStat] = useState("");
  const [marchandises, setMarchandises] = useState([]);
  const [showTable, setShowTable] = useState(false);
  const [compte, setCompte] = useState("");
  const [comptes, setComptes] = useState([]);
  const [stat, setStat] = useState("");
  const [stats, setStats] = useState([]);
  const [noDataMessage, setNoDataMessage] = useState(""); // Message d'absence de données

  useEffect(() => {
    fetch("http://localhost:8000/api/comptes/comptes/")
      .then((response) => response.json())
      .then((data) => setComptes(data))
      .catch((error) => console.error("Erreur lors du chargement des comptes:", error));

    fetch("http://localhost:8000/api/statistiqueBrutes/stat/")
      .then((response) => response.json())
      .then((data) => setStats(data))
      .catch((error) => console.error("Erreur lors du chargement des stats:", error));
  }, []);

  // Fonction pour appeler l'API et récupérer les marchandises
  const fetchMarchandises = () => {
    const url = `http://localhost:8000/api/statistiqueBrutes/gestion_passagers/?id_compte=${choixCompte}&code_stat=${codeStat}&type_stat=${libelleStat}`;

    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        if (data.length > 0) {
          setMarchandises(data); // Met à jour l'état avec les données
          setNoDataMessage(""); // Réinitialise le message
          setShowTable(true); // Affiche le tableau
        } else {
          setMarchandises([]); // Réinitialise les données
          setNoDataMessage("Aucune donnée ne correspond aux critères."); // Définit le message
          setShowTable(false); // Cache le tableau
        }
      })
      .catch((error) => {
        console.error("Erreur lors de la récupération des données :", error);
        setNoDataMessage("Erreur lors de la récupération des données."); // Message d'erreur
        setShowTable(false);
      });
  };

  // Fonction de soumission du formulaire
  const handleSubmit = (e) => {
    e.preventDefault();
    if ( choixCompte && codeStat && libelleStat) {
      fetchMarchandises(); // Appelle l'API après soumission
    } else {
      alert("Veuillez remplir tous les champs avant de soumettre.");
    }
  };

  return (
    <div className="dashboard-page">
      <Sidebar />
      <div className="main-content">
        <Header />
        <div className="form-container">
          <h2 className="div-h2">Gestion des Marchandises</h2>

          {/* Formulaire */}
          <form onSubmit={handleSubmit}>

            <div className="form-group">
              <label htmlFor="choixCompte">Choix Compte :</label>
              <select
                id="compte-select"
                value={choixCompte}
                onChange={(e) => setChoixCompte(e.target.value)}
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
              <label htmlFor="codeStat">Code Stat :</label>
              <select
                id="stat-select"
                value={codeStat}
                onChange={(e) => setCodeStat(e.target.value)}
                required
              >
                <option value="">--Choisissez code stat--</option>
                {stats.map((stat) => (
                  <option key={stat.id_stat} value={stat.code_stat}>
                    {stat.code_stat}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="libelleStat">Libelle Stat :</label>
              <select
                id="libelleStat"
                value={libelleStat}
                onChange={(e) => setLibelleStat(e.target.value)}
                required
              >
                <option value="">Sélectionnez un libellé Stat</option>
                <option value="Passagers">Passagers</option>
              </select>
            </div>

            <div className="button-group">
              <button type="submit" className="btn save-btn">
                OK
              </button>
            </div>
          </form>

          {/* Message en cas d'absence de données */}
          {noDataMessage && <p className="error-message">{noDataMessage}</p>}

          {/* Affichage du tableau après soumission */}
          {showTable && (
            <table className="tiers-table">
              <thead>
                <tr>
                  <th>Date Opération</th>
                  <th>Type Opération</th>
                  <th>Navire</th>
                  <th>Provenance/Destination</th>
                  <th>Code Stat</th>
                  <th>Quantité Transp</th>
                  <th>Quantité Facturée</th>
                  <th>N° Facture</th>
                  <th>Ecart (QT-QF)</th>
                </tr>
              </thead>
              <tbody>
                {marchandises.map((row, index) => (
                  <tr key={index}>
                    <td>{row.date_operation}</td>
                    <td>{row.type_operation}</td>
                    <td>{row.navire_name}</td>
                    <td>{row.nom_ville_localite}/{row.nom_ville_provenance}</td>
                    <td>{row.code_stat}</td>
                    <td>{row.quantite_transp}</td>
                    <td>{row.quantite_facturee}</td>
                    <td>{row.num_facture_annote}</td>
                    <td>{row.ecart}</td>
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

export default PassgerStat;
