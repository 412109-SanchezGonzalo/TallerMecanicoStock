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
        bool UpdateRepuesto(UpdateRepuesto repuesto);
    }
}
