import './App.css';
import Cart from './Components/Cart';
import { Route, Routes } from 'react-router-dom';
import WeatherForecasts from './Components/WeatherForecasts';
import Nav from './Components/Nav';
import AddNewProduct from './Components/AddNewProduct';
import ViewCart from './Components/ViewCart';
import Edit from './Components/Edit';
import Delete from './Components/Delete';
import NotFound from './Components/NotFound';

function App() {
    return (
        <>
            <Nav />
            <div className='cardBgStyle'>
                <Routes>
                    <Route path="/" index element={<Cart />} />
                    <Route path="/cart" index element={<Cart />} />
                    <Route path="/cart/addnewproduct" element={<AddNewProduct />} />
                    <Route path="/cart/ViewCart" element={<ViewCart />} />
                    <Route path="/cart/editcart/:id" element={<Edit />} />
                    <Route path="/cart/deletecart/:id" element={<Delete />} />
                    <Route path="/weatherforecasts" element={<WeatherForecasts />} />
                    <Route path='*' element={<NotFound />}/>
                </Routes>
            </div>
        </>
    );
}

export default App;