/* =========================================
   VSCRIPT — Version Pro
   JavaScript Logic
   ========================================= */

(function () {
    'use strict';

    // =====================
    //  INTRO LOADER
    // =====================
    const introLoader = document.getElementById('introLoader');
    const introProgress = document.getElementById('introProgress');
    const INTRO_DURATION = 2800; // ms

    function runIntro() {
        if (!introLoader) {
            document.body.classList.remove('is-loading');
            document.body.classList.add('intro-done');
            triggerHeroReveal();
            return;
        }

        // Animate progress bar
        let progress = 0;
        const interval = 30;
        const step = (100 / INTRO_DURATION) * interval;
        const timer = setInterval(() => {
            progress += step;
            if (progress >= 100) {
                progress = 100;
                clearInterval(timer);
            }
            if (introProgress) introProgress.style.width = progress + '%';
        }, interval);

        // Hide loader
        setTimeout(() => {
            introLoader.classList.add('is-done');
            document.body.classList.remove('is-loading');
            document.body.classList.add('intro-done');
            triggerHeroReveal();

            // Remove from DOM after transition
            setTimeout(() => {
                if (introLoader.parentNode) introLoader.parentNode.removeChild(introLoader);
            }, 900);
        }, INTRO_DURATION);
    }

    function triggerHeroReveal() {
        const heroReveals = document.querySelectorAll('.hero .reveal');
        heroReveals.forEach((el, i) => {
            setTimeout(() => el.classList.add('is-visible'), i * 100);
        });

        // Start counters once revealed
        setTimeout(animateCounters, 800);
    }

    // Run intro as soon as DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', runIntro);
    } else {
        runIntro();
    }


    // =====================
    //  MAIN BOOT
    // =====================
    document.addEventListener('DOMContentLoaded', () => {

        // =====================
        //  NAVBAR
        // =====================
        const navbar = document.getElementById('navbar');
        const navToggle = document.getElementById('navToggle');

        window.addEventListener('scroll', () => {
            if (navbar) navbar.classList.toggle('scrolled', window.scrollY > 50);
        });

        if (navToggle) {
            navToggle.addEventListener('click', () => {
                navbar.classList.toggle('mobile-open');
            });
        }

        document.querySelectorAll('.navbar-links a').forEach(link => {
            link.addEventListener('click', () => {
                if (navbar) navbar.classList.remove('mobile-open');
            });
        });


        // =====================
        //  HERO PARTICLES
        // =====================
        const particlesContainer = document.getElementById('particles');
        if (particlesContainer) {
            for (let i = 0; i < 30; i++) {
                const particle = document.createElement('div');
                particle.classList.add('particle');
                particle.style.left = Math.random() * 100 + '%';
                particle.style.animationDuration = (5 + Math.random() * 10) + 's';
                particle.style.animationDelay = Math.random() * 10 + 's';
                const size = (2 + Math.random() * 3);
                particle.style.width = size + 'px';
                particle.style.height = size + 'px';
                particlesContainer.appendChild(particle);
            }
        }


        // =====================
        //  ACTIVE NAV LINK ON SCROLL
        // =====================
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.nav-link');

        const sectionObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    navLinks.forEach(link => {
                        link.classList.toggle('active', link.dataset.section === entry.target.id);
                    });
                }
            });
        }, { threshold: 0.3, rootMargin: '-80px 0px 0px 0px' });

        sections.forEach(section => sectionObserver.observe(section));


        // =====================
        //  REVEAL ON SCROLL (cards, process steps)
        // =====================
        const revealObserver = new IntersectionObserver((entries) => {
            entries.forEach((entry, i) => {
                if (entry.isIntersecting) {
                    const delay = parseInt(entry.target.dataset.delay) || 0;
                    setTimeout(() => {
                        entry.target.classList.add('is-visible');
                    }, delay);
                    revealObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.15 });

        // Realisations cards
        document.querySelectorAll('.realisation-card').forEach((card, i) => {
            card.dataset.delay = i * 120;
            revealObserver.observe(card);
        });

        // Process steps
        document.querySelectorAll('.process-step').forEach((step, i) => {
            step.dataset.delay = i * 100;
            revealObserver.observe(step);
        });


        // =====================
        //  FAQ ACCORDION
        // =====================
        document.querySelectorAll('.faq-item').forEach(item => {
            const btn = item.querySelector('.faq-question');
            const answer = item.querySelector('.faq-answer');
            if (!btn || !answer) return;

            btn.addEventListener('click', () => {
                const isOpen = item.classList.contains('is-open');

                // Close others
                document.querySelectorAll('.faq-item.is-open').forEach(other => {
                    if (other !== item) {
                        other.classList.remove('is-open');
                        const otherAnswer = other.querySelector('.faq-answer');
                        const otherBtn = other.querySelector('.faq-question');
                        if (otherAnswer) otherAnswer.style.maxHeight = '0';
                        if (otherBtn) otherBtn.setAttribute('aria-expanded', 'false');
                    }
                });

                if (isOpen) {
                    item.classList.remove('is-open');
                    answer.style.maxHeight = '0';
                    btn.setAttribute('aria-expanded', 'false');
                } else {
                    item.classList.add('is-open');
                    answer.style.maxHeight = answer.scrollHeight + 'px';
                    btn.setAttribute('aria-expanded', 'true');
                }
            });
        });


        // =====================
        //  BACK TO TOP
        // =====================
        const backToTop = document.getElementById('backToTop');
        if (backToTop) {
            window.addEventListener('scroll', () => {
                backToTop.classList.toggle('is-visible', window.scrollY > 500);
            });
            backToTop.addEventListener('click', () => {
                window.scrollTo({ top: 0, behavior: 'smooth' });
            });
        }


        // =====================
        //  DEVIS CHECKLIST LOGIC
        // =====================
        const BASE_PRICE = 45;

        const checkboxes = document.querySelectorAll('.devis-checkbox input[type="checkbox"]');
        const discordExtra = document.getElementById('discordLinkExtra');
        const sidebarItems = document.getElementById('sidebarItems');
        const sidebarPrice = document.getElementById('sidebarPrice');
        const downloadBtn = document.getElementById('downloadDevis');
        const videoSelect = document.getElementById('videoCountSelect');
        const videoExtra = document.getElementById('videoCountExtra');
        const videoCb = document.getElementById('optVideo');
        const discordInput = document.getElementById('discordLinkInput');

        let previousTotal = BASE_PRICE;

        function updateDevis() {
            let total = BASE_PRICE;
            const selectedItems = [];

            // YouTube Video option (variable price)
            if (videoCb && videoCb.checked) {
                const videoTier = videoSelect ? videoSelect.value : '1-3';
                let videoPrice = 5;
                let videoLabel = '1-3 vidéos';
                if (videoTier === '8+') { videoPrice = 20; videoLabel = '8+ vidéos'; }
                else if (videoTier === '4-7') { videoPrice = 15; videoLabel = '4-7 vidéos'; }

                const line = videoCb.closest('.devis-line');
                line?.classList.add('checked');
                total += videoPrice;

                const priceDisplay = line?.querySelector('.devis-line-price');
                if (priceDisplay) priceDisplay.textContent = videoPrice + '€';

                selectedItems.push({
                    name: `Vidéos YouTube (${videoLabel})`,
                    price: videoPrice
                });

                if (videoExtra) videoExtra.style.display = 'block';
                const parentLine = videoExtra?.previousElementSibling;
                if (parentLine) {
                    parentLine.style.borderRadius = 'var(--radius-md) var(--radius-md) 0 0';
                }
            } else if (videoCb) {
                const line = videoCb.closest('.devis-line');
                line?.classList.remove('checked');
                if (videoExtra) videoExtra.style.display = 'none';
                const priceDisplay = line?.querySelector('.devis-line-price');
                if (priceDisplay) priceDisplay.textContent = '5€';
                const parentLine = videoExtra?.previousElementSibling;
                if (parentLine) {
                    parentLine.style.borderRadius = 'var(--radius-md)';
                }
            }

            // Other options
            checkboxes.forEach(cb => {
                if (cb.id === 'optVideo') return;
                const line = cb.closest('.devis-line') || cb.closest('.devis-line-group')?.querySelector('.devis-line');
                const price = parseInt(cb.dataset.price) || 0;
                if (cb.checked) {
                    line?.classList.add('checked');
                    total += price;
                    selectedItems.push({ name: cb.dataset.label, price });
                } else {
                    line?.classList.remove('checked');
                }
            });

            // Discord link input toggle
            const discordCb = document.getElementById('optDiscord');
            if (discordExtra) {
                discordExtra.style.display = discordCb && discordCb.checked ? 'block' : 'none';
                const parentLine = discordExtra.previousElementSibling;
                if (parentLine) {
                    parentLine.style.borderRadius = discordCb && discordCb.checked
                        ? 'var(--radius-md) var(--radius-md) 0 0'
                        : 'var(--radius-md)';
                }
            }

            // Update sidebar
            let html = `
                <div class="sidebar-item">
                    <span class="sidebar-item-name"><i class="fas fa-lock"></i> Création de site</span>
                    <span class="sidebar-item-price">${BASE_PRICE}€</span>
                </div>
            `;
            selectedItems.forEach(item => {
                html += `
                    <div class="sidebar-item">
                        <span class="sidebar-item-name"><i class="fas fa-check"></i> ${item.name}</span>
                        <span class="sidebar-item-price">${item.price}€</span>
                    </div>
                `;
            });
            if (sidebarItems) sidebarItems.innerHTML = html;

            // Update total with pulse
            if (sidebarPrice) {
                sidebarPrice.textContent = total + '€';
                if (total !== previousTotal) {
                    sidebarPrice.classList.remove('pulse');
                    void sidebarPrice.offsetWidth; // reflow
                    sidebarPrice.classList.add('pulse');
                    previousTotal = total;
                }
            }
        }

        // Bind line clicks
        checkboxes.forEach(cb => {
            const line = cb.closest('.devis-line') || cb.closest('.devis-line-group')?.querySelector('.devis-line');
            if (line) {
                line.addEventListener('click', (e) => {
                    if (e.target.closest('.devis-line-extra') ||
                        e.target.tagName === 'SELECT' ||
                        (e.target.tagName === 'INPUT' && e.target.type !== 'checkbox')) return;
                    cb.checked = !cb.checked;
                    updateDevis();
                });
            }
        });

        if (videoSelect) {
            videoSelect.addEventListener('change', updateDevis);
            videoSelect.addEventListener('click', (e) => e.stopPropagation());
        }

        if (discordInput) {
            discordInput.addEventListener('click', (e) => e.stopPropagation());
        }

        updateDevis();


        // =====================
        //  PDF GENERATION + WEBHOOK
        // =====================
        if (downloadBtn) {
            downloadBtn.addEventListener('click', () => {
                const { jsPDF } = window.jspdf;
                const doc = new jsPDF();

                const pageWidth = doc.internal.pageSize.getWidth();
                const pageHeight = doc.internal.pageSize.getHeight();
                const margin = 20;
                const contentW = pageWidth - margin * 2;
                let y = 0;

                // Background
                doc.setFillColor(18, 18, 22);
                doc.rect(0, 0, pageWidth, pageHeight, 'F');

                // Header band
                doc.setFillColor(12, 12, 14);
                doc.rect(0, 0, pageWidth, 50, 'F');

                // Green accent line
                doc.setFillColor(46, 204, 113);
                doc.rect(0, 50, pageWidth, 1.5, 'F');

                // Brand
                doc.setTextColor(255, 255, 255);
                doc.setFont('helvetica', 'bold');
                doc.setFontSize(24);
                doc.text('VSCRIPT', margin, 30);

                doc.setFontSize(10);
                doc.setFont('helvetica', 'normal');
                doc.setTextColor(160, 160, 170);
                doc.text('Devis - Creation de site web', margin, 42);

                const today = new Date();
                const dateStr = today.toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' });
                doc.setFontSize(9);
                doc.text(dateStr, pageWidth - margin, 42, { align: 'right' });

                y = 65;

                // Table header
                doc.setFillColor(30, 30, 38);
                doc.roundedRect(margin, y, contentW, 14, 2, 2, 'F');
                doc.setTextColor(200, 200, 210);
                doc.setFont('helvetica', 'bold');
                doc.setFontSize(10);
                doc.text('PRESTATION', margin + 10, y + 9);
                doc.text('PRIX', pageWidth - margin - 10, y + 9, { align: 'right' });
                y += 22;

                let rowIndex = 0;
                function drawRow(label, price, isBold, icon) {
                    if (rowIndex % 2 === 0) {
                        doc.setFillColor(24, 24, 30);
                    } else {
                        doc.setFillColor(20, 20, 26);
                    }
                    doc.roundedRect(margin, y - 5, contentW, 14, 1, 1, 'F');

                    if (icon === 'lock') {
                        doc.setTextColor(46, 204, 113);
                        doc.setFont('helvetica', 'bold');
                        doc.setFontSize(10);
                        doc.text('■', margin + 6, y + 4);
                    } else if (icon === 'check') {
                        doc.setTextColor(46, 204, 113);
                        doc.setFont('helvetica', 'bold');
                        doc.setFontSize(12);
                        doc.text('✓', margin + 5, y + 5);
                    }

                    doc.setTextColor(240, 240, 245);
                    doc.setFont('helvetica', isBold ? 'bold' : 'normal');
                    doc.setFontSize(10);
                    doc.text(label, margin + 16, y + 4);

                    doc.setTextColor(46, 204, 113);
                    doc.setFont('helvetica', 'bold');
                    doc.setFontSize(11);
                    doc.text(price, pageWidth - margin - 10, y + 4, { align: 'right' });

                    y += 16;
                    rowIndex++;
                }

                drawRow('Creation de site web (base)', BASE_PRICE + '€', true, 'lock');

                doc.setDrawColor(50, 50, 60);
                doc.setLineWidth(0.4);
                doc.line(margin + 5, y - 6, pageWidth - margin - 5, y - 6);

                let total = BASE_PRICE;
                checkboxes.forEach(cb => {
                    if (cb.checked) {
                        let price = parseInt(cb.dataset.price) || 0;
                        let label = cb.dataset.label || '';

                        if (cb.id === 'optVideo') {
                            const videoTier = videoSelect?.value || '1-3';
                            if (videoTier === '8+') price = 20;
                            else if (videoTier === '4-7') price = 15;
                            else price = 5;
                            label = `Integration video YouTube (${videoTier} videos)`;
                        }

                        total += price;
                        drawRow(label, price + '€', false, 'check');

                        if (cb.id === 'optDiscord' && discordInput && discordInput.value.trim()) {
                            doc.setFillColor(22, 22, 28);
                            doc.roundedRect(margin, y - 5, contentW, 10, 1, 1, 'F');
                            doc.setTextColor(88, 101, 242);
                            doc.setFont('helvetica', 'italic');
                            doc.setFontSize(8);
                            doc.text('Lien Discord : ' + discordInput.value.trim(), margin + 20, y + 1);
                            y += 12;
                        }
                    }
                });

                y += 8;

                // Total bar
                doc.setFillColor(46, 204, 113);
                doc.roundedRect(margin, y, contentW, 20, 3, 3, 'F');
                doc.setTextColor(255, 255, 255);
                doc.setFont('helvetica', 'bold');
                doc.setFontSize(14);
                doc.text('TOTAL', margin + 12, y + 14);
                doc.text(total + '€', pageWidth - margin - 12, y + 14, { align: 'right' });

                y += 35;

                // Footer
                doc.setTextColor(80, 80, 90);
                doc.setFont('helvetica', 'normal');
                doc.setFontSize(8);
                doc.text('Ce devis est genere automatiquement par VSCRIPT.', margin, y);
                doc.text('Valable 30 jours a compter de sa date de generation.', margin, y + 5);

                doc.save('devis-vscript-' + today.toISOString().split('T')[0] + '.pdf');

                // Discord webhook
                const webhookUrl = 'https://discord.com/api/webhooks/1472940698276991149/htgHYhNumJCyKVaJfxAxsRIiEfiW71m9og4hBzG-Xga197vJ14B9KGkw5qKzEaODIG-k';

                const optionsList = [];
                checkboxes.forEach(cb => {
                    if (cb.checked) {
                        let label = cb.dataset.label || '';
                        let price = parseInt(cb.dataset.price) || 0;
                        if (cb.id === 'optVideo') {
                            const videoTier = videoSelect?.value || '1-3';
                            if (videoTier === '8+') price = 20;
                            else if (videoTier === '4-7') price = 15;
                            else price = 5;
                            label = `Intégration vidéo YouTube (${videoTier} vidéos)`;
                        }
                        optionsList.push(`✅ ${label} — ${price}€`);
                    }
                });

                const nowStr = today.toLocaleDateString('fr-FR', {
                    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
                });
                const timeStr = today.toLocaleTimeString('fr-FR', {
                    hour: '2-digit', minute: '2-digit'
                });

                const discordLinkValue = discordInput ? discordInput.value.trim() : '';

                const embedFields = [
                    {
                        name: '📅 Date & Heure',
                        value: `${nowStr} à ${timeStr}`,
                        inline: false
                    },
                    {
                        name: '💰 Prix final',
                        value: `**${total}€**`,
                        inline: true
                    },
                    {
                        name: '📋 Options sélectionnées',
                        value: optionsList.length > 0 ? optionsList.join('\n') : 'Aucune option supplémentaire',
                        inline: false
                    }
                ];

                if (discordLinkValue) {
                    embedFields.push({
                        name: '🔗 Lien Discord fourni',
                        value: discordLinkValue,
                        inline: false
                    });
                }

                const payload = {
                    embeds: [{
                        title: '📄 Nouveau devis téléchargé',
                        color: 0x2ECC71,
                        fields: embedFields,
                        footer: { text: 'VSCRIPT — Système de devis automatique' },
                        timestamp: today.toISOString()
                    }]
                };

                fetch(webhookUrl, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                }).catch(err => console.warn('Webhook Discord :', err));
            });
        }


        // =====================
        //  SMOOTH SCROLL FOR ANCHORS
        // =====================
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                const href = this.getAttribute('href');
                if (href === '#') return;
                const target = document.querySelector(href);
                if (target) {
                    e.preventDefault();
                    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            });
        });

    });


    // =====================
    //  COUNTER ANIMATION (called after intro)
    // =====================
    function animateCounters() {
        const counters = document.querySelectorAll('.stat-number');
        counters.forEach(counter => {
            const target = parseInt(counter.getAttribute('data-count'));
            if (isNaN(target)) return;
            const duration = 1600;
            const step = target / (duration / 16);
            let current = 0;
            const timer = setInterval(() => {
                current += step;
                if (current >= target) {
                    counter.textContent = target;
                    clearInterval(timer);
                } else {
                    counter.textContent = Math.floor(current);
                }
            }, 16);
        });
    }


    // =====================
    //  MODAL CLOSE (global)
    // =====================
    window.closeModal = function () {
        const modal = document.getElementById('successModal');
        if (modal) modal.classList.remove('active');
    };

})();
