using Microsoft.AspNetCore.Mvc;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace AppTallerMecanico_BE
{
    [Route("api/[controller]")]
    [ApiController]
    public class TallerStockController : ControllerBase
    {
        // GET: api/<TallerStockController>
        [HttpGet]
        public IEnumerable<string> Get()
        {
            return new string[] { "value1", "value2" };
        }

        // GET api/<TallerStockController>/5
        [HttpGet("{id}")]
        public string Get(int id)
        {
            return "value";
        }

        // POST api/<TallerStockController>
        [HttpPost]
        public void Post([FromBody] string value)
        {
        }

        // PUT api/<TallerStockController>/5
        [HttpPut("{id}")]
        public void Put(int id, [FromBody] string value)
        {
        }

        // DELETE api/<TallerStockController>/5
        [HttpDelete("{id}")]
        public void Delete(int id)
        {
        }
    }
}
