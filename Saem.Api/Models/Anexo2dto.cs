// MiMutual.Api/Models/Anexo2Dto.cs

namespace MiMutual.Api.Models;

// Interface base que representa una fila completa en cualquiera de las dos tablas
public class FilaAnexo2Dto
{
    public MovimientosDto Movimientos { get; set; } = new();
    public decimal FinPeriodo { get; set; }
    public decimal PromedioPeriodo { get; set; }
    public int CuentasAsociadosVigentes { get; set; }
    public decimal TasaEstimuloEfectivaMensual { get; set; }
}

public class MovimientosDto
{
    public decimal Debe { get; set; }
    public decimal Haber { get; set; }
}


// Interfaces para la Tabla A: Recursos Captados
public class ApartadoADto
{
    public GrupoRecursosDto RecursosEnPesos { get; set; } = new();
    public GrupoRecursosDto RecursosEnMonedaExtranjera { get; set; } = new();
}

public class GrupoRecursosDto
{
    public FilaAnexo2Dto AhorroATermino { get; set; } = new();
    public FilaAnexo2Dto AhorroVariableComun { get; set; } = new();
    public FilaAnexo2Dto AhorroVariableEspecial { get; set; } = new();
    public FilaAnexo2Dto Otros { get; set; } = new();
}

// Interfaces para la Tabla B: Aplicaciones
public class ApartadoBDto
{
    public GrupoAyudaDto AyudaEnPesos { get; set; } = new();
    public GrupoAyudaDto AyudaEnMonedaExtranjera { get; set; } = new();
}

public class GrupoAyudaDto
{
    public FilaAnexo2Dto PagoIntegro { get; set; } = new();
    public FilaAnexo2Dto Amortizable { get; set; } = new();
    public FilaAnexo2Dto Otros { get; set; } = new();
}


// El objeto principal que representa todo el Anexo
public class Anexo2Dto // <-- Nombre estandarizado
{
  public ApartadoADto ApartadoA { get; set; } = new();
  public ApartadoBDto ApartadoB { get; set; } = new();
}