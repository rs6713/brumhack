//import ZingTouch from '../../zingtouch-master/src/ZingTouch.js'


//Logo Color: #0c9b93
//Could later add redundancy so if list input already exists only edit list element with value already in text area
//also at some point need to add bin
//bug that placeholders arent updated and that can submit with empty string
//Default distance slidey bar
//dont need indexes to associate map markers and list markers, associate through location
//bug so right text comes up when click on marker
var OFF=0;
var ON=1;
var ENTER=13;
var defaultDistance=1;
var gestures=[];
var currMarker;

    function locationReminder(lat, lng, descrip, radius){
        this.lat=lat;
        this.lng=lng;
        this.descrip=descrip;
        this.radius=radius; //radius can be empty/set, default can be set
    }
    var locationList=[];

    var settings={
        ringMode:ON,
        vibrateMode:ON
    };
    var uluru = {lat: -25.363, lng: 131.044};
    var map;
    var marker;
    var initMap;



/*
var url = "https://www.googleapis.com/geolocation/v1/geolocate?key=AIzaSyAzxxzSteI3jvI8JA9BbxtnB0YTB7B77_Q";
var method = "POST";
var postData =  { "wifiAccessPoints": [
                    // See the WiFi Access Point Objects section below.
                    {
                        "macAddress": "1A-D2-24-40-B3-D0",
                        "signalStrength": -43,
                        "age": 0,
                        "channel": 11,
                        "signalToNoiseRatio": 0
                    }
                ]};
var async = true;

var request = new XMLHttpRequest();
request.onload = function () {
   var status = request.status; // HTTP response status, e.g., 200 for "200 OK"
   var data = request.responseText; // Returned data, e.g., an HTML document.
   console.log(data);
}

request.open(method, url, async);

request.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
// Or... request.setRequestHeader("Content-Type", "text/plain;charset=UTF-8");
// Or... whatever

// Actually sends the request to the server.
request.send(postData);


// You REALLY want async = true.
// Otherwise, it'll block ALL execution waiting for server response.
var async = true;
*/
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
    } else {
        console.log( "Geolocation is not supported by this browser.");
    }

function showPosition(position) {
    console.log( position.coords.latitude + position.coords.longitude);
   
}






