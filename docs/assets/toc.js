(function () {
  function slugify(text) {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');
  }

  function samePageAnchor(link) {
    if (!link || !link.hash) {
      return false;
    }

    var linkPath = (link.pathname || '').replace(/\/$/, '');
    var pagePath = window.location.pathname.replace(/\/$/, '');
    return linkPath === pagePath;
  }

  document.addEventListener('DOMContentLoaded', function () {
    var content = document.querySelector('.content');
    var tocRoot = document.getElementById('toc');
    var tocWrapper = document.querySelector('.toc');

    if (!content || !tocRoot || !tocWrapper) {
      return;
    }

    var headings = content.querySelectorAll('h1, h2, h3, h4');
    if (!headings.length) {
      tocWrapper.classList.add('toc--empty');
      return;
    }

    var list = document.createElement('ul');
    list.className = 'toc__list';

    headings.forEach(function (heading) {
      if (!heading.id) {
        heading.id = slugify(heading.textContent);
      }

      var item = document.createElement('li');
      item.className = 'toc__item toc__item--' + heading.tagName.toLowerCase();

      var link = document.createElement('a');
      link.href = '#' + heading.id;
      link.textContent = heading.textContent;

      item.appendChild(link);
      list.appendChild(item);
    });

    tocRoot.appendChild(list);

    // In-page breadcrumb/back stack for hash navigation.
    var navStack = [];

    var crumb = document.createElement('nav');
    crumb.className = 'section-crumb';
    crumb.setAttribute('aria-label', 'Section navigation');

    var crumbButton = document.createElement('button');
    crumbButton.type = 'button';
    crumbButton.className = 'section-crumb__back';
    crumbButton.textContent = 'Go back';

    var crumbTarget = document.createElement('span');
    crumbTarget.className = 'section-crumb__target';

    crumb.appendChild(crumbButton);
    crumb.appendChild(crumbTarget);
    content.insertBefore(crumb, content.firstChild);

    function headingTextForHash(hash) {
      if (!hash) {
        return 'Top';
      }

      var id = hash.charAt(0) === '#' ? hash.slice(1) : hash;
      var target = document.getElementById(id);
      return target ? target.textContent.trim() : id;
    }

    function updateCrumb() {
      if (!navStack.length) {
        crumb.classList.remove('section-crumb--visible');
        crumbTarget.textContent = '';
        return;
      }

      var prevHash = navStack[navStack.length - 1];
      crumbTarget.textContent = 'to ' + headingTextForHash(prevHash);
      crumb.classList.add('section-crumb--visible');
    }

    function pushIfNew(hashValue) {
      var last = navStack.length ? navStack[navStack.length - 1] : null;
      if (last !== hashValue) {
        navStack.push(hashValue);
      }
      updateCrumb();
    }

    document.addEventListener('click', function (event) {
      var link = event.target.closest('a');
      if (!link || !samePageAnchor(link)) {
        return;
      }

      var currentHash = window.location.hash || '';
      var nextHash = link.hash || '';
      if (currentHash !== nextHash) {
        pushIfNew(currentHash);
      }
    });

    crumbButton.addEventListener('click', function () {
      if (!navStack.length) {
        return;
      }

      var previousHash = navStack.pop();
      updateCrumb();

      if (!previousHash) {
        history.replaceState(null, '', window.location.pathname + window.location.search);
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }

      window.location.hash = previousHash;
    });

    updateCrumb();
  });
})();
