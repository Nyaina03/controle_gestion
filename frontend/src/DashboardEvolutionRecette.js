import React, { useState, useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';
import Sidebar from './Sidebar';
import Header from './Header';
import './css/Dashboard.css';

function DashboardEvolutionRecette() {
  const [anneeDebut, setAnneeDebut] = useState('');
  const [tva, setTVA] = useState('');
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const chartRef = useRef(null);
  const canvasRef = useRef(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `http://localhost:8000/api/recetteGasynetApmf/etat-global/?anneeDebut=${anneeDebut}&tva=${tva}`
      );
      const result = await response.json();
      setData(Array.isArray(result) ? result : []);
    } catch (error) {
      console.error('Erreur lors de la récupération des données:', error);
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (anneeDebut && tva) {
      fetchData();
    }
  }, [anneeDebut, tva]);

  const renderChart = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
  
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
  
    const labels = data.map((item) => item.compte);
  
    // Générer dynamiquement les années à partir de l'année de début
    const anneeDebutInt = parseInt(anneeDebut, 10); // Convertir en entier
    const years = Array.from({ length: 5 }, (_, i) => (anneeDebutInt + i).toString());
  
    const datasets = years.map((year, index) => ({
      label: year,
      data: data.map((item) => item[year] || 0),
      backgroundColor: `rgba(${100 + index * 30}, ${150 - index * 20}, ${200 + index * 10}, 0.6)`,
      borderColor: `rgba(${100 + index * 30}, ${150 - index * 20}, ${200 + index * 10}, 1)`,
      borderWidth: 1,
    }));
  
    if (chartRef.current) {
      chartRef.current.destroy();
    }
  
    chartRef.current = new Chart(ctx, {
      type: 'bar',
      data: {
        labels,
        datasets,
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'top',
            labels: {
              font: { size: 14 },
            },
          },
          title: {
            display: true,
            text: 'État Global des Recettes par Année',
            font: { size: 18 },
          },
          tooltip: {
            callbacks: {
              label: (tooltipItem) => {
                const value = tooltipItem.raw || 0;
                return `${value.toLocaleString('fr-FR')} Ar`;
              },
            },
          },
        },
        scales: {
          x: {
            title: { display: true, text: 'Comptes des recettes', font: { size: 16 } },
            ticks: { font: { size: 12 } },
          },
          y: {
            title: { display: true, text: 'Montants (en Ar)', font: { size: 16 } },
            beginAtZero: true,
            ticks: {
              font: { size: 12 },
              callback: (value) => value.toLocaleString('fr-FR'),
            },
          },
        },
      },
    });
  };
  

  useEffect(() => {
    if (data.length > 0) {
      renderChart();
    }
    return () => {
      if (chartRef.current) {
        chartRef.current.destroy();
      }
    };
  }, [data]);

  return (
    <div className="dashboard-page">
      <Sidebar />
      <div className="main-content">
        <Header />
        <div className="form-container">
          <div className="dashboard-content">
            <h2 className="div-h2">État global des recettes</h2>

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
              <label htmlFor="tva">TVA:</label>
              <select
                id="tva"
                value={tva}
                onChange={(e) => setTVA(e.target.value)}
                required
              >
                <option value="">Choisissez</option>
                <option value="avec">Avec</option>
                <option value="sans">Sans</option>
              </select>
            </div>

            {loading ? (
              <p>Chargement des données...</p>
            ) : (
              <div className="chart-section" style={{ height: '600px', width: '100%' }}>
                <h3>Histogramme des montants annuels</h3>
                <canvas ref={canvasRef}></canvas>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardEvolutionRecette;
