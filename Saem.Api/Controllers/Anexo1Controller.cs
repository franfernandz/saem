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
    }
}