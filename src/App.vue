<template>
  <!--  
    Este es el único elemento necesario en el template de App.vue
    cuando se usa vue-router. Actúa como un marcador de posición
    donde el router inyectará el componente de la vista activa
    (FormularioPublicoView, LoginView, AdminView, etc.).
  -->
  <router-view />
</template>

<style>
/* Aquí solo deben ir los estilos verdaderamente GLOBALES que quieres
  que se apliquen a TODA tu aplicación (admin, login y formulario).
  Los estilos específicos de cada vista deben ir en sus propios 
  componentes con la etiqueta <style scoped>.
*/

/* 1. Importación de las fuentes que usarás en el proyecto */
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700&display=swap');

/* 2. Definición de variables de color globales (CSS Custom Properties) */
:root {
  --verde-principal: #1E4620;
  --dorado-acento: #F7B538;
  --texto-oscuro: #2c3e50;
  --texto-claro: #FFFFFF;
  --gris-borde: #EAEAEA;
}

/* 3. Reseteo universal para un cálculo de tamaño de caja consistente */
*, *::before, *::after {
  box-sizing: border-box;
}

/* 4. Estilos base para el body */
/* Nota: Se quitó el fondo verde de aquí porque no es global.
   El fondo del formulario ahora vivirá en su propio componente.
   Este fondo gris claro funcionará mejor para el login y el admin. */
body {
  margin: 0;
  padding: 0;
  font-family: 'Poppins', sans-serif; /* Fuente por defecto */
  color: #333;
  background-color: #f8f9fa; 
}

/* 5. Asegura que el contenedor de la app ocupe toda la pantalla */
#app {
  height: 100vh;
  width: 100%;
}
</style>