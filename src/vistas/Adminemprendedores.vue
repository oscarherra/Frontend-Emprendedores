<template>
  <div class="card d-flex flex-column h-100">
    <div class="card-header bg-white d-flex flex-wrap gap-2 justify-content-between align-items-center py-3">
      <div class="d-flex align-items-center gap-2">
        <i class="bi bi-people-fill fs-4 text-primary"></i>
        <h3 class="card-title mb-0">Gestión de Emprendedores</h3>
        <span v-if="!isLoading" class="text-muted small ms-2">{{ totalCountText }}</span>
      </div>

      <div class="d-flex flex-wrap gap-2 align-items-center">
        <div class="search-wrap position-relative">
          <i class="bi bi-search position-absolute" style="left:10px; top: 50%; transform: translateY(-50%); opacity:.6"></i>
          <input
            ref="searchInputRef"
            type="text"
            class="form-control ps-5"
            placeholder="Buscar: nombre, cédula, emprendimiento, correo… (⌘/Ctrl + K)"
            v-model="searchQuery"
          />
          <button v-if="searchQuery" class="btn btn-link position-absolute end-0 top-50 translate-middle-y" @click="clearSearch" title="Limpiar búsqueda">
            <i class="bi bi-x-lg"></i>
          </button>
        </div>

        <div class="dropdown">
          <button class="btn btn-outline-secondary dropdown-toggle" data-bs-toggle="dropdown">
            Columnas
          </button>
          <ul class="dropdown-menu dropdown-menu-end p-2" style="min-width: 240px;">
            <li v-for="col in columns" :key="col.key" class="form-check">
              <input class="form-check-input" type="checkbox" :id="`col-${col.key}`" v-model="col.visible" />
              <label class="form-check-label" :for="`col-${col.key}`">{{ col.label }}</label>
            </li>
          </ul>
        </div>


        <button class="btn btn-outline-success" @click="exportCsv" :disabled="!filteredEmprendedores.length" title="Exportar resultados filtrados a CSV">
          <i class="bi bi-download"></i> Exportar CSV
        </button>
      </div>
    </div>

    <!-- Body -->
    <div class="card-body flex-grow-1 p-0">
      <!-- Loading state -->
      <div v-if="isLoading" class="d-flex justify-content-center align-items-center h-100">
        <div class="text-center">
          <div class="placeholder-glow mb-2">
            <span class="placeholder col-8"></span>
          </div>
          <div class="spinner-border text-primary" role="status"></div>
          <p class="mt-2 text-muted">Cargando datos…</p>
        </div>
      </div>

      <!-- Empty state -->
      <div v-else-if="!emprendedores.length" class="h-100 d-flex flex-column justify-content-center align-items-center text-center p-4">
        <i class="bi bi-inbox fs-1 text-muted"></i>
        <h5 class="mt-3 mb-1">Aún no hay emprendedores</h5>
        <p class="text-muted mb-3">Cuando registres personas emprendedoras aparecerán aquí.</p>
        <button class="btn btn-primary" @click="fetchEmprendedores"><i class="bi bi-arrow-clockwise me-1"></i>Recargar</button>
      </div>

      <!-- Table -->
      <div v-else class="table-responsive" style="height: 100%;">
        <table class="table table-hover align-middle mb-0">
          <thead class="table-light" style="position: sticky; top: 0; z-index: 1;">
            <tr>
              <th v-for="col in visibleColumns" :key="col.key" @click="sortBy(col.key)" role="button" class="user-select-none">
                <div class="d-flex align-items-center gap-1">
                  <span>{{ col.label }}</span>
                  <i v-if="sort.key === col.key" :class="sort.asc ? 'bi bi-caret-up-fill' : 'bi bi-caret-down-fill'" class="text-muted"></i>
                </div>
              </th>
              <th class="text-center" style="width: 120px;">Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="!pagedEmprendedores.length">
              <td :colspan="visibleColumns.length + 1" class="text-center text-muted py-4">No se encontraron registros que coincidan con “{{ searchQuery }}”.</td>
            </tr>

            <tr v-for="e in pagedEmprendedores" :key="e.id_emprendedor">
              <!-- Nombre -->
              <td v-if="isColVisible('nombre')">
                <div class="fw-bold" v-html="highlight(e.nombre_completo)"></div>
                <small class="text-muted">
                  <span v-if="e.sexo">({{ e.sexo }})</span>
                  <span v-if="e.edad != null"> • {{ e.edad }} años</span>
                </small>
              </td>

              <!-- Emprendimiento principal -->
              <td v-if="isColVisible('emprendimiento')">
                <span class="text-muted" v-if="!(e.emprendimientos?.length)">N/A</span>
                <div v-else>
                  <div class="fw-semibold" v-html="highlight(e.emprendimientos?.[0]?.nombre || 'N/A')"></div>
                  <small class="text-muted" v-if="e.emprendimientos?.[0]?.sector">{{ e.emprendimientos?.[0]?.sector }}</small>
                </div>
              </td>

              <!-- Cédula -->
              <td v-if="isColVisible('cedula')" class="font-monospace" v-html="highlight(e.cedula)"></td>

              <!-- Contacto -->
              <td v-if="isColVisible('contacto')">
                <div class="d-flex flex-column gap-1">
                  <div>
                    <i class="bi bi-envelope me-1"></i>
                    <a :href="`mailto:${e.correo_electronico}`" class="text-decoration-none" v-html="highlight(e.correo_electronico)"></a>
                    <button class="btn btn-xs btn-light ms-1" @click="copy(e.correo_electronico)" title="Copiar correo"><i class="bi bi-clipboard"></i></button>
                  </div>
                  <div v-if="e.telefono">
                    <i class="bi bi-telephone me-1"></i>
                    <a :href="`tel:${e.telefono}`" class="text-decoration-none">{{ e.telefono }}</a>
                    <a :href="`https://wa.me/${digits(e.telefono)}`" target="_blank" rel="noopener" class="btn btn-xs btn-outline-success ms-1" title="WhatsApp">
                      <i class="bi bi-whatsapp"></i>
                    </a>
                  </div>
                </div>
              </td>

              <!-- Acciones -->
              <td class="text-center">
                <div class="btn-group">
                  <button @click="showDetails(e)" class="btn btn-sm btn-outline-primary" title="Ver Detalles">
                    <i class="bi bi-eye-fill"></i>
                  </button>
                  <button @click="confirmDelete(e)" class="btn btn-sm btn-outline-danger" title="Eliminar">
                    <i class="bi bi-trash-fill"></i>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div v-if="!isLoading && filteredEmprendedores.length" class="d-flex justify-content-between align-items-center p-3 border-top bg-light-subtle">
        <div class="small text-muted">Mostrando {{ pageStart + 1 }}–{{ pageEnd }} de {{ filteredEmprendedores.length }}</div>
        <nav aria-label="Paginación">
          <ul class="pagination mb-0">
            <li class="page-item" :class="{ disabled: page===1 }"><button class="page-link" @click="page=1" title="Primera">«</button></li>
            <li class="page-item" :class="{ disabled: page===1 }"><button class="page-link" @click="prevPage" title="Anterior">‹</button></li>
            <li class="page-item disabled"><span class="page-link">{{ page }} / {{ totalPages }}</span></li>
            <li class="page-item" :class="{ disabled: page===totalPages }"><button class="page-link" @click="nextPage" title="Siguiente">›</button></li>
            <li class="page-item" :class="{ disabled: page===totalPages }"><button class="page-link" @click="page=totalPages" title="Última">»</button></li>
          </ul>
        </nav>
      </div>
    </div>
  </div>

  <div class="modal fade" id="detailsModal" tabindex="-1">
    <div class="modal-dialog modal-xl modal-dialog-scrollable">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title d-flex align-items-center gap-2">
            <i class="bi bi-person-vcard text-primary"></i>
            Detalles de {{ selectedEmprendedor?.nombre_completo || '—' }}
          </h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
        </div>

        <div class="modal-body">
          <div v-if="isDetailLoading" class="text-center my-5">
            <div class="spinner-border" role="status"></div>
            <p class="mt-2">Cargando detalles completos…</p>
          </div>

          <div v-else-if="selectedEmprendedor">
            <!-- Datos del Emprendedor -->
            <h4 class="mb-3"><i class="bi bi-person-circle text-primary"></i> Datos del Emprendedor</h4>
            <div class="row g-3">
              <div class="col-md-6">
                <table class="table table-bordered table-sm">
                  <tbody>
                    <tr><th class="w-25">Nombre Completo</th><td>{{ selectedEmprendedor.nombre_completo || '—' }}</td></tr>
                    <tr><th>Cédula</th><td>{{ selectedEmprendedor.cedula || '—' }}</td></tr>
                    <tr><th>Sexo</th><td>{{ selectedEmprendedor.sexo || '—' }}</td></tr>
                    <tr><th>Fecha de Nacimiento</th><td>{{ selectedEmprendedor.fecha_nacimiento || '—' }}</td></tr>
                    <tr><th>Edad</th><td>{{ selectedEmprendedor.edad ?? '—' }}</td></tr>
                  </tbody>
                </table>
              </div>
              <div class="col-md-6">
                <table class="table table-bordered table-sm">
                  <tbody>
                    <tr><th>Teléfono</th><td>{{ selectedEmprendedor.telefono || '—' }}</td></tr>
                    <tr><th>Correo</th><td>{{ selectedEmprendedor.correo_electronico || '—' }}</td></tr>
                    <tr><th>Dirección</th><td>{{ selectedEmprendedor.direccion || '—' }}</td></tr>
                    <tr><th>Distrito</th><td>{{ selectedEmprendedor.distrito || '—' }}</td></tr>
                    <tr><th>Comunidad</th><td>{{ selectedEmprendedor.comunidad || '—' }}</td></tr>
                  </tbody>
                </table>
              </div>
            </div>

            <hr class="my-4" />

            <!-- Emprendimientos -->
            <h4 class="mb-3"><i class="bi bi-shop text-success"></i> Emprendimientos</h4>
            <div v-if="(selectedEmprendedor.emprendimientos || []).length">
              <div v-for="(em, idx) in selectedEmprendedor.emprendimientos" :key="em.id_emprendimiento || idx" class="mb-4 p-3 border rounded-3 shadow-sm">
                <h5 class="mb-3">#{{ idx + 1 }} — {{ em.nombre || '—' }}</h5>
                <div class="row g-3">
                  <div class="col-md-8">
                    <table class="table table-bordered table-sm">
                      <tbody>
                        <tr><th class="w-25">Tipo</th><td>{{ em.tipo || '—' }}</td></tr>
                        <tr><th>Año de Inicio</th><td>{{ em.anio_inicio || '—' }}</td></tr>
                        <tr><th>Nº de Empleados</th><td>{{ em.numero_empleados ?? '—' }}</td></tr>
                        <tr><th>Tiene Logo</th><td>{{ em.tiene_logo ? 'Sí' : 'No' }}</td></tr>
                        <tr><th>Descripción</th><td>{{ em.descripcion || '—' }}</td></tr>
                        <tr><th>Eslogan</th><td>{{ em.slogan || '—' }}</td></tr>
                        <tr><th>Sector (texto)</th><td>{{ em.sector || '—' }}</td></tr>
                        <tr v-if="(em.sectores || []).length"><th>Sectores</th><td>{{ (em.sectores || []).join(', ') }}</td></tr>
                        <tr><th>Mobiliario</th><td>{{ em.mobiliario || '—' }}</td></tr>
                        <tr><th>Signos Externos</th><td>{{ em.signos_externos || '—' }}</td></tr>
                        <tr><th>¿Participó en feria?</th><td>{{ em.participo_feria ? 'Sí' : 'No' }}</td></tr>
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
                      <img :src="em.logo_url" alt="Logo" class="img-fluid rounded border" @error="onImgError" loading="lazy">
                    </div>

                    <!-- Galería -->
                    <div v-if="(em.imagenes || []).length">
                      <div class="fw-semibold mb-1">Imágenes ({{ em.imagenes.length }})</div>
                      <div class="row g-2">
                        <div v-for="(img,i) in em.imagenes" :key="i" class="col-6">
                          <div class="thumb-card" @click="openGallery(em.imagenes, i)">
                            <img :src="img" class="thumb-image" :alt="`img-${i+1}`" loading="lazy" @error="onImgError" />
                            <div class="thumb-overlay">
                              <i class="bi bi-search thumb-icon"></i>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <!-- /Galería -->
                  </div>
                </div>
              </div>
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

  <!-- LIGHTBOX -->
  <div v-if="viewer.open" class="viewer-backdrop" @click.self="closeGallery">
    <div class="viewer-topbar">
      <div class="viewer-title">{{ currentImageName }}</div>
      <div class="viewer-actions">
        <a :href="viewer.images[viewer.index]" :download="`emprendimiento-${viewer.index+1}.jpg`" class="btn btn-sm btn-light me-2" title="Descargar">
          <i class="bi bi-download"></i>
        </a>
        <button class="btn btn-sm btn-light me-2" @click.stop="toggleZoom" title="Zoom (doble clic también)">
          <i :class="viewer.zoomed ? 'bi bi-zoom-out' : 'bi bi-zoom-in'"></i>
        </button>
        <button class="btn btn-sm btn-dark" @click="closeGallery" title="Cerrar">
          <i class="bi bi-x-lg"></i>
        </button>
      </div>
    </div>

    <div class="viewer-stage" :class="{ 'is-zoomed': viewer.zoomed }" @dblclick.stop="toggleZoom" @mousedown="onPanStart" @mousemove="onPanMove" @mouseup="onPanEnd" @mouseleave="onPanEnd" @touchstart.passive="onTouchStart" @touchmove.prevent="onTouchMove" @touchend="onTouchEnd">
      <img :src="viewer.images[viewer.index]" class="viewer-image" :style="imageTransform" draggable="false" @error="onImgError" />

      <button class="nav-btn left" @click.stop="prevImage" title="Anterior">
        <i class="bi bi-chevron-left"></i>
      </button>
      <button class="nav-btn right" @click.stop="nextImage" title="Siguiente">
        <i class="bi bi-chevron-right"></i>
      </button>
    </div>

    <div class="viewer-thumbs">
      <div v-for="(img,i) in viewer.images" :key="i" class="viewer-thumb" :class="{ active: i === viewer.index }" @click="goTo(i)">
        <img :src="img" :alt="`thumb-${i+1}`" @error="onImgError" />
      </div>
    </div>
  </div>
  <!-- /LIGHTBOX -->

  <!-- Delete Confirm Modal -->
  <div class="modal fade" id="confirmDeleteModal" tabindex="-1">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title"><i class="bi bi-exclamation-triangle text-danger me-1"></i> Confirmar eliminación</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          ¿Deseas eliminar a <strong>{{ toDelete?.nombre_completo }}</strong>? Esta acción no se puede deshacer.
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
          <button type="button" class="btn btn-danger" @click="deleteEmprendedor(toDelete?.id_emprendedor)">Eliminar</button>
        </div>
      </div>
    </div>
  </div>

  <!-- Toasts -->
  <div class="toast-container position-fixed bottom-0 end-0 p-3" style="z-index: 3000;">
    <div ref="toastRef" class="toast align-items-center text-bg-dark border-0" role="status" aria-live="polite" aria-atomic="true">
      <div class="d-flex">
        <div class="toast-body">{{ toast.message }}</div>
        <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, onBeforeUnmount, watch } from 'vue'
