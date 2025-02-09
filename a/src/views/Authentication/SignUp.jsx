import React, { Component } from "react";
import { signUp } from "../../services/authentication";
import { Link } from "react-router-dom";

class SignUp extends Component {
  constructor() {
    super();
    this.state = {
      name: "",
      email: "",
      password: "",
    };
  }

  handleInputChange = (event) => {
    const { name, value } = event.target;
    this.setState({
      [name]: value,
    });
  };

  handleFormSubmission = (event) => {
    event.preventDefault();
    const { name, email, password } = this.state;
    const body = { name, email, password };
    signUp(body)
      .then((data) => {
        const { user } = data;
        this.props.onUserUpdate(user);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  render() {
    return (
      <div className="sign-in">
        <div className="brand">
          <h1>Let It Grow </h1>
          <img className="logo" src="/images/plant.png" alt="logo" />
        </div>
        <form
          onSubmit={this.handleFormSubmission}
          className="form-group sign-in"
        >
          <label htmlFor="input-name">Username</label>
          <input
            id="input-name"
            type="text"
            name="name"
            placeholder="name"
            value={this.state.name}
            onChange={this.handleInputChange}
            required
          />

          <label htmlFor="input-email">Email</label>
          <input
            id="input-email"
            type="email"
            name="email"
            placeholder="Email"
            value={this.state.email}
            onChange={this.handleInputChange}
            required
          />

          <label htmlFor="input-password">Password</label>
          <input
            id="input-password"
            type="password"
            name="password"
            placeholder="Password"
            value={this.state.password}
            onChange={this.handleInputChange}
            minlength="6"
            required
          />

          <button className="btn-letitgrow">Sign Up</button>
          <Link to="/authentication/sign-in">
            <small>Already have an account? Sign In</small>
          </Link>
        </form>
      </div>
    );
  }
}

export default SignUp;
