// Disney画像の拡大表示：ホバーではなくクリック/タップでトグル
document.addEventListener('DOMContentLoaded', function() {
    const disneyImages = document.querySelectorAll('.disney-image');
    let overlay = null;
    let activeImage = null;
    let activeText = null;

    function ensureOverlay() {
        if (!overlay) {
            overlay = document.createElement('div');
            overlay.className = 'disney-overlay';
            document.body.appendChild(overlay);
            // オーバーレイクリックで閉じる
            overlay.addEventListener('click', closeActive);
        }
        return overlay;
    }

    function open(image, text) {
    ensureOverlay().classList.add('show');
    document.body.style.overflow = 'hidden';
    image.classList.add('fullscreen');
    text.classList.add('show-text');
    positionTextBelowImage(image, text);
    activeImage = image;
    activeText = text;
        // ESCキーで閉じる
        document.addEventListener('keydown', onKeydown);

        // 画像のトランジション完了後に再配置（サイズ確定のため）
        const onTransitionEnd = (e) => {
            if (e.target === image) {
                positionTextBelowImage(image, text);
                image.removeEventListener('transitionend', onTransitionEnd);
            }
        };
        image.addEventListener('transitionend', onTransitionEnd);

        // レイアウト確定待ちで数回再配置（端末差吸収）
        requestAnimationFrame(() => {
            positionTextBelowImage(image, text);
            requestAnimationFrame(() => {
                positionTextBelowImage(image, text);
            });
        });
        setTimeout(() => positionTextBelowImage(image, text), 300);

        // 画像が未ロードのときはロード完了後にも再配置
        if (!image.complete || image.naturalWidth === 0) {
            const onLoad = () => {
                positionTextBelowImage(image, text);
                image.removeEventListener('load', onLoad);
            };
            image.addEventListener('load', onLoad, { once: true });
        }
    }

    function closeActive() {
        if (!activeImage) return;
        activeImage.classList.remove('fullscreen');
        if (activeText) activeText.classList.remove('show-text');
        if (overlay) overlay.classList.remove('show');
        document.body.style.overflow = '';
        activeImage = null;
        activeText = null;
        document.removeEventListener('keydown', onKeydown);
    window.removeEventListener('resize', onResizeOrScroll);
    window.removeEventListener('scroll', onResizeOrScroll, true);
    }

    function onKeydown(e) {
        if (e.key === 'Escape') {
            closeActive();
        }
    }

    disneyImages.forEach(function(image) {
        const disneyItem = image.closest('.disney-item');
        // 同一カード内の最初のテキストを取得
        const disneyText = disneyItem ? disneyItem.querySelector(':scope > .disney-text') || disneyItem.querySelector('.disney-text') : null;
        if (!disneyText) return;

        // クリックでトグル
        image.addEventListener('click', function(e) {
            e.stopPropagation();
            if (activeImage === image) {
                closeActive();
            } else {
                // 既に別の画像が開いていれば閉じる
                if (activeImage) closeActive();
                open(image, disneyText);
                window.addEventListener('resize', onResizeOrScroll);
                window.addEventListener('scroll', onResizeOrScroll, true);
            }
        });

        // タッチでも同様に動作（iOSなどでの挙動安定化）
        image.addEventListener('touchstart', function(e) {
            // クリックの重複発火を避けるため、軽く止める
            // ただしスクロールは阻害しない
        }, { passive: true });
    });

    function positionTextBelowImage(image, text) {
        const rect = image.getBoundingClientRect();
        const vh = window.innerHeight;
        const vw = window.innerWidth;
        const margin = 12;   // 画像内の下端からの余白
        const paddingX = 12; // テキスト左右の余白を考慮
        const safety = 8;    // 画面端の安全余白

        // テキストの最大幅を画像幅に収める
        const maxW = Math.max(100, Math.min(rect.width - paddingX * 2, vw - safety * 2));
        text.style.maxWidth = `${maxW}px`;

        // いったん中央に置いてサイズ取得
        const centerX = rect.left + rect.width / 2;
        text.style.left = `${centerX}px`;
        // transform: translate(-50%, -100%) を前提に、下端基準でtopを設定
        text.style.top = `${rect.bottom - margin}px`;

        const textRect = text.getBoundingClientRect();
        // 画面外（上）に出る場合のみ、最小位置まで下げる
        let baseTop = rect.bottom - margin;
        if (baseTop - textRect.height < safety) {
            baseTop = textRect.height + safety; // これで translate(-100%) 適用後も上端に収まる
        }
        text.style.top = `${baseTop}px`;
        text.style.left = `${centerX}px`;
    }

    function onResizeOrScroll() {
        if (activeImage && activeText) {
            positionTextBelowImage(activeImage, activeText);
        }
    }
});

