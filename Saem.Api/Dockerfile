# MiMutual.Api/Dockerfile (Versión Compatible con Render)

# --- Fase 1: Compilación ---
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src
COPY ["Saem.Api/Saem.Api.csproj", "Saem.Api/"]
RUN dotnet restore "Saem.Api/Saem.Api.csproj"
COPY . .
WORKDIR "/src/Saem.Api"
RUN dotnet publish "Saem.Api.csproj" -c Release -o /app/publish

# --- Fase 2: Final ---
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS final
WORKDIR /app
COPY --from=publish /app/publish .

# 1. Render espera que los servicios escuchen en el puerto 10000.
#    Esta variable de entorno le dice a ASP.NET que escuche en todos
#    los adaptadores de red en el puerto 10000.
ENV PORT=10000

# 2. Exponemos el puerto para que Docker sepa que está disponible.
EXPOSE 10000

ENTRYPOINT ["dotnet", "Saem.Api.dll"]