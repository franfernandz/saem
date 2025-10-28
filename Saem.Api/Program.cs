// Program.cs
using Microsoft.AspNetCore.HttpOverrides;

var builder = WebApplication.CreateBuilder(args);
builder.Services.AddSingleton<IHttpContextAccessor, HttpContextAccessor>();

// ===================================================================
// 1. REGISTRO DE SERVICIOS
// ===================================================================

// Registra una única política de CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp", policy =>
    {
        policy.WithOrigins("http://localhost:5173", "https://saem-webapp.onrender.com")
              .AllowAnyHeader()
              .WithMethods("POST", "OPTIONS"); // Asegúrate de incluir OPTIONS
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

// =S=================================================================
// 3. CONFIGURACIÓN DEL PIPELINE DE PETICIONES
// ===================================================================

// Asegúrate de que UseCors esté lo más arriba posible,
// antes de UseAuthorization y MapControllers
app.UseCors("AllowReactApp");

// Activa la autorización
//app.UseAuthorization();

// Mapea las URLs a las clases de Controlador
app.MapControllers();

app.Run();