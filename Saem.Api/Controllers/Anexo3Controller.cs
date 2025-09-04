// MiMutual.Api/Controllers/Anexo3Controller.cs

using Microsoft.AspNetCore.Mvc;
using MiMutual.Api.Models;
using System.Text.Json;
using System.IO;
using System.Threading.Tasks;
using System.Collections.Generic;
using System.Linq;

namespace MiMutual.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class Anexo3Controller : ControllerBase
    {
        private const string FilePath = "Anexo3Data.json";
        private const string Anexo1FilePath = "Anexo1Data.json";
        private const string Anexo2FilePath = "Anexo2Data.json";

        // --- Carga segura de Anexo1 ---
        private Anexo1Dto LoadAnexo1Data()
        {
            if (System.IO.File.Exists(Anexo1FilePath))
            {
                try
                {
                    var json = System.IO.File.ReadAllText(Anexo1FilePath);
                    return JsonSerializer.Deserialize<Anexo1Dto>(json) ?? new Anexo1Dto();
                }
                catch { return new Anexo1Dto(); }
            }
            return new Anexo1Dto();
        }

        // --- Carga segura de Anexo2 ---
        private Anexo2Dto LoadAnexo2Data()
        {
            if (System.IO.File.Exists(Anexo2FilePath))
            {
                try
                {
                    var json = System.IO.File.ReadAllText(Anexo2FilePath);
                    return JsonSerializer.Deserialize<Anexo2Dto>(json) ?? new Anexo2Dto();
                }
                catch { return new Anexo2Dto(); }
            }
            return new Anexo2Dto();
        }

        // --- Calcula Anexo3 garantizando valores inicializados ---
        private Anexo3Dto CalculateAnexo3(Anexo3Dto currentData, Anexo1Dto anexo1, Anexo2Dto anexo2)
        {
            var data = currentData ?? new Anexo3Dto();

            // Aseguramos inputs no nulos
            data.ApartadoAInputs ??= new ApartadoAFondoGarantiaInputDto { PorcentajeArt9IncB = 0.1M };
            data.ApartadoBInputs ??= new ApartadoBLimiteCaptacionAhorroInputDto();

            // Inicializamos todos los campos calculados
            data.ApartadoA_SaldoPromedioTotalCuentasAhorroMutual = 0;
            data.ApartadoA_Total_1_3 = 0;
            data.ApartadoA_SaldoPromedioDisponibilidadesInversiones = 0;
            data.ApartadoA_MargenDeficienciaPeriodo = 0;
            data.ApartadoB_CapitalLiquido = 0;
            data.ApartadoB_MaximoCaptacionCapitalLiquido = 0;
            data.ApartadoB_MaximoCaptacionPatrimonioNeto = 0;
            data.ApartadoB_CaptacionAhorroReferencia = 0;
            data.ApartadoB_MargenDeficienciaCapitalLiquido = 0;
            data.ApartadoB_MargenDeficienciaPatrimonioNeto = 0;

            // ===========================
            // APARTADO A
            // ===========================
            if (anexo2 != null)
            {
                var r3Pesos = anexo2.ApartadoA?.RecursosEnPesos ?? new GrupoRecursosDto();
                data.ApartadoA_SaldoPromedioTotalCuentasAhorroMutual =
                    r3Pesos.AhorroATermino?.PromedioPeriodo ?? 0 +
                    r3Pesos.AhorroVariableComun?.PromedioPeriodo ?? 0 +
                    r3Pesos.AhorroVariableEspecial?.PromedioPeriodo ?? 0 +
                    r3Pesos.Otros?.PromedioPeriodo ?? 0;
            }

            data.ApartadoA_Total_1_3 = data.ApartadoA_SaldoPromedioTotalCuentasAhorroMutual * data.ApartadoAInputs.PorcentajeArt9IncB;

            if (anexo1 != null)
            {
                var d = anexo1.Disponibilidades ?? new GrupoDisponibilidadesDto();
                var i = anexo1.Inversiones ?? new GrupoInversionesDto();

                var totalDisp = (d.EnPesos?.Caja?.PromedioPeriodo ?? 0) +
                                (d.EnPesos?.CuentaCorriente?.PromedioPeriodo ?? 0) +
                                (d.EnPesos?.Otros?.PromedioPeriodo ?? 0) +
                                (d.EnMonedaExtranjera?.Caja?.PromedioPeriodo ?? 0) +
                                (d.EnMonedaExtranjera?.CuentaCorriente?.PromedioPeriodo ?? 0) +
                                (d.EnMonedaExtranjera?.Otros?.PromedioPeriodo ?? 0);

                var totalInv = (i.EnPesos?.CajaDeAhorro?.PromedioPeriodo ?? 0) +
                               (i.EnPesos?.PlazoFijo?.PromedioPeriodo ?? 0) +
                               (i.EnPesos?.TitulosPublicos?.PromedioPeriodo ?? 0) +
                               (i.EnPesos?.TiCoCa?.PromedioPeriodo ?? 0) +
                               (i.EnPesos?.Otros?.PromedioPeriodo ?? 0) +
                               (i.EnMonedaExtranjera?.CajaDeAhorro?.PromedioPeriodo ?? 0) +
                               (i.EnMonedaExtranjera?.PlazoFijo?.PromedioPeriodo ?? 0) +
                               (i.EnMonedaExtranjera?.TitulosPublicos?.PromedioPeriodo ?? 0) +
                               (i.EnMonedaExtranjera?.Otros?.PromedioPeriodo ?? 0);

                data.ApartadoA_SaldoPromedioDisponibilidadesInversiones = totalDisp + totalInv;
            }

            data.ApartadoA_MargenDeficienciaPeriodo =
                data.ApartadoA_SaldoPromedioDisponibilidadesInversiones - data.ApartadoA_Total_1_3;

            // ===========================
            // APARTADO B
            // ===========================
            data.ApartadoB_CapitalLiquido = data.ApartadoBInputs.PatrimonioNeto -
                ((data.ApartadoBInputs.InversionesInmuebles) +
                 (data.ApartadoBInputs.OtrosActivosFijos) +
                 (data.ApartadoBInputs.CargosDiferidos) +
                 (data.ApartadoBInputs.ActivosNoCorrientesNeto));

            data.ApartadoB_MaximoCaptacionCapitalLiquido = data.ApartadoB_CapitalLiquido * 25;
            data.ApartadoB_MaximoCaptacionPatrimonioNeto = data.ApartadoBInputs.PatrimonioNeto * 15;
            data.ApartadoB_CaptacionAhorroReferencia = data.ApartadoA_SaldoPromedioTotalCuentasAhorroMutual;
            data.ApartadoB_MargenDeficienciaCapitalLiquido = data.ApartadoB_MaximoCaptacionCapitalLiquido - data.ApartadoB_CaptacionAhorroReferencia;
            data.ApartadoB_MargenDeficienciaPatrimonioNeto = data.ApartadoB_MaximoCaptacionPatrimonioNeto - data.ApartadoB_CaptacionAhorroReferencia;

            return data;
        }

        [HttpGet]
        public ActionResult<Anexo3GetResponse> GetAnexo3Data()
        {
            var response = new Anexo3GetResponse();
            bool isSaved = false;

            // Cargar inputs guardados
            Anexo3Dto savedInputs = new Anexo3Dto();
            if (System.IO.File.Exists(FilePath))
            {
                try
                {
                    var json = System.IO.File.ReadAllText(FilePath);
                    savedInputs = JsonSerializer.Deserialize<Anexo3Dto>(json) ?? new Anexo3Dto();
                    isSaved = true;
                }
                catch { savedInputs = new Anexo3Dto(); }
            }

            // Cargar Anexo1 y Anexo2
            var anexo1 = LoadAnexo1Data();
            var anexo2 = LoadAnexo2Data();

            response.Data = CalculateAnexo3(savedInputs, anexo1, anexo2);
            response.IsSaved = isSaved;

            return Ok(response);
        }

        [HttpPost("save")]
        public async Task<IActionResult> SaveAnexo3Data([FromBody] Anexo3Dto data)
        {
            var errors = new List<string>();
            if (data.ApartadoAInputs.PorcentajeArt9IncB < 0 || data.ApartadoAInputs.PorcentajeArt9IncB > 1)
                errors.Add("Porcentaje Art.9 Inc B debe estar entre 0 y 1");

            if (errors.Any()) return BadRequest(new { errors });

            try
            {
                var json = JsonSerializer.Serialize(data, new JsonSerializerOptions { WriteIndented = true });
                await System.IO.File.WriteAllTextAsync(FilePath, json);
                return NoContent();
            }
            catch { return StatusCode(500, "Error al guardar Anexo3"); }
        }

        [HttpPost("delete")]
        public IActionResult DeleteAnexo3Data()
        {
            try
            {
                if (System.IO.File.Exists(FilePath)) System.IO.File.Delete(FilePath);
                return NoContent();
            }
            catch { return StatusCode(500, "Error al eliminar Anexo3"); }
        }
    }
}
