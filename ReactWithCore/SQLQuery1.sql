--USE DATABASE ShoppingCartReact

CREATE TABLE Products(Id int PRIMARY KEY iDENTITY(1,1), Name VARCHAR(100), Image VARCHAR(100), Price DECIMAL(18,2));

SELECT * FROM Products

INSERT INTO Products(Name, Image, Price) VALUES('Test1', 'Test1.jpg', 300)
INSERT INTO Products(Name, Image, Price) VALUES('Test2', 'Test2.jpg', 250)
INSERT INTO Products(Name, Image, Price) VALUES('Test3', 'Test3.jpg', 400)
INSERT INTO Products(Name, Image, Price) VALUES('Test4', 'Test4.jpg', 700)
INSERT INTO Products(Name, Image, Price) VALUES('Test5', 'Test5.jpg', 200)

CREATE TABLE CART(Id int IDENTITY(1,1) PRIMARY KEY, ProductId int)

ALTER TABLE Products
ALTER COLUMN Image VARCHAR(200);

GO

CREATE PROCEDURE GetProducts
AS
    SELECT * FROM Products;
GO

CREATE PROCEDURE GetProductById @id int
AS
    SELECT * FROM Products WHERE Id =@id;
GO

CREATE PROCEDURE AddNewProduct @Name VARCHAR(100), @Image VARCHAR(100), @Price DECIMAL(18,2)
As
  INSERT INTO Products(Name,Image, Price) VALUES (@Name, @Image, @Price)
GO

ALTER PROCEDURE AddNewProduct
    @Name VARCHAR(100),
    @Image VARCHAR(200),  
    @Price DECIMAL(18,2)
AS
    INSERT INTO Products (Name, Image, Price)
    VALUES (@Name, @Image, @Price);
GO

CREATE PROCEDURE UpdateProduct @Id int,@Name VARCHAR(100), @Image VARCHAR(100), @Price DECIMAL(18,2)
As
  UPDATE Products SET Name = @Name, Image = @Image, Price = @Price WHERE Id=@Id
GO

ALTER PROCEDURE UpdateProduct @Id int,@Name VARCHAR(100), @Image VARCHAR(200), @Price DECIMAL(18,2)
As
  UPDATE Products SET Name = @Name, Image = @Image, Price = @Price WHERE Id=@Id
GO

CREATE PROCEDURE DeleteProduct @Id int
As
  DELETE FROM Products WHERE Id=@Id
GO

CREATE PROCEDURE GetCartItems
As
	SELECT P.Id, P.Name, P.Image, P.Price FROM CART C INNER JOIN Products P ON C.ProductId = P.Id
GO

CREATE PROCEDURE DeleteCartProduct @Id int
As
	DELETE FROM CART WHERE Id=@Id
GO

CREATE PROCEDURE DeleteCartProductById @Id int
As
	DELETE FROM CART WHERE ProductId=@Id
GO

EXEC GetProducts;

EXEC GetProductById @id = 3;

EXEC AddNewProduct @Name = 'Test6',@Image ='Test6.jpg',@Price = 125

EXEC UpdateProduct @Id=1004, @Name = 'Test81.jpg', @Image = 'Test81.jpg',@Price=325.6

EXEC DeleteProduct @Id=1004

EXEC GetCartItems

EXEC DeleteCartProduct @Id=1

EXEC sp_rename 'DeleteCartProduct', 'DeleteCartProductById';
DROP PROCEDURE DeleteCartProductById

EXEC DeleteCartProductById @Id=1006
