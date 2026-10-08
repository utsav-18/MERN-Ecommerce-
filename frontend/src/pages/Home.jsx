import { useNavigate } from "react-router";

export default function Home() {

    const navigate = useNavigate();

    return (
        <div className="flex flex-col min-h-screen justify-center items-center">

            <div className="flex items-center justify-center text-2xl text-fuchsia-600">
                <h1>Welcome to the Home Page</h1>
            </div>

            <div className="flex flex-row">
                <button
                    onClick={() => navigate("/signup")}
                    className="cursor-pointer bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition-colors mt-2"
                >
                    SignUp
                </button>

                <button
                    onClick={() => navigate("/login")}
                    className="cursor-pointer bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition-colors mt-2 ml-3.5 mr-3.5"
                >
                    LogIn
                </button>
            </div>

        </div>
    );
}