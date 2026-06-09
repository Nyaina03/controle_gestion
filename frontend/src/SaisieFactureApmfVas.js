import React, { useState, useEffect } from 'react';
import './css/Sidebar.css';
import Sidebar from "./Sidebar";
import Header from "./Header";
import './css/FormPage.css';
import ConfirmationOk from './ConfirmationOk';

function SaisieFactureApmfVas() {
  const [compte, setCompte] = useState('');
  const [localite, setLocalite] = useState('');
  const [clientName, setClientName] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [clients, setClients] = useState([]);
  const [filteredClients, setFilteredClients] = useState([]);
  const [comptes, setComptes] = useState([]);
  const [localites, setLocalites] = useState([]);
  const [tauxTVA] = useState(20);
  const [navire, setNavire] = useState('');
  const [imm, setImm] = useState('');
  const [nFacture, setNFacture] = useState('');
  const [libelle, setLibelle] = useState('');
  const [dateFacture, setDateFacture] = useState('');
  const [montantHT, setMontantHT] = useState(0);
  const [tva, setTva] = useState(0);
  const [montantTTC, setMontantTTC] = useState(0);
  const [confirmationMessage, setConfirmationMessage] = useState('');

  // Fetch comptes, localités, et clients
  useEffect(() => {
    fetch('http://localhost:8000/api/comptes/comptes/')
      .then(response => response.json())
      .then(data => setComptes(data))
      .catch(error => console.error('Erreur lors de la récupération des comptes:', error));

    fetch('http://localhost:8000/api/localites/villes/')
      .then(response => response.json())
      .then(data => setLocalites(data))
      .catch(error => console.error('Erreur lors de la récupération des localités:', error));

    fetch('http://localhost:8000/api/tiers/tiers/')
      .then(response => response.json())
      .then(data => setClients(data))
      .catch(error => console.error('Erreur lors de la récupération des clients:', error));
  }, []);

  // Calcul TVA et Montant TTC
  useEffect(() => {
    const calculatedTVA = montantHT * (tauxTVA / 100);
    const calculatedTTC = montantHT + calculatedTVA;
    setTva(calculatedTVA);
    setMontantTTC(calculatedTTC);
  }, [montantHT, tauxTVA]);

  // Filtrer les clients en fonction de la localité uniquement
// Filtrer les clients en fonction de la localité et du nom
useEffect(() => {
  if (localite) {
    // Filtrer d'abord par localité
    let filteredByLocalite = clients.filter(client => client.id_ville === parseInt(localite));

    // Si un extrait du nom est défini, filtrer en plus par le nom
    if (clientName) {
      filteredByLocalite = filteredByLocalite.filter(client =>
        `${client.nom} ${client.prenoms}`.toLowerCase().includes(clientName.toLowerCase())
      );
    }

    // Mettre à jour les clients filtrés
    setFilteredClients(filteredByLocalite);
  } else {
    setFilteredClients([]); // Si aucune localité n'est sélectionnée, réinitialiser
  }
}, [localite, clientName, clients]); // Dépendances mises à jour

  // Vérifier si un client est valide et définir un message de confirmation
useEffect(() => {
  if (clientName) {
    const selectedClient = clients.find(client => `${client.nom} ${client.prenoms}` === clientName);
    if (!selectedClient) {
      setConfirmationMessage("Client non valide, veuillez le sélectionner.");
    } else {
      setConfirmationMessage('');
    }
  }
}, [clientName, clients]);


  const handleShowForm = () => {
    if (compte && localite && clientName) {
      setShowForm(true);
      setConfirmationMessage('');
    } else {
      setConfirmationMessage('Veuillez remplir tous les champs requis avant de continuer.');
    }
  };

  const data = {
    id_compte: parseInt(compte),
    id_ville: parseInt(localite),
    id_tiers: clients.find(client => `${client.nom} ${client.prenoms}` === clientName)?.id_tiers, // Ajout de la sécurité
    taux_tva: tauxTVA,
    navire,
    imm,
    num_facture: nFacture,
    libelle,
    date_facture: dateFacture,
    montant_ht: parseFloat(montantHT),
    tva: parseFloat(tva),
    montant_ttc: parseFloat(montantTTC),
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    fetch('http://localhost:8000/api/recetteApmfVas/recetteApmfVas/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
      .then(response => {
        if (response.ok) {
          return response.json();
        }
        throw new Error('Échec de la soumission.');
      })
      .then(result => {
        console.log('Succès:', result);
        setConfirmationMessage('Facture enregistrée avec succès!');
      })
      .catch(error => {
        console.error('Erreur lors de la soumission:', error);
        setConfirmationMessage('Échec de l’enregistrement de la facture.');
      });
  };

  return (
    <div className="dashboard-page">
      <Sidebar />
      <div className="main-content">
        <Header />
        <div className="form-container">
          <div className="div-h2">
            <h2>Saisie Facture APMF VAS</h2>
          </div>

          {confirmationMessage && (
            <ConfirmationOk message={confirmationMessage} onClose={() => setConfirmationMessage('')} />
          )}

          {!showForm ? (
            <div>
              <div className="form-group">
                <label htmlFor="compte">Choix du Compte:</label>
                <select id="compte" value={compte} onChange={(e) => setCompte(e.target.value)}>
                  <option value="">Sélectionner un compte</option>
                  {comptes
                    .filter(compte => compte.id_compte !== 1 && compte.id_compte !== 2 && compte.id_type_compte === 1)
                    .map(compte => (
                      <option key={compte.id_compte} value={compte.id_compte}>
                        {compte.code} - {compte.libelle}
                      </option>
                    ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="localite">Localité:</label>
                <select id="localite" value={localite} onChange={(e) => setLocalite(e.target.value)}>
                  <option value="">Sélectionner une localité</option>
                  {localites.map(loc => (
                    <option key={loc.id_ville} value={loc.id_ville}>
                      {loc.nom_ville}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="clientName">Extrait du nom du Client:</label>
                <input id="clientName" type="text" value={clientName} onChange={(e) => setClientName(e.target.value)} />
                {clientName && filteredClients.length > 0 && (
                  <ul className="client-dropdown">
                    {filteredClients.map((client) => (
                      <li 
                        key={client.id_tiers} 
                        onClick={() => setClientName(`${client.nom} ${client.prenoms}`)}
                      >
                        {client.nom} {client.prenoms}
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <div className="button-group">
              <button onClick={handleShowForm} type="submit" className="btn save-btn">
                OK
              </button>
            </div>
            </div>
          ) : (
                 <form onSubmit={handleSubmit} className="form">
              <div className="form-group">
                <label>Compte:</label>
                <div className="readonly-field">
                  {compte || 'Non sélectionné'}
                </div>
              </div>
              <div className="form-group">
                <label>Localité:</label>
                <div className="readonly-field">
                  {localite || 'Non sélectionnée'}
                </div>
              </div>
              <div className="form-group">
                <label>Nom du Client:</label>
                <div className="readonly-field">
                  {clientName || 'Non sélectionné'}
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="navire">Navire:</label>
                <input 
                  type="text" 
                  id="navire" 
                  value={navire} 
                  onChange={(e) => setNavire(e.target.value)} 
                />
              </div>

              <div className="form-group">
                <label htmlFor="imm">IMM:</label>
                <input 
                  type="text" 
                  id="imm" 
                  value={imm} 
                  onChange={(e) => setImm(e.target.value)} 
                />
              </div>

              <div className="form-group">
                <label htmlFor="montantHT">Montant HT:</label>
                <input 
                  type="number" 
                  id="montantHT" 
                  value={montantHT} 
                  onChange={(e) => setMontantHT(e.target.value)} 
                />
              </div>

              <div className="form-group">
                <label htmlFor="nFacture">N° Facture:</label>
                <input 
                  type="text" 
                  id="nFacture" 
                  value={nFacture} 
                  onChange={(e) => setNFacture(e.target.value)} 
                />
              </div>

              <div className="form-group">
                <label htmlFor="libelle">Libellé:</label>
                <input 
                  type="text" 
                  id="libelle" 
                  value={libelle} 
                  onChange={(e) => setLibelle(e.target.value)} 
                />
              </div>

              <div className="form-group">
                <label htmlFor="dateFacture">Date de Facture:</label>
                <input 
                  type="date" 
                  id="dateFacture" 
                  value={dateFacture} 
                  onChange={(e) => setDateFacture(e.target.value)} 
                />
              </div>

              <div className="form-group">
                <label>TVA:</label>
                <div className="readonly-field-calcul">{tva} €</div>
              </div>

              <div className="form-group">
                <label>Total TTC:</label>
                <div className="readonly-field-calcul">{montantTTC} €</div>
              </div>

                <div className="button-group">
                  <button type="submit" className="btn save-btn">Enregistrer</button>
                </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

export default SaisieFactureApmfVas;