var app = angular.module('myApp', ['ngRoute']);

app.config(['$routeProvider', function($routeProvider){
	$routeProvider.when('/', {
		templateUrl : 'template/login.html',
		controller : 'loginCtrl'
	}).when('/register', {
		templateUrl: 'template/register.html',
		controller: 'registerCtrl'
	}).when('/user-profile', {
		templateUrl: 'template/user-profile.html',
		controller: 'profileCtrl'
	}).when('/edit-asset', {
		templateUrl: 'template/edit-asset.html',
		controller: 'editAssetCtrl'
	}).otherwise({
		templateUrl: 'index.html',
	});
}]);

app.controller('loginCtrl', function($scope, $location){
	$scope.login = function(){
		$scope.adminDetail = [{'userName' : $scope.userName, 'password': $scope.password}];
		$scope.registerDetail = JSON.parse(localStorage.getItem('registerData'));
		if ($scope.registerDetail != null) {
			for(i=1; i<=$scope.registerDetail.length-1; i++){
				if($scope.userName == $scope.registerDetail[i].userName && $scope.password == $scope.registerDetail[i].password ) {
					sessionStorage.setItem('currentSession', JSON.stringify($scope.registerDetail[i].userName));
					$scope.currentSession = JSON.parse(sessionStorage.getItem('currentSession'));

					if($scope.userName == $scope.currentSession) {
						localStorage.setItem('userIndex', i);
						$location.path('/user-profile');
					}
					 break;
				} else if($scope.userName == 'admin' && $scope.password == 'admin123') {
					sessionStorage.setItem('adminSession', JSON.stringify([$scope.userName, $scope.password]));
					$scope.adminSession = JSON.parse(sessionStorage.getItem('adminSession'));
					console.log(sessionStorage['adminSession']);
					$location.path('/user-profile');
				} else {
					$location.path('/');
				}
			}
		}
			
	}

	$scope.regisHere = function(){
		$location.path("/register");
	}
});

app.controller('registerCtrl', function($scope, $location) {
	$scope.alreadyUnameError = false;
	$scope.alreadyEmailError = false;
	$scope.adminShow = false;
	$scope.registerDetail = [{'firstName': '', 'lastName': '', 'userName': '', 'email': '', 'password': '', 'assetData':[{'assetType': '', 'dName': '', 'cName': '', 'quantity': ''}] }];

	if(localStorage.getItem('registerData') != undefined) {
		$scope.registerDetail = JSON.parse(localStorage.getItem('registerData'));
	}
	
	$scope.userNameList = [];
	$scope.emailList = [];

	if($scope.registerDetail != null) {
		for (i = 1; i < $scope.registerDetail.length; i++) {
			$scope.userNameList.push($scope.registerDetail[i].userName);
			$scope.emailList.push($scope.registerDetail[i].userName);
		}
	}

	$scope.register = function(){
		if ($scope.userNameList.indexOf($scope.registerDetail.userName) == -1) {
			$scope.registerDetail.push({'firstName': $scope.registerDetail.firstName , 'lastName': $scope.registerDetail.lastName, 'userName': $scope.registerDetail.userName, 'email': $scope.registerDetail.email, 'password': $scope.registerDetail.password, 'assetData':[{'assetType': '', 'dName': '', 'cName': '', 'quantity': ''} ]});
			localStorage.setItem('registerData', JSON.stringify($scope.registerDetail));
			$location.path('/');
		} else {
			$scope.alreadyUnameError = true;
			$location.path('/register');
		}
	}
	$scope.logHere = function(){
		$location.path('/');
	}
});

