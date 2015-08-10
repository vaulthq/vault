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

<script>
    clippy.load('Clippy', function(agent){
        agent.show();
        agent.reposition = function () {
            if (!this._el.is(':visible')) return;
            var o = this._el.offset();
            var bH = this._el.outerHeight();
            var bW = this._el.outerWidth();

            var wW = $(window).width();
            var wH = $(window).height();
            var sT = $(window).scrollTop();
            var sL = $(window).scrollLeft();
            var top = o.top - sT;
            var left = o.left - sL;
            var m = 5;
            if (top - m < 0) {
                top = m;
                this.hide();
                clearInterval(loop);
                this._balloon.hide(true);
            } else if ((top + bH + m) > wH) {
                this.hide();
                clearInterval(loop);
                this._balloon.hide(true);
                top = wH - bH - m;
            }

            if (left - m < 0) {
                this.hide();
                clearInterval(loop);
                this._balloon.hide(true);
                left = m;
            } else if (left + bW + m > wW) {
                this.hide();
                clearInterval(loop);
                this._balloon.hide(true);
                left = wW - bW - m;
            }

            this._el.css({left:left, top:top});
            // reposition balloon
            this._balloon.reposition();
        };
        agent._balloon.WORD_SPEAK_TIME = 200;
        agent._balloon.CLOSE_BALLOON_DELAY = 15000;
        var loop = setInterval(function () {
            agent.speak(fortunes[Math.floor(Math.random()*fortunes.length)]);
        }, 30000);
    });
</script>

<toaster-container toaster-options="{'position-class': 'toast-bottom-right'}"></toaster-container>

</body>
</html>
