import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './Login';
import SignUp from './SignUp';
import Dashboard from './DashboardEvolutionRecette.js';
import SaisieBudget from './SaisieBudget';
import SaisieNouveauTiers from './SaisieNouveauTiers';
import SaisieNouvelleLocalite from './SaisieNouvelleLocalite';
import SaisiePlanComptable from './SaisiePlanComptable';
import SaisieNouvelleFacture from './SaisieNouvelleFacture';
import SaisieFactureGasynet from './SaisieFactureGasynet';
import SaisieFactureAllApmf from './SaisieFactureAllApmf';
import SaisieFactureApmfVas from './SaisieFactureApmfVas';
import ListeDesTiers from './ListeDesTiers';
import ListeDesLocalites from './ListeDesLocalites';
import SuiviGasyNet from './SuiviGasyNet';
import SuiviRecetteApmf_Edition from './SuiviRecetteApmf_Edition';
import SuiviRecetteApmf_Evolution from './SuiviRecetteApmf_Evolution';
import SuiviRecetteGasynetApmf from './SuiviRecetteGasynetApmf';
import SaisieDonnees from './SaisieDonnees';
import SaisieBudgetService from './SaisieBudgetService';
import ModificationSuppressionBudget from './ModificationSuppressionBudget';
import AmenagementBudget from './AmenagementBudget';
import ImportDonneeSiig from './ImportDonneeSiig';
import ExportDonnees from './ExportDonnees';
import SaisieMarchesAttribues from './SaisieMarchesAttribues';
import ModificationEngagement from './ModificationEngagement';
import ChangementEtatEngagement from './ChangementEtatEngagement';
import MiseAjourMarche from './MiseAjourMarche';
import AttachementParCompte from './AttachementParCompte';
import SaisiePta from './SaisiePta';
import ModificationPta from './ModificationPta';
import SaisieRefDos from './SaisieRefDos';
import EtatDesBesoins from './EtatDesBesoins';
import EtatDesBesoinsParService from './EtatDesBesoinsParService';
import EtatParFamille from './EtatParFamille';
import TotalParFamille from './TotalParFamille';
import EtatParFamilleDemandeur from './EtatParFamilleDemandeur';
import TotalParDemandeur from './TotalParDemandeur';
import VisualisationInvestissement from './VisualisationInvestissement';
import VisualisationFonctionnement from './VisualisationFonctionnement';
import BudgetParCompte from './BudgetParCompte';
import TableauEquilibreFinancier from './TableauEquilibreFinancier';
import DecaissementParProjet from './DecaissementParProjet';
import SituationBudgetaire from './SituationBudgetaire';
import AnalyseDesEcarts from './AnalyseDesEcarts';
import VariationGlobale from './VariationGlobale';
import ProgrammeDemploi from './ProgrammeDemploi';
import VisualisationDesEngagements from './VisualisationDesEngagements';
import EtatEngagementParCompte from './EtatEngagementParCompte';
import EtatEngagementParTiers from './EtatEngagementParTiers';
import SuiviDesEngagements from './SuiviDesEngagements';
import VisualisationDesMarches from './VisualisationDesMarches';
import AttachementParProjet from './AttachementParProjet';
import SuiviDesDecaissement from './SuiviDesDecaissement';
import HistoriqueDePaiement from './HistoriqueDePaiement';
import AnalyseEcart2 from './AnalyseEcart2';
import ExecutionDuPta from './ExecutionDuPta';
import ExecutionDuPtaParDirection from './ExecutionDuPtaParDirection';
import ExecutionDuDos from './ExecutionDuDos';
import SituationDuDos from './SituationDuDos';
import SaisieDRSN from './SaisieDRSN';
import SaisieDSM from './SaisieDSM';
import SaisieDM from './SaisieDM';
import SaisieVAS from './SaisieVAS';
import SaisieAAMMarins from './SaisieAAMMarins';
import SaisieLocation from './SaisieLocation';
import SaisieMarchandise from './SaisieMarchandise';
import SaisieNavire from './SaisieNavire';
import EvoStatSur5 from './EvoStatSur5';
import StatistiqueParVille from './StatistiqueParVille';
import EvoStatMensuelleParVille from './EvoStatMensuelleParVille';
import StatistiqueGlobaleFacturee from './StatistiqueGlobaleFacturee';
import NaviresOperationnels from './NaviresOperationnels';
import MsesTransportees from './MsesTransportees';
import Passagers from './Passagers';
import AnalyseDesEcartsStat from './AnalyseDesEcartsStat';
import Marchandises from './Marchandises';
import PassagerStat from './PassagerStat';
import EscalesParMois from './EscalesParMois';
import GestionTaches from './GestionTaches';
import AdminDashboard from './AdminDashboard';
import DashboardEvolutionRecette from './DashboardEvolutionRecette.js';
import DashboardBudget from './DashboardBudget';
import DashboardSuiviDepense from './DashboardSuiviDepense';
import DashboardSuiviDepenseMensuelle from './DashboardSuiviDepenseMensuelle';
import DashboardSuiviStat from './DashboardSuiviStat';
import ListeDesBudgets from './Liste/ListeDesBudgets';
import ListeDesComptes from './Liste/ListeDesComptes';
import ListeDesPTA from './Liste/ListeDesPTA';
import ListeDesDos from './Liste/ListeDesDos';
import ListeDesFactures from './Liste/ListeDesFactures';
import ListeDesDRSN from './Liste/ListeDesDRSN';
import ListeDesDM from './Liste/ListeDesDM';
import ListeDesDSM from './Liste/ListeDesDSM';
import ListeDesVAS from './Liste/ListeDesVAS';
import ListeDesAAM from './Liste/ListeDesAAM';

