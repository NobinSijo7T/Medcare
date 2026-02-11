import React from 'react'
import allProductsData from "../Data/allProductsData";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";



// Components
import Product from "../components/Product";

//Actions
import { getProducts as listProducts } from "../redux/actions/productActions";


function DentalScreen() {

    const dispatch = useDispatch();

    const getProducts = useSelector((state) => state.getProducts);
    const { products, loading, error } = getProducts;
    useEffect(() => {
        dispatch(listProducts());

    }, [dispatch]);

    return (
        <div>
            <div className="homescreen">
                <div className="container text-center">
                    <h1 className="mt-3">{allProductsData[3].title}</h1>
                    <hr className="w-25 mx-auto" />
                </div>
                <div className="homescreen__products">
                    {loading ? (
                        <h2>Loading...</h2>
                    ) : error ? (
                        <h2>{error}</h2>
                    ) : (
                        products.map((product) => product.category === "Dental" && (
                            <Product
                                key={product._id}
                                imgsrc={product.imgsrc}
                                title={product.title}
                                unique_id={product.unique_id}
                                category={product.category}
                                price={product.price}
                                productId={product._id}
                            />
                        )
                        )
                    )}
                </div>
            </div>
        </div>
    )
}

export default DentalScreen
