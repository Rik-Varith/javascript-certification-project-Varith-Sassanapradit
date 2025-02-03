// Necessary Imports (you will need to use this)
const { Student } = require('./Student')
const fs = require('fs').promises; 

/**
 * Node Class (GIVEN, you will need to use this)
 */
class Node {
  // Public Fields
  data               // Student
  next               // Object
  /**
   * REQUIRES:  The fields specified above
   * EFFECTS:   Creates a new Node instance
   * RETURNS:   None
   */
  constructor(data, next = null) {
    this.data = data;
    this.next = next
  }
}

/**
 * Create LinkedList Class (for student management)
 * The class should have the public fields:
 * - head, tail, length
 */
class LinkedList {
  // Public Fields
  head              // Object
  tail              // Object
  length            // Number representing size of LinkedList

  /**
   * REQUIRES:  None
   * EFFECTS:   Creates a new LinkedList instance (empty)
   * RETURNS:   None
   */
  constructor() {
    this.head = null;
    this.tail = null;
    this.length = 0;
    
  }

  /**
   * REQUIRES:  A new student (Student)
   * EFFECTS:   Adds a Student to the end of the LinkedList
   * RETURNS:   None
   * CONSIDERATIONS:
   * - Think about the null case
   * - Think about adding to the 'end' of the LinkedList (Hint: tail)
   */
  addStudent(newStudent) {
    const studentObject = new Node(newStudent);
    
    if (this.head === null) {
      this.head = studentObject;
      this.tail = studentObject;
      this.length++;
    }

    else{
      this.tail.next = studentObject;
      this.tail = studentObject;
      this.length++;
    }
     
  }

  /**
   * REQUIRES:  email(String)
   * EFFECTS:   Removes a student by email (assume unique)
   * RETURNS:   None
   * CONSIDERATIONS:
   * - Think about the null case
   * - Think about how removal might update head or tail
   */
  removeStudent(email) {
    if(this.head === null){
      return;
    }
    // if the name is the head
    if (this.head.data.getEmail() === email){
      this.head = this.head.next;
      this.length--;
      return;
      }
      
    
    let currentNode = this.head;
      while (currentNode.next !== null) {
        if (currentNode.next.data.getEmail() === email){
          currentNode.next = currentNode.next.next;
          this.length--;
          return;
        }
      currentNode = currentNode.next;
      }
  }
  /**
   * REQUIRES:  email (String)
   * EFFECTS:   None
   * RETURNS:   The Student or -1 if not found
   */
  findStudent(email) {
    if (this.head === null){
      return -1;
    }
    let currentNode = this.head;
    while (currentNode !== null){
      if (currentNode.data.getEmail() === email){
        return currentNode.data;
      }
      currentNode = currentNode.next;
    }
    return -1
  }

  /**
   * REQUIRES:  None
   * EFFECTS:   Clears all students from the Linked List
   * RETURNS:   None
   */
  clearStudents() {
    this.head = null;
    this.tail = null;
    this.length = 0;
  
  }

  /**
   * REQUIRES:  None
   * EFFECTS:   None
   * RETURNS:   LinkedList as a String for console.log in caller
   * CONSIDERATIONS:
   *  - Let's assume you have a LinkedList with two people
   *  - Output should appear as: "JohnDoe, JaneDoe"
   */
  displayStudents() {
    if (this.head === null){
    return "";
    }

    let currentNode = this.head;
    let result = ""
    
    while (currentNode !== null){
      result += currentNode.data.getName();

      if (currentNode.next !==null){
        result +=", "; 
      }
      currentNode = currentNode.next
    }
    return result;
  }

  /**
   * REQUIRES:  None
   * EFFECTS:   None
   * RETURNS:   A sorted array of students by name
   */
  sortStudentsByName() {
    if (this.head === null) {
      return [];
  }

    let studentAlphabet = [];
    let currentStudent = this.head;
    while (currentStudent !== null){
      studentAlphabet.push(currentStudent.data);
      currentStudent = currentStudent.next
    }
      
    studentAlphabet.sort((a, b) =>{
     return a.getName().localeCompare(b.getName());
    
    });

    return studentAlphabet;
  }

  /**
   * REQUIRES:  specialization (String)
   * EFFECTS:   None
   * RETURNS:   An array of students matching the specialization, sorted alphabetically by student name
   * CONSIDERATIONS:
   * - Use sortStudentsByName()
   */
  filterBySpecialization(specialization) {
    if (this.head === null) {
      return [];
    }

    let studentSpecialization = [];

    let currentStudent = this.head;
    while (currentStudent !== null){
      if (currentStudent.data.getSpecialization() === specialization){
          studentSpecialization.push(currentStudent.data);
      }
      currentStudent = currentStudent.next;
    }
      
    studentSpecialization.sort((a, b) => {
        return a.getName().localeCompare(b.getName());
      });

      return studentSpecialization;
  
    }
  

  /**
   * REQUIRES:  minAge (Number)
   * EFFECTS:   None
   * RETURNS:   An array of students who are at least minAge, sorted alphabetically by student name
   * CONSIDERATIONS:
   * - Use sortStudentsByName()
   */
  filterByMinYear(minYear) {
    if (this.head === null) {
        return [];
    }

    let studentYear = [];
    let currentStudent = this.head;
    
    while (currentStudent !== null) {
        if (currentStudent.data.getYear() >= minYear) {  
            studentYear.push(currentStudent.data);
        }
        currentStudent = currentStudent.next;
    }
    
    studentYear.sort((a, b) => a.getName().localeCompare(b.getName()));
    
    return studentYear;
  }
  /**
   * REQUIRES:  A valid file name (String)
   * EFFECTS:   Writes the LinkedList to a JSON file with the specified file name
   * RETURNS:   None
   */
  async saveToJson(fileName) {
    
    let studentData = [];
    let currentStudent = this.head;

    while (currentStudent !== null){
      studentData.push({
        name: currentStudent.data.getName(),
        Year: currentStudent.data.getYear(),
        email: currentStudent.data.getEmail(),
        specialization: currentStudent.data.getSpecialization(),
      });
      currentStudent = currentStudent.next;
    }
  

  try {
    await fs.writeFile(fileName, JSON.stringify(studentData, null, 2));
    }
  catch (error) {
      console.log ('Error saving to file:', error);
    }
  }

  /**
   * REQUIRES:  A valid file name (String) that exists
   * EFFECTS:   Loads data from the specified fileName, overwrites existing LinkedList
   * RETURNS:   None
   * CONSIDERATIONS:
   *  - Use clearStudents() to perform overwriting
   */
  async loadFromJSON (fileName) {
    try {
      const fileData = await fs.readFile (fileName, 'utf8');
      const studentData = JSON.parse(fileData);
      this.clearStudents();

      for (const student of studentData){
        const newStudent = new Student(
          student.name,
          student.year,
          student.email,
          student.specialization);
      
      this.addStudent(newStudent);
      }

    }
    catch (error) {
      console.error ('Error loading file:', error);
    }
  }
}


module.exports = { LinkedList }
