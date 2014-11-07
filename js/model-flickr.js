/* 
Javascript file for DMS labs.
Created by Gilbert Eaton - s2795921
*/


flickr.apiKey = 'cce08ab8a29ffef96da314bc4797f207';

flickr.ss = '895d904af6037a69';


//array for photo elements
flickr.photoData = [];
	
//conter for returned responses
flickr.respSize = 0;

//number of photos
flickr.photosLength = 0;

// to store the call back function
flickr.photoReadyCallBack; 



/****************************DATA************************************/


//GETS THE INTERESTING PHOTOS - INITIAL METHOD OF DISPLAYING
//ALSO HIDES THE SPLASH AND DISPLAYS THE PHOTOAREA
		
flickr.getInterestingness = function(callback){
    flickr.photoReadyCallBack = callback; // assign callback
    //url of interesting
    var url = "https://api.flickr.com/services/rest/?method=flickr.interestingness.getList&api_key="+ flickr.apiKey + "&per_page=21&format=json&nojsoncallback=1";
    var signedUrl = flickr.getSignatureUrl(url);
        
    $.get(signedUrl, function(data){
		//console.log("json = "+ data.photos.photo[0].id);
		flickr.loadPhotos(data.photos.photo);
	});
    
}


flickr.loadPhotos = function(photos){
	flickr.photoData = [];
	flickr.respSize = 0;
	//Hide the loading gif
	$("#loadingDiv").hide();
	
	//number of photos
	flickr.photosLength = photos.length;
	
	//search all the photos
	for(var i = 0; i < flickr.photosLength; i++){	

		flickr.getSizes(photos[i].id, photos[i].owner, photos[i].title);
	
	}
}

flickr.getSizes = function(photoId, photoOwner, photoTitle) {
    //url of getSizes
    var url = "https://api.flickr.com/services/rest/?method=flickr.photos.getSizes&api_key=" + flickr.apiKey +"&photo_id=" + photoId + "&format=json&nojsoncallback=1";
    var signedUrl = flickr.getSignatureUrl(url);
	$.get(signedUrl, function(data){
			var thumbUrl = data.sizes.size[1].source;
			var bigUrl = data.sizes.size[data.sizes.size.length-1].source;
			console.log(photoTitle);
			//console.log(thumbUrl);
			flickr.photoData.push({id:photoId, thumb:thumbUrl, big:bigUrl, owner:photoOwner, title:photoTitle});
			flickr.respSize++;
			if (flickr.respSize == flickr.photosLength){
				flickr.photoReadyCallBack(flickr.photoData);
			}
	});
}


//SEARCH USING SEARCH STRING

flickr.searchUser = function(value){
    //url of user search
    var url = "https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key="+ flickr.apiKey + "&user_id=" + value + "&per_page=21&format=json&nojsoncallback=1";
    var signedUrl = flickr.getSignatureUrl(url);
    $.get(signedUrl, function(data){
		flickr.loadPhotos(data.photos.photo);
	});
}


//SEARCH USING USER ID

flickr.searchPhotos = function(value){
    //url of user string search
    var url = "https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key="+ flickr.apiKey + "&text=" + value + "&per_page=21&format=json&nojsoncallback=1";
    var signedUrl = flickr.getSignatureUrl(url);
    $.get(signedUrl, function(data){
		flickr.loadPhotos(data.photos.photo);
	});
}


//GET THE DIGITAL SIGNATURE

flickr.getSignatureUrl = function(url){
    //get the parts of the url befor and after the "?"
    var urlBits = url.split("?");
    //slit the second part into the individual requests
    var params = urlBits[1].split("&");
    //sort them in order
    params = params.sort();
    //take out the "="
    for (var i = 0; i < params.length; i++){
        params[i] = params[i].replace("=", "");
    }
    //join the array values
    var stringToSign = params.join("");

    //add the secret to the string
    stringToSign = flickr.ss + stringToSign;
    
    //create the signature
    var signature = CryptoJS.MD5(stringToSign);
    
    //add the signature to url
    var signedUrl = url + "&api_sig=" + signature;
    
    return signedUrl;
}


//LOG THE USER IN AND GET INFORMATION

flickr.userLogin = function(){
    //url of FROB REQUEST
    var url = "https://api.flickr.com/services/rest/?method=flickr.auth.getFrob&api_key="+ flickr.apiKey + "&format=json&nojsoncallback=1";
    var signedUrl = flickr.getSignatureUrl(url);
    //console.log(signedUrl);
    $.get(signedUrl, function(data){
        //get the frob from the response data
		var frob = data.frob._content;
		
		//add to the request
		var loginUrl = "https://api.flickr.com/services/auth/?api_key="+ flickr.apiKey + "&perms=write&frob="+ frob + "";
		var signedLogin = flickr.getSignatureUrl(loginUrl);
		
		//open new window with login and authorisation screen
	    window.open(signedLogin);//,"win", "width=800, height=600");
        
        //check the 'OK' button has been clicked then try to get user info
        var r = confirm("Press OK when logged in...");
        if (r == true) {
            flickr.getUserInfo(frob);
        } else {
            //nothing
        }
	});
}


flickr.getUserInfo = function(frob){
    //request to get the token
    var tokenUrl = "https://api.flickr.com/services/rest/?method=flickr.auth.getToken&api_key="+ flickr.apiKey + "&format=json&nojsoncallback=1&frob="+ frob + "";
    var signedTokenReq = flickr.getSignatureUrl(tokenUrl);
    $.get(signedTokenReq, function(response){
        //get token from the response
        var token = response.auth.token._content;
        
        //gets the name as the info is there
        var name = response.auth.user.fullname;
        console.log(name);
        
        //method to display the name if present
        if(name){
            controller.displayName(name);
        }
        
        ///THIS DOES NOT WORK BUT SHOULD???
        var userUrl = "https://api.flickr.com/services/rest/?method=flickr.people.getInfo&format=json&nojsoncallback=1&api_key="+ flickr.apiKey + "&auth_token=" + token + "";
        var signedUserUrl = flickr.getSignatureUrl(userUrl);
        console.log(signedUserUrl);
        $.get(signedUserUrl, function(response){
            console.log(response);
        });
    });   
}

// flickr.checkLogin = function(){
//     var checkUrl = "https://api.flickr.com/services/rest/?method=flickr.test.login&api_key="+ flickr.apiKey + "&format=json&nojsoncallback=1&auth_token=" + flickr.token + "";
//     var signedCheck = flickr.getSignatureUrl(checkUrl);
//     
//     $.get(signedCheck, function(response){
//         console.log(response);
//         if (response.user.id){
//             controller.displayName(flickr.name);
//         }
//     });
// }

