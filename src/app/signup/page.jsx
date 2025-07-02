"use client";

import { useState } from "react";
import Input from "@/app/components/Input";
import Button from "@/app/components/Button";
import { UtilConstant } from "../utils/UtilConstants";
import { apiRequest } from "../utils/api";
import { useRouter } from 'next/navigation';

export default function SignupPage() {
  const [form, setForm] = useState({ username: "", email: "", password: "",dob:"",name:"" });
  const [errors, setErrors] = useState({});
  const router = useRouter();

  const validate = () => {
    const newErrors = {};
    if (!form.username.trim()) newErrors.username = "Username is required";
    if (!form.email.trim()) newErrors.email = "Email is required";
    if (!form.password.trim()) newErrors.password = "Password is required";
    if(!form.dob.trim()) newErrors.dob = "Date of Birth is required";
    if(!form.name.trim()) newErrors.name = "Name is required";
    //pattern checks
    const passwordPattern =/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d])[A-Za-z\d\W]{8,}$/;
    if (!newErrors.password && !passwordPattern.test(form.password)) {
      newErrors.password = "Password must be at least 8 characters long, contain at least one uppercase letter, one lowercase letter, and one number.";
    }
   
    //pattern checks

    return newErrors;
  };

  const handleChange = (e) => {
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: "" });
    }
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async(e) => {
    e.preventDefault();
    const validationErrors = validate();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    const payload={
      username:form.username,
      password:form.password,
      name:form.name,
      dateOfBirth:form.dob,
      email:form.email
      
      
    }
    try {
      const data = await apiRequest({
        endpoint: UtilConstant.SIGN_UP,
        method: 'POST',
       
        body:payload
      });
      console.log(data, "I am data");
      if(data.hasError){
        const err={};
        err.username=data.error;
        setErrors(err);
        return;
      }
      else{
        //route here to login
        // router.push("/login");
      
        router.replace('/login', undefined, { shallow: true });
        // window.history.replaceState({ success: true }, '');
      }
      return { props: { data } };
    } catch (error) {
      console.log(error, "I am error");
      return { props: { error: error.message } };
    }
    // API logic here
  };

  return (
    <div className="signup-page">
      <div className="container">
        <div className="app-info">
          <span className="emoji">💬</span>
          <h2>Chat App</h2>
          <p className="tagline">Chat and make video calls instantly</p>
        </div>
        {/* <h1>Sign Up</h1> */}
        <form onSubmit={handleSubmit}>
        <Input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Name"
            err={errors.name}
          />
          <Input
            type="text"
            name="username"
            placeholder="Username"
            value={form.username}
            onChange={handleChange}
            err={errors.username}
          />
          <Input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            err={errors.email}
          />
          <Input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            err={errors.password}
          />
          <Input
            type="date"
            name="dob"
            value={form.dob}
            onChange={handleChange}
            placeholder="Date of Birth"
            err={errors.dob}
          />

          <Button type="submit">Sign Up</Button>
        </form>
      </div>
    </div>
  );
}
