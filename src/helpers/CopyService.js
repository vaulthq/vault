(function() {
  angular
    .module('xApp')
    .service('CopyService', service);

  function service($q, toaster) {
    var fake;

    return {
      copy: createElementAndCopy,
      cleanup: cleanup
    }

    function createElementAndCopy(text) {
      return createFakeElement(text)
        .then(copy)
        .then(cleanup)
        .then(success, failure);
    }

    function copy(element) {
      element.select();

      try {
        if (document.execCommand("copy")) {
          return true;
        }
      } catch (e) {}

      return $q.reject();
    }

    function createFakeElement(text) {
      var deferred = $q.defer();

      try {
        cleanup();
        var element = document.createElement("textarea");

        element.style.position = 'absolute';
        element.style.left = '-9999px';
        element.style.top = document.body.scrollTop + 'px';
        element.value = text;

        document.body.appendChild(element);
        fake = element;

        deferred.resolve(element);
      } catch (e) {
        deferred.reject(e);
      }

      return deferred.promise;
    }

    function cleanup() {
      if (fake) {
        document.body.removeChild(fake);
      }
      fake = null;
    }

    function success() {
      toaster.pop('success', "", 'Password copied to clipboard.');
    }

    function failure() {
      toaster.pop('warning', 'Could not copy', 'Click Command + C to copy');
      return $q.reject();
    }
  }
})();
