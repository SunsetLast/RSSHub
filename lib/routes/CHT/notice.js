const got = require('@/utils/got');
const cheerio = require('cheerio');

module.exports = async (ctx) => {
    const url = 'https://search.hinet.net/getNotify?callback=jsonpCallback&type=0&sort=0&mobile=1';
    const response = await got({
        method: 'get',
        url: url,
    });
    const data = response.data;
    const $ = cheerio.load(data);

    const list = $('.list_no ul')
        .map((index, item) => {
			item1 = $(item).find('.p1')
            item2 = $(item).find('.p2 a');
            return {
				pubtime: new Date(item1.text()),
                title: item2.text(),
                truelink: item2.attr('href'),
				datalink: item2.attr('href').toString().replace(new RegExp('www.hinet.net/notifyPage.html', 'g'), "search.hinet.net/getNotifyPage?callback=jsonpCallback").replace(/\?id/g,"&id").replace(/&type=0/g,""),
            };
        })
        .get();
		
    const items = await Promise.all(
        [...list].map(async ({ title, truelink, datalink, pubtime }) => {
            const item = {
                title: title,
                link: truelink,
				pubDate: pubtime.toUTCString(),
            };
			
            const response = await got({
                method: 'get',
                url: datalink,
            });
            const $ = cheerio.load(response.data);
            item.description = $('ul li:nth-child(4)').html();
            return Promise.resolve(item);
        })
    );
	
    ctx.state.data = {
        title: `Chunghwa Telecom Notice`,
		link: `https://www.hinet.net/notify.html?type=0`,
        item: items,
    };
};