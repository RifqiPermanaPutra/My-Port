/* ============================================================
   RASA REVIVAL — interaksi
   ============================================================ */
(function () {
  'use strict';

  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Pengamat posisi gulir ----------
     Beberapa fitur bergantung pada posisi gulir: latar header, bar progres,
     tombol kembali ke atas, dan penanda bagian aktif. Semuanya didaftarkan
     ke satu tempat agar tidak ada empat pendengar terpisah yang berjalan
     sendiri-sendiri. Sengaja memakai peristiwa 'scroll', bukan
     requestAnimationFrame — rAF dihentikan browser saat tab tidak terlihat,
     sedangkan peristiwa scroll tetap terkirim. */
  var pengamatGulir = [];
  var sedangMenunggu = false;

  function jalankanPengamat() {
    sedangMenunggu = false;
    for (var i = 0; i < pengamatGulir.length; i++) pengamatGulir[i]();
  }

  function amatiGulir(fn) {
    pengamatGulir.push(fn);
    fn();
  }

  window.addEventListener('scroll', function () {
    // dikumpulkan dulu supaya tidak menghitung ulang berkali-kali dalam satu frame
    if (sedangMenunggu) return;
    sedangMenunggu = true;
    requestAnimationFrame(jalankanPengamat);
  }, { passive: true });

  window.addEventListener('resize', jalankanPengamat);

  /* ---------- Loader (hanya ada di beranda) ----------
     Judul dipecah jadi satu elemen per karakter, masing-masing diberi
     nomor urut lewat --char-i. CSS memakai nomor itu untuk menunda
     kemunculannya 1/30 detik per karakter. */
  var loader = document.getElementById('loader');
  if (loader) {
    var lTitle = document.getElementById('loaderTitle');
    if (lTitle) {
      var teks = lTitle.textContent.trim();
      lTitle.textContent = '';
      for (var ci = 0; ci < teks.length; ci++) {
        var ch = document.createElement('i');
        ch.textContent = teks.charAt(ci);
        ch.style.setProperty('--char-i', ci);
        lTitle.appendChild(ch);
      }
    }
    // animasi menunggu aba-aba supaya semua karakter mulai dari titik yang sama
    requestAnimationFrame(function () { loader.classList.add('is-started'); });

    window.addEventListener('load', function () {
      setTimeout(function () {
        loader.classList.add('is-leaving');
        setTimeout(function () { loader.classList.add('is-done'); }, reduced ? 0 : 120);
      }, reduced ? 0 : 1100);
    });
  }

  /* ---------- Glitch pisah-kanal ----------
     Memasang ulang nama animasi yang sama tidak memulai ulang animasinya,
     jadi tiap pemicu bergantian antara pasangan -a/-b dan varian -alt. */
  var glitches = document.querySelectorAll('.glitch');
  if (glitches.length && !reduced) {
    var tembak = function (el) {
      var pakaiAlt = el.classList.contains('is-shot');
      el.classList.remove('is-shot', 'is-shot-alt');
      void el.offsetWidth;                       // paksa reflow
      el.classList.add(pakaiAlt ? 'is-shot-alt' : 'is-shot');
    };

    if ('IntersectionObserver' in window) {
      var gio = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) { if (e.isIntersecting) tembak(e.target); });
      }, { threshold: 0.3 });
      glitches.forEach(function (el) { gio.observe(el); });
    }

    /* Sapuan awal. IntersectionObserver hanya melapor saat perpotongan BERUBAH —
       kalau pemeriksaan pertamanya terjadi sebelum tata letak selesai (font web
       belum termuat, tinggi elemen masih nol), ia melapor "tidak terlihat" dan
       tidak pernah mengoreksi diri. Akibatnya judul yang sudah tampak sejak awal
       tidak pernah kena efeknya. */
    window.addEventListener('load', function () {
      glitches.forEach(function (el) {
        if (el.classList.contains('is-shot') || el.classList.contains('is-shot-alt')) return;
        var r = el.getBoundingClientRect();
        if (r.top < window.innerHeight && r.bottom > 0 && r.height > 0) tembak(el);
      });
    });

    glitches.forEach(function (el) {
      var pemicu = el.closest('button, a') || el;
      pemicu.addEventListener('mouseenter', function () { tembak(el); });
    });
  }

  /* ---------- Header sticky state ----------
     Hanya beranda yang punya hero transparan, jadi cuma di sana
     latar header perlu muncul saat digulir. Halaman anak sudah
     memakai .is-stuck sejak awal dan harus tetap begitu. */
  var header = document.getElementById('siteHeader');
  if (header && document.querySelector('.fv')) {
    var onScroll = function () {
      header.classList.toggle('is-stuck', window.scrollY > window.innerHeight * 0.85);
    };
    amatiGulir(onScroll);
  }

  /* ---------- Drawer: buka/tutup dengan circle clip ---------- */
  var toggle = document.getElementById('menuToggle');
  var drawer = document.getElementById('navDrawer');
  var closeTimer = null;

  function openDrawer() {
    var r = toggle.getBoundingClientRect();
    drawer.style.setProperty('--cx', (r.left + r.width / 2) + 'px');
    drawer.style.setProperty('--cy', (r.top + r.height / 2) + 'px');
    drawer.classList.remove('is-closing');
    drawer.hidden = false;
    toggle.setAttribute('aria-expanded', 'true');
    toggle.setAttribute('aria-label', 'Tutup menu');
    document.body.style.overflow = 'hidden';
  }

  function closeDrawer() {
    if (drawer.hidden) return;
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', 'Buka menu');
    document.body.style.overflow = '';
    drawer.classList.add('is-closing');
    clearTimeout(closeTimer);
    closeTimer = setTimeout(function () {
      drawer.hidden = true;
      drawer.classList.remove('is-closing');
    }, reduced ? 0 : 450);
  }

  toggle.addEventListener('click', function () {
    toggle.getAttribute('aria-expanded') === 'true' ? closeDrawer() : openDrawer();
  });

  drawer.addEventListener('click', function (e) {
    if (e.target.closest('a')) closeDrawer();
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeDrawer();
  });

  /* ---------- Scroll reveal ---------- */
  var targets = document.querySelectorAll('[data-reveal]');

  if (reduced || !('IntersectionObserver' in window)) {
    targets.forEach(function (el) { el.classList.add('is-in'); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        // beri jeda berurutan untuk elemen bersaudara
        var siblings = Array.prototype.filter.call(
          entry.target.parentElement.children,
          function (c) { return c.hasAttribute('data-reveal'); }
        );
        var i = siblings.indexOf(entry.target);
        entry.target.style.transitionDelay = (i > 0 ? Math.min(i, 6) * 0.07 : 0) + 's';
        entry.target.classList.add('is-in');
        io.unobserve(entry.target);
      });
    }, { rootMargin: '0px 0px -12% 0px', threshold: 0.12 });

    targets.forEach(function (el) { io.observe(el); });
  }

  /* ---------- Tab paket ---------- */
  var tabs = document.querySelectorAll('.pkg__tab');
  var panels = document.querySelectorAll('.pkg__panel');

  tabs.forEach(function (tab) {
    tab.addEventListener('click', function () {
      tabs.forEach(function (t) {
        var active = t === tab;
        t.classList.toggle('is-active', active);
        t.setAttribute('aria-selected', String(active));
      });
      panels.forEach(function (p) {
        var active = p.dataset.panel === tab.dataset.tab;
        p.classList.toggle('is-active', active);
        if (active) {
          p.querySelectorAll('[data-reveal]').forEach(function (el) {
            el.classList.add('is-in');
          });
        }
      });
    });
  });

  /* ---------- Tombol putar (placeholder) ---------- */
  document.querySelectorAll('.btn-play').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var label = btn.querySelector('.btn-play__txt');
      var original = label.textContent;
      label.textContent = 'VIDEO BELUM TERSEDIA';
      setTimeout(function () { label.textContent = original; }, 1800);
    });
  });

  /* ---------- Carousel banner ----------
     Geser per satu kartu. Jumlah kartu terlihat dibaca dari lebar nyata,
     jadi otomatis ikut breakpoint CSS tanpa perlu diduplikasi di sini. */
  var track = document.getElementById('bannerTrack');
  var viewport = document.getElementById('bannerViewport');
  if (track && viewport && track.children.length) {
    var slides = track.children;
    var pager = document.getElementById('bannerPager');
    var index = 0;
    var timer = null;

    var slideW  = function () { return slides[0].getBoundingClientRect().width || 1; };
    var perView = function () { return Math.max(1, Math.round(viewport.clientWidth / slideW())); };
    var maxIndex = function () { return Math.max(0, slides.length - perView()); };

    var render = function () {
      track.style.transform = 'translateX(' + (-index * slideW()) + 'px)';
      if (!pager) return;
      [].forEach.call(pager.children, function (b, i) {
        b.classList.toggle('is-active', i === index);
        b.setAttribute('aria-selected', String(i === index));
      });
    };

    var go = function (i) {
      var max = maxIndex();
      index = i < 0 ? max : (i > max ? 0 : i);
      render();
    };

    var buildPager = function () {
      if (!pager) return;
      pager.innerHTML = '';
      for (var i = 0; i <= maxIndex(); i++) {
        var b = document.createElement('button');
        b.type = 'button';
        b.className = 'banner__bullet';
        b.setAttribute('role', 'tab');
        b.setAttribute('aria-label', 'Halaman ' + (i + 1));
        (function (n) { b.addEventListener('click', function () { go(n); restart(); }); })(i);
        pager.appendChild(b);
      }
    };

    var restart = function () {
      clearInterval(timer);
      if (!reduced) timer = setInterval(function () { go(index + 1); }, 4500);
    };

    var prev = document.getElementById('bannerPrev');
    var next = document.getElementById('bannerNext');
    if (prev) prev.addEventListener('click', function () { go(index - 1); restart(); });
    if (next) next.addEventListener('click', function () { go(index + 1); restart(); });

    viewport.addEventListener('mouseenter', function () { clearInterval(timer); });
    viewport.addEventListener('mouseleave', restart);

    var rebuild = function () {
      if (index > maxIndex()) index = maxIndex();
      buildPager();
      render();
    };
    window.addEventListener('resize', rebuild);

    /* geser dengan jari / seret mouse */
    var dragFrom = 0, dragging = false;
    viewport.addEventListener('pointerdown', function (e) {
      dragging = true; dragFrom = e.clientX; clearInterval(timer);
    });
    viewport.addEventListener('pointerup', function (e) {
      if (!dragging) return;
      dragging = false;
      var dx = e.clientX - dragFrom;
      if (Math.abs(dx) > 40) go(dx < 0 ? index + 1 : index - 1);
      restart();
    });
    viewport.addEventListener('pointercancel', function () { dragging = false; restart(); });

    buildPager();
    render();
    restart();
  }

  /* ---------- Navigasi panah untuk daftar tab ----------
     Markup sudah memakai role="tab", jadi panah kiri/kanan wajib berfungsi —
     tanpa itu, role-nya justru menyesatkan pengguna keyboard. */
  function wireTablist(containerSel, itemSel) {
    var box = document.querySelector(containerSel);
    if (!box) return;
    var items = [].slice.call(box.querySelectorAll(itemSel));
    if (items.length < 2) return;

    box.addEventListener('keydown', function (e) {
      var i = items.indexOf(document.activeElement);
      if (i < 0) return;
      var n = null;
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') n = (i + 1) % items.length;
      else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp')  n = (i - 1 + items.length) % items.length;
      else if (e.key === 'Home') n = 0;
      else if (e.key === 'End')  n = items.length - 1;
      if (n === null) return;
      e.preventDefault();
      items[n].focus();
      items[n].click();
    });
  }
  wireTablist('.sig-tabs', '.sig-thumb');
  wireTablist('.pkg__tabs', '.pkg__tab');
  wireTablist('#bannerPager', '.banner__bullet');

  /* ---------- Formulir kontak ----------
     Situs ini statis dan tidak punya server, jadi isian formulir disusun
     menjadi draf email lalu dibuka di aplikasi email pengunjung (mailto). */
  var form = document.getElementById('reserveForm');
  if (form) {
    var msg = document.getElementById('formMsg');
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var kosong = [].slice.call(form.querySelectorAll('[required]'))
        .filter(function (f) { return !f.value; });

      msg.hidden = false;
      if (kosong.length) {
        var nama = kosong.map(function (f) {
          var l = f.closest('.field');
          return l ? l.querySelector('.field__l').textContent.toLowerCase() : f.name;
        });
        msg.className = 'form__msg form__msg--err';
        msg.textContent = 'Lengkapi dulu: ' + nama.join(', ') + '.';
        kosong[0].focus();
      } else {
        var isi = function (n) { return (form.elements[n].value || '').trim(); };
        var subjek = '[Portofolio] ' + isi('keperluan') + ' — ' + isi('nama');
        var badan = 'Nama: ' + isi('nama') + '\n' +
                    'Kontak: ' + isi('kontak') + '\n' +
                    'Keperluan: ' + isi('keperluan') + '\n\n' +
                    isi('pesan');
        window.location.href = 'mailto:' + form.getAttribute('data-mailto') +
          '?subject=' + encodeURIComponent(subjek) +
          '&body=' + encodeURIComponent(badan);

        msg.className = 'form__msg';
        msg.textContent = 'Draf email sudah dibuka di aplikasi email Anda. Tekan kirim di sana.';
      }
    });
  }

  /* ---------- Tab thumbnail sajian ---------- */
  var thumbs = document.querySelectorAll('.sig-thumb');
  if (thumbs.length) {
    var panels = document.querySelectorAll('.sig-panel');
    thumbs.forEach(function (t) {
      t.addEventListener('click', function () {
        var target = t.getAttribute('aria-controls');
        thumbs.forEach(function (o) {
          var on = o === t;
          o.classList.toggle('is-active', on);
          o.setAttribute('aria-selected', String(on));
        });
        panels.forEach(function (p) {
          p.classList.toggle('is-active', p.id === target);
        });
      });
    });
  }

  /* ---------- Bar progres gulir ---------- */
  var progress = document.getElementById('progress');
  if (progress) {
    var gambarProgres = function () {
      var bisaDigulir = document.documentElement.scrollHeight - window.innerHeight;
      var persen = bisaDigulir > 0 ? (window.scrollY / bisaDigulir) * 100 : 0;
      progress.style.width = Math.min(100, Math.max(0, persen)) + '%';
    };
    window.addEventListener('resize', gambarProgres);
    amatiGulir(gambarProgres);
  }

  /* ---------- Penanda halaman aktif di drawer ----------
     Ditandai lewat JS supaya tidak perlu menyunting sembilan tautan
     di setiap halaman secara manual — satu tempat, berlaku di mana saja. */
  var berkasKini = (location.pathname.split('/').pop() || 'index.html').toLowerCase();
  document.querySelectorAll('.site-nav-drawer__list a').forEach(function (a) {
    var tujuan = (a.getAttribute('href') || '').split('#')[0].toLowerCase();
    if (!tujuan) tujuan = berkasKini;            // tautan yang hanya berisi #anchor
    if (tujuan === berkasKini) a.setAttribute('aria-current', 'page');
  });

  /* ---------- Kembali ke atas ---------- */
  var backTop = document.getElementById('backTop');
  if (backTop) {
    var toggleBack = function () {
      backTop.classList.toggle('is-show', window.scrollY > window.innerHeight * 0.6);
    };
    amatiGulir(toggleBack);
    backTop.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: reduced ? 'auto' : 'smooth' });
    });
  }

  /* ---------- Scrollspy nav kategori (halaman anak) ---------- */
  var anchorLinks = document.querySelectorAll('.anchors a');
  if (anchorLinks.length) {
    var spyTargets = [];
    anchorLinks.forEach(function (a) {
      var href = a.getAttribute('href') || '';
      if (href.charAt(0) !== '#') return;
      var el = document.querySelector(href);
      if (el) spyTargets.push({ link: a, el: el });
    });

    if (spyTargets.length) {
      var spy = function () {
        var line = window.innerHeight * 0.32;
        var current = spyTargets[0];
        spyTargets.forEach(function (t) {
          if (t.el.getBoundingClientRect().top <= line) current = t;
        });
        spyTargets.forEach(function (t) {
          t.link.classList.toggle('is-active', t === current);
        });
      };
      amatiGulir(spy);
    }
  }

  /* ---------- Bilah loncat: sembunyi saat turun, muncul saat naik ----------
     Hanya berefek di ponsel (CSS-nya ada di dalam media query). Ambang 8px
     mencegah bilah berkedip karena getaran kecil saat jari menahan layar. */
  var bilahLoncat = document.querySelector('.anchors');
  if (bilahLoncat) {
    var yTerakhir = window.scrollY;
    amatiGulir(function () {
      var y = window.scrollY;
      if (Math.abs(y - yTerakhir) < 8) return;
      bilahLoncat.classList.toggle('is-tucked', y > yTerakhir && y > 200);
      yTerakhir = y;
    });
  }

  /* ---------- Parallax ringan pada bentuk hero ---------- */
  if (!reduced) {
    var diagonal = document.querySelector('.fv__shape--diagonal');
    var ticking = false;
    window.addEventListener('scroll', function () {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(function () {
        var y = window.scrollY;
        if (y < window.innerHeight && diagonal) {
          diagonal.style.transform = 'translateY(' + (y * 0.18) + 'px)';
        }
        ticking = false;
      });
    }, { passive: true });
  }
})();
