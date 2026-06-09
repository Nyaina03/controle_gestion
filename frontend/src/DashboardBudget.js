import React, { useState, useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';
import Sidebar from './Sidebar';
import Header from './Header';
import './css/Dashboard.css';

function DashboardBudget() {
  const [anneeDebut, setAnneeDebut] = useState('');
  const [data, setData] = useState([]);
  const [expensesData, setExpensesData] = useState([]);
  const [loading, setLoading] = useState(false);
  const chartRef = useRef(null);
  const canvasRef = useRef(null);
  const pieChartRef = useRef(null);
  const pieCanvasRef = useRef(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await fetch(`http://localhost:8000/api/budget/budget_5ans/${anneeDebut}/`);
      const result = await response.json();
      setData(Array.isArray(result) ? result : []);
    } catch (error) {
      console.error('Erreur lors de la récupération des données:', error);
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchExpensesData = async () => {
    try {
        const response = await fetch(`http://localhost:8000/api/realisationBudget/depenses_siig_5ans/?annee=${anneeDebut}`);
      const result = await response.json();
      setExpensesData(result);
    } catch (error) {
      console.error('Erreur lors de la récupération des dépenses:', error);
      setExpensesData([]);
    }
  };

  useEffect(() => {
    if (anneeDebut) {
      fetchData();
      fetchExpensesData();
    }
  }, [anneeDebut]);

  const renderChart = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const labels = data.map((item) => item.libelle);
    const anneeDebutInt = parseInt(anneeDebut, 10);
    const years = Array.from({ length: 5 }, (_, i) => (anneeDebutInt + i).toString());

    const datasets = years.map((year, index) => ({
      label: year,
      data: data.map((item) => (item.annee === parseInt(year) ? item.montant : 0)),
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
          legend: { position: 'top', labels: { font: { size: 14 } } },
          title: {
            display: true,
            text: 'Budget par Année',
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
          x: { title: { display: true, text: 'Budgets', font: { size: 16 } } },
          y: {
            title: { display: true, text: 'Montants (en Ar)', font: { size: 16 } },
            beginAtZero: true,
            ticks: { callback: (value) => value.toLocaleString('fr-FR') },
          },
        },
      },
    });
  };

  const renderPieChart = () => {
    const canvas = pieCanvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const labels = expensesData.map((item) => item.grande_rubrique);
    const dataValues = expensesData.map((item) => parseFloat(item.montant) || 0);

    if (pieChartRef.current) {
      pieChartRef.current.destroy();
    }

    pieChartRef.current = new Chart(ctx, {
      type: 'pie',
      data: {
        labels,
        datasets: [
          {
            label: 'Dépenses par Rubrique',
            data: dataValues,
            backgroundColor: [
              'rgba(255, 99, 132, 0.6)',
              'rgba(54, 162, 235, 0.6)',
              'rgba(255, 206, 86, 0.6)',
              'rgba(75, 192, 192, 0.6)',
              'rgba(153, 102, 255, 0.6)',
            ],
            borderColor: [
              'rgba(255, 99, 132, 1)',
              'rgba(54, 162, 235, 1)',
              'rgba(255, 206, 86, 1)',
              'rgba(75, 192, 192, 1)',
              'rgba(153, 102, 255, 1)',
            ],
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          title: {
            display: true,
            text: 'Répartition des Dépenses',
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

  useEffect(() => {
    if (expensesData.length > 0) {
      renderPieChart();
    }
    return () => {
      if (pieChartRef.current) {
        pieChartRef.current.destroy();
      }
    };
  }, [expensesData]);

  return (
    <div className="dashboard-page">
      <Sidebar />
      <div className="main-content">
        <Header />
        <div className="form-container">
          <div className="dashboard-content">
            <h2 className='div-h2'>Graphes Dépenses</h2>

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

            {loading ? (
              <p>Chargement des données...</p>
            ) : (
              <div className="charts-container" style={{ display: 'flex', gap: '20px' }}>
                <div className="chart-section" style={{ flex: 1, height: '600px' }}>
                  <h3>Histogramme des budgets annuels</h3>
                  <canvas ref={canvasRef}></canvas>
                </div>
                {anneeDebut && (
                  <div className="chart-section" style={{ flex: 1, height: '600px' }}>
                    <h3>Camembert des dépenses</h3>
                    <canvas ref={pieCanvasRef}></canvas>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardBudget;