function App() {
  console.log('App is rendering');
  return (
    <Router>
      <Routes>
        {/* Route pour la page de connexion sans Sidebar et Header */}
        <Route path="/login" element={<Login />} />
        <Route path="/inscription" element={<SignUp />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="/adminDashboard" element={<AdminDashboard />} />
        <Route path="saisie_budget" element={<SaisieBudget />} />
        <Route path="saisie_nouveau_tiers" element={<SaisieNouveauTiers />} />
        <Route path="saisie_nouvelle_localite" element={<SaisieNouvelleLocalite />} />
        <Route path="saisie_plan_comptable" element={<SaisiePlanComptable />} />
        <Route path="saisie_nouvelle_facture" element={<SaisieNouvelleFacture />} />
        <Route path="saisie_facture_gasynet" element={<SaisieFactureGasynet />} />
        <Route path="saisie_facture_allapmf" element={<SaisieFactureAllApmf />} />
        <Route path="saisie_facture_apmfvas" element={<SaisieFactureApmfVas />} />
        <Route path="liste_des_tiers" element={<ListeDesTiers />} />
        <Route path="liste_des_localites" element={<ListeDesLocalites />} />
        <Route path="suivi_gasynet" element={<SuiviGasyNet />} />
        <Route path="suivi_recette_apmf_edition" element={<SuiviRecetteApmf_Edition />} />
        <Route path="suivi_recette_apmf_evolution" element={<SuiviRecetteApmf_Evolution />} />
        <Route path="gasynet_plus_apmf" element={<SuiviRecetteGasynetApmf />} />
        <Route path= "saisie_donees" element={<SaisieDonnees />} />
        <Route path="saisie_budget_service" element={<SaisieBudgetService />} />
        <Route path="modification_suppression" element={<ModificationSuppressionBudget />} />
        <Route path="amenagement_budget" element={<AmenagementBudget/>} />
        <Route path="import_donnees_siig" element={<ImportDonneeSiig/>} />
        <Route path="export_donnees" element={<ExportDonnees/>} />
        <Route path="saisie_marches" element={<SaisieMarchesAttribues/>} />
        <Route path="modification_engagement" element={<ModificationEngagement/>} />
        <Route path="changement_etat_engagement" element={<ChangementEtatEngagement/>} />
        <Route path="mise_a_jour_marche" element={<MiseAjourMarche/>} />
        <Route path="attachement_par_compte" element={<AttachementParCompte/>} />
        <Route path="saisie_pta" element={<SaisiePta/>} />
        <Route path="modification_pta" element={<ModificationPta/>} />
        <Route path="saisie_ref_dos" element={<SaisieRefDos/>} />
        <Route path="etats_des_besoins" element={<EtatDesBesoins/>} />
        <Route path="etats_des_besoins_par_service" element={<EtatDesBesoinsParService/>} />
        <Route path="etats_par_famille" element={<EtatParFamille/>} />
        <Route path="total_par_famille" element={<TotalParFamille/>} />
        <Route path="etats_par_famille_par_demandeur" element={<EtatParFamilleDemandeur/>} />
        <Route path="total_par_demandeur" element={<TotalParDemandeur/>} />
        <Route path="visualisation_investissement" element={<VisualisationInvestissement/>} />
        <Route path="visualisation_fonctionnement" element={<VisualisationFonctionnement/>} />
        <Route path="budget_par_compte" element={<BudgetParCompte/>} />
        <Route path="tableau_equilibre_financier" element={<TableauEquilibreFinancier/>} />
        <Route path="decaissement_par_projet" element={<DecaissementParProjet/>} />
        <Route path="situation_budgetaire" element={<SituationBudgetaire/>} />
        <Route path="analyse_des_ecarts" element={<AnalyseDesEcarts/>} />
        <Route path="variation_globale" element={<VariationGlobale/>} />
        <Route path="programme_emploi" element={<ProgrammeDemploi/>} />
        <Route path="visualisation_des_engagements" element={<VisualisationDesEngagements/>} />
        <Route path="etat_eng_par_compte" element={<EtatEngagementParCompte/>} />
        <Route path="etat_eng_par_tiers" element={<EtatEngagementParTiers/>} />
        <Route path="suivi_engagement" element={<SuiviDesEngagements/>} />
        <Route path="visualisation_des_marches" element={<VisualisationDesMarches/>} />
        <Route path="attachement_par_projet" element={<AttachementParProjet/>} />
        <Route path="suivi_des_decaissements" element={<SuiviDesDecaissement/>} />
        <Route path="hitorique_de_paiement" element={<HistoriqueDePaiement/>} />
        <Route path="analyse_ecarts_2" element={<AnalyseEcart2/>} />
        <Route path="execution_pta" element={<ExecutionDuPta/>} />
        <Route path="execution_par_direction" element={<ExecutionDuPtaParDirection/>} />
        <Route path="execution_dos" element={<ExecutionDuDos/>} />
        <Route path="situation_dos" element={<SituationDuDos/>} />
        <Route path="drsn" element={<SaisieDRSN/>} />
        <Route path="dsm" element={<SaisieDSM/>} />
        <Route path="dm" element={<SaisieDM/>} />
        <Route path="vas" element={<SaisieVAS/>} />
        <Route path="aam_marins" element={<SaisieAAMMarins/>} />
        <Route path="location_tp" element={<SaisieLocation/>} />
        <Route path="saisie-marchandises" element={<SaisieMarchandise/>} />
        <Route path="saisie-navire-operationnels" element={<SaisieNavire/>} />
        <Route path="evo-stat" element={<EvoStatSur5/>} />
        <Route path="statistiques_par_ville" element={<StatistiqueParVille/>} />
        <Route path="evo-stat-mensuel" element={<EvoStatMensuelleParVille/>} />
        <Route path="stat_globale_facturee" element={<StatistiqueGlobaleFacturee/>} />
        <Route path="navire-operationnels" element={<NaviresOperationnels/>} />
        <Route path="mses-transportees" element={<MsesTransportees/>} />
        <Route path="passagers" element={<Passagers/>} />
        <Route path="analyse_des_ecarts_stat" element={<AnalyseDesEcartsStat/>} />
        <Route path="marchandises" element={<Marchandises/>} />
        <Route path="passagers2" element={<PassagerStat/>} />
        <Route path="nb_escales" element={<EscalesParMois/>} />
        <Route path="gestion_tache" element={<GestionTaches/>} />
        <Route path="evolution_des_recettes" element={<DashboardEvolutionRecette/>} />
        <Route path="graphe_depense" element={<DashboardBudget/>} />
        <Route path="suivi_depense" element={<DashboardSuiviDepense/>} />
        <Route path="evolution_mensuelle" element={<DashboardSuiviDepenseMensuelle/>} />
        <Route path="suivi_stat" element={<DashboardSuiviStat/>} />
        <Route path="liste_budgets" element={<ListeDesBudgets/>} />
        <Route path="liste_comptes" element={<ListeDesComptes/>} /> 
        <Route path="liste_pta" element={<ListeDesPTA/>} /> 
        <Route path="liste_dos" element={<ListeDesDos/>} /> 
        <Route path="liste_factures" element={<ListeDesFactures/>} /> 
        <Route path="liste_drsn" element={<ListeDesDRSN/>} /> 
        <Route path="liste_dm" element={<ListeDesDM/>} /> 
        <Route path="liste_dsm" element={<ListeDesDSM/>} /> 
        <Route path="liste_vas" element={<ListeDesVAS/>} /> 
        <Route path="liste_aam" element={<ListeDesAAM/>} /> 

        
        

        {/* Routes pour les autres composants */}
        <Route path="/" element={<ListeDesLocalites />} />
        <Route path="/ajouter" element={<SaisieNouvelleLocalite />} />

        {/* Route par défaut vers Login */}
        <Route index element={<Login />} />

        {/* Route 404 */}
        <Route path="*" element={<div>404 Not Found</div>} />
      </Routes>
    </Router>
  );
}

export default App;
