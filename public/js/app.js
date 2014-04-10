var xApp=angular.module("xApp",["ngRoute","ngSanitize","ngResource","flash"]);xApp.config(["$routeProvider",function($routeProvider){$routeProvider.when("/login",{templateUrl:"/t/auth/login.html",controller:"AuthController"}).when("/home",{templateUrl:"/t/auth/home.html",controller:"HomeController"}).otherwise({redirectTo:"/login"})}]),xApp.controller("AuthController",function($scope,$location,$sanitize,Authenticate,flash){$scope.login=function(){Authenticate.save({email:$sanitize($scope.email),password:$sanitize($scope.password)},function(){$location.path("/home")},function(response){flash(response.data.flash)})}}).controller("HomeController",function($scope,$location,Authenticate,flash){$scope.logout=function(){Authenticate.get({},function(response){flash(response.data.flash),$location.path("/")})}}),xApp.factory("Authenticate",function($resource){return $resource("/internal/auth")}),angular.module("flash",[]).factory("flash",["$rootScope","$timeout",function($rootScope,$timeout){var reset,messages=[],cleanup=function(){$timeout.cancel(reset),reset=$timeout(function(){messages=[]})},emit=function(){$rootScope.$emit("flash:message",messages,cleanup)};$rootScope.$on("$locationChangeSuccess",emit);var asMessage=function(level,text){return text||(text=level,level="success"),{level:level,text:text}},asArrayOfMessages=function(level,text){return level instanceof Array?level.map(function(message){return message.text?message:asMessage(message)}):text?[{level:level,text:text}]:[asMessage(level)]},flash=function(level,text){emit(messages=asArrayOfMessages(level,text))};return["error","warning","info","success"].forEach(function(level){flash[level]=function(text){flash(level,text)}}),flash}]).directive("flashMessages",[function(){var directive={restrict:"EA",replace:!0};return directive.template='<ol id="flash-messages"><li ng-repeat="m in messages" class="{{m.level}}">{{m.text}}</li></ol>',directive.controller=["$scope","$rootScope",function($scope,$rootScope){$rootScope.$on("flash:message",function(_,messages,done){$scope.messages=messages,done()})}],directive}]);