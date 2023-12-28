import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';

const Cart = () => {
    const [data, setData] = useState([]);

    useEffect(() => {
        const ListOfProductsURL = "https://localhost:5173/product/listofproducts";
        axios.get(ListOfProductsURL)
            .then(result => {
                setData(result.data.listOfProducts);
            })
            .catch(error => console.log(error));
    }, [])

    const handleAddToCart = (id) => {
        console.log(id);
        var data = {
            Id: id
        }
        const AddToCartURL = "https://localhost:5173/product/addtocart";
        axios.post(AddToCartURL, data)
            .then(result => {
                alert(result.data.statusMessage);
            })
            .catch(error => console.log(error));
    }

    return (
        <>
            <div>
                <h2 className='text-uppercase pt-2'>Shopping Cart</h2>
                <div className='row mb-3'>
                    <div className='col-8 offset-3 d-flex justify-content-between align-items-center'>
                        <div></div>
                        <Link to="/cart/addNewProduct" className='btn-dark text-decoration-none'>
                            Add New Product
                        </Link>
                    </div>
                </div>
                <div className="row m-3">
                    {
                        data && data.length > 0 && (
                            data.map((item, index) => {
                                return (
                                    <div className="card border-primary m-2" style={{ width: "22rem" }} key={index}>
                                        <h4 className="card-title">{item.name}</h4>
                                        <img className='card-img-top' src={item.image} alt={item.name} style={{ height: "450px" }} />
                                        <div className='card-text'>
                                            <p> <b>Price: </b>{item.price}</p>
                                        </div>
                                        <div className='card-footer'>
                                            <div className='row m-1'>
                                                <Link to={`/cart/editcart/`+item.id}  className='btn-warning p-2 m-1 text-decoration-none col-md-5'>Edit</Link>
                                                <Link to={`/cart/deletecart/`+item.id} className='btn-danger p-2 m-1 text-decoration-none col-md-5'>Delete</Link>
                                            </div>
                                            <button onClick={() => handleAddToCart(item.id)} className='btn-success w-100 p-2'>Add to Cart</button>
                                        </div>
                                    </div>
                                )
                            })
                        )
                    }
                </div>
                {
                    data && data.length === 0 && <p className='text-center p-3'>No items in cart</p>
                }
                <div className='pb-3 mt-3'>
                    <Link to="/cart/viewcart" className='text-decoration-none btn-dark'>
                        View Cart
                    </Link>
                </div>
            </div>
        </>
    )
}

export default Cart
