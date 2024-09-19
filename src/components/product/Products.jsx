import React, { useState } from 'react';
import { useGetProductsQuery } from '../../redux/api/productsApi';
import { Link } from 'react-router-dom';
import { FaShoppingCart, FaHeart } from 'react-icons/fa'; 
import './Products.css';

const Products = () => {
    const { data } = useGetProductsQuery();
    const [cart, setCart] = useState([]);
    const [likedProducts, setLikedProducts] = useState([]); 
    const [searchTerm, setSearchTerm] = useState('');
    const [suggestions, setSuggestions] = useState([]);

    const addToCart = (product) => {
        setCart((prevCart) => [...prevCart, product]);
    };

    const removeFromCart = (productId) => {
        setCart((prevCart) => prevCart.filter(product => product._id !== productId));
    };

   
    const toggleLike = (product) => {
        if (likedProducts.some(p => p._id === product._id)) {
            setLikedProducts(likedProducts.filter(p => p._id !== product._id));
        } else {
            setLikedProducts([...likedProducts, product]);
        }
    };

    const filteredProducts = data?.payload?.filter(product =>
        product.product_name.toLowerCase().includes(searchTerm.toLowerCase())
    ) || [];

    const handleSearchChange = (e) => {
        const input = e.target.value;
        setSearchTerm(input);

        if (input) {
            const newSuggestions = data?.payload?.filter(product =>
                product.product_name.toLowerCase().startsWith(input.toLowerCase())
            ).map(product => product.product_name);
            setSuggestions(newSuggestions);
        } else {
            setSuggestions([]);
        }
    };

    const handleSuggestionClick = (suggestion) => {
        setSearchTerm(suggestion);
        setSuggestions([]);
    };

    return (
        <div className="products-container">
           
            <div className="cart-icon">
                <FaShoppingCart size={40} />
                <span className="cart-count">{cart.length}</span>
            </div>

            
            <div className="liked-products-icon">
                <FaHeart className='liked-icon' size={40}  color={likedProducts.length > 0 ? 'red' : 'gray'} />
                <span className="liked-count">{likedProducts.length}</span>
            </div>

            
            <div className="cart-table-container">
                {cart.length > 0 ? (
                    <table className="cart-table">
                        <thead>
                            <tr>
                                <th>Product</th>
                                <th>Price</th>
                                <th>Category</th>
                                <th>Remove</th>
                            </tr>
                        </thead>
                        <tbody>
                            {cart.map(product => (
                                <tr key={product._id}>
                                    <td>{product.product_name}</td>
                                    <td>${product.sale_price}</td>
                                    <td>{product.category}</td>
                                    <td>
                                        <button
                                            className="delete-btn"
                                            onClick={() => removeFromCart(product._id)}
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <p>Your cart is empty</p>
                )}
            </div>

         
            <div className="liked-products-table-container">
                {likedProducts.length > 0 ? (
                    <table className="liked-products-table">
                        <thead>
                            <tr>
                                <th>Product</th>
                                <th>Price</th>
                                <th>Category</th>
                            </tr>
                        </thead>
                        <tbody>
                            {likedProducts.map(product => (
                                <tr key={product._id}>
                                    <td>{product.product_name}</td>
                                    <td>${product.sale_price}</td>
                                    <td>{product.category}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <p>No liked products yet</p>
                )}
            </div>

           
            <div className="search-container">
                <input
                    type="text"
                    placeholder="Search for products..."
                    value={searchTerm}
                    onChange={handleSearchChange}
                    className="search-input"
                />
                {searchTerm && (
                    <ul className={`suggestions-list ${suggestions.length > 0 ? 'show' : ''}`}>
                        {suggestions.map((suggestion, index) => (
                            <li key={index} onClick={() => handleSuggestionClick(suggestion)}>
                                {suggestion}
                            </li>
                        ))}
                    </ul>
                )}
            </div>

          
            <div className="products-list">
                {filteredProducts.length > 0 ? (
                    filteredProducts.map(product => (
                        <div className="product-card" key={product._id}>
                            <Link to={`/product/${product._id}`}>
                                <img className="product-image" src={product.product_images[0]} alt={product.product_name} />
                            </Link>
                            <h2 className="product-name">{product.product_name}</h2>
                            <p className="product-price">${product.sale_price}</p>
                            <p className="product-category">{product.category}</p>
                            <p className="product-rating">Rating: {product.rating}</p>

                            
                            <button
                                className={`like-btn ${likedProducts.some(p => p._id === product._id) ? 'liked' : ''}`}
                                onClick={() => toggleLike(product)}
                            >
                                {likedProducts.some(p => p._id === product._id) ? '♥' : '♡'}
                            </button>

                          
                            {likedProducts.some(p => p._id === product._id) && (
                                <p className="liked-label">Liked Product</p>
                            )}

                           
                            <button className="add-to-cart-btn" onClick={() => addToCart(product)}>
                                Add to Cart
                            </button>
                        </div>
                    ))
                ) : (
                    <p>No products found</p>
                )}
            </div>
        </div>
    );
};

export default Products;
