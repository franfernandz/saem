# MiMutual.Api/Dockerfile

# --- Fase 1: Compilación (Build) ---
# Usamos una imagen oficial de .NET que tiene todo el SDK para compilar la app
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /app

# Copiamos solo los archivos de proyecto para restaurar las dependencias de forma eficiente
COPY *.csproj .
RUN dotnet restore

# Copiamos el resto del código fuente de la API
COPY . .
WORKDIR "/app"
RUN dotnet publish -c Release -o /app/out

# --- Fase 2: Publicación (Publish) ---
# Usamos una imagen mucho más ligera que solo tiene el runtime de ASP.NET,
# ya que no necesitamos el compilador en producción.
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS runtime
WORKDIR /app
COPY --from=build /app/out ./

# Le decimos a Docker en qué puerto se ejecutará nuestra aplicación
EXPOSE 80

# El comando final para iniciar la aplicación cuando se ejecute el contenedor
ENTRYPOINT ["dotnet", "MiMutual.Api.dll"]