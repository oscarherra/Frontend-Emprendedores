<template>
  <div class="login-container">
    <div class="login-box">
      <h2 class="text-center mb-1">Panel de Administrador</h2>
      <p class="text-center text-muted mb-4">Por favor, inicia sesión para continuar.</p>
      
      <!-- Formulario de Login -->
      <form @submit.prevent="handleLogin">
        <div class="mb-3">
          <label for="email" class="form-label">Correo Electrónico</label>
          <input 
            type="email" 
            class="form-control" 
            id="email" 
            v-model="email" 
            required
            placeholder="admin@email.com"
          >
        </div>
        <div class="mb-3">
          <label for="password" class="form-label">Contraseña</label>
          <input 
            type="password" 
            class="form-control" 
            id="password" 
            v-model="password" 
            required
            placeholder="••••••••"
          >
        </div>
        
        <!-- Mensaje de Error -->
        <div v-if="error" class="alert alert-danger mt-3">{{ error }}</div>
        
        <!-- Botón de Envío -->
        <button type="submit" class="btn btn-primary w-100 mt-3" :disabled="isLoading">
          <span v-if="isLoading" class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
          {{ isLoading ? 'Ingresando...' : 'Ingresar' }}
        </button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

// --- Estado Reactivo ---
// Pre-llenamos los campos para facilitar las pruebas durante el desarrollo
const email = ref('admin@email.com');
const password = ref('password123');
const error = ref(null);
const isLoading = ref(false);

// Obtenemos una instancia del router para poder redirigir al usuario
const router = useRouter();

// --- Lógica de Login ---
const handleLogin = async () => {
  isLoading.value = true;
  error.value = null;
  try {
    // 1. Envía la petición a la API de Laravel
    const response = await fetch('http://127.0.0.1:8000/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        email: email.value,
        password: password.value,
      }),
    });

    const data = await response.json();

    // 2. Si la respuesta no es exitosa, lanza un error
    if (!response.ok) {
      throw new Error(data.message || 'Error al iniciar sesión. Revisa tus credenciales.');
    }

    // 3. ¡ÉXITO! Guarda el token en el almacenamiento local del navegador
    localStorage.setItem('auth_token', data.access_token);

    // 4. Redirige al usuario al panel de administración usando el router
    router.push('/admin');

  } catch (err) {
    // 5. Si algo falla, muestra el mensaje de error
    error.value = err.message;
  } finally {
    // 6. Pase lo que pase, quita el indicador de carga
    isLoading.value = false;
  }
};
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  /* Usamos el mismo fondo que el layout público para consistencia */
  background-color: var(--verde-principal);
  background-image: linear-gradient(135deg, #1e4620 0%, #2a6f2d 100%);
}
.login-box {
  width: 100%;
  max-width: 400px;
  padding: 2.5rem;
  background: white;
  border-radius: 8px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.1);
}
.form-control {
  padding: 0.75rem 1rem;
}
.btn-primary {
  padding: 0.75rem;
  font-weight: 500;
}
</style>