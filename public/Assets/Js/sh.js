$(document).ready(function(){
    var socket = io();
      var checkmark = "<span class='checkmark'>&#x2713;</span>";
      logarithm();
     
      $(".answers").on('click', '.answer', function() {
        var pel = $(this).attr('data-ryu-choice');
        var del = $('#del').val();
        socket.emit('ch', {pel:pel, del:del});
        $(this).siblings(".answer").removeClass("active").children("span").remove();
        $(this).addClass("active").append(checkmark);
      });

      $('.Send').on('click', function(){
        var pel = $('.quiz-container').find('.answer.box.active').attr('data-ryu-choice');
        var del = $('#del').val();
        socket.emit('levUp', {pel:pel, del:del});
      })
  
      /*$("button").click(function() {
        if($(".active").length) {
          if($(".active").index() === 1) {
            alert("Well done!");
          } else {
            alert("Wrong answer!");
          }
        } else {
          alert("Please select an answer!");
        }
      });*/

      socket.on('new', function(data){
        var fileQ = "";
        var local = "";
        console.log(data);
        if(data.Ques[data.niveauActuel].files != null){
          fileQ = '<br> <img src="Assets/images/quiz/'+ data.Ques[data.niveauActuel].files +'" class="img-fluid img-perso" />';
        }
        for(let i in data.Ques[data.niveauActuel].responses){
          var ind = "h"
          if(i == 0){
            ind = "a"
          }
          else if(i == 1){
            ind = "b"
          }
          else if(i == 2 ){
            ind = "c"
          }
          else if(i == 3){
            ind = "d"
          }
          else if(i == 4){
            ind = "e"
          }
          else if(i == 5){
            ind = "f"
          }
          else if(i == 6){
            ind = "g"
          }
          local = local+ '<li class="answer box animated slideInLeft slower" data-ryu-choice="'+ data.Ques[data.niveauActuel].responses[i].crypt +'"><p> <span>'+ ind +'</span>'+ data.Ques[data.niveauActuel].responses[i].content +'</p></li>';
          continue;
        }
        var pl = 100 - ((data.niveauActuel + 1) * 100) / data.niveauTotal;
        pl = pl + '%'
        $('#adent').css('right', pl);
        $('#adent').html('<p>'+ (data.niveauActuel + 1) + '/'+ data.niveauTotal + '</p>');
        $('.question.box').html('<p class="animated fadeInLeft slower"> <span>'+ (data.niveauActuel + 1) +'.</span>'+ data.Ques[data.niveauActuel].content + ' ' + fileQ + '</p>');
        $('.answers').html(local);

      })

      function logarithm(){
        var del = $('#del').val();
        socket.emit('login', del);
      }

      socket.on('bblank', function() { 
        $('.quiz-container').html('<a href="/result" class="animated zoomInDown slower btn showForm">VOIR MON RESULTAT</a>')
       })
      socket.on('vasy',function(data){
        $("#em").val(data.e);
        $("#ps").val(data.k);
        setTimeout(function(){
          $("#form").submit();
        }, 1000)
      })
      socket.on('fluor', function(data){
        $('.lem').html('<p class="animated bounce fast">' + data + '</p>')
      })
    });