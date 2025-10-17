# WandeCoin (WANDE)

A SIP-010 compliant fungible token built on the Stacks blockchain.

## Overview

WandeCoin is a fungible token smart contract that implements the SIP-010 standard, making it compatible with the Stacks ecosystem and wallet applications. The token has a total supply of 1 billion tokens with 6 decimal places.

## Token Details

- **Name**: WandeCoin
- **Symbol**: WANDE
- **Decimals**: 6
- **Total Supply**: 1,000,000,000.000000 WANDE
- **Standard**: SIP-010 Fungible Token

## Features

### SIP-010 Standard Functions
- `transfer`: Transfer tokens between accounts
- `get-name`: Get token name
- `get-symbol`: Get token symbol
- `get-decimals`: Get number of decimal places
- `get-balance`: Get balance of an account
- `get-total-supply`: Get total token supply
- `get-token-uri`: Get token metadata URI

### Additional Utility Functions
- `mint`: Mint new tokens (owner only)
- `burn`: Burn tokens from sender's account
- `set-token-uri`: Set token metadata URI (owner only)
- `get-contract-owner`: Get contract owner address
- `transfer-ownership`: Transfer contract ownership (owner only)

## Prerequisites

- [Clarinet](https://github.com/hirosystems/clarinet) - Stacks smart contract development toolkit
- [Node.js](https://nodejs.org/) - For running tests

## Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/wandecoin.git
cd wandecoin
```

2. Install dependencies:
```bash
npm install
```

## Development

### Check Contract Syntax
```bash
clarinet check
```

### Run Tests
```bash
npm test
```

### Start Local Development Environment
```bash
clarinet integrate
```

### Deploy to Testnet
```bash
clarinet deploy --testnet
```

## Contract Structure

### Constants
- `CONTRACT-OWNER`: The deployer of the contract
- `TOTAL-SUPPLY`: Maximum token supply (1 billion with 6 decimals)
- Error codes for various failure conditions

### Data Variables
- `token-name`: Token display name
- `token-symbol`: Token ticker symbol
- `token-decimals`: Number of decimal places
- `token-uri`: Optional metadata URI

### Functions

#### Public Functions
- `transfer(amount, sender, recipient, memo)`: Transfer tokens
- `mint(amount, recipient)`: Mint tokens to recipient (owner only)
- `burn(amount)`: Burn tokens from sender
- `set-token-uri(new-uri)`: Update token metadata URI (owner only)
- `transfer-ownership(new-owner)`: Transfer contract ownership (owner only)

#### Read-Only Functions
- `get-name()`: Returns token name
- `get-symbol()`: Returns token symbol
- `get-decimals()`: Returns decimal places
- `get-balance(who)`: Returns balance of address
- `get-total-supply()`: Returns total supply
- `get-token-uri()`: Returns metadata URI
- `get-contract-owner()`: Returns contract owner

## Error Codes

- `u100`: ERR-OWNER-ONLY - Function restricted to contract owner
- `u101`: ERR-NOT-TOKEN-OWNER - Sender not authorized to transfer tokens
- `u102`: ERR-INSUFFICIENT-BALANCE - Insufficient balance for operation
- `u103`: ERR-INVALID-RECIPIENT - Invalid recipient address

## Usage Examples

### Transfer Tokens
```clarity
(contract-call? .wandecoin transfer u1000000 tx-sender 'SP1HTBVD3JG9C05J7HBJTHGR0GGW7KX17ECGWWDC8 none)
```

### Check Balance
```clarity
(contract-call? .wandecoin get-balance 'SP1HTBVD3JG9C05J7HBJTHGR0GGW7KX17ECGWWDC8)
```

### Burn Tokens
```clarity
(contract-call? .wandecoin burn u500000)
```

## Testing

The project includes comprehensive TypeScript tests using the Clarinet testing framework. Tests cover:

- Token metadata functions
- Transfer functionality
- Balance checking
- Minting and burning
- Owner-only functions
- Error conditions

Run tests with:
```bash
npm test
```

## Security Considerations

1. **Owner Privileges**: The contract owner can mint new tokens and set metadata URI
2. **Transfer Validation**: Transfers validate sender authorization and recipient validity
3. **Balance Checks**: Burn operations verify sufficient balance before execution
4. **Immutable Total Supply**: Total supply is set at deployment and can only increase through minting

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Ensure all tests pass
6. Submit a pull request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Resources

- [Stacks Documentation](https://docs.stacks.co/)
- [Clarinet Documentation](https://docs.hiro.so/clarinet/)
- [SIP-010 Specification](https://github.com/stacksgov/sips/blob/main/sips/sip-010/sip-010-fungible-token-standard.md)
- [Clarity Language Reference](https://docs.stacks.co/clarity/)
 
