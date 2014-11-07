//Controller.js


var controller = {}; 

var flickr = {};

//var view = {};


/****************************DOCUMENT READY***********************************/


$(function(){
	
	/*FANCYBOX*/
	$("#fancybox").fancybox({
    	openEffect	: 'elastic',
    	closeEffect	: 'elastic',
		
    	helpers : {
    		title : {
    			type : 'inside'
    		}
    	}
    });
	
	
	/* FIRST CLEAR THE SEARCH FIELD AND THE 
		USERNAME FIELD	*/
	$('#searchValue').val('');
	$('#userValue').val('');
	
	/* HIDE THE PHOTO AREA */
	$('#photoArea').hide();
	
	//SEE IF THERE IS LOGIN INFO
	//flickr.checkLogin();
	
	/* ACTION FOR BACK BUTTON CLICK 
		REMOVES PHOTOS AND SHOWS SPLASH SCREEN*/
	$('#back').click(function(){
		$('#searchValue').val('');
		$('#userValue').val('');
		$('#splashDiv').show();
		$('#photoArea').hide();
	});
	
	
	$('#searchValue').keydown(function(event){
		//check the keyboard event for enter (13)
		//if it is then use the search function with 
		//the search value
		if(event.which == 13){
			var searchVal = $("#searchValue").val();
			//console.log(searchVal);
			flickr.searchPhotos(searchVal);
		}
	});
	
	$('#userValue').keydown(function(event){
		//check the keyboard event for enter (13)
		//if it is then use the search function with 
		//the search value
		if(event.which == 13){
			var userVal = $("#userValue").val();
			//console.log(userVal);
			flickr.searchUser(userVal);
		}
	});
	
	/* ACTION FOR SEARCH BUTTON CLICK 
	$('#searchBtn').click(function(){
		var searchVal = $("#searchValue").val();
		flickr.searchPhotos(searchVal);
	});*/
	
	/* ACTION FOR USER SEARCH BUTTON CLICK */
	$('#userNameBtn').click(function(){
		var userVal = $("#userValue").val();
		flickr.searchUser(userVal);
	});
});	


/****************************CONTROLLER FUNCTIONS************************************/


var app = angular.module('photoApp', []);
app.controller('PhotoReady', function($scope){
    $scope.photos =[]; 
    $scope.photoReady = function(photoData){
        $scope.photos = photoData;
        //console.log("applying");
        $scope.$apply(); //apply() to update changes since outside angular
    }
    flickr.getInterestingness($scope.photoReady);
    
    //search button clicked
    $scope.search = function(){
        var searchText = $scope.searchText;
        flickr.search(searchText, $scope.photoReady);
    }

});


controller.showPhotos = function(){
    $('#splashDiv').hide();
	$('#photoArea').show();
}		



//function for the "Login" Button.
controller.loginButtonPressed = function (){
	flickr.userLogin();
}

controller.displayName = function(name){
    $('#loginButton').remove();
    $('#button').html("Welcome " + name);
    //$( "div.button" ).replaceWith( "<div><h4>Welcome " + name + "</h4></div>" );
    return false;
}



