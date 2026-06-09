import React from 'react';
import './css/EtatsAEtablir.css'; // Assurez-vous de créer ce fichier CSS pour le style

function EtatsAEtablir() {

  // Les liens mènent aux pages respectives (vous devrez créer ces pages et définir des routes si nécessaire)
  const handleNavigation = (path) => {
    window.location.href = path; // Utilisez un routeur comme react-router-dom pour une meilleure gestion des routes
  };

  return (
    <div className="etats-container">
      <h2 className="page-title">ETATS A ETABLIR</h2>

      <table className="etats-table">
        <tbody>
          <tr className="clickable-row" onClick={() => handleNavigation('/tiers')}>
            <td className="alternate-color">Liste des tiers</td>
          </tr>
          <tr className="clickable-row" onClick={() => handleNavigation('/localites')}>
            <td>Liste des localités</td>
          </tr>
          <tr className="clickable-row" onClick={() => handleNavigation('/suivi-gasy-net')}>
            <td className="alternate-color">Suivi Gasy NET</td>
          </tr>
          <tr className="clickable-row" onClick={() => handleNavigation('/suivi-recette-apmf')}>
            <td>Suivi Recette APMF</td>
          </tr>
          <tr className="clickable-row" onClick={() => handleNavigation('/gasy-net-apmf')}>
            <td className="alternate-color">GASYNET + APMF</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export default EtatsAEtablir;
