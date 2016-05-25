(function() {
  angular
    .module('xApp')
    .directive('copyable', CopyableDirective);

  function CopyableDirective(toaster) {
    return {
      restrict: 'A',
      scope: {
        entry: '='
      },
      link: function(scope, element) {
        element.on('click', function() {
          selectElementText(element[0]);
          try {
            if (document.execCommand("copy")) {
              toaster.pop('success', "", 'Copied to clipboard.');
            }
          } catch (e) {}
        });
      }
    };
  }

  function selectElementText(el) {
    var sel, range;
    if (window.getSelection && document.createRange) {
      sel = window.getSelection();
      range = document.createRange();
      range.selectNodeContents(el);
      sel.removeAllRanges();
      sel.addRange(range);
    } else if (document.body.createTextRange) {
      range = document.body.createTextRange();
      range.moveToElementText(el);
      range.select();
    }
  }
})();
