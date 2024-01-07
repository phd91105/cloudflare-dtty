import { DateUtils } from 'common/utils';
import { Inject, Injectable } from 'dtty-extra';
import _ from 'lodash';

import { Environment } from 'core/providers';
import { InteractionResponseType } from 'discord-interactions';
import { DiscordHelper } from './discord.helper';
import type { BotRequest } from './discord.model';

@Injectable()
export class SlashCommands {
  constructor(
    @Inject(Environment) private env: Env,
    @Inject(DiscordHelper) private helper: DiscordHelper,
  ) {}

  async cherryPick(body: BotRequest) {
    const targetFile = _.first<obj>(body.data?.options)?.value;
    const fileUrl = body.data?.resolved?.attachments[targetFile]?.url;
    const { data } = await this.helper.getCsvData(fileUrl);

    const listIssue = _.map(data, '#');
    const listDate = _.flatMap(data, (o) => [o.Created, o.Updated]);
    const minMaxDate = DateUtils.findMinMaxDates(listDate);
    const repos = _.map(_.split(this.env.REPOS, ','), _.trim);

    const commitsData = await this.helper.getCommitsDataForRepos(
      repos,
      minMaxDate,
      listIssue,
    );

    const embedList = _.flatMap(
      _.compact(
        _.map(commitsData, (commitData) => {
          if (!_.isNil(commitData) && !_.isEmpty(commitData.commits)) {
            return this.helper.createEmbed(
              commitData.repo,
              commitData.commits,
              commitData.from,
              commitData.to,
              commitData.color,
            );
          }
        }),
      ),
    );

    return {
      type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
      data: {
        content: null,
        embeds: embedList,
      },
    };
  }
}
