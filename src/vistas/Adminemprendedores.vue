<template>
  <div class="card d-flex flex-column h-100">
    <div class="card-header bg-white d-flex justify-content-between align-items-center py-3">
      <h3 class="card-title mb-0">Gestión de Emprendedores</h3>
      <div class="w-50">
        <input
          type="text"
          class="form-control"
          placeholder="Buscar por nombre, cédula..."
          v-model="searchQuery"
        />
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

            <tr v-for="e in filteredEmprendedores" :key="e.id_emprendedor">
              <td>
                <div class="fw-bold">{{ e.nombre_completo }}</div>
                <small class="text-muted">
                  {{ e.sexo ? `(${e.sexo})` : '' }} {{ e.edad != null ? `• ${e.edad} años` : '' }}
                </small>
              </td>

              <td>
                {{ (e.emprendimientos?.[0]?.nombre) || 'N/A' }}
              </td>

              <td>{{ e.cedula }}</td>
              <td>{{ e.correo_electronico }}</td>

              <td class="text-center">
                <button @click="showDetails(e)" class="btn btn-sm btn-outline-info" title="Ver Detalles">
                  <i class="bi bi-eye-fill"></i>
                </button>
                <button @click="editEmprendedor(e.id_emprendedor)" class="btn btn-sm btn-outline-primary ms-1" title="Editar">
                  <i class="bi bi-pencil-fill"></i>
                </button>
                <button @click="deleteEmprendedor(e.id_emprendedor)" class="btn btn-sm btn-outline-danger ms-1" title="Eliminar">
                  <i class="bi bi-trash-fill"></i>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>

  <!-- Modal Detalles -->
  <div class="modal fade" id="detailsModal" tabindex="-1">
    <div class="modal-dialog modal-xl modal-dialog-scrollable">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">
            Detalles de {{ selectedEmprendedor?.nombre_completo }}
          </h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
        </div>

        <div class="modal-body">
          <div v-if="isDetailLoading" class="text-center my-5">
            <div class="spinner-border" role="status"></div>
            <p class="mt-2">Cargando detalles completos...</p>
          </div>

          <div v-else-if="selectedEmprendedor">
            <!-- Datos del Emprendedor -->
            <h4><i class="bi bi-person-circle text-primary"></i> Datos del Emprendedor</h4>
            <table class="table table-bordered table-sm">
              <tbody>
                <tr><th class="w-25">Nombre Completo</th><td>{{ selectedEmprendedor.nombre_completo }}</td></tr>
                <tr><th>Cédula</th><td>{{ selectedEmprendedor.cedula }}</td></tr>
                <tr><th>Sexo</th><td>{{ selectedEmprendedor.sexo || '—' }}</td></tr>
                <tr><th>Fecha de Nacimiento</th><td>{{ selectedEmprendedor.fecha_nacimiento || '—' }}</td></tr>
                <tr><th>Edad</th><td>{{ selectedEmprendedor.edad ?? '—' }}</td></tr>
                <tr><th>Teléfono</th><td>{{ selectedEmprendedor.telefono }}</td></tr>
                <tr><th>Correo Electrónico</th><td>{{ selectedEmprendedor.correo_electronico }}</td></tr>
                <tr><th>Dirección</th><td>{{ selectedEmprendedor.direccion }}</td></tr>
                <tr><th>Distrito</th><td>{{ selectedEmprendedor.distrito }}</td></tr>
                <tr><th>Comunidad</th><td>{{ selectedEmprendedor.comunidad }}</td></tr>
                <tr><th>Escolaridad</th><td>{{ (selectedEmprendedor.escolaridad || []).join(', ') }}</td></tr>
                <tr><th>Certificaciones</th><td>{{ selectedEmprendedor.certificaciones || '—' }}</td></tr>
              </tbody>
            </table>

            <hr class="my-4">

            <!-- Emprendimientos -->
            <h4><i class="bi bi-shop text-success"></i> Emprendimientos</h4>
            <div v-if="(selectedEmprendedor.emprendimientos || []).length">
              <div
                v-for="(em, idx) in selectedEmprendedor.emprendimientos"
                :key="em.id_emprendimiento || idx"
                class="mb-4 p-3 border rounded-3"
              >
                <h5 class="mb-3">#{{ idx + 1 }} — {{ em.nombre }}</h5>

                <div class="row g-3">
                  <div class="col-md-8">
                    <table class="table table-bordered table-sm">
                      <tbody>
                        <tr><th class="w-25">Tipo</th><td>{{ em.tipo }}</td></tr>
                        <tr><th>Descripción</th><td>{{ em.descripcion }}</td></tr>
                        <tr><th>Slogan</th><td>{{ em.slogan || '—' }}</td></tr>
                        <tr><th>Año de Inicio</th><td>{{ em.anio_inicio || '—' }}</td></tr>
                        <tr><th>Nº de Empleados</th><td>{{ em.numero_empleados ?? '—' }}</td></tr>
                        <tr><th>Mobiliario</th><td>{{ em.mobiliario || '—' }}</td></tr>
                        <tr><th>Signos Externos</th><td>{{ em.signos_externos || '—' }}</td></tr>
                        <tr><th>Tiene Logo</th><td><span class="badge" :class="em.tiene_logo ? 'bg-success' : 'bg-secondary'">{{ em.tiene_logo ? 'Sí' : 'No' }}</span></td></tr>
                        <tr><th>Sector (texto)</th><td>{{ em.sector || '—' }}</td></tr>
                        <tr v-if="(em.sectores || []).length"><th>Sectores (relación)</th><td>{{ (em.sectores || []).join(', ') }}</td></tr>
                        <tr><th>¿Participó en feria?</th><td><span class="badge" :class="em.participo_feria ? 'bg-success' : 'bg-secondary'">{{ em.participo_feria ? 'Sí' : 'No' }}</span></td></tr>
                        <tr v-if="em.cuales_ferias"><th>¿Cuáles?</th><td>{{ em.cuales_ferias }}</td></tr>
                        <tr v-if="em.proyeccion">
                          <th>Proyección</th>
                          <td>
                            <div><strong>Intereses:</strong> {{ (em.proyeccion.intereses || []).join(', ') || '—' }}</div>
                            <div><strong>Ingreso Mensual:</strong> {{ em.proyeccion.ingreso_mensual || '—' }}</div>
                          </td>
                        </tr>
                        <tr v-if="(em.formalizaciones || []).length"><th>Formalización</th><td>{{ (em.formalizaciones || []).join(', ') }}</td></tr>
                        <tr v-if="(em.apoyos || []).length"><th>Apoyos deseados</th><td>{{ (em.apoyos || []).join(', ') }}</td></tr>
                        <tr v-if="(em.necesidades || []).length"><th>Necesidades</th><td>{{ (em.necesidades || []).join(', ') }}</td></tr>
                        <tr v-if="(em.redes || []).length">
                          <th>Redes</th>
                          <td>
                            <ul class="list-unstyled mb-0">
                              <li v-for="(r,i) in em.redes" :key="i">
                                <strong>{{ r.nombre }}:</strong>
                                <a :href="safeUrl(r.url)" target="_blank" rel="noopener">{{ r.url }}</a>
                              </li>
                            </ul>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  <div class="col-md-4">
                    <div v-if="em.logo_url" class="mb-3">
                      <div class="fw-semibold mb-1">Logo</div>
                      <img :src="em.logo_url" alt="Logo" class="img-fluid rounded border">
                    </div>

                    <div v-if="(em.imagenes || []).length">
                      <div class="fw-semibold mb-1">Imágenes</div>
                      <div class="row g-2">
                        <div v-for="(img,i) in em.imagenes" :key="i" class="col-6">
                          <img :src="img" class="img-fluid rounded border" :alt="`img-${i+1}`">
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div> <!-- /emprendimiento -->
            </div>

            <p v-else class="text-muted">No tiene emprendimientos registrados.</p>
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
import { ref, onMounted, computed } from 'vue';
import { Modal } from 'bootstrap';

