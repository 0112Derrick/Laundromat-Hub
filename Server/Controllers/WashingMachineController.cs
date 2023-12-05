using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Runtime.Serialization;

//[Route("api/[controller]")]
[ApiController]
[Route("washingmachine")]
public class WashingMachineController : ControllerBase
{
  // GET: api/Values
  [HttpGet("values")]
  public IActionResult GetValues()
  {
    return Ok(new string[] { "value1", "value2" });
  }

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
    List<WashingMachine> washingMachines = WashingMachine.pullWashingMachineData();
    for (int i = 0; i < washingMachines.Count; i++)
    {
      if (washingMachines[i].Id.Equals(id))
      {
        WashingMachineResponse washer = new WashingMachineResponse(washingMachines[i].Id, washingMachines[i].Cost, washingMachines[i].Model, washingMachines[i].LoadAmount, washingMachines[i].Year, washingMachines[i].RunTime, washingMachines[i].LastModified);
        return Ok(washer);
      }
    }
    return Ok(null);
  }

  [HttpGet("")]
  public IActionResult GetWashingMachines()
  {
    List<WashingMachine> washingMachines = WashingMachine.pullWashingMachineData();

    List<WashingMachineResponse> list = new List<WashingMachineResponse>();
    foreach (WashingMachine washer in washingMachines)
    {
      list.Add(new WashingMachineResponse(washer.Id, washer.Cost, washer.Model, washer.LoadAmount, washer.Year, washer.RunTime, washer.LastModified));
    }

    return Ok(list);
  }

  [HttpPost("create")]
  public IActionResult CreateWashingMachine(CreateWashingMachine washingMachineData)
  {
    List<string> lastModified = new List<string>();

    lastModified.Add(DateTime.Now.ToString());
    WashingMachine washingMachine = new WashingMachine(washingMachineData.id, washingMachineData.Cost, washingMachineData.Model, washingMachineData.LoadAmount, washingMachineData.Year, washingMachineData.RunTime, lastModified);

    WashingMachine.writeWashingMachineData(washingMachine);

    return Ok("Successfully created");
  }


  [HttpPost("update/{id}")]
  public IActionResult UpdateWashingMachine(string id, UpdateWashingMachine washingMachineData)
  {
    List<WashingMachine> washingMachines = WashingMachine.pullWashingMachineData();

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

    bool result = WashingMachine.deleteWashingMachineData(id);

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