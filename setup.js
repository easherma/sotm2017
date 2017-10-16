var CartoDB = require('cartodb');
var credentials = require('./carto_config');

var sql = new CartoDB.SQL(credentials);
var db_name = credentials.db_name;
var user_name = credentials.user;

var schema = {
    user_id  : 'TEXT',
    the_geom    : 'GEOMETRY',
    path_order    : 'NUMERIC',
    other_data : 'JSON'
};

var construct_schema = function(schema,with_cartodb_id){
    var pairs = Object.keys(schema).map(function(key){ return [key,schema[key]].join(' ') }); 
    return pairs.join(", ");
};

var create_database = function(db_name, schema){
    var schema_string  = construct_schema(schema);

    console.log("Creating databsae: ",db_name);
    console.log("With Schema: ", schema_string);
    console.log("CREATE TABLE IF NOT EXISTS "+db_name+" ( " +schema_string+" )")
    return sql.execute("CREATE TABLE IF NOT EXISTS "+db_name+" ( " +schema_string +" )")
};

var cartodbify_table = function (db_name, username, team){
    if (team){
        return sql.execute("SELECT CDB_CARTODBFYTable('" + username + "', '" + db_name + "');");
    }
    else{
        return sql.execute("SELECT CDB_CARTODBFYTable('"+ db_name + "');");
    }
};

var create_update_function = function(db_name,schema){
    var schema_string  = construct_schema(schema);
    var function_def = "UPDATE_"+db_name+"( "+schema_string +" )";
    var query = "CREATE OR REPLACE FUNCTION "+function_def+ " RETURNS VOID AS $$ "+
    "INSERT INTO " + db_name + " ( "+ Object.keys(schema).join(", ") + ")  VALUES ( "+Object.keys(schema).join(", ") +") \n" + 
    "$$ LANGUAGE SQL \n"+
    "SECURITY DEFINER \n"+
    "RETURNS NULL ON NULL INPUT;\n" + 
    "GRANT EXECUTE ON FUNCTION "+function_def+" TO  publicuser;";
    console.log('running create function query');
    console.log(query);
    return sql.execute(query)
}

create_database(db_name, schema).done(function(){
    console.log("created_database")
    cartodbify_table(db_name, user_name, credentials.team).done(function(){
        console.log("CARTODBIFIED now creating update function");
        create_update_function(db_name, schema).error(function(error){
            console.log("something went wrong with the create function function")
            console.log(error)
        });
    }).error(function(error){
        console.log(error)
    });
}).error(function(error){
    console.log("Something went wrong creating the DB");
    console.log(error);
});
