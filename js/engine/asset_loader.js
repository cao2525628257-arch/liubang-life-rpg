/**
 * 资源加载器 — 异步加载图片/音频/JSON，带缓存和进度回调
 */
class AssetLoader {
  constructor() {
    /** @type {Map<string, HTMLImageElement | HTMLAudioElement | object>} */
    this._cache = new Map();
  }

  /**
   * 加载图片
   * @param {string} key — 资源键名
   * @param {string} url — 文件路径
   * @returns {Promise<HTMLImageElement>}
   */
  loadImage(key, url) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        this._cache.set(key, img);
        resolve(img);
      };
      img.onerror = () => reject(new Error(`图片加载失败: ${url}`));
      img.src = url;
    });
  }

  /**
   * 加载音频
   * @param {string} key — 资源键名
   * @param {string} url — 文件路径
   * @returns {Promise<HTMLAudioElement>}
   */
  loadAudio(key, url) {
    return new Promise((resolve, reject) => {
      const audio = new Audio();
      audio.oncanplaythrough = () => {
        this._cache.set(key, audio);
        resolve(audio);
      };
      audio.onerror = () => reject(new Error(`音频加载失败: ${url}`));
      audio.src = url;
      audio.load();
    });
  }

  /**
   * 加载 JSON 文件
   * @param {string} key — 资源键名
   * @param {string} url — 文件路径
   * @returns {Promise<object>}
   */
  async loadJSON(key, url) {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`JSON加载失败 (${response.status}): ${url}`);
    }
    const data = await response.json();
    this._cache.set(key, data);
    return data;
  }

  /**
   * 批量加载，支持进度回调
   * @param {Array<{key: string, type: 'image'|'audio'|'json', url: string}>} manifest
   * @param {(progress: {loaded: number, total: number, key: string}) => void} [onProgress]
   * @returns {Promise<Map<string, any>>}
   */
  async loadAll(manifest, onProgress) {
    let loaded = 0;
    const total = manifest.length;

    const tasks = manifest.map(async (item) => {
      let result;
      switch (item.type) {
        case 'image':
          result = await this.loadImage(item.key, item.url);
          break;
        case 'audio':
          result = await this.loadAudio(item.key, item.url);
          break;
        case 'json':
          result = await this.loadJSON(item.key, item.url);
          break;
        default:
          throw new Error(`未知资源类型: ${item.type}`);
      }
      loaded++;
      if (onProgress) {
        onProgress({ loaded, total, key: item.key });
      }
      return result;
    });

    await Promise.all(tasks);
    return this._cache;
  }

  /**
   * 获取已缓存的资源
   * @param {string} key
   * @returns {any|null}
   */
  get(key) {
    return this._cache.get(key) || null;
  }

  /**
   * 检查资源是否已加载
   * @param {string} key
   * @returns {boolean}
   */
  has(key) {
    return this._cache.has(key);
  }

  /** 清空所有缓存 */
  clear() {
    this._cache.clear();
  }

  /** 获取已加载资源总数 */
  get size() {
    return this._cache.size;
  }
}

export const assetLoader = new AssetLoader();
export default AssetLoader;
