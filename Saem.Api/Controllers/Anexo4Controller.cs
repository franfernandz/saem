// Saem.Api/Controllers/Anexo4Controller.cs

using Microsoft.AspNetCore.Mvc;
using MiMutual.Api.Models;
using System.Text.Json;

namespace MiMutual.Api.Controllers
{
    public class Anexo4GetResponse
    {
        public Anexo4Dto Data { get; set; } = new Anexo4Dto();
        public bool IsSaved { get; set; } = false;
    }

    [ApiController]
    [Route("api/[controller]")]
    public class Anexo4Controller : ControllerBase
    {
        private const string FilePath = "Anexo4Data.json";

        [HttpGet]
        public ActionResult<Anexo4GetResponse> GetAnexo4Data()
        {
            var response = new Anexo4GetResponse();
            if (System.IO.File.Exists(FilePath))
            {
                try
                {
                    var json = System.IO.File.ReadAllText(FilePath);
                    var data = JsonSerializer.Deserialize<Anexo4Dto>(json);
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
        public async Task<IActionResult> SaveAnexo4Data([FromBody] Anexo4Dto data)
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
        public IActionResult DeleteAnexo4Data()
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
                return StatusCode(500, $"Error interno al eliminar el archivo del Anexo IV: {ex.Message}");
            }
        }
    }
}
