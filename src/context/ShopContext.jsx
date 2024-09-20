import { createContext, useState } from "react";
import { products } from "../assets/assets";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

export const ShopContext = createContext();

function ShopContextProvider({ children }) {
  const currency = "$";
  const delivery_fee = 10;
  const [search, setSearch] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [cartItems, setCartItems] = useState({});
  const navigate = useNavigate();

  async function addToCart(itemId, size) {
    // This ToastNotification was called in our App.jsx pag at the top, that is why we can access it anywhere
    if (!size) {
      toast.error("Select Product Size");
      return;
    }
    // we will copy the object
    let cartData = structuredClone(cartItems); // deep copy
    // let cartData = { ...cartItems }; // shallow copy

    if (cartData[itemId]) {
      // check if that product has has size
      if (cartData[itemId][size]) {
        cartData[itemId][size] += 1;
      } else {
        cartData[itemId][size] = 1;
      }
    } else {
      // this creates an object base on the itemId
      cartData[itemId] = {};
      cartData[itemId][size] = 1;
    }

    setCartItems(cartData);
  }

  function getCartCount() {
    let totalCount = 0;
    for (const itemId in cartItems) {
      //   console.log("cartItems ", cartItems);
      for (const size in cartItems[itemId]) {
        // console.log("cartItem[items] ", cartItems[items]);
        // console.log("cartItem[items][item] ", cartItems[items][item]);
        try {
          if (cartItems[itemId][size] > 0) {
            totalCount += cartItems[itemId][size];
          }
        } catch (error) {
          console.log(error);
        }
      }
    }

    return totalCount;
  }

  async function updateQuantity(itemId, size, quantity) {
    let cartData = structuredClone(cartItems);

    cartData[itemId][size] = quantity;

    setCartItems(cartData);
  }

  function getCartAmount() {
    // we will get the total amount of the cart
    let totalAmount = 0;
    for (const itemsId in cartItems) {
      let itemInfo = products.find((product) => product._id === itemsId);
      for (const size in cartItems[itemsId]) {
        try {
          if (cartItems[itemsId][size] > 0) {
            // we will muliple the price by the quantity
            totalAmount += itemInfo.price * cartItems[itemsId][size];
          }
        } catch (err) {
          console.log(err);
        }
      }
    }

    return totalAmount;
  }

  const value = {
    products,
    currency,
    delivery_fee,
    search,
    setSearch,
    showSearch,
    setShowSearch,
    cartItems,
    addToCart,
    getCartCount,
    updateQuantity,
    getCartAmount,
    navigate
  };

  return <ShopContext.Provider value={value}>{children}</ShopContext.Provider>;
}

export default ShopContextProvider;
