$('a[data-toggle="tooltip"]').tooltip();
// $(document).ready(function(){
//     $("#myModal").modal('show');
// });

function _validate(status, errors, form) {
    form = $(form);
    form.find('.form-text.text-danger').text('');
    form.find('.form-group').removeClass('has-danger');
    form.find('[name]').removeClass('form-control-danger');

    if (status != -1) return true;

    for (field in errors) {
        if (errors[field] == "") continue;
        var input = form.find('[name="' + field + '"]');
        //console.log(input);
        input.next('.form-text.text-danger').text(errors[field]);
        input.addClass('form-control-danger');
        input.closest('.form-group').addClass('has-danger');
    }

    return false;
}

function remove(jsonData, url, callback) {
    swal({
        title: 'Ուշադիր',
        text: "Համոզվա՞ծ եք, որ ուզում եք հեռացնել",
        icon: "warning",
        dangerMode: true,
        buttons: {
            cancel: 'Ոչ',
            catch: 'Այո'
        }
    }).then((willDelete) => {
        if (willDelete) {
            $.ajax({
                url: url,
                data: jsonData,
                type: 'POST',
                dataType:'JSON',
                success: function (response) {
                    if (response.status == 1) {
                        if (response.result.transaction_status==='deleted') {
                            w_alert('action_success');
                            callback.call();
                        } else if (response.result.transaction_status==='not_deleted') {
                            w_alert('action_faild','Ուշադրություն',response.result.text);
                        }
                    } else {
                        
                    }
                }
                
            });
        } else {
            return false;
        }
    });
}

function parseResponse(response, actions) {
    actions.datatable = typeof actions.datatable !== 'undefined' ? actions.datatable : { reload: 0, function: '' };
    actions.modal.onInsert = typeof actions.modal.onInsert !== 'undefined' ? actions.modal.onInsert : 'noAction';
    actions.modal.onUpdate = typeof actions.modal.onUpdate !== 'undefined' ? actions.modal.onUpdate : 'hide';
    actions.form.onInsert = typeof actions.form.onInsert !== 'undefined' ? actions.form.onInsert : 'clean';
    actions.form.onUpdate = typeof actions.form.onUpdate !== 'undefined' ? actions.form.onUpdate : 'clean';
    if (response.result.transaction_status === 'not_inserted') {
        w_alert('action_faild', 'Ուշադրություն', response.result.text);
        return false;
    }
    if (response.result.transaction_status === 'not_updated') {
        w_alert('action_faild', 'Ուշադրություն', response.result.text);
        return false;
    }
    if (response.result.transaction_status === 'inserted') {
        w_alert('action_success');
        if (actions.form.onInsert === 'clean') {
            clearFrom($(actions.form.form));
        }
        if (actions.modal.onInsert === 'hide') {
            $(actions.modal.modal).modal('hide');
        }
        if (actions.datatable.reload == 1) actions.datatable.function.call();
        return 'inserted';
    }
    
    if (response.result.transaction_status === 'updated') {
        w_alert('action_success');
        if (actions.form.onUpdate === 'clean') {
            clearFrom($(actions.form.form));
        }
        if (actions.modal.onUpdate === 'hide') {
            $(actions.modal.modal).modal('hide');
        }
        if (actions.datatable.reload == 1) actions.datatable.function.call();
        return 'updated';
    }

}

function w_alert(type,title,text) {
    title = (typeof title !== 'undefined') ? title : 'Շատ լավ է';
    text  = (typeof text !== 'undefined') ?  text : 'Գործողությունը կատարվեց';
    if (type==='action_success') {
        swal({
            title: title,
            text: text,
            icon: "success",
            timer: 1500,
            button: false
        });
    }
    if (type === 'action_faild') {
        swal({
            title: title,
            text: text,
            icon: "error",
            button: 'Լավ'
        });
    }
    if (type === 'action_info') {
        swal({
            title: title,
            text: text,
            icon: "info",
            button: 'Լավ'
        });
    }
}

