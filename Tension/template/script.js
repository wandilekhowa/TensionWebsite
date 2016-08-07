var app = angular.module("TensionMock", ["firebase", "ngRoute" ]);
var emailLog = "";
var checkAuth = function()
{
	console.log("checking authentication");
	console.log("printing email: "+emailLog);
		if(emailLog.length > 0)
		{
			console.log("Passed");
			window.location.href = "/TensionWebsite/Tension/#/chanList";
		}
};

var exit = function()
{
	console.log("I am clearing");
	emailLog = "";
};

app.config(function($routeProvider) {
	$routeProvider.when('/', {
		controller: 'MainCtrl',
		templateUrl: 'template/home.html',
	})
	$routeProvider.when('/channel/:channelId', {
		controller: 'ChannelsCtrl',
		templateUrl: 'template/channel.html',
	})
	$routeProvider.when('/signup/', {
		controller: 'SignUpCtrl',
		templateUrl: 'template/signup.html',
	})
	$routeProvider.when('/login/', {
		controller: 'LoginCtrl',
		templateUrl: 'template/login.html',
	})
	$routeProvider.when('/chanList/', {
		controller: 'ChanListCtrl',
		templateUrl: 'template/chanList.html',
	})
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
    		window.location.href = "/TensionWebsite/Tension/#/chanList";
            }).catch(function(error) {
            	alert(error);
            });
    };  

});

app.controller('MainCtrl', function($http,$scope,$firebaseArray, $firebaseAuth)
{
      $scope.showLogout = false;

});
