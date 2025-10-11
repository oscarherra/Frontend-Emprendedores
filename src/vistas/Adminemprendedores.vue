<template>
    <div class="card d-flex flex-column h-100">
        <div class="card-header bg-white d-flex justify-content-between align-items-center py-3">
            <h3 class="card-title mb-0">Gestión de Emprendedores</h3>
            <div class="w-50">
                <input type="text" class="form-control" placeholder="Buscar por nombre, cédula..." v-model="searchQuery" />
            </div>
        </div>
        <div class="card-body flex-grow-1" style="overflow-y: auto;">
            <div v-if="isLoading" class="d-flex justify-content-center align-items-center h-100">
                <div class="text-center">
                    <div class="spinner-border text-primary" role="status"></div>
                    <p class="mt-2">Cargando datos...</p>
                </div>
            </div>
            <div v-else class="table-responsive">
                <table class="table table-hover align-middle">
                    <thead class="table-light">
                        <tr>
                            <th>Nombre del Emprendedor</th>
                            <th>Emprendimiento</th>
                            <th>Cédula</th>
                            <th>Contacto</th>
                            <th class="text-center">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-if="!filteredEmprendedores.length">
                            <td colspan="5" class="text-center text-muted py-4">No se encontraron registros.</td>
                        </tr>
                        <tr v-for="emprendedor in filteredEmprendedores" :key="emprendedor.id_emprendedor">
                            <td><div class="fw-bold">{{ emprendedor.nombre_completo }}</div></td>
                            <td>{{ emprendedor.emprendimiento?.nombre_emprendimiento || 'N/A' }}</td>
                            <td>{{ emprendedor.cedula }}</td>
                            <td>{{ emprendedor.correo_electronico }}</td>
                            <td class="text-center">
                                <button @click="showDetails(emprendedor)" class="btn btn-sm btn-outline-info" title="Ver Detalles"><i class="bi bi-eye-fill"></i></button>
                                <button @click="editEmprendedor(emprendedor.id_emprendedor)" class="btn btn-sm btn-outline-primary ms-1" title="Editar"><i class="bi bi-pencil-fill"></i></button>
                                <button @click="deleteEmprendedor(emprendedor.id_emprendedor)" class="btn btn-sm btn-outline-danger ms-1" title="Eliminar"><i class="bi bi-trash-fill"></i></button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>

    <div class="modal fade" id="detailsModal" tabindex="-1">
         <div class="modal-dialog modal-lg modal-dialog-scrollable">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">Detalles de {{ selectedEmprendedor?.nombre_completo }}</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                </div>
                <div class="modal-body">
                    <div v-if="isDetailLoading" class="text-center my-5">
                        <div class="spinner-border" role="status"></div>
                        <p class="mt-2">Cargando detalles completos...</p>
                    </div>
                    <div v-else-if="selectedEmprendedor">
                        <h4><i class="bi bi-person-circle text-primary"></i> Datos del Emprendedor</h4>
                        <table class="table table-bordered table-sm">
                            <tbody>
                                <tr><th class="w-25">Nombre Completo</th><td>{{ selectedEmprendedor.nombre_completo }}</td></tr>
                                <tr><th>Cédula</th><td>{{ selectedEmprendedor.cedula }}</td></tr>
                                <tr><th>Fecha de Nacimiento</th><td>{{ selectedEmprendedor.fecha_nacimiento }}</td></tr>
                                <tr><th>Teléfono</th><td>{{ selectedEmprendedor.telefono }}</td></tr>
                                <tr><th>Correo Electrónico</th><td>{{ selectedEmprendedor.correo_electronico }}</td></tr>
                                <tr><th>Dirección</th><td>{{ selectedEmprendedor.direccion }}</td></tr>
                                <tr><th>Distrito</th><td>{{ selectedEmprendedor.distrito }}</td></tr>
                                <tr><th>Comunidad</th><td>{{ selectedEmprendedor.comunidad }}</td></tr>
                                <tr><th>Escolaridad</th><td>{{ selectedEmprendedor.escolaridad?.join(', ') }}</td></tr>
                                <tr><th>Certificaciones</th><td>{{ selectedEmprendedor.certificaciones }}</td></tr>
                            </tbody>
                        </table>
                        
                        <hr class="my-4">

                        <h4><i class="bi bi-shop text-success"></i> Datos del Emprendimiento</h4>
                        <div v-if="selectedEmprendedor.emprendimiento">
                            <table class="table table-bordered table-sm">
                               <tbody>
                                    <tr><th class="w-25">Nombre</th><td>{{ selectedEmprendedor.emprendimiento.nombre_emprendimiento }}</td></tr>
                                    <tr><th>Tipo</th><td>{{ selectedEmprendedor.emprendimiento.tipo_emprendimiento }}</td></tr>
                                    <tr><th>Descripción</th><td>{{ selectedEmprendedor.emprendimiento.descripcion_emprendimiento }}</td></tr>
                                    <tr><th>Slogan</th><td>{{ selectedEmprendedor.emprendimiento.slogan }}</td></tr>
                                    <tr><th>Año de Inicio</th><td>{{ selectedEmprendedor.emprendimiento.anio_inicio }}</td></tr>
                                    <tr><th>Nº de Empleados</th><td>{{ selectedEmprendedor.emprendimiento.numero_empleados }}</td></tr>
                                    <tr><th>Mobiliario</th><td>{{ selectedEmprendedor.emprendimiento.mobiliario }}</td></tr>
                                    <tr><th>Signos Externos</th><td>{{ selectedEmprendedor.emprendimiento.signos_externos }}</td></tr>
                               </tbody>
                            </table>

                            <h5 class="mt-4">Proyecciones y Relaciones</h5>
                            <table class="table table-bordered table-sm">
                                <tbody>
                                    <tr v-if="selectedEmprendedor.emprendimiento.proyeccion">
                                        <th class="w-25">Ingreso Mensual</th>
                                        <td>{{ selectedEmprendedor.emprendimiento.proyeccion.ingreso_mensual }}</td>
                                    </tr>
                                    <tr v-if="selectedEmprendedor.emprendimiento.sectores?.length">
                                        <th>Sectores</th>
                                        <td>{{ selectedEmprendedor.emprendimiento.sectores.map(s => s.nombre_sector).join(', ') }}</td>
                                    </tr>
                                    <tr v-if="selectedEmprendedor.emprendimiento.apoyos?.length">
                                        <th>Apoyos Deseados</th>
                                        <td>{{ selectedEmprendedor.emprendimiento.apoyos.map(a => a.tipo_apoyo).join(', ') }}</td>
                                    </tr>
                                    <tr v-if="selectedEmprendedor.emprendimiento.formalizaciones?.length">
                                        <th>Formalización</th>
                                        <td>{{ selectedEmprendedor.emprendimiento.formalizaciones.map(f => f.tipo_formalizacion).join(', ') }}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <p v-else class="text-muted">No tiene un emprendimiento registrado.</p>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, computed, nextTick } from 'vue';
