//Logo Color: #0c9b93


    var uluru = {lat: -25.363, lng: 131.044};
    var map;
    var marker;
    var initMap;

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
        }
        //Remove default background when map in focus
        $('#def-bg').focus(function(){
            $('#def-bg').fadeOut(1000);
        }); 

        //Handles clicking of settings
        //Background fade
        $("#settings-button").click(function(){
            $('#def-bg').fadeIn(1000);
        });

        //Handles draw click
        $("#draw").click(function(){
           
        });
    });


