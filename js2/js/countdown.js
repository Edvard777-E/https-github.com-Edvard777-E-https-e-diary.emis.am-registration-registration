function updateCountdown(seconds) {
    var minutes = Math.floor(seconds / 60);
    var remainingSeconds = seconds % 60;
    remainingSeconds = remainingSeconds < 10 ? "0" + remainingSeconds : remainingSeconds;
    var countdownText = minutes + ":" + remainingSeconds;
    $("#countdown").text(countdownText);
}

function startCountdown(sec) {
    var countdownTime = sec;
    updateCountdown(countdownTime);
    var countdownInterval = setInterval(function() {
        countdownTime--;
        updateCountdown(countdownTime);
        if (countdownTime <= 0) {
            clearInterval(countdownInterval);
            $('#2FA_resendBtn').show();
            $('#2FA_checkBtn').hide();
        }
    }, 1000);
}

