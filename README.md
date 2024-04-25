Данный репозиторий предназначен как мини библиотека для работы с яндекс картами.
Собраны основные базовые реализации возможностей карты - 
   Установка удаление Placemarks
   Отрисовка Polygoons
   Геокодирование
   Измерение расстояний между метками
   Масштабирование при клике на метку
   Вхождение placeMark в polygon

1. Для того чтобы убрать ошибку 'is not a constructor' необходимо поменять данные в подключении скрипта
   вместо  
   https://api-maps.yandex.ru/2.0/?load=package.standard&amp;lang=ru-RU&amp;apikey=637a2705-9512-42e4-8b8d-c513db7bd4dd
   меняем 'standard' на 'full'
   https://api-maps.yandex.ru/2.0/?load=package.full&amp;lang=ru-RU&amp;apikey=637a2705-9512-42e4-8b8d-c513db7bd4dd

Здесь документация по этому вопросу
https://yandex.ru/dev/maps/archive/doc/jsapi/2.0/dg/concepts/load.html

2-ой вариант - использовать свой код после готовности карты -
ymaps.ready(function () {
//ваш код
});

2. При возникновении ошибки с пропаданием меток и геообъектов при zoom - проверить версию api - в версии 2.1 она отсутствует
      src="https://api-maps.yandex.ru/2.1/?load=package.full&amp;lang=ru-RU&amp;apikey=637a2705-9512-42e4-8b8d-c513db7bd4dd"
      type="text/javascript"
