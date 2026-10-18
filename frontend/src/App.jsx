import {createBrowserRouter , RouterProvider, Outlet } from "react-router";
import Home from "./pages/Home.jsx";
import Login from "./pages/Login.jsx";
import Signup from "./pages/Signup.jsx";
import ProductDetails from "./pages/ProductDetails.jsx";
import AddProduct from "./admin/AddProduct.jsx";    
import EditProduct from "./admin/EditProduct.jsx";
import ProductList from "./admin/ProductList.jsx";
import Navbar from "./components/Navbar.jsx";
import Cart from './pages/Cart.jsx';


function Layout(){
    return(
        <>
        <Navbar/>
        <Outlet/>
        </>
    )
}


const router = createBrowserRouter([
    {
        element : <Layout/>,
        children : [
            {path: "/", element: <Home/>},
            {path: "/login", element: <Login/>},
            {path: "/signup", element: <Signup/>},
            {path: "/product/:id", element: <ProductDetails/>},
            { path: "/cart", element: <Cart /> },
            {path: "/admin/products", element: <ProductList/>},
            {path: "/admin/products/add", element : <AddProduct/>},
            {path: "/admin/products/update/:id",element : <EditProduct/>},
        ],
    }
]);

export default function App(){
    return <RouterProvider router={router}/>;
}