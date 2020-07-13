import React, { useState } from "react";
import logo from "./logo.svg";
import { ReactComponent as Cross } from "./cross.svg";
import "./App.css";
import { Modal } from "./modules/modal/index";
import { Link } from "@reach/router";

function App() {
  const [isLoginModalVisible, setLoginModalVisibility] = useState(false);
  const [isSignupModalVisible, setSignupModalVisibility] = useState(false);
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <div className="horizontal-stack">
          <button
            style={{ marginRight: 10 }}
            onClick={() => setLoginModalVisibility(true)}
          >
            Login
          </button>
          <button onClick={() => setSignupModalVisibility(true)}>Signup</button>
        </div>
        <Modal
          onClose={() => setLoginModalVisibility(false)}
          isOpen={isLoginModalVisible}
          style={{ width: "40%" }}
          aria-label="Login"
          closeTrigger="data-accessible-modal-close"
        >
          <div className="modal-header">
            <h2>Login</h2>
            <button
              className="cross-btn"
              title="close modal"
              onClick={() => setLoginModalVisibility(false)}
              data-accessible-modal-close=""
            >
              <Cross />
            </button>
          </div>
          <div className="modal-body">
            <div class="form-group">
              <label for="exampleInputEmail1">Email address</label>
              <input
                type="email"
                class="form-control"
                id="exampleInputEmail1"
                aria-describedby="emailHelp"
              />
              <small id="emailHelp" class="form-text text-muted">
                We'll never share your email with anyone else.
              </small>
            </div>
            <div class="form-group">
              <label for="exampleInputPassword1">Password</label>
              <input
                type="password"
                class="form-control"
                id="exampleInputPassword1"
              />
            </div>
          </div>

          <div className="modal-footer">
            <Link to="dashboard">Login</Link>
            <button onClick={() => setLoginModalVisibility(false)}>
              Close
            </button>
          </div>
        </Modal>
        <Modal
          onClose={() => setSignupModalVisibility(false)}
          isOpen={isSignupModalVisible}
          style={{ width: "40%" }}
          aria-label="Signup"
          closeTrigger="data-accessible-modal-close"
        >
          <div className="modal-header">
            <h2>Signup</h2>
            <button
              className="cross-btn"
              title="close modal"
              onClick={() => setSignupModalVisibility(false)}
              data-accessible-modal-close=""
            >
              <Cross />
            </button>
          </div>
          <div className="modal-body">
            <div class="row">
              <div class="col">
                <label>First Name</label>
                <input
                  type="text"
                  class="form-control"
                  placeholder="First name"
                />
              </div>
              <div class="col">
                <label>Last Name</label>
                <input
                  type="text"
                  class="form-control"
                  placeholder="Last name"
                />
              </div>
            </div>
            <div class="form-group">
              <label for="exampleInputEmail1">Email address</label>
              <input
                type="email"
                class="form-control"
                id="exampleInputEmail1"
                aria-describedby="emailHelp"
              />
            </div>
            <div class="form-group">
              <label for="exampleInputPassword1">Password</label>
              <input
                type="password"
                class="form-control"
                id="exampleInputPassword1"
              />
            </div>
            <div class="form-group">
              <label for="exampleInputPassword1">Confirm Password</label>
              <input
                type="password"
                class="form-control"
                id="exampleInputPassword1"
              />
            </div>
            <div class="form-group form-check">
              <input
                type="checkbox"
                class="form-check-input"
                id="exampleCheck1"
              />
              <label class="form-check-label" for="exampleCheck1">
                Terms and conditions
              </label>
            </div>
          </div>
          <div className="modal-footer">
            <Link to="dashboard">Signup</Link>
            <button onClick={() => setSignupModalVisibility(false)}>
              Close
            </button>
          </div>
        </Modal>
      </header>
    </div>
  );
}

export default App;
