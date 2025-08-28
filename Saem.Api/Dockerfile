# MiMutual.Api/Dockerfile (Versión Compatible con Render)

# --- Fase 1: Compilación ---
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src
COPY ["MiMutual.Api/MiMutual.Api.csproj", "MiMutual.Api/"]
RUN dotnet restore "MiMutual.Api/MiMutual.Api.csproj"
COPY . .
WORKDIR "/src/MiMutual.Api"
RUN dotnet publish "MiMutual.Api.csproj" -c Release -o /app/publish

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

ENTRYPOINT ["dotnet", "MiMutual.Api.dll"]