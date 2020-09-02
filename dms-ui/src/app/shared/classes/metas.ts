export class Metas {
  lastUpdated: string;
  versionId: string;

  constructor(data: Metas) {
    this.lastUpdated = data && data.lastUpdated ? data.lastUpdated : null;
    this.versionId = data && data.versionId ? data.versionId : null;
  }
}
