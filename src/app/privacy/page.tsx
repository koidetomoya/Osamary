import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function PrivacyPage() {
    return (
        <div className="container mx-auto max-w-3xl py-12 px-4">
            <Link href="/" className="inline-flex items-center text-sm text-slate-500 hover:text-slate-900 mb-8 transition-colors">
                <ArrowLeft className="mr-2 h-4 w-4" />
                トップページに戻る
            </Link>
            <h1 className="text-3xl font-bold mb-8">プライバシーポリシー</h1>
            <div className="prose prose-slate max-w-none">
                <p>Osamary（以下，「当アプリ」といいます。）は，本ウェブサイト上で提供するサービス（以下，「本サービス」といいます。）における，ユーザーの個人情報の取扱いについて，以下のとおりプライバシーポリシー（以下，「本ポリシー」といいます。）を定めます。</p>

                <h2>第1条（個人情報）</h2>
                <p>「個人情報」とは，個人情報保護法にいう「個人情報」を指すものとし，生存する個人に関する情報であって，当該情報に含まれる氏名，生年月日，住所，電話番号，連絡先その他の記述等により特定の個人を識別できる情報及び容貌，指紋，声紋にかかるデータ，及び健康保険証の保険者番号などの当該情報単体から特定の個人を識別できる情報（個人識別情報）を指します。</p>

                <h2>第2条（収集する情報）</h2>
                <p>当アプリは，ユーザーがLINEログインを利用する際に，LINEプラットフォームから提供される以下の情報を取得します。</p>
                <ul>
                    <li>ユーザーID（LINE内部識別子）</li>
                    <li>表示名（Display Name）</li>
                    <li>プロフィール画像URL</li>
                </ul>
                <p>これらの情報は，ユーザーのアカウント識別およびアプリ内での表示にのみ利用されます。</p>

                <h2>第3条（プライバシーポリシーの変更）</h2>
                <p>本ポリシーの内容は，法令その他本ポリシーに別段の定めのある事項を除いて，ユーザーに通知することなく，変更することができるものとします。</p>


            </div>
        </div>
    );
}
