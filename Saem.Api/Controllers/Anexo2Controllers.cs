// MiMutual.Api/Controllers/Anexo2Controller.cs

using Microsoft.AspNetCore.Mvc;
using MiMutual.Api.Models; // Asegúrate de que este 'using' es correcto
using System.Text.Json;
using System.Collections.Generic;
using System.Linq;

// DTO para la respuesta del GET (similar al del Anexo 1)
public class Anexo2GetResponse
{
    public Anexo2Data Data { get; set; } = new Anexo2Data();
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
                    var data = JsonSerializer.Deserialize<Anexo2Data>(json);
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
        public async Task<IActionResult> SaveAnexo2Data([FromBody] Anexo2Data data)
        {
            // ===================================================================
            // TRADUCCIÓN DE LA LÓGICA DE LAS MACROS DEL ANEXO II
            // ===================================================================
            var validationErrors = new List<string>();

            // Función auxiliar para recorrer todas las filas y aplicar validaciones
            Action<FilaAnexo2, string> validateRow = (row, name) =>
            {
                // Regla: No acepta valores negativos (excepto Tasa que puede ser negativa?)
                if (row.movimientos.debe < 0 || row.movimientos.haber < 0 || row.finPeriodo < 0 || row.promedioPeriodo < 0 || row.cuentasAsociadosVigentes < 0)
                {
                    validationErrors.Add($"Los valores para '{name}' no pueden ser negativos.");
                }

                // Regla: No admite decimales en Cuentas Vigentes
                if (row.cuentasAsociadosVigentes % 1 != 0)
                {
                    validationErrors.Add($"El campo 'Cuentas Asociados Vigentes' para '{name}' no puede tener decimales.");
                }
                
                // Regla: Tasa no puede ser > 99.xx% (o 0.99)
                if (row.tasaEstimuloEfectivaMensual >= 1) // 1 equivale a 100%
                {
                    validationErrors.Add($"La tasa para '{name}' no puede ser igual o mayor a 100%.");
                }
                
                // Regla: Si "Fin Período" tiene un valor, los movimientos son obligatorios (un ejemplo)
                // Esta regla puede necesitar ajuste según la lógica de negocio exacta.
                if (row.finPeriodo != 0 && (row.movimientos.debe == 0 && row.movimientos.haber == 0))
                {
                     validationErrors.Add($"Los campos 'Debe' o 'Haber' para '{name}' son obligatorios si 'Fin Período' tiene un valor.");
                }
            };
            
            // Aplicamos las validaciones a cada fila del Apartado A
            validateRow(data.apartadoA.recursosEnPesos.ahorroATermino, "A - Recursos Pesos - Ahorro a Término");
            validateRow(data.apartadoA.recursosEnPesos.ahorroVariableComun, "A - Recursos Pesos - Ahorro Variable Común");
            // ... y así para todas las filas ...
            
            // Aplicamos las validaciones a cada fila del Apartado B
            validateRow(data.apartadoB.ayudaEnPesos.pagoIntegro, "B - Ayuda Pesos - Pago Íntegro");
            // ... y así para todas las filas ...


            if (validationErrors.Any())
            {
                return BadRequest(new { errors = validationErrors });
            }

            // Si todo es válido, guardamos
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
    }
}