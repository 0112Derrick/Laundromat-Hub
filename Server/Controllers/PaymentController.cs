using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Runtime.Serialization;


[ApiController]
[Route("payment")]
public class PaymentController : ControllerBase
{
  [HttpGet("values")]
  public IActionResult GetValues()
  {
    return Ok(new string[] { "value1", "value2" });
  }


  [HttpPost("")]
  public IActionResult MakePayment()
  {
    Console.WriteLine("Received data");
    return Ok("Received payment");
  }
}