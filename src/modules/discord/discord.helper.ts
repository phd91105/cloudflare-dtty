import _ from 'lodash';
import Papa from 'papaparse';

import { commonHeaders } from 'common/contants';
import { StringUtils, URIUtils } from 'common/utils';
import { Environment, HttpRequest } from 'core/providers';
import { Inject, Injectable } from 'dtty-extra';
import { githubUrl } from './discord.constant';
import type { Commit, EmbedCommit } from './github.interface';

@Injectable()
export class DiscordHelper {
  constructor(
    @Inject(Environment) private env: Env,
    @Inject(HttpRequest) private http: HttpRequest,
  ) {}

  async getCsvData(fileUrl: string) {
    const data = await this.http.get<string>(fileUrl, undefined, 'text');

    const parsedData = Papa.parse<{
      '#': string;
      Created: string;
      Updated: string;
    }>(data, {
      header: true,
      skipEmptyLines: true,
    });

    return parsedData;
  }

  async getCommitsDataForRepos(
    repos: string[],
    minMaxDate: { minDate: string; maxDate: string },
    listIssue: string[],
  ) {
    const colors = [15548997, 2800796, 16705372];
    const commitDataPromises = repos.map(async (repo, index) => {
      try {
        const commitData = await this.getCommitData(repo, minMaxDate);
        return {
          repo,
          commits: this.filterCommit(listIssue, commitData),
          color: colors[index],
          from: minMaxDate.minDate,
          to: minMaxDate.maxDate,
        };
      } catch (error) {
        return null;
      }
    });

    return Promise.all(commitDataPromises);
  }

  public createEmbed(
    title: string,
    commit: EmbedCommit[],
    from: string,
    to: string,
    color?: number,
  ) {
    const listMsg = _.map(
      commit,
      (item) =>
        `${this.colorize(item.message.match(/#\d+/)?.[0].trim()).green()} ` +
        StringUtils.truncate2byte(
          `${item.message
            .replace(/refs\s/g, '')
            .replace(/#\d+/g, '')
            .replace(/^\s+-/g, '')
            .trim()}`,
          20,
        ),
    ).join('\n');
    const listCommitter = _.map(commit, (item) =>
      this.colorize(item.committer).yellow(),
    ).join('\n');
    const listSHA = _.map(commit, (item) =>
      this.colorize(item.sha).blue(),
    ).join('\n');

    const embed = {
      title,
      fields: [
        this.createField('Ticket            Commit message', listMsg),
        this.createField('Author', listCommitter),
        this.createField('SHA', listSHA),
      ],
      footer: {
        text: `Commits from ${from.split('T')[0].replaceAll('-', '/')} to ${to
          .split('T')[0]
          .replaceAll('-', '/')}`,
      },
      color,
    };

    const cmd = {
      fields: [
        this.createField(
          'Command',
          'git cherry-pick ' + _.map(commit, 'sha').reverse().join(' '),
        ),
      ],
      color,
    };

    return [embed, cmd];
  }

  private colorize(str: string) {
    return {
      green: () => `[2;36m${str}[0m`,
      yellow: () => `[2;33m${str}[0m`,
      blue: () => `[2;34m${str}[0m`,
    };
  }

  private createField(name: string, value: string) {
    return {
      name,
      value: '```ansi\n' + value + '\n```',
      inline: true,
    };
  }

  private filterCommit(listIssue: string[], data: Commit[]) {
    const filtered = _.filter(data, (item) => {
      const issue = item.commit?.message.match(/#\d+/);

      return (
        item.committer?.login !== 'web-flow' &&
        issue &&
        _.includes(listIssue, issue[0].replace(/#/, ''))
      );
    }) as Commit[];

    const listCommit = _.map(filtered, (item) => {
      const task = item.commit?.message.match(/#\d+/)?.[0].replace(/#/, '');
      const message = item.commit?.message;
      const committer = item.committer?.login;
      const sha = item.sha.substring(0, 7);
      return {
        task,
        message,
        committer,
        sha,
      };
    });

    return listCommit;
  }

  private async getCommitData(
    repo: string,
    date: { minDate: string; maxDate: string },
  ) {
    const allData = [];
    let page = 1;
    let hasMoreData = true;
    const perPage = 100;

    while (hasMoreData) {
      const url = URIUtils.constructURLWithParams(
        githubUrl(this.env.OWNER, repo),
        {
          sha: 'develop',
          since: date.minDate,
          until: date.maxDate,
          per_page: perPage,
          page: page,
        },
      );

      const data = await this.http.get<Commit[]>(url, {
        headers: {
          ...commonHeaders(),
          Authorization: `Bearer ${this.env.GIT_TOKEN}`,
        },
      });

      allData.push(...data);

      hasMoreData = data.length === perPage;
      page++;
    }

    return allData;
  }
}
