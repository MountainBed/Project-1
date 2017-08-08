var userIngredientArray = [];
var maxIngredients = 3;
var maxRecipes = 9;
var recipeID = [];
var recipeNames = [];
var latitude;
var longitude;
var map;

function checkNum (arr) {
  if (arr.length !== maxIngredients) {
    return false;
  } else {
    return true;
  }
};
function checkLet (arr) {
  var regex = /^[a-zA-Z]+$/;
  var bool = true;

  for (var i = 0; i < arr.length; i++) {
    if (!(regex.test(arr[i]))) {
      bool = false;
    }
  }
  return bool;
};
function buildArray (a, b, c) {
  var arr = [];
  var finalArr = [];
  arr.push(a, b, c);
  for (var i = 0; i < arr.length; i++) {
    if (arr[i] !== "") {
      finalArr.push(arr[i]);
    }
  }
  return finalArr;
};
function buildIngredientURL (array) {
  var searchquery = "&allowedIngredient[]=";
  var ingredientArray = array;

  for (var i = 0; i < ingredientArray.length; i++) {
    if (i < ingredientArray.length - 1) {
      searchquery += ingredientArray[i];
      searchquery += "&allowedIngredient[]=";
    } else {
      searchquery += ingredientArray[i];
    }
  }
  return searchquery;
};
function yummlyAPI (e) {
  e.preventDefault();

  var firstIngredient = $("#firstIngredient").val().trim();
  var secondIngredient = $("#secondIngredient").val().trim();
  var thirdIngredient = $("#thirdIngredient").val().trim();

  userIngredientArray = buildArray(firstIngredient, secondIngredient, thirdIngredient);

  var appID = "1178d920";
  var apiKEY = "9444249c26105ff9651c6b6d9088c564";
  var userStr = buildIngredientURL(userIngredientArray);
  var queryURL = "https://api.yummly.com/v1/api/recipes?_app_id=" + appID + "&_app_key=" + apiKEY + userStr;

  recipeID = [];
  recipeNames = [];

  if (checkNum(userIngredientArray) && checkLet(userIngredientArray)) {
    $.ajax({
      url: queryURL,
      method: "GET",
      async: false,
      success: function (response) {
        var results = response;
        var numRecipe = Math.min(maxRecipes, response.matches.length);
        var attributionDiv = $("<div>");
        $("#recipe-area").empty();
        $("#firstIngredient").val("");
        $("#secondIngredient").val("");
        $("#thirdIngredient").val("");

        attributionDiv.html("<br>" + results.attribution.html);

        $("#recipe-area").css("height", "100%");
        for (var i = 0; i < numRecipe; i++) {
          recipeID.push(results.matches[i].id);
          recipeNames.push(results.matches[i].recipeName);

          var recipeDiv = $("<div class='recipe-display col s4 center-align'>");
          var recipeImg = $("<img class='responsive-img recipe-img'>");
          var recipeLink = $("<a>");
          var recipeNameDisp = $("<p class='valign-wrapper'>");
          var newURL = "https://api.yummly.com/v1/api/recipe/" + recipeID[i] + "?_app_id=" + appID + "&_app_key=" + apiKEY;

          $.ajax({
            url: newURL,
            method: "GET",
            async: false,
            success: function (response) {
              var recipeResults = response;
              recipeImg.attr("src", recipeResults.images[0].imageUrlsBySize["360"]);
              recipeLink.attr("href", recipeResults.source.sourceRecipeUrl);
              recipeLink.attr("target", "_blank");
              recipeNameDisp.text(recipeResults.source.sourceDisplayName + ": " + recipeResults.name);

              recipeLink.append(recipeNameDisp);
              recipeLink.append(recipeImg);
              recipeDiv.append(recipeLink);
            }
          });

          $("#recipe-area").prepend(recipeDiv);
        }

        $("#recipe-area").append(attributionDiv);
      }
    });
  } else {
    $("#modal1").modal("open");
  }
};
function initMap () {
  $("#recipe-area").empty();
  $("#recipe-area").css("height", "600px");
  navigator.geolocation.getCurrentPosition(function (position) {
    latitude = (position.coords.latitude);
    longitude = (position.coords.longitude);

    var mapOptions = {
      center: { lat: latitude, lng: longitude },
      zoom: 15,
      styles: [
        {
          "elementType": "geometry",
          "stylers": [
            {
              "color": "#ebe3cd"
            }
          ]
        },
        {
          "elementType": "labels.text.fill",
          "stylers": [
            {
              "color": "#523735"
            }
          ]
        },
        {
          "elementType": "labels.text.stroke",
          "stylers": [
            {
              "color": "#f5f1e6"
            }
          ]
        },
        {
          "featureType": "administrative",
          "elementType": "geometry.stroke",
          "stylers": [
            {
              "color": "#c9b2a6"
            }
          ]
        },
        {
          "featureType": "administrative.land_parcel",
          "elementType": "geometry.stroke",
          "stylers": [
            {
              "color": "#dcd2be"
            }
          ]
        },
        {
          "featureType": "administrative.land_parcel",
          "elementType": "labels.text.fill",
          "stylers": [
            {
              "color": "#ae9e90"
            }
          ]
        },
        {
          "featureType": "landscape.natural",
          "elementType": "geometry",
          "stylers": [
            {
              "color": "#dfd2ae"
            }
          ]
        },
        {
          "featureType": "poi",
          "elementType": "geometry",
          "stylers": [
            {
              "color": "#dfd2ae"
            }
          ]
        },
        {
          "featureType": "poi",
          "elementType": "labels.text",
          "stylers": [
            {
              "visibility": "off"
            }
          ]
        },
        {
          "featureType": "poi",
          "elementType": "labels.text.fill",
          "stylers": [
            {
              "color": "#93817c"
            }
          ]
        },
        {
          "featureType": "poi.business",
          "stylers": [
            {
              "visibility": "off"
            }
          ]
        },
        {
          "featureType": "poi.park",
          "elementType": "geometry.fill",
          "stylers": [
            {
              "color": "#a5b076"
            }
          ]
        },
        {
          "featureType": "poi.park",
          "elementType": "labels.text.fill",
          "stylers": [
            {
              "color": "#447530"
            }
          ]
        },
        {
          "featureType": "road",
          "elementType": "geometry",
          "stylers": [
            {
              "color": "#f5f1e6"
            }
          ]
        },
        {
          "featureType": "road",
          "elementType": "labels.icon",
          "stylers": [
            {
              "visibility": "off"
            }
          ]
        },
        {
          "featureType": "road.arterial",
          "elementType": "geometry",
          "stylers": [
            {
              "color": "#fdfcf8"
            }
          ]
        },
        {
          "featureType": "road.highway",
          "elementType": "geometry",
          "stylers": [
            {
              "color": "#f8c967"
            }
          ]
        },
        {
          "featureType": "road.highway",
          "elementType": "geometry.stroke",
          "stylers": [
            {
              "color": "#e9bc62"
            }
          ]
        },
        {
          "featureType": "road.highway.controlled_access",
          "elementType": "geometry",
          "stylers": [
            {
              "color": "#e98d58"
            }
          ]
        },
        {
          "featureType": "road.highway.controlled_access",
          "elementType": "geometry.stroke",
          "stylers": [
            {
              "color": "#db8555"
            }
          ]
        },
        {
          "featureType": "road.local",
          "elementType": "labels.text.fill",
          "stylers": [
            {
              "color": "#806b63"
            }
          ]
        },
        {
          "featureType": "transit",
          "stylers": [
            {
              "visibility": "off"
            }
          ]
        },
        {
          "featureType": "transit.line",
          "elementType": "geometry",
          "stylers": [
            {
              "color": "#dfd2ae"
            }
          ]
        },
        {
          "featureType": "transit.line",
          "elementType": "labels.text.fill",
          "stylers": [
            {
              "color": "#8f7d77"
            }
          ]
        },
        {
          "featureType": "transit.line",
          "elementType": "labels.text.stroke",
          "stylers": [
            {
              "color": "#ebe3cd"
            }
          ]
        },
        {
          "featureType": "transit.station",
          "elementType": "geometry",
          "stylers": [
            {
              "color": "#dfd2ae"
            }
          ]
        },
        {
          "featureType": "water",
          "elementType": "geometry.fill",
          "stylers": [
            {
              "color": "#b9d3c2"
            }
          ]
        },
        {
          "featureType": "water",
          "elementType": "labels.text.fill",
          "stylers": [
            {
              "color": "#92998d"
            }
          ]
        }
      ]
    };
    map = new google.maps.Map(document.getElementById("recipe-area"), mapOptions);
    var request = {
      location: mapOptions.center,
      radius: "2000",
      type: ["restaurant"]
    };
    service = new google.maps.places.PlacesService(map);
    service.nearbySearch(request, callback);
  }, function () {
    // Google documentation said to have this, so it was not replaced with a modal.
    $("#recipe-area").html("<p>There was an error generating the map...");
  });
};

function callback (results, status) {
  if (status === google.maps.places.PlacesServiceStatus.OK) {
    for (var i = 0; i < results.length; i++) {
      createMarker(results[i]);
    }
  }
};
function createMarker (place) {
  var infowindow = new google.maps.InfoWindow();
  var marker = new google.maps.Marker({
    map: map,
    position: place.geometry.location,
    icon: "assets/images/Food-Cutlery-icon.png"
  });
  var markerCurrent = new google.maps.Marker({
    map: map,
    position: { lat: latitude, lng: longitude }
  });

  google.maps.event.addListener(marker, "click", function () {
    infowindow.setContent(place.name);
    infowindow.open(map, this);
  });
  google.maps.event.addListener(markerCurrent, "click", function () {
    infowindow.setContent("You are here");
    infowindow.open(map, this);
  });
};

$(document).ready(function () {
  $(".slider").slider();
  $(".button-collapse").sideNav();
  $("#modal1").modal();

  $("#search-recipe").on("click", yummlyAPI);
  $("#search-rest").on("click", initMap);
});
