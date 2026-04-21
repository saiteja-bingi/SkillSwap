import {useState} from "react";
import {useNavigate} from "react-router-dom";
import api from "../services/api"

function Login(){
    const navigate=useNavigate();

    const [formData,setFormData]=useState({
        email:"",
        password:"",
    });

    const [error,setError]=useState("");

    function handleChange(e){
        setFormData({
            ...formData,
            [e.target.name]:e.target.value,
        });
    }

    async function handleSubmit(e){
        e.preventDefault();
        try{
            const response=await api.post("/auth/login",formData);
            localStorage.setItem("token",response.data.token);
            navigate("/dashboard");
        }catch(err){
            setError("Invalid email or password");
        }
    }

    return(
        <div style={{padding:"30px"}}>
            <h1>Login</h1>
            <form onSubmit={handleSubmit}>
                <input
                type="email"
                name="email"
                placeholder="Enter Email"
                value={formData.email}
                onChange={handleChange}
                />
                <br/>
                <input
                type="password"
                name="password"
                placeholder="Enter Password"
                value={formData.password}
                onChange={handleChange}
                />
                <br/>
                <button type="submit">Login</button>
            </form>
            <p style={{color:"red"}}>{error}</p>
        </div>
    )
}

export default Login;