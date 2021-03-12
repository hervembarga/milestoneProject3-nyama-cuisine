function sendMail(contactForm){
    emailjs.send('service_xw', 'template_fm2y2gi', {
        "from_name":contactForm.name.value ,
        "from_email": contactForm.email.value ,
        "from_message" : contactForm.message.value
    })
    .then(
        function (response){
            console.log("SUCCESS", response);
            alert(" Your message has been sent");
        },
        function (error){
            console.log("FAILED", error);
            alert(" Message not sent. Please try again");
            
        }); 
        
            console.log(contactForm.name.value);     
        document.getElementById("sendMail").reset();
        return false;     
}