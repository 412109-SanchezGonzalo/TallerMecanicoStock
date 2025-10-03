using AppTallerMecanico_BE.Data.Interfaces;
using AppTallerMecanico_BE.Models;

namespace AppTallerMecanico_BE.Services
{
    public class ServicesTaller : IServicesTaller
    {
        private readonly IMarcaRepository _marcaRepository;
        private readonly ITipoRepository _tipoRepository;
        private readonly IRepuestoRepository _repuestoRepository;

        public ServicesTaller(IMarcaRepository marcaRepository, ITipoRepository tipoRepository, IRepuestoRepository repuestoRepository)
        {
            _marcaRepository = marcaRepository;
            _tipoRepository = tipoRepository;
            _repuestoRepository = repuestoRepository;
        }
        // MARCAS
        public IEnumerable<Marcas> GetAllMarcas()
        {
            return _marcaRepository.GetAllMarcas();
        }
        // TIPOS
        public IEnumerable<Tipos> GetAllTipos()
        {
            return _tipoRepository.GetAllTipos();
        }
        // REPUESTOS
        public IEnumerable<Repuestos> GetAllRepuestos()
        {
            return _repuestoRepository.GetAllRepuestos();
        }

        public bool UpdateRepuesto(UpdateRepuesto repuesto)
        {
            if (_repuestoRepository.UpdateRepuesto(repuesto))
            {
                return true;
            }
            return false;
        }
    }
}
