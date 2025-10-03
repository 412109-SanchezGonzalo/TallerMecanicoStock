using AppTallerMecanico_BE.Data.Interfaces;
using AppTallerMecanico_BE.Data.Repositories;
using AppTallerMecanico_BE.Services;

var builder = WebApplication.CreateBuilder(args);


// 1?? CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});


// 2?? Inyección de dependencias para repositorios
var connStr = builder.Configuration.GetConnectionString("TallerStock");

builder.Services.AddScoped<IMarcaRepository>(_ => new MarcaRepository(connStr));
builder.Services.AddScoped<ITipoRepository>(_ => new TipoRepository(connStr));
builder.Services.AddScoped<IRepuestoRepository>(_ => new RepuestoRepository(connStr));


// 4?? Servicio unificado
builder.Services.AddScoped<IServicesTaller, ServicesTaller>();


// ?? Habilitar explorar directorios (opcional)
builder.Services.AddDirectoryBrowser();

// Add services to the container.
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseCors("AllowAll");
app.UseAuthentication();
app.UseAuthorization();

// ?? Servir archivos estáticos desde wwwroot
app.UseDefaultFiles();   // sirve automáticamente index.html si está en wwwroot
app.UseStaticFiles();    // habilita wwwroot

app.MapControllers();

// ?? fallback a index.html si no es ruta de API
app.MapFallbackToFile("Pages/index.html");

app.Run();
