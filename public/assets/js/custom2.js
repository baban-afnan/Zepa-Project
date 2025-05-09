var currentTab = 0; // Current tab is set to be the first tab (0)
showTab(currentTab); // Display the current tab

function showTab(n) {
    // This function will display the specified tab of the form...
    var x = document.getElementsByClassName("step");
    x[n].style.display = "block";
    //... and fix the Previous/Next buttons:
    if (n == 0) {
        document.getElementById("prevBtn").style.display = "none";
    } else {
        document.getElementById("prevBtn").style.display = "inline";
    }
    if (n == x.length - 1) {
        document.getElementById("nextBtn").innerHTML = "Submit";
    } else {
        document.getElementById("nextBtn").innerHTML = "Next";
    }
    //... and run a function that will display the correct step indicator:
    fixStepIndicator(n);
}

function nextPrev(n) {
    // This function will figure out which tab to display
    var x = document.getElementsByClassName("step");
    // Exit the function if any field in the current tab is invalid:
    if (n == 1 && !validateForm()) return false;
    // Hide the current tab:
    x[currentTab].style.display = "none";
    // Increase or decrease the current tab by 1:
    currentTab = currentTab + n;
    // if you have reached the end of the form...
    if (currentTab >= x.length) {
        // ... the form gets submitted:
        //document.getElementById("signUpForm").submit();
        postForm();
        // return false;
        currentTab = currentTab - n;
    }
    // Otherwise, display the correct tab:
    showTab(currentTab);
}

function validateForm() {
    // This function deals with validation of the form fields
    var x,
        y,
        i,
        valid = true;
    x = document.getElementsByClassName("step");
    y = x[currentTab].getElementsByTagName("input");
    // A loop that checks every input field in the current tab:
    //   for (i = 0; i < y.length; i++) {
    //     // If a field is empty...
    //     if (y[i].value == "") {
    //       // add an "invalid" class to the field:
    //       y[i].className += " invalid";
    //       // and set the current valid status to false
    //       valid = false;
    //     }
    //   }
    // If the valid status is true, mark the step as finished and valid:
    if (valid) {
        document.getElementsByClassName("stepIndicator")[
            currentTab
        ].className += " finish";
    }
    return valid; // return the valid status
}

function fixStepIndicator(n) {
    // This function removes the "active" class of all steps...
    var i,
        x = document.getElementsByClassName("stepIndicator");
    for (i = 0; i < x.length; i++) {
        x[i].className = x[i].className.replace(" active", "");
    }
    //... and adds the "active" class on the current step:
    x[n].className += " active";
}

function postForm() {
    let data = new FormData(this.signUpForm);
    $.ajax({
        type: "post",
        url: "/kyc-registration",
        dataType: "json",
        data,
        processData: false,
        contentType: false,
        cache: false,
        beforeSend: function () {
            // Show loading indicator
            $("#loader_form").show();
        },
        success: function (data) {
            $("#loader_form").show();
            location.reload(true);
        },
        error: function (data) {
            $("#loader_form").hide();
            $.each(data.responseJSON.errors, function (key, value) {
                $("#message").removeClass("text-dark").addClass("text-danger");
                $("#message").html(value);
            });
            setTimeout(function () {
                $("#message").html(
                    "Please provide your details below. Note that accurate information is required, as it will be verified before proceeding. Ensure the details you enter are correct to avoid any delays or issues with the verification process."
                );
                $("#message").removeClass("text-danger").addClass("text-dark");
            }, 5000);
        },
    });
}
