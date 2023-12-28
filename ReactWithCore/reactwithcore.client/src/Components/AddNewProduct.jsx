import axios from 'axios';
import React, { useRef, useState } from 'react'
import { Link } from 'react-router-dom';

const AddNewProduct = () => {
    const [data, setData] = useState({
        name: '',
        image: null,
        price: 0,
    });

    const goToCartRef = useRef();

    const handleInputChange = (e) => {
        const { name, value, type } = e.target;
        setData({
            ...data,
            [name]: type === 'file' ? e.target.files[0] : value,
        });
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('file', data.image);
        try {
            const UploadImageURL = "https://localhost:5173/product/uploadfile";
            const AddNewProductURL = "https://localhost:5173/product/addnewproduct";
            var imageResult = await axios.post(UploadImageURL,formData);
            data.image = imageResult.data.imageUrl;
            var result = await axios.post(AddNewProductURL, data); 
            console.log(result);
            alert(result.data.statusMessage);
            if(result.data.statusCode === 200){
                goToCartRef.current.click()
            }
        } catch (error) {
            console.error('Error uploading file:', error);
        }
    };
    return (
        <>
            <div className='cartHeightStyle'>
                <h2>Add New Product</h2>
                <div className="container d-flex justify-content-center align-items-center vh-60">
                    <form onSubmit={handleSubmit} className='w-75 border p-4 rounded'>
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
                                required
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
                            <button type="submit" className="btn btn-success col-md-3 m-1">Submit</button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    )
}

export default AddNewProduct
