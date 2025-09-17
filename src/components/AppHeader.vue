<template>
  <header class="main-header">
    <div class="header-content">
      <div class="logo-area">
        <img src="@/assets/logo.png" alt="Logo Municipalidad" class="municipal-logo">
        <h2 class="header-title">Departamento Desarrollo local y Fomentación a Mipymes</h2>
      </div>
    </div>
  </header>
</template>

<script setup>
// No se necesita lógica de script para este componente.
</script>

<style scoped>
.main-header {
  width: 100%;
  padding: 1rem 0;
  background-color: var(--verde-principal);
  border-bottom: 3px solid var(--dorado-acento);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.25);
  box-sizing: border-box;
}

.header-content {
  width: 100%;
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 2rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-sizing: border-box;
}

.logo-area {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.municipal-logo {
  height: 55px;
  width: auto;
  object-fit: contain;
  transition: transform 0.3s ease;
}

.municipal-logo:hover {
  transform: scale(1.05);
}

.header-title {
  margin: 0;
  font-size: 1.6rem;
  font-weight: 600;
  color: var(--texto-claro);
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.2);
}

/* --- ESTILOS RESPONSIVOS --- */
@media (max-width: 768px) {
  .header-content {
    /* Centramos el contenido en móvil */
    justify-content: center;
    padding: 0 1rem;
  }

  .main-header {
    padding: 0.8rem 0;
  }

  .header-title {
    font-size: 1.1rem; /* Reducimos un poco más el texto */
    text-align: center;
  }

  .municipal-logo {
    height: 45px; /* Hacemos el logo más pequeño */
  }
}
</style>