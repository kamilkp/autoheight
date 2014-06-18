//
// Copyright Kamil Pękala http://github.com/kamilkp
// autoheight v0.0.1
//
;(function(window, document){
    /* jshint eqnull:true */
    /* jshint -W041 */

    var msie = +((/msie (\d+)/.exec(navigator.userAgent.toLowerCase()) || [])[1]);
    if (isNaN(msie))
        msie = +((/trident\/.*; rv:(\d+)/.exec(navigator.userAgent.toLowerCase()) || [])[1]);

    var style = document.createElement('style');
    style.innerHTML = '[autoheight]{overflow: hidden; resize: none; box-sizing: border-box;}';
    document.head.appendChild(style);
    
    window.autoheight = autoheight;

    function autoheight(node){

        // listeners not attached yet
        if(node.getAttribute('autoheight') == null){
            node.setAttribute('autoheight', '');
            // user input, copy, paste, cut occurrences
            node.addEventListener('input', adjust, false);
            node.addEventListener('change', adjust, false);
        }

        // initial adjust
        adjust();

        function adjust(){
            var lineHeight = getLineHeight(node);
            if(!(node.offsetHeight || node.offsetWidth)) return;
            if(node.scrollHeight <= node.clientHeight)
                node.style.height = '0px';
            var h = node.scrollHeight + // actual height defined by content
                    node.offsetHeight - // border size compensation
                    node.clientHeight; //       -- || --
            node.style.height = Math.max(h, lineHeight) +
                                (msie && lineHeight ? lineHeight : 0) + // ie extra row
                                'px';
        }
    }

    function getLineHeight(node){
        var computedStyle = window.getComputedStyle(node);
        var lineHeightStyle = computedStyle.lineHeight;
        if(lineHeightStyle === 'normal') return +computedStyle.fontSize.slice(0, -2);
        else return +lineHeightStyle.slice(0, -2);
    }

})(window, document);