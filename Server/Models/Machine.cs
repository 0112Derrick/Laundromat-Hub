public abstract class Machine
{
  public string Id { get; set; } = string.Empty;
  public string DeviceType { get; set; } = string.Empty;
  public List<string> Modifications { get; set; } = new List<string>();
}