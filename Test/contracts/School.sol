// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "./Certificate.sol";
import "./Token.sol";

contract School is Ownable {
    //important
    //owner of all contract should be same otherwise certifications wont work

    uint16 public tax = 3; //default tax
    status public statusDefault = status.NOT_ENROLLED; //default student status
    uint256 minimumCoursePrice = 0; //minimum course fee
    uint256 baseTerm = 10; //schools share
    // uint256 sharingTerm = 0; //schools share set by the teacher should be >= baseTerm
    Certificate public certificateContract; //pointer to nft contract
    tokenQTKN public qtknContract; //pointer to nft contract

    struct Course {
        uint256 courseId;
        string name;
        address assignedTeacher;
        uint256 basePrice; //teacher's price
        uint256 shareTerm; //percentage of school's share 
        uint256 coursePrice; //course price after adding school's share and tax
        mapping (address => status) students;
    }

    mapping (address => bool) isTeacher;
    mapping (uint256 => Course) courses_by_id;
    Course[] courses; //stores all the courses

    modifier onlyTeacher() {
        require (isTeacher[msg.sender] == true, "not authorized to create course");
        _;
    }

    enum status {NOT_ENROLLED, ENROLLED, COMPLETED}

    event newCourse (string indexed name, uint indexed index);

    constructor(tokenQTKN _qtknContract ) {
        certificateContract = new Certificate();
        qtknContract = _qtknContract;
    }

    //functions for owner

    //add a new teacher
    function addTeacher(address _teacher) public onlyOwner {
        isTeacher[_teacher] = true;
    }

    function setTax(uint16 _tax) public onlyOwner {
        tax = _tax;
    }

    function setBaseTerm(uint256 _baseTerm) public onlyOwner {
        baseTerm = _baseTerm;
    }

    function setMinimumCoursePrice(uint256 _minimumCoursePrice) public onlyOwner {
        minimumCoursePrice = _minimumCoursePrice;
    }

    //functions for teacher

    //create course
    function createCourse(string memory _courseName, address _teacher, uint256 _price, uint8 _shareTerm) public onlyTeacher {
        require(_price >= minimumCoursePrice, "price is lower than the minimum course price");
        require(_shareTerm >= baseTerm, "share term is lower than the base term");
        require(msg.sender != address(0), "user not viable");
        Course storage c = courses.push();
        c.courseId = courses.length-1;
        c.name = _courseName;
        c.assignedTeacher = _teacher;
        c.basePrice = _price*10**18;
        c.shareTerm = _shareTerm;
        c.coursePrice = calculatePrice(c);
        emit newCourse(_courseName, courses.length-1);
    }

    function createCourse(string memory _courseName, address _teacher, uint256 _price) public onlyTeacher {
        require(_price >= minimumCoursePrice, "price is lower than the minimum course price");
        require(msg.sender != address(0), "user not viable");
        Course storage c = courses.push();
        c.name = _courseName;
        c.assignedTeacher = _teacher;
        c.basePrice = _price*10**18;
        c.shareTerm = baseTerm;
        c.coursePrice = calculatePrice(c);
        emit newCourse(_courseName, courses.length-1);
    }

    //once a student completes the course the teacher van graduate him
    //once the stutus is complete an nft is transfered to him
    function graduate(uint _courseIndex, address _student) public onlyTeacher {
        require(courses[_courseIndex].students[_student] == status.ENROLLED, "student not enrolled");
        courses[_courseIndex].students[_student] = status.COMPLETED;
        certificateContract.mint(_student);
    }

    //private functions

    function calculatePrice(Course storage _course) internal view returns (uint) {
        return (_course.basePrice + calculateSharePrice(_course) + calculateTaxPrice(_course));
    }

    //calculate share price
    function calculateSharePrice(Course storage _course) private view returns (uint) {
        return (_course.basePrice * _course.shareTerm / 100);
    }

    //calculate tax price
    function calculateTaxPrice(Course storage _course) private view returns (uint) {
        return _course.basePrice * tax / 100;
    }

    //when a student pays fee this function divides the fee between entities
    function divideFee(Course storage _course) private {
        qtknContract.transfer(owner(),  calculateSharePrice(_course)) ;
        qtknContract.transfer(owner(),  calculateTaxPrice(_course)) ;
        qtknContract.transfer(_course.assignedTeacher,  _course.coursePrice) ;
    }

    //functions for students

    function enroll(uint _courseId) public {
        require(msg.sender != address(0), "user not viable");
        Course storage c = courses[_courseId];
        require(qtknContract.allowance(msg.sender, address(this)) >= c.coursePrice , "Check the token allowance");
        require(qtknContract.balanceOf(msg.sender) >= c.coursePrice);
        c.students[msg.sender] = status.ENROLLED;
        qtknContract.transferFrom(msg.sender, address(this), c.coursePrice);
        divideFee(c);
    }

    function viewPrice(uint _courseId) public view returns(uint) {
        return courses[_courseId].coursePrice;
    }
}