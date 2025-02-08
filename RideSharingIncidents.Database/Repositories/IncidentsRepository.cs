using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using RideSharingIncidents.Common.Model;

namespace RideSharingIncidents.Database.Repositories
{
    public class IncidentsRepository
    {
        private readonly IncidentsDbContext _context;

        public IncidentsRepository(IncidentsDbContext context)
        {
            _context = context;
        }

        // Get all Incident
        public async Task<List<Incidents>> GetAllAsync()
        {
            return await _context.Incidents.ToListAsync();
        }

        // Get a single Incident by ID
        public async Task<Incidents> GetByIdAsync(int id)
        {
            return await _context.Incidents.FindAsync(id);
        }

        // Add a new Incident
        public async Task AddAsync(Incidents Incidents)
        {
            await _context.Incidents.AddAsync(Incidents);
            await _context.SaveChangesAsync();
        }

        // Update an existing Incident
        public async Task UpdateAsync(Incidents Incidents)
        {
            _context.Entry(Incidents).State = EntityState.Modified;
            _context.Entry(Incidents).Property(x => x.CreatedOn).IsModified = false;
            await _context.SaveChangesAsync();
        }

        // Delete an Incident by ID
        public async Task DeleteAsync(int id)
        {
            var Incidents = await GetByIdAsync(id);
            if (Incidents != null)
            {
                _context.Incidents.Remove(Incidents);
                await _context.SaveChangesAsync();
            }
        }
    }
}
