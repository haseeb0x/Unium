// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

/**
 * @title FreelanceInvoice
 * @notice Manages freelance invoices payable in ETH.
 *         Freelancers create invoices; clients pay them directly on-chain.
 */
contract FreelanceInvoice {
    struct Invoice {
        uint256 id;
        address payable freelancer;
        address client;
        uint256 amountWei;
        string  description;
        string  projectTitle;
        bool    paid;
        uint256 createdAt;
        uint256 paidAt;
    }

    mapping(uint256 => Invoice) public invoices;
    uint256 public nextInvoiceId;

    event InvoiceCreated(uint256 indexed id, address indexed freelancer, address indexed client, uint256 amountWei, string description);
    event InvoicePaid(uint256 indexed id, address indexed paidBy, uint256 amountWei, uint256 timestamp);

    function createInvoice(
        address payable _freelancer,
        string memory _description,
        string memory _projectTitle,
        uint256 _amountWei
    ) external returns (uint256) {
        uint256 id = nextInvoiceId++;
        invoices[id] = Invoice(id, _freelancer, msg.sender, _amountWei, _description, _projectTitle, false, block.timestamp, 0);
        emit InvoiceCreated(id, _freelancer, msg.sender, _amountWei, _description);
        return id;
    }

    function payInvoice(uint256 _id) external payable {
        Invoice storage inv = invoices[_id];
        require(!inv.paid, "Already paid");
        require(msg.value == inv.amountWei, "Wrong amount");
        inv.paid = true;
        inv.paidAt = block.timestamp;
        inv.freelancer.transfer(msg.value);
        emit InvoicePaid(_id, msg.sender, msg.value, block.timestamp);
    }

    function getInvoice(uint256 _id) external view returns (Invoice memory) {
        return invoices[_id];
    }
}
