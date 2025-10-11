<template>
  <!-- Contenedor principal de la VISTA que define el layout y el fondo verde -->
  <div id="public-form-layout">
    <AppHeader />

    <!-- Barra de Progreso -->
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
    
    <!-- El formulario blanco principal -->
    <main class="form-container">
      <div class="form-header">
        <h1>Registro de Emprendedores</h1>
        <p>Completa la siguiente información para formar parte de nuestra comunidad.</p>
      </div>

      <form v-if="!formStore.isFormSubmitted" @submit.prevent="formStore.submitForm" class="entrepreneur-form" novalidate>

        <div v-show="formStore.currentStep === 1">
          <fieldset>
            <legend>1. Información General</legend>
            <div class="form-grid">
              <!-- CAMPO NOMBRE -->
              <div class="form-group">
                <label for="nombre">Nombre*</label>
                <input type="text" id="nombre" v-model="formStore.formData.informacionGeneral.nombre" required>
              </div>
              <!-- CAMPO APELLIDO 1 -->
              <div class="form-group">
                <label for="apellido1">Primer Apellido*</label>
                <input type="text" id="apellido1" v-model="formStore.formData.informacionGeneral.apellido1" required>
              </div>
              <!-- CAMPO APELLIDO 2 -->
              <div class="form-group">
                <label for="apellido2">Segundo Apellido*</label>
                <input type="text" id="apellido2" v-model="formStore.formData.informacionGeneral.apellido2" required>
              </div>

              <div class="form-group">
                <label for="cedula">Cédula de identidad*</label>
                <input type="text" id="cedula" v-model="formStore.formData.informacionGeneral.cedula" required>
              </div>
              <div class="form-group">
                <label for="fechaNacimiento">Fecha de nacimiento*</label>
                <input type="date" id="fechaNacimiento" v-model="formStore.formData.informacionGeneral.fechaNacimiento" required>
              </div>
              <div class="form-group">
                <label for="edad">Edad*</label>
                <input type="number" id="edad" v-model.number="formStore.formData.informacionGeneral.edad" required>
              </div>
              <div class="form-group">
                <label for="sexo">Sexo*</label>
                <select id="sexo" v-model="formStore.formData.informacionGeneral.sexo" required>
                  <option disabled value="">Seleccione una opción</option>
                  <option>Masculino</option>
                  <option>Femenino</option>
                  <option>Otro</option>
                </select>
              </div>

              <!-- CAMPO TELÉFONO SEPARADO -->
              <div class="form-group">
                <label for="telefono">Número de teléfono*</label>
                <input type="tel" id="telefono" v-model="formStore.formData.informacionGeneral.telefono" required>
              </div>
              <!-- CAMPO CORREO SEPARADO -->
              <div class="form-group">
                <label for="correo">Correo electrónico</label>
                <input type="email" id="correo" v-model="formStore.formData.informacionGeneral.correo_electronico">
              </div>
            </div>
            <div class="form-group">
              <label for="direccion">Dirección de la actividad.*</label>
              <input type="text" id="direccion" v-model="formStore.formData.informacionGeneral.direccion" required>
            </div>
            <div class="form-grid">
              <div class="form-group">
                <label for="distrito">Distrito al que pertenece*</label>
                <select id="distrito" v-model="formStore.formData.informacionGeneral.distrito" required>
                  <option disabled value="">Seleccione un distrito</option>
                  <option v-for="distrito in distritosOptions" :key="distrito" :value="distrito">
                    {{ distrito }}
                  </option>
                </select>
              </div>
              <div class="form-group">
                <label for="comunidad">¿Comunidad?*</label>
                <input type="text" id="comunidad" v-model="formStore.formData.informacionGeneral.comunidad" required>
              </div>
            </div>
          </fieldset>
        </div>

        <!-- Paso 2: Información del Emprendimiento -->
        <div v-show="formStore.currentStep === 2">
           <fieldset>
             <legend>2. Información del Emprendimiento</legend>
             <div class="form-grid">
               <div class="form-group">
                 <label for="nombreNegocio">Nombre del negocio o emprendimiento*</label>
                 <input type="text" id="nombreNegocio" v-model="formStore.formData.infoEmprendimiento.nombreNegocio" required>
               </div>
               <div class="form-group">
                 <label class="group-label">Tipo de emprendimiento*</label>
                 <div class="radio-options-wrapper">
                   <div class="radio-option">
                     <input type="radio" id="individual" value="Individual" v-model="formStore.formData.infoEmprendimiento.tipo" required>
                     <label for="individual">Individual</label>
                   </div>
                   <div class="radio-option">
                     <input type="radio" id="colectivo" value="Colectivo" v-model="formStore.formData.infoEmprendimiento.tipo">
                     <label for="colectivo">Colectivo</label>
                   </div>
                 </div>
               </div>
             </div>
             <div class="form-group">
               <label for="descripcion">Descripción breve del emprendimiento*</label>
               <textarea id="descripcion" v-model="formStore.formData.infoEmprendimiento.descripcion" rows="4" required></textarea>
             </div>
             <div class="form-grid">
               <div class="form-group">
                 <label for="nivelEducativo">Nivel Educativo</label>
                 <select id="nivelEducativo" v-model="formStore.formData.infoEmprendimiento.nivelEducativo">
                   <option disabled value="">Seleccione un nivel</option>
                   <option>Primaria Incompleta</option>
                   <option>Primaria Completa</option>
                   <option>Secundaria Incompleta</option>
                   <option>Secundaria Completa</option>
                   <option>Universidad Incompleta</option>
                   <option>Universidad Completa</option>
                 </select>
               </div>
               <div class="form-group">
                 <label for="anoInicio">Año de inicio</label>
                 <input type="number" id="anoInicio" v-model.number="formStore.formData.infoEmprendimiento.anoInicio" placeholder="Ej: 2020">
               </div>
             </div>
             <div class="form-group">
               <label>Imágenes del emprendimiento (máximo 4)</label>
               <div class="image-uploader-container">
                 <div v-if="imagePreviews.length > 0" class="image-previews-container">
                   <div v-for="(preview, index) in imagePreviews" :key="index" class="preview-item">
                     <img :src="preview" class="preview-image" alt="Vista previa">
                     <button type="button" @click="removeImage(index)" class="remove-button">&times;</button>
                   </div>
                 </div>
                 <label for="imagenes" class="upload-label" v-if="!formStore.imageFiles || formStore.imageFiles.length < 4">
                   <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                   <span>Añadir imágenes</span>
                 </label>
                 <input type="file" id="imagenes" multiple @change="handleImageUpload" accept="image/*" class="hidden-input">
               </div>
             </div>
             <div class="form-grid">
               <div class="form-group">
                 <label class="group-label">¿Tiene Logo?*</label>
                 <div class="radio-options-wrapper">
                   <div class="radio-option">
                     <input type="radio" id="logoSi" value="Si" v-model="formStore.formData.infoEmprendimiento.logo" required><label for="logoSi">Sí</label>
                   </div>
                   <div class="radio-option">
                     <input type="radio" id="logoNo" value="No" v-model="formStore.formData.infoEmprendimiento.logo"><label for="logoNo">No</label>
                   </div>
                 </div>
               </div>
               <div class="form-group">
                 <label class="group-label">¿Tiene Slogan?*</label>
                 <div class="radio-options-wrapper">
                   <div class="radio-option">
                     <input type="radio" id="sloganSi" value="Si" v-model="formStore.formData.infoEmprendimiento.slogan" required><label for="sloganSi">Sí</label>
                   </div>
                   <div class="radio-option">
                     <input type="radio" id="sloganNo" value="No" v-model="formStore.formData.infoEmprendimiento.slogan"><label for="sloganNo">No</label>
                   </div>
                 </div>
               </div>
             </div>
             <div class="form-group">
               <label for="sector">Sector*</label>
               <div class="sector-selector-container">
                 <button type="button" v-for="sector in sectorOptions" :key="sector.name" class="sector-button" :class="{ selected: formStore.formData.infoEmprendimiento.sector === sector.name }" @click="formStore.formData.infoEmprendimiento.sector = sector.name">
                   <div class="icon-wrapper" v-html="sector.icon"></div>
                   <span class="sector-label">{{ sector.name }}</span>
                 </button>
               </div>
             </div>
             <div v-if="formStore.formData.infoEmprendimiento.sector === 'Cultural'" class="form-group indented">
               <label>Si pertenece al sector cultural, especifique cuál:</label>
               <div class="checkbox-grid">
                 <div v-for="opcion in sectoresCulturales" :key="opcion">
                   <input type="checkbox" :id="opcion" :value="opcion" v-model="formStore.formData.infoEmprendimiento.especificacionCultural">
                   <label :for="opcion">{{ opcion }}</label>
                 </div>
               </div>
               <input type="text" placeholder="Otros, especifique..." v-model="formStore.formData.infoEmprendimiento.otroCultural" class="otro-input">
             </div>
             <div class="form-group">
               <label for="numEmpleados">Número de empleados</label>
               <input type="number" id="numEmpleados" v-model.number="formStore.formData.infoEmprendimiento.numEmpleados">
             </div>
             <div class="form-grid">
               <div class="form-group">
                 <label class="group-label">¿Tiene Sillas?</label>
                 <div class="radio-options-wrapper">
                   <div class="radio-option">
                     <input type="radio" id="sillasSi" value="Si" v-model="formStore.formData.infoEmprendimiento.utileria.sillas">
                     <label for="sillasSi">Sí</label>
                   </div>
                   <div class="radio-option">
                     <input type="radio" id="sillasNo" value="No" v-model="formStore.formData.infoEmprendimiento.utileria.sillas">
                     <label for="sillasNo">No</label>
                   </div>
                 </div>
               </div>
               <div class="form-group">
                 <label class="group-label">¿Tiene Mesas?</label>
                 <div class="radio-options-wrapper">
                   <div class="radio-option">
                     <input type="radio" id="mesasSi" value="Si" v-model="formStore.formData.infoEmprendimiento.utileria.mesas">
                     <label for="mesasSi">Sí</label>
                   </div>
                   <div class="radio-option">
                     <input type="radio" id="mesasNo" value="No" v-model="formStore.formData.infoEmprendimiento.utileria.mesas">
                     <label for="mesasNo">No</label>
                   </div>
                 </div>
               </div>
               <div class="form-group">
                 <label class="group-label">¿Tiene Toldo?</label>
                 <div class="radio-options-wrapper">
                   <div class="radio-option">
                     <input type="radio" id="toldoSi" value="Si" v-model="formStore.formData.infoEmprendimiento.utileria.toldo">
                     <label for="toldoSi">Sí</label>
                   </div>
                   <div class="radio-option">
                     <input type="radio" id="toldoNo" value="No" v-model="formStore.formData.infoEmprendimiento.utileria.toldo">
                     <label for="toldoNo">No</label>
                   </div>
                 </div>
               </div>
             </div>
             <div class="form-group">
               <label class="group-label">¿Ha participado en alguna feria de emprendedores?</label>
               <div class="radio-options-wrapper">
                 <div class="radio-option">
                   <input type="radio" id="feriaSi" value="Si" v-model="formStore.formData.infoEmprendimiento.participoFeria">
                   <label for="feriaSi">Sí</label>
                 </div>
                 <div class="radio-option">
                   <input type="radio" id="feriaNo" value="No" v-model="formStore.formData.infoEmprendimiento.participoFeria">
                   <label for="feriaNo">No</label>
                 </div>
               </div>
             </div>
             <div v-if="formStore.formData.infoEmprendimiento.participoFeria === 'Si'" class="form-group indented">
               <label for="cualesFerias">Si contestó que sí, ¿en cuáles ha participado?</label>
               <input type="text" id="cualesFerias" v-model="formStore.formData.infoEmprendimiento.cualesFerias">
             </div>
             <div class="form-group">
               <label for="signosExternos">¿Cuenta con signos externos? (tarjetas, banner, etc)</label>
               <input type="text" id="signosExternos" v-model="formStore.formData.infoEmprendimiento.signosExternos">
             </div>
             <div class="form-group">
               <label for="certificaciones">¿Tiene certificaciones?</label>
               <input type="text" id="certificaciones" v-model="formStore.formData.infoEmprendimiento.certificaciones">
             </div>
             <label class="sub-legend">Redes Sociales / Sitio Web</label>
             <div class="form-grid-social">
               <div class="form-group"><label for="facebook">Facebook</label><input type="text" id="facebook" v-model="formStore.formData.infoEmprendimiento.redes.facebook"></div>
               <div class="form-group"><label for="instagram">Instagram</label><input type="text" id="instagram" v-model="formStore.formData.infoEmprendimiento.redes.instagram"></div>
               <div class="form-group"><label for="tiktok">TikTok</label><input type="text" id="tiktok" v-model="formStore.formData.infoEmprendimiento.redes.tiktok"></div>
               <div class="form-group"><label for="website">Página Web</label><input type="text" id="website" v-model="formStore.formData.infoEmprendimiento.redes.website"></div>
               <div class="form-group"><label for="whatsapp">WhatsApp / WhatsApp Business</label><input type="text" id="whatsapp" v-model="formStore.formData.infoEmprendimiento.redes.whatsapp"></div>
             </div>
           </fieldset>
        </div>

        <div v-show="formStore.currentStep === 3">
          <fieldset>
             <legend>3. ¿Qué tipo de Formalización tiene?</legend>
              <div class="checkbox-grid">
               <div v-for="item in formalizacionOptions" :key="item">
                 <input type="checkbox" :id="item" :value="item" v-model="formStore.formData.formalizacion">
                 <label :for="item">{{ item }}</label>
               </div>
             </div>
           </fieldset>
        </div>

        <div v-show="formStore.currentStep === 4">
          <fieldset>
             <legend>4. Necesidades y Proyecciones</legend>
              <div class="form-group">
               <label for="necesidadActual">¿Cuál es su principal necesidad actual?</label>
               <input type="text" id="necesidadActual" v-model="formStore.formData.necesidades.necesidadActual">
             </div>
             <div class="form-group">
               <label class="group-label">¿Le interesa participar en talleres o ferias municipales?</label>
               <div class="radio-options-wrapper">
                 <div class="radio-option">
                   <input type="radio" id="interesSi" value="Si" v-model="formStore.formData.necesidades.interesTalleres"><label for="interesSi">Sí</label>
                 </div>
                 <div class="radio-option">
                   <input type="radio" id="interesNo" value="No" v-model="formStore.formData.necesidades.interesTalleres"><label for="interesNo">No</label>
                 </div>
               </div>
             </div>
             <div class="form-group">
               <label>¿De cuanto es el ingreso mensual de su emprendimiento?</label>
               <select v-model="formStore.formData.necesidades.ingresoMensual">
                   <option disabled value="">Seleccione un rango</option>
                   <option>50.000 - 90.000</option>
                   <option>91.000 - 125.000</option>
                   <option>126.000 - 300.000</option>
                   <option>301.000 - 600.000</option>
                   <option>601.000 o más</option>
               </select>
             </div>
             <div class="form-group">
               <label>¿Qué tipo de apoyo le interesaría obtener?</label>
               <div class="checkbox-grid">
                   <div v-for="apoyo in apoyoOptions" :key="apoyo">
                       <input type="checkbox" :id="apoyo" :value="apoyo" v-model="formStore.formData.necesidades.tipoApoyo">
                       <label :for="apoyo">{{ apoyo }}</label>
                   </div>
               </div>
             </div>
           </fieldset>
        </div>

        <div class="navigation-buttons">
          <button type="button" v-if="formStore.currentStep > 1" @click="formStore.prevStep" class="btn-secondary">Anterior</button>
          <div v-else></div> <button type="button" v-if="formStore.currentStep < 4" @click="formStore.nextStep" class="btn-primary">Siguiente</button>
          <button type="submit" v-if="formStore.currentStep === 4" class="submit-btn">Enviar Registro</button>
        </div>
      </form>
      
      <div v-else class="thank-you-message">
        <div class="icon-wrapper">
          <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
            <polyline points="22 4 12 14.01 9 11.01"></polyline>
          </svg>
        </div>
        <h2>¡Registro Recibido con Éxito!</h2>
        <p>Muchas gracias por completar el formulario. Tu información ha sido enviada.</p>
        <button @click="formStore.resetForm()" class="btn-primary">Registrar otro emprendedor</button>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useFormStore } from '@/stores/FormStore';
