// Saem.Api/Controllers/Anexo5Controller.cs

using Microsoft.AspNetCore.Mvc;
using MiMutual.Api.Models;
using System.Text.Json;

namespace MiMutual.Api.Controllers
{
    public class Anexo5GetResponse
    {
        public Anexo5Dto Data { get; set; } = new Anexo5Dto();
        public bool IsSaved { get; set; } = false;
    }

    [ApiController]
    [Route("api/[controller]")]
    public class Anexo5Controller : ControllerBase
    {
        private const string FilePath = "Anexo5Data.json";

        [HttpGet]
        public ActionResult<Anexo5GetResponse> GetAnexo5Data()
        {
            var response = new Anexo5GetResponse();
            if (System.IO.File.Exists(FilePath))
            {
                try
                {
                    var json = System.IO.File.ReadAllText(FilePath);
                    var data = JsonSerializer.Deserialize<Anexo5Dto>(json);
                    if (data != null)
                    {
                        response.Data = data;
                        response.IsSaved = true;
                    }
                }
                catch (JsonException) { }
            }
            return Ok(response);
        }

        [HttpPost]
        public async Task<IActionResult> SaveAnexo5Data([FromBody] Anexo5Dto data)
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
                return StatusCode(500, $"Error interno al guardar: {ex.Message}");
            }
        }

        [HttpDelete]
        public IActionResult DeleteAnexo5Data()
        {
            try
            {
                if (System.IO.File.Exists(FilePath))
                {
                    System.IO.File.Delete(FilePath);
                }
                return NoContent();
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error interno al eliminar el archivo del Anexo V: {ex.Message}");
            }
        }
    }
}
