(function () {
  function getAdventureTables() {
    var tables = document.querySelectorAll('.content table');
    return Array.prototype.filter.call(tables, function (table) {
      var headers = Array.prototype.map.call(table.querySelectorAll('th'), function (th) {
        return (th.textContent || '').trim().toLowerCase();
      });
      return headers.indexOf('adventure') !== -1 && headers.indexOf('artwork') !== -1;
    });
  }

  function createLightbox() {
    var root = document.createElement('div');
    root.className = 'artwork-lightbox';
    root.hidden = true;
    root.setAttribute('role', 'dialog');
    root.setAttribute('aria-modal', 'true');
    root.setAttribute('aria-label', 'Artwork preview');

    root.innerHTML = [
      '<div class="artwork-lightbox__backdrop" data-close="true"></div>',
      '<figure class="artwork-lightbox__figure">',
      '  <button type="button" class="artwork-lightbox__close" aria-label="Close image popup">&times;</button>',
      '  <img class="artwork-lightbox__image" alt="">',
      '  <figcaption class="artwork-lightbox__caption"></figcaption>',
      '</figure>'
    ].join('');

    document.body.appendChild(root);
    return root;
  }

  document.addEventListener('DOMContentLoaded', function () {
    var tables = getAdventureTables();
    if (!tables.length) {
      return;
    }

    var lightbox = createLightbox();
    var lightboxImage = lightbox.querySelector('.artwork-lightbox__image');
    var lightboxCaption = lightbox.querySelector('.artwork-lightbox__caption');
    var lastTrigger = null;

    function closeLightbox() {
      lightbox.hidden = true;
      document.body.classList.remove('artwork-lightbox-open');
      if (lastTrigger) {
        lastTrigger.focus();
      }
    }

    function openLightbox(trigger) {
      var src = trigger.getAttribute('data-full-src');
      var alt = trigger.getAttribute('data-alt') || '';
      var caption = trigger.getAttribute('data-caption') || alt;

      lightboxImage.src = src;
      lightboxImage.alt = alt;
      lightboxCaption.textContent = caption;

      lastTrigger = trigger;
      lightbox.hidden = false;
      document.body.classList.add('artwork-lightbox-open');
      lightbox.querySelector('.artwork-lightbox__close').focus();
    }

    tables.forEach(function (table) {
      table.classList.add('adventure-table');

      var rows = table.querySelectorAll('tr');
      rows.forEach(function (row) {
        var cells = row.querySelectorAll('td');
        if (!cells.length) {
          return;
        }

        var titleCell = cells[0];
        var imageCell = cells[cells.length - 1];
        var image = imageCell.querySelector('img');

        if (!image) {
          return;
        }

        var title = (titleCell.textContent || '').trim();
        var alt = image.getAttribute('alt') || title;
        var src = image.getAttribute('src');
        var trigger = document.createElement('button');

        trigger.type = 'button';
        trigger.className = 'adventure-artwork-trigger';
        trigger.setAttribute('data-full-src', src);
        trigger.setAttribute('data-alt', alt);
        trigger.setAttribute('data-caption', title);
        trigger.setAttribute('aria-label', 'Open full-size artwork for ' + title);

        image.classList.add('adventure-artwork-thumb');
        image.parentNode.insertBefore(trigger, image);
        trigger.appendChild(image);

        trigger.addEventListener('click', function () {
          openLightbox(trigger);
        });
      });
    });

    lightbox.addEventListener('click', function (event) {
      if (event.target === lightbox || event.target.getAttribute('data-close') === 'true') {
        closeLightbox();
      }
    });

    lightbox.querySelector('.artwork-lightbox__close').addEventListener('click', closeLightbox);

    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape' && !lightbox.hidden) {
        closeLightbox();
      }
    });
  });
})();