import AppHeader from '../components/AppHeader.vue';

const formStore = useFormStore();

const imagePreviews = ref([]);

const handleImageUpload = (event) => {
  const files = event.target.files;
  if (!files) return;
  const totalImages = (formStore.imageFiles?.length || 0) + files.length;
  if (totalImages > 4) {
    alert('No puedes subir más de 4 imágenes en total.');
    return;
  }
  for (const file of files) {
    formStore.imageFiles.push(file);
    imagePreviews.value.push(URL.createObjectURL(file));
  }
  event.target.value = '';
};

const removeImage = (index) => {
  URL.revokeObjectURL(imagePreviews.value[index]);
  imagePreviews.value.splice(index, 1);
  formStore.imageFiles.splice(index, 1);
};

const distritosOptions = ref([
  'Santa Cruz', 'Bolsón', 'Cabo Velas', 'Cartagena', 'Cuajiniquil', 'Diriá', 'Tamarindo', 'Tempate', 'Veintisiete de Abril'
]);

const sectorOptions = ref([
  { name: 'Turismo',   icon: `<svg>...</svg>` },
  { name: 'Alimentos', icon: `<svg>...</svg>` },
  { name: 'Belleza',   icon: `<svg>...</svg>` },
  { name: 'Servicios', icon: `<svg>...</svg>` },
  { name: 'Cultural',  icon: `<svg>...</svg>` },
  { 
    name: 'Otros', 
    icon: `<svg>...</svg>` 
  }
]);

