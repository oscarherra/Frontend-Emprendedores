<template>
  <div class="d-flex" id="admin-layout">
    <!-- BARRA LATERAL DE NAVEGACIÓN -->
    <div class="sidebar">
      <div>
        <h4 class="text-center pt-3">Admin Panel</h4>
        <hr class="text-secondary" />
        
        <!-- 
          USAREMOS <router-link> EN LUGAR DE <a>
          Es el componente de Vue Router para la navegación. 'to' especifica la ruta.
          Automáticamente añade una clase 'router-link-active' al enlace activo.
        -->
        <router-link to="/admin" class="nav-link">
          <i class="bi bi-people-fill me-2"></i>Emprendedores
        </router-link>
        <router-link to="/admin/estadisticas" class="nav-link">
          <i class="bi bi-bar-chart-fill me-2"></i>Estadísticas
        </router-link>
      </div>
      <div>
        <hr class="text-secondary" />
        <a href="#" @click.prevent="logout" class="nav-link logout-btn">
          <i class="bi bi-box-arrow-left me-2"></i>Cerrar Sesión
        </a>
      </div>
    </div>

    <!-- ÁREA DE CONTENIDO DINÁMICO -->
    <div class="main-content p-4">
      <!-- 
        ¡ESTA ES LA CLAVE!
        El componente <router-view> es el "hueco" donde Vue Router renderizará
        el componente hijo que corresponda a la URL actual
        (AdminEmprendedores.vue o AdminStatistics.vue).
      -->
      <router-view />
    </div>
  </div>
</template>

<script setup>
const logout = () => {
  localStorage.removeItem('auth_token');
  window.location.href = '/login'; // Redirige al login
};
</script>

<style scoped>
/* Estilos específicos para el layout del admin */
#admin-layout {
  height: 100vh;
}
.sidebar {
  width: 250px;
  background: #2c3e50;
  color: white;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding-bottom: 1rem;
}
.sidebar .nav-link {
  color: #bdc3c7;
  text-decoration: none;
  display: flex;
  align-items: center;
  padding: 10px 20px;
  transition: background-color 0.2s;
}
.sidebar .nav-link:hover {
  background: #34495e;
  color: white;
}
/* Vue Router añade esta clase automáticamente al enlace activo */
.sidebar .nav-link.router-link-active {
  background: #0d6efd;
  color: white;
  font-weight: 500;
}
.logout-btn:hover {
  background-color: #c82333 !important;
}
.main-content {
  flex: 1; 
  min-width: 0; 
  overflow-y: auto;
  background-color: #ffffff;
}
</style>