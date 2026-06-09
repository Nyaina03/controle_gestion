import React, { useState } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";
import "./css/FormPage.css"; // Réutilisation des styles existants
import ConfirmationOk from './ConfirmationOk';
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";

function SaisieVAS() {
  // États pour chaque champ

  const[nav_plaisancier_200, setNavPlaisancier200] = useState('');
  const[nav_plaisancier_300, setNavPlaisancier300] = useState('');
  const[emb_trad_60, setEmbTrad60] = useState('');
  const[emb_trad_120, setEmbTrad120] = useState('');
  const[vedette_mot_hb_120, setVedetteMotHb120] = useState('');
  const[remorqueur_vedette_200, setRemorqueurVedette200] = useState('');
  const[remorqueur_vedette_300, setRemorqueurVedette300] = useState('');
  const[barge_chaland_inf, setBargeChalandInf] = useState('');
  const[barge_chaland_sup, setBargeChalandSup] = useState('');
  const[nav_de_charge_inf_200, setNavDeChargeInf200] = useState('');
  const[nav_de_charge_inf_1600 , setNavDeChargeInf1600] = useState('');
  const[nav_de_charge_sup_1600, setNavDeChargeSup1600] = useState('');
  const[nav_de_peche_mot_hb_220 , setNavDePecheMotHb220] = useState('');
  const[nav_de_peche_mot_ib_280, setNavDePecheMotIb280] = useState('');
  const[nav_de_peche_cotiere_400, setNavDePecheCotiere400] = useState(''); 
  const[nav_de_peche_au_large , setNavDePecheAuLarge] = useState('');
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [error, setError] = useState(null);

  const location = useLocation();
  const nFacture = location.state?.nFacture;

  const navigate = useNavigate();




  const handleSubmit = (event) => {
    event.preventDefault();
    setError(null); // Réinitialiser l'erreur avant la soumission

    // Préparer les données du budget
    const vasData = {
      num_facture : nFacture,
      nav_plaisancier_200,
      nav_plaisancier_300,
      emb_trad_60,
      emb_trad_120,
      vedette_mot_hb_120,
      remorqueur_vedette_200,
      remorqueur_vedette_300,
      barge_chaland_inf,
      barge_chaland_sup,
      nav_de_charge_inf_200,
      nav_de_charge_inf_1600,
      nav_de_charge_sup_1600,
      nav_de_peche_mot_hb_220,
      nav_de_peche_mot_ib_280,
      nav_de_peche_cotiere_400,
      nav_de_peche_au_large,
  

    };
  
    // Envoi des données au serveur
    fetch('http://localhost:8000/api/statistiqueFacturees/vas/', {  // Ajustez l'URL de l'API
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(vasData),
    })
      .then(response => {
        if (!response.ok) {
          return response.json().then(errData => {
            console.error('Erreur API:', errData);
            throw new Error(`Erreur API: ${errData.detail || response.statusText}`);
          });
        }
        return response.json();
      })
      .then(data => {
        console.log('Réponse:', data);
        if (data.id_vas) {
          setShowConfirmation(true);
        } else {
          throw new Error("Erreur lors de l'ajout du VAS.");
        }
      })
      .catch(error => {
        console.error("Erreur lors de l'ajout du vas:", error);
        setError("Une erreur est survenue. Veuillez réessayer.");
      });
  };

  
  const handleOk = () => {
    setShowConfirmation(false); // Fermer la fenêtre de confirmation
    {navigate('/liste_vas')};
  };



  return (
    <div className="dashboard-page">
      <Sidebar />
      <div className="main-content">
        <Header />
        <div className="form-container">
          <h2 className="div-h2">Saisie des VAS</h2>

          {/* Formulaire */}
          <form onSubmit={handleSubmit}>
            {/* Liste des champs */}

            <div className="form-group">
                <label>Numéro Facture:</label>
                <div className="readonly-field">
                  {nFacture || 'Non sélectionné'}
                </div>
          </div>

            <div className="form-group">
              <label htmlFor="">Nav plaisancier 200,000 AR :</label>
              <input
                type="number"
                id="nav_plaisancier_200"
                name="nav_plaisancier_200"
                value={nav_plaisancier_200}
                onChange={(e) => setNavPlaisancier200(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="nav_plaisancier_300">NAV plaisancier 300,000 AR :</label>
              <input
                type="number"
                id="nav_plaisancier_300"
                name="nav_plaisancier_300"
                value={nav_plaisancier_300}
                onChange={(e) => setNavPlaisancier300(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="emb_trad_60">EMB TRAD 60,000 AR :</label>
              <input
                type="number"
                id="emb_trad_60"
                name="emb_trad_60"
                value={emb_trad_60}
                onChange={(e) => setEmbTrad60(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="emb_trad_120">EMB TRAD 120,000 AR :</label>
              <input
                type="number"
                id="emb_trad_120"
                name="emb_trad_120"
                value={emb_trad_120}
                onChange={(e) => setEmbTrad120(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="vedette_mot_hb_120">Vedette MOT HB 120,000 AR :</label>
              <input
                type="number"
                id="vedette_mot_hb_120"
                name="vedette_mot_hb_120"
                value={vedette_mot_hb_120}
                onChange={(e) => setVedetteMotHb120(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="remorqueur_vedette_200">Remorqueur vedette 200,000 AR :</label>
              <input
                type="number"
                id="remorqueur_vedette_200"
                name="remorqueur_vedette_200"
                value={remorqueur_vedette_200}
                onChange={(e) => setRemorqueurVedette200(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="remorqueur_vedette_300">Remorqueur vedette 300,000 AR :</label>
              <input
                type="number"
                id="remorqueur_vedette_300"
                name="remorqueur_vedette_300"
                value={remorqueur_vedette_300}
                onChange={(e) => setRemorqueurVedette300(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="barge_chaland_inf">Barge chaland inf 100TX 200,000 AR :</label>
              <input
                type="number"
                id="barge_chaland_inf"
                name="barge_chaland_inf"
                value={barge_chaland_inf}
                onChange={(e) => setBargeChalandInf(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="barge_chaland_sup">Barge chaland sup 100TX 300,000 AR :</label>
              <input
                type="number"
                id="barge_chaland_sup"
                name="barge_chaland_sup"
                value={barge_chaland_sup}
                onChange={(e) => setBargeChalandSup(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="nav_de_charge_inf_200">NAV de charge inf 200TX 300,000 AR :</label>
              <input
                type="number"
                id="nav_de_charge_inf_200"
                name="nav_de_charge_inf_200"
                value={nav_de_charge_inf_200}
                onChange={(e) => setNavDeChargeInf200(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="nav_de_charge_inf_1600">NAV de charge inf 1600TX 500,000 AR :</label>
              <input
                type="number"
                id="nav_de_charge_inf_1600"
                name="nav_de_charge_inf_1600"
                value={nav_de_charge_inf_1600}
                onChange={(e) => setNavDeChargeInf1600(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="nav_de_charge_sup_1600">NAV de charge sup 1600TX 600,000 AR :</label>
              <input
                type="number"
                id="nav_de_charge_sup_1600"
                name="nav_de_charge_sup_1600"
                value={nav_de_charge_sup_1600}
                onChange={(e) => setNavDeChargeSup1600(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="nav_de_peche_mot_hb_220">NAV de pêche mot HB 220,000 AR :</label>
              <input
                type="number"
                id="nav_de_peche_mot_hb_220"
                name="nav_de_peche_mot_hb_220"
                value={nav_de_peche_mot_hb_220}
                onChange={(e) => setNavDePecheMotHb220(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="nav_de_peche_mot_ib_280">NAV de pêche mot IB 280,000 AR :</label>
              <input
                type="number"
                id="nav_de_peche_mot_ib_280"
                name="nav_de_peche_mot_ib_280"
                value={nav_de_peche_mot_ib_280}
                onChange={(e) => setNavDePecheMotIb280(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="nav_de_peche_cotiere_400">NAV de pêche côtière 400,000 AR :</label>
              <input
                type="number"
                id="nav_de_peche_cotiere_400"
                name="nav_de_peche_cotiere_400"
                value={nav_de_peche_cotiere_400}
                onChange={(e) => setNavDePecheCotiere400(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="nav_de_peche_au_large">NAV de pêche au large 500,000 AR :</label>
              <input
                type="number"
                id="nav_de_peche_au_large"
                name="nav_de_peche_au_large"
                value={nav_de_peche_au_large}
                onChange={(e) => setNavDePecheAuLarge(e.target.value)}
                required
              />
            </div>

            {/* Bouton d'enregistrement */}
            <div className="button-group">
              <button type="submit" className="btn save-btn">Enregistrer</button>
            </div>
          </form>

          {error && <p className="error-message">{error}</p>}
          {showConfirmation && <ConfirmationOk message="VAS ajouté avec succès!" onClose={handleOk} />}
        </div>
      </div>
    </div>
  );
}

export default SaisieVAS;