const getSectorImageUrl = (imageName) => {
  return new URL(`../assets/${imageName}`, import.meta.url).href;
};

const sectoresCulturales = [
  'Música', 'Artes Visuales (Pintura, Escultura, Fotografía)', 'Danza', 'Teatro', 'Cine / Audiovisual',
  'Literatura', 'Artesanía', 'Diseño / Moda', 'Patrimonio Cultural'
];

const formalizacionOptions = [
  'Inscrito en Hacienda', 'Licencia comercial', 'CCSS', 'Póliza del INS', 'Permiso de funcionamiento', 'Ninguna de las anteriores'
];

const apoyoOptions = [
  'Financiamiento', 'Capacitación / Formación', 'Difusión / Visibilidad',
  'Asesoría Legal / Comercial', 'Espacios para mostrar su trabajo', 'Formalización'
];
</script>

<style scoped>

#public-form-layout {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  gap: 2rem; 
  background-color: var(--verde-principal);
  background-image: linear-gradient(135deg, #1e4620 0%, #2a6f2d 100%);
}

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

 .form-container {
   max-width: 1280px;
   width: 100%;
   margin: 0 auto 3rem auto;
   background-color: #FDFDFD;
   padding: 3rem;
   border-radius: 16px;
   box-shadow: 0 20px 40px rgba(0, 0, 0, 0.25);
   color: var(--texto-oscuro);
   position: relative;
   overflow: hidden;
   transition: all 0.3s ease;
   box-sizing: border-box;
 }
 .form-container::before {
   content: '';
   position: absolute;
   top: 0;
   left: 0;
   width: 12px;
   height: 100%;
   background-color: var(--dorado-acento);
 }
 .form-header {
   text-align: center;
   margin-bottom: 2.5rem;
 }
 .form-header h1 {
   font-weight: 700;
   color: var(--verde-principal);
   font-size: 2rem;
 }
 .entrepreneur-form fieldset {
   border: none;
   padding: 0;
   margin-bottom: 1rem;
 }
 .entrepreneur-form legend {
    width: 100%;
   font-size: 1.3rem;
   font-weight: 600;
   color: var(--verde-principal);
   padding-bottom: 1rem;
   margin-bottom: 2rem;
   border-bottom: 1px solid var(--gris-borde);
 }
 .form-grid {
   display: grid;
   grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
   gap: 1.5rem 2rem;
 }
 .form-group {
   margin-bottom: 1.5rem;
   display: flex;
   flex-direction: column;
 }
 label {
   margin-bottom: 0.6rem;
   font-weight: 500;
   font-size: 0.9rem;
   color: #444;
 }
 input[type="text"],
 input[type="email"],
 input[type="date"],
 input[type="number"],
 select,
 textarea {
   width: 100%;
   padding: 0.9rem 1rem;
   border: 1px solid #DDE1E4;
   border-radius: 8px;
   background-color: #FFFFFF;
   font-family: 'Poppins', sans-serif;
   font-size: 1rem;
   box-sizing: border-box;
 }
 .checkbox-grid {
     display: grid;
     grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
     gap: 0.75rem;
 }
 .checkbox-grid label, .radio-option label {
   font-weight: 400;
 }

 .sub-legend {
   display: block;
   width: 100%;
   font-size: 1.1rem;
   font-weight: 600;
   color: var(--verde-principal);
   margin-top: 2rem;
   margin-bottom: 1.5rem;
   padding-bottom: 0.5rem;
   border-bottom: 1px solid var(--gris-borde);
 }
 .form-grid-social {
   display: grid;
   grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
   gap: 1.5rem 2rem;
 }
 .indented {
     margin-top: 1rem;
     padding-left: 1.5rem;
     border-left: 2px solid var(--gris-borde);
 }
 .otro-input {
     margin-top: 1rem;
 }
 .group-label {
   margin-bottom: 0.75rem;
 }
 .radio-options-wrapper {
   display: flex;
   align-items: center;
   gap: 2rem;
   flex-wrap: wrap;
 }
 .radio-option {
   display: flex;
   align-items: center;
   gap: 0.5rem;
 }
 .radio-option label {
   margin-bottom: 0;
 }
 .sector-selector-container {
   display: grid;
   grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
   gap: 1rem;
   margin-top: 0.5rem;
 }

 .sector-button {
   display: flex;
   flex-direction: column;
   align-items: center;
   justify-content: center;
   gap: 0.75rem;
   padding: 1.25rem 0.5rem;
   border: 2px solid var(--gris-borde);
   border-radius: 12px;
   background-color: #f8f9fa;
   cursor: pointer;
   transition: all 0.2s ease-in-out;
   font-family: 'Poppins', sans-serif;
   text-align: center;
 }

 .sector-button:hover {
   transform: translateY(-4px);
   border-color: var(--dorado-acento);
   box-shadow: 0 6px 12px rgba(0,0,0,0.08);
 }

 .icon-wrapper {
   width: 60px;
   height: 60px;
   border-radius: 50%;
   display: flex;
   justify-content: center;
   align-items: center;
   background-color: #e9ecef;
   transition: all 0.2s ease-in-out;
 }
 
 .sector-image {
   width: 32px;
   height: 32px;
   object-fit: contain;
 }

 .icon-wrapper :deep(svg) {
   width: 32px;
   height: 32px;
   stroke: var(--texto-oscuro);
   transition: stroke 0.2s ease-in-out;
 }

 .sector-label {
   font-weight: 500;
   font-size: 0.9rem;
   color: var(--texto-oscuro);
 }

 .sector-button.selected {
   border-color: var(--verde-principal);
   background-color: #e8f5e9;
   transform: translateY(-4px);
   box-shadow: 0 6px 12px rgba(0,0,0,0.1);
 }

 .sector-button.selected .icon-wrapper {
   background-color: var(--verde-principal);
 }

 .sector-button.selected .icon-wrapper :deep(svg) {
   stroke: white;
 }
 .image-uploader-container {
   width: 100%;
   background-color: #f8f9fa;
   border: 2px dashed var(--gris-borde);
   border-radius: 12px;
   padding: 1.5rem;
   box-sizing: border-box;
 }

 .hidden-input {
   display: none;
 }

 .upload-label {
   display: flex;
   flex-direction: column;
   align-items: center;
   justify-content: center;
   cursor: pointer;
   padding: 2rem;
   border-radius: 8px;
   transition: background-color 0.2s ease-in-out;
   color: #6c757d;
 }

 .upload-label:hover {
   background-color: #e9ecef;
 }

 .upload-label svg {
   width: 40px;
   height: 40px;
   stroke: #6c757d;
   margin-bottom: 1rem;
 }

 .upload-label span {
   font-weight: 600;
   font-size: 1rem;
 }

 .image-previews-container {
   display: grid;
   grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
   gap: 1rem;
   margin-bottom: 1.5rem;
 }

 .preview-item {
   position: relative;
   border-radius: 8px;
   overflow: hidden;
   box-shadow: 0 4px 8px rgba(0,0,0,0.1);
 }

 .preview-image {
   width: 100%;
   height: 120px;
   object-fit: cover;
   display: block;
 }

 .remove-button {
   position: absolute;
   top: 8px;
   right: 8px;
   width: 28px;
   height: 28px;
   background-color: rgba(0, 0, 0, 0.6);
   color: white;
   border: none;
   border-radius: 50%;
   font-size: 1.2rem;
   font-weight: bold;
   cursor: pointer;
   display: flex;
   align-items: center;
   justify-content: center;
   line-height: 1;
   padding: 0;
   transition: background-color 0.2s ease;
 }

 .remove-button:hover {
   background-color: rgba(220, 53, 69, 0.9);
 }
 .navigation-buttons {
   display: flex;
   justify-content: space-between;
   align-items: center;
   margin-top: 2rem;
   border-top: 1px solid var(--gris-borde);
   padding-top: 2rem;
 }
 .btn-secondary, .btn-primary, .submit-btn {
   padding: 0.8rem 1.5rem;
   border: none;
   border-radius: 8px;
   font-family: 'Poppins', sans-serif;
   font-size: 1rem;
   font-weight: 600;
   cursor: pointer;
   transition: all 0.3s;
 }
 .btn-secondary {
   background-color: #e2e8f0;
   color: #4a5568;
 }
 .btn-secondary:hover {
   background-color: #cbd5e0;
   transform: translateY(-2px);
 }
 .btn-primary {
   background-color: var(--verde-principal);
   color: white;
 }
 .btn-primary:hover {
   background-color: #2a6f2d;
   transform: translateY(-2px);
 }
 .submit-btn {
   background-color: var(--dorado-acento);
   color: var(--verde-principal);
 }
 .submit-btn:hover {
   background-color: #fca00d;
   transform: translateY(-3px);
   box-shadow: 0 4px 10px rgba(0, 0, 0, 0.15);
 }

 @media (max-width: 768px) {
   .form-container {
     margin: 0 auto 1rem auto;
     padding: 1.5rem;
     border-radius: 12px;
   }
   .form-container::before {
     width: 8px;
   }
   .form-header h1 {
     font-size: 1.6rem;
   }
   .entrepreneur-form legend {
     font-size: 1.1rem;
     margin-bottom: 1.5rem;
   }
   .navigation-buttons {
     flex-direction: column-reverse;
     align-items: stretch;
     gap: 1rem;
   }
   .submit-btn, .btn-primary, .btn-secondary {
     font-size: 1rem;
     padding: 1rem;
   }
 }

 .thank-you-message {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 3rem 1rem;
 }

 .thank-you-message .icon-wrapper {
  color: var(--verde-principal);
  margin-bottom: 1.5rem;
 }

 .thank-you-message h2 {
  color: var(--verde-principal);
  font-size: 1.8rem;
  margin: 0 0 1rem 0;
 }

 .thank-you-message p {
  font-size: 1.1rem;
  color: #555;
  margin-bottom: 2rem;
  max-width: 400px;
 }
</style>