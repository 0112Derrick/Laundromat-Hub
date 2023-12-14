public record CreateWashingMachine(
string Id,
double Cost,
string Model,
double LoadAmount,
int Year,
int RunTime,
string DeviceType,
List<string> Temperatures,
List<string> CycleModes
);