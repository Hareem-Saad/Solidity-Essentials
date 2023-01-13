// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.17;

// Uncomment this line to use console.log
// import "hardhat/console.sol";

contract BookTicket {
    address public contractOwner;
    uint counter = 0;
    uint public basicPrice = 0.0001 ether;
    uint public silverPrice = 0.0002 ether;
    uint public goldPrice = 0.0003 ether;
    bool flag = true;

    struct Ticket {
        uint id;
        address owner;
        Level level;
    }

    mapping (uint => Ticket) public tickets;

    enum Level {
        BASIC,
        SILVER,
        GOLD
    }

    event ticketBought(uint indexed id, address indexed buyer, Level level);

    modifier onlyOwner() {
        require(msg.sender == contractOwner, "not the owner");
        _;
    }

    modifier nonReentrant() {
        flag = true;
        require(flag, "haha");
        _;
        flag = false;
    }

    constructor() {
        contractOwner = msg.sender;
    }


    function buyBasicTicket(uint8 _amount) public payable nonReentrant() {
        require(msg.value == basicPrice * _amount, "wrong amount");
        require(_amount > 0, "cannot buy 0 tickets");
        uint _counter = counter;
        for (uint i = 0; i < _amount; i++) {
            Ticket memory t = Ticket(_counter + i, msg.sender, Level.BASIC);
            tickets[t.id] = t;
            emit ticketBought (t.id, t.owner, t.level);
        }
        counter = _counter + 1;
        
    }

    function buySilverTicket(uint8 _amount) public payable nonReentrant() {
        require(msg.value == silverPrice * _amount, "wrong amount");
        require(_amount > 0, "cannot buy 0 tickets");
        uint _counter = counter;
        for (uint i = 0; i < _amount; i++) {
            Ticket memory t = Ticket(_counter + i, msg.sender, Level.SILVER);
            tickets[t.id] = t;
            emit ticketBought (t.id, t.owner, t.level);
        }
        counter = _counter + 1;
    }

    function buyGoldTicket(uint8 _amount) public payable nonReentrant() {
        require(msg.value == goldPrice * _amount, "wrong amount");
        require(_amount > 0, "cannot buy 0 tickets");
        uint _counter = counter;
        for (uint i = 0; i < _amount; i++) {
            Ticket memory t = Ticket(_counter + i, msg.sender, Level.GOLD);
            tickets[t.id] = t;
            emit ticketBought (t.id, t.owner, t.level);
        }
        counter = _counter + 1;
    }

    function changeBasicPrice(uint _price) public onlyOwner() {
        require((_price < goldPrice) && (_price < silverPrice), "new price should be < sp & gp");
        basicPrice = _price;
    }

    function changeSilverPrice(uint _price) public onlyOwner() {
        require((_price < goldPrice) && (_price > basicPrice), "new price should be > bp & < gp");
        silverPrice = _price;
    }

    function changeGoldPrice(uint _price) public onlyOwner() {
        require((_price > silverPrice) && (_price > basicPrice), "new price should be > bp & sp");
        goldPrice = _price;
    }

    function transferTickets(uint _id, address _to) public {
        Ticket storage ticket = tickets[_id];
        require(ticket.owner == msg.sender, "you are not the owner of the ticket");
        ticket.owner = _to;
    }

    function withdraw() public onlyOwner() {
        (bool sent,) = contractOwner.call{value: address(this).balance}("");
        require(sent, "Failed to send Ether");
    }

    function updateOwner(address _owner) public onlyOwner() {
        contractOwner = _owner;
    }

    event logMsgData (bytes, uint);

    fallback() external payable {
        console.log("here");
        emit logMsgData(msg.data, msg.value);
    }

    event logAmount (uint);

    receive() payable external {
        emit logAmount(msg.value);
    }
}
