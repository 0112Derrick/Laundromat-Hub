using System;
using System.Collections.Generic;
using System.Globalization;
using System.IO;
using System.Text.Json;
using System.Text.Json.Serialization;
using System.Linq;


public class WashingMachine : Machine
{
  [JsonPropertyName("Cost")]
  public double Cost { get; set; }

  [JsonPropertyName("Model")]
  public string Model { get; set; }

  [JsonPropertyName("LoadAmount")]
  public double LoadAmount { get; set; }

  [JsonPropertyName("Year")]
  public int Year { get; set; }

  [JsonPropertyName("RunTime")]
  public int RunTime { get; set; }


  public WashingMachine(string id, double cost, string model, double loadAmount, int year, int runTime, string deviceType, bool inUse, UserReservation reservedByUser, List<string> temperatures, List<string> cycleModes, List<string> lastModified, List<string> modifications)
  {
    Id = id;
    Cost = cost;
    Model = model ?? string.Empty;
    LoadAmount = loadAmount;
    Year = year;
    RunTime = runTime;
    LastModified = lastModified;
    DeviceType = deviceType;
    CycleModes = cycleModes;
    Temperatures = temperatures;
    Modifications = modifications;
    InUse = inUse;
    ReservedByUser = reservedByUser;
  }


  public static async Task<List<WashingMachine>> getWashingMachines(Boolean printMachines = false)
  {
    try
    {
      string filePath = "./washingMachines.json";

      // Check if the file exists
      if (File.Exists(filePath))
      {
        // Read the entire file content as a string
        string jsonContent = await File.ReadAllTextAsync(filePath);

        if (jsonContent == null)
        {
          Console.WriteLine("Error reading file content. The content is null.");
          return new List<WashingMachine>();
        }
        // Deserialize the JSON string to a C# object
        // You need to define a corresponding class structure for your JSON data
        List<WashingMachine>? jsonData = JsonSerializer.Deserialize<List<WashingMachine>>(jsonContent);

        if (jsonData == null)
        {
          Console.WriteLine("Error deserializing JSON content. The deserialized data is null.");
          return new List<WashingMachine>();  // Return an empty list instead of null
        }

        // Now you can access properties of your object
        if (printMachines)
        {
          foreach (WashingMachine machine in jsonData)
          {
            Console.WriteLine(machine.ToString());
          }
        }

        Console.WriteLine("Data retrieved successfully.");
        return jsonData;
      }
      else
      {
        Console.WriteLine("File not found.");
        return new List<WashingMachine>();
      }

    }
    catch (Exception ex)
    {
      Console.WriteLine($"An error occurred: {ex.Message}");
      return new List<WashingMachine>();
    }

  }

  public static async Task storeWashingMachineData(WashingMachine data)
  {

    string filePath = "./washingMachines.json";

    List<WashingMachine> existingData = await WashingMachine.getWashingMachines();

    if (existingData == null)
    {
      existingData = new List<WashingMachine>();
    }

    existingData.Add(data);

    // Convert the object to a JSON string
    string jsonString = JsonSerializer.Serialize(existingData);

    if (jsonString == null)
    {
      Console.WriteLine("Error writing to file.");
      return;
    }

    // Write the JSON string to the file
    File.WriteAllText(filePath, jsonString);

    Console.WriteLine("Data written to file successfully.");
  }

  public static async Task updateWashingMachineData(WashingMachine data)
  {

    string filePath = "./washingMachines.json";

    List<WashingMachine> existingData = await WashingMachine.getWashingMachines();

    WashingMachine? washer = existingData.Find(washer => washer.Id == data.Id);

    if (washer == null || washer.Id == null)
    {
      Console.WriteLine("Washer not found");
      return;
    }

    washer.updateValues(data.Cost, data.LoadAmount, data.RunTime, data.LastModified[data.LastModified.Count - 1]);

    // Convert the object to a JSON string
    string jsonString = JsonSerializer.Serialize(existingData);

    // Write the JSON string to the file
    File.WriteAllText(filePath, jsonString);

    Console.WriteLine("Data written to file successfully.");
  }

  public static async Task<bool> deleteWashingMachineData(string id)
  {

    string filePath = "./washingMachines.json";

    List<WashingMachine> existingData = await WashingMachine.getWashingMachines();

    WashingMachine? washerToBeRemoved = existingData.Find(washer => washer.Id == id);

    if (washerToBeRemoved == null)
    {
      Console.WriteLine("Washer not found");
      return false;
    }

    existingData.Remove(washerToBeRemoved);

    // Convert the object to a JSON string
    string jsonString = JsonSerializer.Serialize(existingData);

    // Write the JSON string to the file
    File.WriteAllText(filePath, jsonString);

    Console.WriteLine("Data removed from the file successfully.");

    return true;
  }

  public void updateValues(double cost, double loadAmount, int runTime, string date)
  {
    string mod = $"Cost change: {this.Cost} to {cost}; LoadAmount change: {this.LoadAmount} to {loadAmount}; Runtime change: {this.RunTime} to {runTime}";
    Modifications.Add(mod);
    Cost = cost;
    LoadAmount = loadAmount;
    RunTime = runTime;
    LastModified.Add(date);
  }

  public override string ToString()
  {
    string lastModified = this.LastModified[LastModified.Count - 1];
    return $"ID: {this.Id}, Model: {this.Model}, Cost: {this.Cost}, Load amount: {this.LoadAmount}, Year: {this.Year}, Modes: {this.CycleModes}, Temperatures: {this.Temperatures} \n Last Modified: {lastModified}";
  }
}


