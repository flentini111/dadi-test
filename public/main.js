(function () {
    var input = document.querySelector('#search_input');
    var search = function (s, box) {
        var ajax = new XMLHttpRequest();
        ajax.open('GET', '/api/0/search?s='+encodeURI(s));
        ajax.onload = function () {
            var result = JSON.parse(ajax.responseText);

            if(Array.isArray(result)) {
                var aw = new Awesomplete(box, {list: result.map(function (i) { return {label: i.Title, value: i.imdbID}; })});

                aw.evaluate();
                box.focus();
            }
        };
        ajax.send();
    };

    input.addEventListener('input', function (e) {
        if (e.target.value.length >= 3) {
            search(e.target.value, input);
        }
    });

    input.addEventListener('awesomplete-selectcomplete', function(e){
        window.open(window.location.origin+'/film/'+e.target.value, '_self');
    });
})();
