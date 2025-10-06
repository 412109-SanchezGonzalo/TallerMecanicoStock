document.addEventListener("DOMContentLoaded", async function () {

    /* == Definicion de Variables y elementos == */

    // Elementos del Modal Edit
    const modalEdit = document.getElementById('modal-editRepuesto');
    const closeEditModalBtn = document.getElementById('closeeditRepuestoModalBtn');
    const btnConfirmar = document.getElementById('btnConfirmarEdit');

    // Inputs del Modal Edit
    const inputCodigo = document.getElementById('codigoValue');
    const inputMotorModelo = document.getElementById('motor-modeloValue');
    const inputMedidaTipo = document.getElementById('medida-tipoValue');
    const inputPrecio = document.getElementById('precioValue');
    const inputStock = document.getElementById('stockValue');

    // Dropdown Buttons del Modal
    const typeSelectedEditBtn = document.getElementById('typeSelectedEdit');
    const markSelectedEditBtn = document.getElementById('markSelectedEdit');

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

    const btnArmarPresupuesto = document.getElementById('btnArmarPresupuesto');
    const modalPresupuesto = document.getElementById('modal-Presupuesto');

    let repuestosSeleccionados = [];
    let repuestosGlobal = [];

    let tipoSeleccionadoId = null;
    let tiposDisponibles = [];

    let marcaSeleccionadaId = null;
    let marcasDisponibles = [];

    let currentRepuestoIdTipo = null;
    let currentRepuestoIdMarca = null;

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

            // Crear el botón de Editar
            const editButton = document.createElement('button');
            editButton.className = 'btn btn-sm btn-outline-primary btn-edit-repuesto';
            editButton.title = 'Editar';
            editButton.innerHTML = '✏️';

            // ⭐️ AÑADIR EVENTO AL BOTÓN DE EDITAR
            // Pasamos el objeto repuesto completo a la función openModalEdit
            editButton.addEventListener('click', () => openModalEdit(r));

            // Crear el resto de las celdas
            tr.innerHTML = `
                <td>${r.codigo || 'N/A'}</td>
                <td>${r.tipo || 'Sin nombre'}</td>
                <td>${r.marca || 'Sin marca'}</td>
                <td>${r.nombre || 'Sin tipo'}</td>
                <td>${r.medida || 'Sin medida'}</td>
                <td>$ ${r.precioUnitario || '0'}</td>
                <td>${r.stock || '0'}</td>
                <td></td> `;

            // Insertar checkbox al inicio de la fila
            tr.insertBefore(tdCheck, tr.firstChild);

            // Insertar botón de editar en la última celda
            tr.lastElementChild.appendChild(editButton);

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

    /* == Abrir Modal de Edición == */

    async function openModalEdit(repuesto) {

        const modalEdit = document.getElementById('modal-editRepuesto');
        if (!modalEdit) return; // Salir si el modal no se encuentra

        console.log("✏️ Abriendo modal para repuesto:", repuesto);

        // 1. Rellenar los campos de texto
        // Usamos las constantes definidas al inicio del script
        inputCodigo.value = repuesto.codigo || '';
        inputMotorModelo.value = repuesto.nombre || '';
        inputMedidaTipo.value = repuesto.medida || '';
        inputPrecio.value = repuesto.precioUnitario || '0';
        inputStock.value = repuesto.stock || '0';

        // 2. Establecer el texto y el ID de los Dropdowns inhabilitados
        // NOTA: Asume que 'repuesto' tiene idTipo, idMarca, tipo y marca.

        // Tipo de Repuesto
        typeSelectedEditBtn.textContent = repuesto.tipo || 'Sin Tipo';
        typeSelectedEditBtn.setAttribute('data-selected', repuesto.idTipo || '');

        // Marca
        markSelectedEditBtn.textContent = repuesto.marca || 'Sin Marca';
        markSelectedEditBtn.setAttribute('data-selected', repuesto.idMarca || '');

        // 3. Almacenar los IDs para usarlos en la función de confirmación (si aplica)
        // Esto es útil si tu API de edición necesita estos IDs
        currentRepuestoIdTipo = repuesto.idTipo || null;
        currentRepuestoIdMarca = repuesto.idMarca || null;

        // 4. Mostrar el modal
        modalEdit.style.display = 'flex';
    }

    /* == Cierre del Modal Edicion == */

    function closeModalEdit() {
        if(modalEdit) {
            modalEdit.style.display = 'none'; // Oculta el modal
        }
    }

    // Cerrar con el botón 'X'
    if(closeEditModalBtn) {
        closeEditModalBtn.addEventListener('click', closeModalEdit);
    }

    /* == Confirmar Cambios == */


    async function guardarRepuestoEditado() {

        repuestosSeleccionados = [];

        const codigo = inputCodigo.value;
        const nombre = inputMotorModelo.value;
        const stock = inputStock.value;
        const precio = inputPrecio.value;

        // 2. Construir el objeto de datos (Body)
        const repuestoEditado = {

            codigo: codigo,
            nombre: nombre,      // Corresponde a Motor/Modelo
            cantidad: parseInt(stock, 10), // Convertir a número entero
            precio: parseFloat(precio) // Convertir a número flotante/decimal

        };

        console.log("🛠️ Enviando datos de edición:", repuestoEditado);

        // 3. Ejecutar la solicitud a la API
        try {
            const url = 'https://tallermecanicostock.onrender.com/api/TallerStock/Editar-repuesto';

            const response = await fetch(url, {
                method: 'POST', // o 'POST', dependiendo de la implementación de tu API
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(repuestoEditado)
            });

            // Manejo de la respuesta
            if (!response.ok) {
                // Si la API responde con un error HTTP (4xx o 5xx)
                const errorText = await response.text();
                throw new Error(`Error al editar repuesto: HTTP ${response.status}. Detalle: ${errorText}`);
            }

            showToast('Repuesto editado con éxito. Recargando datos...','success');

            closeModalEdit();
            await loadAllRepuestos(); // Recargar la tabla con los nuevos datos

        } catch (error) {
            console.error("❌ Error en la edición:", error);
            showToast('Error al confirmar edición. ' + error.message, 'error');
        }


    }

    if(btnConfirmar){
        btnConfirmar.addEventListener('click', (e) => {

            if(confirm('¿ Estas seguro que desea Guardar los Cambios ?'))
            {
                // 1. Mostrar Spinner y deshabilitar botón mientras se espera
                if (loadingSpinner) {
                    loadingSpinner.classList.remove('d-none');
                }
                btnConfirmar.disabled = true;

                // 2. Usar setTimeout para introducir la demora de
                setTimeout(() => {

                    // 3. Ejecutar la lógica de guardado después del retardo
                    guardarRepuestoEditado().finally(() => {
                        // 4. Asegurar que el botón se rehabilite y el spinner se oculte después de la operación (falle o no)
                        btnConfirmar.disabled = false;
                        if (loadingSpinner) {
                            loadingSpinner.classList.add('d-none');
                        }
                    });

                }, 1500); // 3000 milisegundos = 3 segundos
            }
        })
    }


    /* == Abrir Modal Presupuesto == */

    /**
     * Abre el modal de presupuesto y llena la tabla con los repuestos seleccionados.
     * @param {Array<Object>} repuestos Array de objetos de repuestos seleccionados.
     */
    function openPresupuestoModal(repuestos) {
        const tableBody = document.getElementById('presupuestoTableBody');
        const totalElement = document.getElementById('presupuestoTotal');

        // ⭐️ 1. DEFINIR EL FORMATO DE MONEDA (ESPAÑOL DE ARGENTINA O CHILE, etc.) ⭐️
        const currencyFormatter = new Intl.NumberFormat('es-AR', {
            style: 'currency',
            currency: 'ARS', // O 'ARS', 'CLP', etc., si quieres el símbolo de dólar $
            minimumFractionDigits: 2,
        });

        // Limpiar contenido previo
        tableBody.innerHTML = '';
        let totalSuma = 0;

        if (!Array.isArray(repuestos) || repuestos.length === 0) {
            tableBody.innerHTML = '<tr><td colspan="4" class="text-center">No has seleccionado ningún repuesto.</td></tr>';
            totalElement.textContent = `Total: $ 0,00`; // Formato manual para el caso 0
            // Abrir el modal y salir
            modalPresupuesto.style.display = 'flex';
            return;
        }

        repuestos.forEach(r => {
            // Asegurar que el precio sea un número para la suma
            const precio = parseFloat(r.precioUnitario) || 0;
            totalSuma += precio;

            // ⭐️ 2. APLICAR FORMATO AL PRECIO UNITARIO ⭐️
            const precioFormateado = currencyFormatter.format(precio).replace('USD', '$');

            const tr = document.createElement('tr');
            tr.innerHTML = `
            <td>${r.marca || 'N/A'}</td>
            <td>${r.tipo || 'N/A'}</td>
            <td>${r.nombre || 'N/A'}</td>
            <td style="text-align: right;">${precioFormateado}</td>
        `;
            tableBody.appendChild(tr);
        });

        // ⭐️ 3. APLICAR FORMATO AL TOTAL ⭐️
        const totalFormateado = currencyFormatter.format(totalSuma).replace('USD', '$');
        totalElement.textContent = `Total: ${totalFormateado}`;

        // Mostrar el modal
        modalPresupuesto.style.display = 'flex';
    }

    if (btnArmarPresupuesto) {
        btnArmarPresupuesto.addEventListener('click', () => {
            if(loadingSpinner){
                loadingSpinner.classList.remove('d-none');
            }
            try {
                openPresupuestoModal(repuestosSeleccionados);
            } catch (error) {
                showToast('Error al calcular presupuesto','error');
            } finally {
                if(loadingSpinner){
                    loadingSpinner.classList.add('d-none');
                }
            }

        });
    }
    // Función para cerrar el modal (si no la tienes):
    function closePresupuestoModal() {
        if (modalPresupuesto) {
            repuestosSeleccionados = [];
            modalPresupuesto.style.display = 'none';
            renderTable(repuestosGlobal);
        }
    }
    // Event listener para el botón de cierre (btn-close)
    const closePresupuestoModalBtn = document.getElementById('closepresupuestoModalBtn');
    if (closePresupuestoModalBtn) {
        closePresupuestoModalBtn.addEventListener('click', closePresupuestoModal);
    }


    /* == Inicializar y Cargar Datos == */

    try {
        showToast('Iniciando Sistema ...','info')
        await loadAllRepuestos();
        await cargarTipos();
        await cargarMarcas();
    } catch (error) {
        console.error("❌ Error en inicialización:", error);
    } finally {
        if (loadingSpinner) {
            loadingSpinner.classList.add('d-none');
        }
        showToast('👋 Bienvenido !','success');
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