document.addEventListener("DOMContentLoaded", function () {

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


    let repuestosSeleccionados = [];


    /* == Funciones UI == */

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
        console.log('📊 Mostrando tabla con', count, 'elementos');
        loadingElement.classList.add('d-none');
        errorElement.classList.add('d-none');
        noDataElement.classList.add('d-none');
        tableWrapper.classList.remove('d-none');
        userCount.textContent = count;
    }

    function clearTable() {
        console.log('🧹 Limpiando tabla...');
        tableBody.innerHTML = '';
        searchCodigoInput.value = '';
        showNoData();
    }


    if(loadingSpinner) {
        loadingSpinner.classList.remove('d-none');
    }


    /* == Mostrar Repuestos == */

    function createCheckboxForRepuesto(repuesto) {
        const check = document.createElement('input');
        check.type = 'checkbox';
        check.className = 'form-check-input selectRepuesto'; // ✅ Agregar clase selectEmployee
        check.title = 'Seleccionar repuesto';

        // Si el repueso está en repuestosSeleccionados, marcar el checkbox
        const repuestoExistente = repuestosSeleccionados.find(emp => emp.id === repuesto.codigo);
        if (repuestoExistente) {
            check.checked = true;
        }

        // Evento para manejar el cambio de estado del checkbox
        check.addEventListener('change', () => {
            const repuestoInfo = {
                codigo: repuesto.codigo || 'N/A',
                marca: repuesto.marca || 'Sin marca',
                tipo: repuesto.tipo || 'Sin tipo',
                nombre : repuesto.nombre || 'Sin nombre',
                medida:  repuesto.medida || 'Sin medida',
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

            console.log("Repuestos seleccionados:", repuestosSeleccionados);
        });

        return check;
    }


    function renderTable(repuestos) {
        tableBody.innerHTML = ''; // Limpiar la tabla antes de agregar filas

        if (repuestos.length === 0) {
            showNoData(); // Mostrar mensaje si no hay repuestos
            return;
        }

        repuestos.forEach(repuesto => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
            <td><span class="badge bg-secondary">${repuesto.codigo || 'N/A'}</span></td>
            <td><strong>${repuesto.tipo || 'Sin tipo'}</strong></td>
            <td><code>${repuesto.marca || 'Sin marca'}</code></td>
            <td><code>${repuesto.nombre || 'Sin motor / modelo'}</code></td>
            <td><code>${repuesto.medida || 'S/M'}</code></td>
            <td><code>${repuesto.precioUnitario || 'Sin precio'}</code></td>
            <td><code>${repuesto.stock || 'Sin stock'}</code></td>
            <td></td> <!-- Aquí se agregará el checkbox -->
        `;

            // Crear el checkbox para este usuario
            const check = createCheckboxForRepuesto(repuesto);

            // Añadir el checkbox a la última columna de la fila
            const cell = tr.querySelector('td:last-child');
            cell.appendChild(check);

            // Agregar la fila a la tabla
            tableBody.appendChild(tr);
        });

        showTable(repuestos.length); // Mostrar la tabla
    }


    let repuestosGlobal = [];

    async function loadAllRepuestos() {
        showLoading();
        try {
            const response = await fetch('https://tallermecanicostock.onrender.com/api/TallerStock/Obtener-todos-los-repuestos');
            const repuestos = await response.json();

            console.log("📦 Repuestos recibidos del API:", repuestos);

            if (!Array.isArray(repuestos)) throw new Error('Formato inválido');

            searchCodigoInput.disabled = false;

            repuestosGlobal = repuestos; // guardamos todos
            renderTable(repuestosGlobal); // mostramos todo
        } catch (error) {
            showError("Error al cargar repuestos: " + error.message);
        }
    }


    try {
        loadAllRepuestos();
    } finally {
        if(loadingSpinner){
            loadingSpinner.classList.add('d-none');
        }
    }




})