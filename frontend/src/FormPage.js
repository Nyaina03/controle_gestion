import React from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import './css/FormPage.css';

function FormPage() {
  return (
    <div className="dashboard-page">
      <Sidebar />
      <div className="main-content">
        <Header />
          <div className="form-container">
              <h2 className="form-title">Formulaire de saisie</h2>
              <form className="input-form">
                  <div className="form-group">
                      <label>Fonctionnalité</label>
                      <select>
                          <option>Données</option>
                          <option>Autres</option>
                      </select>
                  </div>

                  <div className="form-group">
                      <label>Module de la zone</label>
                      <select>
                          <option>Formulaire de saisie</option>
                          <option>Autre module</option>
                      </select>
                  </div>


                  <div className="form-group">
                      <label>Titre</label>
                      <input type="text" placeholder="Entrer le titre"/>
                  </div>

                  <div className="form-group">
                      <label>Format</label>
                      <select>
                          <option>Titre 1</option>
                          <option>Titre 2</option>
                          <option>Titre 3</option>
                      </select>
                  </div>

                  <div className="button-group">
                      <button type="button" className="btn cancel-btn">Annuler</button>
                      <button type="submit" className="btn save-btn">Enregistrer</button>
                      <button type="button" className="btn save-close-btn">Enregistrer et fermer</button>
                  </div>
              </form>
          </div>
      </div>
    </div>
  );
}

export default FormPage;
