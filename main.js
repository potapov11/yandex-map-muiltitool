function setMap() {
  const coordsCenterSpb = [59.93926, 30.315254];

  ymaps.ready(init);

  function init() {
    myMap = new ymaps.Map("map", {
      center: coordsCenterSpb,
      zoom: 10,
      zoom: 8,
      controls: [],
      behaviors: ["scrollZoom", "drag", "multiTouch"],
    });
  }
}

function setPointOnMap(num) {
  deleteAllPlaceMarks();
  const randomCoordsArray = createRandomCoords(num);

  randomCoordsArray.forEach((coords) => {
    // console.log(coords);

    const placeMark = createPlaceMarks(coords);
    myMap.geoObjects.add(placeMark);

    placeMark.events.add("dragend", function (e) {
      var coords = e.get("target").geometry.getCoordinates();

      let trimedCoords = coords.map((coordItem) => Number(coordItem.toFixed(5)));

      coordsOutput.textContent = trimedCoords;
    });
  });
}

function deletePoints() {
  myMap.geoObjects.each((item) => {
    myMap.geoObjects.remove(item);
  });
}

setMap(setPointOnMap);

//button-listeners//

btnMap.addEventListener("click", (e) => {
  console.dir(e);
  if (btnMap.textContent === "Скрыть все метки") {
    deleteAllPlaceMarks();
    btnMap.textContent = "Показать метки";
  } else if ((btnMap.textContent = "Показать метки")) {
    setPointOnMap(4);
    btnMap.textContent = "Скрыть все метки";
  }
});

btnShowDistance.addEventListener("click", (e) => {
  deletePolygons();
  deleteAllPlaceMarks();
  checkIsInPolygon = false;
  const distance = checkDistanceBewteenPoints();
  modal.classList.add("modal-show");
  modalText.textContent = `Дистанция между точками - ${distance} метров`;
  setTimeout(() => {
    modal.classList.remove("modal-show");
  }, 3000);
});

btnSetOnePlaceMark.addEventListener("click", (e) => {
  deletePolygons();
  checkIsInPolygon = false;
  console.log("click");

  modal.classList.add("modal-show");
  modalText.textContent = `Кликните на карту в любое место \r\n
  Точку можно перетаскивать по карте`;
  setTimeout(() => {
    modal.classList.remove("modal-show");
  }, 3000);

  btnSetOnePlaceMarkStatus = true;
  setOnePlaceMarkClickOnMap(btnSetOnePlaceMarkStatus);
});

btnShowPolygons.addEventListener("click", (e) => {
  if (e.target.textContent === "Показать полигоны") {
    createPolygons();
    btnShowPolygons.textContent = "Скрыть полигоны";
  } else if (e.target.textContent === "Скрыть полигоны") {
    deletePolygons();
    btnShowPolygons.textContent = "Показать полигоны";
  }
});

btnEntryPolygon.addEventListener("click", () => {
  deletePolygons();
  createPolygons();

  modal.classList.add("modal-show");
  modalText.textContent = `Кликните на карту в полигон \r\n
  Точку можно перетаскивать по карте. Затем петащите точку за пределы полигона, или кликните за пределы полигона`;
  setTimeout(() => {
    modal.classList.remove("modal-show");
  }, 3000);

  checkIsInPolygon = true;
  setOnePlaceMarkClickOnMap(true, checkIsInPolygon);
});

btnZoomPoints.addEventListener("click", () => {
  setPointOnMap(6);
  myMap.setBounds(myMap.geoObjects.getBounds(), {});
});

btnoneZoomPoints.addEventListener("click", () => {
  setPointOnMap(6);
  myMap.setBounds(myMap.geoObjects.getBounds(), {});

  modal.classList.add("modal-show");
  modalText.textContent = `Кликните на любую точку на карте`;
  setTimeout(() => {
    modal.classList.remove("modal-show");
  }, 3000);

  myMap.geoObjects.each(function (geoObject) {
    if (geoObject instanceof ymaps.Placemark) {
      geoObject.events.add("click", function (e) {
        console.log(e.get("target").geometry.getCoordinates());
        // myMap.panTo(e.get("target").geometry.getCoordinates());
        myMap.setCenter(e.get("target").geometry.getCoordinates(), 15, {
          checkZoomRange: true,
        });
      });
    }
  });
});
