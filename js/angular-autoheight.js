//
// Copyright Kamil Pękala http://github.com/kamilkp
// autoheight v0.0.1
//
;(function(window, document, angular){
	/* jshint eqnull:true */
	/* jshint -W041 */

	if(angular == null) throw new Error('Angular is not defined!');

	angular.module('autoheight', []).directive('autoheight', ['$sniffer', function($sniffer) {
	    return  {
	        restrict: 'A',
	        require: '?ngModel',
	        link: function (scope, element, attr, ctrl) {
	            var node = element[0];
	            var lineHeight = getLineHeight(node);

	            // user input, copy, paste, cut occurrences
	            element.on('input', adjust);
	            element.on('change', adjust);	            

	            if(ctrl){
		            // view value changed from ngModelController - textarea content changed via javascript
		            scope.$watch(function(){
		                return ctrl.$viewValue;
		            }, adjust);
	            }

	            // element became visible
	            scope.$watch(function(){
					// element is visible if at least one of those values is not 0
	                return node.offsetHeight || node.offsetWidth;
	            }, function(newVal, oldVal){
	                if(newVal && !oldVal)
	                    adjust();
	            });

	            // initial adjust
	            adjust();

	            // forced adjustment
	            scope.$on('autoheight-adjust', adjust);

	            function adjust(){
	                if(isNaN(lineHeight)) lineHeight = getLineHeight(node);
	                if(!(node.offsetHeight || node.offsetWidth)) return;
	                if(node.scrollHeight <= node.clientHeight)
	                    node.style.height = '0px';
	                var h = node.scrollHeight + // actual height defined by content
	                        node.offsetHeight - // border size compensation
	                        node.clientHeight; //       -- || --
	                node.style.height = Math.max(h, lineHeight) +
	                                    ($sniffer.msie && lineHeight ? lineHeight : 0) + // ie extra row
	                                    'px';
	            }
	        }
	    };
	}]);

    function getLineHeight(node){
        var computedStyle = window.getComputedStyle(node);
        var lineHeightStyle = computedStyle.lineHeight;
        if(lineHeightStyle === 'normal') return +computedStyle.fontSize.slice(0, -2);
        else return +lineHeightStyle.slice(0, -2);
    }

	angular.element(document.head).append(
		'<style>[autoheight]{overflow: hidden; resize: none; box-sizing: border-box;}</style>'
	);

})(window, document, window.angular);