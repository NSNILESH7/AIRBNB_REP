let mapToken = MapToken;
  mapboxgl.accessToken = mapToken;
  const map = new mapboxgl.Map({
    container: "map", // container ID
    center: coordinate, // starting position [lng, lat]
    zoom: 8, // starting zoom
  });

  // console.log(coordinate);
  const marker1 = new mapboxgl.Marker({color:'red'})
        .setLngLat(coordinate)
        .setPopup(new mapboxgl.Popup({offset: 25,})
        .setHTML("<p>Hello World!</p>"))
        .addTo(map);