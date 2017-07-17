const placemap = require('./placemap')
const stockname = require('./tw_stockname.json')
const ENstock = stock => {
	let s = stock.toLowerCase()
	if (s.indexOf('international business machine') > -1)
		return 'IBM'
	else if (s.indexOf('microsoft') > -1)
		return '微軟'
	else if (s.indexOf('amazon') > -1)
		return '亞馬遜'
	else if (s.indexOf('alphabet') > -1)
		return '谷歌'
	else if (s.indexOf('facebook') > -1)
		return 'facebook'
	else if (s.indexOf('tesla') > -1)
		return '特斯拉'
	else return stock
}
module.exports = payload => {
	const { prev, type, data } = payload
	let speech = ''
	let media = null

	switch (type) {
		case 'websearch':
			speech = data.result
			break
		case 'weather':
			speech = data.weather[0].narrative.replace(/ºC/gi,'度')
			media = data.weather[0].imageUrl
			break
		case 'stock':
			const stockCode = data.stock.split(':')
			console.log(stockCode)
			const name = stockCode[0] === 'TPE'? stockname[stockCode[1]]
				: ENstock(data.name)
			const l = data.info.l
			const c = data.info.c
			speech = name+'股價為'+l+'元，'+'本日變化為'+c+'元'
			break
		case 'travel':
			speech = '看看這些地方吧：' + data.places.map(
				p => p.name
			).join('，')
			break
		case 'movie':
			speech = '最近有這些電影：' + data.movies.map(
				m => m.original_title
			).slice(0,3).join('，')
			break
		case 'news':
		console.log('here	')
			speech = '我找到今天新聞：' + data.news.map( n => {

				console.log(n.name)
				return n.title.split(' - ')[0]
			}).slice(0,2).join('，')

			console.log(speech)
			break
		case 'restaurant':
			speech = '我找到一些餐廳：'+data.restaurants.map( r => {
				return r.name
			}).slice(0,3).join('，')
			break
		case 'location':
			if (data.location === 'reception') {
				const p = placemap(data.map)
				speech = p.speech
				media = p.media
			} else {
				speech = '參考一下地圖'
				media = data.map
			}
			break
		case 'review':
			speech = null
			break
		case 'hsr':
			speech = data.hsr
			break
		case 'text':
		default:
			speech = (data.text)?data.text: 'nulltext'
			break
	}
	return {
		speech: speech,
		media: media
	}
}