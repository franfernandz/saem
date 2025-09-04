namespace MiMutual.Api.Models;

public class ApartadoAFondoGarantiaInputDto
{
    public decimal PorcentajeArt9IncB { get; set; } = 0.10M;
}

public class ApartadoBLimiteCaptacionAhorroInputDto
{
    public decimal PatrimonioNeto { get; set; }
    public decimal InversionesInmuebles { get; set; }
    public decimal OtrosActivosFijos { get; set; }
    public decimal CargosDiferidos { get; set; }
    public decimal ActivosNoCorrientesNeto { get; set; }
}

public class Anexo3Dto
{
    public ApartadoAFondoGarantiaInputDto ApartadoAInputs { get; set; } = new();
    public ApartadoBLimiteCaptacionAhorroInputDto ApartadoBInputs { get; set; } = new();

    public decimal ApartadoA_SaldoPromedioTotalCuentasAhorroMutual { get; set; }
    public decimal ApartadoA_Total_1_3 { get; set; }
    public decimal ApartadoA_SaldoPromedioDisponibilidadesInversiones { get; set; }
    public decimal ApartadoA_MargenDeficienciaPeriodo { get; set; }

    public decimal ApartadoB_CapitalLiquido { get; set; }
    public decimal ApartadoB_MaximoCaptacionCapitalLiquido { get; set; }
    public decimal ApartadoB_MaximoCaptacionPatrimonioNeto { get; set; }
    public decimal ApartadoB_CaptacionAhorroReferencia { get; set; }
    public decimal ApartadoB_MargenDeficienciaCapitalLiquido { get; set; }
    public decimal ApartadoB_MargenDeficienciaPatrimonioNeto { get; set; }
}

public class Anexo3GetResponse
{
    public Anexo3Dto Data { get; set; } = new Anexo3Dto();
    public bool IsSaved { get; set; } = false;
}
