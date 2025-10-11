// ...existing code...
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

// Importa los estilos de Bootstrap
import "bootstrap/dist/css/bootstrap.min.css"
import "bootstrap-icons/font/bootstrap-icons.css"
import "bootstrap"

// 1. Importa y crea Pinia
import { createPinia } from 'pinia'

const app = createApp(App)

// 2. Usa Pinia antes de usar cualquier store
app.use(createPinia())

app.use(router)

app.mount('#app')