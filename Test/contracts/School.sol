// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;

// import "@openzeppelin/contracts/access/Ownable.sol";
// import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "./Certificate.sol";
import "./Token.sol";

/**
 * @title School
 * @author Hareem-Saad
 * @notice owner of all contracts should be same otherwise certifications wont work
 * @notice owner of all token contracts is this contract
 * School can add teachers
 * School has set the minimum course price --that no teacher can set a course price below it
 * School has set the minimum baseTerm -- i.e the minimum percentage of school's share
 * When course is created an nft is minted to the teacher
 * When student graduates an nft is minted to the student
 */

contract School is Ownable, ERC20{

    uint256 public price = 0.01 ether;
    // uint256 public price = 0.01 ether;
    uint16 public tax = 3; //default tax
    status public statusDefault = status.NOT_ENROLLED; //default student status
    uint256 minimumCoursePrice = 10; //minimum course fee
    uint256 baseTerm = 10; //schools share
    Certificate public certificateContract; //pointer to nft contract
    CourseNFT public cnft; //course nft

    struct Course {
        uint256 courseId;
        string name;
        address assignedTeacher;
        uint256 basePrice; //teacher's price
        uint256 shareTerm; //percentage of school's share 
        uint256 coursePrice; //course price after adding school's share and tax
        mapping (address => status) students;
    }

    mapping (address => bool) public isTeacher;
    Course[] public courses; //stores all the courses the index is the course id

    modifier onlyTeacher() {
        require (isTeacher[msg.sender] == true, "not authorized to create course");
        _;
    }

    enum status {NOT_ENROLLED, ENROLLED, COMPLETED}

    event newCourse (string indexed name, uint indexed index);

    constructor() ERC20("QTKN", "QTKN") {
        certificateContract = new Certificate();
        cnft = new CourseNFT();
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

    /**
     * createCourse
     * @param _courseName -- the course name 
     * @param _teacher -- the assigned teacher this can be themselves or any other approved teacher
     * @param _price -- the price for course the teacher sets must be above minimum price
     * @param _shareTerm -- the percentage the teacher wants to give to the school must not be lesser than base term
     * 
     * course price is calculated by basePrice (teacher's fee) + tax% + share%
     */
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
        cnft.mint(_teacher);
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
        transfer(owner(),  calculateSharePrice(_course) + calculateTaxPrice(_course));
        transfer(_course.assignedTeacher,  _course.basePrice);
    }

    //functions for students

    //course price is calculated by basePrice (teacher's fee) + tax% + share%
    function enroll(uint _courseId) public {
        require(msg.sender != address(0), "user not viable");
        require(_courseId < courses.length , "course id does not exist");
        Course storage c = courses[_courseId];
        // require(allowance(msg.sender, address(this)) >= c.coursePrice , "Check the token allowance");
        require(balanceOf(msg.sender) >= c.coursePrice, "not enough tokens");
        c.students[msg.sender] = status.ENROLLED;
        // console.log(1);
        // transfer(address(this), c.coursePrice);
        divideFee(c);
    }

    function viewPrice(uint _courseId) public view returns(uint) {
        return courses[_courseId].coursePrice;
    }

    function mint(uint256 _amount) public payable {
        require(msg.value == (_amount*price));
        _mint(msg.sender, _amount*10**18);
    }
}

