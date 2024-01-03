import { Plugin } from '@nocobase/server';
import backupFilesResourcer from './resourcers/backup-files';

export default class Duplicator extends Plugin {
  beforeLoad() {}

  async load() {
    this.app.resourcer.define(backupFilesResourcer);
  }
}