// 定数定義
const MOBILE_BREAKPOINT = 768;
const ANIMATION_DURATION = 400;
const HEIGHT_PADDING = 20;

// ハンバーガーメニューの機能（アニメーション対応）
function toggleMobileMenu() {
    const nav = document.getElementById('nav');
    const menuToggle = document.querySelector('.menu-toggle');
    
    // 必要な要素の存在確認
    if (!nav || !menuToggle) {
        console.warn('Navigation elements not found');
        return;
    }
    
    const navUl = nav.querySelector('ul');
    if (!navUl) {
        console.warn('Navigation ul element not found');
        return;
    }
    
    if (nav.classList.contains('mobile-menu-open')) {
        // メニューを閉じる
        nav.classList.remove('mobile-menu-open');
        nav.classList.add('mobile-menu-closed');
        menuToggle.innerHTML = '☰'; // ハンバーガーアイコンに戻す
        menuToggle.setAttribute('aria-expanded', 'false');
        menuToggle.setAttribute('aria-label', 'メニューを開く');
        
        // max-heightを0に戻す
        navUl.style.setProperty('max-height', '0px', 'important');
        
        // アニメーション完了後にフォーカスをボタンに戻す
        setTimeout(() => {
            menuToggle.focus();
        }, ANIMATION_DURATION);
    } else {
        // メニューを開く
        nav.classList.remove('mobile-menu-closed');
        nav.classList.add('mobile-menu-open');
        menuToggle.innerHTML = '✕'; // 閉じるアイコンに変更
        menuToggle.setAttribute('aria-expanded', 'true');
        menuToggle.setAttribute('aria-label', 'メニューを閉じる');
        
        // 実際のコンテンツの高さを計算して設定
        const actualHeight = navUl.scrollHeight;
        
        // メニューを開く
        nav.classList.add('mobile-menu-open');
        // インラインスタイルで確実に高さを設定
        navUl.style.setProperty('max-height', (actualHeight + HEIGHT_PADDING) + 'px', 'important');
        
        // アニメーション完了後に最初のメニュー項目にフォーカス
        setTimeout(() => {
            const firstMenuItem = nav.querySelector('ul li:first-child a');
            if (firstMenuItem) {
                firstMenuItem.focus();
            }
        }, ANIMATION_DURATION);
    }
}

// ユーティリティ関数
function closeMenu(nav, navUl, menuToggle) {
    nav.classList.remove('mobile-menu-open');
    nav.classList.add('mobile-menu-closed');
    navUl.style.setProperty('max-height', '0px', 'important');
    menuToggle.innerHTML = '☰';
    menuToggle.setAttribute('aria-expanded', 'false');
    menuToggle.setAttribute('aria-label', 'メニューを開く');
}

