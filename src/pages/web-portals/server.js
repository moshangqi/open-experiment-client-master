import request from '@/utils/request';

export const reqAchievementShowList = () => {
  return request('/homePage/getTopPublishedAchievementShowList')
}

export const reqHomePageNewsList = () => {
  return request('/homePage/getHomePageNewsList')
}

export const reqAnnouncementList = () => {
  return request('/homePage/getHomePageAnnouncementList')
}

export const reqAchievementList = () => {
  return request('/homePage/getPublishedAchievementShowList')
}