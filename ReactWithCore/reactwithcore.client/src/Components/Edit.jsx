import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react'
import { Link, useParams } from 'react-router-dom';

const Edit = () => {
    const { id } = useParams();
    const [data, setData] = useState({
        id: 0,
        name: '',
        image: null,
        price: 0,
    });

    const [productFound, setProductFound] = useState(false);
    const goToCartRef = useRef();
    const imageRef = useRef();

    useEffect(() => {
        const ListOfProductsURL = `https://localhost:5173/product/GetProductById?id=${id}`;
        axios(ListOfProductsURL)
            .then(result => {
                if (result.data.statusCode === 200) {
                    setProductFound(true);
                    setData(result.data.product);
                }
            })
            .catch(error => console.log(error));
    }, [])
    const handleInputChange = (e) => {
        const { name, value, type } = e.target;
        setData({
            ...data,
            [name]: type === 'file' ? e.target.files[0] : value,
        });
        if (type === "file") {
            const reader = new FileReader();
            reader.onload = function (e) {
                imageRef.current.src = e.target.result;
            };
+            reader.readAsDataURL(e.target.files[0]);
        }
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log('Form submitted:', data);
        const formData = new FormData();
        formData.append('file', data.image);
        try {
            const UploadImageURL = `https://localhost:5173/product/uploadfile?id=${data.id}`;
            const UpdateProductURL = "https://localhost:5173/product/updateproduct";
            if(data.image.name){
                var imageResult = await axios.post(UploadImageURL, formData);
                data.image = imageResult.data.imageUrl;                
            }
            var result = await axios.put(UpdateProductURL, data);
            alert(result.data.statusMessage);
            if (result.data.statusCode === 200) {
                goToCartRef.current.click();
            }
        } catch (error) {
            console.error('Error updating the data', error);
        }
    };
    return (
        <div className='cartHeightStyle'>
            {
                productFound ? (
                    <>
                        <h2>Edit Product</h2>
                        <div className='row border m-3 p-3'>
                            <div className='col-md-8'>
                                <div className="container d-flex justify-content-center align-items-center vh-60">
                                    <form onSubmit={handleSubmit} className='w-75 p-4 rounded'>
                                        <input defaultValue={data.id} hidden/>
                                        <div className="mb-3 d-flex row">
                                            <label htmlFor="name" className="col-md-3 form-label">Product Name: </label>
                                            <input
                                                type="text"
                                                className="col-md-9 form-control"
                                                id="name"
                                                name="name"
                                                value={data.name}
                                                onChange={handleInputChange}
                                                required
                                            />
                                        </div>
                                        <div className="mb-3 d-flex row">
                                            <label htmlFor="image" className="form-label col-md-3">Product Image: </label>
                                            <input
                                                type="file"
                                                accept='.png, .jpg, .jpeg'
                                                className="form-control col-md-9"
                                                id="image"
                                                name="image"
                                                onChange={handleInputChange}
                                            />
                                        </div>
                                        <div className="mb-3 d-flex row">
                                            <label htmlFor="price" className="form-label col-md-3">Price</label>
                                            <input
                                                type="number"
                                                className="form-control col-md-9"
                                                id="price"
                                                name="price"
                                                value={data.price}
                                                onChange={handleInputChange}
                                                required
                                            />
                                        </div>
                                        <div className='d-flex justify-content-center row'>
                                            <Link to="/" ref={goToCartRef} className="btn btn-primary col-md-3 m-1">Back to Cart</Link>
                                            <button type="submit" className="btn btn-success col-md-3 m-1">Update</button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                            <div className='col-md-3'>
                                <img ref={imageRef} src={data.image} alt={data.name} style={{ height: "250px", width: "250px" }} />
                            </div>
                        </div>
                    </>
                ) : <p className='text-center p-3 font-weight-bold'> Product Id = {id} is not found</p>
            }
        </div>

    )
}

export default Edit