const emprendedores = ref([]);
const isLoading = ref(true);
const isDetailLoading = ref(false);
const searchQuery = ref('');
const selectedEmprendedor = ref(null);
let detailsModalInstance = null;

const API_URL = 'http://127.0.0.1:8000/api/emprendedores';

const safeUrl = (u) => {
  if (!u) return '';
  try {
    const hasProto = /^https?:\/\//i.test(u);
    return hasProto ? u : `https://${u}`;
  } catch { return u; }
};

const fetchEmprendedores = async () => {
  isLoading.value = true;
  const authToken = localStorage.getItem('auth_token');
  try {
    const resp = await fetch(API_URL, {
      headers: { 'Authorization': `Bearer ${authToken}`, 'Accept': 'application/json' },
    });
    if (!resp.ok) throw new Error('Error al obtener los datos.');
    const json = await resp.json();
    // Colección: data = [ ... ]
    emprendedores.value = Array.isArray(json.data) ? json.data : [];
  } catch (err) {
    console.error('Error fetching data:', err);
    alert('Error al obtener los datos.');
  } finally {
    isLoading.value = false;
  }
};

const showDetails = async (row) => {
  selectedEmprendedor.value = { ...row };
  detailsModalInstance.show();
  isDetailLoading.value = true;

  const authToken = localStorage.getItem('auth_token');
  try {
    const resp = await fetch(`${API_URL}/${row.id_emprendedor}`, {
      headers: { 'Authorization': `Bearer ${authToken}`, 'Accept': 'application/json' },
    });
    if (!resp.ok) throw new Error('Error al cargar los detalles completos.');
    const json = await resp.json();
    // Resource: data = { ... }
    selectedEmprendedor.value = json.data || {};
  } catch (err) {
    console.error('Error fetching details:', err);
    alert('No se pudieron cargar los detalles completos.');
  } finally {
    isDetailLoading.value = false;
  }
};

