using Microsoft.EntityFrameworkCore.Design;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RideSharingIncidents.Database
{
    public class IncidentsDbContextFactory : IDesignTimeDbContextFactory<IncidentsDbContext>
    {
        public IncidentsDbContext CreateDbContext(string[] args)
        {
            // Load configuration from appsettings.json
            var configuration = new ConfigurationBuilder()
                .SetBasePath(Directory.GetCurrentDirectory())
                .AddJsonFile("appsettings.json") // IConfigurationBuilder
                .Build();

            var optionsBuilder = new DbContextOptionsBuilder<IncidentsDbContext>();
            var connectionString = configuration.GetConnectionString("DefaultConnection");

            optionsBuilder.UseSqlServer(connectionString);

            return new IncidentsDbContext(optionsBuilder.Options);
        }
    }
}
