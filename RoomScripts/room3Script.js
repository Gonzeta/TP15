const botonVolverSala3 = document.querySelector('#return-lobby');
botonVolverSala3.addEventListener('click', () => {
  sessionStorage.setItem("door3ID", true.toString());
  console.log(door3ID);
});