import React, { useState, useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';
import Sidebar from './Sidebar';
import Header from './Header';
import './css/Dashboard.css';

function DashboardSuiviDepense() {
  const [anneeDebut, setAnneeDebut] = useState('');
  const [codeProgramme, setCodeProgramme] = useState('');
  const [tri, setTri] = useState('montant');

  // Investissement State
  const [investData, setInvestData] = useState([]);
  const [investLoading, setInvestLoading] = useState(false);
  const investChartRef = useRef(null);
  const investCanvasRef = useRef(null);

  // Fonctionnement State
  const [fonctionData, setFonctionData] = useState([]);
  const [fonctionLoading, setFonctionLoading] = useState(false);
  const fonctionChartRef = useRef(null);
  const fonctionCanvasRef = useRef(null);

  const fetchInvestData = async () => {
    setInvestLoading(true);
    try {
      const response = await fetch(
        `http://localhost:8000/api/budget/visualisation_investissement_5ans/?code_programme=${codeProgramme}&annee=${anneeDebut}&tri=${tri}`
      );
      const result = await response.json();

      // Complétez les années manquantes pour investissement
      const years = Array.from({ length: 5 }, (_, i) => parseInt(anneeDebut, 10) + i);
      const completedData = years.map((year) =>
        result.find((item) => item.annee === year) || {
          annee: year,
          programme: codeProgramme,
          compte: null,
          code_compte: null,
          libelle: null,
          montant: 0,
          montant_apres_modification: 0,
          total_attachements: 0,
          modif_plus: 0,
          modif_moins: 0,
          credit: 0,
        }
      );

      setInvestData(completedData);
    } catch (error) {
      console.error('Erreur lors de la récupération des données Investissement:', error);
      setInvestData([]);
    } finally {
      setInvestLoading(false);
    }
  };

  const fetchFonctionData = async () => {
    setFonctionLoading(true);
    try {
      const response = await fetch(
        `http://localhost:8000/api/budget/visualisation_fonctionnement_5ans/?code_programme=${codeProgramme}&annee=${anneeDebut}&tri=${tri}`
      );
      const result = await response.json();

      // Complétez les années manquantes pour fonctionnement
      const years = Array.from({ length: 5 }, (_, i) => parseInt(anneeDebut, 10) + i);
      const completedData = years.map((year) =>
        result.find((item) => item.annee === year) || {
          annee: year,
          programme: codeProgramme,
          compte: null,
          code_compte: null,
          libelle: null,
          montant: 0,
          montant_apres_modification: 0,
          total_attachements: 0,
          modif_plus: 0,
          modif_moins: 0,
          credit: 0,
        }
      );

      setFonctionData(completedData);
    } catch (error) {
      console.error('Erreur lors de la récupération des données Fonctionnement:', error);
      setFonctionData([]);
    } finally {
      setFonctionLoading(false);
    }
  };

  useEffect(() => {
    if (anneeDebut && codeProgramme) {
      fetchInvestData();
      fetchFonctionData();
    }
  }, [anneeDebut, codeProgramme, tri]);

  const renderChart = (canvasRef, chartRef, data, label, title) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const labels = data.map(
      (item) => `${item.annee} - ${item.code_compte || 'N/A'} - ${item.libelle || 'Sans libellé'}`
    );
    const datasets = [
      {
        label,
        data: data.map((item) => item.montant),
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ];

    if (chartRef.current) {
      chartRef.current.destroy();
    }

    chartRef.current = new Chart(ctx, {
      type: 'bar',
      data: { labels, datasets },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: 'top' },
          title: {
            display: true,
            text: title,
            font: { size: 18 },
          },
        },
        scales: {
          x: { title: { display: true, text: 'Années' } },
          y: { title: { display: true, text: 'Montants (en Ar)', beginAtZero: true } },
        },
      },
    });
  };

  useEffect(() => {
    if (investData.length > 0) {
      renderChart(investCanvasRef, investChartRef, investData, 'Investissement', 'Investissements sur 5 ans');
    }
    if (fonctionData.length > 0) {
      renderChart(fonctionCanvasRef, fonctionChartRef, fonctionData, 'Fonctionnement', 'Fonctionnement sur 5 ans');
    }

    return () => {
      if (investChartRef.current) investChartRef.current.destroy();
      if (fonctionChartRef.current) fonctionChartRef.current.destroy();
    };
  }, [investData, fonctionData]);

  return (
    <div className="dashboard-page">
      <Sidebar />
      <div className="main-content">
        <Header />
        <div className="form-container">
          <h2 className="div-h2">Visualisation des Budgets sur 5 Ans</h2>
          <div className="form-group">
            <label htmlFor="anneeDebut">Année Début:</label>
            <input
              type="number"
              id="anneeDebut"
              value={anneeDebut}
              onChange={(e) => setAnneeDebut(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="codeProgramme">Code Programme:</label>
            <select
              id="codeProgramme"
              value={codeProgramme}
              onChange={(e) => setCodeProgramme(e.target.value)}
              required
            >
              <option value="">Sélectionner un programme</option>
              <option value="22">22</option>
              <option value="209">209</option>
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="tri">Tri par:</label>
            <select id="tri" value={tri} onChange={(e) => setTri(e.target.value)}>
              <option value="montant">Montant</option>
              <option value="compte">Compte</option>
            </select>
          </div>

          {investLoading ? (
            <p>Chargement des données Investissement...</p>
          ) : (
            <div className="charts-container" style={{ height: '400px' }}>
              <canvas ref={investCanvasRef}></canvas>
            </div>
          )}

          {fonctionLoading ? (
            <p>Chargement des données Fonctionnement...</p>
          ) : (
            <div className="charts-container" style={{ height: '400px' }}>
              <canvas ref={fonctionCanvasRef}></canvas>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default DashboardSuiviDepense;
