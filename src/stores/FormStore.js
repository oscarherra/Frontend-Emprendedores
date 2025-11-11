// src/stores/FormStore.js
import { defineStore } from 'pinia';

function initialState() {
  return {
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
        fechaNacimiento: '',
        edad: null,
        sexo: '',
        telefono: '',
        correo_electronico: '',
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
  };
}

export const useFormStore = defineStore('form', {
  state: () => initialState(),

  actions: {
    nextStep() {
      if (this.currentStep < this.steps.length) this.currentStep++;
    },
    prevStep() {
      if (this.currentStep > 1) this.currentStep--;
    },
    resetForm() {
      // reemplaza todo el state por un clon limpio
      const fresh = initialState();
      this.currentStep = fresh.currentStep;
      this.steps = fresh.steps;
      this.isFormSubmitted = fresh.isFormSubmitted;
      this.imageFiles = fresh.imageFiles;
      this.formData = fresh.formData;
    },

    async submitForm() {
      const fd = new FormData();

      // ===== Paso 1 – Emprendedor (requeridos) =====
      const g = this.formData.informacionGeneral;
      fd.append('nombre', g.nombre);
      fd.append('apellido1', g.apellido1);
      fd.append('apellido2', g.apellido2);
      fd.append('cedula', g.cedula);
      fd.append('fecha_nacimiento', g.fechaNacimiento);
      fd.append('telefono', g.telefono);
      fd.append('direccion', g.direccion);
      fd.append('distrito', g.distrito);
      fd.append('comunidad', g.comunidad);

      // opcionales si existen
      if (g.correo_electronico) fd.append('correo_electronico', g.correo_electronico);
      if (g.sexo) fd.append('sexo', g.sexo);

      // escolaridad como array (solo si hay nivel)
      const nivel = this.formData.infoEmprendimiento.nivelEducativo;
      if (nivel) fd.append('escolaridad[]', nivel);

      // ===== Paso 2 – Emprendimiento (solo si hay nombreNegocio) =====
      const e = this.formData.infoEmprendimiento;
      const hayEmprendimiento = !!e.nombreNegocio?.trim();

      if (hayEmprendimiento) {
        fd.append('nombre_emprendimiento', e.nombreNegocio);
        // estos 2 son requeridos cuando existe nombre_emprendimiento
        fd.append('tipo_emprendimiento', e.tipo || 'Individual');
        fd.append('descripcion_emprendimiento', e.descripcion || '-');

        if (e.slogan) fd.append('slogan', e.slogan);
        if (e.anoInicio != null) fd.append('anio_inicio', String(e.anoInicio));
        if (e.numEmpleados != null) fd.append('numero_empleados', String(e.numEmpleados));
        fd.append(
          'mobiliario',
          `Sillas: ${e.utileria.sillas}, Mesas: ${e.utileria.mesas}, Toldo: ${e.utileria.toldo}`
        );
        if (e.signosExternos) fd.append('signos_externos', e.signosExternos);

        // sector y feria
        if (e.sector) fd.append('sector', e.sector);
        if (e.participoFeria) fd.append('participo_feria', e.participoFeria);
        if (e.cualesFerias) fd.append('cuales_ferias', e.cualesFerias);

        // logo
        fd.append('tiene_logo', e.logo === 'Si' ? '1' : '0');

        // redes (solo las que tengan valor)
        const r = e.redes || {};
        if (r.facebook)  fd.append('redes[facebook]',  r.facebook);
        if (r.instagram) fd.append('redes[instagram]', r.instagram);
        if (r.tiktok)    fd.append('redes[tiktok]',    r.tiktok);
        if (r.website)   fd.append('redes[website]',   r.website);
        if (r.whatsapp)  fd.append('redes[whatsapp]',  r.whatsapp);
      }

      // ===== Paso 3 – Formalización =====
      (this.formData.formalizacion || []).forEach(v => fd.append('formalizaciones[]', v));

      // ===== Paso 4 – Necesidades / Proyección =====
      const n = this.formData.necesidades;
      if (n.necesidadActual) fd.append('necesidades[]', n.necesidadActual);
      (n.tipoApoyo || []).forEach(v => fd.append('apoyos[]', v));
      if (n.interesTalleres) fd.append('intereses[]', n.interesTalleres);
      if (n.ingresoMensual) fd.append('ingreso_mensual', n.ingresoMensual);

      // ===== Imágenes =====
      (this.imageFiles || []).forEach(f => fd.append('imagenes[]', f));

      try {
        const res = await fetch('http://127.0.0.1:8000/api/emprendedores', {
          method: 'POST',
          headers: { 'Accept': 'application/json' }, // NO pongas Content-Type, el navegador lo arma con boundary
          body: fd
        });

        if (!res.ok) {
          // el backend devuelve {errors: {...}} en 422
          const err = await res.json().catch(() => ({}));
          let msg = 'Error al enviar el formulario.';
          if (res.status === 422 && err?.errors) {
            msg = Object.values(err.errors).flat().join('\n');
          } else if (err?.message) {
            msg = err.message;
          }
          throw new Error(msg);
        }

        this.isFormSubmitted = true;
      } catch (e) {
        console.error('Error al enviar el formulario:', e);
        alert('Error: ' + e.message);
      }
    }
  }
});
