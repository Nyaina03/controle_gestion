import React, { useState, useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';
import Header from './Header';
import Sidebar from './Sidebar';
import './css/EscalesParMois.css';
import './css/FormPage.css';

function EscalesParMois() {
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const chartRef = useRef(null);
  const canvasRef = useRef(null); // Référence pour le canvas

  const fetchEscalesData = () => {
    fetch(`http://localhost:8000/api/statistiqueBrutes/escales_par_mois/?year=${selectedYear}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Erreur lors du chargement des données');
        }
        return response.json();
      })
      .then((data) => setData(data))
      .catch((error) => setError(error.message));
  };

  const renderChart = () => {
    const canvas = canvasRef.current;
    if (!canvas) return; // Vérifiez que le canvas existe

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const labels = [
      'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
      'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
    ];

    const navires = [...new Set(data.map(item => item.navire_name))];
    const datasets = navires.map(navire => {
      const navireData = new Array(12).fill(0);
      data.forEach(item => {
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
              text: 'Nombre d\'escales',
            },
            beginAtZero: true,
            min: 0,
            max: 50,
            ticks: {
              stepSize: 10,
            },
          },
        },
      },
    });
  };

  useEffect(() => {
    fetchEscalesData();
  }, [selectedYear]);

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
          {!error && <canvas id="escalesChart" ref={canvasRef}></canvas>}
        </main>
      </div>
    </div>
  );
}

export default EscalesParMois;
