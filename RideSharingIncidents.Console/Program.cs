using System;
using System.Net.Http;
using System.Threading.Tasks;
using RideSharingIncidents.Common.Model;
using RideSharingIncidents.Console;
using RideSharingIncidents.Common.Utilities;

class Program
{
    static async Task Main(string[] args)
    {
        var httpClient = new HttpClient { BaseAddress = new Uri("https://localhost:44375/api/") }; // Replace with your API URL
        var service = new IncidentsService(httpClient);

        while (true)
        {
            Console.WriteLine("\n--- RideSharing Incidents Management ---");
            Console.WriteLine("1. View All Incidents");
            Console.WriteLine("2. View Incident by ID");
            Console.WriteLine("3. Report New Incident");
            Console.WriteLine("4. Update Incident");
            Console.WriteLine("5. Delete Incident");
            Console.WriteLine("6. Exit");
            Console.Write("Choose an option: ");

            var choice = Console.ReadLine();
            switch (choice)
            {
                case "1":
                    Console.WriteLine(await service.GetAllIncidentsAsync());
                    break;

                case "2":
                    Console.Write("Enter Incident ID: ");
                    if (int.TryParse(Console.ReadLine(), out int id))
                    {
                        Console.WriteLine(await service.GetIncidentByIdAsync(id));
                    }
                    else
                    {
                        Console.WriteLine("Invalid ID.");
                    }
                    break;

                case "3":
                    var newIncident = new Incidents
                    {
                        CreatedOn = DateTime.Now,
                        RideService = ConsoleInputHelper.PromptForString("Enter Ride Service (e.g., Uber, DodoGo): "),
                        DriverName = ConsoleInputHelper.PromptForString("Enter Driver Name: "),
                        PassengerName = ConsoleInputHelper.PromptForString("Enter Passenger Name: "),
                        IncidentType = ConsoleInputHelper.PromptForString("Enter Incident Type (e.g., Accident, Theft): "),
                        IncidentDate = ConsoleInputHelper.PromptForDateTime("Enter Incident Date (YYYY-MM-DD): "),
                        Location = ConsoleInputHelper.PromptForString("Enter Location: "),
                        Description = ConsoleInputHelper.PromptForString("Enter Description: ")
                    };

                    Console.WriteLine(await service.CreateIncidentAsync(newIncident));
                    break;

                case "4":
                    Console.Write("Enter Incident ID to update: ");
                    if (int.TryParse(Console.ReadLine(), out int updateId))
                    {
                        var updatedIncident = new Incidents
                        {
                            Id = updateId,
                            CreatedOn = DateTime.Now,
                            RideService = ConsoleInputHelper.PromptForString("Enter Ride Service (e.g., Uber, DodoGo): "),
                            DriverName = ConsoleInputHelper.PromptForString("Enter Driver Name: "),
                            PassengerName = ConsoleInputHelper.PromptForString("Enter Passenger Name: "),
                            IncidentType = ConsoleInputHelper.PromptForString("Enter Incident Type (e.g., Accident, Theft): "),
                            IncidentDate = ConsoleInputHelper.PromptForDateTime("Enter Incident Date (YYYY-MM-DD): "),
                            Location = ConsoleInputHelper.PromptForString("Enter Location: "),
                            Description = ConsoleInputHelper.PromptForString("Enter Description: ")
                        };

                        Console.WriteLine(await service.UpdateIncidentAsync(updatedIncident));
                    }
                    else
                    {
                        Console.WriteLine("Invalid ID.");
                    }
                    break;

                case "5":
                    Console.Write("Enter Incident ID to delete: ");
                    if (int.TryParse(Console.ReadLine(), out int deleteId))
                    {
                        Console.WriteLine(await service.DeleteIncidentAsync(deleteId));
                    }
                    else
                    {
                        Console.WriteLine("Invalid ID.");
                    }
                    break;

                case "6":
                    return;

                default:
                    Console.WriteLine("Invalid choice. Please try again.");
                    break;
            }
        }
    }
}
