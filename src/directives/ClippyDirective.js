(function () {
    angular
        .module('xApp')
        .directive('clippy', dir);

    function dir() {
        return {
            restrict: 'E',
            controller: function() {
                var enabled = localStorage.getItem('clippy') || false;

                if (String(enabled).toLowerCase() == 'true') {
                    runClippy();
                }
            }
        };
    }

    function runClippy() {
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
    }
})();
