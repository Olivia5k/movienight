function promote_house(disable) {
    var time = 0;
    if (disable === true) {
        var current = $('.selected');
        current.find('.avatar').fadeOut(1000, function() {
            current.removeClass('selected').addClass('inactive');
        });
        time = 3600;
    }

    var houses = $('.house.inactive');
    var house = $(houses[Math.floor(Math.random()*houses.length)]);

    $.ajax({
        'url': '/house/' + house.attr('id')
    });

    setTimeout(function() {
        house.removeClass('inactive').addClass('selected');
    }, time);

    setTimeout(function() {
        house.find('.person h3').fadeIn(1500);
        house.find('.avatar').fadeIn(1500, function() {
            $(this).removeClass('hidden');
        });
    }, time + 3400);

    setTimeout(function() {
        house.find('.person i').fadeIn(1500);
    }, time + 4600);

    setTimeout(function() {
        var x = 0;
        house.find('.person ul li').each(function() {
            var v = $(this);
            setTimeout(function() {
                v.slideDown(1000);
            }, 2500 * x++);
        });
    }, time + 6000);
}

$(document).ready(function(){
    $('#winebearer').click(function() {
        var t = $(this);
        t.fadeOut(700, function() {
            promote_house(false);
        });
    });

    $('.house.selected').dblclick(function() {
        promote_house(true);
    });
});
