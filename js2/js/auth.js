// $( document ).ready(function() {

//     grecaptcha.ready(function() {
//         grecaptcha.execute('6LdLjS4kAAAAADlITEBu9oz9vc7HA8tTMvScmgKu', {action: 'submit'}).then(function(token) {
//             'oksdad'
//           $('#registerCaptcha').val(token);
//           $('#loginCaptcha').val(token);
//         });
//     })
// });
 

function check_user_data(el) {
    var btn = $(el);
    var value = $('#soc_number').val();
    $('.loading-PCONTROL').css('display','block');
    if (value.length == 10) {
        formData = new FormData();
        formData.append('first_name',$('input[name="first_name"]').val());
        formData.append('last_name',$('input[name="last_name"]').val());
        formData.append('ssn', value);
        formData.append('csrf_token', $('#csrf_token').val());
     
        $.ajax({
            url: siteUrl+'auth/checkssn',
            data: formData,
            cache: false,
            contentType: false,
            processData: false,
            type: 'POST',
            dataType: 'json',
            success: function (response) {
                $('.loading-PCONTROL').css('display','none');
                if (response.status == 0) {
                    $('#soc_number').addClass('form-txt-danger');
                    $('input[name="first_name"]').addClass('form-txt-danger');
                    $('input[name="last_name"]').addClass('form-txt-danger');
                    $('.register_form_message').text('Սխալ մուտքագրված տվյալներ');
                    $('.register_form_message').css('display', 'block');
                    // $('#loader-Modal2').modal('hide');
                    return false;
                }
                if (response.status == -5) {
                    
                    $('#soc_number').addClass('form-txt-danger');
                    $('.register_form_message').text('Նման ՀԾՀ-ով օգտագործող արդեն գրանցված է համակարգում։');
                    $('.register_form_message').css('display', 'block');
                    //$('#loader-Modal2').modal('hide');
                    return false;
                }
                
                if (response.status == 1) {
                    btn.remove();
                    $('input[name="terms_conditions"]').closest('.row').remove();
                    $('#soc_number').removeClass('form-txt-danger');
                    $('input[name="first_name"]').removeClass('form-txt-danger');
                    $('input[name="last_name"]').removeClass('form-txt-danger');
                    $('#soc_number').addClass('form-txt-success');
                    $('input[name="first_name"]').addClass('form-txt-success');
                    $('input[name="last_name"]').addClass('form-txt-success');
                    $('.form_controls').css('display', 'block');
                    
                    $('#soc_number').attr('disabled', true);
                    $('input[name="first_name"]').attr('disabled', true);
                    $('input[name="last_name"]').attr('disabled', true);
                    $(response.html).insertBefore('.register_form_message');
                    $('div.register_form_message').text('');
                    $('.register_form_message').css('display', 'none');
                    //$('#loader-Modal2').modal('hide');
                    return false;
                }
            }
        });
    } else {
        $('.loading-PCONTROL').css('display','none');
    }
}
$("#soc_number").on("change paste keyup", function() {});

$("#userRegisterForm").submit(function (e) {
    e.preventDefault();
 
             submitForm( e);
    
});

