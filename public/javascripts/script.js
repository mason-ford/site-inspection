$(document).ready(function(){

    var element = $('meta[name="active-menu"]').attr('content');
    $('#' + element).addClass('active');

    $("#checkAll").click(function(){
        $('input:checkbox').not(this).prop('checked', true);
    });

    $("#uncheckAll").click(function(){
        $('input:checkbox').not(this).prop('checked', false);
    });

    $("#addAirFilter").click(function() {
        var rand = Math.floor(Math.random()*10*(new Date().getTime()));
        var newHTML = ` <li class="list-group-item">
                            <div class="form-row">
                                <div class="form-group col-md-12">
                                    <label for="airfilter-type-`+rand+`">Type</label>
                                    <input type="text" class="form-control" name="airfilter_type[]" id="airfilter-type-`+rand+`" required title="Air Filter type">
                                </div>
                            </div>
                            <div class="form-row">
                                <div class="form-group col-md-6">
                                    <label for="airfilter-size-`+rand+`">Size</label>
                                    <input type="text" class="form-control" name="airfilter_size[]" id="airfilter-size-`+rand+`" title="Air Filter size ex. 10x20x1">
                                </div>
                                <div class="form-group col-md-6">
                                    <label for="airfilter-amount-`+rand+`">Amount</label>
                                    <input type="text" class="form-control" name="airfilter_amount[]" id="airfilter-amount-`+rand+`" title="Air Filter amount">
                                </div>
                            </div>
                            <div class="form-row">
                                <span class="card-text javaLink delAirFilter">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-x-circle-fill" viewBox="0 0 16 16">
                                        <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM5.354 4.646a.5.5 0 1 0-.708.708L7.293 8l-2.647 2.646a.5.5 0 0 0 .708.708L8 8.707l2.646 2.647a.5.5 0 0 0 .708-.708L8.707 8l2.647-2.646a.5.5 0 0 0-.708-.708L8 7.293 5.354 4.646z"/>
                                    </svg>
                                    Delete
                                </span>
                            </div>
                        </li>`;
        $("#airFilterList").append(newHTML);
    });

    $("#addContact").click(function() {
        var rand = Math.floor(Math.random()*10*(new Date().getTime()));
        var newHTML = ` <li class="list-group-item">
                            <div class="form-row">
                                <div class="form-group col-md-6">
                                    <label for="contact-name-`+rand+`">Name</label>
                                    <input type="text" class="form-control" name="contact_name[]" id="contact-name-`+rand+`" required title="Contact Name">
                                </div>
                                <div class="form-group col-md-6">
                                    <label for="contact-number-`+rand+`">Number</label>
                                    <input type="text" class="form-control" name="contact_number[]" id="contact-number-`+rand+`" title="Contact Number">
                                </div>
                            </div>
                            <div class="form-row">
                                <div class="form-group col-md-12">
                                    <label for="contact-info-`+rand+`">Info</label>
                                    <input type="text" class="form-control" name="contact_info[]" id="contact-info-`+rand+`" title="Contact Info">
                                </div>
                            </div>
                            <div class="form-row">
                                <span class="card-text javaLink delContact">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-x-circle-fill" viewBox="0 0 16 16">
                                        <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM5.354 4.646a.5.5 0 1 0-.708.708L7.293 8l-2.647 2.646a.5.5 0 0 0 .708.708L8 8.707l2.646 2.647a.5.5 0 0 0 .708-.708L8.707 8l2.647-2.646a.5.5 0 0 0-.708-.708L8 7.293 5.354 4.646z"/>
                                    </svg>
                                    Delete
                                </span>
                            </div>
                        </li>`;
        $("#contactList").append(newHTML);
    });

    $(".cpComplete").click(function() {
        var parentCard = $(this).closest(".card");
        parentCard.addClass("border-success");
        parentCard.children(".card-header").addClass("text-white bg-success");
        parentCard.find("input").prop("disabled", true);
        parentCard.find("textarea").prop("disabled", true);
        $(this).hide();
        $(this).siblings(".cpEdit").show();
    });

    $(".cpEdit").click(function() {
        var parentCard = $(this).closest(".card");
        parentCard.removeClass("border-success");
        parentCard.children(".card-header").removeClass("text-white bg-success");
        parentCard.find("input").prop("disabled", false);
        parentCard.find("textarea").prop("disabled", false);
        $(this).hide();
        $(this).siblings(".cpComplete").show();
    });

    $('#formInspection').submit(function(){
        $("#formInspection :disabled").removeAttr('disabled');
    });

});

$(document).on("click",".delAirFilter",function () {
    $(this).closest("li").remove();
}); 

$(document).on("click",".delContact",function () {
    $(this).closest("li").remove();
}); 