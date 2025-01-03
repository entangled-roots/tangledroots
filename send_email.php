<?php
// Check if the form is submitted
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Get form data
    $name = htmlspecialchars($_POST['name']);
    $email = htmlspecialchars($_POST['email']);
    $subject = htmlspecialchars($_POST['subject']);
    $message = htmlspecialchars($_POST['message']);

    // Email settings
    $to = "tangled.roots.holly@gmail.com"; // Your email address
    $email_subject = "Community maps addition: $subject";
    $email_body = "A new community has been submitted for addition to the map-  $name.\n\n" .
                  "Email: $email\n\n" .
                  "Message:\n$message";

    $headers = "From: $email\n";
    $headers .= "Reply-To: $email\n";

    // Send the email
    if (mail($to, $email_subject, $email_body, $headers)) {
        echo "Your community has been sent successfully!";
    } else {
        echo "There was a problem sending your community. Please try again.";
    }
} else {
    echo "Invalid request.";
}
?>
