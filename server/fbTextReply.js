const stockname = require('./tw_stockname.json')

module.exports = payload => {
	const { prev, type, data } = payload
	let speech = ''
	let media = null

	switch (type) {
		case 'websearch':
			speech = data.result
			break
		case 'weather':
			speech = data.weather[0].narrative.replace('ºC','度')
			media = data.weather[0].imageUrl
			break
		case 'stock':
			const stockCode = data.stock.split(':')
			console.log(stockCode)
			const name = stockCode[0] === 'TPE'? stockname[stockCode[1]]
				: data.name
			const l = data.info.l
			const c = data.info.c
			speech = name+'股價為'+l+'元，'+'本日變化為'+c+'元'
			break
		case 'travel':
			speech = data.places.map(
				p => p.name
			).join('，')
			break
		case 'movie':
			speech = data.movies.map(
				m => m.original_title
			).slice(0,3).join('，')
			break
		case 'news':
			speech = data.news.map( n => {
				return n.title.split(' - ')[0]
			}).slice(0,3).join('，')
			break
		case 'restaurant':
			speech = data.restaurants.map( r => {
				return r.name
			}).slice(0,3).join('，')
			break
		case 'location':
			if (data.location === 'reception') {
				switch(data.map) {
					case 'mailroom':
						speech = '面對櫃台右手邊走廊直走就到了'
						media = '/floor.jpg'
						break
					case 'WC':
						speech = '旁邊大門出去兩邊走廊都有喔'
						media = '/WC.jpg'
						break
					case 'water':
					case 'security':
						speech = '飲水機和安全室在我右手邊往後走'
						media = '/floor.jpg'
						break
					case 'none':
						speech = '我沒去過那裡呢，參考一下樓層圖或問櫃台姐姐吧'
						media = '/floor.jpg'
						break
					default:
						speech = '參考地圖，走道牆上也有樓層圖和標示呦'
						media = '/'+data.map+'.jpg'
				}
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