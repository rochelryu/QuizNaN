$(document).ready(function(){
    var socket = io();
    var ryu = $("#panel").attr('data-ryu-ele');
      socket.emit('newAdverse', ryu);



      socket.on('resNes', function(data){
          var dem = $('#panel').attr('data-ryu-ele');
          dem = parseInt(dem, 10);
          if(dem == data.cal){
        $("#moyG").html('<h6>' + data.gl + ' <i class="fas fa-chart-line"></i></h6>');
        $("#participant").html('<h6>' + data.name.length + ' <i class="fas fa-users"></i></h6>');
        var data = [{
            "name": "Miasta",
            "axisY": data.name,
            "axisX": ["10%", "20%", "30%", "40%", "50%", "60%", "70%", "80%", "90%", "100%"],
            "bars": data.note
        }];
    
        var options = {
            data: data[0],
            showValues: true,
            showVerticalLines: true,
            showHorizontalLines: true,
            animation: true,
            animationOffset: 200,
        };
    
        var $myChart = $('#chart-1');
    
        $myChart.horizontalChart(options);
    }
      })
 
    });