// $("#loginForm").submit(function (e) {
//     e.preventDefault();
//     formData = new FormData(e.target);
//     $.ajax({
//         url: $("#loginForm").attr('action'),
//         data: formData,
//         cache: false,
//         contentType: false,
//         processData: false,
//         type: 'POST',
//         success: function(result) {
//             result = jQuery.parseJSON(result);
//             console.log(result);
//             return false;
//             if(result.status==-1){
//                 $('.val_errors').html(result.validation_errors);
//             }else if(result.status==-2){
//                 w_alert('action_faild','Ուշադրություն','Սխալ օգտանուն կամ գաղտնաբառ');
//             }else if(result.status==1){
//                 location.href = siteUrl + 'home';
//             }
//         }
//     });
// });

$(document).on("click", ".openTModal", function () {
    $('#exampleModalCenter').modal('show');
});


$(document).on("click", "input[name='terms_conditions']", function () { 
    $('#exampleModalCenter').modal('show');
});
$(document).on("click", ".btnAcceptTerms", function (e) {
    $('input[name="terms_conditions"]').prop('checked', true);
    $('#exampleModalCenter').modal('hide');
    $("#submitButton").removeAttr("disabled");
    //$('.checkBtnSection').html('<a onclick="check_user_data(this)" href="#!" class="btn btn-primary btn-md btn-block waves-effect text-center m-b-20 btnCheckPSSN">Ստուգել տվյալները</a>');
});

$(document).on("click", ".btnRejectTerms", function (e) {
    $('input[name="terms_conditions"]').prop('checked', false);
    $('.checkBtnSection .btnCheckPSSN').remove();
    $('#exampleModalCenter').modal('hide');
});

$('[data-role="datepicker"]').datepicker({
    language: "arm",
    autoclose: true,
    format: 'dd-mm-yyyy',
    todayHighlight: true
})

if (location.hash != "") {
    var url = document.location.toString();
    $('.nav-tabs a[data-target="#' + url.split('#')[1] + '"]').tab('show');
}

$('.nav-tabs a').on('click', function (e) {
    e.preventDefault();
    window.location.hash = $(e.target).data('target');
})

$(document).on("click", ".btnAddChild", function () {
    $('#childrebMdal').modal('show');
})

$("#childrenForm").submit(function (e) {
    $('.searchResults').hide();
    e.preventDefault();
    formData = new FormData(e.target);
    $.ajax({
        url: $("#childrenForm").attr('action'),
        data: formData,
        cache: false,
        contentType: false,
        processData: false,
        type: 'POST',
        dataType : 'json',
        success: function(response) {
            if(response.status==-1){
                $('.val_errors').html(response.validation_errors);
            }else if(response.status==-2){
                alert('Ուշադրություն, աշակերտ չի հայտնաբերվել');
            }else if(response.status==-9){
                alert('Ուշադիր լրացրեք տարեթիվը');
            }else if (response.status == 1) {
                $('.searchResults .student p').text(response.student.first_name + ' ' + response.student.last_name + ' ' + response.student.father_name);
                $('.searchResults .school p').text(response.student.school_name);
                $('.searchResults .class p').text(response.student.grade + response.student.classifier);
                $('.searchResults .saveStudent').attr('data-student_id',response.student.id);
                $('.searchResults').show();
            }
        }
    });
});


$(document).on("click", ".saveStudent", function () {
    var btn = $(this);
    $.ajax({
        url: siteUrl + 'children/save_student',
        data: {
            csrf_token: $('#csrf_token').val(),
            student_id: btn.data('student_id'),
        },
        type: 'POST',
        dataType: 'JSON',
        success: function (response) {
            if (response.status == 1) {
                location.href = siteUrl + 'children';
            } else {
                
            }
        }
    });
});

// ToDO
// $('select[name="month"]').on('change', function () {
//     var month = $(this).val();
//     if (month == 9 || month == 10 || month == 11 || month == 12) {
//         $('input[name=semester]').val(1);
//     } else {
//         $('input[name=semester]').val(2);
//     }
//     $('#myForm').trigger('submit');
    
// });


/*$("#myForm").submit(function () {
    console.log($('select[name="education_year"]'));
});*/

