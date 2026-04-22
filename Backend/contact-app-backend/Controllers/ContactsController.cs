using ContactApi.Data;
using ContactApi.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.IO;

namespace ContactApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ContactsController : ControllerBase
    {
        private readonly ContactContext _context;

        public ContactsController(ContactContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Contact>>> GetContacts()
        {
            return await _context.Contacts.ToListAsync();
        }

        [HttpPost]
        public async Task<ActionResult<Contact>> PostContact(Contact contact)
        {
            if (string.IsNullOrEmpty(contact.Id)) 
                contact.Id = Guid.NewGuid().ToString();

            _context.Contacts.Add(contact);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetContacts), new { id = contact.Id }, contact);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> PutContact(string id, Contact contact)
        {
            if (id != contact.Id) return BadRequest();

            _context.Entry(contact).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ContactExists(id)) return NotFound();
                else throw;
            }

            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteContact(string id)
        {
            var contact = await _context.Contacts.FindAsync(id);
            if (contact == null) return NotFound();

            _context.Contacts.Remove(contact);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        [HttpPost("upload-image")]
        public async Task<ActionResult<object>> UploadImage(IFormFile file)
        {
            if (file == null || file.Length == 0)
                return BadRequest("Nincs fájl kiválasztva.");

            var allowedExtensions = new[] { ".jpg", ".jpeg", ".png", ".svg" };
            var extension = Path.GetExtension(file.FileName).ToLower();
            if (!allowedExtensions.Contains(extension))
                return BadRequest("Nem engedélyezett fájltípus. Csak .jpg, .png, .svg megengedett.");

            var fileName = $"{Guid.NewGuid()}{extension}";
            var filePath = Path.Combine(Directory.GetCurrentDirectory(), "uploads", fileName);

            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await file.CopyToAsync(stream);
            }

            var fileUrl = $"/uploads/{fileName}";
            return Ok(new { url = fileUrl });
        }

        [HttpDelete("delete-image")]
        public IActionResult DeleteImage(string url)
        {
            if (string.IsNullOrEmpty(url)) return BadRequest();

            var fileName = Path.GetFileName(url);
            var filePath = Path.Combine(Directory.GetCurrentDirectory(), "uploads", fileName);

            if (System.IO.File.Exists(filePath))
            {
                System.IO.File.Delete(filePath);
                return Ok(new { message = "Kép törölve" });
            }

            return NotFound("A fájl nem található a szerveren.");
        }

        private bool ContactExists(string id)
        {
            return _context.Contacts.Any(e => e.Id == id);
        }
    }
}