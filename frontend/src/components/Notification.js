import React from 'react';

function Notification({ message }) {
  return (
    <div style={{ backgroundColor: 'green', color: 'white', padding: '10px' }}>
      {message}
    </div>
  );
}

export default Notification;