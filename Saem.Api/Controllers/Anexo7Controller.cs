// Saem.Api/Controllers/Anexo7Controller.cs

using Microsoft.AspNetCore.Mvc;
using MiMutual.Api.Models;
using System.Text.Json;

namespace MiMutual.Api.Controllers
{
    public class Anexo7GetResponse
    {
        public Anexo7Dto Data { get; set; } = new Anexo7Dto();
        public bool IsSaved { get; set; } = false;
    }

    [ApiController]
    [Route("api/[controller]")]
    public class Anexo7Controller : ControllerBase
    {
        private const string FilePath = "Anexo7Data.json";

        [HttpGet]
        public ActionResult<Anexo7GetResponse> GetAnexo7Data()
        {
            var response = new Anexo7GetResponse();
            if (System.IO.File.Exists(FilePath))
            {
                try
                {
                    var json = System.IO.File.ReadAllText(FilePath);
                    var data = JsonSerializer.Deserialize<Anexo7Dto>(json);
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
        public async Task<IActionResult> SaveAnexo7Data([FromBody] Anexo7Dto data)
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
        public IActionResult DeleteAnexo7Data()
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
                return StatusCode(500, $"Error interno al eliminar el archivo del Anexo VII: {ex.Message}");
            }
        }
    }
}
