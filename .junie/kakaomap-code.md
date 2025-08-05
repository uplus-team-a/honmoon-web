지도 생성하기
지도를 생성하는 가장 기본적인 예제입니다.

50mKakao 맵으로 이동(새창열림)
직접 해보기Javascript
var mapContainer = document.getElementById('map'), // 지도를 표시할 div
mapOption = {
center: new kakao.maps.LatLng(33.450701, 126.570667), // 지도의 중심좌표
level: 3 // 지도의 확대 레벨
};

// 지도를 표시할 div와 지도 옵션으로 지도를 생성합니다
var map = new kakao.maps.Map(mapContainer, mapOption);

지도 이동시키기
지도를 이동시킵니다. 지도 객체의 메소드를 통해 지도를 원하는 좌표로 이동시킬 수 있습니다. 또, 지도가 표시되고 있는 영역크기를 벗어나지 않는 거리라면 애니메이션 효과처럼 지도를 부드럽게 이동시킬 수도 있습니다.

50mKakao 맵으로 이동(새창열림)
지도 중심좌표 이동시키기 지도 중심좌표 부드럽게 이동시키기

직접 해보기Javascript
var mapContainer = document.getElementById('map'), // 지도를 표시할 div
mapOption = {
center: new kakao.maps.LatLng(33.450701, 126.570667), // 지도의 중심좌표
level: 3 // 지도의 확대 레벨
};

var map = new kakao.maps.Map(mapContainer, mapOption); // 지도를 생성합니다

function setCenter() {            
// 이동할 위도 경도 위치를 생성합니다
var moveLatLon = new kakao.maps.LatLng(33.452613, 126.570888);

    // 지도 중심을 이동 시킵니다
    map.setCenter(moveLatLon);

}

function panTo() {
// 이동할 위도 경도 위치를 생성합니다
var moveLatLon = new kakao.maps.LatLng(33.450580, 126.574942);

    // 지도 중심을 부드럽게 이동시킵니다
    // 만약 이동할 거리가 지도 화면보다 크면 부드러운 효과 없이 이동합니다
    map.panTo(moveLatLon);            

}

지도 레벨 바꾸기
지도 레벨을 지도 객체 메소드를 호출해서 변경합니다.

50mKakao 맵으로 이동(새창열림)
지도레벨 - 1 지도레벨 + 1 현재 지도 레벨은 3 레벨 입니다.

직접 해보기Javascript
var mapContainer = document.getElementById('map'), // 지도를 표시할 div
mapOption = {
center: new kakao.maps.LatLng(33.450701, 126.570667), // 지도의 중심좌표
level: 3 // 지도의 확대 레벨
};

var map = new kakao.maps.Map(mapContainer, mapOption); // 지도를 생성합니다

// 지도 레벨을 표시합니다
displayLevel();

// 지도 레벨은 지도의 확대 수준을 의미합니다
// 지도 레벨은 1부터 14레벨이 있으며 숫자가 작을수록 지도 확대 수준이 높습니다
function zoomIn() {        
// 현재 지도의 레벨을 얻어옵니다
var level = map.getLevel();

    // 지도를 1레벨 내립니다 (지도가 확대됩니다)
    map.setLevel(level - 1);
    
    // 지도 레벨을 표시합니다
    displayLevel();

}

function zoomOut() {    
// 현재 지도의 레벨을 얻어옵니다
var level = map.getLevel();

    // 지도를 1레벨 올립니다 (지도가 축소됩니다)
    map.setLevel(level + 1);
    
    // 지도 레벨을 표시합니다
    displayLevel(); 

}

function displayLevel(){
var levelEl = document.getElementById('maplevel');
levelEl.innerHTML = '현재 지도 레벨은 ' + map.getLevel() + ' 레벨 입니다.';
}

