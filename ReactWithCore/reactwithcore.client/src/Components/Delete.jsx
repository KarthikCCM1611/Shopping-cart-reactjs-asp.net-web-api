import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react'
import { Link, useParams } from 'react-router-dom';

const Delete = () => {
    const { id } = useParams();

    const [data, setData] = useState({
        id: 0,
        name: '',
        image: null,
        price: 0,
    });

    const [productFound, setProductFound] = useState(false);
    const goToCartRef = useRef();

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

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const DeleteProductURL = `https://localhost:5173/product/deleteproduct?id=${data.id}`;
            var result = await axios.delete(DeleteProductURL);
            console.log(result);
            alert(result.data.statusMessage);
            if (result.data.statusCode === 200) {
                goToCartRef.current.click();
            }
        } catch (error) {
            console.error('Error deleting data:', error);
        }
    };
    return (
        <div className='cartHeightStyle'>
            {
                productFound ? (
                    <>
                        <h2>Delete Product</h2>
                        <div className='row border m-3 p-3'>
                            <div className='col-md-8'>
                                <div className="container d-flex justify-content-center align-items-center vh-60">
                                    <form onSubmit={handleSubmit} className='w-75 p-4 rounded'>
                                        <input defaultValue={data.id} hidden />
                                        <div className="mb-3 d-flex row">
                                            <label htmlFor="name" className="col-md-3 form-label">Product Name: </label>
                                            <input
                                                type="text"
                                                className="col-md-9 form-control"
                                                id="name"
                                                name="name"
                                                value={data.name}
                                                disabled
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
                                                disabled
                                            />
                                        </div>
                                        <div className='d-flex justify-content-center row'>
                                            <Link to="/" ref={goToCartRef} className="btn btn-primary col-md-3 m-1">Back to Cart</Link>
                                            <button type="submit" className="btn btn-success col-md-3 m-1">Delete</button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                            <div className='col-md-3'>
                                <img src={data.image} alt={data.name} style={{ height: "250px", width: "250px" }} />
                            </div>
                        </div>
                    </>
                ) : <p className='text-center p-3 font-weight-bold'> Product Id = {id} is not found</p>
            }
        </div>
    )
}

export default Delete