import { Modal } from 'bootstrap';

// --- Estado Reactivo ---
const emprendedores = ref([]);
const isLoading = ref(true);
const isDetailLoading = ref(false);
const searchQuery = ref('');
const selectedEmprendedor = ref(null);
let detailsModalInstance = null;

// --- Configuración ---
const API_URL = 'http://127.0.0.1:8000/api/emprendedores';

// --- Lógica de la API ---
const fetchEmprendedores = async () => {
  isLoading.value = true;
  const authToken = localStorage.getItem('auth_token');
  try {
    const response = await fetch(API_URL, {
      headers: { 'Authorization': `Bearer ${authToken}`, 'Accept': 'application/json' },
    });
    if (!response.ok) throw new Error('Error al obtener los datos.');
    const data = await response.json();
    emprendedores.value = data.data;
  } catch (error) {
    console.error("Error fetching data:", error);
  } finally {
    isLoading.value = false;
  }
};

const deleteEmprendedor = async (id) => {
  if (!confirm(`¿Estás seguro de que quieres eliminar el registro con ID: ${id}?`)) return;
  
  const authToken = localStorage.getItem('auth_token');
  try {
    const response = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${authToken}`, 'Accept': 'application/json' }
    });
    if (!response.ok) throw new Error('Error al eliminar el registro.');
    alert('Registro eliminado con éxito.');
    fetchEmprendedores(); 
  } catch(error) {
    alert(error.message);
    console.error(error);
  }
};

// --- Lógica de la Interfaz ---
const showDetails = async (emprendedor) => {
  // 1. Muestra el modal inmediatamente con los datos básicos que ya tenemos
  selectedEmprendedor.value = { ...emprendedor }; 
  detailsModalInstance.show();
  isDetailLoading.value = true; // Activa el spinner DENTRO del modal

  const authToken = localStorage.getItem('auth_token');
  try {
    // 2. Llama al endpoint específico para obtener TODOS los detalles de este emprendedor
    const response = await fetch(`${API_URL}/${emprendedor.id_emprendedor}`, {
      headers: { 'Authorization': `Bearer ${authToken}`, 'Accept': 'application/json' },
    });
    if (!response.ok) throw new Error('Error al cargar los detalles completos.');
    
    const data = await response.json();
    
    // 3. Actualiza la variable 'selectedEmprendedor' con la respuesta COMPLETA
    selectedEmprendedor.value = data.data;

  } catch (error) {
    console.error("Error fetching details:", error);
    // Aquí podrías mostrar un mensaje de error dentro del modal
  } finally {
    isDetailLoading.value = false; // Desactiva el spinner del modal
  }
};

const editEmprendedor = (id) => {
    alert(`Próximo paso: Implementar la lógica para editar el ID: ${id}.`);
};

// --- Lógica de Búsqueda ---
const filteredEmprendedores = computed(() => {
  if (!searchQuery.value) return emprendedores.value;
  const lowerCaseQuery = searchQuery.value.toLowerCase();
  return emprendedores.value.filter(e => 
    e.nombre_completo.toLowerCase().includes(lowerCaseQuery) ||
    e.cedula.includes(lowerCaseQuery) ||
    e.emprendimiento?.nombre_emprendimiento.toLowerCase().includes(lowerCaseQuery)
  );
});

// --- Ciclo de Vida ---
onMounted(() => {
  fetchEmprendedores();
  const modalElement = document.getElementById('detailsModal');
  if(modalElement) {
    detailsModalInstance = new Modal(modalElement);
  }
});
</script>

<style scoped>
/* Estilos específicos para este componente */
.card {
    border: none;
    box-shadow: 0 0 25px rgba(0,0,0,0.08);
}
.card-body {
    padding: 0;
}
.table-responsive {
    height: 100%;
}
thead {
    position: sticky;
    top: 0;
    z-index: 1;
}
.w-25 {
    width: 25% !important;
}
</style>