// Diary on change Semester
$("select[data-action=change-semester]").on("change", function () {
    // var monthNum = $(this).find("option:selected").val();
    var monthNum = $(this).val();
    // var getSemester = $("input[data-name=get-semester]").val();
    var studentID = $("input[data-name=diary_student_id]").val();
    var classroomID = $("input[data-name=diary_classroom_id]").val();
    var schoolID = $("input[data-name=diary_school_id]").val();


        $.ajax({
            url: baseUrl+'diary/index/'+studentID+'/'+classroomID+'/'+schoolID,
            type: "POST",
            data: {
                csrf_token : $('#csrf_token').val(),
                monthNum: monthNum
            },
            success: function () {
                // console.log(data);
                // alert("zibil qez");
                if(monthNum == 9 || monthNum == 10 || monthNum == 11 || monthNum == 12){
                    $("input[data-name=get-semester]").val("1");
                }else{
                    $("input[data-name=get-semester]").val("2");
                }
            },
            error: function (error) {
                $(".error_response").empty();
                $(".success_response").empty();
            }
        });

    // +studentID+"/"+classroomID+"/"+schoolID
    /*var country_id = $(this).val();
    if(country_id == '')
    {
        $('#province').prop('disabled', true);
    }
    else
    {
        /!*alert('ok');*!/
        $('#province').prop('disabled', false);
        $.ajax({
            url:"<?php echo base_url() ?>blog/get_province",
            type: "POST",
            data: {'country_id' : country_id},
            dataType: 'json',
            success: function(data){
                /!*console.log(data);*!/
                $('#province').html(data);

            },
            error:function(){
                alert('Error occure..!!');
            }
        });
    }*/

});

function planningHomework(el) {
    var btn = $(el);
    $.ajax({
        url: siteUrl + 'diary/get_daily_planning_homework',
        data: {
            csrf_token : $('#csrf_token').val(),
            day                         : btn.data('day'),
            classroom_id                : btn.data('classroom_id'),
            education_year              : btn.data('education_year'),
            sem                         : btn.data('semester'),
            subject_id                  : btn.data('subject_id'),
            school_id                   : btn.data('school_id')
        },
        type: 'POST',
        dataType:'JSON',
        success: function (response) {
            var teachersHTML = 'Ուսուցիչ` ';
            $.each( response.teacher, function( key, value ) {
                teachersHTML+=value.last_name+' '+value.first_name+'<br>';
            });            
            $('#planningHomeworkModal #planningHomeworkModalTitle').html(teachersHTML);
            $('#planningHomeworkModal .modal-body').html('Օրվա անցած դասը՝ ' + (response.plan===null?'Մուտքագրված չէ':response.plan)+'<br>Տնային՝ '+(response.homework===null?'Մուտքագրված չէ':response.homework));
            $('#planningHomeworkModal').modal('show');
        }
    });
}

var a = $(window).height() - 50;
$(".main-friend-list").slimScroll({
    height: a,
    allowPageScroll: false,
    wheelStep: 5,
    color: '#1b8bf9'
});

$("#search-teachers").on("keyup", function() {
    var g = $(this).val().toLowerCase();
    $(".userlist-box .media-body .chat-header").each(function() {
        var s = $(this).text().toLowerCase();
        $(this).closest('.userlist-box')[s.indexOf(g) !== -1 ? 'show' : 'hide']();
    });
});
    
$('.displayChatbox').on('click', function() {
    var my_val = $('.pcoded').attr('vertical-placement');
    if (my_val == 'right') {
        var options = {
            direction: 'left'
        };
    } else {
        var options = {
            direction: 'right'
        };
    }
    $('.showChat').toggle('slide', options, 500);
});
    
