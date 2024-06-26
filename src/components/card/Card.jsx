import React, { useContext, useEffect, useState } from "react";
import styles from "./card.module.css";
import axios from "axios";
import { PostContext } from "../../context/ContextApi";
import { Link } from "react-router-dom";
import CountUp from "react-countup";
import AOS from "aos";
import "aos/dist/aos.css";
import Checkbox from "@mui/material/Checkbox";
import FavoriteBorder from "@mui/icons-material/FavoriteBorder";
import Favorite from "@mui/icons-material/Favorite";
import { toast } from "react-toastify";
import { pink } from "@mui/material/colors";
import Spinner from "../spinner/Spinner";
import { RxCross2 } from "react-icons/rx";

const label = { inputProps: { "aria-label": "Checkbox demo" } };
const Card = () => {
  let [state, setState] = useState(null);
  const {
    store,
    setStore,
    wishlist,
    setWishlist,
    setItem,
    setWishListTrail,
    wishListTrail,
    count,
    setCount,
    Setsep,
    sep,
    filter,
  } = useContext(PostContext);
  // console.log(wishlist);

  useEffect(() => {
    AOS.init();
  }, []);

  // !Notification:
  let Notification = () => {
    toast.success(`Successfully Added to cart`);
  };

  // !fetching all data.
  useEffect(() => {
    let fetchData = async () => {
      let { data } = await axios.get("https://fakestoreapi.com/products");
      setState(data);
    };
    fetchData();
  }, []);

  // !seprate data:
  let fetchItem = async id => {
    let { data } = await axios.get(`https://fakestoreapi.com/products/${id}`);
    setItem(data);
  };

  // !wishlist:
  let handleOnChange = e => {
    let { value, checked } = e.target;
    if (checked) {
      setWishListTrail([...wishListTrail, Number.parseInt(value)]);
    } else {
      setWishListTrail(wishListTrail.filter(e => e != value));
    }
  };

  // !
  let verify = () => {
    if (!window.localStorage.getItem("userName")) {
      toast.success(`please login first`);
    }
  };

  // console.log(wishlist);

  return (
    <section id="cardBlock" className={styles.cardBlock}>
      <article>
        {state === null ? (
          <div className={styles.spinner}>
            <Spinner />
          </div>
        ) : (
          state.map((val, ind) => {
            if (val.title.toString().includes(filter)) {
              return (
                <div key={ind} data-aos="flip-left">
                  {window.localStorage.getItem("userName") ? (
                    <span className={styles.whishList}>
                      <Checkbox
                        value={val.id}
                        onChange={handleOnChange}
                        onClick={ef => {
                          if (ef.target.checked) {
                            setWishlist([...wishlist, val]);
                            toast.success(`Successfully Added to wishlist`);
                          }
                        }}
                        {...label}
                        icon={<FavoriteBorder />}
                        checkedIcon={<Favorite />}
                        sx={{
                          color: "gray",
                          "&.Mui-checked": {
                            color: pink[600],
                          },
                        }}
                      />
                      {/* )} */}
                    </span>
                  ) : (
                    <Link
                      to="/login"
                      onClick={() => toast.success(`please login first`)}
                    >
                      <span className={styles.whishList}>
                        <Checkbox
                          value={val.id}
                          onChange={handleOnChange}
                          {...label}
                          icon={<FavoriteBorder />}
                          checkedIcon={<Favorite />}
                          sx={{
                            color: "gray",
                            "&.Mui-checked": {
                              color: pink[600],
                            },
                          }}
                        />
                      </span>
                    </Link>
                  )}
                  <Link to="/item" onClick={() => fetchItem(val.id)}>
                    <img src={val.image} alt="image1" />
                  </Link>
                  <p data-aos="zoom-in-up">{val.title.slice(0, 15)}</p>
                  <b data-aos="zoom-in-up">
                    ₹<CountUp end={val.price} duration={3} />
                  </b>
                  <span
                    data-aos="zoom-in-up"
                    style={{ color: "grey", marginLeft: "10px" }}
                  >
                    <strike>₹{val.rating.count}</strike>
                  </span>
                  <div data-aos="zoom-in-up">
                    <button className={styles.buyNow} onClick={verify}>
                      <Link
                        style={{ color: "#fff" }}
                        to={
                          window.localStorage.getItem("userName")
                            ? "/deliver"
                            : "/login"
                        }
                        state={val}
                      >
                        BUY NOW
                      </Link>
                    </button>
                    {window.localStorage.getItem("userName") ? (
                      store.filter(fg => fg.id === val.id).length === 1 ? (
                        <Link style={{ color: "#fff" }} to="/cart">
                          <button className={styles.goTocart}>
                            GO TO CART
                          </button>
                        </Link>
                      ) : (
                        <Link
                          to=""
                          onClick={() => {
                            setStore([...store, val]);
                            setCount([...count, { id: val.id, count: 1 }]);
                            Notification();
                            Setsep(!sep);
                          }}
                        >
                          <button className={styles.addTocart}>
                            ADD TO CART
                          </button>
                        </Link>
                      )
                    ) : (
                      <Link to="/login" onClick={verify}>
                        <button className={styles.addTocart}>
                          ADD TO CART
                        </button>
                      </Link>
                    )}
                  </div>
                </div>
              );
            }
          })
        )}
      </article>
    </section>
  );
};

export default Card;
