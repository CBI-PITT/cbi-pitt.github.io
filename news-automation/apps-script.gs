const REPO_OWNER = 'CBI-PITT';
const REPO_NAME = 'cbi-pitt.github.io';
const BRANCH = 'main';

function onFormSubmit(e) {
  const values = e.values;
  const title = (values[1] || '').trim();
  const body = (values[2] || '').trim();
  const link = (values[3] || '').trim();
  const fileUrl = (values[4] || '').trim();
  if (!title || !body) return;

  const token = PropertiesService.getScriptProperties().getProperty('GITHUB_TOKEN');
  if (!token) throw new Error('GITHUB_TOKEN not set in Script Properties');

  const date = Utilities.formatDate(new Date(values[0]), Session.getScriptTimeZone(), 'yyyy-MM-dd');
  const slug = uniqueSlug(slugify(title), token);

  let image = '';
  if (fileUrl) {
    const match = fileUrl.match(/[-\w]{25,}/);
    if (match) {
      const file = DriveApp.getFileById(match[0]);
      const imagePath = 'assets/images/news/' + slug + '.' + extFor(file.getMimeType());
      putFile(token, imagePath, file.getBlob().getBytes(), 'Add news image for: ' + title);
      image = imagePath;
    }
  }

  const esc = s => s.replace(/\\/g, '\\\\').replace(/"/g, '\\"');
  const md = [
    '---',
    'title: "' + esc(title) + '"',
    'date: ' + date,
    image ? 'image: ' + image : null,
    link ? 'link: "' + esc(link) + '"' : null,
    'permalink: /news/' + slug + '.html',
    'layout: base',
    '---',
    '',
    paragraphs(body)
  ].filter(v => v !== null).join('\n') + '\n';

  putFile(token, 'news/' + slug + '.md', Utilities.newBlob(md).getBytes(), 'Add news post: ' + title);
}

function slugify(text) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 60) || 'news-post';
}

function uniqueSlug(base, token) {
  let slug = base;
  let n = 2;
  while (fileExists(token, 'news/' + slug + '.md')) {
    slug = base + '-' + n;
    n++;
  }
  return slug;
}

function fileExists(token, path) {
  const url = 'https://api.github.com/repos/' + REPO_OWNER + '/' + REPO_NAME + '/contents/' + path + '?ref=' + BRANCH;
  const res = UrlFetchApp.fetch(url, {
    headers: { Authorization: 'Bearer ' + token, 'User-Agent': 'cbi-news-bot' },
    muteHttpExceptions: true
  });
  return res.getResponseCode() !== 404;
}

function putFile(token, path, bytes, message) {
  const url = 'https://api.github.com/repos/' + REPO_OWNER + '/' + REPO_NAME + '/contents/' + path;
  const res = UrlFetchApp.fetch(url, {
    method: 'put',
    headers: { Authorization: 'Bearer ' + token, 'User-Agent': 'cbi-news-bot' },
    contentType: 'application/json',
    payload: JSON.stringify({ message: message, content: Utilities.base64Encode(bytes), branch: BRANCH }),
    muteHttpExceptions: true
  });
  if (res.getResponseCode() >= 300) throw new Error('GitHub API error ' + res.getResponseCode() + ': ' + res.getContentText());
}

function extFor(mime) {
  const map = { 'image/jpeg': 'jpg', 'image/png': 'png', 'image/gif': 'gif', 'image/webp': 'webp' };
  return map[mime] || 'jpg';
}

function paragraphs(text) {
  return text.split(/\n\s*\n/).map(p => p.replace(/\s*\n\s*/g, ' ').trim()).filter(p => p).join('\n\n');
}

function testPost() {
  onFormSubmit({
    values: [
      new Date().toString(),
      'CBI News Pipeline Test',
      'This is a test post created to verify the automated news pipeline is working.',
      '',
      ''
    ]
  });
}