app.controller('profileCtrl', function($scope, $location){
	$scope.currentSession = JSON.parse(sessionStorage.getItem('currentSession'));
	$scope.adminSession = JSON.parse(sessionStorage.getItem('adminSession'));
	$scope.registerDetail = JSON.parse(localStorage.getItem('registerData'));
	$scope.userIndex = localStorage.getItem('userIndex');
	$scope.show = 1;
	$scope.userShow = false;

	if ($scope.currentSession == $scope.registerDetail[$scope.userIndex].userName) {
		$scope.userShow = true;
	} else if($scope.adminSession[0] == 'admin' && $scope.adminSession[1] == 'admin123') {
		$scope.adminShow = true;
		//console.log($scope.adminSession[0]);
	} else {
		$location.path('/');
	}

	$scope.toggleActive = function(e) {
		$scope.show = e;
	}
	$scope.isSet = function(tabId){
		return $scope.show === tabId;
	}
	$scope.logout = function(){
		sessionStorage.removeItem('currentSession');
		sessionStorage.removeItem('adminSession');
		$location.path('/');
	}
	$scope.clearStorage = function(){
		localStorage.clear();
	}

});

app.controller('addNewAssetCtrl', function($scope){
	$scope.registerDetail = JSON.parse(localStorage.getItem('registerData'));
	$scope.userIndex = localStorage.getItem('userIndex');
	$scope.deviceName = [];
	$scope.alreadDeviceError = false;
	for(i = 1; i<$scope.registerDetail[$scope.userIndex].assetData.length; i++) {
		$scope.deviceName.push($scope.registerDetail[$scope.userIndex].assetData[i].dName);
	}
	console.log($scope.deviceName);
	//console.log($scope.registerDetail[$scope.userIndex].assetData.dName);
	$scope.addNewAsset = function(){
		if($scope.deviceName.indexOf($scope.addNewAssetDetail.dName) == -1) {
			$scope.registerDetail[$scope.userIndex].assetData.push( {'assetType': $scope.addNewAssetDetail.assetType, 'dName': $scope.addNewAssetDetail.dName, 'cName': $scope.addNewAssetDetail.cName, 'quantity': $scope.addNewAssetDetail.quantity});
			localStorage.setItem('registerData', JSON.stringify($scope.registerDetail));
		} else {
			$scope.alreadDeviceError = true;
		}	
	}
	$scope.change = function() {
		$scope.alreadDeviceError = false;
	}
});

app.controller('yourAssetCtrl', function($scope){
	$scope.yourAssetDetail = JSON.parse(localStorage.getItem('registerData'));
	$scope.userIndex = localStorage.getItem('userIndex');
});
app.controller('allAssetCtrl', function($scope){
	$scope.allAssetDetail = JSON.parse(localStorage.getItem('registerData'))
	//console.log($scope.allAssetDetail[1].assetData);

});
app.controller('userListCtrl', function($scope, $location){
	$scope.registerDetail = JSON.parse(localStorage.getItem('registerData'));
	$scope.currentIndex = 1;
	$scope.userList = [];
	$scope.deviceName = [];
	$scope.alreadDeviceError = false;
	$scope.editShow = false;
	$scope.addAssetShowVar = false;

	for(i = 1; i<$scope.registerDetail[1].assetData.length; i++) {
		$scope.deviceName.push($scope.registerDetail[1].assetData[i].dName); // first user device name list
	}

	for(i=0; i<$scope.registerDetail.length; i++) {
		$scope.userList.push($scope.registerDetail[i].userName);
	}

	$scope.showAsset = function(index) {
		$scope.currentIndex = index;
		for(i = 1; i<$scope.registerDetail[$scope.currentIndex].assetData.length; i++) {
			$scope.deviceName.push($scope.registerDetail[$scope.currentIndex].assetData[i].dName); // for current user device list
		}
	}

	$scope.addAssetShow = function(){
		$scope.addAssetShowVar = true;
	}

	$scope.editAsset = function(asset, index) {
		$scope.editDetail = asset;
		$scope.editIndex = index;
		$scope.editShow = true;
	}
	$scope.editAssetSubmit = function(index) {
		$scope.updateDetail = [];
		$scope.updateDetail.push({'assetType': $scope.editDetail.assetType, 'dName': $scope.editDetail.dName, 'cName': $scope.editDetail.cName, 'quantity': $scope.editDetail.quantity});
		angular.copy($scope.updateDetail[0], $scope.registerDetail[$scope.currentIndex].assetData[$scope.editIndex]);
		localStorage.setItem('registerData', JSON.stringify($scope.registerDetail));
		$scope.editShow = false;
	}

	$scope.deleteAsset = function(index){
		$scope.deleteIndex = index;
		console.log($scope.currentIndex);
		console.log($scope.deleteIndex);
		console.log($scope.registerDetail[$scope.currentIndex].assetData);
		$scope.registerDetail[$scope.currentIndex].assetData.splice($scope.deleteIndex, 1);
		localStorage.setItem('registerData', JSON.stringify($scope.registerDetail));
		console.log($scope.registerDetail[$scope.currentIndex].assetData[$scope.deleteIndex]);
	}


	$scope.addOneAsset = function() {
		console.log($scope.deviceName);
		if($scope.deviceName.indexOf($scope.addOneAssetDetail.dName) == -1) {
			$scope.registerDetail[$scope.currentIndex].assetData.push( {'assetType': $scope.addOneAssetDetail.assetType, 'dName': $scope.addOneAssetDetail.dName, 'cName': $scope.addOneAssetDetail.cName, 'quantity': $scope.addOneAssetDetail.quantity});
			localStorage.setItem('registerData', JSON.stringify($scope.registerDetail));
			$scope.addAssetShowVar = false;
			$scope.addOneAssetDetail.assetType = ' ';
			$scope.addOneAssetDetail.dName = ' ';
			$scope.addOneAssetDetail.cName = ' ';
			$scope.addOneAssetDetail.quantity = ' ';
		} else {
			$scope.alreadDeviceError = true;
		}
	}
	$scope.change = function() {
		$scope.alreadDeviceError = false;
	}
});


