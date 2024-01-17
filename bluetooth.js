navigator.bluetooth.requestDevice({ acceptAllDevices: true })
  .then(device => {
    // Do something with the selected device
    console.log('Selected device:', device);
  })
  .catch(error => {
    if (error instanceof DOMException && error.name === 'NotFoundError') {
      console.error('No Bluetooth device selected.');
    } else {
      console.error('Error during device selection:', error.message);
    }
  });