$('.userlist-box').on('click', function () {
        var id = $(this).data('id');
        var my_val = $('.pcoded').attr('vertical-placement');
        if (my_val == 'right') {
            var options = {
                direction: 'left'
            };
        } else {
            var options = {
                direction: 'right'
            };
        }
        $.ajax({
            url: siteUrl + 'diary/get_messages',
            data: {
                teacher : $(this).find('.chat-header').text(),
                csrf_token  : $('#csrf_token').val(),
                id          : id
            },
            type: 'POST',
            dataType:'JSON',
            success: function (response) {
                $('.showChat_inner').html(response.chatHTMl);
                $("#chatMessages").animate({ scrollTop: $('#chatMessages').prop("scrollHeight")}, 2000);
            }
        });
        
    
        $('.showChat_inner').toggle('slide', options, 500);
});
    
$(document).on("click", ".back_chatBox", function () {
    var my_val = $('.pcoded').attr('vertical-placement');
    if (my_val == 'right') {
        var options = {
            direction: 'left'
        };
    } else {
        var options = {
            direction: 'right'
        };
    }
    $('.showChat_inner').toggle('slide', options, 500);
    $('.showChat').css('display', 'block');
});
    
function removeMessage(el) {
    var btn = $(el);
    var id = $(el).data('id');
    $.ajax({
        url: siteUrl + 'diary/remove_messages',
        data: {
            csrf_token: $('#csrf_token').val(),
            id: id
        },
        type: 'POST',
        dataType:'JSON',
        success: function (response) {
            // var messages = response.messages;
            
            // $.each( messages, function( key, message ) {
            //     console.log(message.from + ' -> ' +message.message_text);
            // });
            //$('.showChat_inner').html(response.chatHTMl);
            //console.log(btn.closest('div.chat-messages').html());
            btn.closest('div.chat-messages').remove();
        }
    });
}

function sendMessage(el) {
    var btn = $(el);
    var from = btn.data('from');
    var to = btn.data('to');
    $.ajax({
        url: siteUrl + 'diary/send_messages',
        data: {
            csrf_token: $('#csrf_token').val(),
            from: from,
            to: to,
            message : $('.message-text').val()
        },
        type: 'POST',
        dataType:'JSON',
        success: function (response) {
            $('#chatMessages').append(response.messageHtml);
            $("#chatMessages").animate({ scrollTop: $('#chatMessages').prop("scrollHeight")}, 2000);
            // var messages = response.messages;
            
            // $.each( messages, function( key, message ) {
            //     console.log(message.from + ' -> ' +message.message_text);
            // });
            //$('.showChat_inner').html(response.chatHTMl);
            
        }
    });
}

// Find this week (week of today) diary index
$('.carousel').carousel({
    interval: false
});
findCurrentSlide();

function formatDateByTimestamp(timestamp){
    timestamp = new Date(timestamp);
    var d = timestamp.getDate().toString();
    var dd = (d.length === 2) ? d : "0"+d;
    var m = (timestamp.getMonth()+1).toString();
    var mm = (m.length === 2) ? m : "0"+m;
    return(dd+"."+mm+ "." + (timestamp.getFullYear()).toString());
}

