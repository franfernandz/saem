// MiMutual.Api/Controllers/Anexo2Controller.cs

using Microsoft.AspNetCore.Mvc;
using MiMutual.Api.Models; // <-- 1. ¡LA DIRECTIVA 'USING' QUE FALTABA!
using System.Text.Json;
using System.Collections.Generic;
using System.Linq;

// 2. Definimos el DTO de respuesta aquí también
public class Anexo2GetResponse
{
    public Anexo2Dto Data { get; set; } = new Anexo2Dto(); // Usamos el nombre corregido
    public bool IsSaved { get; set; } = false;
}

namespace MiMutual.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class Anexo2Controller : ControllerBase
    {
        private const string FilePath = "Anexo2Data.json";

        [HttpGet]
        public ActionResult<Anexo2GetResponse> GetAnexo2Data()
        {
            var response = new Anexo2GetResponse();
            if (System.IO.File.Exists(FilePath))
            {
                try
                {
                    var json = System.IO.File.ReadAllText(FilePath);
                    // 3. Usamos el nombre corregido
                    var data = JsonSerializer.Deserialize<Anexo2Dto>(json);
                    if (data != null)
                    {
                        response.Data = data;
                        response.IsSaved = true;
                    }
                }
                catch (JsonException) { /* Ignorar archivo corrupto */ }
            }
            return Ok(response);
        }

        [HttpPost]
        public async Task<IActionResult> SaveAnexo2Data([FromBody] Anexo2Dto data) // 4. Usamos el nombre corregido
        {
            var validationErrors = new List<string>();

            // Función auxiliar para validar
            Action<FilaAnexo2Dto, string> validateRow = (row, name) =>
            {
                // Se permiten valores negativos para Debe, Haber, FinPeriodo y PromedioPeriodo
                // Mantenemos restricción no-negativa solo para 'CuentasAsociadosVigentes'
                if (row.CuentasAsociadosVigentes < 0)
                {
                    validationErrors.Add($"El campo 'Cuentas Asociados Vigentes' para '{name}' no puede ser negativo.");
                }

                if (row.CuentasAsociadosVigentes % 1 != 0)
                {
                    validationErrors.Add($"El campo 'Cuentas Asociados Vigentes' para '{name}' no puede tener decimales.");
                }

                if (row.TasaEstimuloEfectivaMensual >= 1)
                {
                    validationErrors.Add($"La tasa para '{name}' no puede ser igual o mayor a 100%.");
                }
            };

            // Aplicamos validaciones (usando la nueva estructura)
            validateRow(data.ApartadoA.RecursosEnPesos.AhorroATermino, "A - Recursos Pesos - Ahorro a Término");
            // ... etc. ...

            if (validationErrors.Any())
            {
                return BadRequest(new { errors = validationErrors });
            }

            // Guardado
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
        
        [HttpDelete] // Responde a peticiones DELETE a la ruta "api/anexo2"
        public IActionResult DeleteAnexo2Data()
        {
            try
            {
                if (System.IO.File.Exists(FilePath))
                {
                    System.IO.File.Delete(FilePath);
                }
                
                return NoContent(); // HTTP 204 No Content
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error interno al eliminar el archivo del Anexo II: {ex.Message}");
            }
        }
    }
}