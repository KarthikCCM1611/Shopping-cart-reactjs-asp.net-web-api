using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using ReactWithCore.Server.Models;
using System.Buffers.Text;
using System.Data;
using System.Data.SqlClient;
using static System.Runtime.InteropServices.JavaScript.JSType;
using System.Net.NetworkInformation;
using static System.Net.Mime.MediaTypeNames;

namespace ReactWithCore.Server.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class ProductController : ControllerBase
    {
        private readonly IConfiguration _configuration;
        private readonly IWebHostEnvironment _hostEnvironment;
        private readonly string _connectionString;
        public ProductController(IConfiguration configuration, IWebHostEnvironment hostEnvironment)
        {
            _configuration = configuration;
            _connectionString = _configuration.GetConnectionString("ConnectionString").ToString();
            _hostEnvironment = hostEnvironment;
        }

        [HttpGet]
        [Route("ListOfProducts")]
        public Response ListOfProducts()
        {
            Response response = new Response();
            List<Product> productsList = new List<Product>();
            SqlConnection connection = new SqlConnection(_connectionString);

            //SqlDataAdapter dataAdapter = new SqlDataAdapter("SELECT * FROM Products", connection);

            SqlCommand command = new SqlCommand("GetProducts", connection);
            command.CommandType = CommandType.StoredProcedure;
            SqlDataAdapter dataAdapter = new SqlDataAdapter(command);

            DataTable dataTable = new DataTable();
            dataAdapter.Fill(dataTable);
            if(dataTable.Rows.Count > 0)
            {
                for(var i = 0; i < dataTable.Rows.Count; i++)
                {
                    Product product = new Product();
                    product.Id = Convert.ToInt32(dataTable.Rows[i]["Id"]);
                    product.Name = Convert.ToString(dataTable.Rows[i]["Name"]);
                    var image = Convert.ToString(dataTable.Rows[i]["Image"]);
                    if (System.IO.File.Exists(image))
                    {
                        var extension = Path.GetExtension(image).Split(".")[1];
                        image = Convert.ToBase64String(System.IO.File.ReadAllBytes(image));
                        image = $"data:image/{extension};base64,{image}";
                    }
                    else
                    {
                        image = Convert.ToBase64String(System.IO.File.ReadAllBytes(_hostEnvironment.ContentRootPath + "/Images/NoImage.jpg"));
                        image = $"data:image/jpg;base64,{image}";
                    }
                    product.Image = image;
                    product.Price = Convert.ToDecimal(dataTable.Rows[i]["Price"]);
                    productsList.Add(product);
                }
                response.statusCode = 200;
                response.statusMessage = "Data found";
                response.listOfProducts = productsList;
            }
            else
            {
                response.statusCode = 100;
                response.statusMessage = "No data found";
                response.listOfProducts = null;
            }
            return response;
        }

        [HttpPost]
        [Route("AddNewProduct")]
        public Response AddNewProduct(Product product)
        {
            Response response = new Response();
            SqlConnection connection = new SqlConnection(_connectionString);

            SqlCommand command = new SqlCommand("AddNewProduct", connection);
            command.CommandType = CommandType.StoredProcedure;
            command.Parameters.AddWithValue("@Name", product.Name);
            command.Parameters.AddWithValue("@Image", product.Image);
            command.Parameters.AddWithValue("@Price", product.Price);
            connection.Open();
            int result = command.ExecuteNonQuery();
            connection.Close();
            if(result == 0)
            {
                response.statusCode = 100;
                response.statusMessage = $"Error adding the new product";
            }
            else
            {
                response.statusCode = 200;
                response.statusMessage = "Product Added Successfully";
            }
            return response;
        }

        [HttpPost]
        [Route("UploadFile")]
        public Response UploadFile(IFormFile file, int id)
        {
            Response response = new Response();
            try
            {
                if(id > 0)
                {
                    var oldImagePath = GetProductById(id, true).product.Image;
                    if (System.IO.File.Exists(oldImagePath))
                    {
                        System.IO.File.Delete(oldImagePath);
                    }
                }
                var fileName = Path.GetFileName(file.FileName);
                var extension = Path.GetExtension(fileName);
                string fileGuid = Guid.NewGuid().ToString();
                var path = Path.Combine(_hostEnvironment.ContentRootPath, "Images" , fileGuid+extension);
                using (var fileStream = new FileStream(path, FileMode.Create))
                {
                    file.CopyTo(fileStream);
                }
                response.imageUrl = path;
                response.statusCode = 200;
                response.statusMessage = "Product Added Successfully";
            }
            catch
            {
                response.statusCode = 100;
                response.statusMessage = $"Error adding the new product";
            }
            return response;
        }


        [HttpPut]
        [Route("UpdateProduct")]
        public Response UpdateProduct(Product product)
        {
            Response response = new Response();
            SqlConnection connection = new SqlConnection(_connectionString);
            Response oldProductResponse = GetProductById(product.Id, true);
            Product oldProduct = oldProductResponse.product;
            if(product.Name == "")
            {
                product.Name = oldProduct.Name;
            }
            if (Path.GetExtension(product.Image) == "")
            {
                product.Image = oldProduct.Image;
            }
            if (product.Price == 0)
            {
                product.Price = oldProduct.Price;
            }
            SqlCommand command = new SqlCommand("UpdateProduct", connection);
            command.CommandType = CommandType.StoredProcedure;
            command.Parameters.AddWithValue("@Name", product.Name);
            command.Parameters.AddWithValue("@Image", product.Image);
            command.Parameters.AddWithValue("@Price", product.Price);
            command.Parameters.AddWithValue("@Id", product.Id);
            connection.Open();
            int result = command.ExecuteNonQuery();
            connection.Close();
            if (result == 0)
            {
                response.statusCode = 400;
                response.statusMessage = $"Error updating the product";
            }
            else
            {
                response.statusCode = 200;
                response.statusMessage = "Product Updated Successfully";
            }
            return response;
        }

        [HttpDelete]
        [Route("DeleteProduct")]
        public Response DeleteProduct(int id)
        {
            Response response = new Response();
            var imagePath = GetProductById(id, true).product.Image;
            var noImagePath = _hostEnvironment.ContentRootPath + "/Images/NoImage.jpg";
            //var noImagePath = Path.Combine(_hostEnvironment.ContentRootPath, "Images", "NoImage.jpg");
            if (System.IO.File.Exists(imagePath) && imagePath != noImagePath)
            {
                System.IO.File.Delete(imagePath);
            }
            SqlConnection connection = new SqlConnection(_connectionString);
            SqlCommand command = new SqlCommand("DeleteProduct", connection);
            command.CommandType = CommandType.StoredProcedure;
            command.Parameters.AddWithValue("@Id", id);
            connection.Open();
            int result = command.ExecuteNonQuery();
            connection.Close();
            if (result == 0)
            {
                response.statusCode = 400;
                response.statusMessage = $"Error deleting the product";
            }
            else
            {
                response.statusCode = 200;
                response.statusMessage = "Product Deleted Successfully";
            }
            return response;
        }


        [HttpGet]
        [Route("GetProductById")]
        public Response GetProductById(int id, bool isImagePath = false)
        {
            Response response = new Response();
            Product product = new Product();
            SqlConnection connection = new SqlConnection(_connectionString);

            //SqlDataAdapter dataAdapter = new SqlDataAdapter($"SELECT * FROM Products WHERE Id={id}", connection);

            SqlCommand command = new SqlCommand("GetProductById", connection);
            command.CommandType = CommandType.StoredProcedure;
            command.Parameters.AddWithValue("@Id", id);
            SqlDataAdapter dataAdapter = new SqlDataAdapter(command);

            DataTable dataTable = new DataTable();
            dataAdapter.Fill(dataTable);
            if (dataTable.Rows.Count > 0)
            {
                product.Id = Convert.ToInt32(dataTable.Rows[0]["Id"]);
                product.Name = Convert.ToString(dataTable.Rows[0]["Name"]);
                var image = Convert.ToString(dataTable.Rows[0]["Image"]);
                if (!isImagePath)
                {
                    if (System.IO.File.Exists(image))
                    {
                        var extension = Path.GetExtension(image).Split(".")[1];
                        image = Convert.ToBase64String(System.IO.File.ReadAllBytes(image));
                        image = $"data:image/{extension};base64,{image}";
                    }
                    else
                    {
                        image = Convert.ToBase64String(System.IO.File.ReadAllBytes(_hostEnvironment.ContentRootPath + "/Images/NoImage.jpg"));
                        image = $"data:image/jpg;base64,{image}";
                    }
                }
                product.Image = image;
                product.Price = Convert.ToDecimal(dataTable.Rows[0]["Price"]);
                response.statusCode = 200;
                response.statusMessage = "Data found";
                response.product = product;
            }
            else
            {
                response.statusCode = 400;
                response.statusMessage = $"{id} data found";
                response.product = null;
            }
            return response;
        }

        [HttpPost]
        [Route("AddToCart")]
        public Response AddToCart(Product product)
        {
            Response response = new Response();

            if(product.Id != null)
            {
                SqlConnection connection = new SqlConnection(_connectionString);
                var cartProduct = (ListOfCartProducts().listOfProducts != null) ? ListOfCartProducts().listOfProducts.Select(u=> u.Id) : null;
                if((cartProduct!= null) && cartProduct.Contains(product.Id))
                {
                    response.statusCode = 100;
                    response.statusMessage = $"Product already exists in cart";
                }
                else
                {
                    SqlCommand command = new SqlCommand($"INSERT INTO CART(ProductId) VALUES({product.Id})", connection);
                    //command.Parameters.AddWithValue("@Id", product.Id);
                    connection.Open();
                    int result = command.ExecuteNonQuery();
                    connection.Close();
                    if (result == 0)
                    {
                        response.statusCode = 100;
                        response.statusMessage = $"Error adding the items to cart";
                    }
                    else
                    {
                        response.statusCode = 200;
                        response.statusMessage = "Product Added to cart successfully";
                    }
                }
            }
            else
            {
                response.statusCode = 100;
                response.statusMessage = $"{product.Id} must be greater than 0";
            }
            return response;
        }

        [HttpGet]
        [Route("ListOfCartProducts")]
        public Response ListOfCartProducts()
        {
            Response response = new Response();
            List<Product> productsList = new List<Product>();
            SqlConnection connection = new SqlConnection(_connectionString);

            //SqlDataAdapter dataAdapter = new SqlDataAdapter("SELECT * FROM Products", connection);

            SqlCommand command = new SqlCommand("GetCartItems", connection);
            command.CommandType = CommandType.StoredProcedure;
            SqlDataAdapter dataAdapter = new SqlDataAdapter(command);

            DataTable dataTable = new DataTable();
            dataAdapter.Fill(dataTable);
            if (dataTable.Rows.Count > 0)
            {
                for (var i = 0; i < dataTable.Rows.Count; i++)
                {
                    Product product = new Product();
                    product.Id = Convert.ToInt32(dataTable.Rows[i]["Id"]);
                    product.Name = Convert.ToString(dataTable.Rows[i]["Name"]);
                    var image = Convert.ToString(dataTable.Rows[i]["Image"]);
                    if (System.IO.File.Exists(image))
                    {
                        var extension = Path.GetExtension(image).Split(".")[1];
                        image = Convert.ToBase64String(System.IO.File.ReadAllBytes(image));
                        image = $"data:image/{extension};base64,{image}";
                    }
                    else
                    {
                        image = Convert.ToBase64String(System.IO.File.ReadAllBytes(_hostEnvironment.ContentRootPath + "/Images/NoImage.jpg"));
                        image = $"data:image/jpg;base64,{image}";
                    }
                    product.Image = image;
                    product.Price = Convert.ToDecimal(dataTable.Rows[i]["Price"]);
                    productsList.Add(product);
                }
                response.statusCode = 200;
                response.statusMessage = "Data found";
                response.listOfProducts = productsList;
            }
            else
            {
                response.statusCode = 100;
                response.statusMessage = "No data found";
                response.listOfProducts = null;
            }
            return response;
        }

        [HttpDelete]
        [Route("DeleteCartProduct")]
        public Response DeleteCartProduct(int Id)
        {
            Response response = new Response();
            SqlConnection connection = new SqlConnection(_connectionString);
            SqlCommand command = new SqlCommand("DeleteCartProductById", connection);
            command.CommandType = CommandType.StoredProcedure;
            command.Parameters.AddWithValue("@Id", Id);
            connection.Open();
            int result = command.ExecuteNonQuery();
            connection.Close();
            if (result == 0)
            {
                response.statusCode = 400;
                response.statusMessage = $"Error deleting the product";
            }
            else
            {
                response.statusCode = 200;
                response.statusMessage = "Product Deleted Successfully";
                response.listOfProducts = ListOfCartProducts().listOfProducts;
            }
            return response;
        }


    }
}
