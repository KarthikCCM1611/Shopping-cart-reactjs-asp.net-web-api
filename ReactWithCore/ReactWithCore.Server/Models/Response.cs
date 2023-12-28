namespace ReactWithCore.Server.Models
{
    public class Response
    {
        public int statusCode { get; set; }
        public string statusMessage { get; set; }
        public List<Product> listOfProducts { get; set; }
        public Product product { get; set; }
        public string imageUrl { get; set; }
    }
}
