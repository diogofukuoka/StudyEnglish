# Security Specification — NGSL 1.2 English Mastery

## 1. Data Invariants
1. Every document lives under `/users/{userId}` and carries an immutable `ownerId` equal to `request.auth.uid`.
2. PII (`email`, `displayName`) is isolated in `/users/{userId}/private/profile`, readable and writable only by the verified owner (`request.auth.token.email_verified == true`).
3. Subcollections (`/settings`, `/private`, `/groupProgress`, `/fullSentences`, `/threeWordStories`, `/sundayScores`, `/sundayAiQuizzes`) enforce the Master Gate (`exists(/databases/$(database)/documents/users/$(userId))`) on single-document writes and verify `resource.data.ownerId == request.auth.uid` on `list` queries without expensive lookups.
4. All string fields enforce explicit `.size()` boundaries matching `firebase-blueprint.json`; all IDs match `^[a-zA-Z0-9_\-]+$` up to 128 characters.
5. All `createdAt` and `updatedAt` timestamps must equal `request.time`, and `createdAt` is immutable on updates.
6. Every update action restricts mutated keys via `incoming().diff(existing()).affectedKeys().hasOnly(...)` and runs full entity validation (`isValid[Entity](incoming())`).

## 2. Dirty Dozen Adversarial Payloads (Must Return PERMISSION_DENIED)
1. **Cross-user read/write**: User B attempts to read or write `/users/userA/settings/preferences`.
2. **Unverified email write**: User with `email_verified: false` attempts to create `/users/{uid}/groupProgress/1`.
3. **Owner spoofing**: Authenticated User A sets `ownerId: "userB"` inside `/users/userA/fullSentences/fs1`.
4. **Shadow field injection**: User A includes `"isAdmin": true` or `"ghostField": 1` on `groupProgress` create or update.
5. **Orphaned subcollection write**: User A writes `/users/userA/groupProgress/1` before `/users/userA` exists.
6. **Oversized ID poisoning**: User A writes `/users/userA/fullSentences/<200-char-invalid-id!@#>` with disallowed characters.
7. **Denial-of-Wallet oversized string**: User A sets `sentence` to a 5,000-character string (> 1500 limit) in `fullSentences`.
8. **Unbounded array payload**: User A sends 250 tokens (> 100 limit) inside `fullSentences.tokens`.
9. **Client timestamp forgery**: User A sets `createdAt` to a past timestamp instead of `request.time`.
10. **Immutable field mutation**: User A attempts to change `createdAt`, `ownerId`, or `groupNumber` during an `update` on `groupProgress`.
11. **Invalid enum value**: User A writes `level: "expert"` instead of `"simples" | "intermediario" | "avancado"`.
12. **Out-of-range integer**: User A writes `groupNumber: 999` (outside 1..352) or `bestScorePct: 150` (outside 0..100).
