import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import "../App.css";

const AdminRegister = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState({
    name: "",
    email: "",
    password: "",
  });

  let name, value;

  const handleInputs = (e) => {
    console.log(e);
    name = e.target.name;
    value = e.target.value;

    setUser({ ...user, [name]: value });
  };

  const PostData = async (e) => {
    e.preventDefault();

    const { name, email, password } = user;

    const res = await fetch("/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        email,
        password,
      }),
    });

    const data = await res.json();

    if (res.status === 422 || !data) {
      window.alert("Invalid Registration");
      console.log("Invalid Registration");
    } else {
      window.alert("Registration is Successfull");
      console.log("Successfull Registration");
      navigate("../AdminLogin");
    }
  };

  return (
    <>
      {/* <div className="body">
        <div className="div">
          <h1 className="head">Register</h1>
          <div className="div1">
            <form method="POST">
              <div className="c1">Name</div>
              <input
                type="text"
                name="name"
                autoComplete="off"
                className="c2"
                value={user.name}
                onChange={handleInputs}
                placeholder="Your Name"
              />

              <div className="c1">Email</div>
              <input
                type="text"
                name="email"
                autoComplete="off"
                className="c2"
                value={user.email}
                onChange={handleInputs}
                placeholder="Your email"
              />

              <div className="c1">Password</div>
              <input
                type="password"
                name="password"
                autoComplete="off"
                className="c2"
                value={user.password}
                onChange={handleInputs}
                placeholder="Your Password"
              />

              <div className="c3">
                <NavLink to="/AdminLogin">Don't have an account? Login</NavLink>
              </div>

              <input
                type="submit"
                name="signup"
                className="c2 submit"
                value="Register"
                onClick={PostData}
              />
            </form>
          </div>
        </div>
      </div> */}


<div className="bd">

    <form class="form_main" action="">
        <p class="heading">Register</p>
        <div class="inputContainer">
            <svg viewBox="0 0 16 16" fill="#2e2e2e" height="16" width="16" xmlns="http://www.w3.org/2000/svg" class="inputIcon">
            <path d="M13.106 7.222c0-2.967-2.249-5.032-5.482-5.032-3.35 0-5.646 2.318-5.646 5.702 0 3.493 2.235 5.708 5.762 5.708.862 0 1.689-.123 2.304-.335v-.862c-.43.199-1.354.328-2.29.328-2.926 0-4.813-1.88-4.813-4.798 0-2.844 1.921-4.881 4.594-4.881 2.735 0 4.608 1.688 4.608 4.156 0 1.682-.554 2.769-1.416 2.769-.492 0-.772-.28-.772-.76V5.206H8.923v.834h-.11c-.266-.595-.881-.964-1.6-.964-1.4 0-2.378 1.162-2.378 2.823 0 1.737.957 2.906 2.379 2.906.8 0 1.415-.39 1.709-1.087h.11c.081.67.703 1.148 1.503 1.148 1.572 0 2.57-1.415 2.57-3.643zm-7.177.704c0-1.197.54-1.907 1.456-1.907.93 0 1.524.738 1.524 1.907S8.308 9.84 7.371 9.84c-.895 0-1.442-.725-1.442-1.914z"></path>
            </svg>


        <input
                type="text"
                name="name"
                id="username"
                autoComplete="off"
                className="inputField"
                value={user.name}
                onChange={handleInputs}
                placeholder="Your Name"
              />

        </div> 
        <div class="inputContainer">
            <svg xmlns="http://www.w3.org/2000/svg" fill="#2e2e2e" height="16" width="16" viewBox="0 0 512 512" class="inputIcon"><path d="M64 112c-8.8 0-16 7.2-16 16v22.1L220.5 291.7c20.7 17 50.4 17 71.1 0L464 150.1V128c0-8.8-7.2-16-16-16H64zM48 212.2V384c0 8.8 7.2 16 16 16H448c8.8 0 16-7.2 16-16V212.2L322 328.8c-38.4 31.5-93.7 31.5-132 0L48 212.2zM0 128C0 92.7 28.7 64 64 64H448c35.3 0 64 28.7 64 64V384c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V128z"/></svg>
                           
        


        <input
                type="text"
                name="email"
                id="email"
                autoComplete="off"
                className="inputField"
                value={user.email}
                onChange={handleInputs}
                placeholder="Your email"
              />

        </div>
        
        <div class="inputContainer">
            <svg viewBox="0 0 16 16" fill="#2e2e2e" height="16" width="16" xmlns="http://www.w3.org/2000/svg" class="inputIcon">
                <path d="M8 1a2 2 0 0 1 2 2v4H6V3a2 2 0 0 1 2-2zm3 6V3a3 3 0 0 0-6 0v4a2 2 0 0 0-2 2v5a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z"></path>
            </svg>

            <input
                type="password"
                name="password"
                autoComplete="off"
                id="password"
                className="inputField"
                value={user.password}
                onChange={handleInputs}
                placeholder="Your Password"
              />

        </div>
        
                  
               
    <button id="button" onClick={PostData}>Submit</button>
        <div class="signupContainer">
            <p>already have an account?</p>
            <NavLink to="/AdminLogin">Login</NavLink>
        </div>
    </form>

    </div>

    



    </>
  );
};

export default AdminRegister;
