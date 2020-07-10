import React, { useState } from "react";
import logo from "./logo.svg";
import "./App.css";
import Modal from "./components/Modal";

function App() {
  const [isModalVisible, setIsModalVisible] = useState(false);

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />

        <button className="App-link" onClick={() => setIsModalVisible(true)}>
          Open
        </button>
        <Modal
          onModalClose={() => setIsModalVisible(false)}
          isOpen={isModalVisible}
        >
          <Modal.Header>Header</Modal.Header>
          <Modal.Body>
            <p>
              Edit <code>src/App.js</code> and save to reload.
            </p>
          </Modal.Body>
          <Modal.Footer>
            <Modal.Footer.CloseBtn>Close</Modal.Footer.CloseBtn>
          </Modal.Footer>
        </Modal>
      </header>
    </div>
  );
}

export default App;
