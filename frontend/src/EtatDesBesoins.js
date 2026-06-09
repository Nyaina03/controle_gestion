import React, { useState, useEffect } from 'react';
import './css/EtatsAEtablir.css'; // Réutilisation des styles existants pour les couleurs alternées
import Sidebar from './Sidebar';
import Header from './Header';

function EtatDesBesoins() {
  const [besoinData, setBesoinData] = useState([]);

  useEffect(() => {
    fetch('http://localhost:8000/api/creationArticle/creation_article/')
      .then(response => response.json())
      .then(data => {
        console.log('Data fetched:', data); // Check API response
        setBesoinData(data);
      })
      .catch(error => console.error('Erreur lors de la chargement des besoins:', error));
  }, []);

  // Fonction pour calculer le montant et s'assurer que les valeurs sont numériques
  const calculateMontant = (quantite, pu) => {
    const qty = parseFloat(quantite) || 0; // Parse quantité en float
    const unitPrice = parseFloat(pu) || 0; // Parse PU en float
    return (qty * unitPrice).toFixed(2); // Retourne le montant formaté à 2 décimales
  };

  return (
    <div className="dashboard-page">
      <Sidebar />
      <div className="main-content">
        <Header />
        <div className="form-container">
          <h2 className="div-h2">Etat des besoins (Fournitures)</h2>

          <table className="tiers-table">
            <thead>
              <tr>
                <th>Code Article</th>
                <th>Désignation</th>
                <th>Quantité</th>
                <th>PU</th>
                <th>Montant</th>
              </tr>
            </thead>
            <tbody>
              {besoinData.map((besoin, index) => (
                <tr key={besoin.id_creation_article} className={index % 2 === 0 ? 'row-blue' : 'row-gray'}>
                  <td>{besoin.code_article}</td>
                  <td>{besoin.article}</td>
                  <td>{besoin.quantite}</td>
                  <td>{besoin.pu}</td>
                  {/* Montant calculé dynamiquement */}
                  <td>{calculateMontant(besoin.quantite, besoin.pu)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default EtatDesBesoins;
