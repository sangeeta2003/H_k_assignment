import { useBlog } from "../hooks"
import { FullBlog } from "../components/FullBlog"
import { Spinner } from "../components/Spinner"
import { useParams } from "react-router-dom"

export const Blog = () => {
    const { id } = useParams();
    const { loading, blog } = useBlog({ id: id || "" });

    console.log("Blog component - loading:", loading, "blog:", blog);

    if (loading) {
        return <div>
            <div className="flex justify-center items-center h-screen">
                <Spinner />
            </div>
        </div>
    }

    if (!blog) {
        console.log("Blog is null/undefined");
        return <div>
            <div className="flex justify-center items-center h-screen">
                <div>Blog not found</div>
            </div>
        </div>
    }

    console.log("About to render FullBlog with blog:", blog);
    return <FullBlog blog={blog} />
}
