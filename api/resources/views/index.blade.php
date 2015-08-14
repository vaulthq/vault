<!doctype html>
<html ng-app="xApp">
<head>
    <meta charset="utf-8">
    <title>Password Vault</title>
    <link href='https://fonts.googleapis.com/css?family=Roboto:400,700' rel='stylesheet' type='text/css'>
    <link rel="stylesheet" href="/css/vendor_styles.css">
    <link rel="stylesheet" href="/css/app.css">
    <script src="/js/vendor.js"></script>
    <script src="/js/app.js"></script>
    <script src="/js/fortunes.js"></script>

    <link rel="apple-touch-icon" sizes="57x57" href="/apple-touch-icon-57x57.png">
    <link rel="apple-touch-icon" sizes="60x60" href="/apple-touch-icon-60x60.png">
    <link rel="apple-touch-icon" sizes="72x72" href="/apple-touch-icon-72x72.png">
    <link rel="apple-touch-icon" sizes="76x76" href="/apple-touch-icon-76x76.png">
    <link rel="apple-touch-icon" sizes="114x114" href="/apple-touch-icon-114x114.png">
    <link rel="apple-touch-icon" sizes="120x120" href="/apple-touch-icon-120x120.png">
    <link rel="apple-touch-icon" sizes="144x144" href="/apple-touch-icon-144x144.png">
    <link rel="apple-touch-icon" sizes="152x152" href="/apple-touch-icon-152x152.png">
    <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon-180x180.png">
    <link rel="icon" type="image/png" href="/favicon-32x32.png" sizes="32x32">
    <link rel="icon" type="image/png" href="/android-chrome-192x192.png" sizes="192x192">
    <link rel="icon" type="image/png" href="/favicon-96x96.png" sizes="96x96">
    <link rel="icon" type="image/png" href="/favicon-16x16.png" sizes="16x16">
    <link rel="manifest" href="/manifest.json">
    <meta name="msapplication-TileColor" content="#da532c">
    <meta name="msapplication-TileImage" content="/mstile-144x144.png">
    <meta name="theme-color" content="#ffffff">
</head>
<body>

<div ui-view></div>

<script type="text/ng-template" id="template/modal/backdrop.html">
    <div class="modal-backdrop fade"
         ng-class="{in: animate}"
         ng-style="{'z-index': 1040 + (index && 1 || 0) + index*10}"
            ></div>
</script>

<script type="text/ng-template" id="template/modal/window.html">
    <div tabindex="-1" role="dialog" class="modal fade" ng-class="{in: animate}" ng-style="{'z-index': 1050 + index*10, display: 'block'}" ng-click="close($event)">
        <div class="modal-dialog" ng-class="{'modal-sm': size == 'sm', 'modal-lg': size == 'lg'}"><div class="modal-content" modal-transclude></div></div>
    </div>
</script>

<script type="text/ng-template" id="template/tooltip/tooltip-popup.html">
    <div class="tooltip @{{placement}}" ng-class="{ in: isOpen(), fade: animation() }">
        <div class="tooltip-arrow"></div>
        <div class="tooltip-inner" ng-bind="content"></div>
    </div>
</script>




<clippy></clippy>
<toaster-container toaster-options="{'position-class': 'toast-bottom-right'}"></toaster-container>

</body>
</html>
