// Disney画像のホバー効果（5秒継続）
document.addEventListener('DOMContentLoaded', function() {
    const disneyImages = document.querySelectorAll('.disney-image');
    let activeTimeout = null;
    let cooldownTimeout = null;
    let isInCooldown = false;
    let isEffectActive = false;
    let overlay = null;
    
    // オーバーレイ要素を作成
    function createOverlay() {
        if (!overlay) {
            overlay = document.createElement('div');
            overlay.className = 'disney-overlay';
            document.body.appendChild(overlay);
        }
        return overlay;
    }
    
    disneyImages.forEach(function(image) {
        const disneyItem = image.closest('.disney-item');
        const disneyText = disneyItem.querySelector('.disney-text');
        
        image.addEventListener('mouseenter', function() {
            // クールダウン中または効果実行中は効果を発動しない
            if (isInCooldown || isEffectActive) {
                return;
            }
            
            // 既存のタイムアウトをクリア
            if (activeTimeout) {
                clearTimeout(activeTimeout);
            }
            
            // 効果が実行中であることを示すフラグを設定
            isEffectActive = true;
            
            // オーバーレイを作成・表示
            const currentOverlay = createOverlay();
            currentOverlay.classList.add('show');
            
            // 全画面表示を開始
            image.classList.add('fullscreen');
            disneyText.classList.add('show-text');
            
            // 1.5秒後に効果を終了
            activeTimeout = setTimeout(function() {
                image.classList.remove('fullscreen');
                disneyText.classList.remove('show-text');
                currentOverlay.classList.remove('show');
                activeTimeout = null;
                isEffectActive = false;
                
                // クールダウン期間を開始（1秒間）
                isInCooldown = true;
                cooldownTimeout = setTimeout(function() {
                    isInCooldown = false;
                    cooldownTimeout = null;
                }, 1000);
            }, 1500);
        });
        
        // マウスが離れても1.5秒間は継続（途中で終了させない）
        image.addEventListener('mouseleave', function() {
            // マウスが離れてもタイムアウトは継続
        });
        
        // モバイル用のタッチイベント
        image.addEventListener('touchstart', function(e) {
            // タッチ開始時も同様の処理
            if (isInCooldown || isEffectActive) {
                return;
            }
            
            // 既存のタイムアウトをクリア
            if (activeTimeout) {
                clearTimeout(activeTimeout);
                activeTimeout = null;
            }
            
            // 効果を開始
            isEffectActive = true;
            image.classList.add('fullscreen');
            disneyText.classList.add('show-text');
            
            const currentOverlay = createOverlay();
            currentOverlay.classList.add('show');
            
            // 1.5秒後に効果を終了
            activeTimeout = setTimeout(function() {
                image.classList.remove('fullscreen');
                disneyText.classList.remove('show-text');
                currentOverlay.classList.remove('show');
                activeTimeout = null;
                isEffectActive = false;
                
                // クールダウン期間を開始（1秒間）
                isInCooldown = true;
                cooldownTimeout = setTimeout(function() {
                    isInCooldown = false;
                    cooldownTimeout = null;
                }, 1000);
            }, 1500);
        }, { passive: true });
    });
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
