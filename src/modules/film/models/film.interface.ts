export interface FilmResponse {
  status: string;
  data?: Array<{
    id: string;
    image: string;
    title: string;
    links: Array<{
      title: string;
      link: string;
    }>;
  }>;
}