// ページ読み込み時にモバイル環境のみメニューを閉じた状態にする
document.addEventListener('DOMContentLoaded', function() {
    const nav = document.getElementById('nav');
    const menuToggle = document.querySelector('.menu-toggle');
    
    // ハンバーガーメニューのイベントリスナーを追加
    if (menuToggle) {
        menuToggle.addEventListener('click', toggleMobileMenu);
    }
    
    if (nav) {
        const navUl = nav.querySelector('ul');
        
        // モバイル環境の場合のみクラスを追加
        if (window.innerWidth <= MOBILE_BREAKPOINT) {
            nav.classList.add('mobile-menu-closed');
            navUl.style.setProperty('max-height', '0px', 'important');
        }
    }
    
    // ウィンドウサイズ変更時の処理
    window.addEventListener('resize', function() {
        const navUl = nav.querySelector('ul');
        const menuToggle = document.querySelector('.menu-toggle');
        
        if (window.innerWidth > MOBILE_BREAKPOINT) {
            // PC版ではモバイルメニュー関連のクラスを削除
            nav.classList.remove('mobile-menu-open', 'mobile-menu-closed');
            navUl.style.removeProperty('max-height'); // PC版では高さ制限なし
            if (menuToggle) {
                menuToggle.innerHTML = '☰';
                menuToggle.setAttribute('aria-expanded', 'false');
            }
        } else {
            // モバイル版では閉じた状態にする
            nav.classList.remove('mobile-menu-open');
            nav.classList.add('mobile-menu-closed');
            navUl.style.setProperty('max-height', '0px', 'important');
            if (menuToggle) {
                menuToggle.innerHTML = '☰';
                menuToggle.setAttribute('aria-expanded', 'false');
                menuToggle.setAttribute('aria-label', 'メニューを開く');
            }
        }
    });
});

// 背景クリックでメニューを閉じる機能
document.addEventListener('DOMContentLoaded', function() {
    document.addEventListener('click', function(event) {
        const nav = document.getElementById('nav');
        const menuToggle = document.querySelector('.menu-toggle');
        
        // モバイルメニューが開いている場合のみ処理
        if (nav && nav.classList.contains('mobile-menu-open')) {
            // クリックされた要素がメニュー内部でもハンバーガーボタンでもない場合
            if (!nav.contains(event.target) && !menuToggle.contains(event.target)) {
                const navUl = nav.querySelector('ul');
                nav.classList.remove('mobile-menu-open');
                nav.classList.add('mobile-menu-closed');
                navUl.style.setProperty('max-height', '0px', 'important'); // 高さをリセット
                menuToggle.innerHTML = '☰';
                menuToggle.setAttribute('aria-expanded', 'false');
                menuToggle.setAttribute('aria-label', 'メニューを開く');
            }
        }
    });
});

// メニューリンクをクリックした時にメニューを閉じる（アニメーション対応）
document.addEventListener('DOMContentLoaded', function() {
    const navLinks = document.querySelectorAll('.nav ul li a');
    
    navLinks.forEach(function(link) {
        link.addEventListener('click', function() {
            const nav = document.getElementById('nav');
            const menuToggle = document.querySelector('.menu-toggle');
            
            if (nav && nav.classList.contains('mobile-menu-open')) {
                const navUl = nav.querySelector('ul');
                nav.classList.remove('mobile-menu-open');
                nav.classList.add('mobile-menu-closed');
                navUl.style.setProperty('max-height', '0px', 'important'); // 高さをリセット
                
                // ハンバーガーアイコンを元に戻す
                if (menuToggle) {
                    menuToggle.innerHTML = '☰';
                    menuToggle.setAttribute('aria-expanded', 'false');
                    menuToggle.setAttribute('aria-label', 'メニューを開く');
                }
            }
        });
    });
});

// ESCキーでメニューを閉じる機能
document.addEventListener('DOMContentLoaded', function() {
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape') {
            const nav = document.getElementById('nav');
            const menuToggle = document.querySelector('.menu-toggle');
            
            if (nav && nav.classList.contains('mobile-menu-open')) {
                const navUl = nav.querySelector('ul');
                nav.classList.remove('mobile-menu-open');
                nav.classList.add('mobile-menu-closed');
                navUl.style.setProperty('max-height', '0px', 'important'); // 高さをリセット
                menuToggle.innerHTML = '☰';
                menuToggle.setAttribute('aria-expanded', 'false');
                menuToggle.setAttribute('aria-label', 'メニューを開く');
                menuToggle.focus(); // フォーカスをボタンに戻す
            }
        }
    });
});

