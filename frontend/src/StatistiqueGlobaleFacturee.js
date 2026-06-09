import React, { useState } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";
import "./css/FormPage.css"; // Réutilisation des styles existants

function StatistiqueGlobaleFacturee() {
  const [annee, setAnnee] = useState("");
  const [mois, setMois] = useState([]);
  const [afficherTableau, setAfficherTableau] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [data, setData] = useState([]); // Pour stocker les données de l'API
  const [loading, setLoading] = useState(false); // Pour gérer le chargement
  const [noDataFound, setNoDataFound] = useState(false); // Pour gérer l'absence de données

  // Gestion du changement de l'année
  const handleAnneeChange = (e) => {
    setAnnee(e.target.value);
    setNoDataFound(false); // Réinitialiser l'état du message d'erreur lors du changement de l'année
  };

  // Fonction pour appeler l'API et afficher le tableau
  const handleAfficherTableau = async (e) => {
    e.preventDefault();

    if (annee && !isNaN(annee)) {
      setIsSubmitted(true);
      setMois([
        "Janvier", "Février", "Mars", "Avril", "Mai", "Juin",
        "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"
      ]);
      setAfficherTableau(true);
      setLoading(true);

      try {
        // Appeler l'API
        const response = await fetch(`http://localhost:8000/api/statistiqueBrutes/statistique_globale_facturee/?annee_debut=${annee}`);
        const result = await response.json();

        // Vérifier si des données sont renvoyées
        if (result.length === 0) {
          setNoDataFound(true); // Si aucune donnée, afficher le message d'erreur
        } else {
          setNoDataFound(false); // Réinitialiser si des données sont trouvées
        }

        // Mettre à jour les données avec la réponse de l'API
        setData(result);
      } catch (error) {
        console.error("Erreur lors de l'appel API", error);
      } finally {
        setLoading(false);
      }
    } else {
      alert("Veuillez entrer une année valide.");
    }
  };

  return (
    <div className="dashboard-page">
      <Sidebar />
      <div className="main-content">
        <Header />
        <div className="form-container">
          <h2 className="div-h2">Statistique Globale Facturée</h2>

          {/* Formulaire pour l'année */}
          <form onSubmit={handleAfficherTableau}>
            <div className="form-group">
              <label htmlFor="annee">Choix année :</label>
              <input
                type="number"
                id="annee"
                value={annee}
                onChange={handleAnneeChange}
                required
              />
            </div>

            {/* Bouton OK pour afficher le tableau */}
            <div className="button-group">
              <button type="submit" className="btn save-btn">
                OK
              </button>
            </div>
          </form>

          {/* Message d'erreur en rouge si aucune donnée n'est trouvée */}
          {noDataFound && (
            <p style={{ color: "red", fontWeight: "bold" }}>
              Aucune donnée ne correspond à l'année choisie.
            </p>
          )}

          {/* Affichage du tableau après avoir cliqué sur OK */}
          {afficherTableau && loading && <p>Chargement des données...</p>}

          {afficherTableau && !loading && data.length > 0 && (
            <table className="tiers-table">
              <thead>
                <tr>
                  <th>Code Stat</th>
                  <th>Libelle Stat</th>
                  {mois.map((mois, index) => (
                    <th key={index}>{mois}</th>
                  ))}
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                {data.map((item, index) => (
                  <tr key={index}>
                    <td>{item.code_stat.code_stat}</td>
                    <td>{item.libelle_stat}</td>
                    {item.mois_data.map((moisData, moisIndex) => (
                      <td key={moisIndex}>{moisData}</td>
                    ))}
                    <td>{item.mois_data.reduce((acc, curr) => acc + curr, 0)}</td> {/* Total des mois */}
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {/* Message de confirmation après soumission */}
          {isSubmitted && !afficherTableau && (
            <p className="confirmation-message">
              Veuillez entrer une année valide pour afficher les statistiques globales facturées.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default StatistiqueGlobaleFacturee;
