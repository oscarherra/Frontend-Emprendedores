<template>
  <div class="login-container">
    <div class="login-card shadow-lg">
      <div class="text-center mb-3">
        <img src="/src/assets/logo.png" alt="Municipalidad" class="logo" />
        <h2 class="title">Panel de <span>Administrador</span></h2>
        <p class="subtitle">Ingresa tus credenciales para continuar</p>
      </div>

      <form @submit.prevent="onSubmit" novalidate>
        <!-- Correo -->
        <div class="form-group mb-3">
          <label for="email" class="form-label">Correo Electrónico</label>
          <div class="input-wrapper">
            <i class="bi bi-envelope-fill"></i>
            <input
              id="email"
              type="email"
              v-model.trim="form.email"
              placeholder=""
              class="form-control"
              required
            />
          </div>
        </div>

        <!-- Contraseña -->
        <div class="form-group mb-3">
          <label for="password" class="form-label">Contraseña</label>
          <div class="input-wrapper">
            <i class="bi bi-lock-fill"></i>
            <input
              id="password"
              :type="showPassword ? 'text' : 'password'"
              v-model="form.password"
              placeholder=""
              class="form-control"
              required
            />
            <button
              type="button"
              class="toggle-btn"
              @click="showPassword = !showPassword"
            >
              <i :class="showPassword ? 'bi bi-eye-slash' : 'bi bi-eye'"></i>
            </button>
          </div>
        </div>

        <!-- Error -->
        <div v-if="errorMessage" class="alert alert-danger py-2 mb-3">
          <i class="bi bi-exclamation-circle me-1"></i>{{ errorMessage }}
        </div>

        <!-- Botón -->
        <button type="submit" class="btn btn-primary w-100" :disabled="loading">
          <span v-if="!loading">Ingresar</span>
          <span v-else class="spinner-border spinner-border-sm"></span>
        </button>
      </form>

      <footer class="text-center mt-4">
        <small>© {{ year }} Municipalidad — Sistema de Emprendedores</small>
      </footer>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";

const form = ref({ email: "", password: "" });
const showPassword = ref(false);
const errorMessage = ref("");
const loading = ref(false);
const year = new Date().getFullYear();
const API_URL = "http://127.0.0.1:8000/api/login";

const onSubmit = async () => {
  errorMessage.value = "";
  loading.value = true;

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify(form.value),
    });

    const data = await response.json();

    if (!response.ok) {
      errorMessage.value = data.message || "Credenciales incorrectas";
      return;
    }

    if (!data.user?.is_admin) {
      errorMessage.value = "Tu cuenta no tiene permisos de administrador.";
      return;
    }

    localStorage.setItem("auth_token", data.access_token);
    localStorage.setItem("auth_user", JSON.stringify(data.user));
    window.location.href = "/admin";
  } catch (error) {
    errorMessage.value = "Error al conectar con el servidor.";
    console.error(error);
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>

.login-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #0b3d2e 0%, #115c41 50%, #0a3a27 100%);
  background-attachment: fixed;
  font-family: "Inter", system-ui, sans-serif;
  padding: 20px;
}

.login-card {
  width: 100%;
  max-width: 400px;
  background-color: #ffffffee;
  border-radius: 18px;
  padding: 2.2rem;
  backdrop-filter: blur(6px);
}

.logo {
  width: 80px;
  height: auto;
  margin-bottom: 5px;
}

.title {
  font-size: 1.5rem;
  color: #1b3e2b;
  font-weight: 700;
}

.title span {
  color: #157347;
}

.subtitle {
  font-size: 0.95rem;
  color: #555;
  margin-bottom: 1rem;
}


.input-wrapper {
  position: relative;
}

.input-wrapper i {
  position: absolute;
  top: 50%;
  left: 10px;
  transform: translateY(-50%);
  color: #666;
}

.form-control {
  padding-left: 36px;
  border-radius: 10px;
  border: 1px solid #ccc;
  transition: all 0.3s ease;
}

.form-control:focus {
  border-color: #198754;
  box-shadow: 0 0 0 0.2rem rgba(25, 135, 84, 0.15);
}

.toggle-btn {
  position: absolute;
  top: 50%;
  right: 32px;
  transform: translateY(-50%);
  background: transparent;
  border: none;
  color: #666;
  cursor: pointer;
}

.toggle-btn:hover {
  color: #198754;
}

.alert {
  border-radius: 8px;
  font-size: 0.9rem;
}

.btn-primary {
  background-color: #0d6efd;
  border-color: #0d6efd;
  font-weight: 600;
  border-radius: 10px;
}

.btn-primary:hover {
  background-color: #0b5ed7;
  border-color: #0a58ca;
}

footer {
  color: #777;
  font-size: 0.8rem;
  margin-top: 1.5rem;
}
</style>