지도에 컨트롤 올리기
일반 지도와 스카이뷰로 지도 타입을 전환할 수 있는 버튼과 지도 확대, 축소를 제어할 수 있는 도구를 쉽게 지도 위에 올릴 수 있습니다. 각각 지도 타입 컨트롤, 지도 줌 컨트롤이라고 부르며, 아래 예제와 같이 지도
위에 표시될 위치를 지정할 수도 있습니다.

50mKakao 맵으로 이동(새창열림)
직접 해보기Javascript
var mapContainer = document.getElementById('map'), // 지도를 표시할 div
mapOption = {
center: new kakao.maps.LatLng(33.450701, 126.570667), // 지도의 중심좌표
level: 3 // 지도의 확대 레벨
};

var map = new kakao.maps.Map(mapContainer, mapOption); // 지도를 생성합니다

// 일반 지도와 스카이뷰로 지도 타입을 전환할 수 있는 지도타입 컨트롤을 생성합니다
var mapTypeControl = new kakao.maps.MapTypeControl();

// 지도에 컨트롤을 추가해야 지도위에 표시됩니다
// kakao.maps.ControlPosition은 컨트롤이 표시될 위치를 정의하는데 TOPRIGHT는 오른쪽 위를 의미합니다
map.addControl(mapTypeControl, kakao.maps.ControlPosition.TOPRIGHT);

// 지도 확대 축소를 제어할 수 있는 줌 컨트롤을 생성합니다
var zoomControl = new kakao.maps.ZoomControl();
map.addControl(zoomControl, kakao.maps.ControlPosition.RIGHT);

지도 이동 막기
마우스 드래그로 지도를 이동시키는 기능을 막습니다. 모바일 기기에서 터치스크롤시 지도가 이동되는 것을 막고싶거나 지도가 이동되면 안되는 경우 등 상황에 따라 지도의 이동 기능을 제어할 수 있습니다.

50mKakao 맵으로 이동(새창열림)
지도 드래그 이동 끄기 지도 드래그 이동 켜기

직접 해보기Javascript
var mapContainer = document.getElementById('map'), // 지도를 표시할 div
mapOption = {
center: new kakao.maps.LatLng(33.450701, 126.570667), // 지도의 중심좌표
// draggable: false, // 지도를 생성할때 지도 이동 및 확대/축소를 막으려면 draggable: false 옵션을 추가하세요
level: 3 // 지도의 확대 레벨
};

var map = new kakao.maps.Map(mapContainer, mapOption); // 지도를 생성합니다

// 버튼 클릭에 따라 지도 이동 기능을 막거나 풀고 싶은 경우에는 map.setDraggable 함수를 사용합니다
function setDraggable(draggable) {
// 마우스 드래그로 지도 이동 가능여부를 설정합니다
map.setDraggable(draggable);    
}

지도 타입 바꾸기1
교통정보, 로드뷰 도로정보, 지형도 정보를 버튼 클릭에 따라 지도 타입을 변경합니다.

100mKakao 맵으로 이동(새창열림)
교통정보 보기 로드뷰 도로정보 보기 지형정보 보기 지적편집도 보기

직접 해보기Javascript
var mapContainer = document.getElementById('map'), // 지도를 표시할 div
mapOption = {
center: new kakao.maps.LatLng(37.566826, 126.9786567), // 지도의 중심좌표
level: 5 // 지도의 확대 레벨
};

var map = new kakao.maps.Map(mapContainer, mapOption); // 지도를 생성합니다

// 지도에 추가된 지도타입정보를 가지고 있을 변수입니다
var currentTypeId;

