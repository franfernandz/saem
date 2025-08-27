// MiMutual.Api/Models/Anexo1Dto.cs

namespace MiMutual.Api.Models;

// El objeto principal que representa todo el Anexo
public class Anexo1Dto
{
    public GrupoDisponibilidadesDto Disponibilidades { get; set; } = new();
    public GrupoInversionesDto Inversiones { get; set; } = new();
}

// --- Clases para la sección de DISPONIBILIDADES ---
public class GrupoDisponibilidadesDto
{
    public ConceptosEnMonedaDto EnPesos { get; set; } = new();
    public ConceptosEnMonedaDto EnMonedaExtranjera { get; set; } = new();
}

public class ConceptosEnMonedaDto
{
    public ValorMonetarioDto Caja { get; set; } = new();
    public ValorMonetarioDto CuentaCorriente { get; set; } = new();
    public ValorMonetarioDto Otros { get; set; } = new();
}

// --- Clases para la sección de INVERSIONES ---
public class GrupoInversionesDto
{
    public ConceptosInversionPesosDto EnPesos { get; set; } = new();
    public ConceptosInversionMonedaExtranjeraDto EnMonedaExtranjera { get; set; } = new();
}

public class ConceptosInversionPesosDto
{
    public ValorMonetarioDto CajaDeAhorro { get; set; } = new();
    public ValorMonetarioDto PlazoFijo { get; set; } = new();
    public ValorMonetarioDto TitulosPublicos { get; set; } = new();
    public ValorMonetarioDto TiCoCa { get; set; } = new();
    public ValorMonetarioDto Otros { get; set; } = new();
}

public class ConceptosInversionMonedaExtranjeraDto
{
    public ValorMonetarioDto CajaDeAhorro { get; set; } = new();
    public ValorMonetarioDto PlazoFijo { get; set; } = new();
    public ValorMonetarioDto TitulosPublicos { get; set; } = new();
    public ValorMonetarioDto Otros { get; set; } = new();
}


// --- Clase reutilizable para los valores finales ---
public class ValorMonetarioDto
{
    public decimal SaldoPeriodo { get; set; }
    public decimal PromedioPeriodo { get; set; }
}