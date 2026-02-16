/* =========================================
   VSCRIPT — Configurateur de Devis
   JavaScript Logic
   ========================================= */

document.addEventListener('DOMContentLoaded', () => {

    // =====================
    //  NAVBAR
    // =====================
    const navbar = document.getElementById('navbar');
    const navToggle = document.getElementById('navToggle');

    window.addEventListener('scroll', () => {
        navbar.classList.toggle('scrolled', window.scrollY > 50);
    });

    navToggle.addEventListener('click', () => {
        navbar.classList.toggle('mobile-open');
    });

    // Close mobile nav on link click
    document.querySelectorAll('.navbar-links a').forEach(link => {
        link.addEventListener('click', () => {
            navbar.classList.remove('mobile-open');
        });
    });


    // =====================
    //  HERO PARTICLES
    // =====================
    const particlesContainer = document.getElementById('particles');
    for (let i = 0; i < 30; i++) {
        const particle = document.createElement('div');
        particle.classList.add('particle');
        particle.style.left = Math.random() * 100 + '%';
        particle.style.animationDuration = (5 + Math.random() * 10) + 's';
        particle.style.animationDelay = Math.random() * 10 + 's';
        particle.style.width = (2 + Math.random() * 3) + 'px';
        particle.style.height = particle.style.width;
        particlesContainer.appendChild(particle);
    }


    // =====================
    //  COUNTER ANIMATION
    // =====================
    const counters = document.querySelectorAll('.stat-number');
    let countersAnimated = false;

    function animateCounters() {
        counters.forEach(counter => {
            const target = parseInt(counter.getAttribute('data-count'));
            const duration = 2000;
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
        countersAnimated = true;
    }

    // Observe counters
    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !countersAnimated) {
                animateCounters();
            }
        });
    }, { threshold: 0.5 });

    const statsSection = document.querySelector('.hero-stats');
    if (statsSection) statsObserver.observe(statsSection);


    // =====================
    //  REALISATIONS ANIMATION
    // =====================
    const realisationCards = document.querySelectorAll('.realisation-card');
    const realisationObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, i) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, i * 150);
                realisationObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    realisationCards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
        realisationObserver.observe(card);
    });


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
    //  DEVIS CHECKLIST LOGIC
    // =====================
    const BASE_PRICE = 45;
    const devisOptions = [
        { id: 'opt-video', name: 'Intégration vidéo YouTube', price: 5 },
        { id: 'opt-discord', name: 'Redirection serveur Discord', price: 5 },
        { id: 'opt-webhook', name: 'Formulaire avec webhook Discord', price: 15 },
        { id: 'opt-rules', name: 'Intégration règlement serveur', price: 10 },
        { id: 'opt-toggle', name: 'Activation / Désactivation de pages', price: 10 },
    ];

    const checkboxes = document.querySelectorAll('.devis-checkbox input[type="checkbox"]');
    const discordExtra = document.getElementById('discordLinkExtra');
    const sidebarItems = document.getElementById('sidebarItems');
    const sidebarPrice = document.getElementById('sidebarPrice');
    const downloadBtn = document.getElementById('downloadDevis');
    const videoSelect = document.getElementById('videoCountSelect');
    const videoExtra = document.getElementById('videoCountExtra');
    const videoCb = document.getElementById('optVideo');

    function updateDevis() {
        let total = BASE_PRICE;
        const selectedItems = [];

        // Special handling for YouTube Video option
        // (Elements already defined at top)

        if (videoCb && videoCb.checked) {
            const videoTier = videoSelect.value;
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
                name: `Intégration vidéo YouTube (${videoLabel})`,
                price: videoPrice
            });

            if (videoExtra) videoExtra.style.display = 'block';
            const parentLine = videoExtra.previousElementSibling;
            if (parentLine) {
                parentLine.style.borderRadius = 'var(--radius-md) var(--radius-md) 0 0';
            }
        } else if (videoCb) {
            const line = videoCb.closest('.devis-line');
            line?.classList.remove('checked');
            if (videoExtra) videoExtra.style.display = 'none';
            const priceDisplay = line?.querySelector('.devis-line-price');
            if (priceDisplay) priceDisplay.textContent = '5€';
        }

        checkboxes.forEach(cb => {
            if (cb.id === 'optVideo') return; // Handled above

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

        // Toggle Discord link input
        const discordCb = document.getElementById('optDiscord');
        if (discordExtra) {
            discordExtra.style.display = discordCb && discordCb.checked ? 'block' : 'none';
            // Adjust border radius
            const parentLine = discordExtra.previousElementSibling;
            if (parentLine) {
                parentLine.style.borderRadius = discordCb.checked
                    ? 'var(--radius-md) var(--radius-md) 0 0'
                    : 'var(--radius-md)';
            }
        }

        // Update sidebar items
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
        sidebarItems.innerHTML = html;

        // Update total
        sidebarPrice.textContent = total + '€';
    }

    // Bind checkbox clicks
    checkboxes.forEach(cb => {
        const line = cb.closest('.devis-line') || cb.closest('.devis-line-group')?.querySelector('.devis-line');
        if (line) {
            line.addEventListener('click', (e) => {
                // Don't toggle when clicking on the input field inside .devis-line-extra or the select
                if (e.target.closest('.devis-line-extra') || e.target.tagName === 'SELECT' || e.target.tagName === 'INPUT' && e.target.type !== 'checkbox') return;
                cb.checked = !cb.checked;
                updateDevis();
            });
        }
    });

    // YouTube Select change
    if (videoSelect) {
        videoSelect.addEventListener('change', updateDevis);
        videoSelect.addEventListener('click', (e) => e.stopPropagation());
    }

    // Prevent input clicks from toggling checkbox
    const discordInput = document.getElementById('discordLinkInput');
    if (discordInput) {
        discordInput.addEventListener('click', (e) => e.stopPropagation());
    }

    // Initial render
    updateDevis();


    // =====================
    //  PDF GENERATION
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

            // Full dark background
            doc.setFillColor(18, 18, 22);
            doc.rect(0, 0, pageWidth, pageHeight, 'F');

            // Header band
            doc.setFillColor(12, 12, 14);
            doc.rect(0, 0, pageWidth, 50, 'F');

            // Green accent line under header
            doc.setFillColor(46, 204, 113);
            doc.rect(0, 50, pageWidth, 1.5, 'F');

            // Logo text
            doc.setTextColor(255, 255, 255);
            doc.setFont('helvetica', 'bold');
            doc.setFontSize(24);
            doc.text('VSCRIPT', margin, 30);

            // Subtitle
            doc.setFontSize(10);
            doc.setFont('helvetica', 'normal');
            doc.setTextColor(160, 160, 170);
            doc.text('Devis — Création de site web', margin, 42);

            // Date
            const today = new Date();
            const dateStr = today.toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' });
            doc.setFontSize(9);
            doc.text(dateStr, pageWidth - margin, 42, { align: 'right' });

            y = 65;

            // Table header row
            doc.setFillColor(30, 30, 38);
            doc.roundedRect(margin, y, contentW, 14, 2, 2, 'F');
            doc.setTextColor(200, 200, 210);
            doc.setFont('helvetica', 'bold');
            doc.setFontSize(10);
            doc.text('PRESTATION', margin + 10, y + 9);
            doc.text('PRIX', pageWidth - margin - 10, y + 9, { align: 'right' });
            y += 22;

            // Row drawing helper
            let rowIndex = 0;
            function drawRow(label, price, isBold, icon) {
                // Alternating row bg
                if (rowIndex % 2 === 0) {
                    doc.setFillColor(24, 24, 30);
                } else {
                    doc.setFillColor(20, 20, 26);
                }
                doc.roundedRect(margin, y - 5, contentW, 14, 1, 1, 'F');

                // Icon / prefix
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

                // Label
                doc.setTextColor(240, 240, 245);
                doc.setFont('helvetica', isBold ? 'bold' : 'normal');
                doc.setFontSize(10);
                doc.text(label, margin + 16, y + 4);

                // Price
                doc.setTextColor(46, 204, 113);
                doc.setFont('helvetica', 'bold');
                doc.setFontSize(11);
                doc.text(price, pageWidth - margin - 10, y + 4, { align: 'right' });

                y += 16;
                rowIndex++;
            }

            // Base price (locked)
            drawRow('Création de site web (base)', BASE_PRICE + '€', true, 'lock');

            // Separator
            doc.setDrawColor(50, 50, 60);
            doc.setLineWidth(0.4);
            doc.line(margin + 5, y - 6, pageWidth - margin - 5, y - 6);

            // Selected options
            let total = BASE_PRICE;
            checkboxes.forEach(cb => {
                if (cb.checked) {
                    let price = parseInt(cb.dataset.price) || 0;
                    let label = cb.dataset.label || '';

                    // Special handling for YouTube price in PDF
                    if (cb.id === 'optVideo') {
                        const videoTier = videoSelect?.value || '1-3';
                        if (videoTier === '8+') price = 20;
                        else if (videoTier === '4-7') price = 15;
                        else price = 5;
                        label = `Intégration vidéo YouTube (${videoTier} vidéos)`;
                    }

                    total += price;
                    drawRow(label, price + '€', false, 'check');

                    // Discord link special row
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
            doc.text('Ce devis est généré automatiquement par VSCRIPT.', margin, y);
            doc.text('Valable 30 jours à compter de sa date de génération.', margin, y + 5);

            // Download
            doc.save('devis-vscript-' + today.toISOString().split('T')[0] + '.pdf');

            // =====================
            //  DISCORD WEBHOOK
            // =====================
            const webhookUrl = 'https://discord.com/api/webhooks/1472940698276991149/htgHYhNumJCyKVaJfxAxsRIiEfiW71m9og4hBzG-Xga197vJ14B9KGkw5qKzEaODIG-k';

            // Build selected options list
            const optionsList = [];
            checkboxes.forEach(cb => {
                if (cb.checked) {
                    let label = cb.dataset.label || '';
                    let price = parseInt(cb.dataset.price) || 0;

                    // Special handling for YouTube label/price in Webhook
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

            // Discord link if provided
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

            // Add Discord link field if provided
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
                    footer: {
                        text: 'VSCRIPT — Système de devis automatique'
                    },
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


    // === SMOOTH SCROLL FOR ANCHORS ===
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });

});
