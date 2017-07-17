const location = {
	'mailroom': [
		'面對櫃台右手邊走廊直走就到了',
		'/mailroom.png'
	],
	'WC': [
		'旁邊大門出去兩邊走廊都有喔',
		'/WC.png'
	],
	'water': [
		'飲水機和安全室在我右手邊往後走',
		'/water.png'
	],
	'security': [
		'飲水機和安全室在我右手邊往後走',
		'/security.png'
	],
	'C301': ['301會議室就位在你的後方唷'],
	'C302': ['往你右後方的門直走就到囉'],
	'C303': ['往你的左後方走就到囉'],
	'C304': ['我右手邊最大間的就是囉'],
	'C305': ['會議室就在你的左前方喔'],
	'C306': ['請往櫃台右側的方向直走，轉彎後第一道門進入，左轉直走就到囉'],
	'C308': ['往櫃台右側的方向直走，轉彎後第一間就是囉'],
	'C309': ['往櫃台右側的方向直走，轉彎後第二間就是囉'],
	'C310': ['往櫃台右側的方向直走，轉彎後第三間就是囉'],
	'C312': ['往你右後方的門直走，轉彎後就到囉'],
	'C313': ['往你右後方的門直走，轉彎後第二間就是囉'],
	'C314': ['往你右後方的門直走，轉彎後第三間就是囉'],
	'C401':	['請到四樓，進入門後牆上有IBM的那面，可以參考以下的地圖'],
	'C402': ['請到四樓，進入門後牆上有IBM的那面，可以參考以下的地圖'],
	'C403': ['請到四樓，進入門後牆上有IBM的那面，可以參考以下的地圖'],
	'C404': ['請到四樓，進入門後牆上有IBM的那面，可以參考以下的地圖'],
	'C405': ['請到四樓，進入門後牆上有IBM的那面，可以參考以下的地圖'],
	'C406': ['請到四樓，進入門後牆上有IBM的那面後，往右邊走就會看到囉'],
	'C407': ['請到四樓，進入門後牆上有IBM的那面就會看到囉'],
	'C408': ['請到四樓，進入門後牆上有IBM的那面就會看到囉'],
	'C409': ['請到四樓，進入門後牆上有IBM的那面，可以參考以下的地圖'],
	'C410': ['請到四樓，進入門後牆上有IBM的那面，可以參考以下的地圖'],
	'C411': ['請到四樓，進入門後牆上有IBM的那面，可以參考以下的地圖'],
	'C412': ['請到四樓，進入門後牆上有IBM的那面，往左手邊走就會看到囉'],
	'C413': ['請到四樓，進入門後牆上有IBM的那面，往左手邊走就會看到囉'],
	'C414': ['請到四樓，進入門後牆上有IBM的那面，往左手邊走就會看到囉'],
	'C415': ['請到四樓，從南區的入口進入，往右側走就會看到囉'],
	'C416': ['請到四樓，從南區的入口進入就會看到囉!'],
	'C417': ['請到四樓，從南區的入口進入，往左側走就會看到囉'],
	'3399': ['請到四樓，從員工休息區的門口進入，左前方的門進去直走', '/4f.jpg'],
	'C418': ['請到四樓，從員工休息區的門口進入，請參考以下的地圖'],
	'C419': ['請到四樓，從員工休息區的門口進入，往左側直走就會看到囉'],
	'C420': ['請到四樓，從員工休息區的門口進入，往左側直走就會看到囉'],
	'C421': ['請到四樓，從員工休息區的門口進入，往左側直走就會看到囉'],
	'C422': ['請到四樓，從北區的入口進入後，往右側走就會看到囉'],
	'C423': ['請到四樓，從北區的入口進入就會看到囉'],
	'C424': ['請到四樓，從北區的入口進入後，往左側走就會看到囉'],
	'none': [
		'我沒去過那裡呢，參考一下樓層圖或問櫃台姐姐吧',
		'/3f.png'
	]
}
	
module.exports = place => {
	const l = location[place] || location['none']
	return {
		speech: l[0],
		media: l[1] || '/'+place+'.png'
	}
}