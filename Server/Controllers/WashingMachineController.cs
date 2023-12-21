using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Runtime.Serialization;

//[Route("api/[controller]")]
[ApiController]
[Route("washingMachine")]
public class WashingMachineController : ControllerBase
{
  // GET: api/Values


  [HttpPost("add")]
  public IActionResult AddValues(CreateValues request)
  {
    int response = request.numb1 + request.numb2;
    ValuesResponse answer = new ValuesResponse(response);
    return Ok(answer);
  }

  [HttpPost("multiply")]
  public IActionResult MultiplyValues(CreateValues request)
  {
    int response = request.numb1 * request.numb2;
    ValuesResponse answer = new ValuesResponse(response);
    return Ok(answer);
  }

  [HttpGet("{id}")]
  public IActionResult GetWashingMachine(string id)
  {
    List<WashingMachine> washingMachines = WashingMachine.getWashingMachines().Result;
    for (int i = 0; i < washingMachines.Count; i++)
    {
      if (washingMachines[i].Id.Equals(id))
      {
        WashingMachineResponse washer = new WashingMachineResponse(washingMachines[i].Id, washingMachines[i].Cost, washingMachines[i].Model, washingMachines[i].LoadAmount, washingMachines[i].Year, washingMachines[i].RunTime, washingMachines[i].DeviceType, washingMachines[i].InUse, washingMachines[i].ReservedByUser, washingMachines[i].Temperatures, washingMachines[i].CycleModes, washingMachines[i].LastModified);
        return Ok(washer);
      }
    }
    Console.WriteLine("Listed washer " + id);
    return Ok(null);
  }

  [HttpGet("")]
  public IActionResult GetWashingMachines()
  {
    List<WashingMachine> washingMachines = WashingMachine.getWashingMachines().Result;

    List<WashingMachineResponse> list = new List<WashingMachineResponse>();
    foreach (WashingMachine washer in washingMachines)
    {
      list.Add(new WashingMachineResponse(washer.Id, washer.Cost, washer.Model, washer.LoadAmount, washer.Year, washer.RunTime, washer.DeviceType, washer.InUse, washer.ReservedByUser, washer.Temperatures, washer.CycleModes, washer.LastModified));
    }
    Console.WriteLine("Listed all washers");
    return Ok(list);
  }

  [HttpPost("create")]
  public IActionResult CreateWashingMachine(CreateWashingMachine washingMachineData)
  {
    List<string> lastModified = new List<string>();

    lastModified.Add(DateTime.Now.ToString());

    UserReservation userReservation = new UserReservation("", "", "");

    WashingMachine washingMachine = new WashingMachine(washingMachineData.Id, washingMachineData.Cost, washingMachineData.Model, washingMachineData.LoadAmount, washingMachineData.Year, washingMachineData.RunTime, washingMachineData.DeviceType, false, userReservation, washingMachineData.Temperatures, washingMachineData.CycleModes, lastModified, new List<string>());

    WashingMachine.storeWashingMachineData(washingMachine);

    return Ok("Successfully created");
  }

  [HttpPost("update/{id}")]
  public IActionResult UpdateWashingMachine(string id, UpdateWashingMachine washingMachineData)
  {

    List<WashingMachine> washingMachines = WashingMachine.getWashingMachines().Result;

    if (washingMachines == null || washingMachines.Count == 0)
    {
      return BadRequest("No washing machines found");
    }

    WashingMachine? washer = washingMachines.Find(washer => washer.Id == id);

    if (washer == null || washer.Id == null)
    {

      Console.WriteLine("Washer not found");

      return BadRequest("No washer found with that id.");

    }

    washer.updateValues(washingMachineData.Cost, washingMachineData.LoadAmount, washingMachineData.RunTime, DateTime.Now.ToString());
    WashingMachine.updateWashingMachineData(washer);
    WashingMachineUpdateResponse response = new WashingMachineUpdateResponse("Updated successfully", washer);
    return Ok(response);
  }

  [HttpPost("delete/{id}")]
  public IActionResult DeleteWashingMachine(string id)
  {

    bool result = WashingMachine.deleteWashingMachineData(id).Result;

    if (result)
    {
      return Ok("Washer deleted successfully.");
    }
    else
    {
      return BadRequest("Unable to delete the requested washer because no match was found to the given id. Check the id and try again.");
    }
  }

}