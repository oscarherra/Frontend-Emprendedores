import { defineStore } from 'pinia'
import { ref, reactive } from 'vue'

const getInitialFormData = () => ({
  informacionGeneral: {
    nombreCompleto: '',
    cedula: '',
    fechaNacimiento: '',
    edad: null,
    sexo: '',
    contacto: '',
    direccion: '',
    distrito: '',
    comunidad: ''
  },
  infoEmprendimiento: {
    nombreNegocio: '',
    tipo: 'Individual',
    descripcion: '',
    nivelEducativo: '',
    logo: null,
    slogan: null,
    anoInicio: null,
    sector: '',
    especificacionCultural: [],
    otroCultural: '',
    numEmpleados: null,
    utileria: {
        sillas: null,
        mesas: null,
        toldo: null
    },
    participoFeria: null,
    cualesFerias: '',
    signosExternos: '',
    certificaciones: '',
    redes: {
        facebook: '',
        instagram: '',
        tiktok: '',
        website: '',
        whatsapp: ''
    }
  },
  formalizacion: [],
  necesidades: {
    necesidadActual: '',
    interesTalleres: null,
    ingresoMensual: '',
    tipoApoyo: []
  }
});

export const useFormStore = defineStore('form', () => {
  const currentStep = ref(1);
  const isFormSubmitted = ref(false); // ESTADO CLAVE: Inicia en 'false'

  const steps = [
    'Información General',
    'Info. del Emprendimiento',
    'Formalización',
    'Necesidades y Proyecciones'
  ];
  
  const formData = reactive(getInitialFormData());
  const imageFiles = ref([]);

  function nextStep() {
    if (currentStep.value < 4) {
      currentStep.value++;
    }
  }

  function prevStep() {
    if (currentStep.value > 1) {
      currentStep.value--;
    }
  }
  
  function submitForm() {
    console.log('Formulario enviado:', JSON.parse(JSON.stringify(formData)));
    isFormSubmitted.value = true; // CAMBIA A 'true' AL ENVIAR
  }

  function resetForm() {
    currentStep.value = 1;
    isFormSubmitted.value = false; // VUELVE A 'false'
    imageFiles.value = [];
    Object.assign(formData, getInitialFormData());
  }

  return { 
    currentStep,
    isFormSubmitted,
    steps,
    formData, 
    imageFiles,
    nextStep, 
    prevStep,
    submitForm,
    resetForm
  }
});