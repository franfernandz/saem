// MiMutual.Api/Controllers/Anexo1Controller.cs

using Microsoft.AspNetCore.Mvc;
using MiMutual.Api.Models;
using System.Text.Json;

// DTO para la respuesta del GET. Envuelve los datos y el estado de guardado.
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
        private const string FilePath = "Anexo1Data.json";

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
                        response.IsSaved = true; // Si el archivo existe y es válido, está guardado
                    }
                }
                catch (JsonException)
                {
                    // Si el archivo está corrupto, lo ignoramos y se devolverá la respuesta por defecto
                }
            }

            // Si el archivo no existe o falla la lectura, se devuelve una respuesta
            // con datos por defecto y isSaved = false.
            return Ok(response);
        }

        [HttpPost]
        public async Task<IActionResult> SaveAnexo1Data([FromBody] Anexo1Dto data)
        {
            // ===================================================================
            // AQUÍ EMPIEZA LA TRADUCCIÓN DE LA LÓGICA DE LAS MACROS
            // ===================================================================

            // 1. Validar que no haya valores negativos
            // Creamos una lista para ir guardando todos los mensajes de error que encontremos.
            var validationErrors = new List<string>();

            // Usamos una función auxiliar para no repetir código
            Action<decimal, string> checkForNegative = (value, name) =>
            {
                if (value < 0)
                {
                    validationErrors.Add($"El campo '{name}' no puede tener un valor negativo.");
                }
            };

            // Revisamos cada uno de los campos
            checkForNegative(data.Disponibilidades.EnPesos.Caja.SaldoPeriodo, "Disponibilidades en Pesos - Caja - Saldo");
            checkForNegative(data.Disponibilidades.EnPesos.Caja.PromedioPeriodo, "Disponibilidades en Pesos - Caja - Promedio");
            // ... aquí haríamos lo mismo para TODOS los demás campos ...
            // Ejemplo:
            // checkForNegative(data.Inversiones.EnPesos.PlazoFijo.SaldoPeriodo, "Inversiones en Pesos - Plazo Fijo - Saldo");


            // 2. Validar que si "Saldo" tiene valor, "Promedio" también lo tenga
            // (Esta es la traducción de la lógica de las celdas F y G)
            Action<decimal, decimal, string> checkPairedValues = (saldo, promedio, name) =>
            {
                if (saldo != 0 && promedio == 0)
                {
                    validationErrors.Add($"El campo 'Promedio' para '{name}' es obligatorio si el 'Saldo' es distinto de cero.");
                }
            };

            checkPairedValues(data.Disponibilidades.EnPesos.Caja.SaldoPeriodo, data.Disponibilidades.EnPesos.Caja.PromedioPeriodo, "Disponibilidades en Pesos - Caja");
            // ... aquí haríamos lo mismo para TODOS los demás pares de campos ...


            // 3. Comprobación final
            // Si la lista de errores tiene algún mensaje, significa que una o más validaciones fallaron.
            if (validationErrors.Any())
            {
                // Devolvemos un error 400 (Bad Request) con la lista completa de problemas.
                // El frontend podrá leer esta lista y mostrársela al usuario.
                return BadRequest(new { errors = validationErrors });
            }

            // ===================================================================
            // SI LLEGAMOS HASTA AQUÍ, SIGNIFICA QUE TODAS LAS VALIDACIONES PASARON
            // ===================================================================
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

        // ===================================================================
        // ¡NUEVO MÉTODO PARA BORRAR!
        // ===================================================================
        [HttpDelete] // Responde a peticiones DELETE a la ruta "api/anexo1"
        public IActionResult DeleteAnexo1Data()
        {
            try
            {
                if (System.IO.File.Exists(FilePath))
                {
                    System.IO.File.Delete(FilePath);
                }

                // Devuelve éxito incluso si el archivo no existía
                return NoContent(); // HTTP 204 No Content
            }
            catch (Exception ex)
            {
                // Si algo sale mal (ej: permisos de archivo), devolvemos un error.
                return StatusCode(500, $"Error interno al eliminar el archivo: {ex.Message}");
            }
        }
    }
}