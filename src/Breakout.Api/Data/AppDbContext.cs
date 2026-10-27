using Microsoft.EntityFrameworkCore;

namespace Breakout.Api.Data;

public sealed class AppDbContext(DbContextOptions<AppDbContext> options) : DbContext(options);
