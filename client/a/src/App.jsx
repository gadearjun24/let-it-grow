import React, { Component } from "react";
import "./App.css";
import Homeview from "./views/Homeview";
import Navbar from "./components/Navbar";
import { Route, Routes } from "react-router-dom"; // Use Routes for wrapping Route components
import { loadMe, signOut } from "./services/authentication";
import SignIn from "./views/Authentication/SignIn";
import SignUp from "./views/Authentication/SignUp";
import Profile from "./views/Profile";
import SingleGarden from "./views/Gardens/SingleGarden";
import SinglePlant from "./views/Plants/SinglePlant";
import EditPlant from "./views/Plants/EditPlant";
import SearchedPlant from "./views/Plants/SearchedPlant";
import Search from "./views/Search";
import Tasks from "./views/Tasks";
import ProtectedRoute from "./components/ProtectedRoute";

class App extends Component {
  constructor() {
    super();
    this.state = {
      loaded: false,
      user: null,
    };
  }

  componentDidMount() {
    loadMe()
      .then((data) => {
        const user = data.user;
        this.handleUserUpdate(user);
        this.setState({
          loaded: true,
        });
      })
      .catch((error) => {
        console.log(error);
      });
  }

  handleUserUpdate = (user) => {
    this.setState({
      user,
    });
  };

  handleSignOut = () => {
    signOut()
      .then(() => {
        this.handleUserUpdate(null);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  render() {
    return (
      <div className="App">
        <Navbar user={this.state.user} onSignOut={this.handleSignOut} />
        <Routes>
          {/* Wrap all routes in Routes */}
          <Route
            path="/authentication/sign-up"
            element={
              <ProtectedRoute
                authorized={!this.state.user} // Checks if the user is not authenticated
                redirect="/" // Redirect to home if the user is authenticated
                element={<SignUp onUserUpdate={this.handleUserUpdate} />} // Render the SignUp component if not authenticated
              />
            }
          />

          <Route
            path="/authentication/sign-in"
            element={
              <ProtectedRoute
                authorized={!this.state.user} // Checks if the user is NOT authenticated
                redirect="/" // If the user is authenticated, redirect to "/"
                element={<SignIn onUserUpdate={this.handleUserUpdate} />} // Pass SignIn as the element to render
              />
            }
          />

          <Route
            path="/"
            element={
              <ProtectedRoute
                authorized={this.state.user} // Checks if the user is authenticated
                redirect="/authentication/sign-in" // Redirect if not authenticated
                element={<Homeview user={this.state.user} />} // Pass Homeview as the element to render
              />
            }
          />

          <Route
            path="/profile"
            element={
              <ProtectedRoute
                authorized={this.state.user} // Check if the user is authenticated
                redirect="/authentication/sign-in" // Redirect to sign-in if not authenticated
                element={
                  <Profile
                    user={this.state.user}
                    onUserUpdate={this.handleUserUpdate}
                  />
                }
              />
            }
          />

          <Route
            path="/gardens/:gardenId"
            element={
              <ProtectedRoute
                authorized={this.state.user} // Check if the user is authenticated
                redirect="/authentication/sign-in" // Redirect to sign-in if not authenticated
                element={<SingleGarden user={this.state.user} />} // Pass SingleGarden as the element to be rendered
              />
            }
          />

          <Route
            path="/plants/:plantId"
            element={
              <ProtectedRoute
                authorized={this.state.user} // Check if the user is authenticated
                redirect="/authentication/sign-in" // Redirect to sign-in if not authenticated
                element={<SinglePlant user={this.state.user} />} // Pass SinglePlant as the element to be rendered
              />
            }
          />

          <Route
            path="/plants/edit/:plantId"
            element={
              <ProtectedRoute
                user={this.state.user}
                authorized={this.state.user}
                redirect="/authentication/sign-in"
              >
                <EditPlant user={this.state.user} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/search"
            element={
              <ProtectedRoute
                authorized={this.state.user} // Check if the user is authenticated
                redirect="/authentication/sign-in" // Redirect to sign-in if not authenticated
                element={<Search user={this.state.user} />} // Pass Search as the element to be rendered
              />
            }
          />

          <Route
            path="/search/:id"
            element={
              <ProtectedRoute
                authorized={this.state.user} // Check if the user is authenticated
                redirect="/authentication/sign-in" // Redirect to sign-in if not authenticated
                element={<SearchedPlant user={this.state.user} />} // Pass SearchedPlant as the element to be rendered
              />
            }
          />

          <Route
            path="/tasks"
            element={
              <ProtectedRoute
                authorized={this.state.user} // Checks if the user is authenticated
                redirect="/authentication/sign-in" // Redirect to sign-in if the user is not authenticated
                element={<Tasks user={this.state.user} />} // Pass the Tasks component as the element to render
              />
            }
          />
        </Routes>
      </div>
    );
  }
}

export default App;
