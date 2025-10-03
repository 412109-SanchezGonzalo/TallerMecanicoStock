# Usa la imagen base de .NET 8.0 SDK para construir
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build-env
WORKDIR /app

# Copia solo los archivos de proyecto primero (para aprovechar la cache de Docker)
COPY AppTallerMecanico_BE.csproj ./

# (Opcional) Copia un nuget.config si lo tenés
# COPY nuget.config ./

# Restaura las dependencias
RUN dotnet restore AppTallerMecanico_BE.csproj

# Ahora copiamos el resto del código fuente
COPY . ./

# Construye y publica la aplicación
RUN dotnet publish AppTallerMecanico_BE.csproj -c Release -o out

# Runtime: solo lleva el resultado publicado
FROM mcr.microsoft.com/dotnet/aspnet:8.0
WORKDIR /app
COPY --from=build-env /app/out .

# Render expone por defecto el puerto 10000
EXPOSE 10000

# Comando para iniciar la aplicación
ENTRYPOINT ["dotnet", "AppTallerMecanico_BE.dll"]
