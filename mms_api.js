

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

  console.log('query ', query)
  this.sql.execute(query).done(function(data){
    console.log("updated data")
  }).error(function(error){
    console.log("failed to update data")
  })
};


API.prototype.get_data_for_user= function(user_id,callback){
    this.sql.execute("select * from " + this.table_name + " where user_id = '"+user_id +"'").done(
        function(data){
            callback(data);
        }.bind(this)
    ).error(function(error){
      console.log("error with getting user data", error)
    });
}

API.prototype.get_data_for_all= function(callback){
    this.sql.execute("select * from " + this.table_name).done(function(data){
        console.log(JSON.stringify(data));
        geoj.push(data);
        //var myLayer = L.geoJson().addTo(map);
        //myLayer.addData(data);
        //L.geoJson(data).addTo(map);
        var prepping = L.geoJson(data, {

                     onEachFeature: function (feature, layer) {
                         popupOptions = {maxWidth: 200};
                        layer.bindPopup(feature.properties.other_data);
                        coords.push([feature.geometry.coordinates[1], feature.geometry.coordinates[0]]);
                    }

                }).addTo(all_layer_group);
        //var all_layer_group = L.featureGroup(prepping);
        polylineAnim(coords);
        function callback(data) {
      };
    }.bind(this)
    ).error(function(error){
        console.log("error with getting all users ", error);
    })
}

/*
var sql = new cartodb.SQL({ user: 'easherma' });
sql.execute("SELECT * FROM SOTM_test WHERE id > {{id}}", { id: 1 })
  .done(function(data) {
    console.log(data.rows);
  })
  .error(function(errors) {
    // errors contains a list of errors
    console.log("errors:" + errors);
  })*/
