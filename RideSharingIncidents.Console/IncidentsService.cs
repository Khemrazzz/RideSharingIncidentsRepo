using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using RideSharingIncidents.Common.Model;
using System.Net.Http.Json;

namespace RideSharingIncidents.Console
{
    public class IncidentsService
    {
        private readonly HttpClient _httpClient;

        public IncidentsService(HttpClient httpClient)
        {
            _httpClient = httpClient;
        }

        // Returns all infringements as a string for display
        public async Task<string> GetAllIncidentsAsync()
        {
            try
            {
                var incidents = await _httpClient.GetFromJsonAsync<Incidents[]>("incidents");

                if (incidents == null || incidents.Length == 0)
                {
                    return "No incidents found.";
                }

                var result = "\n--- All Incidents ---\n";
                foreach (var incident in incidents)
                {
                    result += $"Incident NO: {incident.Id}, Created on: {incident.CreatedOn} that {incident.Description} occurred at {incident.Location}.\n" +
                    $"Driver Name: {incident.DriverName} from {incident.RideService} was reported on {incident.IncidentDate} by Passenger: {incident.PassengerName}\n";
                }

                return result;
            }
            catch (Exception ex)
            {
                return $"Error fetching incidents: {ex.Message}";
            }
        }

        // Fetches a single infringement by ID
        public async Task<string> GetIncidentByIdAsync(int id)
        {
            try
            {
                var incident = await _httpClient.GetFromJsonAsync<Incidents>($"incidents/{id}");

                if (incident == null)
                {
                    return $"Incident with ID {id} not found.";
                }

                return $"ID: {incident.Id}\n" +
                       $"Created on: {incident.CreatedOn}\n" +
                       $"Ride Service: {incident.RideService}\n" +
                       $"Driver: {incident.DriverName} | Passenger: {incident.PassengerName}\n" +
                       $"Type: {incident.IncidentType}\n" +
                       $"Date: {incident.IncidentDate}\n" +
                       $"Location: {incident.Location}\n" +
                       $"Description: {incident.Description}\n";
            }
            catch (Exception ex)
            {
                return $"Error fetching incident: {ex.Message}";
            }
        }

        // Create a new incident
        public async Task<string> CreateIncidentAsync(Incidents incident)
        {
            try
            {
                var response = await _httpClient.PostAsJsonAsync("incidents", incident);
                return response.IsSuccessStatusCode
                    ? "Incident reported successfully."
                    : "Failed to report incident.";
            }
            catch (Exception ex)
            {
                return $"Error reporting incident: {ex.Message}";
            }
        }

        // Update an incident
        public async Task<string> UpdateIncidentAsync(Incidents incident)
        {
            try
            {
                var response = await _httpClient.PutAsJsonAsync($"incidents/{incident.Id}", incident);
                return response.IsSuccessStatusCode
                    ? "Incident updated successfully."
                    : "Failed to update incident.";
            }
            catch (Exception ex)
            {
                return $"Error updating incident: {ex.Message}";
            }
        }

        // Delete an incident
        public async Task<string> DeleteIncidentAsync(int id)
        {
            try
            {
                var response = await _httpClient.DeleteAsync($"incidents/{id}");
                return response.IsSuccessStatusCode
                    ? "Incident deleted successfully."
                    : "Failed to delete incident.";
            }
            catch (Exception ex)
            {
                return $"Error deleting incident: {ex.Message}";
            }
        }
    }
}
