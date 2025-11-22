const botonVolverSala1 = document.querySelector('#return-lobby');
botonVolverSala1.addEventListener('click', () => {
  sessionStorage.setItem("door1ID", true.toString());
  console.log(door1ID);
});