const deleteEmprendedor = async (id) => {
  if (!confirm(`¿Eliminar el registro con ID: ${id}?`)) return;
  const authToken = localStorage.getItem('auth_token');
  try {
    const resp = await fetch(`${API_URL}/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${authToken}`, 'Accept': 'application/json' },
    });
    if (!resp.ok) throw new Error('Error al eliminar el registro.');
    await fetchEmprendedores();
    alert('Registro eliminado con éxito.');
  } catch (err) {
    console.error(err);
    alert('No se pudo eliminar el registro.');
  }
};

const editEmprendedor = (id) => {
  alert(`TODO: Implementar edición para ID: ${id}`);
};

const filteredEmprendedores = computed(() => {
  if (!searchQuery.value) return emprendedores.value;
  const q = searchQuery.value.toLowerCase();
  return emprendedores.value.filter((e) => {
    const nombre = (e.nombre_completo || '').toLowerCase();
    const cedula = e.cedula || '';
    const empName = (e.emprendimientos?.[0]?.nombre || '').toLowerCase();
    return nombre.includes(q) || cedula.includes(q) || empName.includes(q);
  });
});

onMounted(() => {
  fetchEmprendedores();
  const modalEl = document.getElementById('detailsModal');
  if (modalEl) detailsModalInstance = new Modal(modalEl);
});
</script>

<style scoped>
.card { border: none; box-shadow: 0 0 25px rgba(0,0,0,0.08); }
.card-body { padding: 0; }
.table-responsive { height: 100%; }
thead { position: sticky; top: 0; z-index: 1; }
.w-25 { width: 25% !important; }
.badge { font-weight: 600; }
</style>
