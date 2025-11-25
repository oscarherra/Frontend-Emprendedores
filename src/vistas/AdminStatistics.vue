<template>
  <div class="h-100 d-flex flex-column">
    <!-- Estado: cargando -->
    <div
      v-if="isLoading"
      class="flex-grow-1 d-flex justify-content-center align-items-center"
    >
      <div class="text-center">
        <div
          class="spinner-border text-primary"
          style="width: 3rem; height: 3rem;"
          role="status"
        ></div>
        <h5 class="mt-3 text-muted">Calculando estadísticas...</h5>
      </div>
    </div>

    <!-- Estado: error -->
    <div
      v-else-if="error"
      class="flex-grow-1 d-flex justify-content-center align-items-center"
    >
      <div class="alert alert-danger text-center shadow-sm" role="alert">
        <h4 class="alert-heading mb-2">Error al cargar</h4>
        <p class="mb-0 small">{{ error }}</p>
      </div>
    </div>

    <!-- Contenido principal -->
    <div v-else-if="statsData" class="container-fluid py-4">
      <!-- KPIs -->
      <div class="row g-4 mb-4">
        <div
          class="col-md-3 col-sm-6"
          v-for="k in kpis"
          :key="k.label"
        >
          <div class="card kpi border-0 shadow-sm h-100">
            <div
              class="card-body d-flex flex-column justify-content-center text-center"
            >
              <div class="kpi-value">{{ k.value }}</div>
              <div class="kpi-label">{{ k.label }}</div>
            </div>
          </div>
        </div>
      </div>

     
      <div class="row g-4">
        <!-- Emprendimientos por sector (Bar) -->
        <div class="col-12">
          <div class="card border-0 shadow-sm h-100">
            <div class="card-body">
              <h5 class="card-title mb-3">Emprendimientos por sector</h5>
              <div class="chart-wrap">
                <Bar
                  v-if="sectorChartData.labels.length"
                  :data="sectorChartData"
                  :options="barOptions"
                />
              </div>
            </div>
          </div>
        </div>

        <!-- Emprendedores por distrito (Doughnut) -->
        <div class="col-12 col-xl-6">
          <div class="card border-0 shadow-sm h-100">
            <div class="card-body">
              <h5 class="card-title mb-3">Emprendedores por distrito</h5>
              <div class="chart-wrap position-relative">
                <Doughnut
                  v-if="distritoChartData.labels.length"
                  :data="distritoChartData"
                  :options="doughnutOptions"
                />
              </div>
            </div>
          </div>
        </div>

      </div> <!-- /row g-4 -->
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { Bar, Doughnut } from 'vue-chartjs'
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
  ArcElement
} from 'chart.js'

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
  ArcElement
)

const isLoading = ref(true)
const statsData = ref(null)
const error = ref(null)

/* ===== Paleta de colores ===== */
const COLORS = [
  '#2563eb',
  '#16a34a',
  '#f59e0b',
  '#ef4444',
  '#8b5cf6',
  '#06b6d4',
  '#f97316',
  '#64748b',
  '#10b981',
  '#3b82f6'
]

const rgba = (hex, a = 0.85) => {
  const h = hex.replace('#', '')
  const r = parseInt(h.substring(0, 2), 16)
  const g = parseInt(h.substring(2, 4), 16)
  const b = parseInt(h.substring(4, 6), 16)
  return `rgba(${r}, ${g}, ${b}, ${a})`
}


const baseText = '#334155'
const gridColor = '#e5e7eb'

const barOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false }
  },
  scales: {
    x: {
      ticks: { color: baseText },
      grid: { color: gridColor }
    },
    y: {
      beginAtZero: true,
      ticks: { precision: 0, color: baseText },
      grid: { color: gridColor }
    }
  }
}

const doughnutOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'bottom',
      labels: { color: baseText }
    }
  },
  cutout: '65%'
}


const kpis = computed(() => {
  const k = statsData.value?.kpis || {}
  return [
    {
      label: 'Emprendedores registrados',
      value: k.total_emprendedores ?? '—'
    },
    {
      label: 'Sectores distintos',
      value: statsData.value?.emprendimientos_por_sector?.length ?? '—'
    },
    {
      label: 'Distritos con presencia',
      value: statsData.value?.emprendedores_por_distrito?.length ?? '—'
    }
  ]
})

/* ===== Datos para gráficos ===== */
const sectorChartData = computed(() => {
  const data = statsData.value?.emprendimientos_por_sector || []
  const bg = data.map((_, i) => rgba(COLORS[i % COLORS.length]))
  const border = data.map((_, i) => COLORS[i % COLORS.length])

  return {
    labels: data.map(i => i.nombre_sector || '—'),
    datasets: [
      {
        label: 'Emprendimientos',
        data: data.map(i => i.total),
        backgroundColor: bg,
        borderColor: border,
        borderWidth: 1
      }
    ]
  }
})

const distritoChartData = computed(() => {
  const data = statsData.value?.emprendedores_por_distrito || []
  const bg = data.map((_, i) => rgba(COLORS[i % COLORS.length]))
  const border = data.map((_, i) => COLORS[i % COLORS.length])

  return {
    labels: data.map(i => i.distrito || '—'),
    datasets: [
      {
        label: 'Emprendedores',
        data: data.map(i => i.total),
        backgroundColor: bg,
        borderColor: border,
        borderWidth: 1
      }
    ]
  }
})

/* ===== Fetch de estadísticas ===== */
const fetchStatistics = async () => {
  isLoading.value = true
  error.value = null

  const authToken = localStorage.getItem('auth_token')

  try {
    const response = await fetch(
      import.meta?.env?.VITE_API_STATS_URL ||
        'http://127.0.0.1:8000/api/statistics',
      {
        headers: {
          Authorization: `Bearer ${authToken}`,
          Accept: 'application/json'
        }
      }
    )

    if (!response.ok) {
      throw new Error(
        `Error ${response.status}: No se pudieron cargar los datos.`
      )
    }

    const result = await response.json()
    statsData.value = result.data
  } catch (err) {
    console.error('Error al cargar estadísticas:', err)
    error.value = err.message
  } finally {
    isLoading.value = false
  }
}

onMounted(fetchStatistics)
</script>

<style scoped>
.card {
  border-radius: 1rem;
}

.kpi .kpi-value {
  font-size: 2.25rem;
  font-weight: 700;
  line-height: 1;
}

.kpi .kpi-label {
  color: #6c757d;
  font-weight: 500;
  margin-top: 0.25rem;
}

.card-title {
  font-weight: 600;
  color: #2d2d2d;
}

.chart-wrap {
  height: 360px;
  position: relative;
}

.chart-total {
  color: #334155;
}
</style>
