// Saem.Api/Models/Anexo7dto.cs

namespace MiMutual.Api.Models
{
    public class Anexo7Dto
    {

        public int matricula { get; set; }
    public int grado { get; set; }
    public int provincia { get; set; }
    public string periodo { get; set; } = string.Empty;
    public string entradaWeb { get; set; } = string.Empty;
    public int orden { get; set; }
    public string apeNomRazSoc { get; set; } = string.Empty;
    public string cuitCuilCdi { get; set; } = string.Empty;
    public string numeroAsociado { get; set; } = string.Empty;
    public decimal importeOperado { get; set; }
    public string usuario { get; set; } = string.Empty;
    public DateTime fyH { get; set; }

    }
}
