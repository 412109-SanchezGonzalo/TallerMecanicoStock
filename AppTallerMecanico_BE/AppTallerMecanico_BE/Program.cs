var builder = WebApplication.CreateBuilder(args);

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

// ?? Servir archivos est�ticos desde wwwroot
app.UseDefaultFiles();   // sirve autom�ticamente index.html si est� en wwwroot
app.UseStaticFiles();    // habilita wwwroot

app.MapControllers();

// ?? fallback a index.html si no es ruta de API
app.MapFallbackToFile("Pages/index.html");

app.Run();
