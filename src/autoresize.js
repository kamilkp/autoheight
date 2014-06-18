.directive("autoresize", ['$sniffer', function($sniffer) {
    return  {
        restrict: 'A',
        require: 'ngModel',
        link: function (scope, element, attr, ctrl) {
            var node = element[0];
            var lineHeight = +getComputedStyle(node).lineHeight.slice(0, -2);
            element.on('input change', adjust);
            scope.$watch(function(){
                return ctrl.$viewValue;
            }, adjust);
            scope.$watch(function(){
                return node.offsetHeight || node.offsetWidth;
            }, function(newVal, oldVal){
                if(newVal && !oldVal)
                    adjust();
            });
            adjust();

            function adjust(){
                if(isNaN(lineHeight)) lineHeight = +getComputedStyle(node).lineHeight.slice(0, -2);
                if(!(node.offsetHeight || node.offsetWidth)) return;
                if(node.scrollHeight <= node.clientHeight)
                    node.style.height = '0px';
                var h = node.scrollHeight + // actual height defined by content
                                        node.offsetHeight - // border size compensation
                                        node.clientHeight; //       -- || --
                node.style.height = Math.max(h, lineHeight) +
                                    ($sniffer.msie ? lineHeight : 0) + // ie extra row
                                    'px';
            }
        }
    };
}])