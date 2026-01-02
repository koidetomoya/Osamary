export default function AboutPage() {
    return (
        <div className="container mx-auto max-w-3xl py-12 px-4">
            <h1 className="text-3xl font-bold mb-8">運営者情報・お問い合わせ</h1>

            <section className="mb-8">
                <h2 className="text-xl font-bold mb-4">運営者</h2>
                <p>Osamari 開発チーム</p>
            </section>

            <section className="mb-8">
                <h2 className="text-xl font-bold mb-4">お問い合わせ</h2>
                <p>不具合の報告やご要望は、以下のGitHubリポジトリのIssueまでお願いいたします。</p>
                <a
                    href="https://github.com/koidetomoya/Osamari/issues"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                >
                    GitHub Issues
                </a>
            </section>

            <section className="mb-8">
                <h2 className="text-xl font-bold mb-4">特定商取引法に基づく表記</h2>
                <p className="text-slate-600">
                    本サービスは現在ベータ版として無償で提供されています。
                    有料プラン等の販売は行っておりません。
                </p>
            </section>
        </div>
    );
}