// 버튼이 클릭되면 호출되는 함수입니다
function setOverlayMapTypeId(maptype) {
var changeMaptype;

    // maptype에 따라 지도에 추가할 지도타입을 결정합니다
    if (maptype === 'traffic') {            
        
        // 교통정보 지도타입
        changeMaptype = kakao.maps.MapTypeId.TRAFFIC;     
        
    } else if (maptype === 'roadview') {        
        
        // 로드뷰 도로정보 지도타입
        changeMaptype = kakao.maps.MapTypeId.ROADVIEW;    

    } else if (maptype === 'terrain') {
        
        // 지형정보 지도타입
        changeMaptype = kakao.maps.MapTypeId.TERRAIN;    

    } else if (maptype === 'use_district') {
        
        // 지적편집도 지도타입
        changeMaptype = kakao.maps.MapTypeId.USE_DISTRICT;           
    }
    
    // 이미 등록된 지도 타입이 있으면 제거합니다
    if (currentTypeId) {
        map.removeOverlayMapTypeId(currentTypeId);    
    }
    
    // maptype에 해당하는 지도타입을 지도에 추가합니다
    map.addOverlayMapTypeId(changeMaptype);
    
    // 지도에 추가된 타입정보를 갱신합니다
    currentTypeId = changeMaptype;        

}

지도 범위 재설정 하기
지도 범위를 재설정합니다. 어떤 좌표나 마커들이 지도에 모두 보여야 할 때 좌표들의 정보를 갖는 LatLngBounds를 사용하여 좌표들이 모두 보이게 지도의 중심좌표와 레벨을 재설정 할 수 있습니다.

30mKakao 맵으로 이동(새창열림)
지도 범위 재설정 하기

직접 해보기Javascript
var mapContainer = document.getElementById('map'), // 지도를 표시할 div
mapOption = {
center: new kakao.maps.LatLng(33.450701, 126.570667), // 지도의 중심좌표
level: 3 // 지도의 확대 레벨
};

var map = new kakao.maps.Map(mapContainer, mapOption); // 지도를 생성합니다

// 버튼을 클릭하면 아래 배열의 좌표들이 모두 보이게 지도 범위를 재설정합니다
var points = [
new kakao.maps.LatLng(33.452278, 126.567803),
new kakao.maps.LatLng(33.452671, 126.574792),
new kakao.maps.LatLng(33.451744, 126.572441)
];

// 지도를 재설정할 범위정보를 가지고 있을 LatLngBounds 객체를 생성합니다
var bounds = new kakao.maps.LatLngBounds();

var i, marker;
for (i = 0; i < points.length; i++) {
// 배열의 좌표들이 잘 보이게 마커를 지도에 추가합니다
marker = new kakao.maps.Marker({ position : points[i] });
marker.setMap(map);

    // LatLngBounds 객체에 좌표를 추가합니다
    bounds.extend(points[i]);

}

function setBounds() {
// LatLngBounds 객체에 추가된 좌표들을 기준으로 지도의 범위를 재설정합니다
// 이때 지도의 중심좌표와 레벨이 변경될 수 있습니다
map.setBounds(bounds);
}

지도 영역 크기 동적 변경하기
지도 객체는 생성될 때 지도 div 크기에 따라 픽셀과 좌표정보를 설정하여 가지고 있습니다. 이 정보로 지도 객체는 지도표시, 마커 표시, 확대, 축소, 이동 등의 좌표 계산 등 지도 표시에 필요한 여러가지 연산을
수행하는데 이때 지도 div의 크기가 변경이 되면 지도객체가 가지고 있는 픽셀과 좌표정보가 div를 표시하는 크기와 달라지기 때문에 지도가 정상적으로 표출되지 않을 수도 있습니다. 그래서 크기를 변경한 이후에는
반드시 relayout 함수를 호출하여 픽셀과 좌표정보를 새로 설정해주어야합니다. window의 resize 이벤트에 의한 크기변경은 map.relayout 함수가 자동으로 호출됩니다.

50mKakao 맵으로 이동(새창열림)
지도 크기 바꾸기 relayout 호출하기

직접 해보기Javascript
var mapContainer = document.getElementById('map'), // 지도를 표시할 div
mapOption = {
center: new kakao.maps.LatLng(33.450701, 126.570667), // 지도의 중심좌표
level: 3 // 지도의 확대 레벨
};