/*app.controller('addOneAssetCtrl', function($scope){
	$scope.registerDetail = JSON.parse(localStorage.getItem('registerData'));
	$scope.currentIndex = 1;
	$scope.currentIndex = parseInt($scope.currentIndex);
	$scope.deviceName = [];
	$scope.alreadDeviceError = false;

	for(i = 1; i<$scope.registerDetail[$scope.currentIndex].assetData.length; i++) {
		$scope.deviceName.push($scope.registerDetail[$scope.currentIndex].assetData[i].dName);
	}

	$scope.addOneAsset = function() {
		console.log($scope.addOneAssetDetail.dName);
		if($scope.deviceName.indexOf($scope.addOneAssetDetail.dName) == -1) {
			$scope.registerDetail[$scope.currentIndex].assetData.push( {'assetType': $scope.addOneAssetDetail.assetType, 'dName': $scope.addOneAssetDetail.dName, 'cName': $scope.addOneAssetDetail.cName, 'quantity': $scope.addOneAssetDetail.quantity});
			localStorage.setItem('registerData', JSON.stringify($scope.registerDetail));
		} else {
			$scope.alreadDeviceError = true;
		}
	}
});
*/

/*
$scope.registerDetail = JSON.parse(localStorage.getItem('registerData'));
$scope.userIndex = localStorage.getItem('userIndex');
$scope.deviceName = [];
$scope.alreadDeviceError = false;
for(i = 1; i<$scope.registerDetail[$scope.userIndex].assetData.length; i++) {
	$scope.deviceName.push($scope.registerDetail[$scope.userIndex].assetData[i].dName);
}
console.log($scope.deviceName);
//console.log($scope.registerDetail[$scope.userIndex].assetData.dName);
$scope.addNewAsset = function(){
	if($scope.deviceName.indexOf($scope.addNewAssetDetail.dName) == -1) {
		$scope.registerDetail[$scope.userIndex].assetData.push( {'assetType': $scope.addNewAssetDetail.assetType, 'dName': $scope.addNewAssetDetail.dName, 'cName': $scope.addNewAssetDetail.cName, 'quantity': $scope.addNewAssetDetail.quantity});
		localStorage.setItem('registerData', JSON.stringify($scope.registerDetail));
	} else {
		$scope.alreadDeviceError = true;
	}	
}
$scope.change = function() {
	$scope.alreadDeviceError = false;
}*/