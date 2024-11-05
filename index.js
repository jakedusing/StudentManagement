// Person class to respresent a person with a name and age
class Person {
  constructor(name, age) {
    this.name = name; // assign name
    this._age = age; // assign age (using a private variable)
  }

  // Getter for age
  get age() {
    return this._age;
  }

  // Setter for age with validation
  set age(newAge) {
    if (newAge < 0) {
      console.log("Age cannot be negative.");
    } else {
      this._age = newAge;
    }
  }

  // Method to greet
  greet() {
    return `Hello, my name is ${this.name} and I am ${this.age} years old.`;
  }

  // Method to increment age (simulate a birthday)
  haveBirthday() {
    this.age++;
  }
}

// Student class that extends Person, adding major and course functionality
class Student extends Person {
  constructor(name, age, major) {
    super(name, age); // call the constructor of the parent class
    this.major = major; // assign major
    this.courses = {}; // initialize an object to store courses and grades
  }

  // Method to simulate studying
  study() {
    return `${this.name} is studying ${this.major}.`;
  }

  // Method to enroll in a course
  enroll(course) {
    this.courses[course] = null; // Initialize with null grade
  }

  // Method to add a grade to a course
  addGrade(course, grade) {
    if (this.courses.hasOwnProperty(course)) {
      this.courses[course] = grade; // Set the grade for the enrolled course
    }
  }

  // Method to calculate GPA based on enrolled courses and their grades
  getGPA() {
    let totalPoints = 0; // To accumulate points based on grades
    let totalCourses = 0; // to count courses with grades

    // Iterate through each course to calculate total points and count courses
    for (const course in this.courses) {
      const grade = this.courses[course];
      if (grade !== null) {
        // only consider courses with grades
        totalCourses++;
        if (grade >= 90) {
          totalPoints += 4.0;
        } else if (grade >= 80) {
          totalPoints += 3.0;
        } else if (grade >= 70) {
          totalPoints += 2.0;
        } else if (grade >= 60) {
          totalPoints += 1.0;
        }
      }
    }
    // return GPA or 0.00 if no courses have grades
    return totalCourses > 0 ? (totalPoints / totalCourses).toFixed(2) : 0.0;
  }
}

// Global student variable
let student;

// Function to enable/disable "Create Student" button based on form validation
function checkFormValidation() {
  const name = document.getElementById("studentName").value.trim();
  const age = document.getElementById("studentAge").value.trim();
  const major = document.getElementById("studentMajor").value.trim();
  const button = document.getElementById("createStudent").value;

  // Enable the button only if all fields are filled
  if (name && age && major) {
    button.disabled = false;
  } else {
    button.disabled = true;
  }
}

// Function to create a new student
document.getElementById("createStudent").onclick = () => {
  //Prevent form submission if button is clicked when disabled
  if (document.getElementById("createStudent").disabled) {
    event.preventDefault();
    return;
  }
  const name = document.getElementById("studentName").value;
  const age = parseInt(document.getElementById("studentAge").value);
  const major = document.getElementById("studentMajor").value;

  // Validate that the age is a number and greater than 0
  if (!name || !age || !major || isNaN(age) || age <= 0) {
    alert("Please fill in all fields with valid information");
    return;
  }

  // create a new student instance
  student = new Student(name, age, major);

  document.getElementById("studentDisplayName").innerText = student.name;
  document.getElementById("studentActions").style.display = "block";

  document.getElementById("studentName").disabled = true;
  document.getElementById("studentAge").disabled = true;
  document.getElementById("studentMajor").disabled = true;
  document.getElementById("createStudent").disabled = true;

  // Hide the "Create Student" form smoothly without shifting
  document.querySelector(".container").style.opacity = "0";
  setTimeout(() => {
    document.querySelector(".container").style.display = "none";
  }, 300);

  // Adding the event listener for real-time form validation
  document
    .getElementById("studentName")
    .addEventListener("input", checkFormValidation);
  document
    .getElementById("studentAge")
    .addEventListener("input", checkFormValidation);
  document
    .getElementById("studentMajor")
    .addEventListener("input", checkFormValidation);

  document.getElementById("createStudent").disabled = true;

  /*document.getElementById("studentName").value = "";
  document.getElementById("studentAge").value = "";
  document.getElementById("studentMajor").value = ""; */
};

// Function to enroll in a course
document.getElementById("enrollCourse").onclick = () => {
  const course = document.getElementById("courseName").value;
  if (course) {
    student.enroll(course);
    document.getElementById("courseName").value = ""; // Clear the input after enrolling
    updateCourseList(); // Update the course list
  }
};

// Function to add a grade
document.getElementById("addGrade").onclick = () => {
  const course = document.getElementById("courseSelect").value; // Get selected course from dropdown
  const grade = parseInt(document.getElementById("courseGrade").value); // get grade from input

  if (course && !isNaN(grade)) {
    student.addGrade(course, grade);
    document.getElementById("courseGrade").value = ""; // Clear the grade input
    updateCourseList(); // Update the course list to reflect the grade
  }

  // Update GPA display after adding the grade
  document.getElementById("gpaDisplay").innerText = student.getGPA();
};

// Function to convert numeric grade to letter grade
function getLetterGrade(grade) {
  if (grade >= 90) return "A";
  if (grade >= 80) return "B";
  if (grade >= 70) return "C";
  if (grade >= 60) return "D";
  return "F";
}

// Function to update the course list display
function updateCourseList() {
  const courseList = document.getElementById("courseList");
  const courseSelect = document.getElementById("courseSelect");

  courseList.innerHTML = "";
  courseSelect.innerHTML = "";

  // loop through each enrolled course
  for (const course in student.courses) {
    const listItem = document.createElement("li"); // create new list item
    const grade = student.courses[course];

    //display the grade with letter grade if it's not null, otherwise show "No grade yet"
    if (grade !== null) {
      listItem.textContent = `${course}: Grade: ${grade} (${getLetterGrade(
        grade
      )})`;
    } else {
      listItem.textContent = `${course}: No grade yet`;
    }

    /* listItem.textContent = `${course}: ${
      student.courses[course] !== null
        ? student.courses[course]
        : "No grade yet"
    }`; */
    courseList.appendChild(listItem); //add list item to the course list

    const option = document.createElement("option"); // create a new option for the dropdown
    option.value = course; // set the value to the course name
    option.textContent = course; // display course name
    courseSelect.appendChild(option); // add option to the dropdown
  }
}
