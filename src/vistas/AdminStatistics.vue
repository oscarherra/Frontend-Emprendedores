<template>
  <div class="h-100 d-flex flex-column">
    
    <div v-if="isLoading" class="flex-grow-1 d-flex justify-content-center align-items-center">
      <div class="text-center">
        <div class="spinner-border text-primary" style="width: 3rem; height: 3rem;" role="status"></div>
        <h4 class="mt-3 text-muted">Calculando estadísticas...</h4>
      </div>
    </div>

    <div v-else-if="error" class="flex-grow-1 d-flex justify-content-center align-items-center">
        <div class="alert alert-warning text-center" role="alert">
            <h4 class="alert-heading"><i class="bi bi-exclamation-triangle-fill"></i> ¡Error!</h4>
            <p>{{ error }}</p>
        </div>
    </div>

    <div v-else-if="statsData" class="container-fluid py-3">
      <div class="row mb-4">
        <div class="col-lg-6 mb-4 mb-lg-0">
          <div class="card text-center text-white bg-primary shadow-sm h-100">
            <div class="card-body">
              <h1 class="display-4">{{ statsData.kpis.total_emprendedores }}</h1>
              <p class="card-title fs-5">Emprendedores Registrados</p>
            </div>
          </div>
        </div>
        <div class="col-lg-6">
          <div class="card text-center text-white bg-success shadow-sm h-100">
            <div class="card-body">
              <h1 class="display-4">{{ statsData.kpis.total_emprendimientos }}</h1>
              <p class="card-title fs-5">Emprendimientos Activos</p>
            </div>
          </div>
        </div>
      </div>

      <div class="row">
        <div class="col-12">
          <div class="card shadow-sm">
            <div class="card-body">
              <h5 class="card-title">Emprendimientos por Sector</h5>
              <div style="height: 400px;">
                <Bar v-if="sectorChartData.labels.length" :data="sectorChartData" :options="chartOptions" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { Bar } from 'vue-chartjs';
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js';

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale);

const isLoading = ref(true);
const statsData = ref(null);
const error = ref(null);

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { position: 'top' },
    title: { display: true, text: 'Distribución de Emprendimientos' }
  }
};

const sectorChartData = computed(() => {
  if (!statsData.value) return { labels: [], datasets: [] };
  const data = statsData.value.emprendimientos_por_sector;
  return {
    labels: data.map(item => item.nombre_sector),
    datasets: [{
      label: 'Nº de Emprendimientos',
      backgroundColor: ['#0d6efd', '#198754', '#ffc107', '#dc3545', '#6f42c1'],
      borderRadius: 4,
      data: data.map(item => item.total)
    }]
  };
});

const fetchStatistics = async () => {
  isLoading.value = true;
  error.value = null;
  const authToken = localStorage.getItem('auth_token');
  try {
    const response = await fetch('http://127.0.0.1:8000/api/statistics', {
      headers: { 'Authorization': `Bearer ${authToken}`, 'Accept': 'application/json' },
    });
    if (!response.ok) {
        throw new Error(`Error ${response.status}: No se pudieron cargar los datos.`);
    }
    const result = await response.json();
    statsData.value = result.data;
  } catch (err) {
    console.error("Error al cargar estadísticas:", err);
    error.value = err.message;
  } finally {
    isLoading.value = false;
  }
};

onMounted(fetchStatistics);
</script>

<style scoped>
.card {
  box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.075);
  border: none;
}
.display-4 {
  font-weight: 300;
}
</style>