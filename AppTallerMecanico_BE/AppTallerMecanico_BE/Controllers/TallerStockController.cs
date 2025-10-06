using AppTallerMecanico_BE.Models;
using AppTallerMecanico_BE.Services;
using Microsoft.AspNetCore.Mvc;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace AppTallerMecanico_BE
{
    [Route("api/[controller]")]
    [ApiController]
    public class TallerStockController : ControllerBase
    {
        private readonly IConfiguration _configuration;
        private readonly IServicesTaller _service;

        public TallerStockController(IConfiguration configuration, IServicesTaller services)
        {
            _configuration = configuration;
            _service = services;
        }
        // MARCAS
        [HttpGet("Obtener-todos-las-marcas")]
        public ActionResult<IEnumerable<string>> GetAllMarcasAutos()
        {
            try
            {
                var result = _service.GetAllMarcas();
                if (result == null)
                {
                    return NotFound();
                }
                return Ok(result);
            }
            catch (Exception ex) { return BadRequest(ex.Message); }
        }

        // TIPOS
        [HttpGet("Obtener-todos-los-tipos")]
        public ActionResult<IEnumerable<string>> GetAllTiposRepuestos()
        {
            try
            {
                var result = _service.GetAllTipos();
                if (result == null)
                {
                    return NotFound();
                }
                return Ok(result);
            }
            catch (Exception ex) { return BadRequest(ex.Message); }
        }


        // REPUESTOS

        [HttpGet("Obtener-todos-los-repuestos")]
        public ActionResult<IEnumerable<string>> GetAllRepuestosAutos()
        {
            try
            {
                var result = _service.GetAllRepuestos();
                if (result == null)
                {
                    return NotFound();
                }
                return Ok(result);
            }
            catch (Exception ex) { return BadRequest(ex.Message); }
        }

        [HttpGet("Obtener-todos-los-repuestos-por-filtros")]
        public ActionResult<IEnumerable<string>> GetAllRepuestosAutosByFilters([FromQuery] int? idTipo=null, [FromQuery] int? idMarca =null)
        {
            try
            {
                var result = _service.GetAllRepuestosByFilters(idTipo,idMarca);
                if (result == null)
                {
                    return NotFound();
                }
                return Ok(result);
            }
            catch (Exception ex) { return BadRequest(ex.Message); }
        }

        [HttpPost("Editar-repuesto")]
        public ActionResult<bool> UpdateRepuestoAuto([FromBody] UpdateRepuesto repuesto)
        {
            try
            {
                var result = _service.UpdateRepuesto(repuesto);
                if (result)
                {
                    return Ok("Resultado: "+result);
                }
                return BadRequest(result);

            }
            catch (Exception ex) { return BadRequest(ex.Message); }
        }

    }
}
