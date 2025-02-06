using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RideSharingIncidents.Common.Utilities
{
    public static class ConsoleInputHelper
    {
        public static double PromptForDouble(string message)
        {
            Console.Write(message);
            double.TryParse(Console.ReadLine(), out double result);
            return result;
        }

        public static decimal PromptForDecimal(string message)
        {
            Console.Write(message);
            decimal.TryParse(Console.ReadLine(), out decimal result);
            return result;
        }

        public static string PromptForString(string message)
        {
            Console.Write(message);
            return Console.ReadLine();
        }

        public static bool PromptForBool(string message)
        {
            Console.Write(message);
            var input = Console.ReadLine()?.ToLower();
            return input == "yes";
        }

        public static DateTime PromptForDateTime(string message)
        {
            while (true)
            {
                Console.Write(message);
                if (DateTime.TryParse(Console.ReadLine(), out DateTime date))
                {
                    return date;
                }
                Console.WriteLine("Invalid date format. Please enter a valid date (YYYY-MM-DD).");
            }
        }
    }
}
