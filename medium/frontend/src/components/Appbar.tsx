import { Avatar } from "./BlogCard"
import { Link } from "react-router-dom"
import { useEffect, useState } from "react"

export const Appbar = () => {
    const [userName, setUserName] = useState("Anonymous");

    useEffect(() => {
        // Try to get user name from localStorage or decode from JWT
        const token = localStorage.getItem("token");
        if (token) {
            try {
                // Simple JWT decode (in production, use a proper JWT library)
                const payload = JSON.parse(atob(token.split('.')[1]));
                setUserName(payload.name || "Anonymous");
            } catch (error) {
                console.error("Error decoding token:", error);
                setUserName("Anonymous");
            }
        }
    }, []);

    return <div className="border-b flex justify-between px-10 py-4">
        <Link to={'/blogs'} className="flex flex-col justify-center cursor-pointer">
                Medium
        </Link>
        <div>
            <Link to={`/publish`}>
                <button type="button" className="mr-4 text-white bg-green-700 hover:bg-green-800 focus:outline-none focus:ring-4 focus:ring-green-300 font-medium rounded-full text-sm px-5 py-2.5 text-center me-2 mb-2 ">New</button>
            </Link>

            <Avatar size={"big"} name={userName} />
        </div>
    </div>
}