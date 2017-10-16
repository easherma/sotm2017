

function API(username, table_name){
    this.username=username;
    this.table_name = table_name;
    this.sql = new cartodb.SQL({user:username, format: 'geojson'});
};


API.prototype.post_data = function(user_id, point, order, data , callback){
   var query = 'select null::GEOMETRY as the_geom,  UPDATE_'+this.table_name +' ( '+ user_id + '::text '+
  ', CDB_LATLNG(' + point.lat + ", "+point.lng+") "+
  ", "+order + "::Numeric "+
  ", '"+JSON.stringify(data)+ "'::json)"
  //console.log("sending data: ")
  //console.log(data)
  //console.log('query ', query)
  this.sql.execute(query).done(function(data){
    //console.log("updated data")
    $(".leaflet-bar.leaflet-control.leaflet-control-custom").remove();
    update_map();
  }).error(function(error){
    //console.log("failed to update data")
  })
};


API.prototype.get_data_for_user= function(user_id){
    this.sql.execute("select * from " + this.table_name + " where user_id = '"+user_id +"'").done(
        function(data){
            callback(data);
        }.bind(this)
    ).error(function(error){
      //console.log("error with getting user data", error)
    });
}

API.prototype.get_data_for_all= function(callback){

    this.sql.execute("SELECT user_id, array_agg(cartodb_id) carto_ids, ST_MakeLine(ST_FlipCoordinates(the_geom)) AS the_geom, json_agg(other_data) other_data, array_agg(path_order ORDER BY path_order) path_order FROM " + this.table_name + " GROUP BY user_id  ORDER by path_order").done(function(data){
        //console.log(data);
        //console.log(L.geoJson(data));
        //console.log(data.features.length);

         geoj = L.geoJSON(data, {

                     onEachFeature: function (feature, layer) {
                         popupOptions = {maxWidth: 200};
                        //layer.bindPopup(feature.properties.other_data);
                        color = getRandomColor();


                        var labelData = feature.properties.other_data;
                        //console.log(labelData.length);
                        labels = [];
                        for (var i = 0; i < labelData.length; i++) {
                          labels.push("<b>Point " + (labelData.length - i ) + ": </b>" + labelData[i]['pelias_properties']['label'] +"<br>" /* + "<br>/* Description: " +  labelData[i]['description'] + *"<br> Name: " + labelData[i]['name']*/
                        )
                          ////console.log(labelData[i]);
                        }

                        var chosenLabels = JSON.stringify(labels).replace(/\"/g, "").replace(/[\[\]']+/g, '').replace(/,/g , '');
                        ////console.log(labelData[0].pelias_properties);
                        ////console.log(labelData);
                        coords = feature.geometry.coordinates;
                        polylineAnim(feature.geometry.coordinates, chosenLabels)
                        ////console.log(feature.geometry.coordinates.length);

                        //polylineAnim(coords);
                        //var line = L.polyline(feature.geometry.coordinates, {snakingSpeed: 200});
                        //line.addTo(all_layer_group);
                        //L.polyline(feature.geometry.coordinates).addTo(map).snakeIn();
                    }

                });
                //polylineAnim(coords);*/

        //geoj.push(L.geoJSON(data));
        //var myLayer = L.geoJson().addTo(map);
        //myLayer.addData(data);
        //L.geoJson(data).addTo(map);
        /*var prepping = L.geoJson(data, {

                     onEachFeature: function (feature, layer) {
                         popupOptions = {maxWidth: 200};
                        layer.bindPopup(feature.properties.other_data);
                        color = getRandomColor();
                        var line = L.polyline([feature.geometry.coordinates[1], feature.geometry.coordinates[0]], {snakingSpeed: 200, color:color});
                          (line);
                        line.addTo(map).snakeIn();
                        coords.push([feature.geometry.coordinates[1], feature.geometry.coordinates[0]]);
                    }

                }).addTo(all_layer_group);*/

        //var all_layer_group = L.featureGroup(prepping);


        function callback(data) {
      };
    }.bind(this)
    ).error(function(error){
        //console.log("error with getting all users ", error);
    })
}

/*
var sql = new cartodb.SQL({ user: 'easherma' });
sql.execute("SELECT * FROM SOTM_test WHERE id > {{id}}", { id: 1 })
  .done(function(data) {
    //console.log(data.rows);
  })
  .error(function(errors) {
    // errors contains a list of errors
    //console.log("errors:" + errors);
  })*/
