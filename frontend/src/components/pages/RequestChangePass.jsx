// RequestChangePass.js

import React, { useState } from 'react';
import axios from 'axios';
import { Card, Form, Button } from 'react-bootstrap'; // Import Form and Button from react-bootstrap
import JTIFY from '../img/JTIFY.png';


function RequestChangePass() {
  const [email, setEmail] = useState('');

  const handleRequestPass = async (e) => {
    e.preventDefault(); // Prevent the default form submission behavior

    try {
      const response = await axios.post(
        'http://127.0.0.1:8000/api/user/send-reset-password-email/',
        {
          email,
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      // Handle the response as needed
      console.log('Request Password Response:', response.data);
    } catch (error) {
      // Handle errors
      console.error('Error making request password API call:', error.message);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#000000'}}>
      <Card style={{ width: '400px', padding: '20px', border: '2px solid white', borderRadius: '10px', zIndex: '2'}}>
        <Form onSubmit={handleRequestPass}>
          <h1 style={{ textAlign: 'center', color: 'white' }}>Request Change Password</h1>

          <Form.Label style={{ color: 'white' }}>Email</Form.Label>
          <Form.Group controlId='email'>
            <Form.Control
              className='form-control'
              type='email'
              placeholder='Enter email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </Form.Group>

          <Button className='login-button glow-button' type='submit' variant='primary'>
            Request Change Password
          </Button>
        </Form>

        <div className="background" style={{
    position: 'absolute',
    top: '0',
    left: '0',
    right: '0',
    bottom: '0',
    overflow: 'hidden', /* To ensure the image doesn't overflow */
    zIndex:'1'
}}>
    <img src={JTIFY} style={{
        position: 'absolute',
        top: '0',
        left: '0',
        width: '100%',
        height: '100%',
        objectFit: 'cover', /* This will make the image cover the entire container */
        zIndex:'2'
    }} />
</div>
                <div className="logo-image">
                    <img src="Jlogo.png" alt="background" width={200} />
                </div>
            
      </Card>
    </div>
  );
}

export default RequestChangePass;