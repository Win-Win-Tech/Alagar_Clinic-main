import React, { useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";

const RegistrationForm = () => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const mobileNumberRegex = /^\d{10}$/;

  const [alertMessage, setAlertMessage] = useState(null);

  const [formData, setFormData] = useState({
    user_first_name: "",
    user_last_name: "",
    user_email: "",
    user_mobile_number: "",
    user_role: "",
    user_password: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!emailRegex.test(formData.user_email)) {
      setAlertMessage("Please enter a valid email address.");
      setTimeout(() => {
        setAlertMessage(null);
      }, 2000);
      return;
    }

    if (!mobileNumberRegex.test(formData.user_mobile_number)) {
      setAlertMessage("Mobile number must be 10 digits long.");
      setTimeout(() => {
        setAlertMessage(null);
      }, 2000);
      return;
    }

    try {
      const checkEmailResponse = await axios.get(
        `http://api.5ytechno.com/check-email?email=${formData.user_email}`
      );

      if (checkEmailResponse.data.status === 400) {
        setAlertMessage(
          "Email is already registered. Please use a different email address."
        );
        setTimeout(() => {
          setAlertMessage(null);
        }, 2000);
        setFormData({ ...formData, user_email: "" });
        return;
      }

      const formDataToSend = new FormData();
      for (const key in formData) {
        formDataToSend.append(key, formData[key]);
      }

      const response = await axios.post(
        "http://api.5ytechno.com/register",
        formDataToSend,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      console.log(response.data);
      if (response.data.status === 200) {
        setAlertMessage("Registration successful!");

        setFormData({
          user_first_name: "",
          user_last_name: "",
          user_email: "",
          user_mobile_number: "",
          user_role: "",
          user_password: "",
        });
        setTimeout(() => {
          setAlertMessage(null);
        }, 3000);
      }
    } catch (error) {
      console.error("Registration failed:", error);
      setAlertMessage("Registration failed");
    }

    if (
      !formData.user_first_name ||
      !formData.user_last_name ||
      !emailRegex.test(formData.user_email) ||
      !mobileNumberRegex.test(formData.user_mobile_number) ||
      !formData.user_role ||
      !formData.user_password
    ) {
      setAlertMessage("Please fill all input fields.");
      setTimeout(() => {
        setAlertMessage(null);
      }, 2000);
      return;
    }
  };

  const [showPassword, setShowPassword] = useState(false);

  const handlePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    const onlyLettersRegex = /^[a-zA-Z\s]*$/;

    if (name === "user_first_name" || name === "user_last_name") {
      if (!onlyLettersRegex.test(value)) {
        return;
      }
    }

    setFormData({ ...formData, [name]: value });
  };

  return (
    <div
      className="container mt-4"
      style={{ fontFamily: "serif, sans-serif", marginLeft: "0px" }}
    >
      <h2>
        <b>Registration Form</b>
      </h2>
      <br />
      <form
        onSubmit={handleSubmit}
        style={{
          backgroundColor: "white",
          border: "1px solid lightgray",
          padding: "70px",
        }}
      >
        <div className="row mb-3">
          <div className="col-md-6">
            <label htmlFor="user_first_name" className="form-label">
              <b>First Name</b>
            </label>
            <input
              type="text"
              className="form-control"
              id="user_first_name"
              name="user_first_name"
              onChange={handleInputChange}
              value={formData.user_first_name}
              required
            />
          </div>
          <div className="col-md-6">
            <label htmlFor="user_last_name" className="form-label">
              <b>Last Name</b>
            </label>
            <input
              type="text"
              className="form-control"
              id="user_last_name"
              name="user_last_name"
              onChange={handleInputChange}
              value={formData.user_last_name}
              required
            />
          </div>
        </div>

        <div className="row mb-3">
          <div className="col-md-6">
            <label htmlFor="user_email" className="form-label">
              <b>Email</b>
            </label>
            <input
              type="text"
              className="form-control"
              id="user_email"
              name="user_email"
              onChange={handleInputChange}
              value={formData.user_email}
              required
            />
          </div>
          <div className="col-md-6">
            <label htmlFor="user_mobile_number" className="form-label">
              <b>Mobile Number</b>
            </label>
            <input
              type="tel"
              className="form-control"
              id="user_mobile_number"
              name="user_mobile_number"
              onChange={handleInputChange}
              onInput={(e) => {
                e.target.value = e.target.value.replace(/\D/, "").slice(0, 10);
              }}
              value={formData.user_mobile_number}
              required
            />
          </div>
        </div>

        <div className="row mb-3">
          <div className="col-md-6">
            <label htmlFor="user_role" className="form-label">
              <b>User Role</b>
            </label>
            <select
              className="form-select"
              id="user_role"
              name="user_role"
              onChange={handleInputChange}
              value={formData.user_role}
              required
            >
              <option value="">Select User Role</option>
              <option value="Doctor">Doctor</option>
              <option value="Pharmacist">Pharmacist</option>
            </select>
          </div>
          <div className="col-md-6">
            <label
              htmlFor="user_password"
              className="form-label"
              style={{ height: "1px" }}
            >
              <b>Password</b>
            </label>
            <div className="input-group mt-2">
              <input
                type={showPassword ? "text" : "password"}
                className="form-control"
                id="user_password"
                name="user_password"
                onChange={handleInputChange}
                value={formData.user_password}
                required
              />
              <button
                className="btn h-0"
                type="button"
                onClick={handlePasswordVisibility}
              >
                <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
              </button>
            </div>
          </div>
        </div>

        {alertMessage && (
          <div
            className="alert alert-success alert-dismissible fade show"
            role="alert"
            style={{
              position: "fixed",
              top: "10px",
              left: "55%",
              backgroundColor: "red",
              color: "white",
              padding: "10px",
              borderRadius: "5px",
              boxShadow: "0px 2px 5px rgba(0, 0, 0, 0.2)",
              zIndex: "9999",
              display: "block",
            }}
          >
            {alertMessage}
          </div>
        )}

        <div className="row">
          <div className="col-md-12 text-center">
            <button
              type="submit"
              className="btn btn-primary"
              style={{ backgroundColor: "teal", color: "white" }}
            >
              Register
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default RegistrationForm;
