var SPINNER_OPTS = {
  lines: 11, // The number of lines to draw
  length: 31, // The length of each line
  width: 8, // The line thickness
  radius: 32, // The radius of the inner circle
  corners: 1, // Corner roundness (0..1)
  rotate: 0, // The rotation offset
  direction: 1, // 1: clockwise, -1: counterclockwise
  color: '#dbdbdb', // #rgb or #rrggbb or array of colors
  speed: 1, // Rounds per second
  trail: 23, // Afterglow percentage
  shadow: true, // Whether to render a shadow
  hwaccel: false, // Whether to use hardware acceleration
  className: 'spinner', // The CSS class to assign to the spinner
  zIndex: 2e9, // The z-index (defaults to 2000000000)
  top: '50%', // Top position relative to parent
  left: '50%' // Left position relative to parent
};

$(document).ready(function(e) {});
