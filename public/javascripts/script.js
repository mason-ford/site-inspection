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
                                <div class="form-group col-md-6">
                                    <label for="airfilter-type-`+rand+`">Type</label>
                                    <input type="text" class="form-control" name="airfilter_type[]" id="airfilter-type-`+rand+`" required title="Air Filter type">
                                </div>
                                <div class="form-group col-md-6">
                                    <label for="airfilter-quantity-`+rand+`">Quantity</label>
                                    <input type="text" class="form-control" name="airfilter_quantity[]" id="airfilter-quantity-`+rand+`" title="Air Filter Quantity">
                                </div>
                            </div>
                            <div class="form-row">
                                <div class="form-group col-md-12">
                                    <label for="airfilter-size-`+rand+`">Size</label>
                                    <input type="text" class="form-control" name="airfilter_size[]" id="airfilter-size-`+rand+`" title="Air Filter size ex. 10x20x1">
                                </div>
                            </div>
                            <div class="form-row">
                                <div class="form-group col-md-12">
                                    <label for="airfilter-information-`+rand+`">Information</label>
                                    <textarea class="form-control" name="airfilter_information[]" id="airfilter-information-`+rand+`" title="Air Filter Information" rows="5"></textarea>
                                </div>
                            </div>
                            <div class="form-row">
                                <span class="card-text javaLink delAirFilter">
                                    <i class="bi bi-x-circle-fill"></i>
                                    Delete
                                </span>
                            </div>
                        </li>`;
        $("#airFilterList").append(newHTML);
    });

    $("#addContact").click(function() {
        var rand = Math.floor(Math.random()*10*(new Date().getTime()));
        var newHTML = ` <li class="list-group-item contactItem">
                            <div class="form-row">
                            <div class="form-group col-md-12">
                                <label for="contact-name-`+rand+`">Name</label>
                                <input type="text" class="name form-control" name="contact_name[]" id="contact-name-`+rand+`" required title="Contact Name">
                            </div>
                            </div>
                            <div class="form-row">
                            <div class="form-group col-md-6">
                                <label for="contact-number-`+rand+`">Number</label>
                                <input type="text" class="number form-control" name="contact_number[]" id="contact-number-`+rand+`" title="Contact Number">
                            </div>
                            <div class="form-group col-md-6">
                                <label for="contact-email-`+rand+`">Email</label>
                                <input type="text" class="email form-control" name="contact_email[]" id="contact-email-`+rand+`" title="Contact Email">
                            </div>
                            </div>
                            <div class="form-row">
                            <div class="form-group col-md-12">
                                <label for="contact-info-`+rand+`">Info</label>
                                <textarea class="information form-control" name="contact_info[]" id="contact-info-`+rand+`" title="Contact Info" rows="5"></textarea>
                            </div>
                            </div>
                            <div class="form-row">
                                <div class="buttons form-group col">
                                    <button type="button" class="addBtn btn btn-primary float-left">Add</button>
                                </div>
                            </div>
                        </li>`;
        $("#contactList").append(newHTML);
    });

    $('#contactList').on('click', '.addBtn', function() {
        console.log('Contact Add Click');

        var contactItem = $(this).closest('.contactItem');

        var name = contactItem.find('.name').val();
        var number = contactItem.find('.number').val();
        var email = contactItem.find('.email').val();
        var information = contactItem.find('.information').val();
        var siteId = $('.site-edit-form').data('site-id');

        // Make AJAX request to update contact via API
        $.ajax({
            url: '/sites/contacts/',
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({ siteId: siteId, name: name, number: number, email: email, information: information }), // Convert data to JSON format
            success: function(response) {
                console.log('Contact added successfully');
                contactId = response.id;
                contactItem.data("contact-id", contactId);
                contactItem.find(".buttons").html(`
                    <button type="button" class="updateBtn btn btn-success float-left">Update</button>
                    <button type="button" class="deleteBtn btn btn-danger float-right">Delete</button>
                `);
            },
            error: function(xhr, status, error) {
                console.error('Error adding contact:', error);
            }
        });
    });

    $('#contactList').on('click', '.deleteBtn', function() {
        console.log('Contact Delete Click');

        var contactItem = $(this).closest('.contactItem');
        var contactId = contactItem.data('contact-id'); // Assuming you have a data attribute to store contact id

        // Ask for confirmation before deleting the contact
        var confirmDelete = confirm("Are you sure you want to delete this contact?");

        if (confirmDelete) {
            // Make AJAX request to delete contact via API
            $.ajax({
                url: '/sites/contacts/' + contactId,
                type: 'DELETE',
                success: function(response) {
                    contactItem.remove(); // Remove contact from DOM if deletion is successful
                    console.log('Contact deleted successfully');
                },
                error: function(xhr, status, error) {
                    console.error('Error deleting contact:', error);
                }
            });
        }
    });

    $('#contactList').on('click', '.updateBtn', function() {
        console.log('Contact Update Click');

        var contactItem = $(this).closest('.contactItem');

        var name = contactItem.find('.name').val();
        var number = contactItem.find('.number').val();
        var email = contactItem.find('.email').val();
        var information = contactItem.find('.information').val();
        var contactId = contactItem.data('contact-id');

        // Make AJAX request to update contact via API
        $.ajax({
            url: '/sites/contacts/' + contactId,
            type: 'PUT',
            contentType: 'application/json',
            data: JSON.stringify({ name: name, number: number, email: email, information: information }), // Convert data to JSON format
            success: function(response) {
                console.log('Contact updated successfully');
            },
            error: function(xhr, status, error) {
                console.error('Error updating contact:', error);
            }
        });
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