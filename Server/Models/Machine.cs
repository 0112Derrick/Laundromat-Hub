using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json;
using System.Text.Json.Serialization;
public class JsonStringArrayConverter : JsonConverter<List<string>>
{
  public override List<string> Read(ref Utf8JsonReader reader, Type typeToConvert, JsonSerializerOptions options)
  {
    using (JsonDocument doc = JsonDocument.ParseValue(ref reader))
    {
      return doc.RootElement.EnumerateArray().Select(element => element.GetString()).ToList();
    }
  }

  public override void Write(Utf8JsonWriter writer, List<string> value, JsonSerializerOptions options)
  {
    JsonSerializer.Serialize(writer, value, options);
  }
}

public class UserReservation
{
  public string UserName { get; set; } = string.Empty;
  public string UserID { get; set; } = string.Empty;
  public string Date { get; set; } = string.Empty;

  public UserReservation(string userName, string userID, string date)
  {
    UserName = userName;
    UserID = userID;
    Date = date;
  }
}

public abstract class Machine
{
  [JsonPropertyName("Id")]
  public string Id { get; set; } = string.Empty;

  [JsonPropertyName("DeviceType")]
  public string DeviceType { get; set; } = string.Empty;

  [JsonPropertyName("InUse")]
  public bool InUse { get; set; } = false;
  public UserReservation ReservedByUser { get; set; } = new UserReservation("", "", "");

  [JsonConverter(typeof(JsonStringArrayConverter))]
  [JsonPropertyName("Modifications")]
  public List<string> Modifications { get; set; } = new List<string>();

  [JsonConverter(typeof(JsonStringArrayConverter))]
  [JsonPropertyName("Temperatures")]
  public List<string> Temperatures { get; set; } = new List<string>();

  [JsonConverter(typeof(JsonStringArrayConverter))]
  [JsonPropertyName("CycleModes")]
  public List<string> CycleModes { get; set; } = new List<string>();

  [JsonConverter(typeof(JsonStringArrayConverter))]
  [JsonPropertyName("LastModified")]
  public List<string> LastModified { get; set; } = new List<string>();
}