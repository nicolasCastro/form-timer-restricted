import React, { useState } from 'react';
import CountdownTimer from './CountdownTimer';
import './App.css';
import logo from './img/thinkup-logo-footer.svg'
import { TARGET_DATE, STATUS_KEY, STATUS_WAITING, STATUS_EXPIRED, STATUS_COUTING, STATUS_SUCCESS } from './Constants'

function UploadData(e, callback) {
  e.preventDefault();
  const data = new FormData(e.target);
  if (!data.get('username') || !data.get('file').name) {
    callback(null);
  } else {
    const requestOptions = {
      method: 'POST',
      body: data
    };
    fetch('/upload', requestOptions)
      .then(res => res.json())
      .then(data => {
        callback(data)
      })
  }
}

function App() {
  const HOUR_IN_MS = 5 * 60 * 1000;
  const NOW_IN_MS = new Date().getTime();
  const dateTimeAfterHour = NOW_IN_MS + HOUR_IN_MS;
  const GOOGLE_TEST_LINK = 'https://drive.google.com/uc?export=download&id=1f0Nr2Py5zEc_SKS58wAaxaKYsorctuUC';

  const currentDate = JSON.parse(localStorage.getItem(TARGET_DATE) || dateTimeAfterHour);
  const currentStarted = localStorage.getItem(STATUS_KEY) || STATUS_WAITING;

  const [formStatus, setFormStatus] = useState(currentStarted);
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);

  return (
    <div className="wrapper" align="center">
      <br />
      <br />
      <br />
      <div>
        <CountdownTimer
          targetDate={currentDate}
          hasStarted={currentStarted}
          callback={() => {
            if (formStatus !== STATUS_EXPIRED && formStatus !== STATUS_SUCCESS) {
              setFormStatus(STATUS_EXPIRED);
            }
          }
          }
        />
        <br />
        <br />
        <a
          href={GOOGLE_TEST_LINK}
          className='download-link'
          onClick={() => {
            localStorage.setItem(TARGET_DATE, new Date().getTime() + HOUR_IN_MS);
            localStorage.setItem(STATUS_KEY, STATUS_COUTING);
            setFormStatus(STATUS_COUTING);
          }}
          hidden={formStatus !== STATUS_WAITING}>
          Download
        </a>
      </div>
      <br />
      <br />
      <div className="loader" hidden={!loading}></div>
      <br />
      <br />
      <form
        className='form__status'
        hidden={formStatus === STATUS_WAITING || formStatus === STATUS_EXPIRED || formStatus === STATUS_SUCCESS}
        onSubmit={e => {
          setLoading(true);
          UploadData(e, (data) => {
            if (data) {
              alert(data.message);
              localStorage.setItem(STATUS_KEY, STATUS_SUCCESS);
              setFormStatus(STATUS_SUCCESS);
            } else {
              alert("Complete the name and file fields!");
            }
            setLoading(false);
          })
        }
        }
        method='post'
      >
        <fieldset>
          <h1>Test result</h1>
          <p>Upload your code in a .zip file.</p>
          <br />
          <br />
          <div>
            <label>Your name</label>
            <input
              name="username"
              value={username}
              type='text'
              onChange={e =>
                setUsername(e.target.value)
              } />
          </div>
          <br />
          <br />
          <div>
            <label>Your code</label>
            <input name="file" class='hide_file' type='file' accept='.zip' />
          </div>
        </fieldset>
        <br />
        <br />
        <br />
        <button type="submit">Submit</button>
      </form>
      <footer className='footer'>
        <div class="footer__inner inner">
          <a href="https://thinkupsoft.com/" target={'_blank'} class="footer__logo">
            <img src={logo} alt="logo" />
          </a>
          <div class="footer__copy copy">Copyright © <span id="current-year">2022</span>. All rights reserved</div>
        </div>
      </footer>
    </div>
  )
}

export default App;