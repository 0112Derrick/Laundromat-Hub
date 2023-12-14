using System.Text.Json.Serialization;

public record PaymentDetails
{
  [JsonPropertyName("cardNumber")]
  public string CardNumber { get; init; }

  [JsonPropertyName("cvc")]
  public string Cvc { get; init; }

  [JsonPropertyName("cardHolder")]
  public string CardHolder { get; init; }

  [JsonPropertyName("expirationMonth")]
  public int ExpirationMonth { get; init; }

  [JsonPropertyName("expirationYear")]
  public int ExpirationYear { get; init; }
}

public record MachineDetails
{
  [JsonPropertyName("machineType")]
  public string MachineType { get; init; }

  [JsonPropertyName("machineID")]
  public string MachineID { get; init; }

  [JsonPropertyName("temperatureSetting")]
  public string TemperatureSetting { get; init; }

  [JsonPropertyName("cycleMode")]
  public string CycleMode { get; init; }

  [JsonPropertyName("dryTime")]
  public int? DryTime { get; init; }
}

public record ReceivePayment(
    [property: JsonPropertyName("paymentDetails")]
    PaymentDetails PaymentDetails,

    [property: JsonPropertyName("machineDetails")]
    MachineDetails MachineDetails,

    [property: JsonPropertyName("estimatedCost")]
    double EstimatedCost
);