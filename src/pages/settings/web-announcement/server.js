import request from '@/utils/request';

// urls 1公告 2新闻 2项目展示

export const reqPublishSave = (params) => {

  const urls = [,'/homePage/homePagePublishAnnouncement', '/homePage/homePagePublishNews', '/homePage/publishAchievementShow']
  return request(urls[params.type],{
    method: "POST",
    data: params
  })
}


export const reqGetAll = (params) => {
  const urls = [, '/homePage/getAllAnnouncementList', '/homePage/getAllNewsList', '/homePage/getAllAchievementShowList']
  return request(urls[params.type], {
    method: 'GET'
  })
}


export const reqDeleteOne = (params) => {
  const urls = [,'/homePage/deleteAnnouncementById','/homePage/deleteNewsById','/homePage/deleteAchievementById']
  return request(urls[params.type], {
    method: 'POST',
    data: {
      id : params.id
    }
  })
}


export const reqGetOnePassage = (params) => {
  const urls = [,'/homePage/getAnnouncementById','/homePage/getNewsById', '/homePage/getAchievementById']
  return request(urls[params.type], {
    method: 'POST',
    data: {
      id: params.id
    }
  })
}


export const reqChangeStatus = (params) => {
  const urls = [,
    [,'/homePage/updateAnnouncementToSave','/homePage/updateAnnouncementToPublished'],
    [,'/homePage/updateToSave','/homePage/updateToPublished'],
    [,'/homePage/updateAchievementToSave','/homePage/updateAchievementToPublished']
  ]
  return request(urls[params.type][params.status], {
    method: 'POST',
    data: {
      id: params.id
    }
  })
}

export const reqUpdatePassage = (params) => {
  const urls = [, '/homePage/updateAnnouncementContent' ,'/homePage/updateNewsContent', '/homePage/updateAchievementContent']
  return request(urls[params.type], {
    method:"POST",
    data: params
  })
}

export const reqChangeShow = (params) => {
  return request('/homePage/deleteAchievementTopById', {
    method: 'POST',
    data: params
  })
}

// export const 
// export const reqPublish = (params) => {
//   const urls = [,'']
// }