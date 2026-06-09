import React, { useState } from "react";
import axios from "axios";
import Sidebar from "./Sidebar";
import Header from "./Header";
import "./css/EtatsAEtablir.css"; // Réutilisation des styles existants pour les tableaux
import "./css/FormPage.css"; // Comme classe de CSS

function SuiviDesDecaissement() {
  const [annee, setAnnee] = useState("");
  const [decaissements, setDecaissements] = useState([]);
  const [showTable, setShowTable] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setShowTable(false); // Masque le tableau pendant le chargement
    setLoading(true);
    setError("");
  
    try {
      const response = await fetch(`http://localhost:8000/api/marches/suivi_decaissement/${annee}/`); // URL de l'API
      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des données.');
      }
      const data = await response.json(); // Convertir la réponse en JSON
      setDecaissements(data);
      setShowTable(true); // Affiche le tableau si les données sont récupérées
    } catch (err) {
      setError("Erreur lors de la récupération des données.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <div className="dashboard-page">
      <Sidebar />
      <div className="main-content">
        <Header />
        <div className="form-container">
          <h2 className="div-h2">Suivi des Décaissements</h2>

          {/* Formulaire */}
          <form onSubmit={handleSubmit}>
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
                {loading ? "Chargement..." : "OK"}
              </button>
            </div>
          </form>

          {/* Affiche un message d'erreur si nécessaire */}
          {error && <p className="error-message">{error}</p>}

          {/* Affiche le tableau uniquement si showTable est vrai */}
          {showTable && (
            <table className="tiers-table">
              <thead>
                <tr>
                  <th>Compte</th>
                  <th>Libellé</th>
                  <th>Budget</th>
                  <th>N° Marché</th>
                  <th>Titulaire</th>
                  <th>Montant Marché</th>
                  <th>Paiement Antérieur</th>
                  <th>Paiement Année</th>
                  <th>Reste à Payer</th>
                </tr>
              </thead>
              <tbody>
                {/* Lignes du tableau dynamiques */}
                {decaissements.map((decaissement, index) => (
                  <tr key={index}>
                    <td>{decaissement.code_compte}</td>
                    <td>{decaissement.libelle}</td>
                    <td>{decaissement.budget?.toLocaleString()}</td>
                    <td>{decaissement.num_marche}</td>
                    <td>{decaissement.titulaire}</td>
                    <td>{decaissement.montant_marche?.toLocaleString()}</td>
                    <td>{decaissement.paiement_anterieur?.toLocaleString()}</td>
                    <td>{decaissement.paiement_annee?.toLocaleString()}</td>
                    <td>{decaissement.reste_a_payer?.toLocaleString()}</td>
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

export default SuiviDesDecaissement;
