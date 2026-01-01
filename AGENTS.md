# Handoff Notes for Future Agents

This document contains context, architectural decisions, and guidelines for AI agents continuing the development of **Osamari**.

## 🚨 Core Instruction
**You MUST strictly adhere to the following rule:**
- **Language**: Always respond to the user in **Japanese** (日本語). Read and write code in English, but use Japanese for all communication, explanations, and commit messages unless explicitly instructed otherwise.

---

## 🏗 Project Architecture
- **Framework**: Next.js 15+ (App Router).
- **State Management**:
  - Uses strictly **Server Actions** (`src/app/actions.ts`) for data mutations.
  - Client components (`GroupDashboard`) manage local optimistic state for immediate feedback, but the source of truth is the server.
- **Database**: AWS DynamoDB.
  - **Single Table Design**: We use one table (`OsamariData` by default) for all entities (Groups, Members, Expenses).
  - **PK/SK Schema**:
    - Group Metadata: `PK=GROUP#{id}`, `SK=METADATA`
    - Members: `PK=GROUP#{id}`, `SK=MEMBER#{id}`
    - Expenses: `PK=GROUP#{id}`, `SK=EXPENSE#{id}`
- **Deployment**: Vercel (recommended).

## 🧠 Core Logic (`src/lib/logic.ts`)
- **Settlement Algorithm**: The core value prop is calculating the *minimum number of transactions* required to settle debts.
- **Variable Splits**: Expenses track `involvedMemberIds`. If not all members are involved, the cost is split only among the specific subset.
- **Precision**: Calculations are integer-based (Japanese Yen) generally, but beware of remainders. The current logic handles plain remainder distribution.

## 🎨 UI/UX Guidelines
- **Library**: `shadcn/ui` + Tailwind CSS.
- **Aesthetics**: Aim for a "Premium" and clean feel. Avoid generic Bootstrap-like looks. Use whitespace effectively.
- **Mobile-First**: This app is primarily used on mobile devices during travel/events. Ensure buttons are tappable and layouts work on small screens.
- **Web Share API**: We use `navigator.share` for sharing group links, with a clipboard fallback.

## 📝 Recent Context (as of Jan 2026)
- **Edit Functionality**: We recently implemented the ability to *edit* expenses (not just delete/add). `updateExpense` action acts as an upsert.
- **Safety**: Deletion of members or expenses requires a confirmation dialog (`window.confirm`).
- **Rebranding**: The project was renamed from `split-bill-app` to `Osamari`. Ensure no references to the old name persist in user-facing text.

## 🚀 Potential Next Steps
- **PWA Support**: Making the app installable.
- **Category Icons**: Adding visual categories to expenses.
- **Authentication**: Currently purely public URL-based. Future integration with LINE Login (Phase 3 in Roadmap) is considered.

Good luck!
