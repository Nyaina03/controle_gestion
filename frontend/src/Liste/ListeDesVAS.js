import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/Sidebar.css';
import '../css/EtatsAEtablir.css';
import '../css/ConfirmationModal.css';
import Sidebar from "../Sidebar";
import Header from "../Header";
import ConfirmationModal from '../ConfirmationModal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';

function ListeDesVAS() {
    const [vas, setVas] = useState([]);
    const [error, setError] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);
    const [editData, setEditData] = useState({ id_vas: '', num_facture: '', nav_plaisancier_200: '', nav_plaisancier_300: '',emb_trad_60: '',emb_trad_120: '', vedette_mot_hb_120: '', remorqueur_vedette_200: '', remorqueur_vedette_300: '', barge_chaland_inf: '', barge_chaland_su: '', nav_de_charge_inf_200 :'', nav_de_charge_inf_1600: '', nav_de_charge_sup_1600: '', nav_de_peche_mot_hb_220: '', nav_de_peche_mot_ib_280: '', nav_de_peche_cotiere_400: '', nav_de_peche_au_large: ''});
    const [confirmDelete, setConfirmDelete] = useState(false);
    const [deleteId, setDeleteId] = useState(null);
    const navigate = useNavigate();


    useEffect(() => {
        fetch('http://localhost:8000/api/statistiqueFacturees/vas/')
          .then(response => response.json())
          .then(data => setVas(data))
          .catch(error => console.error('Error fetching Vas:', error));
      }, []);



    const handleDeleteClick = (id) => {
        setConfirmDelete(true);
        setDeleteId(id);
    };

    const handleDeleteConfirm = () => {
        if (deleteId) {
            fetch(`http://localhost:8000/api/statistiqueFacturees/vas/${deleteId}/`, { method: 'DELETE' })
                .then(response => {
                    if (response.ok) {
                        setVas(vas.filter(vas => vas.id_vas !== deleteId));
                        setConfirmDelete(false);
                        setDeleteId(null);
                    }
                })
                .catch(error => console.error('Erreur :', error));
        }
    };

    const handleEditClick = (vas) => {
        setEditData(vas);
        setShowEditModal(true);
    };

    const handleEditSubmit = (event) => {
        event.preventDefault();
        fetch(`http://localhost:8000/api/statistiqueFacturees/vas/${editData.id_vas}/`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(editData),
        })
            .then(response => {
                if (response.ok) {
                    setVas(vas.map(d => d.id_vas === editData.id_vas ? editData : d));
                    setShowEditModal(false);
                } else {
                    throw new Error('Erreur lors de la modification');
                }
            })
            .catch(error => console.error('Erreur :', error));
    };

    return (
        <div className="dashboard-page">
            <Sidebar />
            <div className="main-content">
                <Header />
                <div className="form-container">
                    <h2 className="div-h2">Liste des VAS</h2>
                    {error && <div className="error">{error}</div>}
                    <button className="add-button" onClick={() => navigate('/vas')}>
                        <FontAwesomeIcon icon={faPlus} /> Ajouter Vas
                    </button>
                    <table className="tiers-table">
                        <thead>
                            <tr>
                                <th>Numéro Facture</th>
                                <th>Nav Plaisancier 200</th>
                                <th>Nav Plaisancier 300</th>
                                <th>Emb Trad 60</th>
                                <th>Emb Trad 120</th>
                                <th>Vedette Mot HB 120</th>
                                <th>Remorqueur Vedette 200</th>
                                <th>Remorqueur Vedette 300</th>
                                <th>Barge chaland Inf</th>
                                <th>Barge Chaland Sup</th>
                                <th>Nav de Charge Inf 200</th>
                                <th>Nav de Charge Inf 1600</th>
                                <th>Nav de Charge Sup 200</th>
                                <th>Nav de Peche MOt Hb 220</th>
                                <th>Nav de Peche Mot Ib 280</th>
                                <th>Nav de Peche Cotiere 400</th>
                                <th>Nav de Peche au Large</th>
                                <th>Modifier</th>
                                <th>Supprimer</th>
                            </tr>
                        </thead>
                        <tbody>
                            {vas.map((vas, index) => (
                                <tr key={vas.id_vas} className={index % 2 === 0 ? 'row-blue' : 'row-gray'}>
                                    <td>{vas.num_facture}</td>
                                    <td>{vas.nav_plaisancier_200}</td>
                                    <td>{vas.nav_plaisancier_300}</td>
                                    <td>{vas.emb_trad_60}</td>
                                    <td>{vas.emb_trad_120}</td>
                                    <td>{vas.vedette_mot_hb_120 }</td>
                                    <td>{vas.remorqueur_vedette_200}</td>
                                    <td>{vas.remorqueur_vedette_300}</td>
                                    <td>{vas.barge_chaland_inf}</td>
                                    <td>{vas.barge_chaland_sup}</td>
                                    <td>{vas.nav_de_charge_inf_200 }</td>
                                    <td>{vas.nav_de_charge_inf_1600}</td>
                                    <td>{vas.nav_de_charge_sup_1600}</td>
                                    <td>{vas.nav_de_peche_mot_hb_220}</td>
                                    <td>{vas.nav_de_peche_mot_ib_280}</td>
                                    <td>{vas.nav_de_peche_cotiere_400}</td>
                                    <td>{vas.nav_de_peche_au_large}</td>
                                    <td>
                                        <FontAwesomeIcon
                                            icon={faEdit}
                                            className="action-icon edit-icon"
                                            title="Modifier"
                                            onClick={() => handleEditClick(vas)}
                                        />
                                    </td>
                                    <td>
                                        <FontAwesomeIcon
                                            icon={faTrash}
                                            className="action-icon delete-icon"
                                            title="Supprimer"
                                            onClick={() => handleDeleteClick(vas.id_vas)}
                                        />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {/* Confirmation Modal */}
                {confirmDelete && (
                    <ConfirmationModal
                        message="Êtes-vous sûr de vouloir supprimer ce VAS ?"
                        onConfirm={handleDeleteConfirm}
                        onCancel={() => setConfirmDelete(false)}
                    />
                )}
                {/* Edit Modal */}
                {showEditModal && (
                    <div className="modal">
                        <div className="modal-content">
                            <h3>Modifier VAS</h3>
                            <form onSubmit={handleEditSubmit}>
                                <div className="form-group">
                                    <label htmlFor="num_facture">Numéro facture:</label>
                                    <input
                                        type="text"
                                        id="num_facture"
                                        value={editData.num_facture}
                                        onChange={(e) => setEditData({ ...editData, num_facture: e.target.value })}
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="nav_plaisancier_200 ">Nav Plaisancier 200:</label>
                                    <input
                                        type="number"
                                        id="nav_plaisancier_200"
                                        value={editData.nav_plaisancier_200}
                                        onChange={(e) => setEditData({ ...editData, nav_plaisancier_200: e.target.value })}
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="nav_plaisancier_300 ">Nav Plaisancier 300:</label>
                                    <input
                                        type="number"
                                        id="nav_plaisancier_300"
                                        value={editData.nav_plaisancier_300}
                                        onChange={(e) => setEditData({ ...editData, nav_plaisancier_300: e.target.value })}
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor=" emb_trad_60">Emb Trad 60:</label>
                                    <input
                                        type="number"
                                        id="emb_trad_60"
                                        value={editData.emb_trad_60}
                                        onChange={(e) => setEditData({ ...editData, emb_trad_60: e.target.value })}
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor=" emb_trad_120">Emb Trad 120:</label>
                                    <input
                                        type="number"
                                        id="emb_trad_120"
                                        value={editData.emb_trad_60}
                                        onChange={(e) => setEditData({ ...editData, emb_trad_120: e.target.value })}
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor=" vedette_mot_hb_120">Vedette Mot Hb 120:</label>
                                    <input
                                        type="number"
                                        id="vedette_mot_hb_120"
                                        value={editData.vedette_mot_hb_120}
                                        onChange={(e) => setEditData({ ...editData, vedette_mot_hb_120: e.target.value })}
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor=" remorqueur_vedette_200">Remorqueur Vedette 200:</label>
                                    <input
                                        type="number"
                                        id=" remorqueur_vedette_200"
                                        value={editData.remorqueur_vedette_200}
                                        onChange={(e) => setEditData({ ...editData,  remorqueur_vedette_200: e.target.value })}
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor=" remorqueur_vedette_300">Remorqueur Vedette 300:</label>
                                    <input
                                        type="number"
                                        id=" remorqueur_vedette_300"
                                        value={editData. remorqueur_vedette_300}
                                        onChange={(e) => setEditData({ ...editData,  remorqueur_vedette_300: e.target.value })}
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor=" barge_chaland_inf ">Barge Chaland Inf:</label>
                                    <input
                                        type="number"
                                        id="barge_chaland_inf "
                                        value={editData.barge_chaland_inf }
                                        onChange={(e) => setEditData({ ...editData,  barge_chaland_inf : e.target.value })}
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor=" barge_chaland_sup ">Barge Chaland Sup:</label>
                                    <input
                                        type="number"
                                        id="barge_chaland_sup "
                                        value={editData.barge_chaland_sup}
                                        onChange={(e) => setEditData({ ...editData,  barge_chaland_sup : e.target.value })}
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="nav_de_charge_inf_200  ">Nav de Charge Inf 200:</label>
                                    <input
                                        type="number"
                                        id="nav_de_charge_inf_200  "
                                        value={editData.nav_de_charge_inf_200  }
                                        onChange={(e) => setEditData({ ...editData,  nav_de_charge_inf_200  : e.target.value })}
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="nav_de_charge_inf_1600  ">Nav de Charge Inf 1600:</label>
                                    <input
                                        type="number"
                                        id="nav_de_charge_inf_1600  "
                                        value={editData.nav_de_charge_inf_1600  }
                                        onChange={(e) => setEditData({ ...editData,  nav_de_charge_inf_1600  : e.target.value })}
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="nav_de_charge_sup_1600  ">Nav de Charge Sup 1600:</label>
                                    <input
                                        type="number"
                                        id="nav_de_charge_sup_1600"
                                        value={editData.nav_de_charge_sup_1600}
                                        onChange={(e) => setEditData({ ...editData,  nav_de_charge_sup_1600  : e.target.value })}
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="nav_de_peche_mot_hb_220">Nav de Peche Mot Hb 220:</label>
                                    <input
                                        type="number"
                                        id="nav_de_peche_mot_hb_220"
                                        value={editData.nav_de_peche_mot_hb_220}
                                        onChange={(e) => setEditData({ ...editData,  nav_de_peche_mot_hb_220  : e.target.value })}
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="nav_de_peche_mot_ib_280">Nav de Peche Mot Ib 280:</label>
                                    <input
                                        type="number"
                                        id="nav_de_peche_mot_ib_280"
                                        value={editData.nav_de_peche_mot_ib_280}
                                        onChange={(e) => setEditData({ ...editData,  nav_de_peche_mot_ib_280  : e.target.value })}
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="nav_de_peche_cotiere_400">Nav de Peche Cotiere 400:</label>
                                    <input
                                        type="number"
                                        id="nav_de_peche_cotiere_400"
                                        value={editData.nav_de_peche_cotiere_400}
                                        onChange={(e) => setEditData({ ...editData,  nav_de_peche_cotiere_400  : e.target.value })}
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="nav_de_peche_au_large">Nav de Peche au large:</label>
                                    <input
                                        type="number"
                                        id="nav_de_peche_au_large"
                                        value={editData.nav_de_peche_au_large}
                                        onChange={(e) => setEditData({ ...editData,  nav_de_peche_au_large  : e.target.value })}
                                    />
                                </div>
                                
                                




                                <div className="button-group">
                                    <button type="submit">Enregistrer</button>
                                    <button type="button" onClick={() => setShowEditModal(false)}>Annuler</button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default ListeDesVAS;
