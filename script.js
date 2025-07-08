// script.js
document.addEventListener('DOMContentLoaded', function() {
    // アコーディオンの制御
    const accordionHeaders = document.querySelectorAll('.accordion-header');
    
    accordionHeaders.forEach(header => {
        header.addEventListener('click', () => {
            const content = header.nextElementSibling;
            const icon = header.querySelector('.icon');
            
            // 他のアコーディオンを閉じる
            accordionHeaders.forEach(otherHeader => {
                if (otherHeader !== header) {
                    const otherContent = otherHeader.nextElementSibling;
                    const otherIcon = otherHeader.querySelector('.icon');
                    otherContent.classList.remove('active');
                    if (otherIcon) otherIcon.textContent = '+';
                }
            });
            
            content.classList.toggle('active');
            if (icon) {
                icon.textContent = content.classList.contains('active') ? '-' : '+';
            }
        });
    });

    // noteのRSSフィードを取得して表示
    const noteFeedElement = document.getElementById('noteFeed');
    const noteUsername = 'yusukesakai_tech';
    const corsProxy = 'https://api.allorigins.win/raw?url=';
    const noteRssUrl = `https://note.com/${noteUsername}/rss`;

    // IT関連の記事のキーワード
    const itKeywords = ['IT', 'コンサル', 'システム', 'プログラミング', 'エンジニア', 'テクノロジー'];

    async function fetchNoteFeed() {
        try {
            const response = await fetch(corsProxy + encodeURIComponent(noteRssUrl));
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.text();
            const parser = new DOMParser();
            const xml = parser.parseFromString(data, 'application/xml');
            const items = xml.querySelectorAll('item');
        
            // ローディング表示を削除
            noteFeedElement.innerHTML = '';
        
            // 最新の3件を表示
            Array.from(items).slice(0, 3).forEach(item => {
                const title = item.querySelector('title').textContent;
                const link = item.querySelector('link').textContent;
                const pubDate = new Date(item.querySelector('pubDate').textContent);
            
                const articleElement = createArticleElement(title, link, pubDate);
                noteFeedElement.appendChild(articleElement);
            });

            // 記事が1つも取得できなかった場合
            if (items.length === 0) {
                noteFeedElement.innerHTML = `
                    <div class="no-articles">
                        <p>記事が見つかりませんでした。</p>
                        <a href="https://note.com/${noteUsername}" target="_blank">noteで全ての記事を見る</a>
                    </div>
            `    ;
            }

        } catch (error) {
            console.error('Failed to fetch note feed:', error);
            noteFeedElement.innerHTML = `
                <div class="error-message">
                    <p>記事の読み込みに失敗しました。</p>
                    <a href="https://note.com/${noteUsername}" target="_blank">noteで直接確認する</a>
                </div>
            `;
        }
    }

    function createArticleElement(title, link, pubDate) {
        const article = document.createElement('div');
        article.className = 'blog-item';
        
        const dateStr = pubDate.toLocaleDateString('ja-JP', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
        });
        
        article.innerHTML = `
            <div class="blog-date">${dateStr}</div>
            <h3>${title}</h3>
            <a href="${link}" target="_blank" class="blog-link">
                続きを読む <i class="fas fa-arrow-right"></i>
            </a>
        `;
        
        return article;
    }

    // ページ読み込み時にフィードを取得
    fetchNoteFeed();

    // スクロールアニメーション
    const sections = document.querySelectorAll('.section');
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    sections.forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(20px)';
        section.style.transition = 'all 0.6s ease-out';
        sectionObserver.observe(section);
    });
});