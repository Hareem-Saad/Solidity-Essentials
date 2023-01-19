// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.7.0 < 0.9.0;

// import '@openzeppelin/contracts/token/ERC721/ERC721.sol';
import '@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol';
import '@openzeppelin/contracts/utils/Strings.sol';
// import '@openzeppelin/contracts/token/common/ERC2981.sol';
import '@openzeppelin/contracts/access/Ownable.sol';

contract NFT is Ownable, ERC721URIStorage{
    uint256 public tokenCounter = 0;
    string private uri = 'https://gateway.pinata.cloud/ipfs/QmUwGLS68RfgDLxdVGKUyFs3ypX88jkxSJaX2U2TXPa2BD/1.json';
    constructor() ERC721("Q-Course", "QCRS") {

    }

    function mint(address _to) public onlyOwner {
        tokenCounter += 1;
        _mint(_to, tokenCounter);
        _setTokenURI(tokenCounter, uri);
    }
}
