public record WashingMachineResponse(
string Id,
double Cost,
string Model,
double LoadAmount,
int Year,
int RunTime,
List<string> LastModified
);