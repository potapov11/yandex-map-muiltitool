// import zones from "./zones.js";

console.log(zones);

var myMap;
const coordsOutput = document.querySelector(".coords-output");
const modal = document.querySelector(".modal");
const modalText = document.querySelector(".modal__text");

const colorsZones = ["#ed4543", "#ff931e", "#1e98ff"];

//buttons-constans
const btnMap = document.querySelector(".map-hide-btn");
const btnShowDistance = document.querySelector(".button.show-distance");
const btnSetOnePlaceMark = document.querySelector(".button.set-placemark");
const btnShowPolygons = document.querySelector(".show-polygons");
const btnEntryPolygon = document.querySelector(".polygon-entry");
const btnZoomPoints = document.querySelector(".zoom-placemarks");
const btnoneZoomPoints = document.querySelector(".zoom-one-placemark");

let btnSetOnePlaceMarkStatus = false;
let checkIsInPolygon = false;

function randomNum() {
  const max = 80;
  return Math.floor(Math.random() * max);
}

function createRandomCoords(amount) {
  const coordsArray = [];
  const lat1 = 59.55; // Южная граница
  const lon1 = 28.7; // Западная граница
  const lat2 = 60.25; // Северная граница
  const lon2 = 31.5; // Восточная граница

  for (let i = 0; i < amount; i++) {
    const randomLat = Math.random() * (lat2 - lat1) + lat1;
    const randomLon = Math.random() * (lon2 - lon1) + lon1;
    coordsArray.push([randomLat, randomLon]);
  }

  return coordsArray;
}

function setOnePlaceMarkClickOnMap(status, polygonStatus) {
  console.log(polygonStatus);
  var coords;
  if (status === true) {
    console.log("click in func");
    //Обработка click на карте
    myMap.events.add("click", function (e) {
      // получить координаты клика
      coords = e.get("coords");

      //Удаляем метки с карты
      deleteAllPlaceMarks();

      // создаем новую метку и ставим на карту
      const placeMark = createPlaceMarks(coords);
      myMap.geoObjects.add(placeMark);

      if (polygonStatus) {
        clickInPolygon();
      }

      //Добавляем возможность перетаскивания и вывода координат
      placeMark.events.add("dragend", function (e) {
        coords = e.get("target").geometry.getCoordinates();

        if (polygonStatus) {
          clickInPolygon();
        }
        let trimedCoords = coords.map((coordItem) => Number(coordItem.toFixed(5)));

        coordsOutput.textContent = trimedCoords;
      });
    });

    return coords;
  } else {
    return;
  }
}

//Функция удаления Placemark с карты
// function deleteAllPlaceMarks() {
//   myMap.geoObjects.each(function (geoObject) {
//     if (geoObject instanceof ymaps.Placemark) {
//       myMap.geoObjects.remove(geoObject);
//     }
//   });
// }

function deleteAllPlaceMarks() {
  const count = myMap.geoObjects.getLength();

  for (let i = count - 1; i >= 0; i--) {
    const geoObject = myMap.geoObjects.get(i);
    if (geoObject instanceof ymaps.Placemark) {
      myMap.geoObjects.remove(geoObject);
    }
  }
}

function deletePolygons() {
  const count = myMap.geoObjects.getLength();

  for (let i = count - 1; i >= 0; i--) {
    const geoObject = myMap.geoObjects.get(i);
    if (geoObject instanceof ymaps.Polygon) {
      myMap.geoObjects.remove(geoObject);
    }
  }
}

function createPolygons() {
  deletePolygons();
  deleteAllPlaceMarks();

  const colorsArray = ["#00FF00", "#FFFF00", "#FF00FF"];
  console.log(zones, "...zones");

  for (let i = 0; i < zones.length; i++) {
    let coords = JSON.parse(zones[i].coords);
    coords = coords.map((item) => item.reverse());

    console.log(coords);
    console.log(Array.isArray(coords));

    // Проверка на корректность координат
    if (!Array.isArray(coords) || coords.length === 0) {
      console.error(`Координаты полигона ${i} некорректны:`, coords);
      continue;
    }

    let myPolygon = new ymaps.Polygon(
      [coords],
      {},
      {
        interactivityModel: "default#transparent",
        fillColor: colorsArray[i],
        strokeWidth: 5,
        opacity: 0.8,
      }
    );

    myMap.geoObjects.add(myPolygon);
    console.log(`Polygon ${i}:`, myPolygon);
    console.log(myMap);
  }
}

// fetch("https://65abe95bfcd1c9dcffc7412c.mockapi.io/zones")
//   .then((response) => response.json())
//   .then((data) => {
//     console.log(data);
//     console.log(data.length);

//     data.forEach((arr, index) => {
//       let reversedArr = arr.map((item) => item.reverse());

//       let myPolygon2 = new ymaps.Polygon(
//         [reversedArr],
//         {},
//         {
//           interactivityModel: "default#transparent",
//           fillColor: colorsArray[index],
//           strokeWidth: 5,
//           opacity: 0.8,
//         }
//       );

//       myMap.geoObjects.add(myPolygon2);
//     });
//   })
//   .catch((err) => alert(err));

//Функция измерения дистанции между точками
function checkDistanceBewteenPoints() {
  setPointOnMap(2);
  let pointsMapPlacemarksArr = [];

  myMap.geoObjects.each(function (geoObject) {
    if (geoObject instanceof ymaps.Placemark) {
      pointsMapPlacemarksArr.push(geoObject.geometry._coordinates);
    }
  });

  let distance = Math.floor(ymaps.coordSystem.geo.getDistance(pointsMapPlacemarksArr[0], pointsMapPlacemarksArr[1]));

  return distance;
}

function clickInPolygon() {
  var coords = null;

  myMap.geoObjects.each(function (geoObject) {
    if (geoObject instanceof ymaps.Placemark) {
      coords = geoObject.geometry.getCoordinates();
    }
  });

  let insidePolygon = false;

  myMap.geoObjects.each(function (geoObject) {
    if (geoObject instanceof ymaps.Polygon) {
      if (geoObject.geometry.contains(coords)) {
        insidePolygon = true;

        modal.classList.add("modal-show");
        modalText.textContent = `Точка установлена в полигоне.`;
        setTimeout(() => {
          modal.classList.remove("modal-show");
        }, 1000);
      }
    }
  });

  if (!insidePolygon) {
    deleteAllPlaceMarks();
    modal.classList.add("modal-show");
    modalText.textContent = `Точка установлена ЗА пределами полигона.`;
    setTimeout(() => {
      modal.classList.remove("modal-show");
    }, 1000);
  }
}

function setCenter() {
  myMap.geoObjects.each(function (geoObject) {
    if (geoObject instanceof ymaps.Placemark) {
      myPlacemark.events.add("click", function (e) {
        console.log(e.get("target").geometry.getCoordinates());
      });
    }
  });
}

//Функция создания PlaceMark
function createPlaceMarks(coords) {
  placemark = new ymaps.Placemark(
    coords,
    {},
    {
      draggable: true,
      iconLayout: "default#image",
      iconImageHref: "https://cdn.icon-icons.com/icons2/2444/PNG/512/location_map_pin_mark_icon_148684.png",
      iconImageSize: [55, 55],
      iconImageOffset: [-25, -55],
    }
  );

  return placemark;
}
