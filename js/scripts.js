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

// ハンバーガーメニューの機能
function toggleMobileMenu() {
    const nav = document.getElementById('nav');
    
    if (nav.classList.contains('mobile-menu-open')) {
        nav.classList.remove('mobile-menu-open');
        nav.classList.add('mobile-menu-closed');
    } else {
        nav.classList.remove('mobile-menu-closed');
        nav.classList.add('mobile-menu-open');
    }
}

// ページ読み込み時にメニューを閉じた状態にする
document.addEventListener('DOMContentLoaded', function() {
    const nav = document.getElementById('nav');
    if (nav) {
        nav.classList.add('mobile-menu-closed');
    }
});

// メニューリンクをクリックした時にメニューを閉じる
document.addEventListener('DOMContentLoaded', function() {
    const navLinks = document.querySelectorAll('.nav ul li a');
    
    navLinks.forEach(function(link) {
        link.addEventListener('click', function() {
            const nav = document.getElementById('nav');
            if (nav && nav.classList.contains('mobile-menu-open')) {
                nav.classList.remove('mobile-menu-open');
                nav.classList.add('mobile-menu-closed');
            }
        });
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
