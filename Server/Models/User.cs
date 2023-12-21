using System.Text.Json.Serialization;
using System.Linq;
public class User
{
  [JsonPropertyName("Name")]
  public string Name = string.Empty;

  [JsonPropertyName("UserID")]
  public string UserID = string.Empty;

  [JsonConverter(typeof(JsonStringArrayConverter))]
  [JsonPropertyName("ReservationList")]
  public List<string> ReservationList { get; set; } = new List<string>();
  public User(string name, string userID, List<string> reservationList)
  {
    Name = name;
    UserID = userID;
    ReservationList = reservationList;
  }

  public bool addReservation(string date)
  {
    ReservationList.Add(date);
    return true;
  }

  public bool deleteReservation(string id)
  {
    // foreach (string reservation in ReservationList)
    // {
    //   if (reservation) { }
    // }
    return true;
  }

  public override string ToString()
  {
    return $"Name: {this.Name}, UserID: {this.UserID}, ReservationList: {this.ReservationList}";
  }
}