function submitForm(e) {
    $('*').removeClass('form-txt-danger');
	$('.register_form_message').text('');
	$('.register_form_message').css('display','none');
    const password = $("input[name=password]").val().trim() ;
    const repeatPassword = $("input[name=r_password]").val().trim();
    if(!password.match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/)){
		$('#password').addClass('form-txt-danger');
		$('.register_form_message').text('Գաղտնաբառը պետք է պարունակի նվազագույնը ութ նիշ, առնվազն մեկ մեծատառ, մեկ փոքրատառ, մեկ թիվ և մեկ հատուկ նիշ (@$!%*?&)');
		$('.register_form_message').css('display','block');
		return false;
	}
    if(password !== repeatPassword){
		$('#password').addClass('form-txt-danger');
		$('#r_password').addClass('form-txt-danger');
		$('.register_form_message').text('"Գրեք գաղտնաբառը ևս մեկ անգամ" դաշտը չի համընկում "Գրեք գաղտնաբառ" դաշտի հետ');
		$('.register_form_message').css('display','block');
		return false;
	}
    formData = new FormData(e.target);
    let captchaToken = grecaptcha.getResponse();
    formData.append('recaptcha_token',captchaToken);
    formData.append('first_name',$('input[name="first_name"]').val());
    formData.append('last_name',$('input[name="last_name"]').val());
    formData.append('soc_number',$('input[name="soc_number"]').val());
    $('.loading-PCONTROL').css('display','block');
  
    $.ajax({
        url: $("#userRegisterForm").attr('action'),
        data: formData,
        cache: false,
        contentType: false,
        processData: false,
        type: 'POST',
        dataType: 'json',
        success: function (response) {
            $('.loading-PCONTROL').css('display','none');
            if (response.status == -105) { 
                $('#email').addClass('form-txt-danger');
                $('.register_form_message').text('Նման Էլ․ փոստով օգտագործող արդեն գրանցված է համակարգում։');
                $('.register_form_message').css('display','block');
                return false;
            }
            
            if (response.status == -1) { 
                //alert('validation errors');
                return false;
            }
            if(response.status == -201){
                $('.register_form_message').text(response.errors.captcha);
                $('.register_form_message').css('display','block');
            }
            if (response.status == 1) {
                $('.auth-box form').remove();
                $('.txt-primary').html('Հաշիվը ակտիվացնելու հղումը ուղարկվել է ' + formData.get('email')+ ' հասցեին' + '<br><div style="margin-top:38px" class="col-md-12"><a href="'+siteUrl+'" class="btn btn-primary btn-md btn-block waves-effect text-center m-b-20">Մուտք</a></div>');
                return false; 
            }
            if(response.status == -200){
                $('.register_form_message').text(response.message);
                $('.register_form_message').show();
            }
            
            
        }
    });
}
$("#userSignInForm").submit(function (e) {
    e.preventDefault();
    submitLoginForm( e);
  
  
});
function submitLoginForm(e) {
    formData = new FormData(e.target);
    let captchaToken = grecaptcha.getResponse();
    formData.append('recaptcha_token',captchaToken);
    $('.loading-PCONTROL').css('display','block');
    $.ajax({
        url: $("#userSignInForm").attr('action'),
        data: formData,
        cache: false,
        contentType: false,
        processData: false,
        type: 'POST',
        dataType: 'json',
        success: function (response) {   
            $('.loading-PCONTROL').css('display','none');
			if (response.status == -729) { 
                alert('Խնդրում ենք թարմացնել էջը և կրկին փորձել');
                return false;
            }
            if (response.status == -100 || response.status == -101 || response.status == -200) { 
                $('.loginFaild').text(response.message);
                $('.loginFaild').show();
                return false;
            }
            if (response.status == -1000) {
                $('.auth-box').remove();
                $('.message-box').css('display', 'block')
                $('.message-box span').html('Ձեր հաշիվը ակտիվ չէ: Հաշիվը ակտիվացնելու համար անհրաժեշտ է վերականգնել գաղտնաբառը:  <br><div style="margin-top:38px" class="col-md-12"><a href="auth/forget" class="btn btn-primary btn-md btn-block waves-effect text-center m-b-20">Վերականգնել գաղտնաբառը</a></div>');
                return false;
            }
            if (response.status == -102) { 
                location.href = siteUrl + 'ssncheck';
            }
            if (response.status == -1) { 
                $('.loginFaild').text('Դաշտերը պարտադիր է լրացնել։');
                $('.loginFaild').show();
                return false;
            }
            if (response.status == 100) { 
                location.href = siteUrl + 'children';
            }
            if(response.status == -201){
                $('.loginFaild').text(response.errors.captcha);
                $('.loginFaild').show();
            }
            if(response.two_factor == 1) {
                $('.login-card').remove();
                $('.2FA_section input[name="2fa_id"]').val(response.id);
                $('.2FA_section input[name="2fa_email"]').val(response.email);
                $('.2FA_section input[name="csrf_token"]').val(response.csrf);
                $('.2FA_section').show();
                startCountdown(300);
            }
            else {
                location.reload();
            } 
            
        }
    });
}
$("#CheckRegDataForm").submit(function (e) {
    e.preventDefault();
    formData = new FormData(e.target);
    let captchaToken = grecaptcha.getResponse();
    formData.append('recaptcha_token',captchaToken);
    $('.loading-PCONTROL').css('display','block');
    $.ajax({
        url: $("#CheckRegDataForm").attr('action'),
        data: formData,
        cache: false,
        contentType: false,
        processData: false,
        type: 'POST',
        dataType: 'json',
        success: function (response) {
            $('.loading-PCONTROL').css('display','none');
            if (response.status == -2) { 
                $('.loginFaild').text('Նշված տվյալներով գրանցում չի հայտնաբերվել');
                $('.loginFaild').show();
                return false;
            }
            if (response.status == -1) { 
                $('.loginFaild').text('Դաշտերը պարտադիր է լրացնել։');
                $('.loginFaild').show();
                return false;
            }
            if (response.status == 1) {
                $('.auth-box').remove();
                $('.message-box').css('display', 'block')
                $('.message-box span').html('Խնդրում ենք ստուգել ' + formData.get('email') + '-ին ուղարկված նամակը');//.............................
                return false;
            }
            if(response.status == -200){
                $('.loginFaild').text(response.message);
                $('.loginFaild').show();
                return false;
            }
            
        }
    });
});

