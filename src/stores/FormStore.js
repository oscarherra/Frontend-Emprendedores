import { defineStore } from 'pinia'
import { ref, reactive } from 'vue'

export const useFormStore = defineStore('form', () => {
  // El paso actual del formulario
  const currentStep = ref(1)

  // Nombres de los pasos para la barra de progreso
  const steps = [
    'Información General',
    'Info. del Emprendimiento',
    'Formalización',
    'Necesidades y Proyecciones'
  ];

  // Todos los datos del formulario
  const formData = reactive({
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
      logo: 'No',
      slogan: 'No',
      anoInicio: null,
      sector: '',
      especificacionCultural: [],
      otroCultural: '',
      numEmpleados: null,
      utileria: {
          sillas: 'No',
          mesas: 'No',
          toldo: 'No'
      },
      participoFeria: 'No',
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
      interesTalleres: 'Si',
      ingresoMensual: '',
      tipoApoyo: []
    }
  })
  
  // Archivos de imágenes
  const imageFiles = ref([])

  // Acciones para cambiar de paso
  function nextStep() {
    if (currentStep.value < 4) {
      currentStep.value++
    }
  }

  function prevStep() {
    if (currentStep.value > 1) {
      currentStep.value--
    }
  }
  
  function submitForm() {
    if (formData.infoEmprendimiento.otroCultural.trim() !== '') {
        formData.infoEmprendimiento.especificacionCultural.push(formData.infoEmprendimiento.otroCultural.trim());
    }
    
    console.log('Formulario enviado desde el Store:', JSON.parse(JSON.stringify(formData)));
    console.log('Archivos de imagen:', imageFiles.value);
    alert('¡Registro enviado con éxito! Revisa la consola.');
  }

  return { 
    currentStep,
    steps,
    formData, 
    imageFiles,
    nextStep, 
    prevStep,
    submitForm
  }
})