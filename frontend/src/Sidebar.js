import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './css/Sidebar.css';

function Sidebar() {
  const navigate = useNavigate();
  const [recetteSelection, setRecetteSelection] = useState('');
  const [etatSelection, setEtatSelection] = useState('');
  const [sousOptionsVisible, setSousOptionsVisible] = useState(false);
  const [sousOptionsAPMFVisible, setSousOptionsAPMFVisible] = useState(false);
  
  const [elaborationSelection, setElaborationSelection] = useState('');
  const [besoinsParServiceVisible, setBesoinsParServiceVisible] = useState(false);

  const [realisationSelection, setRealisationSelection] = useState(''); // Ajout d'état pour sélection de Réalisation du Budget
  const [depensesSIIGVisible, setDepensesSIIGVisible] = useState(false); // État pour afficher les sous-options de Dépenses SIIG
  const [depensesHorsSIIGVisible, setDepensesHorsSIIGVisible] = useState(false); // État pour afficher les sous-options de Dépenses Hors SIIG
  const [marchesVisible, setMarchesVisible] = useState(false); // État pour afficher les sous-options des Marchés

    // Ajout des états pour PTA et DOS
  const [ptaSelection, setPtaSelection] = useState('');
  const [ptaOpen, setPtaOpen] = useState(false);  // État pour l'ouverture de PTA
  
  const [dosSelection, setDosSelection] = useState('');
  const [dosOpen, setDosOpen] = useState(false);  // État pour l'ouverture de DOS
  
  const[etatBudgetSelection, setEtatBudgetSelection] = useState('');
  const [etatBudgetOpen, setEtatBudgetOpen] = useState(false);

  const[suiviBudgetSelection, setSuiviBudgetSelection] = useState('');
  const [suiviBudgetOpen, setSuiviBudgetOpen] = useState(false);

  const [suiviDepensesSelection, setSuiviDepensesSelection] = useState('');
  const [isSuiviDepensesOpen, setIsSuiviDepensesOpen] = useState(false);  // Contrôler l'ouverture du module
  const [depensesSIIGVisibles, setDepensesSIIGVisibles] = useState(false); // Sous-options de SIIG
  const [depensesHorsSIIGVisibles, setDepensesHorsSIIGVisibles] = useState(false); // Sous-options Hors SIIG
  
  const[suiviMarcheSelection, setSuiviMarcheSelection] = useState('');
  const [suiviMarcheOpen, setSuiviMarcheOpen] = useState(false);
  
  const[suiviDosSelection, setSuiviDosSelection] = useState('');
  const [suiviDosOpen, setSuiviDosOpen] = useState(false);

  const [statistiqueSelection, setStatistiqueSelection] = useState('');
  const [isStatistiqueOpen, setIsStatistiqueOpen] = useState(false);  // Contrôler l'ouverture du module
  const [statistiqueFactureVisible, setStatistiqueFactureVisible] = useState(false); // Sous-options de SIIG
  const [statistiqueBruteVisible, setStatistiqueBruteVisible] = useState(false); // Sous-options Hors SIIG

  const[etatStatistiqueSelection, setEtatStatistiqueSelection] = useState('');
  const [etatStatistiqueOpen, setEtatStatistiqueOpen] = useState(false);
 
  const handleRecetteClick = () => {
    setRecetteSelection(prev => (prev === '' ? 'initial' : ''));
    setSousOptionsVisible(false);
    setSousOptionsAPMFVisible(false);
  };

  const handleRecetteChange = (event) => {
    setRecetteSelection(event.target.value);
    setEtatSelection('');
    setSousOptionsVisible(false);
    setSousOptionsAPMFVisible(false);
  };

  const handleEtatChange = (event) => {
    const selectedEtat = event.target.value;
    setEtatSelection(selectedEtat);
  
    if (selectedEtat === 'liste_des_tiers') {
      navigate('/liste_des_tiers');
    } else if (selectedEtat === 'liste_des_localites') {
      navigate('/liste_des_localites');
    } else if (selectedEtat === 'suivi_gasynet') {
      navigate('/suivi_gasynet');
      setSousOptionsVisible(true);
      setSousOptionsAPMFVisible(false);
    } else if (selectedEtat === 'suivi_recette_apmf') {
      // Affichage des sous-options spécifiques à "Suivi Recette APMF"
      setSousOptionsAPMFVisible(true);
      setSousOptionsVisible(false);
    } else if (selectedEtat === 'gasynet_plus_apmf') {
      navigate('/gasynet_plus_apmf');
      setSousOptionsVisible(false);
      setSousOptionsAPMFVisible(false);
    } else {
      setSousOptionsVisible(false);
      setSousOptionsAPMFVisible(false);
    }
  };

  const handleElaborationChange = (event) => {
    const selectedElaboration = event.target.value;
    setElaborationSelection(selectedElaboration);

    if (selectedElaboration === 'besoins_par_service') {
      setBesoinsParServiceVisible(true);
    } else {
      setBesoinsParServiceVisible(false);
    }
  };

  const handleRealisationChange = (event) => {
    const selectedRealisation = event.target.value;
    setRealisationSelection(selectedRealisation);

    if (selectedRealisation === 'depenses_SIIG') {
      setDepensesSIIGVisible(true);
      setDepensesHorsSIIGVisible(false);
      setMarchesVisible(false);
    } else if (selectedRealisation === 'depenses_hors_SIIG') {
      setDepensesHorsSIIGVisible(true);
      setDepensesSIIGVisible(false);
      setMarchesVisible(false);
    } else if (selectedRealisation === 'marches') {
      setMarchesVisible(true);
      setDepensesSIIGVisible(false);
      setDepensesHorsSIIGVisible(false);
    } else {
      setDepensesSIIGVisible(false);
      setDepensesHorsSIIGVisible(false);
      setMarchesVisible(false);
    }
  };

  const handleSaisieChange = (event) => {
    const selectedModule = event.target.value;
    navigate(`/${selectedModule}`);
  };

  const handlePtaChange = (event) => {
    setPtaSelection(event.target.value);
    navigate(`/${event.target.value}`);
  };

  const handleDosChange = (event) => {
    setDosSelection(event.target.value);
    navigate(`/${event.target.value}`);
  };

  const handleEtatBudgetChange = (event)=>{
    setEtatBudgetSelection(event.target.value);
    navigate(`/${event.target.value}`);
  };

  const handleSuiviBudgetChange = (event)=>{
    setSuiviBudgetSelection(event.target.value);
    navigate(`/${event.target.value}`);
  };


  // Gestion des changements dans "Suivi des Dépenses"
const handleSuiviDepensesChange = (event) => {
  const selectedModule = event.target.value;
  setSuiviDepensesSelection(selectedModule);

  // Logique pour afficher les sous-modules selon le choix
  if (selectedModule === 'depenses_SIIG') {
    setDepensesSIIGVisibles(true);
    setDepensesHorsSIIGVisibles(false);
  } else if (selectedModule === 'depenses_hors_SIIG') {
    setDepensesHorsSIIGVisibles(true);
    setDepensesSIIGVisibles(false);
  } else {
    setDepensesSIIGVisibles(false);
    setDepensesHorsSIIGVisibles(false);
  }
};

const handleSuiviMarcheChange = (event)=>{
  setSuiviMarcheSelection(event.target.value);
  navigate(`/${event.target.value}`);
};

const handleSuiviDosChange = (event)=>{
  setSuiviDosSelection(event.target.value);
  navigate(`/${event.target.value}`);
};

const handleStatistiqueChange = (event) => {
  const selectedModule = event.target.value;
  console.log("Module sélectionné : ", selectedModule);

  // Pour les options principales
  if (selectedModule === 'statistiques_facturees') {
    setStatistiqueFactureVisible(true);
    setStatistiqueBruteVisible(false);
  } else if (selectedModule === 'statistiques_brutes') {
    setStatistiqueBruteVisible(true);
    setStatistiqueFactureVisible(false);
  } 
  // Pour les sous-options de "Statistiques facturées"
  else if (['drsn', 'dsm', 'dm', 'vas', 'aam_marins', 'location_tp'].includes(selectedModule)) {
    console.log("Navigating to: ", selectedModule); // Vérification
    navigate(`/${selectedModule}`);  // Redirige directement vers le sous-module
  } 
  // Pour les sous-options de "Statistiques brutes"
  else if (['saisie-marchandises', 'navire-operationnels', 'nb_escales'].includes(selectedModule)) {
    console.log("Navigating to: ", selectedModule); // Vérification
    navigate(`/${selectedModule}`);  // Redirige directement vers le sous-module
  } 
  else {
    setStatistiqueFactureVisible(false);
    setStatistiqueBruteVisible(false);
  }
};





const handleEtatStatistiqueChange = (event) => {
  setEtatStatistiqueSelection(event.target.value);
  navigate(`/${event.target.value}`);
};


  const [dashboardSelection, setDashboardSelection] = useState('');
  const [isDashboardOpen, setIsDashboardOpen] = useState(false); // Nouvel état pour afficher les sous-options


  const handleDashboardClick = () => {
    setIsDashboardOpen(!isDashboardOpen); // Alterne entre ouvrir/fermer les sous-options
  };

  const handleDashboardChange = (e) => {
    const value = e.target.value;
    setDashboardSelection(value);

    // Navigation vers la page correspondante
    if (value) {
      navigate(`/${value}`);
    }
  }


  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <img src="http://localhost:8000/static/image/logo.png" alt="Logo" className="logo-image" />
        <h2>Menu</h2>
      </div>
      <ul>
  {/* Tableau de Bord */}
  <li>
          <div className="sidebar-item" onClick={handleDashboardClick} style={{ cursor: 'pointer' }}>
            Tableau de Bord
          </div>
          {isDashboardOpen && ( // Utilise l'état isDashboardOpen pour afficher les sous-options
            <div className="sous-module-options">
              <select
                id="dashboard-select"
                value={dashboardSelection}
                onChange={handleDashboardChange}
                className="module-selection"
              >
                <option value="">--Choisissez--</option>
                <option value="evolution_des_recettes">Evolution des recettes</option>
                <option value="graphe_depense">Graphe Dépenses</option>
                <option value="suivi_depense">Suivi des Dépenses</option>
                <option value="evolution_mensuelle">Evolution mensuelle</option>
                <option value="suivi_stat">STAT</option>
              </select>
            </div>
          )}
        </li>



        <li>
          <div className="sidebar-item">
            <Link to="/gestion_tache">Gestion des Tâches</Link>
          </div>
        </li>

        
      <li>
          <div className="sidebar-item" onClick={() => setDosOpen(!dosOpen)}>
            DOS
          </div>
          {dosOpen && (
            <div className="sous-module-options">
              <select
                id="dos-select"
                value={dosSelection}
                onChange={handleDosChange}
                className="module-selection"
              >
                <option>--Choisissez--</option>
                <option value="saisie_ref_dos">Saisie du REF DOS</option>
              </select>
            </div>
          )}
        </li>

              {/* PTA et DOS */}
              <li>
          <div className="sidebar-item" onClick={() => setPtaOpen(!ptaOpen)}>
            PTA
          </div>
          {ptaOpen && (
            <div className="sous-module-options">
              <select
                id="pta-select"
                value={ptaSelection}
                onChange={handlePtaChange}
                className="module-selection"
              >
                <option>--Choisissez--</option>
                <option value="saisie_pta">Saisie du PTA</option>
                <option value="modification_pta">Modification du PTA</option>
              </select>
            </div>
          )}
        </li>

        {/* Recette */}
        <li>
        <div className="sidebar-item" onClick={handleRecetteClick} style={{ cursor: 'pointer' }}>
          Recettes
        </div>
        {recetteSelection !== '' && (
          <div className="sous-module-options">
            <select
              id="recette-select"
              value={recetteSelection}
              onChange={handleRecetteChange}
              className="module-selection"
            >
              <option>--Choisissez--</option>
              <option value="saisieRecette">Saisie Recette</option>
              <option value="etat">État</option>
            </select>
            {recetteSelection === 'etat' && (
              <select
                id="etat-select"
                value={etatSelection}
                onChange={handleEtatChange}
                className="etat-options"
              >
                <option value="">--Choisissez--</option>
                <option value="liste_des_tiers">Liste des tiers</option>
                <option value="liste_des_localites">Liste des localités</option>
                <option value="suivi_gasynet">Suivi Gasy Net</option>
                <option value="suivi_recette_apmf">Suivi Recettes APMF</option>
                <option value="gasynet_plus_apmf">Gasy Net + APMF</option>
              </select>
            )}
            {recetteSelection === 'saisieRecette' && (
              <select id="saisie-select" onChange={handleSaisieChange} className="module-selection">
                <option>--Choisissez--</option>
                <option value="saisie_budget">Saisie du budget</option>
                <option value="saisie_nouveau_tiers">Saisie nouveau tiers</option>
                <option value="saisie_nouvelle_localite">Saisie nouvelle localité</option>
                <option value="saisie_plan_comptable">Plan comptable</option>
                <option value="saisie_nouvelle_facture">Saisie nouvelle facture</option>
              </select>
            )}
          </div>
        )}
        {/* Sous-options spécifiques à Suivi Recette APMF */}
        {sousOptionsAPMFVisible && (
          <div className="sous-sous-module-options">
            <select
              id="suivi-recette-apmf-select"
              value={etatBudgetSelection}
              onChange={handleEtatBudgetChange}
              className="module-selection"
            >
              <option value="">--Choisissez--</option>
              <option value="suivi_recette_apmf_edition">Edition</option>
              <option value="suivi_recette_apmf_evolution">Evolution</option>
         
            </select>
            {etatBudgetSelection === 'suivi_budget' && (
              <select
                id="suivi-budget-select"
                value={suiviBudgetSelection}
                onChange={handleSuiviBudgetChange}
                className="module-selection"
              >
                <option value="">--Choisissez--</option>
                <option value="suivi_recette">Suivi Recette</option>
                <option value="suivi_depenses">Suivi Dépenses</option>
              </select>
            )}
            {suiviBudgetSelection === 'suivi_recette' && (
              <select
                id="suivi-recette-select"
                value={suiviDepensesSelection}
                onChange={handleSuiviDepensesChange}
                className="module-selection"
              >
                <option value="">--Choisissez--</option>
                <option value="depenses_SIIG">Dépenses SIIG</option>
                <option value="depenses_hors_SIIG">Dépenses Hors SIIG</option>
              </select>
            )}
            {suiviDepensesSelection === 'depenses_SIIG' && (
              <div>
                {/* Options supplémentaires pour "Dépenses SIIG" */}
                <p>Options pour Dépenses SIIG</p>
              </div>
            )}
            {suiviDepensesSelection === 'depenses_hors_SIIG' && (
              <div>
                {/* Options supplémentaires pour "Dépenses Hors SIIG" */}
                <p>Options pour Dépenses Hors SIIG</p>
              </div>
            )}
          </div>
        )}
      </li>



        {/* Elaboration du Budget */}
        <li>
          <div className="sidebar-item" style={{ cursor: 'pointer' }} onClick={handleElaborationChange}>
            Elaboration du Budget
          </div>
          {elaborationSelection !== '' && (
            <div className="sous-module-options">
              <select
                id="elaboration-select"
                value={elaborationSelection}
                onChange={handleElaborationChange}
                className="module-selection"
              >
                <option>--Choisissez--</option>
                <option value="article">Article</option>
                <option value="besoins_par_service">Besoins par service</option>
              </select>
              {besoinsParServiceVisible && (
                <select
                  id="besoins-par-service-select"
                  onChange={handleSaisieChange}
                  className="module-selection"
                >
                  <option>--Choisissez--</option>
                  <option value="saisie_donees">Saisie données</option>
                  <option value="saisie_budget_service">Saisie du budget</option>
                  <option value="modification_suppression">Modification ou Suppression</option>
                  <option value="amenagement_budget">Aménagement du budget</option>
                </select>
              )}
            </div>
          )}
        </li>

        {/* Réalisation du Budget */}
        <li>
          <div className="sidebar-item" style={{ cursor: 'pointer' }} onClick={handleRealisationChange}>
            Réalisation du Budget
          </div>
          {realisationSelection !== '' && (
            <div className="sous-module-options">
              <select
                id="realisation-select"
                value={realisationSelection}
                onChange={handleRealisationChange}
                className="module-selection"
              >
                <option>--Choisissez--</option>
                <option value="depenses_SIIG">Dépenses SIIG</option>
                <option value="depenses_hors_SIIG">Dépenses hors SIIG</option>
                <option value="marches">Marchés</option>
              </select>

              {depensesSIIGVisible && (
                <div className="sous-options">
                  <select id="depenses-siig-select" onChange={handleSaisieChange}>
                    <option>--Choisissez--</option>
                    <option value="import_donnees_siig">Import des données SIIG</option>
                    <option value="export_donnees">Export des données</option>
                    <option value= "modification_engagement">Modification d'engagement ou suppression </option>
                    <option value="changement_etat_engagement"> Changement d'etat d'engagement</option>
                    <option> </option>
                  </select>
                </div>
              )}
              {depensesHorsSIIGVisible && (
                <div className="sous-options">
                  <select id="depenses-hors-siig-select" onChange={handleSaisieChange}>
                    <option>--Choisissez--</option>
                    <option value="base_jirama">Base JIRAMA</option>
                    <option value="base_mission">Base mission</option>
                    <option value="base_telecommunication">Base Télécommunication </option>
                    <option value="base_salaire" >Base Salaire</option>
                    <option value="base_vehicule">Base Véhicule </option>
                  </select>
                </div>
              )}
              {marchesVisible && (
                <div className="sous-options">
                  <select id="marches-select" onChange={handleSaisieChange}>
                    <option>--Choisissez--</option>
                    <option value="saisie_marches">Saisie des Marchés attribues</option>
                    <option value="mise_a_jour_marche">Mise à jour Marchés</option>
                    <option value="attachement_par_compte">Attachement Par Compte</option>
                  </select>
                </div>
              )}
            </div>
          )}
        </li>

     



        {/*etat budget*/}
        <li>
          <div className="sidebar-item" onClick={() => setEtatBudgetOpen(!etatBudgetOpen)}>
            Etats du Budget
          </div>
          {etatBudgetOpen && (
            <div className="sous-module-options">
              <select
                id="etat-budget-select"
                value={etatBudgetSelection}
                onChange={handleEtatBudgetChange}
                className="module-selection"
              >
                <option>--Choisissez--</option>
                <option value="etats_des_besoins">Etats des besoins(fournitures)</option>
                <option value="etats_des_besoins_par_service">Etats des besoins par service</option>
                <option value="etats_par_famille">Etats par famille</option>
                <option value="total_par_famille">Total par famille</option>
                <option value="etats_par_famille_par_demandeur">Etats par famille par demandeur</option>
                <option value="total_par_demandeur">Total par demandeur</option>
              </select>
            </div>
          )}
        </li>

          {/*suivi budget*/}
        <li>
          <div className="sidebar-item" onClick={() => setSuiviBudgetOpen(!suiviBudgetOpen)}>
            Suivi du Budget
          </div>
          {suiviBudgetOpen && (
            <div className="sous-module-options">
              <select
                id="suivi-budget-select"
                value={suiviBudgetSelection}
                onChange={handleSuiviBudgetChange}
                className="module-selection"
              >
                <option>--Choisissez--</option>
                <option value="visualisation_investissement">Visualisation investissement</option>
                <option value="visualisation_fonctionnement">Visualisation fonctionnement</option>
                <option value="budget_par_compte">Budget par compte</option>
                <option value="tableau_equilibre_financier">Tableau d'equilibre financier</option>
                <option value="decaissement_par_projet">Decaissement par projet</option>
                <option value="situation_budgetaire">Situation budgetaire</option>
                <option value="analyse_des_ecarts">Analyse des ecarts</option>
                <option value="variation_globale">Variation Gloable</option>
                <option value="programme_emploi">Programme d'emploi</option>
              </select>
            </div>
          )}
        </li>

          {/* Suivi des Dépenses */}
          <li>
                <div className="sidebar-item" style={{ cursor: 'pointer' }} onClick={() => setIsSuiviDepensesOpen(!isSuiviDepensesOpen)}>
                  Suivi des Dépenses
                </div>
                {isSuiviDepensesOpen && (
                  <div className="sous-module-options">
                    <select
                      id="suivi-depenses-select"
                      value={suiviDepensesSelection}
                      onChange={handleSuiviDepensesChange}
                      className="module-selection"
                    >
                      <option>--Choisissez--</option>
                      <option value="depenses_SIIG">Dépenses SIIG FP</option>
                      <option value="depenses_hors_SIIG">Dépenses hors SIIG</option>
                    </select>

                    {/* Affichage des sous-options selon la sélection */}
                    {depensesSIIGVisibles && (
                      <div className="sous-options">
                        <select id="depenses-siig-select" onChange={handleSaisieChange}>
                          <option>--Choisissez--</option>
                          <option value="visualisation_des_engagements">Visualisation des engagements</option>
                          <option value="etat_eng_par_compte">Etat des engagements par compte</option>
                          <option value="etat_eng_par_tiers">Etats des engagements par tiers</option>
                          <option value="suivi_engagement">Suivi des engagements</option>
                        </select>
                      </div>
                    )}
                    {depensesHorsSIIGVisibles && (
                      <div className="sous-options">
                        <select id="depenses-hors-siig-select" onChange={handleSaisieChange}>
                          <option>--Choisissez--</option>
                        {/*}  <option value="">JIRAMA</option>
                          <option value="">OM</option>
                          <option value="reparation_voiture">Réparation voiture</option>
                          <option value="salaire">Salaire</option>
                          <option value="depenses_telecom">Dépenses Télécommunication </option>
                    <option value="marges_brutes">Marges brutes </option> */}
                        </select>
                      </div>
                    )}
                  </div>
                )}
              </li>


                {/*suivi des marches*/}
                <li>
                  <div className="sidebar-item" onClick={() => setSuiviMarcheOpen(!suiviMarcheOpen)}>
                    Suivi des Marchés
                  </div>
                  {suiviMarcheOpen && (
                    <div className="sous-module-options">
                      <select
                        id="suivi-marche-select"
                        value={suiviMarcheSelection}
                        onChange={handleSuiviMarcheChange}
                        className="module-selection"
                      >
                        <option>--Choisissez--</option>
                        <option value="visualisation_des_marches">Visualisation des marchés</option>
                        <option value="attachement_par_projet">Attachement par projet</option>
                        <option value="suivi_des_decaissements">Suivi des décaissements</option>
                        <option value="hitorique_de_paiement">Historique de paiement</option>
                        <option value="analyse_ecarts_2">analyse des écarts</option>
                        <option value="execution_pta">Execution du PTA</option>
                        <option value="execution_par_direction">Execution par Direction/Service</option>
                      </select>
                    </div>
                  )}
                </li>


                
                {/*suivi DOS*/}
                <li>
                  <div className="sidebar-item" onClick={() => setSuiviDosOpen(!suiviDosOpen)}>
                    Suivi DOS
                  </div>
                  {suiviDosOpen && (
                    <div className="sous-module-options">
                      <select
                        id="suivi-dos-select"
                        value={suiviDosSelection}
                        onChange={handleSuiviDosChange}
                        className="module-selection"
                      >
                      <option>--Choisissez--</option>
                        <option value="execution_dos">Exécution du DOS</option>
                        <option value="situation_dos">Situation du DOS(CUMUL)</option>
                      </select>
                    </div>
                  )}
                </li>


              
      {/* Statistiques */}
      <li>
        <div className="sidebar-item" style={{ cursor: 'pointer' }} onClick={() => setIsStatistiqueOpen(!isStatistiqueOpen)}>
          STATISTIQUES
        </div>

        {isStatistiqueOpen && (
          <div className="sous-module-options">
            <select
              id="statistiques-select"
              value={statistiqueSelection}
              onChange={handleStatistiqueChange}
              className="module-selection"
            >
              <option>--Choisissez--</option>
              <option value="statistiques_facturees">Saisie des Statistiques facturées</option>
              <option value="statistiques_brutes">Saisie des Statistiques Brutes</option>
            </select>

            {/* Affichage des sous-options selon la sélection */}
            {statistiqueFactureVisible && (
              <div className="sous-options">
                <select id="statistiques-facturees" onChange={handleStatistiqueChange}>
                  <option>--Choisissez--</option>
                  <option value="drsn">DRSN</option>
                  <option value="dsm">DSM</option>
                  <option value="dm">DM</option>
                  <option value="vas">VAS</option>
                  <option value="aam_marins">AAM MARINS</option>
                  <option value="location_tp">Location TP et Occupation</option>
                </select>
              </div>
            )}
            {statistiqueBruteVisible && (
              <div className="sous-options">
              <select id="statistiques-brutes" onChange={handleStatistiqueChange}>
                <option>--Choisissez--</option>
                <option value="saisie-marchandises">Marchandises</option>
                <option value="saisie-navire-operationnels">Navires opérationnels</option>
                <option value="nb_escales">Nombres d'escales</option>
              </select>

              </div>
            )}
          </div>
        )}
      </li>



                  {/*etat statistiques*/}
              <li>
                <div className="sidebar-item" onClick={() => setEtatStatistiqueOpen(!etatStatistiqueOpen)}>
                  Etats Statistiques
                </div>
                {etatStatistiqueOpen && (
                  <div className="sous-module-options">
                    <select
                      id="etat-satistique-select"
                      value={etatStatistiqueSelection}
                      onChange={handleEtatStatistiqueChange}
                      className="module-selection"
                    >
                      <option>--Choisissez--</option>
                      <option value="evo-stat">EVO STAT sur 5ans</option>
                      <option value="statistiques_par_ville">Statistiques par ville</option>
                      <option value="evo-stat-mensuel">EVO STAT mensuel par ville</option>
                      <option value="stat_globale_facturee">Statique globale facturée</option>
                      <option value="navire-operationnels">Navires opérationnels</option>
                      <option value="mses-transportees">MSES transportées</option>
                      <option value="passagers">Passagers</option>
                      <option value="analyse_des_ecarts_stat">Analyse des écarts</option>
                      <option value="marchandises">Marchandises</option>
                      <option value="passagers2">Passagers Code Stat</option>

                    </select>
                  </div>
                )}
              </li>





      </ul>
    </div>
  );
}

export default Sidebar;