$("#changePasswordForm").submit(function (e) {
    e.preventDefault();
    formData = new FormData(e.target);
    let captchaToken = grecaptcha.getResponse();
    formData.append('recaptcha_token',captchaToken);
	$('*').removeClass('form-txt-danger');
	$('.change_password_form_message').text('');
	$('.change_password_form_message').css('display','none');
	const password = $("input[name=pass1]").val().trim() ;
	const repeatPassword = $("input[name=pass2]").val().trim();
	if(!password.match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/)){
		$('#password').addClass('form-txt-danger');
		$('.change_password_form_message').text('Գաղտնաբառը պետք է պարունակի նվազագույնը ութ նիշ, առնվազն մեկ մեծատառ, մեկ փոքրատառ, մեկ թիվ և մեկ հատուկ նիշ (@$!%*?&)');
		$('.change_password_form_message').css('display','block');
		return false;
	}
	if(password !== repeatPassword){
		$('#password').addClass('form-txt-danger');
		$('#r_password').addClass('form-txt-danger');
		$('.change_password_form_message').text('"Կրկնել նոր գաղտնաբառը ևս մեկ անգամ" դաշտը չի համընկում "Նոր գաղտնաբառ" դաշտի հետ');
		$('.change_password_form_message').css('display','block');
		return false;
	}
    $('.loading-PCONTROL').css('display','block');                
    $.ajax({
        url: $("#changePasswordForm").attr('action'),
        data: formData,
        cache: false,
        contentType: false,
        processData: false,
        type: 'POST',
        dataType: 'json',
        success: function (response) {
            $('.loading-PCONTROL').css('display','none');
            if (response.status == -2) { 
                location.href = siteUrl + 'auth';
                return false;
            }
            if (response.status == -1) { 
                $('.loginFaild').text('Դաշտերը պարտադիր է լրացնել։');
                $('.loginFaild').show();
                return false;
            }
            if (response.status == 1) { 
                $('.auth-box').remove();
                $('.message-box').css('display', 'block')
                $('.message-box span').html('Ձեր գաղտնաբառը փոփոխված է։ Կարող եք մուտք լինել։ <a href="'+ siteUrl + 'auth' +'" class="btn btn-primary btn-md btn-block waves-effect text-center m-b-20">Շարունակել</a>');
            }
            if(response.status == -200){
                $('.loginFaild').text(response.message);
                $('.loginFaild').show();
            }
            
        }
    });
});


$("#remailForm").submit(function (e) {
    e.preventDefault();
    formData = new FormData(e.target);
    $('.loading-PCONTROL').css('display','block');
    $.ajax({
        url: $("#remailForm").attr('action'),
        data: formData,
        cache: false,
        contentType: false,
        processData: false,
        type: 'POST',
        dataType: 'json',
        success: function (response) {
            $('.loading-PCONTROL').css('display','none');
            if (response.status == -2) {
                $('.faild').text('Նշված տվյալներով գրանցում չի հայտնաբերվել');
                $('.faild').show();
                return false;
            }
            if (response.status == -1) { 
                $('.faild').text('Դաշտերը պարտադիր է լրացնել։');
                $('.faild').show();
                return false;
            }
            if (response.status == 1) {
                //$('.auth-box').remove();
                //$('.message-box').css('display', 'block')
                //$('.message-box span').text('Խնդրում ենք ստուգել ' + formData.get('email') + '-ին ուղարկված նամակը');
                location.href = siteUrl + 'auth/updemail/'+ response.cd;
            }
            
        }
    });
});
$("#create_new_emailForm").submit(function (e) {
    e.preventDefault();
    formData = new FormData(e.target);
    $('.loading-PCONTROL').css('display','block');
    $.ajax({
        url: $("#create_new_emailForm").attr('action'),
        data: formData,
        cache: false,
        contentType: false,
        processData: false,
        type: 'POST',
        dataType: 'json',
        success: function (response) {
            $('.loading-PCONTROL').css('display','none');
            if (response.status == -2) {
                $('.faild').text('Նշված տվյալներով գրանցում չի հայտնաբերվել');
                $('.faild').show();
                return false;
            }
            if (response.status == -1) { 
                $('.faild').text('Դաշտերը պարտադիր է լրացնել։');
                $('.faild').show();
                return false;
            }
            if (response.status == 1) {
                $('.auth-box').remove();
                $('.message-box').css('display', 'block')
                $('.message-box span').text('Խնդրում ենք ստուգել ' + formData.get('new_meail') + '-ին ուղարկված նամակը');
            }
            
        }
    });
});


