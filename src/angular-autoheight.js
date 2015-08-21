//
// Copyright Kamil Pękala http://github.com/kamilkp
// angular-autoheight v0.0.4
//
;(function(window, document, angular){
	/* jshint eqnull:true */
	/* jshint -W041 */

	if(angular == null) throw new Error('Angular is not defined!');

	function px2val(str) {
		return +str.slice(0, -2);
	}

	var autoheightModule = angular.module('autoheight', []).directive('autoheight', ['$sniffer', function($sniffer) {
	    return  {
	        restrict: 'A',
	        require: '?ngModel',
	        link: function (scope, element, attr, ctrl) {
	            var node = element[0];
	            var lineHeight = getLineHeight(node);
	            var useClone = 'useClone' in attr;
	            var clone;

	            if (useClone) {
        	      clone = document.createElement('textarea');
					      var computedStyle = getComputedStyle(node);

					      clone.style.border = '1px solid black';
					      clone.style.borderWidth = computedStyle.borderTopWidth;
					      clone.style.borderWidth = computedStyle.borderBottomWidth;
					      clone.style.borderWidth = computedStyle.borderLeftWidth;
					      clone.style.borderWidth = computedStyle.borderRightWidth;
					      clone.style.width = (node.clientWidth + px2val(clone.style.borderLeftWidth) + px2val(clone.style.borderRightWidth)) + 'px';
					      clone.style.height = '1px';
					      clone.style.paddingTop = computedStyle.paddingTop;
					      clone.style.paddingBottom = computedStyle.paddingBottom;
					      clone.style.paddingLeft = computedStyle.paddingLeft;
					      clone.style.paddingRight = computedStyle.paddingRight;
					      clone.style.position = 'absolute';
					      clone.style.top = '0px';
					      clone.style.left = '-1000px';

					      clone.style.fontFamily = computedStyle.fontFamily;
					      clone.style.fontSize = computedStyle.fontSize;
					      clone.style.lineHeight = computedStyle.lineHeight;
					      document.body.appendChild(clone);

					      scope.$on('$destroy', function() {
					      	document.body.removeChild(clone);
					      });
	            }

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
	            	if (useClone) {
	            		if (clone.value !== node.value) {
	            			clone.value = node.value;
	            			node.style.height = (clone.scrollHeight + px2val(clone.style.borderTopWidth) + px2val(clone.style.borderBottomWidth)) + 'px';
	            		}
	            	}
	            	else {
	                if(isNaN(lineHeight)) lineHeight = getLineHeight(node);
	                if(!(node.offsetHeight || node.offsetWidth)) return;
	                if(node.scrollHeight <= node.clientHeight)
	                    node.style.height = '0px';
	                var h = node.scrollHeight + // actual height defined by content
	                        node.offsetHeight - // border size compensation
	                        node.clientHeight; //       -- || --
	                var isIE = $sniffer.msie || $sniffer.vendorPrefix && $sniffer.vendorPrefix.toLowerCase() === 'ms';
	                node.style.height = Math.max(h, lineHeight) +
	                                    (isIE ? 1 : 0) + // ie quirk
	                                    'px';
	            	}
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

	if (typeof module !== 'undefined' && module.exports) {
    module.exports = autoheightModule.name;
  }

})(window, document, window.angular);