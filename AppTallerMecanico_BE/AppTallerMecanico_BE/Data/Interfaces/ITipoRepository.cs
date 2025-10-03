using AppTallerMecanico_BE.Models;

namespace AppTallerMecanico_BE.Data.Interfaces
{
    public interface ITipoRepository
    {
        IEnumerable<Tipos> GetAllTipos();
    }
}
