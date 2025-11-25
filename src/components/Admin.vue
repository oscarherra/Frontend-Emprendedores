<template>
  <div class="d-flex" id="admin-layout">
    <!-- BARRA LATERAL DE NAVEGACIÓN -->
    <div class="sidebar">
      <div>
        <h4 class="text-center pt-3">Admin Panel</h4>
        <hr class="text-secondary" />

        <!-- Navegación exacta -->
        <router-link 
          to="/admin/emprendedores" 
          class="nav-link" 
          active-class="router-link-exact-active"
        >
          <i class="bi bi-people-fill me-2"></i>Emprendedores
        </router-link>

        <router-link 
          to="/admin/estadisticas" 
          class="nav-link" 
          active-class="router-link-exact-active"
        >
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

    <!-- CONTENIDO DINÁMICO -->
    <div class="main-content p-4">
      <router-view />
    </div>
  </div>
</template>

<script setup>
const logout = () => {
  localStorage.removeItem('auth_token');
  window.location.href = '/login';
};
</script>

<style scoped>
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

/* Enlaces base */
.sidebar .nav-link {
  color: #bdc3c7;
  text-decoration: none;
  display: flex;
  align-items: center;
  padding: 10px 20px;
  border-radius: 6px;
  transition: background-color 0.25s, color 0.25s;
}

/* Hover */
.sidebar .nav-link:hover {
  background: #34495e;
  color: white;
}

/* ✅ Se activa solo la ruta exacta */
.sidebar .nav-link.router-link-exact-active {
  background: #0d6efd;
  color: #fff !important;
  font-weight: 500;
}

/* Cerrar sesión */
.logout-btn:hover {
  background-color: #c82333 !important;
  color: #fff;
}

.main-content {
  flex: 1;
  min-width: 0;
  overflow-y: auto;
  background-color: #ffffff;
}
</style>
