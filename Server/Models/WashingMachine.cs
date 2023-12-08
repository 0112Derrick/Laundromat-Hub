using System;
using System.Collections.Generic;
using System.Globalization;
using System.IO;
using System.Text.Json;
using System.Text.Json.Serialization;

public class WashingMachine : Machine
{
  public double Cost { get; set; }
  public string Model { get; }
  public double LoadAmount { get; set; }
  public int Year { get; }
  public int RunTime { get; set; }
  public List<string> LastModified { get; set; }


  public WashingMachine(string id, double cost, string model, double loadAmount, int year, int runTime, string deviceType, List<string> lastModified, List<string> modifications)
  {
    Id = id;
    Cost = cost;
    Model = model ?? string.Empty;
    LoadAmount = loadAmount;
    Year = year;
    RunTime = runTime;
    LastModified = lastModified;
    DeviceType = deviceType;
    Modifications = modifications;
  }


  public static List<WashingMachine> getWashingMachines(Boolean printMachines = false)
  {
    string filePath = "./washingMachines.json";

    // Check if the file exists
    if (File.Exists(filePath))
    {
      // Read the entire file content as a string
      string jsonContent = File.ReadAllText(filePath);

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

  public static void storeWashingMachineData(WashingMachine data)
  {

    string filePath = "./washingMachines.json";

    List<WashingMachine> existingData = WashingMachine.getWashingMachines();

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

  public static void updateWashingMachineData(WashingMachine data)
  {

    string filePath = "./washingMachines.json";

    List<WashingMachine> existingData = WashingMachine.getWashingMachines();

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

  public static bool deleteWashingMachineData(string id)
  {

    string filePath = "./washingMachines.json";

    List<WashingMachine> existingData = WashingMachine.getWashingMachines();

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
    return $"ID: {this.Id}, Model: {this.Model}, Cost: {this.Cost}, Load amount: {this.LoadAmount}, Year: {this.Year}, Last Modified: {lastModified}";
  }
}


