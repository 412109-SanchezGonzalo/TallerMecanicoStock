using AppTallerMecanico_BE.Models;

namespace AppTallerMecanico_BE.Data.Interfaces
{
    public interface IRepuestoRepository
    {
        IEnumerable<Repuestos> GetAllRepuestos();
        bool UpdateRepuesto(UpdateRepuesto repuesto);
    }
}
