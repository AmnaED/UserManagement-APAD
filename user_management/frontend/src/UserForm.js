import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function UserForm({ isNewUser, defaultMessage, buttonMessage }) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    user_id: "",
    name: "",
    password: "",
  });

  function handleInputChange(event) {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    try {
      if (isNewUser) {
        // POST new user to backend
        const res = await fetch("http://localhost:5001/api/users", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });

        if (!res.ok) throw new Error("Failed to create user");

        const data = await res.json();
        alert(`New user created: ${data.name} (${data.user_id})`);
        setFormData({ user_id: "", name: "", password: "" });
        navigate(`/users/${data.user_id}/projects`);
      } else {
        // POST login to backend
        const res = await fetch("http://localhost:5001/api/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });

        if (!res.ok) throw new Error("Invalid credentials");

        const data = await res.json();
        alert(`User logged in: ${data.user_id}`);
        setFormData({ user_id: "", name: "", password: "" });
        navigate(`/users/${data.user_id}/projects`);
      }
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <h2>{defaultMessage}</h2>

      {isNewUser && (
        <>
          <label>
            Name:
            <input
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Enter your name"
            />
          </label>
          <br />
        </>
      )}

      <label>
        User ID:
        <input
          name="user_id"
          value={formData.user_id}
          onChange={handleInputChange}
          placeholder="Enter your user ID"
        />
      </label>
      <br />

      <label>
        Password:
        <input
          name="password"
          type="password"
          value={formData.password}
          onChange={handleInputChange}
          placeholder="Enter your password"
        />
      </label>
      <br />

      <button type="submit">{buttonMessage}</button>
    </form>
  );
}

export default UserForm;



/**import React, {useState} from "react";
import { useNavigate } from 'react-router-dom';

function UserForm(props) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    user_id: '',
    name: '',
    password: '',
  });

  function handleInputChange(event) {
    const { name, value } = event.target;

    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
 }

  async function handleSubmit(event) {
    event.preventDefault();
    console.log("Form Submitted", formData);
    if (props.isNewUser) {

      try {
        const response = await fetch("http://127.0.0.1:5000/users",{
        method: "POST",
        headers: {"Content-Type" : "application/json"},
        credentials: "include",
        body: JSON.stringify(formData)
        
        });
        const data = await response.json();
        console.log("Data recieved from Flask", data)

        if (response.ok) {
          const loginResponse = await fetch ("http://127.0.0.1:5000/login", {
            method: "POST",
            headers: {"Content-Type" : "application/json"},
            body: JSON.stringify({user_id: formData.user_id, password: formData.password}),
          });
          const loginData = await loginResponse.json();
          if (loginResponse.ok) {
            alert("Signup and login successful");
            setFormData({ user_id: '', name: '', password: '' });
            navigate(`/users/${formData.user_id}/projects`);
          } else {
            alert(loginData.error)
            navigate("/")
          }
          
        } else {
          alert(data.error)
        }
      } catch (error) {
        console.error("Error submitting form:", error);
        alert("An error occurred. Please try again.");
      }
    } else {
      try {
      const response = await fetch(`http://127.0.0.1:5000/login`, {
        method: "POST", 
        headers: {"Content-Type" : "application/json"},
        credentials: "include",
        body: JSON.stringify({user_id: formData.user_id, password: formData.password}),
      });
      const data = await response.json();
      if (response.ok) {
        alert("Login Success");
        setFormData({ user_id: '', name: '', password: '' });
        navigate(`/users/${formData.user_id}/projects`);
      } else {
        alert(data.error)
      }
    } catch (error) {
      alert("Login Error")
    }
  }
}
return (

    <form onSubmit={handleSubmit}>
        <h2>{props.defaultMessage}</h2>
         {props.isNewUser && (
            <>
            <label>
                Name: 
                <input name = "name" value = {formData.name} onChange =  {handleInputChange}/>
            </label>
            <br />
            </>
        )}
        <label>
            User ID:
            <input name = "user_id" value = {formData.user_id} onChange = {handleInputChange}/>
        </label>
        <br />
        <label>
            Password:
            <input name = "password" type = "text" value = {formData.password} onChange = {handleInputChange}/>
        </label>
            <br />
        <button type="submit">{props.buttonMessage}</button>
    </form>
    );
}

export default UserForm;
**/