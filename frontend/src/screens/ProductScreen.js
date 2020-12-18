import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import {
  Row,
  Col,
  ListGroup,
  Card,
  Button,
  Form,
} from "react-bootstrap";
import Rating from "../components/Rating";
import Message from "../components/Message";
import Loader from "../components/Loader";
import Meta from "../components/Meta";
import CalendarReact from "react-calendar";
import "react-calendar/dist/Calendar.css";

import {
  listProductDetails,
  createProductReview,
} from "../actions/productActions";
import { PRODUCT_CREATE_REVIEW_RESET } from "../constants/productConstants";

const ProductScreen = ({ history, match }) => {
  const [qty, setQty] = useState(1);
  const [totalNights, setTotalNight] = useState(1);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  const { Calendar } = require("node-calendar-js");
  const dispatch = useDispatch();
  const productDetails = useSelector((state) => state.productDetails);
  const { loading, error, product } = productDetails;

  const orderDetails = useSelector((state) => state.orderDetails);
  const { order } = orderDetails;


  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const productReviewCreate = useSelector((state) => state.productReviewCreate);

  const [date, setDate] = useState(null);

  const [numDate, setNumDate] = useState(0);

  const {
    success: successProductReview,
    loading: loadingProductReview,
    error: errorProductReview,
  } = productReviewCreate;

  const calendar = new Calendar({
    year: 2020,
    month: 4,
  });
  calendar.create();

  useEffect(() => {
    if (successProductReview) {
      setRating(0);
      setComment("");
    }
    if (!product._id || product._id !== match.params.id) {
      dispatch(listProductDetails(match.params.id));
      dispatch({ type: PRODUCT_CREATE_REVIEW_RESET });
    }
  }, [dispatch, match, successProductReview]);

  const addToCartHandler = () => {
    history.push(`/cart/${match.params.id}?qty=${qty}`);
    history.push(`/cart/${match.params.id}?totalNights=${totalNights}`);
  };

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(
      createProductReview(match.params.id, {
        rating,
        comment,
      })
    );
  };

  const dateChange = (newDate) => {
    setDate(newDate);
  };

  const tileDisabled = () => {
    // if (date < new Date()) {
    //   return false;
    // }

    return false;
  };

    let totalNights1 = 0;
  
  
  if (date != null) {
     totalNights1 = Math.round(Math.abs((date[0] - date[1]) / (24 * 60 * 60 * 1000))) - 1;
    
    //totalCost = info.pricePerNight * totalNights
}

  return (
    <>
      <Link className="btn btn-light my-3" to="/">
        Quay Lại
      </Link>
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <>
          <Meta title={product.name} />
          <Row>
            <Col md={6}>
              <iframe
                width="620px"
                height="350px"
                frameBorder="0"
                src={product.image360}
              ></iframe>
            </Col>
            <Col md={3}>
              <ListGroup variant="flush">
                <ListGroup.Item>
                  <h3>{product.name}</h3>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Rating
                    value={product.rating}
                    text={`${product.numReviews} reviews`}
                  />
                </ListGroup.Item>
                <ListGroup.Item>Loại: {product.category}</ListGroup.Item>
                <ListGroup.Item>Địa Điểm: {product.brand}</ListGroup.Item>
                <ListGroup.Item>
                   Miêu tả: {product.description}
                </ListGroup.Item>
              </ListGroup>
            </Col>
            <Col md={3}>
              <Card>
                <ListGroup variant="flush">
                  <ListGroup.Item>
                    <Row>
                      <Col>Giá </Col>
                      <Col>
                        <strong>${product.price}</strong>
                      </Col>
                    </Row>
                  </ListGroup.Item>

                  <ListGroup.Item>
                    <Row>
                      <Col>Trạng Thái</Col>
                      <Col>
                        {product.countInStock > 0 ? "Còn Phòng" : "Hết Phòng"}
                      </Col>
                    </Row>
                  </ListGroup.Item>

                  {product.countInStock > 0 && (
                    <ListGroup.Item>
                      <Row>
                        <Col>Số phòng</Col>
                        <Col>
                          <Form.Control
                            as='select'
                            value={qty}
                            onChange={(e) => setQty(e.target.value)}
                          >
                            {[...Array(product.countInStock).keys()].map(
                              (x) => (
                                <option key={x + 1} value={x + 1}>
                                  {x + 1}
                                </option>
                              )
                            )}
                          </Form.Control>
                        </Col>
                      </Row>
                    </ListGroup.Item>
                  )}

                  <ListGroup.Item>
                    <Row>
                      <Col>Số Ngày</Col>
                      <Col>
                        {totalNights1}
                      </Col>

                    </Row>
                  </ListGroup.Item>

                  

                  <ListGroup.Item>
                    <Button
                      onClick={addToCartHandler}
                      className="btn-block"
                      type="button"
                      disabled={product.countInStock === 0}
                    >
                      Đặt Phòng
                    </Button>
                  </ListGroup.Item>
                </ListGroup>
              </Card>
            </Col>
          </Row>

          <Row>
            <Col md={6}>
              <h2>Đánh Giá</h2>
              {product.reviews.length === 0 && <Message>No Reviews</Message>}
              <ListGroup variant="flush">
                {product.reviews.map((review) => (
                  <ListGroup.Item key={review._id}>
                    <strong>{review.name}</strong>
                    <Rating value={review.rating} />
                    <p>{review.createdAt.substring(0, 10)}</p>
                    <p>{review.comment}</p>
                  </ListGroup.Item>
                ))}
                <ListGroup.Item>
                  <h2>Trãi Nghiệm Của Bạn Thế Nào? </h2>
                  {successProductReview && (
                    <Message variant="success">
                      Bạn đã đánh giá thành công!
                    </Message>
                  )}
                  {loadingProductReview && <Loader />}
                  {errorProductReview && (
                    <Message variant="danger">{errorProductReview}</Message>
                  )}
                  {userInfo ? (
                    <Form onSubmit={submitHandler}>
                      <Form.Group controlId="rating">
                        <Form.Label>Mức Độ Hài Lòng</Form.Label>
                        <Form.Control
                          as="select"
                          value={rating}
                          onChange={(e) => setRating(e.target.value)}
                        >
                          <option value="">Chọn...</option>
                          <option value="1">1 - Kém</option>
                          <option value="2">2 - Không Tốt</option>
                          <option value="3">3 - Tốt</option>
                          <option value="4">4 - Rất Tốt</option>
                          <option value="5">5 - Tuyệt Vời</option>
                        </Form.Control>
                      </Form.Group>
                      <Form.Group controlId="comment">
                        <Form.Label>Bình Luận</Form.Label>
                        <Form.Control
                          as="textarea"
                          row="3"
                          value={comment}
                          onChange={(e) => setComment(e.target.value)}
                        ></Form.Control>
                      </Form.Group>
                      <Button
                        disabled={loadingProductReview}
                        type="submit"
                        variant="primary"
                      >
                        Xác nhận
                      </Button>
                    </Form>
                  ) : (
                    <Message>
                      Please <Link to="/login">sign in</Link> to write a review{" "}
                    </Message>
                  )}
                </ListGroup.Item>
              </ListGroup>
            </Col>
            <Row>
            </Row>
            <Col md = {2}>
            </Col>
            <Col md = {4}>
            <ListGroup.Item>
                    <CalendarReact
                      onChange={e => setDate(e)}
                      minDate={new Date} // Không chọn ngày ở quá khứ
                      tileDisabled={tileDisabled}
                      selectRange // Chọn trong khoảng thời gian
                      value={date}
                    />
                  </ListGroup.Item>
            </Col>
          </Row>
        </>
      )}
    </>
  );
};

export default ProductScreen;