function findCurrentSlide() {
    var todayDate = new Date(); //Today
    var twoDigitMonth = ((todayDate.getMonth().length + 1) === 1) ? (todayDate.getMonth() + 1) : '0' + (todayDate.getMonth() + 1);
    // var todayStringdd = new Date('2019', '08'-1, '17');
    // var todayStringss = new Date('2019', '08'-1, '17');

    var weekDayNumber = todayDate.getDay();

    var todayRangeStart = new Date();
    var todayRangeEnd = new Date();
    var rangeStart;
    var rangeEnd;
    switch (weekDayNumber) {
        case 0:
            //Sunday
            rangeStart = formatDateByTimestamp(todayRangeStart.setDate(todayRangeStart.getDate() + 1));
            rangeEnd = formatDateByTimestamp(todayRangeEnd.setDate(todayRangeEnd.getDate() + 6));
            break;
        case 1:
            //Monday
            rangeStart = formatDateByTimestamp(todayRangeStart.setDate(todayRangeStart.getDate()));
            rangeEnd = formatDateByTimestamp(todayRangeEnd.setDate(todayRangeEnd.getDate() + 5));
            break;
        case 2:
            //Tuesday
            rangeStart = formatDateByTimestamp(todayRangeStart.setDate(todayRangeStart.getDate() - 1));
            rangeEnd = formatDateByTimestamp(todayRangeEnd.setDate(todayRangeEnd.getDate() + 4));
            break;
        case 3:
            //Wednesday
            rangeStart = formatDateByTimestamp(todayRangeStart.setDate(todayRangeStart.getDate() - 2));
            rangeEnd = formatDateByTimestamp(todayRangeEnd.setDate(todayRangeEnd.getDate() + 3));
            break;
        case 4:
            //Thursday
            rangeStart = formatDateByTimestamp(todayRangeStart.setDate(todayRangeStart.getDate() - 3));
            rangeEnd = formatDateByTimestamp(todayRangeEnd.setDate(todayRangeEnd.getDate() + 2));
            break;
        case 5:
            //Friday
            rangeStart = formatDateByTimestamp(todayRangeStart.setDate(todayRangeStart.getDate() - 4));
            rangeEnd = formatDateByTimestamp(todayRangeEnd.setDate(todayRangeEnd.getDate() + 1));
            break;
        case 6:
            //Saturday
            rangeStart = formatDateByTimestamp(todayRangeStart.setDate(todayRangeStart.getDate() - 5));
            rangeEnd = formatDateByTimestamp(todayRangeEnd.setDate(todayRangeEnd.getDate()));
    }

    var dateRange = rangeStart + "-" + rangeEnd;

    // console.log("rangeStart: "+rangeStart);
    // console.log("rangeEnd: "+rangeEnd);

    var index = $('button[data-dateRange="' + dateRange + '"]').attr('data-slide-to');
    $('.carousel').carousel(parseInt(index));
}


function activeIndicator(e) {
    if (document.querySelector('#indicator_container button.active_indicator') !== null) {
        document.querySelector('#indicator_container button.active_indicator').classList.remove('active_indicator');
    }
    e.target.className = "btn btn-info btn-round active_indicator";
}

$("#childRmForm").submit(function (e) {
    $('.searchResults').hide();
    e.preventDefault();
    formData = new FormData(e.target);
    $.ajax({
        url: $("#childRmForm").attr('action'),
        data: formData,
        cache: false,
        contentType: false,
        processData: false,
        type: 'POST',
        dataType : 'json',
        success: function (response) {
            location.href = siteUrl + 'children/index';
            /*
            if(response.status==-1){
                $('.val_errors').html(response.validation_errors);
            }else if(response.status==-2){
                alert('Ուշադրություն, աշակերտ չի հայտնաբերվել');
            } else if (response.status == 1) {
                $('.searchResults .student p').text(response.student.first_name + ' ' + response.student.last_name + ' ' + response.student.father_name);
                $('.searchResults .school p').text(response.student.school_name);
                $('.searchResults .class p').text(response.student.grade + response.student.classifier);
                $('.searchResults .saveStudent').attr('data-student_id',response.student.id);
                $('.searchResults').show();
            }
            */
        }
    });
});

$("select[name='marz']").on("change", function () {
    var marz        = $(this).val();
    var region      = $('select[name="region"] option:selected').val();
    var search_key = $('input[name="search_key"]').val();
    var student_id  = $('input#student_id').val();
    $.ajax({
        url: baseUrl+'diary/get_regions_my_marz',
        type: "POST",
        data: {
            csrf_token  : $('#csrf_token').val(),
            marz        : marz
        },
        success: function (response) {
            var res = JSON.parse(response);
            $('select[name="region"]').empty();
            $('select[name="region"]').append(res.select_option);
        },
        error: function (error) {
        }
    });
    search_school(marz,region,search_key,student_id);
    //return false;
    
});

$("select[name='region']").on("change", function () {
    var marz        = $('select[name="marz"] option:selected').val();
    var region      = $(this).val();
    var search_key = $('input[name="search_key"]').val();
    var student_id  = $('input#student_id').val();
    $.ajax({
        url: baseUrl+'diary/get_schools',
        type: "POST",
        data: {
            csrf_token      : $('#csrf_token').val(),
            marz            : marz,
            region          : region,
            search_key: search_key,
            student_id : student_id
        },
        success: function (response) {
            var res = JSON.parse(response);
            $('select[name="region"]').empty();
            $('select[name="region"]').append(res.select_option);
        },
        error: function (error) {
        }
    });
});

