export type ArticleProps = {
  id: string,
  attachments: string[],
  title: string,
  categories: string[],
  name: string,
  gender: string,
  birthday: number,
  homePlace: {
    province: string,
    city: string,
    area: string,
  },
  jobs: string[],
  marriage: string,
  children: string,
  events: {
    text: string
  }[],
  knowledge: string,
  notes: {
    text: string
  }[],
  createdAt: number
};
