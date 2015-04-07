$(document).ready(function(){
    $('.house.inactive').click(function() {
        var t = $(this);
        $('.selected').removeClass('selected').addClass('inactive');
        
        setTimeout(function() {
            t.removeClass('inactive').addClass('selected');
        }, 2600);

        setTimeout(function() {
            t.find('.person h3').fadeIn(1500);
            t.find('.avatar').fadeIn(1500, function() {
                $(this).removeClass('hidden');
            });
        }, 6000);

        setTimeout(function() {
            t.find('.person i').fadeIn(1500);
        }, 8000);

        setTimeout(function() {
            var x = 0;
            t.find('.person ul li').each(function() {
                var v = $(this);
                setTimeout(function() {
                    v.slideDown(1000);
                }, 2500 * x++);
            });
        }, 10000);
    });
});
