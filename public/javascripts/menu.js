$(document).ready(function(){

    var element = $('meta[name="active-menu"]').attr('content');
    $('#' + element).addClass('active');

    $("#checkAll").click(function(){
        $('input:checkbox').not(this).prop('checked', true);
    });

    $("#uncheckAll").click(function(){
        $('input:checkbox').not(this).prop('checked', false);
    });

});