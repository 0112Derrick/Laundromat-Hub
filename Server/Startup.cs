using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.AspNetCore.Http;



public class Startup
{
  public Startup(IConfiguration configuration)
  {
    Configuration = configuration;
  }

  public IConfiguration Configuration { get; }

  // This method gets called by the runtime. Use this method to add services to the container.
  public void ConfigureServices(IServiceCollection services)
  {
    // Add CORS
    services.AddCors(options =>
    {
      options.AddPolicy("AllowReactApp",
            builder =>
            {
              builder.WithOrigins("http://localhost:3000")
                       .AllowAnyMethod()
                       .AllowAnyHeader();
            });
    });
    services.AddControllers();
    services.AddSignalR();
  }

  // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
  public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
  {
    // Configure middleware here

    if (env.IsDevelopment())
    {
      app.UseDeveloperExceptionPage();
    }

    // Use CORS
    //app.UseCors("AllowAll");
    app.UseCors("AllowReactApp");
    // app.UseMvc();
    // Other middleware configurations...

    app.UseRouting();

    app.UseEndpoints(endpoints =>
    {
      endpoints.MapHub<LaundryHub>("/laundryHub");
      endpoints.MapControllers();
    });
  }
}
