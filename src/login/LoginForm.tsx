
import React, { useState } from 'react';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';
import { Spinner } from 'react-bootstrap';
import './login.css'

const LoginForm: React.FC<any> = ({ onSubmitLogin, isLoading, loadingMessage }) => {
  const [credentials, setCredentials] = useState({ username: 'admin@mail.com', password: 'Admin@123' });
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div
      className="login-form-container"
      style={{
        width: '100%',
        maxWidth: '540px', padding: '30px 45px', height: '600px', borderRadius: '10px',
        backgroundColor: '#EFFDF3',
        boxShadow: '0 12px 15px -11px #0c0c0c80',
        transition: 'transform 0.3s ease-in-out'
      }}
      onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(12px)'}
      onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
    >
      {/* CENTERED LOGO */}
      <div className="login-form-header d-flex flex-column align-items-center">
        <img src="/chef_green.png" alt="Logo" style={{ height: '130px', width: '130px' }} />
        <h1 className="m-0" style={{
          fontSize: '32px', fontWeight: 700, color: '#fff', letterSpacing: '2px', margin:'16px 0 !important',
          textShadow: '#2e7d32 2px 0px 0px, #2e7d32 1.75px 0.95px 0px, #2e7d32 1.08px 1.68px 0px, #2e7d32 0.14px 1.99px 0px, #2e7d32 -0.83px 1.81px 0px, #2e7d32 -1.60px 1.19px 0px, #2e7d32 -1.97px 0.28px 0px, #2e7d32 -1.87px -0.70px 0px, #2e7d32 -1.30px -1.51px 0px, #2e7d32 -0.42px -1.95px 0px, #2e7d32 0.56px -1.91px 0px, #2e7d32 1.41px -1.41px 0px, #2e7d32 1.92px -0.55px 0px'
        }}>
          BSS RESTAURANT
        </h1>
      </div>

      <form onSubmit={(e) => { e.preventDefault(); onSubmitLogin(credentials); }}>
        <div className="mb-3 text-start">
          <label className="d-block mb-2" style={{ fontSize: '20px', fontWeight: 500, color: '#212121',paddingBottom:'8px' }}>Username</label>
          <input
            type="email"
            style={{ height: '52px', fontSize: '18px', padding: '5px 10px', width: '100%', outline: 'none', background: '#fff', color: '#000', border: '1px solid #66BB6A', borderRadius: '5px', boxShadow: '3px 3px 6px 1px #e2e2e2' }}
            value={credentials.username}
            onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
            required
          />
        </div>

        <div className="mb-3 text-start">
          <label className="d-block mb-2" style={{ fontSize: '20px', fontWeight: 500, color: '#212121' }}>Password</label>
          <div className="position-relative">
            <input
              type={showPassword ? "text" : "password"}
              className="login-input"
              style={{
                height: '52px', fontSize: '18px', padding: '5px 10px', width: '100%',
                outline: 'none', background: '#fff', color: '#000',
                border: '1px solid #66BB6A', borderRadius: '5px',
                boxShadow: '3px 3px 6px 1px #e2e2e2', paddingRight: '50px'
              }}
              value={credentials.password}
              onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
              required
            />


            <span
              className="position-absolute end-0 top-50 translate-middle-y me-3 password-toggle-icon"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <AiOutlineEyeInvisible />
              ) : (
                <AiOutlineEye />
              )}
            </span>
          </div>
        </div>

        <div className="d-flex align-items-center mb-3">
          <input
            type="checkbox"
            id="rem"
            className="custom-checkbox me-2"
          />
          <label htmlFor="rem" className="text-dark" style={{ fontSize: '18px', fontWeight: 400 }}>
            Remember me
          </label>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="btn login-submit-btn w-100 text-white uppercase shadow-md border-0"
          style={{
            height: '52px',
            fontSize: '16px',
            backgroundColor: isLoading ? '#f0f0f0' : '#43a047',
            color: isLoading ? '#999' : '#fff',
            borderRadius: '8px',
            transition: 'background-color 0.2s ease'
          }}
        >
          {isLoading ? (
            <><Spinner animation="border" size="sm" className="me-3" /> {loadingMessage}</>
          ) : 'LOGIN'}
        </button>
      </form>
    </div>
  );
};

export default LoginForm;