var map = new kakao.maps.Map(mapContainer, mapOption); // 지도를 생성합니다

// 지도를 표시하는 div 크기를 변경하는 함수입니다
function resizeMap() {
var mapContainer = document.getElementById('map');
mapContainer.style.width = '650px';
mapContainer.style.height = '650px';
}

function relayout() {

    // 지도를 표시하는 div 크기를 변경한 이후 지도가 정상적으로 표출되지 않을 수도 있습니다
    // 크기를 변경한 이후에는 반드시  map.relayout 함수를 호출해야 합니다 
    // window의 resize 이벤트에 의한 크기변경은 map.relayout 함수가 자동으로 호출됩니다
    map.relayout();

}

클릭 이벤트 등록하기
지도를 마우스로 클릭했을때 click 이벤트가 발생합니다. 이 예제에서는 지도를 클릭했을 때 지도 아래쪽에 해당 위치의 좌표를 뿌려주고 있습니다.

50mKakao 맵으로 이동(새창열림)
지도를 클릭해주세요!

직접 해보기Javascript
var mapContainer = document.getElementById('map'), // 지도를 표시할 div
mapOption = {
center: new kakao.maps.LatLng(33.450701, 126.570667), // 지도의 중심좌표
level: 3 // 지도의 확대 레벨
};

var map = new kakao.maps.Map(mapContainer, mapOption); // 지도를 생성합니다

// 지도에 클릭 이벤트를 등록합니다
// 지도를 클릭하면 마지막 파라미터로 넘어온 함수를 호출합니다
kakao.maps.event.addListener(map, 'click', function(mouseEvent) {

    // 클릭한 위도, 경도 정보를 가져옵니다 
    var latlng = mouseEvent.latLng;
    
    var message = '클릭한 위치의 위도는 ' + latlng.getLat() + ' 이고, ';
    message += '경도는 ' + latlng.getLng() + ' 입니다';
    
    var resultDiv = document.getElementById('result'); 
    resultDiv.innerHTML = message;

});

클릭한 위치에 마커 표시하기
지도를 마우스로 클릭했을때 click 이벤트가 발생합니다. 이 예제는 지도를 클릭했을 때 해당 위치에 마커를 올리는 예제입니다. 이때 마커는 1개만 생성하여 클릭한 위치로 옮겨주고 있습니다.

50mKakao 맵으로 이동(새창열림)
지도를 클릭해주세요!

직접 해보기Javascript
var mapContainer = document.getElementById('map'), // 지도를 표시할 div
mapOption = {
center: new kakao.maps.LatLng(33.450701, 126.570667), // 지도의 중심좌표
level: 3 // 지도의 확대 레벨
};

var map = new kakao.maps.Map(mapContainer, mapOption); // 지도를 생성합니다

// 지도를 클릭한 위치에 표출할 마커입니다
var marker = new kakao.maps.Marker({
// 지도 중심좌표에 마커를 생성합니다
position: map.getCenter()
});
// 지도에 마커를 표시합니다
marker.setMap(map);

// 지도에 클릭 이벤트를 등록합니다
// 지도를 클릭하면 마지막 파라미터로 넘어온 함수를 호출합니다
kakao.maps.event.addListener(map, 'click', function(mouseEvent) {

    // 클릭한 위도, 경도 정보를 가져옵니다 
    var latlng = mouseEvent.latLng; 
    
    // 마커 위치를 클릭한 위치로 옮깁니다
    marker.setPosition(latlng);
    
    var message = '클릭한 위치의 위도는 ' + latlng.getLat() + ' 이고, ';
    message += '경도는 ' + latlng.getLng() + ' 입니다';
    
    var resultDiv = document.getElementById('clickLatlng'); 
    resultDiv.innerHTML = message;

});

마커 생성하기
지도에 올라가는 핀 모양의 이미지를 마커라고 부릅니다. 아래 예제는 지도 위에 마커를 표시하는 기본 예제입니다.

