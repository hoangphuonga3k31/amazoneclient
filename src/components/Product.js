import { Button, Card, Badge } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import React, { useContext } from "react";
import axios from "axios";

import Rating from "./Rating";
import { Store } from "../store/Store";

function Product(props) {
  const navigate = useNavigate();
  const { product } = props;
  const { state, dispatch: ctxDispatch } = useContext(Store);

  const { cart } = state;

  const addToCartHandler = async (item) => {
    const existItem = cart.cartItems.find((x) => x._id === product._id);
    const quantity = existItem ? existItem.quantity + 1 : 1;
    const { data } = await axios.get(
      `https://amazoneserver.vercel.app/api/products/${product._id}`
    );

    if (data.countInStock < quantity) {
      window.alert("Sorry. This product is out of stock!");
      return;
    }
    ctxDispatch({
      type: "CART_ADD_ITEM",
      payload: { ...product, quantity },
    });
    navigate("/cart");
  };
  return (
    <Card>
      <Link to={`/product/${product.slug}`}>
        <img src={product.image} className="card-img-top" alt={product.name} />
      </Link>

      <Card.Body>
        <Link to={`/product/${product.slug}`}>
          <Card.Title>{product.name}</Card.Title>
        </Link>

        <Rating rating={product.rating} numReviews={product.numReviews} />

        <Card.Text>${product.price}</Card.Text>
        <Card.Text>
          {product.countInStock > 0 ? (
            <Badge bg="success">{product.countInStock} In Stock</Badge>
          ) : (
            <Badge bg="danger">Unavailable</Badge>
          )}
        </Card.Text>
        <Button
          onClick={() => addToCartHandler(product)}
          disabled={product.countInStock === 0}
          variant={product.countInStock ? "primary" : "light"}
        >
          Add to cart
        </Button>
      </Card.Body>
    </Card>
  );
}

export default Product;
