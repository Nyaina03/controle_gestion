import React, { useState } from 'react';
import './css/Sidebar.css';
import Sidebar from "./Sidebar";
import Header from "./Header";
import './css/FormPage.css';
import { Link } from 'react-router-dom';


function SaisieNouvelleFacture() {

  return(
    <div className="dashboard-page">
      <Sidebar />
      <div className="main-content">
        <Header />
        <div className="form-container">
          <div className="div-h2">
            <h2>Saisie Nouvelle Facture</h2> {/* Changement du titre */}
          </div>
          <form className="form">
           
           <div className="button-group">
          <Link to="/saisie_facture_gasynet" className="btn gasynet">
            GASYNET
          </Link>
          <Link to="/saisie_facture_allapmf" className="btn apmf">
            APMF ALL MARITIME
          </Link>
          <Link to="/saisie_facture_apmfvas" className="btn apmf-vas">
            APMF VAS
          </Link>
          </div>
          </form>
        </div>
      </div>
    </div>

    );
  }
  


export default SaisieNouvelleFacture;
