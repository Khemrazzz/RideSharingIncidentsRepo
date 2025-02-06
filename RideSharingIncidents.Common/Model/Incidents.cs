using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RideSharingIncidents.Common.Model
{
    public class Incidents
    {
        public int Id { get; set; }  // Primary key
        public DateTime CreatedOn { get; set; } //Date created after incidents occured
        public string RideService { get; set; } // Uber, DodoGo, etc.
        public string DriverName { get; set; }
        public string PassengerName { get; set; }
        public string IncidentType { get; set; } // Accident, Theft, etc.
        public DateTime IncidentDate { get; set; }
        public string Location { get; set; }
        public string Description { get; set; }
    }
}
