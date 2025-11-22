const botonVolverSala2 = document.querySelector('#return-lobby');
botonVolverSala2.addEventListener('click', () => {
  sessionStorage.setItem("door2ID", true.toString());
  console.log(door2ID);
});