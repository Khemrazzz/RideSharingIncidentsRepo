using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using RideSharingIncidents.Common.Model;
using Microsoft.EntityFrameworkCore;

namespace RideSharingIncidents.Database
{
    public class IncidentsDbContext : DbContext
    {
        public IncidentsDbContext() { }

        public IncidentsDbContext(DbContextOptions<IncidentsDbContext> options)
            : base(options)
        {
        }

        public DbSet<Incidents> Incidents { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Incidents>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Description).IsRequired().HasMaxLength(500);
                entity.Property(e => e.CreatedOn)
                .HasDefaultValueSql("GETDATE()");
            });
        }
    }
}
