var timer;
$('#test').click(test);
$('#start').click( function(){
  $(this).prop('disabled', true);
  $('#stop').prop('disabled', false);
  test();
  setTimer($('#time').val());
});
$('#stop').click( function(){
  $(this).prop('disabled', true);
  $('#start').prop('disabled', false);
  clearInterval(timer);
});
$('#reset').click( function(){ init(); });
$('.setaddress').click(function(){
  $('#address').val($(this).attr('address'));
  init();
});
$('#time').change(function() {
  console.log($('#time').val());
  if(timer){
    clearInterval(timer);
    setTimer($('#time').val());
  }
});

function setTimer(time){
  console.log(time);
  if(!time || time < 1000){
    time = 100;
  }
  console.log(time);
  timer = setInterval(test, time);
}



google.load('visualization', '1.1', {
  packages: ['line']
});
google.setOnLoadCallback(init);

var chart;
var data;
var options = {
  chart: {
    title: 'Ping test',
    animation: {
      duration: 3000,
      easing: 'out'
    }
  },
  width: 600,
  height: 400
};
function init(){
  data = new google.visualization.DataTable();
  data.addColumn('number', '');
  data.addColumn('number', 'ms');
  
  data.addRows([[1, 1]]);
  chart = new google.charts.Line(document.getElementById('linechart_material'));
  drawChart();
}
function drawChart() {
  chart.draw(data, options);
}
function updateChart(dataset){
  data.addRow(dataset);
  drawChart();
}
var request_image = function(url) {
    return new Promise(function(resolve, reject) {
        var img = new Image();
        img.onload = function() { resolve(img); };
        img.onerror = function() { reject(url); };
        img.src = url + '?random-no-cache=' + Math.floor((1 + Math.random()) * 0x10000).toString(16);
    });
};
var ping = function(url, multiplier) {
    return new Promise(function(resolve, reject) {
        var start = (new Date()).getTime();
        var response = function() { 
            var delta = ((new Date()).getTime() - start);
            delta *= (multiplier || 1);
            resolve(delta); 
        };
        request_image(url).then(response).catch(response);
        
        // Set a timeout for max-pings, 5s.
        setTimeout(function() { reject(Error('Timeout')); }, 5000);
    });
};

function test(){
  var address = $('#address').val();
  ping('https://facebook.com').then(function(result) {
    updateChart([data.getNumberOfRows()+1,result]);
  }).catch(function(error) {
    updateChart([data.getNumberOfRows()+1,5000]);
  });
}