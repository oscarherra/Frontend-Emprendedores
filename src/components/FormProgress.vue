<template>
  <div class="progress-container">
    <div class="step" v-for="step in steps" :key="step.id" :class="getStepClass(step.id)">
      <div class="step-circle">{{ step.id }}</div>
      <div class="step-label">{{ step.label }}</div>
    </div>
    <div class="progress-line"></div>
  </div>
</template>

<script setup>
import { useFormStore } from '@/stores/FormStore';

const formStore = useFormStore();

const steps = [
  { id: 1, label: 'Información General' },
  { id: 2, label: 'Info. del Emprendimiento' },
  { id: 3, label: 'Formalización' },
  { id: 4, label: 'Necesidades y Proyecciones' },
];

const getStepClass = (stepId) => {
  if (stepId < formStore.currentStep) {
    return 'completed';
  } else if (stepId === formStore.currentStep) {
    return 'active';
  }
  return '';
};
</script>

<style scoped>
.progress-container {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  position: relative;
  width: 80%;
  max-width: 900px;
  margin: 0 auto; 
  padding: 0 20px;
}

.progress-line {
  position: absolute;
  top: 20px;
  left: 10%;
  right: 10%;
  height: 4px;
  /* CAMBIO: Línea de progreso más clara */
  background-color: rgba(255, 255, 255, 0.25);
  z-index: 1;
}

.step {
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  z-index: 2;
  text-align: center;
  width: 150px;
}

.step-circle {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: transparent; 
  /* CAMBIO: Borde y texto más claros */
  border: 3px solid rgba(255, 255, 255, 0.5);
  color: rgba(255, 255, 255, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  transition: all 0.4s ease;
  margin-bottom: 0.75rem;
}

.step-label {
  font-size: 0.85rem;
  font-weight: 500;
  /* CAMBIO: Texto de la etiqueta más claro */
  color: rgba(255, 255, 255, 0.7);
}

/* Estado Activo */
.step.active .step-circle {
  border-color: var(--dorado-acento, #FFC107);
  background-color: var(--dorado-acento, #FFC107);
  color: var(--verde-principal, #2E7D32);
  transform: scale(1.1);
}

.step.active .step-label {
  /* CAMBIO: El texto activo ahora es blanco para máximo contraste */
  color: white;
  font-weight: 700;
}

/* Estado Completado */
.step.completed .step-circle {
  border-color: var(--dorado-acento, #FFC107);
  background-color: transparent;
  color: var(--dorado-acento, #FFC107);
}

.step.completed .step-label {
    color: rgba(255, 255, 255, 0.9);
}


@media (max-width: 768px) {
  .progress-container {
    width: 95%;
  }
  .step-label {
    font-size: 0.75rem;
  }
}
</style>