50mKakao 맵으로 이동(새창열림)
직접 해보기Javascript
var mapContainer = document.getElementById('map'), // 지도를 표시할 div
mapOption = {
center: new kakao.maps.LatLng(33.450701, 126.570667), // 지도의 중심좌표
level: 3 // 지도의 확대 레벨
};

var map = new kakao.maps.Map(mapContainer, mapOption); // 지도를 생성합니다

// 마커가 표시될 위치입니다
var markerPosition = new kakao.maps.LatLng(33.450701, 126.570667);

// 마커를 생성합니다
var marker = new kakao.maps.Marker({
position: markerPosition
});

// 마커가 지도 위에 표시되도록 설정합니다
marker.setMap(map);

// 아래 코드는 지도 위의 마커를 제거하는 코드입니다
// marker.setMap(null);

다른 이미지로 마커 생성하기
원하는 이미지를 사용해서 더 멋진 마커를 만들 수 있습니다. 아래 예제는 마커로 사용할 이미지의 크기나 꼭지점 위치 등을 지정하여 기본 마커 대신 이용하는 예제입니다.

100mKakao 맵으로 이동(새창열림)
직접 해보기Javascript
var mapContainer = document.getElementById('map'), // 지도를 표시할 div
mapOption = {
center: new kakao.maps.LatLng(37.54699, 127.09598), // 지도의 중심좌표
level: 4 // 지도의 확대 레벨
};

var map = new kakao.maps.Map(mapContainer, mapOption); // 지도를 생성합니다

var imageSrc = 'https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/marker_red.png', // 마커이미지의 주소입니다    
imageSize = new kakao.maps.Size(64, 69), // 마커이미지의 크기입니다
imageOption = {offset: new kakao.maps.Point(27, 69)}; // 마커이미지의 옵션입니다. 마커의 좌표와 일치시킬 이미지 안에서의 좌표를 설정합니다.

// 마커의 이미지정보를 가지고 있는 마커이미지를 생성합니다
var markerImage = new kakao.maps.MarkerImage(imageSrc, imageSize, imageOption),
markerPosition = new kakao.maps.LatLng(37.54699, 127.09598); // 마커가 표시될 위치입니다

// 마커를 생성합니다
var marker = new kakao.maps.Marker({
position: markerPosition,
image: markerImage // 마커이미지 설정
});

// 마커가 지도 위에 표시되도록 설정합니다
marker.setMap(map);

인포윈도우 생성하기
텍스트를 올릴 수 있는 말풍선 모양의 이미지를 인포윈도우라고 부릅니다. 아래 예제는 삭제 버튼을 포함한 인포윈도우를 지도에 표시하는 예제입니다.

Hello World!
close50mKakao 맵으로 이동(새창열림)
직접 해보기Javascript
var mapContainer = document.getElementById('map'), // 지도를 표시할 div
mapOption = {
center: new kakao.maps.LatLng(33.450701, 126.570667), // 지도의 중심좌표
level: 3 // 지도의 확대 레벨
};

var map = new kakao.maps.Map(mapContainer, mapOption); // 지도를 생성합니다

var iwContent = '<div style="padding:5px;">Hello World!</div>', // 인포윈도우에 표출될 내용으로 HTML 문자열이나 document element가 가능합니다
iwPosition = new kakao.maps.LatLng(33.450701, 126.570667), //인포윈도우 표시 위치입니다
iwRemoveable = true; // removeable 속성을 ture 로 설정하면 인포윈도우를 닫을 수 있는 x버튼이 표시됩니다

// 인포윈도우를 생성하고 지도에 표시합니다
var infowindow = new kakao.maps.InfoWindow({
map: map, // 인포윈도우가 표시될 지도
position : iwPosition,
content : iwContent,
removable : iwRemoveable
});

// 아래 코드는 인포윈도우를 지도에서 제거합니다
// infowindow.close();        

