# Osamari - 最小回数で割り勘精算

**「面倒な割り勘計算を、一瞬で。」**
Osamari（オサマリ）は、旅行やイベントなどでの複雑な立て替え払いを記録し、最終的に誰が誰にいくら払えばいいか（精算プラン）を**最小の送金回数**になるよう自動計算するWebアプリケーションです。

## ✨ 特徴

- **ログイン不要**: URLをシェアするだけですぐに使えます。
- **リアルタイム精算**: 支払いを追加・編集・削除すると、即座に精算プランが更新されます。
- **スマートな計算機能**: 複数人の貸し借りを相殺し、最も効率的な送金ルート（最小回数）を提案します。
- **かんたん共有**: LINEやその他のSNSへ1タップで共有（Web Share API対応）。
- **編集機能**: 「金額間違えた！」という時も、履歴から簡単に修正可能。

## 🛠️ 技術スタック

- **Framework**: [Next.js 15+](https://nextjs.org/) (App Router, Server Actions)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Database**: [AWS DynamoDB](https://aws.amazon.com/dynamodb/) (Single Table Design)
- **UI Components**: [shadcn/ui](https://ui.shadcn.com/) (Radix UI)
- **Icons**: [Lucide React](https://lucide.dev/)

## 🚀 ローカル環境での実行

### 1. リポジトリのクローン
```bash
git clone https://github.com/your-username/osamari.git
cd osamari
```

### 2. 依存関係のインストール
```bash
npm install
```

### 3. 環境変数の設定
ルートディレクトリに `.env.local` を作成し、AWS接続情報を設定します。
（DynamoDBのテーブルへのアクセス権限が必要です）

```env
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
AWS_REGION=ap-northeast-1
DYNAMODB_TABLE_NAME=OsamariData
```

### 4. 開発サーバーの起動
```bash
npm run dev
```
`http://localhost:3000` でアプリが起動します。

## 📦 デプロイ

Vercelへのデプロイを推奨しています。
より詳細なデプロイ手順は [deployment.md](./deployment.md) を参照してください。

1. Vercelにプロジェクトをインポート
2. 環境変数（Environment Variables）にAWS認証情報を設定
3. Deploy!

## 📄 DynamoDB テーブル設計

Single Table Designを採用しています。

- **PK (Partition Key)**: string
- **SK (Sort Key)**: string

| Entity | PK | SK | Content |
|---|---|---|---|
| **Group Metadata** | `GROUP#{groupId}` | `METADATA` | Group Name, CreatedAt |
| **Member** | `GROUP#{groupId}` | `MEMBER#{memberId}` | Name |
| **Expense** | `GROUP#{groupId}` | `EXPENSE#{expenseId}` | Amount, Payer, Note, Date... |

---
Created by Antigravity
