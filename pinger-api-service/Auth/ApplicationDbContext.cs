using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace pinger_api_service
{
    public class ApplicationDbContext : IdentityDbContext<User>
    {
        public DbSet<ChatSpace> ChatSpace { get; set; }
        public DbSet<PrivateMessage> PrivateMessage { get; set; }
        public DbSet<Channel> Channel { get; set; }
        public DbSet<ChannelMessage> ChannelMessage { get; set; }

        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
        {
        }
        protected override void OnModelCreating(ModelBuilder builder)
        {
            builder.Entity<User>()
                .HasMany(c => c.ContactedUsersInfo)
                .WithOne(e => e.Owner);

            builder.Entity<Channel>()
                .HasOne<User>(c => c.Owner)
                .WithMany(u => u.OwnedChannels)
                .HasForeignKey(c => c.OwnerId)
                .OnDelete(DeleteBehavior.Restrict);

            builder
                .Entity<Channel>()
                .HasMany(c => c.Members)
                .WithMany(m => m.Channels)
                .UsingEntity(j => j.ToTable("ChannelMembers"));

            base.OnModelCreating(builder);
        }
    }
}