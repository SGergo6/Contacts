namespace ContactApi.Models
{
    public class Contact
    {
        public string Id { get; set; } = Guid.NewGuid().ToString();
        
        public string Name { get; set; } = string.Empty;
        public string? Phone { get; set; }
        public string? Email { get; set; }
        public string? ProfilePicUrl { get; set; }
    }
}
