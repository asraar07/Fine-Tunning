import './checkoutscreen.css';
import { useState } from 'react';

// Function Component
const CheckoutScreen = () => {
const [name, setName] = useState('');
const [address, setAddress] = useState('');
const [city, setCity] = useState('');
const [state, setState] = useState('');
const [zip, setZip] = useState('');
const [cardNumber, setCardNumber] = useState('');
const [expiryDate, setExpiryDate] = useState('');
const [cvv, setCvv] = useState('');

const handleCvvChange = (event) => {
setCvv(event.target.value);
};

const handleSubmit = (event) => {
event.preventDefault();
fetch('/api/place-order', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    name,
    address,
    city,
    state,
    zip,
    cardNumber,
    expiryDate,
    cvv
  })
})
  .then((response) => response.text())
  .then((message) => alert(message))
  .catch((error) => console.error(error));
};

return (
<form onSubmit={handleSubmit}>
{/* Shipping information fields */}
<div>
<h2>Shipping Information</h2>
<label htmlFor='name'>Name:</label>
<input
type='text'
id='name'
name='name'
value={name}
onChange={(event) => setName(event.target.value)}
required
/>
<label htmlFor='address'>Address:</label>
<input
type='text'
id='address'
name='address'
value={address}
onChange={(event) => setAddress(event.target.value)}
required
/>
<label htmlFor='city'>City:</label>
<input
type='text'
id='city'
name='city'
value={city}
onChange={(event) => setCity(event.target.value)}
required
/>
<label htmlFor='state'>State:</label>
<input
type='text'
id='state'
name='state'
value={state}
onChange={(event) => setState(event.target.value)}
required
/>
<label htmlFor='zip'>Zip Code:</label>
<input
type='text'
id='zip'
name='zip'
value={zip}
onChange={(event) => setZip(event.target.value)}
required
/>
</div>
  {/* Payment information fields */}
  <div>
    <h2>Payment Information</h2>
    <label htmlFor='card-number'>Card Number:</label>
    <input
      type='text'
      id='card-number'
      name='card-number'
      value={cardNumber}
      onChange={(event) => setCardNumber(event.target.value)}
      required
    />
    <label htmlFor='expiry-date'>Expiry Date:</label>
    <input
      type='text'
      id='expiry-date'
      name='expiry-date'
      value={expiryDate}
      onChange={(event) => setExpiryDate(event.target.value)}
      required
    />
    <label htmlFor='cvv'>CVV:</label>
    <input
      type='text'
      id='cvv'
      name='cvv'
      value={cvv}
      onChange={handleCvvChange}
      required
    />
  </div>

  {/* "Place Order" button */}
  <button id='place-order-button' type='submit'>
    Place Order
  </button>
</form>
);
}

export default CheckoutScreen;