document.addEventListener("DOMContentLoaded", async function () {

    /* == Definicion de Variables y elementos == */

    const loadingSpinner = document.getElementById('loadingSpinner');
    const loadingElement = document.getElementById('loading');
    const errorElement = document.getElementById('error-message');
    const noDataElement = document.getElementById('no-data-message');
    const tableWrapper = document.getElementById('table-wrapper');
    const tableBody = document.getElementById('table-body');
    const errorDetails = document.getElementById('error-details');
    const userCount = document.getElementById('repuestos-count');
    const searchCodigoInput = document.getElementById('search-name');

    const btnLimpiarFiltros = document.getElementById('btnLimpiarFiltros')

    let repuestosSeleccionados = [];
    let repuestosGlobal = [];

    let tipoSeleccionadoId = null;
    let tiposDisponibles = [];

    let marcaSeleccionadaId = null;
    let marcasDisponibles = [];

    /* == Funciones UI == */

    function showToast(message, type = "info") {
        const toastLive = document.getElementById('liveToast');
        const toastBody = document.getElementById('toast-message');

        if (toastBody && toastLive) {
            toastBody.innerHTML = message;
            toastLive.className = "toast align-items-center border-0";

            switch (type) {
                case "success":
                    toastLive.classList.add("text-bg-success");
                    break;
                case "error":
                    toastLive.classList.add("text-bg-danger");
                    break;
                case "warning":
                    toastLive.classList.add("text-bg-warning");
                    break;
                default:
                    toastLive.classList.add("text-bg-dark");
                    break;
            }

            const toast = new bootstrap.Toast(toastLive, {
                autohide: true,
                delay: 3000
            });

            toast.show();
        }
    }

    function showLoading() {
        console.log('⏳ Mostrando loading...');
        loadingElement.classList.remove('d-none');
        errorElement.classList.add('d-none');
        noDataElement.classList.add('d-none');
        tableWrapper.classList.add('d-none');
    }

    function showError(msg) {
        console.log('❌ Mostrando error:', msg);
        loadingElement.classList.add('d-none');
        errorElement.classList.remove('d-none');
        noDataElement.classList.add('d-none');
        tableWrapper.classList.add('d-none');
        errorDetails.textContent = msg;
    }

    function showNoData() {
        console.log('📭 No hay datos para mostrar');
        loadingElement.classList.add('d-none');
        errorElement.classList.add('d-none');
        noDataElement.classList.remove('d-none');
        tableWrapper.classList.add('d-none');
        userCount.textContent = '0';
    }

    function showTable(count) {
        const wrapper = document.getElementById("table-wrapper");
        const noData = document.getElementById("no-data-message");
        const errorMessage = document.getElementById("error-message");
        const loading = document.getElementById("loading");

        // Ocultar mensajes
        noData.classList.add("d-none");
        errorMessage.classList.add("d-none");
        loading.classList.add("d-none");

        // Mostrar tabla
        wrapper.classList.remove("d-none");

        // Actualizar contador
        document.getElementById("repuestos-count").innerText = count;
    }

    function clearTable() {
        console.log('🧹 Limpiando tabla...');
        tableBody.innerHTML = '';
        searchCodigoInput.value = '';
        showNoData();
    }

    if (loadingSpinner) {
        loadingSpinner.classList.remove('d-none');
    }

    /* == Crear Checkbox para Repuesto == */

    function createCheckboxForRepuesto(repuesto) {
        const check = document.createElement('input');
        check.type = 'checkbox';
        check.className = 'form-check-input selectRepuesto';
        check.title = 'Seleccionar repuesto';

        // Si el repuesto está en repuestosSeleccionados, marcar el checkbox
        const repuestoExistente = repuestosSeleccionados.find(rep => rep.codigo === repuesto.codigo);
        if (repuestoExistente) {
            check.checked = true;
        }

        // Evento para manejar el cambio de estado del checkbox
        check.addEventListener('change', () => {
            const repuestoInfo = {
                codigo: repuesto.codigo || 'N/A',
                marca: repuesto.marca || 'Sin marca',
                tipo: repuesto.tipo || 'Sin tipo',
                nombre: repuesto.nombre || 'Sin nombre',
                medida: repuesto.medida || 'Sin medida',
                precioUnitario: repuesto.precioUnitario || 'Sin PrecioUnitario',
                stock: repuesto.stock || 'Sin stock'
            };

            if (check.checked) {
                // Agregar si no existe
                if (!repuestosSeleccionados.find(rep => rep.codigo === repuestoInfo.codigo)) {
                    repuestosSeleccionados.push(repuestoInfo);
                }
            } else {
                // Quitar si se desmarca
                repuestosSeleccionados = repuestosSeleccionados.filter(rep => rep.codigo !== repuestoInfo.codigo);
            }

            console.log("✅ Repuestos seleccionados:", repuestosSeleccionados);
        });

        return check;
    }

    /* == Renderizar Tabla == */

    function renderTable(repuestos) {
        const tableBody = document.getElementById("table-body");
        tableBody.innerHTML = ""; // limpiar filas previas

        if (!Array.isArray(repuestos) || repuestos.length === 0) {
            showNoData();
            return;
        }

        repuestos.forEach(r => {
            const tr = document.createElement("tr");

            // Crear celda para checkbox
            const tdCheck = document.createElement('td');
            tdCheck.appendChild(createCheckboxForRepuesto(r));

            // Crear el resto de las celdas
            tr.innerHTML = `
                <td>${r.codigo || 'N/A'}</td>
                <td>${r.tipo || 'Sin nombre'}</td>
                <td>${r.marca || 'Sin marca'}</td>
                <td>${r.nombre || 'Sin tipo'}</td>
                <td>${r.medida || 'Sin medida'}</td>
                <td>$ ${r.precioUnitario || '0'}</td>
                <td>${r.stock || '0'}</td>
                <td>
                    <button class="btn btn-sm btn-outline-primary" title="Editar">✏️</button>
                </td>
            `;

            // Insertar checkbox al inicio de la fila
            tr.insertBefore(tdCheck, tr.firstChild);

            tableBody.appendChild(tr);
        });

        showTable(repuestos.length);
    }

    /* == Llenar Dropdows == */

    // Tipos //

    function llenarDropdownTipos(tipos) {

        // CORREGIDO: Buscar específicamente el dropdown de actividades
        const dropdown = document.querySelector('#menuTypes .dropdown-menu');

        if (!dropdown) {
            console.error('❌ No se encontró el dropdown de tipos');
            return;
        }

        console.log('✅ Dropdown de tipos encontrado:', dropdown);

        // Limpiar opciones existentes
        dropdown.innerHTML = '';

        // Agregar actividades como <li> con <button> dentro
        tipos.forEach((tipo, index) => {

            const li = document.createElement('li');
            const button = document.createElement('button');
            button.className = 'dropdown-item';
            button.type = 'button';
            button.textContent = tipo.tipo;
            button.setAttribute('data-value', tipo.idTipo);

            button.addEventListener('click', () => {
                seleccionarTipo(tipo.idTipo, tipo.tipo);
            });

            li.appendChild(button);
            dropdown.appendChild(li);
        });

    }

    function seleccionarTipo(id, descripcion) {
        // Guardar el ID en variable global
        tipoSeleccionadoId = id;

        const botonDropdown = document.getElementById('typeSelected');

        if (botonDropdown) {
            botonDropdown.textContent = descripcion;
            botonDropdown.setAttribute('data-selected', id);
            // Cerrar el dropdown después de seleccionar
            try {
                const dropdown = bootstrap.Dropdown.getInstance(botonDropdown);
                if (dropdown) {
                    dropdown.hide();
                }
                obtenerRepuestosConFiltros(tipoSeleccionadoId,marcaSeleccionadaId);
            } catch (e) {
                console.log('ℹ️ No se pudo cerrar dropdown automáticamente:', e);
            }
        } else {
            console.error('❌ No se encontró el botón activitySelected');
        }
    }

    async function cargarTipos() {

        try {
            const url = 'https://tallermecanicostock.onrender.com/api/TallerStock/Obtener-todos-los-tipos';

            const response = await fetch(url);

            console.log('📊 Response status:', response.status);
            console.log('📊 Response ok:', response.ok);

            if (!response.ok) {
                const errorText = await response.text();
                console.error('❌ Error response body:', errorText);
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const tipos = await response.json();

            // Verificar que sea un array
            if (!Array.isArray(tipos)) {
                console.error('❌ Las actividades no son un array:', typeof tipos);
                throw new Error('Formato de tipos inválido');
            }

            // Guardar las actividades globalmente
            tiposDisponibles = tipos;

            // Llenar el dropdown inmediatamente
            llenarDropdownTipos(tipos);

        } catch (error) {
            console.error('❌ Error al cargar tipos:', error);
            showToast('Error al cargar tipos: ' + error.message,'danger');
        }
    }

    // Marcas //

    function llenarDropdownMarcas(marcas) {

        // CORREGIDO: Buscar específicamente el dropdown de actividades
        const dropdown2 = document.querySelector('#menuMarks .dropdown-menu');

        if (!dropdown2) {
            console.error('❌ No se encontró el dropdown de marcas');
            return;
        }


        // Limpiar opciones existentes
        dropdown2.innerHTML = '';

        // Agregar actividades como <li> con <button> dentro
        marcas.forEach((marca, index) => {

            const li = document.createElement('li');
            const button = document.createElement('button');
            button.className = 'dropdown-item';
            button.type = 'button';
            button.textContent = marca.marca;
            button.setAttribute('data-value', marca.idMarca);

            button.addEventListener('click', () => {
                seleccionarMarca(marca.idMarca, marca.marca);
            });

            li.appendChild(button);
            dropdown2.appendChild(li);
        });

    }

    function seleccionarMarca(id, descripcion) {
        // Guardar el ID en variable global
        marcaSeleccionadaId = id;

        const botonDropdown2 = document.getElementById('markSelected');

        if (botonDropdown2) {
            botonDropdown2.textContent = descripcion;
            botonDropdown2.setAttribute('data-selected', id);
            // Cerrar el dropdown después de seleccionar
            try {
                const dropdown3 = bootstrap.Dropdown.getInstance(botonDropdown2);
                if (dropdown3) {
                    dropdown3.hide();
                }
                obtenerRepuestosConFiltros(tipoSeleccionadoId,marcaSeleccionadaId);
            } catch (e) {
                console.log('ℹ️ No se pudo cerrar dropdown automáticamente:', e);
            }
        } else {
            console.error('❌ No se encontró el botón markSelected');
        }
    }

    async function cargarMarcas() {

        try {
            const url = 'https://tallermecanicostock.onrender.com/api/TallerStock/Obtener-todos-las-marcas';

            const response2 = await fetch(url);

            console.log('📊 Response status:', response2.status);
            console.log('📊 Response ok:', response2.ok);

            if (!response2.ok) {
                const errorText = await response2.text();
                console.error('❌ Error response body:', errorText);
                throw new Error(`HTTP error! status: ${response2.status}`);
            }

            const marcas = await response2.json();

            // Verificar que sea un array
            if (!Array.isArray(marcas)) {
                console.error('❌ Las  marcas no son un array:', typeof marcas);
                throw new Error('Formato de tipos inválido');
            }

            // Guardar las actividades globalmente
            marcasDisponibles = marcas;

            // Llenar el dropdown inmediatamente
            llenarDropdownMarcas(marcas);

        } catch (error) {
            console.error('❌ Error al cargar marcas:', error);
            showToast('Error al cargar marcas: ' + error.message,'danger');
        }
    }




    /* == Cargar Repuestos desde API == */

    async function loadAllRepuestos() {
        showLoading();
        try {
            const response = await fetch('https://tallermecanicostock.onrender.com/api/TallerStock/Obtener-todos-los-repuestos');

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            const repuestos = await response.json();

            console.log("📦 Repuestos recibidos del API:", repuestos);

            if (!Array.isArray(repuestos)) {
                throw new Error('Formato de respuesta inválido - se esperaba un array');
            }

            if (searchCodigoInput) {
                searchCodigoInput.disabled = false;
            }

            repuestosGlobal = repuestos; // guardamos todos
            renderTable(repuestosGlobal); // mostramos todo

        } catch (error) {
            console.error("❌ Error al cargar repuestos:", error);
            showError("Error al cargar repuestos: " + error.message);
        }
    }

    /* == Inicializar y Cargar Datos == */

    try {
        await loadAllRepuestos();
        await cargarTipos();
        await cargarMarcas();
    } catch (error) {
        console.error("❌ Error en inicialización:", error);
    } finally {
        if (loadingSpinner) {
            loadingSpinner.classList.add('d-none');
        }
    }

    /* == Limpiar Filtros ==*/

    btnLimpiarFiltros.addEventListener('click',function(){

        const dropdownTipos = document.getElementById('typeSelected');
        if(dropdownTipos) {
            dropdownTipos.textContent = 'Seleccione un Tipo';
        }
        const dropdownMarcas = document.getElementById('markSelected');
        if(dropdownMarcas) {
            dropdownMarcas.textContent = 'Seleccione una Marca';
        }
        const inputName = document.getElementById('search-name');
        if(inputName) {
            inputName.value = '';
        }

        loadAllRepuestos();

    })


    /* == Event Listener para búsqueda  == */

    if (searchCodigoInput) {
        searchCodigoInput.addEventListener('input', (e) => {
            const searchTerm = e.target.value.toLowerCase().trim();

            if (searchTerm === '') {
                renderTable(repuestosGlobal);
                return;
            }

            const filtered = repuestosGlobal.filter(r =>
                (r.codigo && r.codigo.toLowerCase().includes(searchTerm)) ||
                (r.nombre && r.nombre.toLowerCase().includes(searchTerm)) ||
                (r.marca && r.marca.toLowerCase().includes(searchTerm)) ||
                (r.tipo && r.tipo.toLowerCase().includes(searchTerm))
            );

            renderTable(filtered);
        });
    }

    /* == Búsqueda Por Filtros*/
    const URL_BASE = "https://tallermecanicostock.onrender.com/api/TallerStock/Obtener-todos-los-repuestos-por-filtros";

    /**
     * Realiza una solicitud GET a la API con filtros opcionales.
     *  @param {number | null | undefined} idTipo ID del tipo de repuesto (opcional).
     * @param {number | null | undefined} idMarca ID de la marca (opcional).
     */
    async function obtenerRepuestosConFiltros(idTipo, idMarca) {
        // 1. Crear un objeto para almacenar los parámetros
        const params = {};

        // 2. Agregar los parámetros solo si son válidos (no nulos/undefined y no cero)
        // El '0' se usa como valor para "sin filtro" en tu lógica de C#/SQL.
        if (idTipo && idTipo !== 0) {
            params.idTipo = idTipo;
        }

        if (idMarca && idMarca !== 0) {
            params.idMarca = idMarca;
        }

        // 3. Convertir el objeto de parámetros en una cadena de consulta (query string)
        const queryString = new URLSearchParams(params).toString();

        // 4. Construir la URL final
        // Si queryString está vacío, no se añade el '?'
        const finalUrl = queryString ? `${URL_BASE}?${queryString}` : URL_BASE;

        console.log("URL de la petición:", finalUrl);
        showLoading();
        try {
            const response = await fetch(finalUrl);

            // Verifica si la respuesta es satisfactoria (código 200-299)
            if (!response.ok) {
                // Lanza un error con el código de estado HTTP
                throw new Error(`Error HTTP: ${response.status}`);
            }

            const dataResult = await response.json();
            repuestosGlobal = dataResult;
            renderTable(repuestosGlobal);
        } catch (error) {
            showToast("Error al obtener repuestos por filtros:", 'info');
            throw error; // Re-lanza el error para que el componente que llama lo maneje
        }
    }

});