# MiMutual.Api/Dockerfile (Versión Mejorada)

# --- Fase 1: Compilación (Build) ---
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Copia solo los archivos de proyecto al directorio de trabajo
COPY ["Saem.Api/Saem.Api.csproj", "Saem.Api/"]

# Ejecuta dotnet restore en el proyecto
RUN dotnet restore "Saem.Api/Saem.Api.csproj"

# Copia todo lo demás
COPY . .
WORKDIR "/src/Saem.Api"
RUN dotnet build "Saem.Api.csproj" -c Release -o /app/build

# --- Fase 2: Publicación ---
FROM build AS publish
RUN dotnet publish "Saem.Api.csproj" -c Release -o /app/publish

# --- Fase 3: Final ---
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "Saem.Api.dll"]