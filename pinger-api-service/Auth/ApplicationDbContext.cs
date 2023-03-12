using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace pinger_api_service
{
    public class ApplicationDbContext : IdentityDbContext<User>
    {
        public DbSet<ChatSpace> ChatSpace { get; set; }
        public DbSet<PrivateMessage> PrivateMessage { get; set; }

        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
        {
        }
        protected override void OnModelCreating(ModelBuilder builder)
        {
            builder.Entity<User>()
                .HasMany(c => c.ContactedUsersInfo)
                .WithOne(e => e.Owner);
            base.OnModelCreating(builder);
        }
    }
}