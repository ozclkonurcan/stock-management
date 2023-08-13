"use client";
import Header from "@/components/header";
import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";

export default function Home() {
  const [productForm, setProductForm] = useState({});
  const [productList, setProductList] = useState([]);
  const [alert, setAlert] = useState("");
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingAction, setLoadingAction] = useState(false);
  const [dropdown, setDropdown] = useState([]);

  const successAlert = (text) => {
    return (
      <motion.span
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -100, opacity: 0 }}
        className="bg-green-300 p-3 rounded-xl"
      >
        <i className="px-3 font-bold text-xl">👍</i>
        {text}
      </motion.span>
    );
  };

  useEffect(() => {
    const getProductList = async () => {
      const response = await fetch("/api/product");
      let respJson = await response.json();
      setProductList(respJson.products);
    };

    getProductList();
  }, [productForm, productList]);

  const buttonAction = async (action, productName, initialQuantity) => {
    // Immediately change the quantity of the product with given productName in productList ////
    let index = productList.findIndex(
      (item) => item.productName == productName
    );
    let newProducts = JSON.parse(JSON.stringify(productList));
    if (action == "increment") {
      newProducts[index].productQuantity = parseInt(initialQuantity) + 1;
    } else {
      newProducts[index].productQuantity = parseInt(initialQuantity) - 1;
    }
    setProductList(newProducts);

    // Immediately change the quantity of the product with given productName in Drowdown ////
    let indexDrop = dropdown.findIndex(
      (item) => item.productName == productName
    );
    let newDropdown = JSON.parse(JSON.stringify(dropdown));
    if (action == "increment") {
      newDropdown[indexDrop].productQuantity = parseInt(initialQuantity) + 1;
    } else {
      newDropdown[indexDrop].productQuantity = parseInt(initialQuantity) - 1;
    }
    setDropdown(newDropdown);

    setLoadingAction(true);
    const response = await fetch("/api/action", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action, productName, initialQuantity }),
    });
    let resp = await response.json();
    setLoadingAction(false);
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("/api/product", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(productForm),
      });

      if (response.ok) {
        console.log("Product added succefully");

        setAlert(successAlert("Your Product has been added !"));
        setTimeout(() => {
          setAlert("");
        }, 2000);
        setProductForm({});
      } else {
        console.log("Error adding product");
      }
    } catch (err) {
      console.log("Error :", err);
    }
  };

  const handleChange = (e) => {
    setProductForm({ ...productForm, [e.target.name]: e.target.value });
  };

  const onDropdownEdit = async (e) => {
    let value = e.target.value;
    setQuery(value);
    if (value.length > 3) {
      setLoading(true);
      setDropdown([]);
      const response = await fetch(`/api/search?query=${query}`);
      let respJson = await response.json();
      setDropdown(respJson.products);
      setLoading(false);
    } else {
      setDropdown([]);
    }
  };

  return (
    <>
      <Header />
      <div className="container mx-auto p-5">
        <AnimatePresence>
          {alert && (
            <motion.div
              className="text-center"
              initial={{ y: -100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -100, opacity: 0 }}
              key="alert-container"
            >
              {alert}
            </motion.div>
          )}
        </AnimatePresence>
        <h1 className="text-3xl font-semibold mb-4">Search Product</h1>
        <div className="mt-4 flex items-center space-x-4 mb-2">
          <input
            onChange={onDropdownEdit}
            type="text"
            placeholder="Search by product name"
            className="border p-2 w-full"
          />

          <select className="border p-2">
            <option value="name">Name</option>
            <option value="quantity">Quantity</option>
            <option value="price">Price</option>
          </select>
        </div>
        {loading && (
          <div className="flex justify-center items-center">
            <svg
              width="50"
              height="50"
              viewBox="0 0 50 50"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle
                cx="25"
                cy="25"
                r="20"
                fill="none"
                stroke="black"
                stroke-width="4"
                stroke-dasharray="100, 180"
              >
                <animateTransform
                  attributeName="transform"
                  type="rotate"
                  from="0 25 25"
                  to="360 25 25"
                  dur="2s"
                  repeatCount="indefinite"
                />
                <animate
                  attributeName="stroke-dashoffset"
                  attributeType="XML"
                  from="0"
                  to="-360"
                  dur="2s"
                  begin="0s"
                  repeatCount="indefinite"
                />
              </circle>
            </svg>
          </div>
        )}
        <div className="dropContainer absolute w-[83.8vw] border border-1 bg-purple-100 rounded-md">
          {dropdown.map((item) => {
            return (
              <div
                className="container flex justify-between my-1 p-2 border-b-2"
                key={item.productName}
              >
                <span className="">
                  {item.productName} ({item.productQuantity} available for ${" "}
                  {item.productPrice}){" "}
                </span>
                <div className="mx-5">
                  <button
                    onClick={() =>
                      buttonAction(
                        "decrement",
                        item.productName,
                        item.productQuantity
                      )
                    }
                    disabled={loadingAction}
                    className="subtract cursor-pointer inline-block px-3 py-1 bg-purple-500 text-white font-semibold rounded-lg shadow-md disabled:bg-purple-200"
                  >
                    -
                  </button>
                  <span className="quantity inline-block min-w-3 mx-3">
                    {item.productQuantity}
                  </span>
                  <button
                    onClick={() =>
                      buttonAction(
                        "increment",
                        item.productName,
                        item.productQuantity
                      )
                    }
                    disabled={loadingAction}
                    className="add cursor-pointer inline-block px-3 py-1 bg-purple-500 text-white font-semibold rounded-lg shadow-md disabled:bg-purple-200"
                  >
                    +
                  </button>
                </div>
              </div>
            );
          })}
        </div>
        <h1 className="text-3xl font-semibold mb-4">Add Product</h1>

        <div className="mt-4">
          <label className="block mb-2">Product Name:</label>
          <input
            value={productForm?.productName || ""}
            type="text"
            name="productName"
            className="border p-2 w-full"
            id="productName"
            onChange={handleChange}
          />

          <label className="block mt-2 mb-2">Quantity:</label>
          <input
            value={productForm?.productQuantity || ""}
            type="number"
            name="productQuantity"
            className="border p-2 w-full"
            id="productQuantity"
            onChange={handleChange}
          />

          <label className="block mt-2 mb-2">Price:</label>
          <input
            value={productForm?.productPrice || ""}
            type="text"
            name="productPrice"
            className="border p-2 w-full"
            id="productPrice"
            onChange={handleChange}
          />

          <button
            type="submit"
            className="bg-purple-500  hover:bg-purble-600 text-white px-4 py-2 rounded-lg my-2"
            onClick={handleAddProduct}
          >
            Add Product
          </button>
        </div>

        <div className="flex flex-col">
          <h1 className="mt-6 text-3xl font-semibold">
            Display Current Stock{" "}
          </h1>
          {productList <= 0 ? (
            <motion.div
              className="mt-6 mx-auto"
              initial={{ y: -100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -100, opacity: 0 }}
            >
              <span className="bg-red-300 p-3 rounded-xl">
                <i className="px-3 font-bold text-xl">😢</i>
                There are no products in stock
              </span>
            </motion.div>
          ) : (
            ""
          )}
        </div>

        <div className="mt-4 overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-300">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">
                  Product Name
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">
                  Quantity
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">
                  Price
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {productList.map((item) => (
                <tr key={item.name} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    {item.productName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {item.productQuantity}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    $ {item.productPrice}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
