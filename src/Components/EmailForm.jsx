import React, { useState } from 'react';
import axios from 'axios';

const EmailForm = () => {
  const [recipientEmail, setRecipientEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    const emailData = {
      recipientEmail: recipientEmail,
      subject: subject,
      body:body ,
    };
  console.log("email data",emailData)
    axios
      .post("https://localhost:7189/sendEmail",emailData)
      .then((response) => {
        if (response.status === 200) {
          alert('Email sent successfully!');
        } else {
          throw new Error('Failed to send email.');
        }
      })
      .catch((error) => {
        alert('Failed to send email: ' + error.message);
      });
  };

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="recipientEmail">Recipient Email:</label>
      <input
        type="email"
        id="recipientEmail"
        value={recipientEmail}
        onChange={(e) => setRecipientEmail(e.target.value)}
        required
      />

      <label htmlFor="subject">Subject:</label>
      <input
        type="text"
        id="subject"
        value={subject}
        onChange={(e) => setSubject(e.target.value)}
        required
      />

      <label htmlFor="body">Body:</label>
      <textarea
        id="body"
        value={body}
        onChange={(e) => setBody(e.target.value)}
        required
      ></textarea>

      <button type="submit">Send Email</button>
    </form>
  );
};

export default EmailForm;
