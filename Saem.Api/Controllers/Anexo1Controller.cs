using Microsoft.AspNetCore.Mvc;
using MiMutual.Api.Models;
using System.Text.Json;
using System.Reflection;

public class FieldError
{
    public string Field { get; set; } = "";
    public string Message { get; set; } = "";
}

public class Anexo1GetResponse
{
    public Anexo1Dto Data { get; set; } = new Anexo1Dto();
    public bool IsSaved { get; set; } = false;
}

namespace MiMutual.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class Anexo1Controller : ControllerBase
    {
        // Ruta por defecto; se puede cambiar dinámicamente si querés
        private string FilePath = "Anexo1Data.json";

        [HttpGet]
        public ActionResult<Anexo1GetResponse> GetAnexo1Data()
        {
            var response = new Anexo1GetResponse();

            if (System.IO.File.Exists(FilePath))
            {
                try
                {
                    var json = System.IO.File.ReadAllText(FilePath);
                    var data = JsonSerializer.Deserialize<Anexo1Dto>(json);

                    if (data != null)
                    {
                        response.Data = data;
                        response.IsSaved = true;
                    }
                }
                catch (JsonException)
                {
                    // Archivo corrupto: devolvemos datos por defecto
                }
            }

            return Ok(response);
        }

        [HttpPost]
        public async Task<IActionResult> SaveAnexo1Data([FromBody] Anexo1Dto data, [FromQuery] string? savePath)
        {
            // Permitir sobreescribir la ruta de guardado
            if (!string.IsNullOrEmpty(savePath))
            {
                FilePath = savePath;
            }

            var validationErrors = new List<FieldError>();

            // ---------------------------------------------------------
            // VALIDACIONES AUTOMÁTICAS CON REFLEXIÓN
            // ---------------------------------------------------------
            void ValidateObject(object obj, string prefix = "")
            {
                if (obj == null) return;

                var props = obj.GetType().GetProperties(BindingFlags.Public | BindingFlags.Instance);

                foreach (var prop in props)
                {
                    var value = prop.GetValue(obj);

                    // 1️⃣ Check negativo si es decimal
                    if (value is decimal decVal && decVal < 0)
                    {
                        validationErrors.Add(new FieldError
                        {
                            Field = $"{prefix}{prop.Name}",
                            Message = "No puede ser negativo"
                        });
                    }

                    // 2️⃣ Check paired values: si la propiedad tiene "Saldo" y existe un "Promedio" correspondiente
                    if (prop.Name.EndsWith("Saldo") && value is decimal saldoVal)
                    {
                        var promedioProp = obj.GetType().GetProperty(prop.Name.Replace("Saldo", "Promedio"));
                        if (promedioProp != null)
                        {
                            var promedioVal = promedioProp.GetValue(obj) as decimal? ?? 0;
                            if (saldoVal != 0 && promedioVal == 0)
                            {
                                validationErrors.Add(new FieldError
                                {
                                    Field = $"{prefix}{promedioProp.Name}",
                                    Message = $"El campo '{promedioProp.Name}' es obligatorio si '{prop.Name}' es distinto de cero"
                                });
                            }
                        }
                    }

                    // 3️⃣ Recursión para objetos anidados
                    if (value != null && !prop.PropertyType.IsPrimitive && prop.PropertyType != typeof(string) && !prop.PropertyType.IsEnum && !prop.PropertyType.IsValueType)
                    {
                        ValidateObject(value, prefix + prop.Name + ".");
                    }
                }
            }

            ValidateObject(data);

            if (validationErrors.Any())
            {
                return BadRequest(new { errors = validationErrors });
            }

            // ---------------------------------------------------------
            // GUARDAR JSON
            // ---------------------------------------------------------
            try
            {
                var options = new JsonSerializerOptions { WriteIndented = true };
                var json = JsonSerializer.Serialize(data, options);
                await System.IO.File.WriteAllTextAsync(FilePath, json);
                return NoContent();
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error interno al guardar los datos: {ex.Message}");
            }
        }

        [HttpDelete]
        public IActionResult DeleteAnexo1Data([FromQuery] string? path)
        {
            var fileToDelete = string.IsNullOrEmpty(path) ? FilePath : path;

            try
            {
                if (System.IO.File.Exists(fileToDelete))
                {
                    System.IO.File.Delete(fileToDelete);
                }

                return NoContent();
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error interno al eliminar el archivo: {ex.Message}");
            }
        }
    }
}
