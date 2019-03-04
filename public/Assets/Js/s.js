$(document).ready(function(){
  var socket = io();
    var checkmark = "<span class='checkmark'>&#x2713;</span>";
    let scanner = new Instascan.Scanner({ video: document.getElementById('preview') });
      scanner.addListener('scan', function (content) {
        socket.emit('Connect', content);
        $('.ele').find('#preview').removeClass('animated slideInRight slower').addClass('none')
      $("form").removeClass('none').addClass('animated slideInLeft slower')
      $('.ele').find('.showForm').remove();
      scanner.stop();
        $.notify({
          position: 2,
          type: 'info',
          message: "Code Scanner, En Cours d'approbation par Icore Bot",
          duration: 10000
      });
      });
    $(".answer").click(function() {
      $(this).siblings(".answer").removeClass("active").children("span").remove();
      $(this).addClass("active").append(checkmark);
    });

    $('.ele').on('click', '.showForm', function(){
      scanner.stop();
      $('.ele').find('#preview').removeClass('animated slideInRight slower').addClass('none')
      $("form").removeClass('none').addClass('animated slideInLeft slower')
      $('.ele').find('.showForm').remove();
    })


    $("form").on('click', '.choiceQr', function(){
      $("form").addClass('none');
      Instascan.Camera.getCameras().then(function (cameras) {
        if (cameras.length > 0) {
          scanner.start(cameras[0]);
          $('.ele').find('#preview').removeClass('none').addClass('animated slideInRight slower')
          $('.ele').append('<button class="showForm">Avec Couple Identifiant</button>')
        } else {
          console.error('No cameras found.');
        }
      }).catch(function (e) {
        console.error(e);
      });
    })
    
    socket.on('vasy',function(data){
      $("#em").val(data.e);
      $("#ps").val(data.k);
      setTimeout(function(){
        $("#form").submit();
      }, 1000)
    })
  });