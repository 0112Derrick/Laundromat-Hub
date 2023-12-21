using System.Text.Json.Serialization;

public record WashingMachineResponse(
string id,
double cost,
string model,
double loadAmount,
int year,
int runTime,
string deviceType,
bool inUse,
UserReservation userReservation,
List<string> temperatures,
List<string> cycleModes,
List<string> lastModified
);

