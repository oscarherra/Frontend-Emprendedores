import { defineStore } from 'pinia';

export const useFormStore = defineStore('form', {
  state: () => ({
    // Tu estado no cambia, los campos del formulario siguen siendo los mismos.
    currentStep: 1,
    steps: ['General', 'Emprendimiento', 'Formalización', 'Necesidades'],
    isFormSubmitted: false,
    imageFiles: [],
    formData: {
      informacionGeneral: {
        nombre: '',
        apellido1: '',
        apellido2: '',
        cedula: '',
        fechaNacimiento: '', // Se mantiene camelCase aquí para el formulario
        edad: null,
        sexo: '',
        telefono: '',
        correo_electronico: '', // Se mantiene snake_case aquí
        direccion: '',
        distrito: '',
        comunidad: ''
      },
      infoEmprendimiento: {
        nombreNegocio: '',
        tipo: 'Individual',
        descripcion: '',
        nivelEducativo: '',
        anoInicio: null,
        logo: 'No',
        slogan: 'No',
        sector: '',
        especificacionCultural: [],
        otroCultural: '',
        numEmpleados: null,
        utileria: { sillas: 'No', mesas: 'No', toldo: 'No' },
        participoFeria: 'No',
        cualesFerias: '',
        signosExternos: '',
        certificaciones: '',
        redes: { facebook: '', instagram: '', tiktok: '', website: '', whatsapp: '' }
      },
      formalizacion: [],
      necesidades: {
        necesidadActual: '',
        interesTalleres: 'No',
        ingresoMensual: '',
        tipoApoyo: []
      }
    }
  }),
  actions: {
    // Tus otras acciones (nextStep, prevStep, etc.) no cambian.
    
    async submitForm() {
      // --- TRANSFORMACIÓN DE DATOS PRECISA Y CORREGIDA ---
      
      const apiPayload = {
        // ==========================================================
        //  ¡LA CORRECCIÓN ESTÁ AQUÍ!
        //  Los nombres de las claves ahora son snake_case para coincidir con Laravel.
        // ==========================================================
        nombre: this.formData.informacionGeneral.nombre,
        apellido1: this.formData.informacionGeneral.apellido1,
        apellido2: this.formData.informacionGeneral.apellido2,
        cedula: this.formData.informacionGeneral.cedula,
        fecha_nacimiento: this.formData.informacionGeneral.fechaNacimiento, // <--- CORREGIDO
        telefono: this.formData.informacionGeneral.telefono,
        correo_electronico: this.formData.informacionGeneral.correo_electronico,
        direccion: this.formData.informacionGeneral.direccion,
        distrito: this.formData.informacionGeneral.distrito,
        comunidad: this.formData.informacionGeneral.comunidad,
        escolaridad: [this.formData.infoEmprendimiento.nivelEducativo],
        certificaciones: this.formData.infoEmprendimiento.certificaciones,

        // Datos del Emprendimiento
        nombre_emprendimiento: this.formData.infoEmprendimiento.nombreNegocio,
        tipo_emprendimiento: this.formData.infoEmprendimiento.tipo,
        descripcion_emprendimiento: this.formData.infoEmprendimiento.descripcion,
        slogan: this.formData.infoEmprendimiento.slogan,
        anio_inicio: this.formData.infoEmprendimiento.anoInicio,
        numero_empleados: this.formData.infoEmprendimiento.numEmpleados,
        mobiliario: `Sillas: ${this.formData.infoEmprendimiento.utileria.sillas}, Mesas: ${this.formData.infoEmprendimiento.utileria.mesas}, Toldo: ${this.formData.infoEmprendimiento.utileria.toldo}`,
        signos_externos: this.formData.infoEmprendimiento.signosExternos,
        sector: this.formData.infoEmprendimiento.sector,

        // Relaciones
        formalizaciones: this.formData.formalizacion,
        apoyos: this.formData.necesidades.tipoApoyo,
        necesidades: [this.formData.necesidades.necesidadActual].filter(n => n),

        // Proyección
        intereses: [this.formData.necesidades.interesTalleres],
        ingreso_mensual: this.formData.necesidades.ingresoMensual,
      };

      // --- El resto de la lógica de envío no cambia ---
      try {
        const response = await fetch('http://127.0.0.1:8000/api/emprendedores', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
          body: JSON.stringify(apiPayload),
        });

        if (!response.ok) {
          const errorData = await response.json();
          let errorMessage = 'Ocurrió un error inesperado en el servidor.';

          if (response.status === 422 && errorData.errors) {
            errorMessage = 'Por favor, corrige los siguientes errores:\n\n' + Object.values(errorData.errors).flat().join('\n');
          } else if (errorData.message) {
            errorMessage = errorData.message;
          }
          throw new Error(errorMessage);
        }
        this.isFormSubmitted = true;
      } catch (error) {
        console.error('Error al enviar el formulario:', error);
        alert('No se pudo enviar el formulario.\n\n' + error.message);
      }
    }
  }
});