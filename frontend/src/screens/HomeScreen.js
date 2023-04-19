import "./HomeScreen.css";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

// Components
import Product from "../components/Product";

//Actions
import {
  getProducts as listProducts,
  filterProducts,
  sortProducts,
} from "../redux/actions/productActions";

const HomeScreen = () => {
  const dispatch = useDispatch();

  const getProducts = useSelector((state) => state.getProducts);
  const { products, loading, error } = getProducts;

  const [category, setCategory] = useState("");
  const [sort, setSort] = useState("");

  useEffect(() => {
    dispatch(listProducts());
  }, [dispatch]);

  const handleFilter = (e) => {
    setCategory(e.target.value);
    dispatch(filterProducts(e.target.value));
  };

  const handleSort = (e) => {
    setSort(e.target.value);
    dispatch(sortProducts(e.target.value));
  };

  return (
    <div className="homescreen">
      <h2 className="homescreen__title">Latest Products</h2>
      <div className="homescreen__filters">
        <select value={category} onChange={handleFilter}>
          <option value="">All</option>
          <option value="electronics">Camera</option>
          <option value="fashion">Bluetooth Speaker</option>
          <option value="sports">Mobile</option>
          <option value="gaming">Gaming</option>
        </select>
        <select value={sort} onChange={handleSort}>
          <option value="">Latest</option>
          <option value="lowest">Price: Low to High</option>
          <option value="highest">Price: High to Low</option>
        </select>
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
              name={product.name}
              description={product.description}
              price={product.price}
              imageUrl={product.imageUrl}
              productId={product._id}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default HomeScreen;