var old_val = null;

$(document).on('keyup', "input[name=search_key]", function () {
    // if (old_val == null) old_val = current_val;
    var thisobj = $(this);
    if (thisobj.val().trim().length>=3) {
        var marz        = $('select[name="marz"] option:selected').val();
        var region      = $('select[name="region"] option:selected').val();
        var search_key  = thisobj.val().trim();
        var student_id  = $('input#student_id').val();
        search_school(marz, region, search_key,student_id);
    }
    // setTimeout(function () {
    //     // console.log(old_val, thisobj.val());
    //     if (old_val == thisobj.val()) {
    //     // AJAX
    //         console.log(thisobj.val());
    //     }
    //     old_val = thisobj.val();
        
    // }, 1500);
})

function search_school(marz, region, search_key,student_id) {
    $('.schools_list').empty();
    $.ajax({
        url: baseUrl+'diary/get_schools',
        type: "POST",
        data: {
            csrf_token : $('#csrf_token').val(),
            marz: marz,
            region: region,
            search_key: search_key,
            student_id : student_id
        },
        success: function (response) {
            res = JSON.parse(response);
            $('.schools_list').html(res.schools_html);
        },
        error: function (error) {
            
        }
    });
    
}

function getDiaryData(el) {
    $('.btn-primary').addClass('btn-outline-primary');
    $(".btn-primary").removeClass("btn-primary"); 
    $(el).removeClass('btn-outline-primary');
    $(el).addClass('btn-primary');
    $('.loading-PCONTROL').css('display','block');
    weekday         = $(el).data('week');
    student_id      = $(el).data('stdid');
    school_id       = $(el).data('sid');
    classroom_id    = $(el).data('classroomid');
    $.ajax({
        url: baseUrl+'diary/getDiaryData',
        type: "POST",
        data: {
            csrf_token : $('#csrf_token').val(),
            weekday: weekday,
            student_id : student_id,
            school_id : school_id,
            classroom_id : classroom_id
        },
        success: function (response) {
            
            resp = JSON.parse(response);
            $('.schedule_section').html(resp.html);
            $('.loading-PCONTROL').css('display','none');
        },
        error: function (error) {
            
        }
    });
}



function openPlanningModal(el) { 
    var smis_schedule_details_id = $(el).data('ssid');
    //console.log(smis_schedule_details_id);
    $.ajax({
        url: baseUrl+'diary/GP',
        type: "POST",
        data: {
            csrf_token : $('#csrf_token').val(),
            ssid: smis_schedule_details_id
        },
        success: function (response) {
            resp = JSON.parse(response);
        },
        error: function (error) {
            
        }
    });
    $('#planningHomeworkModal').modal('show');
    
}

$('.collapse').collapse()


/* -- Message -- */
// if(typeof messageTitle !== null && messageText !== null){
// 	$("#messageModal .modal-title").html(messageTitle)
// 	$("#messageModal .modal-body").html(messageText)
// 	$('#messageModal').modal({backdrop: 'static', keyboard: false})
// 	$("#messageModal").modal("show");
// }


if (messages && messages.length) {
    let len_data = messages.length;
    messages.map((el, i) => {
        $('#custom_b').prepend(`
            <div class="modal fade" id="messageModal${i}" tabindex="-1" aria-hidden="true">
                <div class="modal-dialog modal-lg" role="document">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title">
                                ${el.title}
                            </h5>
                        </div>
                        <div class="modal-body p-b-0">
                            ${el.text}
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-dark" 
                                ${len_data > (i+1) ? `data-toggle="modal" data-target="#messageModal${i+1}" data-dismiss="modal"` : `data-dismiss="modal"`}>
                                Փակել
                            </button>
                        </div>
                    </div>
                </div>
            </div>	
        `);
    });
    $('#messageModal0').modal("show");
} 
