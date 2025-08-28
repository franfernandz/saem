using Microsoft.AspNetCore.HttpOverrides;

var builder = WebApplication.CreateBuilder(args);

// ===================================================================
// 1. REGISTRO DE SERVICIOS
// ===================================================================

// Registra la política de CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp", policy =>
    {
        policy.WithOrigins("http://localhost:5173", "https://saem-webapp.onrender.com")
      .AllowAnyHeader()
      .AllowAnyMethod();
    });
});

// Registra los servicios para los Controladores
builder.Services.AddControllers();

// ===================================================================
// 2. CONSTRUCCIÓN DE LA APP
// ===================================================================
var app = builder.Build();
app.UseForwardedHeaders(new ForwardedHeadersOptions
{
    ForwardedHeaders = ForwardedHeaders.XForwardedProto
});

// ===================================================================
// 3. CONFIGURACIÓN DEL PIPELINE DE PETICIONES
// ===================================================================

// ¡OJO! He comentado esta línea. La redirección a HTTPS
// puede causar problemas de CORS si el frontend sigue llamando a HTTP.
// Por ahora, la desactivamos para simplificar.
// app.UseHttpsRedirection();

// Activa la política de CORS que definimos arriba. ¡Paso fundamental!
app.UseCors("AllowReactApp");

// Activa la autorización
app.UseAuthorization();

// Mapea las URLs a las clases de Controlador
app.MapControllers();

app.Run();

record WeatherForecast(DateOnly Date, int TemperatureC, string? Summary)
{
    public int TemperatureF => 32 + (int)(TemperatureC / 0.5556);
}
