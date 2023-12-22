import { IsNotEmpty, IsNumber, IsOptional } from 'class-validator';
import type { InteractionType } from 'discord-interactions';

export class BotRequest {
  @IsNotEmpty()
  @IsNumber()
  type: InteractionType;

  @IsOptional()
  data?: any;
}

export type CommitArray = Commit[];

type GitUser = {
  name: string | null;
  email: string | null;
  date?: string;
};

type SimpleUser = {
  name: string | null;
  email: string | null;
  login: string;
  id: number;
  node_id: string;
  avatar_url: string;
  gravatar_id: string | null;
  url: string;
  html_url: string;
  followers_url: string;
  following_url: string;
  gists_url: string;
  starred_url: string;
  subscriptions_url: string;
  organizations_url: string;
  repos_url: string;
  events_url: string;
  received_events_url: string;
  type: string;
  site_admin: boolean;
  starred_at?: string;
};

type CommitTree = {
  sha: string;
  url: string;
};

type Verification = {
  verified: boolean;
  reason: string;
  payload: string | null;
  signature: string | null;
};

type CommitData = {
  url: string;
  author: GitUser | null;
  committer: GitUser | null;
  comment_count: number;
  message: string;
  tree: CommitTree;
  verification: Verification;
};

type Parent = {
  sha: string;
  url: string;
  html_url: string;
};

type Stats = {
  additions: number;
  deletions: number;
  total: number;
};

type DiffEntry = {
  sha: string;
  filename: string;
  status:
    | 'added'
    | 'removed'
    | 'modified'
    | 'renamed'
    | 'copied'
    | 'changed'
    | 'unchanged';
  additions: number;
  deletions: number;
  changes: number;
  blob_url: string;
  raw_url: string;
  contents_url: string;
  patch?: string;
  previous_filename?: string;
};

type Commit = {
  url: string;
  sha: string;
  node_id: string;
  html_url: string;
  comments_url: string;
  commit: CommitData;
  author: SimpleUser;
  committer: SimpleUser;
  parents: Parent[];
  stats?: Stats;
  files?: DiffEntry[];
};
