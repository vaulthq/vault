<!doctype html>
<html ng-app="xApp">
<head>
    <meta charset="utf-8" />
    <script src="angular/angular.min.js"></script>
    <script src="angular/angular-route.min.js"></script>
    <script src="js/app.js"></script>
</head>
<body>
<input ng-model="test">
{{ test }}
<div ng-view></div>
</body>
</html>