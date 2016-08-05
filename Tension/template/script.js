var app = angular.module("TensionMock", ["firebase", "ngRoute" ]);

app.run(["$rootScope", "$location", function($rootScope, $location) 
{
  $rootScope.$on("$routeChangeError", function(event, next, previous, error) 
  {
    if (error === "AUTH_REQUIRED") 
	{
      	   window.location.href = "/TensionWebsite/Tension/#/login";
    }
  });
}]);

app.config(function($routeProvider) 
{
	$routeProvider.when('/TensionWebsite/Tension/', {
		controller: 'MainCtrl',
		templateUrl: 'template/home.html',
	})$routeProvider.when('/TensionWebsite/Tension/channel/:channelId', {
		controller: 'ChannelsCtrl',
		templateUrl: 'template/channel.html',
		resolve: 
		{ 
      			"currentAuth":  function($firebaseAuth) 
	  		{
        			return $firebaseAuth().$waitForSignIn();
      			}
    		}
	})$routeProvider.when('/TensionWebsite/Tension/signup/', {
		controller: 'SignUpCtrl',
		templateUrl: 'template/signup.html',
		resolve: 
		{ 
      			"currentAuth":  function($firebaseAuth) 
	  		{
        			return $firebaseAuth().$waitForSignIn();
      			}
    		}
	})$routeProvider.when('/TensionWebsite/Tension/login/', {
		controller: 'LoginCtrl',
		templateUrl: 'template/login.html',
		resolve: 
		{ 
      			"currentAuth":  function($firebaseAuth) 
	  		{
        			return $firebaseAuth().$waitForSignIn();
      			}
    		}
	})$routeProvider.when('/TensionWebsite/Tension/chanList/', {
		controller: 'ChanListCtrl',
		templateUrl: 'template/chanList.html',
		resolve: 
		{ 
      			"currentAuth":  function($firebaseAuth) 
	  		{
        			return $firebaseAuth().$waitForSignIn();
      			}
    		}
	});
});

var dateConverter = function timeConverter(UNIX_timestamp)
{
  	var a = new Date(UNIX_timestamp);
  	var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  	var year = Math.round(a.getFullYear());
  	var month = months[a.getMonth()];
  	var date = a.getDate();
  	var hour = a.getHours();
  	var min = a.getMinutes();
  	var sec = a.getSeconds();
  	var amm = " AM";
  	if(hour>=12)
  	{
  		amm = " PM";
  	}
  	var time = date + ' ' + month + ' ' + year + ' ' + hour + ':' + min+amm;
  	return time;
}  

app.controller("ChanListCtrl", function($scope, $firebaseArray) 
{
    $scope.showLogout = true;
    var ref = firebase.database().ref().child("channels");
    $scope.channels = $firebaseArray(ref);
    $scope.addChannel = function()
    {
    	$scope.channels.$add({
    		name: $scope.channelName,
    		description: $scope.description,
    		created_time: dateConverter(Date.now())
    	});
    	$scope.channelName = "";
    	$scope.description= "";
    };
});

app.controller("ChannelsCtrl", function($scope, $firebaseArray, $routeParams) 
{
    $scope.showLogout = true;
    $scope.channelId = $routeParams.channelId;
    console.log($scope.channelId);
    var ref = firebase.database().ref().child("messages");
    $scope.messages = $firebaseArray(ref.child($routeParams.channelId));
    $scope.addMessage = function()
    {

    	ref.child($routeParams.channelId).push({text: $scope.newMessageText,name: $scope.name,created_time: dateConverter(Date.now())});
    	$scope.newMessageText = "";
    	$scope.name = "";
    };
});

app.controller('SignUpCtrl', function($http,$scope,$firebaseArray, $firebaseAuth)
{
    $scope.showLogout = false;
    var ref = firebase.database().ref().child('User');
    $scope.authObj = $firebaseAuth();
    $scope.signUp = function () 
    {
        $scope.authObj.$createUserWithEmailAndPassword($scope.email, $scope.password)
          .then(function(firebaseUser) 
          {
          	$scope.User = $firebaseArray(ref.child(firebaseUser.uid));
            console.log("User " + firebaseUser.uid + " created successfully!");
            console.log(firebaseUser.uid);
            ref.child(firebaseUser.uid).push({name: $scope.name,email: $scope.email,sender: firebaseUser.uid,created_time: dateConverter(Date.now())});
            $scope.name = "";
    		$scope.password = "";
    		window.location.href = "/TensionWebsite/Tension/#/login";
          }).catch(function(error) {
            alert(error);
    	  });
    };
});

app.controller('LoginCtrl', function($http,$scope,$firebaseArray, $firebaseAuth)
{
    $scope.showLogout = false;
    var ref = firebase.database().ref().child('User');
    $scope.authObj = $firebaseAuth();
    $scope.login = function () 
    {
        $scope.authObj.$signInWithEmailAndPassword($scope.email, $scope.password)
        .then(function(firebaseUser) {
        	emailLog = $scope.email;
    		$scope.password = "";
    		window.location.href = "/TensionWebsite/Tension/#/chanList";
            }).catch(function(error) {
            	alert(error);
            });
    };  

});

app.controller('MainCtrl', function($http,$scope,$firebaseArray, $firebaseAuth)
{
      $scope.showLogout = false;

});

app.controller("AppController", function($scope, $firebaseArray, $firebaseAuth,$routeParams,$location,$window,$location) 
{
	$scope.authObj = $firebaseAuth();
	$scope.sign_out=function()
	{
		$scope.authObj.$signOut()
		window.location.href = "/TensionWebsite/Tension/#/";
	}
});
