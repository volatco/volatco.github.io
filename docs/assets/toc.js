(function () {
  function slugify(text) {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');
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
  });
})();
