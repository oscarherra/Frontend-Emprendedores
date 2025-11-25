<template>
  <div class="captcha-backdrop" @click.self="cerrar">
    <div class="captcha-card">
      <h5 class="mb-3 text-center">Verificación</h5>
      <p class="text-muted small text-center">
        Antes de llenar otro formulario, confirma que no eres un robot.
      </p>

      <div ref="recaptcha" class="d-flex justify-content-center my-3"></div>

      <div class="text-end mt-3">
        <button class="btn btn-sm btn-outline-secondary me-2" @click="cerrar">
          Cancelar
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';

const emit = defineEmits(['success', 'close']);
const recaptcha = ref(null);
let widgetId = null;

// PON AQUÍ TU SITE KEY
const SITE_KEY = '6Le5fRcsAAAAAMmDROKMVk33VtwvrSmjfZm_QLiX';

const renderRecaptcha = () => {
  if (!window.grecaptcha || !recaptcha.value) return;

  widgetId = window.grecaptcha.render(recaptcha.value, {
    sitekey: SITE_KEY,
    callback: onVerify,       // se ejecuta cuando marcan "No soy un robot"
  });
};

const onVerify = (token) => {
  // Emitimos al padre que se verificó correctamente
  emit('success', token);
};

const cerrar = () => {
  emit('close');
};

onMounted(() => {
  // Si el script de reCAPTCHA ya está listo
  if (window.grecaptcha && window.grecaptcha.render) {
    renderRecaptcha();
  } else {
    // Si aún no está cargado, esperamos al callback global (opcional),
    // pero como pusimos el script en index.html con async defer,
    // normalmente ya estará para cuando se abra el modal.
    const interval = setInterval(() => {
      if (window.grecaptcha && window.grecaptcha.render) {
        clearInterval(interval);
        renderRecaptcha();
      }
    }, 300);
  }
});

onBeforeUnmount(() => {
  // limpiar si quieres resetear
  if (window.grecaptcha && widgetId !== null) {
    window.grecaptcha.reset(widgetId);
  }
});
</script>

<style scoped>
.captcha-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,.45);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
}

.captcha-card {
  background: #fff;
  border-radius: 16px;
  padding: 20px 24px;
  max-width: 420px;
  width: 100%;
  box-shadow: 0 12px 40px rgba(0,0,0,.18);
}
</style>
