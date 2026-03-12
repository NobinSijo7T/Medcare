import React, { useEffect } from 'react';
import { useDispatch, useSelector } from "react-redux";
import Product from "../components/Product";
import { getProducts as listProducts } from "../redux/actions/productActions";
import "../styles/HomeScreen.css";

function AllProductsScreen() {
    const dispatch = useDispatch();

    const getProducts = useSelector((state) => state.getProducts);
    const { products, loading, error } = getProducts;

    useEffect(() => {
        dispatch(listProducts());
    }, [dispatch]);

    return (
        <div className="homescreen">
            <div className="container text-center">
                <h1 className="mt-3">All Products</h1>
                <hr className="w-25 mx-auto" />
            </div>
            <div className="homescreen__products">
                {loading ? (
                    <h2>Loading...</h2>
                ) : error ? (
                    <h2>{error}</h2>
                ) : (
                    products.map((product) => (
                        <Product
                            key={product._id}
                            imgsrc={product.imgsrc}
                            title={product.title}
                            unique_id={product.unique_id}
                            category={product.category}
                            price={product.price}
                            productId={product._id}
                        />
                    ))
                )}
            </div>
        </div>
    )
}

export default AllProductsScreen;