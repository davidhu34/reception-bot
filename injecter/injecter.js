var list = [
	'你好','神經病'
];
$("#list").append(
	list.map( function (line) {
		return '<button type="button" class="line btn btn-primary">'+line+'</button><br>';
	})
).children().click( function () {
	$.post( 'https://receptionbot.mybluemix.net/line', {line: $(this).text()});
});

$('#customsend').click( function () {
	var val = $('#custom').val();
	if (val) $.post( 'https://receptionbot.mybluemix.net/line', {line: val});
});