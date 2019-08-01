// jQuery function to live filter the dropdown results 
$(document).ready(function(){
    $("#myInput").on("keyup", function() {
     var value = $(this).val().toLowerCase();
        $(".dropdown-menu li").filter(function() {
          $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
        });
  });
});
// highlights current active button
$(function(){
  var current = location.pathname;
  $('#network a').each(function(){
      var $this = $(this);
      // if the current path is like this link, make it active
      if($this.attr('href').indexOf(current) !== -1){
          $this.addClass('active');
      }
  });
});
$(function(){
  var current = location.pathname;
  $('#email a').each(function(){
      var $this = $(this);
      // if the current path is like this link, make it active
      if($this.attr('href').indexOf(current) !== -1){
          $this.addClass('active');
      }
  });
});
$(function(){
  var current = location.pathname;
  $('#password a').each(function(){
      var $this = $(this);
      // if the current path is like this link, make it active
      if($this.attr('href').indexOf(current) !== -1){
          $this.addClass('active');
      }
  });
});
//saves edited data after bootstrap confirmation modal
function edit_form_submit() {
  document.getElementById("edit_form").submit();
 }    


// init summernote (richtext)
$(document).ready(function() {
$('.summernote').summernote({
    
    toolbar: [
      
  ['style', ['style']],
  ['font', ['bold', 'underline', 'clear']],
  ['fontname', ['fontname']],
  ['fontsize', ['fontsize']],
  ['color', ['color']],
  ['para', ['ul', 'ol', 'paragraph']],
  ['table', ['table']],
  ['insert', ['link', 'picture', 'video']],
  ['view', ['fullscreen', 'codeview', 'help']],
    ],
    //airMode: true
  });
});
