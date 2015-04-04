$(document).ready(function(){
    $('.house.inactive').click(function() {
        var t = $(this);
        $('.selected').removeClass('selected').addClass('inactive');
        
        setTimeout(function() {
            t.removeClass('inactive').addClass('selected');
        }, 2500);
    });
});