// モバイル用タッチ対応 - 音楽・ゲームアイテムのタッチ効果
document.addEventListener('DOMContentLoaded', function() {
    const musicItems = document.querySelectorAll('.music-item');
    
    musicItems.forEach(function(item) {
        let touchTimer = null;
        
        // タッチ開始
        item.addEventListener('touchstart', function(e) {
            // 短時間のタッチで説明文を表示
            touchTimer = setTimeout(function() {
                item.classList.add('tapped');
                
                // 2秒後に自動で非表示
                setTimeout(function() {
                    item.classList.remove('tapped');
                }, 2000);
            }, 200);
        }, { passive: true });
        
        // タッチ終了
        item.addEventListener('touchend', function(e) {
            if (touchTimer) {
                clearTimeout(touchTimer);
            }
        }, { passive: true });
        
        // タッチキャンセル
        item.addEventListener('touchcancel', function(e) {
            if (touchTimer) {
                clearTimeout(touchTimer);
            }
            item.classList.remove('tapped');
        }, { passive: true });
        
        // クリックでも対応（デスクトップでのテスト用）
        item.addEventListener('click', function(e) {
            // リンクのクリックの場合は何もしない
            if (e.target.tagName === 'A' || e.target.closest('a')) {
                return;
            }
            
            item.classList.add('tapped');
            setTimeout(function() {
                item.classList.remove('tapped');
            }, 2000);
        });
    });
});

// 画像スライダー機能
document.addEventListener('DOMContentLoaded', function() {
    const slider = document.querySelector('.slider');
    const slides = document.querySelectorAll('.slide');
    const dots = document.querySelectorAll('.dot');
    const prevBtn = document.querySelector('.slider-btn-prev');
    const nextBtn = document.querySelector('.slider-btn-next');
    
    if (!slider || slides.length === 0) return;
    
    let currentSlide = 0;
    const totalSlides = slides.length;
    
    // スライドを表示する関数
    function showSlide(index) {
        // 現在のアクティブクラスを削除
        slides.forEach(slide => slide.classList.remove('active'));
        dots.forEach(dot => dot.classList.remove('active'));
        
        // 新しいスライドをアクティブに
        slides[index].classList.add('active');
        dots[index].classList.add('active');
        
        currentSlide = index;
    }
    
    // 次のスライドに移動
    function nextSlide() {
        const next = (currentSlide + 1) % totalSlides;
        showSlide(next);
    }
    
    // 前のスライドに移動
    function prevSlide() {
        const prev = (currentSlide - 1 + totalSlides) % totalSlides;
        showSlide(prev);
    }
    
    // イベントリスナーの追加
    if (nextBtn) {
        nextBtn.addEventListener('click', nextSlide);
    }
    
    if (prevBtn) {
        prevBtn.addEventListener('click', prevSlide);
    }
    
    // ドットクリックイベント
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => showSlide(index));
    });
    
    // 自動スライドショー（5秒間隔）
    let autoSlideInterval = setInterval(nextSlide, 5000);
    
    // ホバー時に自動スライドを停止
    slider.addEventListener('mouseenter', () => {
        clearInterval(autoSlideInterval);
    });
    
    // ホバー終了時に自動スライドを再開
    slider.addEventListener('mouseleave', () => {
        autoSlideInterval = setInterval(nextSlide, 5000);
    });
    
    // 各スライドに個別のホバー効果を追加
    slides.forEach((slide, index) => {
        slide.addEventListener('mouseenter', () => {
            // ホバーされたスライドを一時的に表示
            if (!slide.classList.contains('active')) {
                slide.style.opacity = '0.8';
                slide.style.zIndex = '5';
            }
        });
        
        slide.addEventListener('mouseleave', () => {
            // アクティブでないスライドは元に戻す
            if (!slide.classList.contains('active')) {
                slide.style.opacity = '0';
                slide.style.zIndex = '1';
            }
        });
        
        // スライドをクリックしたときにそのスライドをアクティブにする
        slide.addEventListener('click', () => {
            showSlide(index);
        });
    });
    
    // キーボードナビゲーション
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') {
            prevSlide();
        } else if (e.key === 'ArrowRight') {
            nextSlide();
        }
    });
    
    // タッチイベント（スワイプ）対応
    let touchStartX = 0;
    let touchEndX = 0;
    
    slider.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });
    
    slider.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    }, { passive: true });
    
    function handleSwipe() {
        const swipeThreshold = 50;
        const diff = touchStartX - touchEndX;
        
        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                nextSlide(); // 左スワイプで次へ
            } else {
                prevSlide(); // 右スワイプで前へ
            }
        }
    }
});
