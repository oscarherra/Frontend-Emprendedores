<template>

  <router-view />
</template>

<style>


@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700&display=swap');


:root {
  --verde-principal: #1E4620;
  --dorado-acento: #F7B538;
  --texto-oscuro: #2c3e50;
  --texto-claro: #FFFFFF;
  --gris-borde: #EAEAEA;
}


*, *::before, *::after {
  box-sizing: border-box;
}


body {
  margin: 0;
  padding: 0;
  font-family: 'Poppins', sans-serif; 
  color: #333;
  background-color: #f8f9fa; 
}


#app {
  height: 100vh;
  width: 100%;
}
</style>