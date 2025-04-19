"use client";
import { useState,useEffect } from "react";
import Input from "@/app/components/Input";
import Button from "@/app/components/Button";
import { UtilConstant } from '../utils/UtilConstants';
import { apiRequest } from "../utils/api";
import { useRouter } from 'next/navigation';


export default function LoginPage() {
  const [form, setForm] = useState({ username: "", password: "" });
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState({});
  const router=useRouter();

  const validate = () => {
    const newErrors = {};
    if (!form.username.trim()) newErrors.username = "Username is required";
   
    if (!form.password.trim()) newErrors.password = "Password is required";

    return newErrors;
  };
  useEffect(() => {
    const state = window.history.state;
    if (state?.success) {
      setMessage("Successfully created account");

      const timer = setTimeout(() => {
        setMessage('');
        // Optionally remove state after showing message
        window.history.replaceState({}, '');
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, []);

  const handleChange = (e) => {
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: "" });
    }
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async(e) => {
    e.preventDefault();
   const validationErrors= validate();
   if (Object.keys(validationErrors).length > 0) {
    setErrors(validationErrors);
    return;
  }
  setErrors({});

  const payload={
    username:form.username,
    password:form.password
  }
  try {
        const data = await apiRequest({
          endpoint: UtilConstant.LOGIN,
          method: 'POST',
         body:payload
        });
       
        if(data.hasError){
          const err={};
          err.db=data.error;
          setErrors(err);
          return;
        }
        else{
         
          router.replace('/');
        }
       
      } catch (error) {
        console.log(error, "I am error");
       
      }
    console.log("Login:", form);
    // API logic here
  };

  return (
    <div className="login-page">
    <div className="container">
      <div className="app-info">
        <span className="emoji">💬</span>
        <h2>Chat App</h2>
        <p className="tagline">Chat and make video calls instantly</p>
      </div>

      {/* <h1>Login</h1> */}
      {errors.db && <div className="error-message">{errors.db}</div>}
      {message && <div className="info-message">{message}</div>}
      <form onSubmit={handleSubmit}>
        <Input
          type="text"
          name="username"
          placeholder="Username"
          value={form.username}
          onChange={handleChange}
          err={errors.username}
          />
        <Input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          err={errors.password}
        />
        <Button type="submit">Login</Button>
      </form>
    </div>
    </div>
  );
}
