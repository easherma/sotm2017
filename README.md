then just do api.post_data("1", {lat:2, lng:3},1,{name: 'stuart', other: '5'})
to update a record
so "1" here is the user id
the {lat: 2 , lng:3} is the location
the second 1 is the order of the points in the line (just for book keeping)
and the last argument is any other data you want stored on there