$.fn.toggleClick = function(){
    var methods = arguments, // store the passed arguments for future reference
        count = methods.length; // cache the number of methods 

    //use return this to maintain jQuery chainability
    return this.each(function(i, item){
        // for each element you bind to
        var index = 0; // create a local counter for that element
        $(item).click(function(){ // bind a click handler to that element
            return methods[index++ % count].apply(this,arguments); // that when called will apply the 'index'th method to that element
            // the index % count means that we constrain our iterator between 0 and (count-1)
        });
    });
};


        var addMarkDescription=function(lat, lng, index){
            console.log("mark clicked");
            var descrip="";
            //get description
            $('#marker-descrip').css("visibility","visible");
            $('#marker-descrip').fadeTo( "slow", 1.0 );  
            $('#marker-cancel').click(function(){
                $('#marker-descrip').css("visibility","hidden");
                $('#marker-descrip').fadeTo( "slow", 0.0 ); 
                return;
            });
            $('#marker-submit').click(function(){
                var textval=$('textarea#descrip-txt').val();
                console.log(textval);
                if(textval!=""){
                    var loc=new locationReminder(lat, lng, textval, defaultDistance);
                    locationList.push(loc);
                    $('#marker-descrip').css("visibility","hidden");
                    $('#marker-descrip').fadeTo( "slow", 0.0 ); 
                    return;
                }else{
                    $('#descrip-txt').attr('placeholder','You need to input a description to submit a reminder!');
                    addMarkDescription(lat,lng,index);
                }   
            });
        }

    $(document).ready(function () {
        var c=document.getElementById("canvas");
        var ctax=c.getContext("2d");

        initMap =function() {
            map = new google.maps.Map(document.getElementById('map'), {
                zoom: 10,
                mapTypeControl:false,
                zoomControl:false,
                streetViewControl:false,
                center: uluru,
                styles: [
                    {elementType: 'geometry', stylers: [{color: '#96E7E3'}]},
                    //{elementType: 'labels.text.stroke', stylers: [{color: '#242f3e'}]},
                    {elementType: 'labels.text.fill', stylers: [{color: '#0c9b93'}]},
                    {
                    featureType: 'road',
                    elementType: 'geometry',
                    stylers: [{color: '#FFFFFF'}]
                    },
                    {
                    featureType: 'road.highway',
                    elementType: 'geometry',
                    stylers: [{color: '#A1C5D4'}]
                     },
                
                    {
                    featureType: 'transit',
                    elementType: 'labels.text',
                    stylers: [{color: '#15749C'}]
                    }
                
                /*,
                    {
                        featureType: "road",
                        elementType: "labels.icon",
                     stylers: [{color: '#D286D4'}]
                    }*/,
                    {
                        featureType: "road",
                        elementType: "labels.text",
                     stylers: [{color: '#FFFFFF'}]
                    }
                ]
            });
            marker = new google.maps.Marker({
                position: uluru,
                map: map,
                icon: "./assets/css/images/icon/coordinate.png"
            });
        var input = $('#location-in')[0];//document.getElementById('location-id');//$('#location-in')[0];
        var searchBox = new google.maps.places.SearchBox(input);
       // map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

        // Bias the SearchBox results towards current map's viewport.
        map.addListener('bounds_changed', function() {
          searchBox.setBounds(map.getBounds());
        });

/*
          // Clear out the old markers.
          markers.forEach(function(marker) {
            marker.setMap(null);
          });
          markers = [];
*/
        var markers = [];
        // Listen for the event fired when the user selects a prediction and retrieve
        // more details for that place.
        searchBox.addListener('places_changed', function() {
          var places = searchBox.getPlaces();

          if (places.length == 0) {
            return;
          }

          // For each place, get the icon, name and location.
          var bounds = new google.maps.LatLngBounds();
          places.forEach(function(place) {
            if (!place.geometry) {
              console.log("Returned place contains no geometry");
              return;
            }
            var icon = {
              url: place.icon,
              size: new google.maps.Size(71, 71),
              origin: new google.maps.Point(0, 0),
              anchor: new google.maps.Point(17, 34),
              scaledSize: new google.maps.Size(25, 25)
            };
/*
            // Clear out the old markers.
            markers.forEach(function(marker) {
                marker.setMap(null);
            });
            markers = [];
*/

            // Create a marker for each place.
            let newMark=new google.maps.Marker({
              map: map,
              title: place.name,
              position: place.geometry.location,
              icon: "./assets/css/images/icon/coordinate.png"
            });
            google.maps.event.addListener(newMark, 'click', function() { 
                currMarker=newMark.position;
                addMarkDescription(place.geometry.location.lat, place.geometry.location.lng, markers.length);
            });
            markers.push(newMark);

            if (place.geometry.viewport) {
              // Only geocodes have viewport.
              bounds.union(place.geometry.viewport);
            } else {
              bounds.extend(place.geometry.location);
            }
          });
          map.fitBounds(bounds);
        });
        } 



            
      
/*
        $('#location-in').keydown(function (e){
            if(e.keyCode == ENTER){
                alert('you pressed enter ^_^');
            }
        })
*/




        //Remove default background when map in focus
        $('#def-bg').focus(function(){
            $('#def-bg').fadeOut(1000);
        }); 
        $('#location-in').focus(function(){
            $('#def-bg').fadeOut(1000);
        }); 

        $("#settings-page span:nth-child(2)").toggleClick(function() {
           $(this).css("background-image", "url('./assets/css/images/icon/ring_closed.png')");  
           settings.ringMode=OFF;
        }, function() {
            $(this).css("background-image", "url('./assets/css/images/icon/ring.png')"); 
            settings.ringMODE=ON; 
        });

        $("#settings-page span:nth-child(3)").toggleClick(function() {
            $(this).css("background-image", "url('./assets/css/images/icon/vibrate_closed.png')");  
            settings.vibratMode=OFF;
        }, function() {
            $(this).css("background-image", "url('./assets/css/images/icon/vibrate.png')"); 
            settings.vibrateMode=ON; 
        });

        //Handles clicking of settings
        //Background fade
        $("#settings-button").click(function(){
            //$('#def-bg').fadeIn(1000);
            $('#settings-page').css("visibility","visible");
            $('#settings-page').fadeTo( "slow", 1.0 );
            //$('#settings-page').fadeIn(1000);
        });
        $("#settings-back").click(function(){
            //$('#def-bg').fadeIn(1000);
            $('#settings-page').fadeTo( "slow", 0.0, function(){
                $('#settings-page').css("visibility","hidden");
            } );
           
        });

        //Handles draw click
        $("#draw").click(function(){
           document.getElementById("map").style.cursor = "pointer";
           console.log("draw clicked");
           $('#map-overlay').css("visibility", "visible");
           $("#map-overlay").click(function(){
               console.log("sup");
                var x = (event.clientX);
                var y=(event.clientY); 
                var bounds = map.getBounds();
                var ne = bounds.getNorthEast(); // LatLng of the north-east corner
                var sw = bounds.getSouthWest(); // LatLng of the south-west corder
                var map_width=ne.lat()-sw.lat();
                var map_height=sw.lng()-ne.lng();
                var pg_height=document.getElementById('map').clientHeight;
                var pg_width=document.getElementById('map').clientWidth;

                var gestures=[];

                $("#canvas").css("visibility", "visible");
                //origin x and y in terms of canvas
                var origin_x= ((currMarker.lat()-sw.lat())/map_width)*canvas.width;
                var origin_y= ((currMarker.lng()-ne.lng())/map_height)*canvas.height;
                var lefty=origin_x*(document.getElementById('map-overlay').clientWidth/canvas.width);
                var toppy=origin_y*(document.getElementById('map-overlay').clientHeight/canvas.height);
                console.log("toppy"+document.getElementById('map-overlay').clientWidth);
                console.log("lefty"+document.getElementById('map-overlay').clientHeight);
                $("#red-dot").css("left",lefty+"px");
                $("#red-dot").css("top",toppy+"px");


                var sup=document.getElementById('map-overlay');//map-overlay
                var reg=document.getElementById('map-overlay');
                var canvasRegion = new ZingTouch.Region(reg);
                //SWIPING

                ctax.clearRect(0, 0, canvas.width, canvas.height);
                ctax.beginPath();
                ctax.moveTo(origin_x,origin_y);//origin x and y are in canvas
                ctax.arc(origin_x,origin_y,20,0,2*Math.PI);
                ctax.moveTo(origin_x,origin_y);
                canvasRegion.bind(sup, 'pan', function(e) {
                    
                    var dist=e.detail.data[0].distanceFromOrigin;
                    var dir=e.detail.data[0].directionFromOrigin;
                    var obj=[dist,dir];
                    gestures.push(obj);
                    var x=origin_x+ dist*Math.cos(dir);
                    var y=origin_y+ dist*Math.sin(dir);
                    console.log(obj);
                    console.log("origx"+origin_x);
                    console.log("x:"+ x + "canvas:" + canvas.width);
                    console.log("y:"+ y + "canvas:" + canvas.height);
                    ctax.lineTo(x,y); 
                    ctax.stroke();
                });
               
/*          
                for(var i=0; i<gestures.length;i++){
                    console.log("omg");
                    var x=origin_x+ gestures[i][0]*Math.cos(gestures[i][1]);
                    var y=origin_y+ gestures[i][0]*Math.sin(gestures[i][1]);
                    ctx.lineTo(x,y);     
                }*/
                    
                    /*
                setOutput([
                    ['Gesture', 'Swipe'],
                    ['velocity', Math.floor(e.detail.data[0].velocity) + "px/ms"],
                    ['currentDirection', Math.floor(e.detail.data[0].currentDirection) + "°"]
                ]);

                var canvas = document.getElementById('main-canvas');
                var canvasRect = canvas.getBoundingClientRect();
                var x = e.detail.events[0].x - canvasRect.left;
                var y = e.detail.events[0].y - canvasRect.top;

                bubbles[lastIndex].x = (x < 0) ? 0 : (x > canvasRect.width) ? canvasRect.width : x;
                bubbles[lastIndex].y = (y < 0) ? 0 : (y > canvasRect.height) ? canvasRect.height : y;
                var theta = Math.sin((Math.PI / 180) * e.detail.data[0].currentDirection);
                bubbles[lastIndex].vy = -1 * (2 * (e.detail.data[0].velocity * Math.sin((Math.PI / 180) * e.detail.data[0].currentDirection)));
                bubbles[lastIndex].vx = 2 * (e.detail.data[0].velocity * Math.cos((Math.PI / 180) * e.detail.data[0].currentDirection));*/

                //Identify the nearest 

            });

        });
    });


