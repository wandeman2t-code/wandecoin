import { describe, expect, it } from "vitest";

const accounts = simnet.getAccounts();
const deployer = accounts.get("deployer")!;
const wallet1 = accounts.get("wallet_1")!;
const wallet2 = accounts.get("wallet_2")!;

const contractName = "wandecoin";

describe("WandeCoin Contract Tests", () => {
  it("initializes contract correctly", () => {
    expect(simnet.blockHeight).toBeDefined();
  });

  describe("Token Metadata", () => {
    it("returns correct token name", () => {
      const { result } = simnet.callReadOnlyFn(contractName, "get-name", [], deployer);
      expect(result).toBeOk(simnet.types.ascii("WandeCoin"));
    });

    it("returns correct token symbol", () => {
      const { result } = simnet.callReadOnlyFn(contractName, "get-symbol", [], deployer);
      expect(result).toBeOk(simnet.types.ascii("WANDE"));
    });

    it("returns correct decimals", () => {
      const { result } = simnet.callReadOnlyFn(contractName, "get-decimals", [], deployer);
      expect(result).toBeOk(simnet.types.uint(6));
    });

    it("returns correct total supply", () => {
      const { result } = simnet.callReadOnlyFn(contractName, "get-total-supply", [], deployer);
      expect(result).toBeOk(simnet.types.uint(1000000000000000));
    });

    it("returns contract owner", () => {
      const { result } = simnet.callReadOnlyFn(contractName, "get-contract-owner", [], deployer);
      expect(result).toBeOk(simnet.types.principal(deployer));
    });
  });

  describe("Balance and Supply", () => {
    it("deployer has initial total supply", () => {
      const { result } = simnet.callReadOnlyFn(contractName, "get-balance", [simnet.types.principal(deployer)], deployer);
      expect(result).toBeOk(simnet.types.uint(1000000000000000));
    });

    it("other wallets have zero balance initially", () => {
      const { result } = simnet.callReadOnlyFn(contractName, "get-balance", [simnet.types.principal(wallet1)], deployer);
      expect(result).toBeOk(simnet.types.uint(0));
    });
  });

  describe("Transfer Functionality", () => {
    it("allows deployer to transfer tokens", () => {
      const transferAmount = 1000000; // 1 WANDE
      const { result } = simnet.callPublicFn(
        contractName,
        "transfer",
        [
          simnet.types.uint(transferAmount),
          simnet.types.principal(deployer),
          simnet.types.principal(wallet1),
          simnet.types.none()
        ],
        deployer
      );
      expect(result).toBeOk(simnet.types.bool(true));

      // Check balances after transfer
      const wallet1Balance = simnet.callReadOnlyFn(contractName, "get-balance", [simnet.types.principal(wallet1)], deployer);
      expect(wallet1Balance.result).toBeOk(simnet.types.uint(transferAmount));
    });

    it("prevents unauthorized transfers", () => {
      const transferAmount = 1000000;
      const { result } = simnet.callPublicFn(
        contractName,
        "transfer",
        [
          simnet.types.uint(transferAmount),
          simnet.types.principal(deployer),
          simnet.types.principal(wallet2),
          simnet.types.none()
        ],
        wallet1 // wallet1 trying to transfer deployer's tokens
      );
      expect(result).toBeErr(simnet.types.uint(101)); // ERR-NOT-TOKEN-OWNER
    });
  });

  describe("Minting Functionality", () => {
    it("allows owner to mint tokens", () => {
      const mintAmount = 500000;
      const { result } = simnet.callPublicFn(
        contractName,
        "mint",
        [
          simnet.types.uint(mintAmount),
          simnet.types.principal(wallet2)
        ],
        deployer
      );
      expect(result).toBeOk(simnet.types.bool(true));

      // Check wallet2 balance
      const wallet2Balance = simnet.callReadOnlyFn(contractName, "get-balance", [simnet.types.principal(wallet2)], deployer);
      expect(wallet2Balance.result).toBeOk(simnet.types.uint(mintAmount));
    });

    it("prevents non-owner from minting", () => {
      const mintAmount = 500000;
      const { result } = simnet.callPublicFn(
        contractName,
        "mint",
        [
          simnet.types.uint(mintAmount),
          simnet.types.principal(wallet1)
        ],
        wallet1 // non-owner trying to mint
      );
      expect(result).toBeErr(simnet.types.uint(100)); // ERR-OWNER-ONLY
    });
  });

  describe("Burning Functionality", () => {
    it("allows token holder to burn their tokens", () => {
      // First, give wallet1 some tokens
      simnet.callPublicFn(
        contractName,
        "transfer",
        [
          simnet.types.uint(2000000),
          simnet.types.principal(deployer),
          simnet.types.principal(wallet1),
          simnet.types.none()
        ],
        deployer
      );

      const burnAmount = 500000;
      const { result } = simnet.callPublicFn(
        contractName,
        "burn",
        [simnet.types.uint(burnAmount)],
        wallet1
      );
      expect(result).toBeOk(simnet.types.bool(true));

      // Check wallet1 balance after burn
      const wallet1Balance = simnet.callReadOnlyFn(contractName, "get-balance", [simnet.types.principal(wallet1)], deployer);
      expect(wallet1Balance.result).toBeOk(simnet.types.uint(1500000)); // 2000000 - 500000
    });

    it("prevents burning more than balance", () => {
      const burnAmount = 10000000000; // Much more than wallet2 has
      const { result } = simnet.callPublicFn(
        contractName,
        "burn",
        [simnet.types.uint(burnAmount)],
        wallet2
      );
      expect(result).toBeErr(simnet.types.uint(102)); // ERR-INSUFFICIENT-BALANCE
    });
  });

  describe("Token URI Management", () => {
    it("allows owner to set token URI", () => {
      const newUri = "https://example.com/wandecoin-metadata.json";
      const { result } = simnet.callPublicFn(
        contractName,
        "set-token-uri",
        [simnet.types.utf8(newUri)],
        deployer
      );
      expect(result).toBeOk(simnet.types.bool(true));

      // Check if URI was set
      const uriResult = simnet.callReadOnlyFn(contractName, "get-token-uri", [], deployer);
      expect(uriResult.result).toBeOk(simnet.types.some(simnet.types.utf8(newUri)));
    });

    it("prevents non-owner from setting token URI", () => {
      const newUri = "https://malicious.com/fake-metadata.json";
      const { result } = simnet.callPublicFn(
        contractName,
        "set-token-uri",
        [simnet.types.utf8(newUri)],
        wallet1 // non-owner
      );
      expect(result).toBeErr(simnet.types.uint(100)); // ERR-OWNER-ONLY
    });
  });

  describe("Ownership Management", () => {
    it("allows owner to call transfer-ownership", () => {
      const { result } = simnet.callPublicFn(
        contractName,
        "transfer-ownership",
        [simnet.types.principal(wallet1)],
        deployer
      );
      expect(result).toBeOk(simnet.types.bool(true));
    });

    it("prevents non-owner from transferring ownership", () => {
      const { result } = simnet.callPublicFn(
        contractName,
        "transfer-ownership",
        [simnet.types.principal(wallet2)],
        wallet1 // non-owner
      );
      expect(result).toBeErr(simnet.types.uint(100)); // ERR-OWNER-ONLY
    });
  });
});