마커에 인포윈도우 표시하기
마커 위에 인포윈도우를 함께 표시합니다. 인포윈도우에 들어갈 내용은 HTML로 자유롭게 입력할 수 있습니다.

Hello World!
큰지도보기 길찾기
50mKakao 맵으로 이동(새창열림)
직접 해보기Javascript
var mapContainer = document.getElementById('map'), // 지도를 표시할 div 
    mapOption = { 
        center: new kakao.maps.LatLng(33.450701, 126.570667), // 지도의 중심좌표
        level: 3 // 지도의 확대 레벨
    };

var map = new kakao.maps.Map(mapContainer, mapOption);

// 마커가 표시될 위치입니다 
var markerPosition  = new kakao.maps.LatLng(33.450701, 126.570667); 

// 마커를 생성합니다
var marker = new kakao.maps.Marker({
    position: markerPosition
});

// 마커가 지도 위에 표시되도록 설정합니다
marker.setMap(map);

var iwContent = '<div style="padding:5px;">Hello World! <br><a href="https://map.kakao.com/link/map/Hello World!,33.450701,126.570667" style="color:blue" target="_blank">큰지도보기</a> <a href="https://map.kakao.com/link/to/Hello World!,33.450701,126.570667" style="color:blue" target="_blank">길찾기</a></div>', // 인포윈도우에 표출될 내용으로 HTML 문자열이나 document element가 가능합니다
    iwPosition = new kakao.maps.LatLng(33.450701, 126.570667); //인포윈도우 표시 위치입니다

// 인포윈도우를 생성합니다
var infowindow = new kakao.maps.InfoWindow({
    position : iwPosition, 
    content : iwContent 
});
  
// 마커 위에 인포윈도우를 표시합니다. 두번째 파라미터인 marker를 넣어주지 않으면 지도 위에 표시됩니다
infowindow.open(map, marker); 

마커에 클릭 이벤트 등록하기
마커를 마우스로 클릭했을때 click 이벤트가 발생합니다. 이 예제에서는 마커를 클릭했을 때 마커 위에 인포윈도우를 표시하고 있습니다.

50mKakao 맵으로 이동(새창열림)
마커를 클릭해주세요!

직접 해보기Javascript
var mapContainer = document.getElementById('map'), // 지도를 표시할 div 
    mapOption = { 
        center: new kakao.maps.LatLng(33.450701, 126.570667), // 지도의 중심좌표
        level: 3 // 지도의 확대 레벨
    };

var map = new kakao.maps.Map(mapContainer, mapOption); // 지도를 생성합니다
  
// 마커를 표시할 위치입니다 
var position =  new kakao.maps.LatLng(33.450701, 126.570667);

// 마커를 생성합니다
var marker = new kakao.maps.Marker({
  position: position,
  clickable: true // 마커를 클릭했을 때 지도의 클릭 이벤트가 발생하지 않도록 설정합니다
});

// 아래 코드는 위의 마커를 생성하는 코드에서 clickable: true 와 같이
// 마커를 클릭했을 때 지도의 클릭 이벤트가 발생하지 않도록 설정합니다
// marker.setClickable(true);

// 마커를 지도에 표시합니다.
marker.setMap(map);

// 마커를 클릭했을 때 마커 위에 표시할 인포윈도우를 생성합니다
var iwContent = '<div style="padding:5px;">Hello World!</div>', // 인포윈도우에 표출될 내용으로 HTML 문자열이나 document element가 가능합니다
    iwRemoveable = true; // removeable 속성을 ture 로 설정하면 인포윈도우를 닫을 수 있는 x버튼이 표시됩니다

// 인포윈도우를 생성합니다
var infowindow = new kakao.maps.InfoWindow({
    content : iwContent,
    removable : iwRemoveable
});

// 마커에 클릭이벤트를 등록합니다
kakao.maps.event.addListener(marker, 'click', function() {
      // 마커 위에 인포윈도우를 표시합니다
      infowindow.open(map, marker);  
});
