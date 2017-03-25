//Logo Color: #0c9b93
//Could later add redundancy so if list input already exists only edit list element with value already in text area
//also at some point need to add bin
//bug that placeholders arent updated and that can submit with empty string
//Default distance slidey bar
//dont need indexes to associate map markers and list markers, associate through location
var OFF=0;
var ON=1;
var ENTER=13;
var defaultDistance=1;

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
           
        });
    });


