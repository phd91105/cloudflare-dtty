import { Inject, Injectable, WORKER } from 'cloudflare-dtty';
import { DateUtils } from 'common/utils';
import { InteractionResponseType } from 'discord-interactions';
import compact from 'lodash/compact';
import flatMap from 'lodash/flatMap';
import isEmpty from 'lodash/isEmpty';
import isNil from 'lodash/isNil';
import map from 'lodash/map';
import split from 'lodash/split';
import trim from 'lodash/trim';
import { DiscordHelper } from './discord.helper';
import type { BotRequest } from './discord.model';

@Injectable()
export class SlashCommands {
  constructor(
    @Inject(WORKER) private worker: Worker,
    @Inject(DiscordHelper) private helper: DiscordHelper,
  ) {}

  async cherryPick(body: BotRequest) {
    const targetFile = body.data?.options[0]?.value;
    const fileUrl = body.data?.resolved?.attachments[targetFile]?.url;

    const { data } = await this.helper.getCsvData(fileUrl);

    const listIssue = map(data, '#');
    const listDate = flatMap(data, (o) => [o.Created, o.Updated]);
    const minMaxDate = DateUtils.findMinMaxDates(listDate);

    const repos = map(split(this.worker.env.REPOS, ','), trim);

    const commitsData = await this.helper.getCommitsDataForRepos(
      repos,
      minMaxDate,
      listIssue,
    );

    const embedList = flatMap(
      compact(
        map(commitsData, (commitData) => {
          if (!isNil(commitData) && !isEmpty(commitData.commits)) {
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