$(".btnSendActivationEmail").click(function (e) {
    formData = new FormData();
    formData.append('csrf_token', $('#csrf_token').val());
    formData.append('c_data', $('#c_data').val());
    $('.loading-PCONTROL').css('display','block');
    $.ajax({
        url: siteUrl+'auth/resend_activation_email',
        data: formData,
        cache: false,
        contentType: false,
        processData: false,
        type: 'POST',
        dataType: 'json',
        success: function (response) {
            $('.loading-PCONTROL').css('display','none');
            if (response.status == -1) { 

            }
        }
    }); 
});

$("#ssncheck_Form").submit(function (e) {
    e.preventDefault();
    formData = new FormData(e.target);
    $('#loader-Modal2').modal('show');
    $.ajax({
        url: $("#ssncheck_Form").attr('action'),
        data: formData,
        cache: false,
        contentType: false,
        processData: false,
        type: 'POST',
        dataType: 'json',
        success: function (response) {
            if (response.status == 0) {
                $('.faild').text('Նշված ՀԾՀ-ով անձ բնակչության պետական ռեգիստրում չի հայտնաբերվել');
                $('.faild').show();
                $('#loader-Modal2').modal('hide');
                return false;
            }
            if (response.status == -1) {
                $('.faild').text('Նշված Էլ․ փոստով հաշիվ չի հայտնաբերվել');
                $('.faild').show();
                $('#loader-Modal2').modal('hide');
                return false;
            }
            if (response.status == 1) {
                $('#loader-Modal2').modal('hide');
                $('.auth-box').empty();
                $('.auth-box').append('<span style="color:black">Շնորհակալություն։ Այժմ կարող եք մուտք լինել համակարգ։</span>');
                return false;
            }
            
        }
    });
});

$(document).on("click", "#2FA_checkBtn", function (e) {
    rememberDevice = $('input[id=remember]').is(":checked");
    // $('#loading').show();
    $('.2fa_log_errors').text('');
    $.ajax({
        url: siteUrl + 'auth/check_2FA',
        data: {
            id: $('input[name=2fa_id]').val(),
            email: $('input[name=2fa_email]').val(),
            remember: rememberDevice ? '1' : '0',
            verification_code: $('input[name=verification_code]').val(),
            csrf_token: $('input[name=csrf_token]').val()
        },
        type: 'POST',
        dataType: 'json',
        success: function (response) {
            // $('#loading').hide();
            if (response.status == 1) {
                location.reload();
            } else {
                $('#2FA_resendBtn').show();
                $('input[name=csrf_token]').val(response.csrf);
                $('.2fa_log_errors').text(response.m);
            }
        }
    });
});

$(document).on("click", "#2FA_resendBtn", function (e) {   
    $('.2fa_log_errors').text('');
    // $('#loading').show();
    $.ajax({
        url: siteUrl + 'auth/resend_2FA',
        data: {
            id : $('.2FA_section input[name="2fa_id"]').val(),
            email: $('.2FA_section input[name="2fa_email"]').val(),
            csrf_token: $('input[name=csrf_token]').val()
        },
        type: 'POST',
        dataType: 'json',
        success: function (response) {
            $('#loading').hide();
            $('#2FA_resendBtn').hide();
            $('#2FA_checkBtn').show();
            if (response.status == 1) {
                $('input[name=csrf_token]').val(response.csrf);
                startCountdown(300);
            } else {
                // $('.log_errors').text('Սխալ ՀԾՀ կամ գաղտնաբառ');
            }
        }
    });
});