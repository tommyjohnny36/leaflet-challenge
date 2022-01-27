// store our API endpoint as queryUrl
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/4.5_week.geojson"


// perform a GET request to the query URL
d3.json(queryUrl).then(function (data) {
    // send the data.features object to the createFeatures function

    createFeatures(data.features);
});

    function createFeatures(earthquakeData) {


        // * Your data markers should reflect the magnitude of the earthquake by their size and and depth of the earthquake by color. Earthquakes with higher magnitudes should appear larger and earthquakes with greater depth should appear darker in color.
    
        // loop through earthquakes array, and create one marker for each earthquake object

        function chooseColor(data) {

            var color = "";
            if (data.geometry.coordinates[2] > 100) {
                color = "red"
            }
            else if (data.geometry.coordinates[2] > 50) {
                color = "orange"
            }
            else if (data.geometry.coordinates[2] > 20) {
                color = "yellow"
            }
            else {
                color = "green"
            }
            
            return color
 
        }

        function pointToLayer(feature, latlng) {
            // add circles to the map

            var geojsonMarkerOptions = {
                fillOpacity: 0.75,
                color: "white",
                fillColor: chooseColor(feature),
                // adjust the radius
                radius: (feature.properties.mag) * 4
            }
           return L.circleMarker(latlng, geojsonMarkerOptions) 
            
        }
// *********** move L.circle within onEachFeature function ********
        // define a function that we want to run once for each feature in the features array.
        // give each feature a popup that describes the place and time of the earthquake
        function onEachFeature(feature, layer) {
            layer.bindPopup(`<h3><i>Occurred On: ${new Date(feature.properties.time)}</i></h3><hr><h3>At Location: ${feature.properties.place}</h3><hr><h3>With A Magnitude Of: ${feature.properties.mag}</h3>`);   

        }    

            // create a geoJSON layer that contains the features array on the earthquakeData object
            // run the onEachFeature function once for each piece of data in the array
            var earthquakes = L.geoJSON(earthquakeData, {
                onEachFeature: onEachFeature,
                pointToLayer: pointToLayer
            });

            // send our earthquakes layer to the createMap function
            createMap(earthquakes)
        }

        function createMap(earthquakes) {
            // Create the base layers.
        var street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        })
    
        var topo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
            attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
        });
    
                // create a baseMaps object
                var baseMaps = {
                    "Street Map": street,
                    "Topographic Map": topo
                };
    
                // create an overlay object to hold our overlay
                var overlayMaps = {
                    Earthquakes: earthquakes
                };
    
                // create our map, giving it the streetmap and earthquakes layers to display on load
                var myMap = L.map("map", {
                    center: [
                                37.09, -95.71
                                ],
                    zoom: 5,
                    layers: [street, earthquakes]
                    });
    
                // create a layer control
                // pass it our baseMaps and overlayMaps
                // add the layer control to the map
                L.control.layers(baseMaps, overlayMaps, {
                    collapsed: false
                }).addTo(myMap);
}