import { Modal, Toast } from 'bootstrap'

const emprendedores = ref([])
const isLoading = ref(true)
const isDetailLoading = ref(false)
const searchQuery = ref('')
const searchInputRef = ref(null)

const selectedEmprendedor = ref(null)
let detailsModalInstance = null
let confirmDeleteInstance = null
const toDelete = ref(null)

const toast = ref({ message: '' })
const toastRef = ref(null)
let toastInstance = null


const sort = ref({ key: 'nombre', asc: true })


const page = ref(1)
const pageSize = ref(15)


const columns = ref([
  { key: 'nombre', label: 'Nombre del Emprendedor', visible: true },
  { key: 'emprendimiento', label: 'Emprendimiento', visible: true },
  { key: 'cedula', label: 'Cédula', visible: true },
  { key: 'contacto', label: 'Contacto', visible: true }
])


const API_URL = import.meta?.env?.VITE_API_EMPRENDEDORES_URL || 'http://127.0.0.1:8000/api/emprendedores'


const safeUrl = (u) => { if (!u) return ''; try { return /^https?:\/\//i.test(u) ? u : `https://${u}` } catch { return u } }
const digits = (t) => (t || '').replace(/\D/g, '')
const highlight = (text) => {
  if (!text) return ''
  const q = searchQuery.value.trim()
  if (!q) return text
  const re = new RegExp(`(${q.replace(/[.*+?^${}()|[\\]\\\\]/g, '\\$&')})`, 'ig')
  return text.toString().replace(re, '<mark>$1</mark>')
}
const copy = async (val) => { try { await navigator.clipboard.writeText(val); showToast('Copiado al portapapeles') } catch { showToast('No fue posible copiar') } }
const showToast = (message) => { toast.value.message = message; toastInstance?.show() }
const clearSearch = () => { searchQuery.value = ''; searchInputRef.value?.focus() }

/* Fetch */
const fetchEmprendedores = async () => {
  isLoading.value = true
  const authToken = localStorage.getItem('auth_token')
  try {
    const resp = await fetch(API_URL, { headers: { Authorization: `Bearer ${authToken}`, Accept: 'application/json' } })
    if (resp.status === 401) { showToast('Sesión vencida. Vuelve a iniciar sesión.'); throw new Error('Unauthorized') }
    if (!resp.ok) throw new Error('Error al obtener los datos.')
    const json = await resp.json()
    emprendedores.value = Array.isArray(json.data) ? json.data : []
  } catch (err) {
    console.error('Error fetching data:', err)
    showToast('No se pudieron cargar los datos')
  } finally { isLoading.value = false }
}

/* Details */
const showDetails = async (row) => {
  selectedEmprendedor.value = { ...row }
  detailsModalInstance.show()
  isDetailLoading.value = true
  const authToken = localStorage.getItem('auth_token')
  try {
    const resp = await fetch(`${API_URL}/${row.id_emprendedor}`, { headers: { Authorization: 'Bearer ' + authToken, Accept: 'application/json' } })
    if (!resp.ok) throw new Error('Error al cargar los detalles completos.')
    const json = await resp.json()
    selectedEmprendedor.value = json.data || {}
  } catch (err) {
    console.error('Error fetching details:', err)
    showToast('No se pudieron cargar los detalles completos')
  } finally { isDetailLoading.value = false }
}

/* Delete */
const confirmDelete = (row) => { toDelete.value = row; confirmDeleteInstance.show() }
const deleteEmprendedor = async (id) => {
  const authToken = localStorage.getItem('auth_token')
  try {
    const resp = await fetch(`${API_URL}/${id}`, { method: 'DELETE', headers: { Authorization: 'Bearer ' + authToken, Accept: 'application/json' } })
    if (!resp.ok) throw new Error('Error al eliminar el registro.')
    await fetchEmprendedores()
    showToast('Registro eliminado con éxito')
  } catch (err) {
    console.error(err)
    showToast('No se pudo eliminar el registro')
  } finally {
    confirmDeleteInstance.hide()
    toDelete.value = null
  }
}

const normalized = computed(() =>
  (emprendedores.value || []).map((e) => ({
    ...e,
    _empNombre: (e.emprendimientos?.[0]?.nombre || '').toLowerCase(),
    _nombre: (e.nombre_completo || '').toLowerCase(),
    _correo: (e.correo_electronico || '').toLowerCase(),
    _cedula: (e.cedula || '').toLowerCase()
  }))
)

const filteredEmprendedores = computed(() => {
  const q = (searchQuery.value || '').trim().toLowerCase()
  let list = normalized.value
  if (q) list = list.filter((e) => e._nombre.includes(q) || e._cedula.includes(q) || e._empNombre.includes(q) || e._correo.includes(q))
  const key = sort.value.key
  const asc = sort.value.asc ? 1 : -1
  const pick = (e) =>
    key === 'nombre' ? e.nombre_completo || '' :
    key === 'emprendimiento' ? e.emprendimientos?.[0]?.nombre || '' :
    key === 'cedula' ? e.cedula || '' :
    key === 'contacto' ? e.correo_electronico || '' : ''
  list = [...list].sort((a, b) => (pick(a) > pick(b) ? asc : pick(a) < pick(b) ? -asc : 0))
  return list
})

const totalPages = computed(() => Math.max(1, Math.ceil(filteredEmprendedores.value.length / pageSize.value)))
const pageStart = computed(() => (page.value - 1) * pageSize.value)
const pageEnd = computed(() => Math.min(pageStart.value + pageSize.value, filteredEmprendedores.value.length))
const pagedEmprendedores = computed(() => filteredEmprendedores.value.slice(pageStart.value, pageEnd.value))

const totalCountText = computed(() => `${emprendedores.value.length} total · ${filteredEmprendedores.value.length} filtrados`)
const visibleColumns = computed(() => columns.value.filter((c) => c.visible))
const isColVisible = (key) => columns.value.find((c) => c.key === key)?.visible
const sortBy = (key) => { if (sort.value.key === key) sort.value.asc = !sort.value.asc; else sort.value = { key, asc: true } }

watch([searchQuery], () => { page.value = 1 })

/* Pagination controls */
const prevPage = () => { if (page.value > 1) page.value-- }
const nextPage = () => { if (page.value < totalPages.value) page.value++ }

/* Keyboard */
const onGlobalKey = (e) => {
  const k = e.key?.toLowerCase()
  const mod = e.metaKey || e.ctrlKey
  if (mod && k === 'k') { e.preventDefault(); searchInputRef.value?.focus() }
}

/* Export CSV (cédula como id, filas por emprendimiento, sin imágenes) */
const exportCsv = () => {
  const rows = []
  filteredEmprendedores.value.forEach((e) => {
    const emprendimientos = Array.isArray(e.emprendimientos) && e.emprendimientos.length ? e.emprendimientos : [null]
    emprendimientos.forEach((em) => {
      rows.push({
        Cedula: e.cedula || '',
        NombreCompleto: e.nombre_completo || '',
        Sexo: e.sexo || '',
        FechaNacimiento: e.fecha_nacimiento || '',
        Edad: e.edad ?? '',
        Telefono: e.telefono || '',
        Correo: e.correo_electronico || '',
        Direccion: e.direccion || '',
        Distrito: e.distrito || '',
        Comunidad: e.comunidad || '',
        Escolaridad: Array.isArray(e.escolaridad) ? e.escolaridad.join('; ') : (e.escolaridad || ''),
        Certificaciones: e.certificaciones || '',
        Emp_Nombre: em?.nombre || '',
        Emp_Tipo: em?.tipo || '',
        Emp_Descripcion: em?.descripcion || '',
        Emp_Slogan: em?.slogan || '',
        Emp_AnioInicio: em?.anio_inicio || '',
        Emp_NumEmpleados: em?.numero_empleados ?? '',
        Emp_Mobiliario: em?.mobiliario || '',
        Emp_SignosExternos: em?.signos_externos || '',
        Emp_TieneLogo: em?.tiene_logo ? 'Sí' : 'No',
        Emp_SectorTexto: em?.sector || '',
        Emp_SectoresRelacion: Array.isArray(em?.sectores) ? em.sectores.join('; ') : '',
        Emp_ParticipoFeria: em?.participo_feria ? 'Sí' : 'No',
        Emp_CualesFerias: em?.cuales_ferias || '',
        Emp_Proyeccion_Intereses: Array.isArray(em?.proyeccion?.intereses) ? em.proyeccion.intereses.join('; ') : '',
        Emp_Proyeccion_IngresoMensual: em?.proyeccion?.ingreso_mensual || '',
        Emp_Formalizaciones: Array.isArray(em?.formalizaciones) ? em.formalizaciones.join('; ') : '',
        Emp_Apoyos: Array.isArray(em?.apoyos) ? em.apoyos.join('; ') : '',
        Emp_Necesidades: Array.isArray(em?.necesidades) ? em.necesidades.join('; ') : '',
        Emp_Redes: Array.isArray(em?.redes) ? em.redes.map(r => `${r.nombre}: ${r.url}`).join(' | ') : ''
      })
    })
  })

  if (!rows.length) { showToast('No hay datos para exportar'); return }

  const headers = Object.keys(rows[0])
  const escape = (v) => {
    const s = String(v ?? '')
    return /[",\n]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s
  }
  const csv = [headers.join(','), ...rows.map(r => headers.map(h => escape(r[h])).join(','))].join('\n')
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `emprendedores_${new Date().toISOString().slice(0,10)}.csv`
  a.click()
  URL.revokeObjectURL(url)
}

/* Lightbox + lifecycle */
const viewer = ref({ open:false, images:[], index:0, zoomed:false, pan:{x:0,y:0}, panning:false, start:{x:0,y:0}, touch:{x:0,y:0} })
const openGallery = (imgs, startIdx=0) => { viewer.value.images = imgs || []; viewer.value.index = startIdx || 0; viewer.value.open = true; viewer.value.zoomed = false; viewer.value.pan = {x:0,y:0} }
const closeGallery = () => { viewer.value.open = false; viewer.value.images = []; viewer.value.index = 0; viewer.value.zoomed = false; viewer.value.pan = {x:0,y:0} }
const nextImage = () => { if (!viewer.value.images.length) return; viewer.value.index = (viewer.value.index + 1) % viewer.value.images.length; viewer.value.zoomed = false; viewer.value.pan = {x:0,y:0} }
const prevImage = () => { if (!viewer.value.images.length) return; viewer.value.index = (viewer.value.index - 1 + viewer.value.images.length) % viewer.value.images.length; viewer.value.zoomed = false; viewer.value.pan = {x:0,y:0} }
const goTo = (i) => { viewer.value.index = i; viewer.value.zoomed = false; viewer.value.pan = {x:0,y:0} }
const toggleZoom = () => { viewer.value.zoomed = !viewer.value.zoomed; viewer.value.pan = {x:0,y:0} }
const onPanStart = (e) => { if (!viewer.value.zoomed) return; viewer.value.panning = true; viewer.value.start = { x: e.clientX - viewer.value.pan.x, y: e.clientY - viewer.value.pan.y } }
const onPanMove = (e) => { if (!viewer.value.zoomed || !viewer.value.panning) return; viewer.value.pan = { x: e.clientX - viewer.value.start.x, y: e.clientY - viewer.value.start.y } }
const onPanEnd = () => { viewer.value.panning = false }
const onTouchStart = (e) => { if (!e.touches?.length) return; viewer.value.touch.x = e.touches[0].clientX }
const onTouchMove = (e) => {
  if (!e.touches?.length) return
  const dx = e.touches[0].clientX - viewer.value.touch.x
  if (Math.abs(dx) > 50) { dx > 0 ? prevPage() : nextPage(); viewer.value.touch.x = e.touches[0].clientX }
}
const onTouchEnd = () => {}
const imageTransform = computed(() => { const scale = viewer.value.zoomed ? 1.8 : 1; const { x, y } = viewer.value.pan; return viewer.value.zoomed ? { transform: `translate(${x}px, ${y}px) scale(${scale})` } : { transform: `scale(${scale})` } })
const currentImageName = computed(() => { const url = viewer.value.images[viewer.value.index] || ''; const parts = url.split('/'); return parts[parts.length - 1] || 'imagen' })
const onImgError = (e) => { e.target.onerror=null; e.target.src='data:image/svg+xml;charset=UTF-8,'+encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="300" height="200"><rect width="100%" height="100%" fill="#f1f3f5"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="#868e96" font-family="Arial" font-size="14">Imagen no disponible</text></svg>`) }

onMounted(() => {
  fetchEmprendedores()
  const modalEl = document.getElementById('detailsModal'); if (modalEl) detailsModalInstance = new Modal(modalEl)
  const confirmEl = document.getElementById('confirmDeleteModal'); if (confirmEl) confirmDeleteInstance = new Modal(confirmEl)
  toastInstance = new Toast(toastRef.value, { delay: 2600 })
  window.addEventListener('keydown', onGlobalKey)
})
onBeforeUnmount(() => { window.removeEventListener('keydown', onGlobalKey) })
</script>

<style scoped>
.card { border: none; box-shadow: 0 0 25px rgba(0,0,0,0.08); }
.card-body { padding: 0; }
.table-responsive { height: 100%; }

/* Search */
.search-wrap { min-width: 320px; }
.search-wrap .btn-link { color: #6c757d; }

/* Thumbs */
.thumb-card { position: relative; overflow: hidden; border-radius: .6rem; border: 1px solid rgba(0,0,0,.08); background: #f8f9fa; cursor: zoom-in; }
.thumb-image { width: 100%; height: 100%; display: block; object-fit: cover; transition: transform .35s ease; }
.thumb-card:hover .thumb-image { transform: scale(1.06); }
.thumb-overlay { position: absolute; inset: 0; background: linear-gradient(180deg, rgba(0,0,0,0) 40%, rgba(0,0,0,.35) 100%); opacity: 0; transition: opacity .25s ease; display: flex; align-items: flex-end; justify-content: flex-end; padding: .35rem .45rem; }
.thumb-card:hover .thumb-overlay { opacity: 1; }
.thumb-icon { font-size: 1.15rem; color: #fff; }

/* Viewer */
.viewer-backdrop { position: fixed; inset: 0; z-index: 2050; background: rgba(10,10,12,.88); display: flex; flex-direction: column; }
.viewer-topbar { display: flex; align-items: center; justify-content: space-between; padding: .6rem .9rem; color: #fff; }
.viewer-title { font-weight: 600; opacity: .9; }
.viewer-actions .btn { display: inline-flex; align-items: center; justify-content: center; }
.viewer-stage { position: relative; flex: 1; display: flex; align-items: center; justify-content: center; overflow: hidden; }
.viewer-image { max-width: 88vw; max-height: 80vh; border-radius: .6rem; box-shadow: 0 10px 40px rgba(0,0,0,.35); transition: transform .2s ease; user-select: none; will-change: transform; }
.viewer-stage.is-zoomed { cursor: grab; }
.viewer-stage.is-zoomed:active { cursor: grabbing; }
.nav-btn { position: absolute; top: 50%; transform: translateY(-50%); width: 44px; height: 44px; border-radius: 999px; background: rgba(255,255,255,.9); border: none; display: grid; place-items: center; box-shadow: 0 6px 20px rgba(0,0,0,.25); }
.nav-btn i { font-size: 1.25rem; }
.nav-btn.left { left: 16px; }
.nav-btn.right { right: 16px; }
.nav-btn:hover { background: #fff; }
.viewer-thumbs { display: flex; gap: .5rem; padding: .6rem .9rem .9rem; overflow-x: auto; }
.viewer-thumb { width: 72px; height: 60px; flex: 0 0 auto; border-radius: .4rem; overflow: hidden; border: 2px solid transparent; cursor: pointer; opacity: .8; transition: transform .2s ease, border-color .2s ease, opacity .2s ease; }
.viewer-thumb img { width: 100%; height: 100%; object-fit: cover; display: block; }
.viewer-thumb:hover { transform: translateY(-2px); opacity: 1; }
.viewer-thumb.active { border-color: #0d6efd; opacity: 1; }

/* Small button utility */
.btn.btn-xs { padding: .1rem .35rem; font-size: .75rem; line-height: 1; }
</style>
