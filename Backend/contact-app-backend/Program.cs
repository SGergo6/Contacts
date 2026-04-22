using ContactApi.Data;
using ContactApi.Models;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddDbContext<ContactContext>(options =>
    options.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddControllers();

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp", policy =>
    {
        policy.WithOrigins("http://localhost:5173")
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;
    var context = services.GetRequiredService<ContactContext>();
    
    context.Database.EnsureCreated();

    if (!context.Contacts.Any())
    {
        context.Contacts.AddRange(
            new Contact { Id = "1", Name = "Timothy Lewis", Phone = "+36 01 234 5678", Email = "timothylewis@email.com" },
            new Contact { Id = "2", Name = "Sarah Wright", Phone = "+36 01 234 5678", Email = "sarah.wright@email.com" },
            new Contact { Id = "3", Name = "Lucy Jones", Phone = "+36 01 234 5678", Email = "lucyjones@email.com" }
        );
        context.SaveChanges();
    }
}

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseStaticFiles();

var uploadsPath = Path.Combine(Directory.GetCurrentDirectory(), "uploads");
if (!Directory.Exists(uploadsPath))
{
    Directory.CreateDirectory(uploadsPath);
}

app.UseStaticFiles(new StaticFileOptions
{
    FileProvider = new Microsoft.Extensions.FileProviders.PhysicalFileProvider(uploadsPath),
    RequestPath = "/uploads"
});

app.UseCors("AllowReactApp");

app.UseAuthorization();
app.MapControllers();

app.Run();