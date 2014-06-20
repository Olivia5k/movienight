$(document).ready(function(e) {
    $('input').keypress(function(e) {
        var t = $(this);

        if(e.keyCode == 13) {
            var item = t.val();
            t.val('');

            $.ajax({
                'url': '/',
                'type': 'POST',
                'data': {
                    'create': item,
                    'player': t.parents('.player').attr('id')
                },
                'dataType': 'json',
                'success': function(json) {
                    var n = $(json.html),
                        player = t.parents('.player');

                    if(!json.created) {
                        return;
                    }

                    n.hide();
                    player.find('.items').prepend(n);
                    player.find('.score').text(json.count);
                    n.slideDown();
                }
            });
        }
    });

    $('.items').on('click', '.close', function(e) {
        var item = $(this).parents('.item'),
            player = item.parents('.player');

        $.ajax({
            'url': '/',
            'type': 'POST',
            'data': {
                'delete': item.attr('id'),
                'player': player.attr('id')
            },
            'dataType': 'json',
            'success': function(json) {
                player.find('.score').text(json.count);
                item.slideUp();
            }
        });
    });
});
