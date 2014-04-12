<!doctype html>
<html ng-app="xApp">
<head>
    <meta charset="utf-8" />
    <link rel="stylesheet" href="//netdna.bootstrapcdn.com/bootstrap/3.1.1/css/bootstrap.min.css">
    <script src="js/vendor.js"></script>
    <script src="js/app.js"></script>
    <style>
        html {
            position: relative;
            min-height: 100%;
        }
        body {
            margin-bottom: 52px;
        }
        #footer {
            position: absolute;
            bottom: 0;
            width: 100%;
            height: 52px;
        }
        #footer .alert {
            margin: 0;
            border-radius: 0;
        }
    </style>
</head>
<body>

<div menu></div>


<div class="container">
    <div ng-view></div>
</div>

<div id="footer">
    <flash:messages></flash:messages>
</div>

<script type="text/ng-template" id="template/modal/backdrop.html">
    <div class="modal-backdrop fade"
    ng-class="{in: animate}"
    ng-style="{'z-index': 1040 + (index && 1 || 0) + index*10}"
    ></div>
</script>


<script type="text/ng-template" id="template/modal/window.html">
    <div tabindex="-1" class="modal fade {{ windowClass }}" ng-class="{in: animate}" ng-style="{'z-index': 1050 + index*10, display: 'block'}" ng-click="close($event)">
        <div class="modal-dialog"><div class="modal-content" ng-transclude></div></div>
    </div>
</script>

</body>
</html>

