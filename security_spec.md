# Security Specification - PrimeWealth

## Data Invariants
1. A transaction MUST have a valid `userId` matching the authenticated user.
2. A transaction `amount` MUST be a number.
3. Standard categories are seeded but can be supplemented.
4. Budgets are monthly (`YYYY-MM`) and category-specific.

## The "Dirty Dozen" Payloads (Attacks)
1. **Identity Spoofing**: Create transaction with `userId: "attacker_id"`.
2. **Path Poisoning**: Inject 1.5KB string as transaction ID.
3. **Shadow Update**: Add `isVerified: true` to a transaction update.
4. **Email Spoofing**: Unverified email trying to access admin data (if any).
5. **PII Leak**: Non-owner trying to `get` another user's transaction.
6. **State Shortcutting**: Skipping status transitions (not applicable here yet).
7. **Resource Exhaustion**: 1MB description string.
8. **Negative Budget**: Setting a negative budget amount.
9. **Invalid Month**: Setting budget month to `2025-99`.
10. **Type Poisoning**: Sending `amount: "1000"` (string instead of number).
11. **Orphaned Writes**: Creating a budget for a category that doesn't exist (relational sync).
12. **Blanket Read**: Querying `/transactions` without a `where` clause.

## Test Runner Logic
The `firestore.rules` must block all the above.

## Conflict Report
| Collection | Identity Spoofing | Resource Poisoning | PII Blanket |
|------------|-------------------|--------------------|-------------|
| transactions | BLOCKED (userId check) | BLOCKED (size/type) | BLOCKED (get/list ownership) |
| categories | BLOCKED (userId check) | BLOCKED (size/type) | BLOCKED (get/list ownership) |
| budgets | BLOCKED (userId check) | BLOCKED (regex/type) | BLOCKED (get/list ownership) |
