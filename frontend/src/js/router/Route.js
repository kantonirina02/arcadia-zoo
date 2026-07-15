export class Route {
  /**
   * @param {string} url
   * @param {string} title
   * @param {string} htmlPath
   * @param {Array<string>} authorizedRoles -
   */
  constructor(url, title, htmlPath, authorizedRoles = []) {
    this.url = url;
    this.title = title;
    this.htmlPath = htmlPath;
    this.authorizedRoles = authorizedRoles;
  }
}
