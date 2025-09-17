<template>
  <div id="app-wrapper">
    <AppHeader />

    <div class="progress-bar-wrapper">
      <div 
        v-for="(step, index) in formStore.steps" 
        :key="index" 
        class="step" 
        :class="{ active: formStore.currentStep === index + 1, completed: formStore.currentStep > index + 1 }">
        <div class="step-number">{{ index + 1 }}</div>
        <div class="step-label">{{ step }}</div>
      </div>
    </div>
    
    <main>
      <FormularioEmprendedor />
    </main>

  </div>
</template>

<script setup>
import FormularioEmprendedor from './components/FormularioEmprendedor.vue';
import AppHeader from './components/AppHeader.vue';
import { useFormStore } from './stores/FormStore';

const formStore = useFormStore();
</script>

<style>
/* --- ESTILOS GLOBALES --- */
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap');
:root {
  --verde-principal: #1E4620;
  --dorado-acento: #F7B538;
  --texto-oscuro: #2c3e50;
  --texto-claro: #FFFFFF;
  --gris-borde: #EAEAEA;
}
body {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: 'Poppins', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  background-color: var(--verde-principal);
  background-image: linear-gradient(135deg, #1e4620 0%, #2a6f2d 100%);
  color: #333;
}

#app-wrapper {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  gap: 2rem; 
}

/* --- ESTILOS DE LA BARRA DE PROGRESO --- */
.progress-bar-wrapper {
  display: flex;
  justify-content: space-between;
  width: 100%;
  max-width: 800px;
  position: relative;
  margin: 0 auto;
  padding: 0 1rem;
  box-sizing: border-box;
}
.progress-bar-wrapper .step {
  text-align: center;
  position: relative;
  width: 100%;
  color: #a0aec0;
  transition: color 0.4s ease;
}
.progress-bar-wrapper .step-number {
  height: 40px;
  width: 40px;
  background-color: #fff;
  border: 2px solid #e2e8f0;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0 auto 10px;
  font-weight: 600;
  transition: all 0.4s ease;
  z-index: 1;
  position: relative;
}
.progress-bar-wrapper .step-label {
  font-size: 0.85rem;
  font-weight: 500;
  color: white;
  transition: opacity 0.3s ease;
}
.progress-bar-wrapper .step:not(:first-child):before {
  content: '';
  position: absolute;
  top: 19px;
  right: 50%;
  height: 2px;
  width: 100%;
  background-color: rgba(255, 255, 255, 0.3);
  z-index: 0;
  transition: background-color 0.4s ease;
}
.progress-bar-wrapper .step.completed .step-number {
  border-color: var(--dorado-acento);
  color: var(--dorado-acento);
  background-color: #fff;
}
.progress-bar-wrapper .step.completed .step-label {
  color: var(--dorado-acento);
}
.progress-bar-wrapper .step.completed::before {
  background-color: var(--dorado-acento);
}
.progress-bar-wrapper .step.active .step-number {
  background-color: var(--dorado-acento);
  border-color: var(--dorado-acento);
  color: var(--verde-principal);
  transform: scale(1.1);
}
.progress-bar-wrapper .step.active .step-label {
  color: var(--dorado-acento);
  font-weight: 700;
}

/* --- ESTILOS RESPONSIVOS --- */
@media (max-width: 768px) {
  #app-wrapper {
    gap: 1.5rem; /* Reducimos el espacio entre elementos */
  }
  main {
    padding: 0 0.5rem; /* Reducimos el padding lateral del main */
  }
  .progress-bar-wrapper .step-label {
    display: none; /* Ocultamos las etiquetas de texto, excelente idea */
  }
  .progress-bar-wrapper .step-number {
      margin-bottom: 0;
  }
}
</style>