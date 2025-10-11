import { createRouter, createWebHistory } from 'vue-router';

// =========================================================================
//  IMPORTACIÓN DE VISTAS SIGUIENDO TU ESTRUCTURA DE CARPETAS
// =========================================================================

// --- Vistas/Páginas Principales ---
// El componente "marco" o "layout" del admin que está en /components
import AdminLayout from '../components/Admin.vue'; 
// Las vistas públicas que están en /vistas
import FormularioEmprendedor from '../vistas/FormularioEmprendedor.vue';
import LoginView from '../vistas/login.vue';

// --- Vistas Anidadas (las que van DENTRO del panel de admin) ---
// Las sub-páginas del admin que están en /vistas
import AdminEmprendedores from '../vistas/Adminemprendedores.vue';
import AdminStatistics from '../vistas/AdminStatistics.vue';


// =========================================================================
//  DEFINICIÓN DEL MAPA DE RUTAS DE TU APLICACIÓN
// =========================================================================
const routes = [
  // --- Rutas Públicas ---
  {
    path: '/', // La página de inicio es el formulario público
    name: 'formulario',
    component: FormularioEmprendedor,
  },
  {
    path: '/login', // La página para que el admin inicie sesión
    name: 'login',
    component: LoginView,
  },
  
  // --- Ruta Protegida del Admin con Vistas Anidadas ---
  {
    path: '/admin',
    component: AdminLayout, // 1. El componente padre es el layout con la barra lateral
    meta: { requiresAuth: true }, // 2. Se protege esta ruta y TODAS sus hijas
    redirect: '/admin/emprendedores', // Redirige automáticamente /admin a la lista de emprendedores
    children: [ // 3. Aquí se definen las "sub-páginas" que se mostrarán dentro de Admin.vue
      {
        path: 'emprendedores', // Se accede con la URL: /admin/emprendedores
        name: 'admin-emprendedores',
        component: AdminEmprendedores,
      },
      {
        path: 'estadisticas', // Se accede con la URL: /admin/estadisticas
        name: 'admin-estadisticas',
        component: AdminStatistics,
      }
    ]
  }
];

// Creación de la instancia del router
const router = createRouter({
  history: createWebHistory(),
  routes,
});

// "Guardia de Seguridad" que se ejecuta antes de cada navegación
router.beforeEach((to, from, next) => {
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
  const token = localStorage.getItem('auth_token');

  if (requiresAuth && !token) {
    // Si la ruta es protegida y no hay token, redirige al login
    next({ name: 'login' });
  } else {
    // Si no, permite el paso
    next();
  }
});

export default router;