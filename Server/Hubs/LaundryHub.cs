using Microsoft.AspNetCore.SignalR;
public class LaundryHub : Hub
{
  public async Task SendMachineInfo(object machineInfo)
  {
    // Process the machineInfo received from the client
    Console.WriteLine(machineInfo);
    // You can broadcast this information to other clients or perform other actions
    await Clients.All.SendAsync("MachineStatusUpdate", machineInfo);
  }

}