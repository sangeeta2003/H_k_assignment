import { useState, type ChangeEvent } from "react"
import { Link, useNavigate } from "react-router-dom"
import type { SignupInput } from "@sangeeta_/medium-common"
import { BACKEND_URL } from "../config"
import axios from "axios"

export const Auth = ({ type }: { type: "signup" | "signin" }) => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState<Partial<SignupInput>>({
    name: "",
    email: "",
    password: ""
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement>, field: keyof SignupInput) => {
    setFormData({ ...formData, [field]: e.target.value });
  };

  const sendRequest = async () => {
    try {
      const response = await axios.post(
        `${BACKEND_URL}/api/v1/user/${type}`,
        formData
      );

      const jwt = response.data.jwt; 
      localStorage.setItem("token", jwt);
      navigate("/blogs");
    } catch (e) {
    //   alert("Error: " + e.response?.data?.error || e.message);
      console.log(e);
    }
  };

  return (
    <div className="h-screen flex justify-center items-center">
      <div className="w-full max-w-md p-8 border rounded shadow">
        <h1 className="text-2xl font-bold mb-4">
          {type === "signup" ? "Sign Up" : "Sign In"}
        </h1>
        {type === "signup" && (
          <LabelledInput
            label="Name"
            placeholder="Sangeeta M"
            value={formData.name || ""}
            onChange={(e) => handleChange(e, "name")}
          />
        )}
        <LabelledInput
          label="Email"
          placeholder="sangeeta@example.com"
          value={formData.email || ""}
          onChange={(e) => handleChange(e, "email")}
        />
        <LabelledInput
          label="Password"
          type="password"
          placeholder="******"
          value={formData.password || ""}
          onChange={(e) => handleChange(e, "password")}
        />

        <button
          onClick={sendRequest}
          className="mt-6 w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          {type === "signup" ? "Sign Up" : "Sign In"}
        </button>

        <div className="mt-4 text-center text-sm text-gray-600">
          {type === "signin" ? "Don't have an account?" : "Already have an account?"}{" "}
          <Link
            to={type === "signin" ? "/signup" : "/signin"}
            className="underline text-blue-600"
          >
            {type === "signin" ? "Sign up" : "Sign in"}
          </Link>
        </div>
      </div>
    </div>
  );
};

interface LabelledInputProps {
  label: string;
  placeholder: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  type?: string;
}

function LabelledInput({ label, placeholder, value, onChange, type }: LabelledInputProps) {
  return (
    <div className="mb-4">
      <label className="block mb-2 font-semibold">{label}</label>
      <input
        type={type || "text"}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full p-2 border rounded focus:ring-blue-500 focus:border-blue-500"
        required
      />
    </div>
  );
}
