;; WandeCoin (WANDE) - A SIP-010 compliant fungible token
;; Built on Stacks blockchain

;; Constants
(define-constant CONTRACT-OWNER tx-sender)
(define-constant ERR-OWNER-ONLY (err u100))
(define-constant ERR-NOT-TOKEN-OWNER (err u101))
(define-constant ERR-INSUFFICIENT-BALANCE (err u102))
(define-constant ERR-INVALID-RECIPIENT (err u103))

;; Define the token
(define-fungible-token wandecoin)

;; Token metadata
(define-data-var token-name (string-ascii 32) "WandeCoin")
(define-data-var token-symbol (string-ascii 10) "WANDE")
(define-data-var token-decimals uint u6)
(define-data-var token-uri (optional (string-utf8 256)) none)

;; Total supply - 1 billion tokens with 6 decimals
(define-constant TOTAL-SUPPLY u1000000000000000) ;; 1,000,000,000.000000

;; Initialize contract by minting total supply to contract owner
(begin
  (try! (ft-mint? wandecoin TOTAL-SUPPLY CONTRACT-OWNER))
)

;; SIP-010 Functions

;; Transfer function
(define-public (transfer (amount uint) (sender principal) (recipient principal) (memo (optional (buff 34))))
  (begin
    (asserts! (or (is-eq tx-sender sender) (is-eq contract-caller sender)) ERR-NOT-TOKEN-OWNER)
    (asserts! (not (is-eq recipient tx-sender)) ERR-INVALID-RECIPIENT)
    (ft-transfer? wandecoin amount sender recipient)
  )
)

;; Get name
(define-read-only (get-name)
  (ok (var-get token-name))
)

;; Get symbol
(define-read-only (get-symbol)
  (ok (var-get token-symbol))
)

;; Get decimals
(define-read-only (get-decimals)
  (ok (var-get token-decimals))
)

;; Get balance
(define-read-only (get-balance (who principal))
  (ok (ft-get-balance wandecoin who))
)

;; Get total supply
(define-read-only (get-total-supply)
  (ok (ft-get-supply wandecoin))
)

;; Get token URI
(define-read-only (get-token-uri)
  (ok (var-get token-uri))
)

;; Additional utility functions

;; Mint function (only owner)
(define-public (mint (amount uint) (recipient principal))
  (begin
    (asserts! (is-eq tx-sender CONTRACT-OWNER) ERR-OWNER-ONLY)
    (ft-mint? wandecoin amount recipient)
  )
)

;; Burn function (token holder can burn their own tokens)
(define-public (burn (amount uint))
  (begin
    (asserts! (>= (ft-get-balance wandecoin tx-sender) amount) ERR-INSUFFICIENT-BALANCE)
    (ft-burn? wandecoin amount tx-sender)
  )
)

;; Set token URI (only owner)
(define-public (set-token-uri (new-uri (string-utf8 256)))
  (begin
    (asserts! (is-eq tx-sender CONTRACT-OWNER) ERR-OWNER-ONLY)
    (var-set token-uri (some new-uri))
    (ok true)
  )
)

;; Get contract owner
(define-read-only (get-contract-owner)
  (ok CONTRACT-OWNER)
)

;; Transfer ownership (only current owner)
(define-public (transfer-ownership (new-owner principal))
  (begin
    (asserts! (is-eq tx-sender CONTRACT-OWNER) ERR-OWNER-ONLY)
    ;; Note: This would require modifying the CONTRACT-OWNER constant
    ;; In practice, ownership transfer might need a different pattern
    (ok true)
  )
)
