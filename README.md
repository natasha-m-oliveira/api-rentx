## Requirements

### Label
* **FR** - Functional requirements
* **NRF** - Non-functional requirements
* **BR** - Business rule

### **Car Registration**

* FR
  * It should be able register a new car.

* BR
  * It should not be able to register a car with a license plate already registered.
  * The card must be registered with availability.
  * The user responsible for the registration must be an administrator.

### **Car listing**

* FR
  * It should be able to list all available cars.
  * It should be able to list all available cars by category name.
  * It should be able to list all available cars by brand name.
  * It should be able to list all available cars by car name.

* BR
  * The user does not need to be authenticated to the system.

### **Specification registration on the car**

* FR
  * It should be able to file a specification for a car.

* BR
  * It should not be able to register a specification for an unregistered car.
  * It should not be able to register a specification already registered for the same car.
  * The user responsible for the registration must be an administrator.

### **Car images registration**

* FR
  * It should be able to register an image of the car.

* RNF
  * Use multer to upload files.

* BR
  * The user should be able to register more than one image for the same car.
  * The user responsible for the registration must be an administrator.

### **Car rental**

* FR
  * It should be able to register a rental.

* BR
  * The rental should have minimum duration of 24 hours.
  * It should not be able to register a new rental if there is already one open for the same user.
  * It should not be possible to register a new rental if there is already one open for the same car.
  * When making a rental, the car's status must be changed to unavailable.
  * The user must be authenticated in the application.

### **Car Devolution**

* FR
  * It should be able to devolve the car.

* BR
  * If the car is returned less than 24 hours later, the full day will be charged.
  * When returning, the car must be released for a new rental.
  * When returning, the user must be released for a new rental.
  * When returning, the total rent must be calculated.
  * If the return time is longer than the expected delivery time, a fine shall be charged for the days of delay.
  * If there is a fine, it must be added to the total rent.
  * The user must be authenticated in the application.

### **List Rentals By User**

* FR
  * It should be possible to search for all rentals by users.

* BR
  * The user must be authenticated in the application.

### **Reset Password**

* FR
  * It should be able to user to reset his password by informing his e-mail.
  * The user should receive an email with the step by step to reset their password.
  * The user must be able to enter a new password.

* BR
  * The user needs to enter a new password.
  * The link sent to reset the password must expire in 3 hours.
___

## Technology

### Technologies used in the project

- node 16.17.0
- npm 8.19.1

### Main dependencies
- express 4.18.1
- swagger-ui-express 4.5.0
- uuid 9.0.0

## Launch the application

### Docker start
If you are using wsl check if docker is running

run `sudo service docker status`

if the output is **Docker is not running**

run `sudo service docker start`

Access the project folder and run `docker-compose up`

Runs the app in the development mode.
Open http://localhost:3333/api-docs to view it in the browser.


### Author

<div>
  <a href="https://github.com/natasha-m-oliveira">
    <img style="border-radius: 50%;" src="https://avatars.githubusercontent.com/u/85530160?s=400&u=5767a5c6046a41c29ac5b0e24fe44d664fd7d22f&v=4" width="100px;" alt=""/>
    <p><b>Natasha Matos</b></p>
  </a>
  <a href="https://www.linkedin.com/in/natasha-matos-oliveira/" styles="display: block;">
    <img src="https://img.shields.io/badge/-LinkedIn-blue?style=flat-square&logo=Linkedin&logoColor=white&link=https://www.linkedin.com/in/natasha-matos-oliveira/)">
  </a>
</div>