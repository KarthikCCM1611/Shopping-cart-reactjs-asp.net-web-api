import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';

const ViewCart = () => {
    const [data, setData] = useState([]);

    useEffect(() => {
        axios.get('https://localhost:5173/product/listofcartproducts')
            .then(result => {
                setData(result.data.listOfProducts);
            })
            .catch(error => console.log(error));
    }, [])

    const handleDeleteCart = (id) => {
        console.log(id)
        var data = {
            Id: id
        }
        axios.delete('https://localhost:5173/product/deletecartproduct?Id=' + id)
            .then(result => {
                alert(result.data.statusMessage);
                setData(result.data.listOfProducts);
            })
            .catch(error => console.log(error));
    }

    return (
        <>
            <div>
                <h2 className='text-uppercase pt-2'>Cart Items</h2>
                <div className="row m-3">
                    {
                        data && data.length > 0 && (
                            data.map((item, index) => {
                                return (
                                    <div className="card border-primary m-2 cardHeight" style={{ width: "22rem" }} key={index}>
                                        <h4 className='card-title'>{item.name}</h4>
                                        <img className='card-img-top' src={item.image} alt={item.name} style={{ height: "400px" }} />
                                        <div className='card-text text-center'>
                                            <p> <b>Price: </b>{item.price} </p> 
                                        </div>
                                        <div className='card-footer'>
                                            <button onClick={() => handleDeleteCart(item.id)} className='btn-warning w-100 p-2'>Remove Item</button>
                                        </div>
                                    </div>
                                )
                            })
                        )
                    }
                </div>
                {
                    (data === null || data && data.length === 0) && <p className='text-center font-weight-bold p-3'>Cart is empty</p>

                }
                <div className='pb-3'>
                    <Link to="/" className='btn-dark text-decoration-none'>
                        Back to Cart
                    </Link>
                </div>
            </div>
        </>
    )
}

export default ViewCart
