import React, { useState, useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';
import Header from './Header';
import Sidebar from './Sidebar';
import './css/EscalesParMois.css';
import './css/FormPage.css';

function DashboardSuiviStat() {
  const [escalesData, setEscalesData] = useState([]);
  const [marchandiseData, setMarchandiseData] = useState([]);
  const [error, setError] = useState(null);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const escalesChartRef = useRef(null);
  const escalesCanvasRef = useRef(null);
  const vasChartRef = useRef(null);
  const vasCanvasRef = useRef(null);

  // Fonction pour récupérer les données des escales
  const fetchEscalesData = () => {
    fetch(`http://localhost:8000/api/statistiqueBrutes/escales_par_mois/?year=${selectedYear}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Erreur lors du chargement des données');
        }
        return response.json();
      })
      .then((data) => setEscalesData(data))
      .catch((error) => setError(error.message));
  };

  // Fonction pour récupérer les données de gestion marchandise globale
  const fetchGestionMarchandiseGlobaleData = () => {
    fetch(`http://localhost:8000/api/statistiqueBrutes/gestion_marchandise_globale/?annee=${selectedYear}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Erreur lors du chargement des données de gestion marchandise globale');
        }
        return response.json();
      })
      .then((data) => setMarchandiseData(data))
      .catch((error) => setError(error.message));
  };

  // Fonction pour afficher le graphique des escales
  const renderEscalesChart = () => {
    const canvas = escalesCanvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const labels = [
      'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
      'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre',
    ];

    const navires = [...new Set(escalesData.map((item) => item.navire_name))];
    const datasets = navires.map((navire) => {
      const navireData = new Array(12).fill(0);
      escalesData.forEach((item) => {
        if (item.navire_name === navire) {
          navireData[item.month - 1] = item.total_escales;
        }
      });
      return {
        label: navire,
        data: navireData,
        backgroundColor: `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, 0.5)`,
        borderColor: 'rgba(0, 0, 0, 1)',
        borderWidth: 1,
      };
    });

    if (escalesChartRef.current) {
      escalesChartRef.current.destroy();
    }

    escalesChartRef.current = new Chart(ctx, {
      type: 'bar',
      data: {
        labels,
        datasets,
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            display: true,
            position: 'top',
          },
        },
        scales: {
          x: {
            title: {
              display: true,
              text: 'Mois',
            },
          },
          y: {
            title: {
              display: true,
              text: "Nombre d'escales",
            },
            beginAtZero: true,
          },
        },
      },
    });
  };

  // Fonction pour afficher l'histogramme des VAS
  const renderVASChart = () => {
    const canvas = vasCanvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const labels = marchandiseData.map((item) => item.nom_ville_provenance); // Noms des villes
    const vasData = marchandiseData.map((item) => item.quantite_facturee); // Quantités facturées

    if (vasChartRef.current) {
      vasChartRef.current.destroy();
    }

    vasChartRef.current = new Chart(ctx, {
      type: 'bar',
      data: {
        labels,
        datasets: [
          {
            label: 'Évolution des VAS',
            data: vasData,
            backgroundColor: 'rgba(75, 192, 192, 0.5)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            display: true,
            position: 'top',
          },
        },
        scales: {
          x: {
            title: {
              display: true,
              text: 'Ville de provenance',
            },
          },
          y: {
            title: {
              display: true,
              text: 'Quantité facturée',
            },
            beginAtZero: true,
          },
        },
      },
    });
  };

  useEffect(() => {
    fetchEscalesData();
    fetchGestionMarchandiseGlobaleData();
  }, [selectedYear]);

  useEffect(() => {
    if (escalesData.length > 0) {
      renderEscalesChart();
    }
    return () => {
      if (escalesChartRef.current) {
        escalesChartRef.current.destroy();
      }
    };
  }, [escalesData]);

  useEffect(() => {
    if (marchandiseData.length > 0) {
      renderVASChart();
    }
    return () => {
      if (vasChartRef.current) {
        vasChartRef.current.destroy();
      }
    };
  }, [marchandiseData]);

  return (
    <div className="dashboard-page">
      <Sidebar />
      <div className="main-content">
        <Header />
        <main className="form-container">
          <div className="div-h2">
            <h2>Nombre d'escales par mois</h2>
          </div>
          <div className="form-group">
            <label htmlFor="year">Saisir l'année :</label>
            <input
              type="number"
              id="year"
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              required
            />
          </div>
          {error && <p className="error-message">{error}</p>}
          {!error && <canvas id="escalesChart" ref={escalesCanvasRef}></canvas>}

          <div className="marchandise-section">
            <h2 className='div-h2'>Évolution des VAS</h2>
            {!error && <canvas id="vasChart" ref={vasCanvasRef}></canvas>}
          </div>
        </main>
      </div>
    </div>
  );
}

export default DashboardSuiviStat;
