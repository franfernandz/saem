# MiMutual.Api/Dockerfile (Versión Correcta para estructura con subdirectorios)

# --- Fase 1: Compilación ---
# Empezamos con la imagen del SDK de .NET
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build

# Establecemos el directorio de trabajo principal
WORKDIR /src

# Copiamos SOLO los archivos .csproj para restaurar dependencias primero.
# Esto es una optimización de caché de Docker.
COPY ["Saem.Api/Saem.Api.csproj", "Saem.Api/"]

# Ejecutamos el restore en el archivo de proyecto específico
RUN dotnet restore "Saem.Api/Saem.Api.csproj"

# Ahora copiamos todo lo demás (el código fuente completo)
COPY . .

# Nos movemos al directorio del proyecto y lo construimos
WORKDIR "/src/Saem.Api"
RUN dotnet build "Saem.Api.csproj" -c Release -o /app/build

# --- Fase 2: Publicación ---
# Continuamos desde la fase de build para publicar la aplicación
FROM build AS publish
RUN dotnet publish "Saem.Api.csproj" -c Release -o /app/publish

# --- Fase 3: Imagen Final ---
# Empezamos desde la imagen ligera de ASP.NET runtime para producción
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS final
WORKDIR /app

# Copiamos solo los artefactos publicados desde la fase anterior
COPY --from=publish /app/publish .

# Render proveerá la variable de entorno PORT. Si no está, usaremos 8080.
ENV ASPNETCORE_URLS="http://+:${PORT:-8080}"
EXPOSE 8080

# Comando para iniciar la aplicación
ENTRYPOINT ["dotnet", "Saem.Api.dll"]