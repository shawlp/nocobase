import PluginErrorHandler from '@nocobase/plugin-error-handler';
import { mockServer } from '@nocobase/test';
import Plugin from '../server';

describe('collections repository', () => {
  let app1;
  let app2;

  beforeEach(async () => {
    app1 = mockServer({
      database: {
        tablePrefix: 'through_',
      },
      acl: false,
    });

    app2 = mockServer({
      database: {
        tablePrefix: 'through_',
      },
    });
  });

  afterEach(async () => {
    if (app1) {
      await app1.destroy();
    }

    if (app2) {
      await app2.destroy();
    }
  });

  it('case 1', async () => {
    app1.plugin(PluginErrorHandler, { name: 'error-handler' });
    app1.plugin(Plugin, { name: 'collection-manager' });
    await app1.loadAndInstall({ clean: true });

    await app1
      .agent()
      .resource('collections')
      .create({
        values: {
          name: 'resumes',
          fields: [
            {
              name: 'id',
              type: 'integer',
              autoIncrement: true,
              primaryKey: true,
              allowNull: false,
            },
          ],
        },
      });

    await app1
      .agent()
      .resource('collections')
      .create({
        values: {
          name: 'jobs',
          fields: [
            {
              name: 'id',
              type: 'integer',
              autoIncrement: true,
              primaryKey: true,
              allowNull: false,
            },
          ],
        },
      });

    await app1
      .agent()
      .resource('collections')
      .create({
        values: {
          name: 'matches',
          fields: [
            {
              name: 'id',
              type: 'integer',
              autoIncrement: true,
              primaryKey: true,
              allowNull: false,
            },
          ],
        },
      });

    let response = await app1
      .agent()
      .resource('collections.fields', 'resumes')
      .create({
        values: {
          name: 'jobs',
          type: 'belongsToMany',
          foreignKey: 'rid',
          otherKey: 'jid',
          reverseField: {
            type: 'belongsToMany',
            name: 'resumes',
          },
          target: 'jobs',
          through: 'matches',
        },
      });

    expect(response.status).toBe(200);

    response = await app1
      .agent()
      .resource('collections.fields', 'resumes')
      .create({
        values: {
          name: 'matches2',
          type: 'hasMany',
          target: 'matches',
          foreignKey: 'rid',
          reverseField: {
            name: 'resume',
          },
        },
      });

    expect(response.status).toBe(200);

    const job1 = await app1.db.getRepository('jobs').create({});
    await app1.db.getRepository('resumes').create({
      values: {
        jobs: [job1.get('id')],
      },
    });
    const match1 = await app1.db.getRepository('matches').findOne();
    expect(match1.toJSON()).toMatchObject({
      id: 1,
      rid: 1,
      jid: 1,
    });

    app2.plugin(PluginErrorHandler, { name: 'error-handler' });
    app2.plugin(Plugin, { name: 'collection-manager' });
    await app2.load();

    await app2.db.sync({
      force: true,
    });
    const job = await app2.db.getRepository('jobs').create({});
    await app2.db.getRepository('resumes').create({
      values: {
        jobs: [job.get('id')],
      },
    });
    const match = await app2.db.getRepository('matches').findOne();
    expect(match.toJSON()).toMatchObject({
      id: 1,
      rid: 1,
      jid: 1,
    });
  });
});
