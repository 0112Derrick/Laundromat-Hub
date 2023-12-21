// var builder = WebApplication.CreateBuilder(args);
// {
//     builder.Services.AddControllers();
// }


// var app = builder.Build();
// {
//     //app.UseHttpsRedirection();
//     app.MapControllers();
//     app.Run();

// }
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Hosting;


public class Program
{
    public static void Main(string[] args)
    {
        CreateHostBuilder(args).Build().Run();
        Console.WriteLine(DateTime.Now);
    }

    public static IHostBuilder CreateHostBuilder(string[] args) =>
        Host.CreateDefaultBuilder(args)
            .ConfigureWebHostDefaults(webBuilder =>
            {
                webBuilder.UseStartup<Startup>();
                webBuilder.UseUrls("http://192.168.0.229:5035");
            });
}


