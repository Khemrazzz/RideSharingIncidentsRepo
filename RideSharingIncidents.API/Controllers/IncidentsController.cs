using RideSharingIncidents.Common.Model;
using RideSharingIncidents.Database.Repositories;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace RideSharingIncidents.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class IncidentsController : ControllerBase
    {
        private readonly IncidentsRepository _repository;

        public IncidentsController(IncidentsRepository repository)
        {
            _repository = repository;
        }

        // GET: api/Incidents
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var incidents = await _repository.GetAllAsync();
            return Ok(incidents);
        }

        // GET: api/Incidents/{id}
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var incidents = await _repository.GetByIdAsync(id);
            if (incidents == null)
            {
                return NotFound();
            }
            return Ok(incidents);
        }

        // POST: api/Incidents
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] Incidents incidents)
        {
            await _repository.AddAsync(incidents);
            return CreatedAtAction(nameof(GetById), new { id = incidents.Id }, incidents);
        }

        // PUT: api/Incidents/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] Incidents incidents)
        {
            if (id != incidents.Id)
            {
                return BadRequest();
            }
            await _repository.UpdateAsync(incidents);
            return NoContent();
        }

        // DELETE: api/Incidents/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            await _repository.DeleteAsync(id);
            return NoContent();
        }
    }
}