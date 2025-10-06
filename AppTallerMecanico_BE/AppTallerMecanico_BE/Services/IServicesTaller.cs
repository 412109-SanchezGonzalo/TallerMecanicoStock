using AppTallerMecanico_BE.Models;

namespace AppTallerMecanico_BE.Services
{
    public interface IServicesTaller
    {
        // MARCAS
        IEnumerable<Marcas> GetAllMarcas();

        // TIPOS
        IEnumerable<Tipos> GetAllTipos();

        // REPUESTOS
        IEnumerable<Repuestos> GetAllRepuestos();
        IEnumerable<Repuestos> GetAllRepuestosByFilters(int? idTipo = null, int? idMarca = null);
        bool UpdateRepuesto(UpdateRepuesto repuesto);
    }
}
