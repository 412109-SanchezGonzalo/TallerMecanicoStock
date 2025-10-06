using AppTallerMecanico_BE.Models;

namespace AppTallerMecanico_BE.Data.Interfaces
{
    public interface IRepuestoRepository
    {
        IEnumerable<Repuestos> GetAllRepuestos();
        IEnumerable<Repuestos> GetAllRepuestosByFilters(int? idTipo = null,int? idMarca = null);
        bool UpdateRepuesto(UpdateRepuesto repuesto);
    }
}
